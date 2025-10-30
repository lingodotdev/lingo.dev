import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { ResourceManager } from "./resource-manager";
import { ResourceLimits, PerformanceMetrics } from "./performance-monitor";

describe("ResourceManager", () => {
  let resourceManager: ResourceManager;
  let mockLimits: ResourceLimits;

  beforeEach(() => {
    mockLimits = {
      maxMemoryUsage: 0.8,
      maxWatchedFiles: 100,
      maxConcurrentOperations: 5,
      rateLimitDelay: 100,
      batchSize: 10,
    };

    resourceManager = new ResourceManager(mockLimits, {
      maxOperationsPerSecond: 5,
      maxOperationsPerMinute: 100,
      burstLimit: 10,
      windowSizeMs: 1000,
    });
  });

  afterEach(() => {
    resourceManager.shutdown();
    vi.clearAllMocks();
  });

  describe("Operation Execution", () => {
    it("should execute operations immediately when under limits", async () => {
      const mockOperation = vi.fn().mockResolvedValue("success");

      const result = await resourceManager.executeOperation(mockOperation);

      expect(result).toBe("success");
      expect(mockOperation).toHaveBeenCalledOnce();
    });

    it("should queue operations when at concurrent limit", async () => {
      const slowOperations = Array.from({ length: 6 }, (_, i) =>
        vi
          .fn()
          .mockImplementation(
            () =>
              new Promise((resolve) =>
                setTimeout(() => resolve(`result-${i}`), 100),
              ),
          ),
      );

      // Start all operations
      const promises = slowOperations.map((op) =>
        resourceManager.executeOperation(op),
      );

      // Wait a bit to let the queue processor work
      await new Promise((resolve) => setTimeout(resolve, 50));

      const stats = resourceManager.getQueueStatistics();
      expect(stats.activeOperations).toBeLessThanOrEqual(
        mockLimits.maxConcurrentOperations,
      );
      expect(stats.queueSize).toBeGreaterThan(0);

      // Wait for all to complete
      const results = await Promise.all(promises);
      expect(results).toHaveLength(6);
    });

    it("should handle operation failures gracefully", async () => {
      const failingOperation = vi
        .fn()
        .mockRejectedValue(new Error("Operation failed"));

      await expect(
        resourceManager.executeOperation(failingOperation),
      ).rejects.toThrow("Operation failed");
      expect(failingOperation).toHaveBeenCalledOnce();
    });

    it("should respect operation priorities", async () => {
      const executionOrder: number[] = [];

      // Create operations that record their execution order
      const createOperation = (id: number) =>
        vi.fn().mockImplementation(async () => {
          executionOrder.push(id);
          await new Promise((resolve) => setTimeout(resolve, 10));
          return `result-${id}`;
        });

      // Fill up the concurrent slots with slow operations
      const blockingOperations = Array.from({ length: 5 }, () =>
        vi
          .fn()
          .mockImplementation(
            () => new Promise((resolve) => setTimeout(resolve, 200)),
          ),
      );

      const blockingPromises = blockingOperations.map((op) =>
        resourceManager.executeOperation(op),
      );

      // Queue operations with different priorities
      const lowPriorityOp = createOperation(1);
      const highPriorityOp = createOperation(2);
      const mediumPriorityOp = createOperation(3);

      const queuedPromises = [
        resourceManager.executeOperation(lowPriorityOp, 0), // Low priority
        resourceManager.executeOperation(highPriorityOp, 10), // High priority
        resourceManager.executeOperation(mediumPriorityOp, 5), // Medium priority
      ];

      // Wait for all operations to complete
      await Promise.all([...blockingPromises, ...queuedPromises]);

      // High priority should execute first, then medium, then low
      expect(executionOrder).toEqual([2, 3, 1]);
    });
  });

  describe("Batch Execution", () => {
    it("should execute operations in batches", async () => {
      const operations = Array.from({ length: 25 }, (_, i) =>
        vi.fn().mockResolvedValue(`result-${i}`),
      );

      const results = await resourceManager.executeBatch(operations, 5);

      expect(results).toHaveLength(25);
      expect(results).toEqual(
        Array.from({ length: 25 }, (_, i) => `result-${i}`),
      );

      // All operations should have been called
      operations.forEach((op) => expect(op).toHaveBeenCalledOnce());
    });

    it("should handle batch failures", async () => {
      const operations = [
        vi.fn().mockResolvedValue("success1"),
        vi.fn().mockRejectedValue(new Error("Batch failure")),
        vi.fn().mockResolvedValue("success3"),
      ];

      await expect(resourceManager.executeBatch(operations, 2)).rejects.toThrow(
        "Batch failure",
      );
    });

    it("should add delays between batches", async () => {
      const operations = Array.from({ length: 15 }, (_, i) =>
        vi.fn().mockResolvedValue(`result-${i}`),
      );

      const startTime = Date.now();
      await resourceManager.executeBatch(operations, 5);
      const endTime = Date.now();

      // Should have taken at least 2 * rateLimitDelay (2 delays between 3 batches)
      expect(endTime - startTime).toBeGreaterThanOrEqual(
        2 * mockLimits.rateLimitDelay,
      );
    });
  });

  describe("Rate Limiting", () => {
    it("should enforce per-second rate limits", async () => {
      const operations = Array.from({ length: 10 }, (_, i) =>
        vi.fn().mockResolvedValue(`result-${i}`),
      );

      const startTime = Date.now();
      const promises = operations.map((op) =>
        resourceManager.executeOperation(op),
      );

      // Some operations should be queued due to rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));

      const stats = resourceManager.getQueueStatistics();
      expect(stats.queueSize).toBeGreaterThan(0);

      await Promise.all(promises);
    });

    it("should track operation history for rate limiting", async () => {
      const operation = vi.fn().mockResolvedValue("success");

      await resourceManager.executeOperation(operation);
      await resourceManager.executeOperation(operation);

      const stats = resourceManager.getQueueStatistics();
      expect(stats.operationsPerSecond).toBeGreaterThan(0);
    });
  });

  describe("Resource Usage Tracking", () => {
    it("should track resource usage", () => {
      const initialUsage = resourceManager.getResourceUsage();

      expect(initialUsage.activeOperations).toBe(0);
      expect(initialUsage.queuedOperations).toBe(0);
      expect(initialUsage.totalOperations).toBe(0);
      expect(initialUsage.memoryUsage).toBe(0);
      expect(initialUsage.fileHandles).toBe(0);
    });

    it("should update resource usage from performance metrics", () => {
      const mockMetrics: PerformanceMetrics = {
        memory: {
          heapUsed: 50 * 1024 * 1024,
          heapTotal: 100 * 1024 * 1024,
          external: 10 * 1024 * 1024,
          rss: 200 * 1024 * 1024,
          usagePercentage: 60,
          arrayBuffers: 0,
        },
        cpu: {
          userTime: 100000,
          systemTime: 50000,
          totalTime: 150000,
          usagePercentage: 15,
        },
        fileSystem: {
          watchedFiles: 50,
          openFileDescriptors: 100,
          fileOperationsPerSecond: 10,
          averageFileSize: 1024,
        },
        watch: {
          totalChanges: 10,
          changesPerMinute: 5,
          averageDebounceTime: 1000,
          retranslationCount: 3,
          averageRetranslationTime: 2000,
          errorRate: 0.1,
        },
        timestamp: new Date(),
      };

      resourceManager.updateResourceUsage(mockMetrics);

      const usage = resourceManager.getResourceUsage();
      expect(usage.memoryUsage).toBe(0.6);
      expect(usage.fileHandles).toBe(100);
    });
  });

  describe("Queue Management", () => {
    it("should provide queue statistics", async () => {
      const slowOperation = vi
        .fn()
        .mockImplementation(
          () => new Promise((resolve) => setTimeout(resolve, 100)),
        );

      // Fill up concurrent slots and queue more operations
      const promises = Array.from({ length: 8 }, () =>
        resourceManager.executeOperation(slowOperation),
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const stats = resourceManager.getQueueStatistics();
      expect(stats.activeOperations).toBeGreaterThan(0);
      expect(stats.queueSize).toBeGreaterThan(0);
      expect(stats.totalOperations).toBeGreaterThan(0);
      expect(stats.averageQueueTime).toBeGreaterThanOrEqual(0);

      await Promise.all(promises);
    });

    it("should clear the queue", async () => {
      const slowOperation = vi
        .fn()
        .mockImplementation(
          () => new Promise((resolve) => setTimeout(resolve, 200)),
        );

      // Fill up concurrent slots and queue operations
      const promises = Array.from({ length: 8 }, () =>
        resourceManager.executeOperation(slowOperation),
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const statsBefore = resourceManager.getQueueStatistics();
      expect(statsBefore.queueSize).toBeGreaterThan(0);

      resourceManager.clearQueue();

      const statsAfter = resourceManager.getQueueStatistics();
      expect(statsAfter.queueSize).toBe(0);

      // Some promises should be rejected due to queue clearing
      const results = await Promise.allSettled(promises);
      const rejectedCount = results.filter(
        (r) => r.status === "rejected",
      ).length;
      expect(rejectedCount).toBeGreaterThan(0);
    });
  });

  describe("Resource Pressure Detection", () => {
    it("should detect resource pressure", () => {
      expect(resourceManager.isUnderResourcePressure()).toBe(false);

      // Simulate high memory usage
      const highMemoryMetrics: PerformanceMetrics = {
        memory: {
          heapUsed: 90 * 1024 * 1024,
          heapTotal: 100 * 1024 * 1024,
          external: 10 * 1024 * 1024,
          rss: 200 * 1024 * 1024,
          usagePercentage: 90,
          arrayBuffers: 0,
        },
        cpu: { userTime: 0, systemTime: 0, totalTime: 0, usagePercentage: 0 },
        fileSystem: {
          watchedFiles: 0,
          openFileDescriptors: 0,
          fileOperationsPerSecond: 0,
          averageFileSize: 0,
        },
        watch: {
          totalChanges: 0,
          changesPerMinute: 0,
          averageDebounceTime: 0,
          retranslationCount: 0,
          averageRetranslationTime: 0,
          errorRate: 0,
        },
        timestamp: new Date(),
      };

      resourceManager.updateResourceUsage(highMemoryMetrics);
      expect(resourceManager.isUnderResourcePressure()).toBe(true);
    });
  });

  describe("Configuration Updates", () => {
    it("should update resource limits", () => {
      const newLimits: Partial<ResourceLimits> = {
        maxConcurrentOperations: 20,
        batchSize: 25,
      };

      resourceManager.updateResourceLimits(newLimits);

      const updatedLimits = resourceManager.getResourceLimits();
      expect(updatedLimits.maxConcurrentOperations).toBe(20);
      expect(updatedLimits.batchSize).toBe(25);
      expect(updatedLimits.maxMemoryUsage).toBe(0.8); // Should preserve other values
    });

    it("should update rate limit configuration", () => {
      const newRateConfig = {
        maxOperationsPerSecond: 20,
        burstLimit: 30,
      };

      resourceManager.updateRateLimitConfig(newRateConfig);

      const updatedConfig = resourceManager.getRateLimitConfig();
      expect(updatedConfig.maxOperationsPerSecond).toBe(20);
      expect(updatedConfig.burstLimit).toBe(30);
    });
  });

  describe("Event Emission", () => {
    it("should emit operation events", async () => {
      const operationStartedSpy = vi.fn();
      const operationCompletedSpy = vi.fn();
      const operationQueuedSpy = vi.fn();

      resourceManager.on("operationStarted", operationStartedSpy);
      resourceManager.on("operationCompleted", operationCompletedSpy);
      resourceManager.on("operationQueued", operationQueuedSpy);

      const operation = vi.fn().mockResolvedValue("success");
      await resourceManager.executeOperation(operation);

      expect(operationStartedSpy).toHaveBeenCalled();
      expect(operationCompletedSpy).toHaveBeenCalled();
    });

    it("should emit resource usage updates", () => {
      const resourceUsageUpdatedSpy = vi.fn();
      resourceManager.on("resourceUsageUpdated", resourceUsageUpdatedSpy);

      const mockMetrics: PerformanceMetrics = {
        memory: {
          heapUsed: 0,
          heapTotal: 0,
          external: 0,
          rss: 0,
          usagePercentage: 50,
          arrayBuffers: 0,
        },
        cpu: { userTime: 0, systemTime: 0, totalTime: 0, usagePercentage: 0 },
        fileSystem: {
          watchedFiles: 0,
          openFileDescriptors: 0,
          fileOperationsPerSecond: 0,
          averageFileSize: 0,
        },
        watch: {
          totalChanges: 0,
          changesPerMinute: 0,
          averageDebounceTime: 0,
          retranslationCount: 0,
          averageRetranslationTime: 0,
          errorRate: 0,
        },
        timestamp: new Date(),
      };

      resourceManager.updateResourceUsage(mockMetrics);
      expect(resourceUsageUpdatedSpy).toHaveBeenCalled();
    });
  });

  describe("Garbage Collection", () => {
    it("should force garbage collection when available", () => {
      const mockGc = vi.fn();
      vi.stubGlobal("global", { ...global, gc: mockGc });

      resourceManager.forceGarbageCollection();
      expect(mockGc).toHaveBeenCalled();

      vi.unstubAllGlobals();
    });

    it("should handle missing garbage collection gracefully", () => {
      vi.stubGlobal("global", { ...global, gc: undefined });

      expect(() => resourceManager.forceGarbageCollection()).not.toThrow();

      vi.unstubAllGlobals();
    });
  });

  describe("Shutdown", () => {
    it("should shutdown gracefully", () => {
      const shutdownSpy = vi.fn();
      resourceManager.on("shutdown", shutdownSpy);

      resourceManager.shutdown();
      expect(shutdownSpy).toHaveBeenCalled();

      const stats = resourceManager.getQueueStatistics();
      expect(stats.queueSize).toBe(0);
      expect(stats.activeOperations).toBe(0);
    });

    it("should handle multiple shutdown calls", () => {
      expect(() => {
        resourceManager.shutdown();
        resourceManager.shutdown();
      }).not.toThrow();
    });
  });
});

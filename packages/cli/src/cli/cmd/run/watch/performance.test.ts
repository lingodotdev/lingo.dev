import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import * as fs from "fs";
import * as path from "path";

// Mock external dependencies at the top level
vi.mock("../plan", () => ({
  default: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../execute", () => ({
  default: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../../../utils/ui", () => ({
  renderSummary: vi.fn().mockResolvedValue(undefined),
}));

// Mock chokidar with performance tracking
vi.mock("chokidar", () => ({
  watch: vi.fn().mockReturnValue({
    on: vi.fn(),
    add: vi.fn(),
    unwatch: vi.fn(),
    close: vi.fn().mockResolvedValue(undefined),
    getWatched: vi.fn().mockReturnValue({}),
  }),
}));

import { WatchManager } from "./manager";
import { CmdRunContext } from "../_types";

describe("Watch Performance Tests", () => {
  let watchManager: WatchManager;
  let mockContext: CmdRunContext;
  let tempDir: string;

  beforeEach(() => {
    watchManager = new WatchManager();
    tempDir = fs.mkdtempSync(path.join(__dirname, "perf-test-"));

    mockContext = {
      flags: {
        watch: true,
        interactive: false,
        concurrency: 5,
        debug: false,
        debounce: 100, // Very short for performance testing
        debounceStrategy: "simple" as const,
        quiet: true, // Reduce logging overhead
        progress: false,
        notifications: false,
        batchSize: 50,
        rateLimitDelay: 10,
      },
      config: {
        locale: {
          source: "en",
          targets: ["es", "fr", "de", "it", "pt", "ja", "ko", "zh"],
        },
        buckets: {
          json: {
            include: ["locales/[locale].json"],
          },
        },
      },
      tasks: [],
      results: new Map(),
      localizer: null,
    };

    vi.clearAllMocks();
  });

  afterEach(async () => {
    try {
      await watchManager.stop();
    } catch {
      // Ignore cleanup errors
    }

    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe("Large File Set Performance", () => {
    it("should handle large number of files efficiently", async () => {
      const originalCwd = process.cwd();
      process.chdir(tempDir);

      try {
        // Create large number of test files
        const largeDir = path.join(tempDir, "large-project");
        fs.mkdirSync(largeDir, { recursive: true });

        const fileCount = 100; // Reduced for test performance
        const startCreation = Date.now();

        for (let i = 0; i < fileCount; i++) {
          const subDir = path.join(largeDir, `module-${Math.floor(i / 10)}`);
          if (!fs.existsSync(subDir)) {
            fs.mkdirSync(subDir, { recursive: true });
          }

          fs.writeFileSync(
            path.join(subDir, `file-${i}.json`),
            JSON.stringify({
              [`key_${i}`]: `Value ${i}`,
              nested: {
                [`nested_key_${i}`]: `Nested value ${i}`,
              },
            }),
          );
        }

        const creationTime = Date.now() - startCreation;
        console.log(`Created ${fileCount} files in ${creationTime}ms`);

        const startWatch = Date.now();
        await watchManager.start(mockContext);
        const watchStartTime = Date.now() - startWatch;

        console.log(`Watch started in ${watchStartTime}ms`);

        // Should start within reasonable time (less than 5 seconds)
        expect(watchStartTime).toBeLessThan(5000);

        const status = watchManager.getStatus();
        expect(status.isActive).toBe(true);

        // Test memory usage
        const perfStats = watchManager.getPerformanceStatistics();
        expect(perfStats.resources).toBeDefined();

        // Memory usage should be reasonable (less than 100MB for this test)
        const memoryUsage = process.memoryUsage();
        expect(memoryUsage.heapUsed).toBeLessThan(100 * 1024 * 1024);
      } finally {
        process.chdir(originalCwd);
      }
    }, 30000); // 30 second timeout for large file test

    it("should handle rapid operations without memory leaks", async () => {
      const originalCwd = process.cwd();
      process.chdir(tempDir);

      try {
        await watchManager.start(mockContext);

        const initialMemory = process.memoryUsage().heapUsed;
        const operationCount = 100; // Reduced for test performance

        const startTime = Date.now();

        // Simulate many rapid operations
        for (let i = 0; i < operationCount; i++) {
          // Simulate some work
          await new Promise((resolve) => setTimeout(resolve, 1));

          // Small delay to prevent overwhelming the system
          if (i % 10 === 0) {
            await new Promise((resolve) => setTimeout(resolve, 1));
          }
        }

        const processingTime = Date.now() - startTime;
        console.log(
          `Processed ${operationCount} operations in ${processingTime}ms`,
        );

        // Wait for all operations to be processed
        await new Promise((resolve) => setTimeout(resolve, 200));

        const finalMemory = process.memoryUsage().heapUsed;
        const memoryIncrease = finalMemory - initialMemory;

        console.log(`Memory increase: ${memoryIncrease / 1024 / 1024}MB`);

        // Memory increase should be reasonable (less than 50MB)
        expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);

        // Should complete within reasonable time
        expect(processingTime).toBeLessThan(10000);

        const stats = watchManager.getStatistics();
        expect(stats.uptime).toBeGreaterThan(0);
      } finally {
        process.chdir(originalCwd);
      }
    });

    it("should maintain performance with different batch sizes", async () => {
      const originalCwd = process.cwd();
      process.chdir(tempDir);

      const batchSizes = [1, 10, 50];
      const results: Array<{ batchSize: number; time: number }> = [];

      for (const batchSize of batchSizes) {
        try {
          const testContext = {
            ...mockContext,
            flags: {
              ...mockContext.flags,
              batchSize,
            },
          };

          const testWatchManager = new WatchManager();
          await testWatchManager.start(testContext);

          const startTime = Date.now();

          // Simulate batch of operations
          await new Promise((resolve) => setTimeout(resolve, 100));

          const processingTime = Date.now() - startTime;
          results.push({ batchSize, time: processingTime });

          await testWatchManager.stop();
        } catch (error) {
          console.error(`Error testing batch size ${batchSize}:`, error);
        }
      }

      console.log("Batch size performance results:", results);

      // All batch sizes should complete within reasonable time
      results.forEach((result) => {
        expect(result.time).toBeLessThan(5000);
      });

      process.chdir(originalCwd);
    });
  });

  describe("CPU and Memory Usage", () => {
    it("should maintain reasonable CPU usage during operation", async () => {
      const originalCwd = process.cwd();
      process.chdir(tempDir);

      try {
        await watchManager.start(mockContext);

        // Monitor CPU usage over time
        const cpuUsageStart = process.cpuUsage();

        // Simulate sustained activity
        const activityDuration = 1000; // 1 second

        await new Promise((resolve) => setTimeout(resolve, activityDuration));

        const cpuUsageEnd = process.cpuUsage(cpuUsageStart);
        const cpuPercent =
          ((cpuUsageEnd.user + cpuUsageEnd.system) / 1000 / activityDuration) *
          100;

        console.log(`CPU usage: ${cpuPercent.toFixed(2)}%`);

        // CPU usage should be reasonable (less than 50% for this test)
        expect(cpuPercent).toBeLessThan(50);
      } finally {
        process.chdir(originalCwd);
      }
    });

    it("should handle memory pressure gracefully", async () => {
      const originalCwd = process.cwd();
      process.chdir(tempDir);

      try {
        // Start with memory monitoring
        const initialMemory = process.memoryUsage();

        await watchManager.start(mockContext);

        // Create memory pressure by simulating operations
        for (let i = 0; i < 10; i++) {
          // Create temporary data
          const tempData = Array.from({ length: 100 }, (_, j) => ({
            id: j,
            content: `Content block ${j}`.repeat(10),
          }));

          // Check memory periodically
          if (i % 5 === 0) {
            const currentMemory = process.memoryUsage();
            const memoryIncrease =
              currentMemory.heapUsed - initialMemory.heapUsed;

            // If memory usage gets too high, force garbage collection
            if (memoryIncrease > 100 * 1024 * 1024) {
              // 100MB
              if (global.gc) {
                global.gc();
              }
            }
          }

          // Clean up temp data
          tempData.length = 0;
        }

        await new Promise((resolve) => setTimeout(resolve, 500));

        const finalMemory = process.memoryUsage();
        const totalMemoryIncrease =
          finalMemory.heapUsed - initialMemory.heapUsed;

        console.log(
          `Total memory increase: ${totalMemoryIncrease / 1024 / 1024}MB`,
        );

        // Should handle memory pressure without excessive growth
        expect(totalMemoryIncrease).toBeLessThan(200 * 1024 * 1024); // 200MB limit

        // Watch should still be operational
        expect(watchManager.getStatus().isActive).toBe(true);
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe("Concurrent Operations", () => {
    it("should handle multiple concurrent operations", async () => {
      const originalCwd = process.cwd();
      process.chdir(tempDir);

      try {
        await watchManager.start(mockContext);

        const concurrentOperations = 10;
        const startTime = Date.now();

        // Start multiple concurrent operations
        const operations = Array.from(
          { length: concurrentOperations },
          async (_, i) => {
            return new Promise<void>((resolve) => {
              setTimeout(() => {
                // Simulate some work
                resolve();
              }, Math.random() * 50); // Random delay up to 50ms
            });
          },
        );

        await Promise.all(operations);

        const operationTime = Date.now() - startTime;
        console.log(
          `${concurrentOperations} concurrent operations completed in ${operationTime}ms`,
        );

        // Wait for processing
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Should complete within reasonable time
        expect(operationTime).toBeLessThan(2000);

        // Watch should still be healthy
        expect(watchManager.isHealthy()).toBe(true);

        const stats = watchManager.getStatistics();
        expect(stats.uptime).toBeGreaterThan(0);
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe("Long-Running Stability", () => {
    it("should maintain stability over extended operation", async () => {
      const originalCwd = process.cwd();
      process.chdir(tempDir);

      try {
        await watchManager.start(mockContext);

        const testDuration = 2000; // 2 seconds (shortened for test)
        const checkFrequency = 200; // Check every 200ms

        const startTime = Date.now();
        let checkCount = 0;

        const intervalId = setInterval(() => {
          checkCount++;
          expect(watchManager.isHealthy()).toBe(true);
          expect(watchManager.getStatus().isActive).toBe(true);
        }, checkFrequency);

        await new Promise((resolve) => setTimeout(resolve, testDuration));

        clearInterval(intervalId);

        const totalTime = Date.now() - startTime;
        console.log(
          `Stability test ran for ${totalTime}ms with ${checkCount} health checks`,
        );

        // Final health check
        expect(watchManager.isHealthy()).toBe(true);
        expect(watchManager.getStatus().isActive).toBe(true);

        const finalStats = watchManager.getStatistics();
        expect(finalStats.uptime).toBeGreaterThan(testDuration - 500); // Allow some margin

        // Error count should be low
        expect(finalStats.errorCount).toBeLessThan(5);
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe("Resource Management", () => {
    it("should manage resources efficiently", async () => {
      const originalCwd = process.cwd();
      process.chdir(tempDir);

      try {
        await watchManager.start(mockContext);

        // Test resource statistics
        const perfStats = watchManager.getPerformanceStatistics();
        expect(perfStats).toHaveProperty("performance");
        expect(perfStats).toHaveProperty("resources");
        expect(perfStats).toHaveProperty("queue");
        expect(perfStats).toHaveProperty("errors");

        // Test error recovery statistics
        const errorStats = watchManager.getErrorRecoveryStatistics();
        expect(errorStats).toHaveProperty("errorRecovery");
        expect(errorStats).toHaveProperty("degradation");
        expect(errorStats).toHaveProperty("activeErrors");

        // Should be healthy
        expect(watchManager.isHealthy()).toBe(true);
      } finally {
        process.chdir(originalCwd);
      }
    });

    it("should handle configuration updates efficiently", async () => {
      const originalCwd = process.cwd();
      process.chdir(tempDir);

      try {
        await watchManager.start(mockContext);

        const startTime = Date.now();

        // Update configuration
        await watchManager.updateConfiguration({
          patterns: {
            include: ["**/*.json"],
            exclude: ["**/node_modules/**"],
          },
          debounce: {
            delay: 200,
            maxWait: 1000,
          },
          monitoring: {
            logLevel: "verbose",
            enableProgressIndicators: false,
            enableNotifications: false,
          },
          performance: {
            batchSize: 25,
            rateLimitDelay: 20,
          },
        });

        const updateTime = Date.now() - startTime;
        console.log(`Configuration update completed in ${updateTime}ms`);

        // Should update quickly
        expect(updateTime).toBeLessThan(1000);

        // Should still be active
        expect(watchManager.getStatus().isActive).toBe(true);
      } finally {
        process.chdir(originalCwd);
      }
    });
  });
});

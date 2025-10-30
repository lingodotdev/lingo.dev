import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { DebounceController } from "./debounce";
import { DebounceStrategy, FileChangeEvent } from "./types";

describe("DebounceController", () => {
  let debounceController: DebounceController;
  let mockCallback: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    mockCallback = vi.fn().mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe("Simple debouncing strategy", () => {
    beforeEach(() => {
      const strategy: DebounceStrategy = {
        type: "simple",
        delay: 1000,
      };
      debounceController = new DebounceController(strategy);
      debounceController.setRetranslationCallback(mockCallback);
    });

    it("should debounce file changes with simple strategy", async () => {
      const changes: FileChangeEvent[] = [
        {
          type: "change",
          path: "/test/file1.txt",
          timestamp: new Date(),
        },
      ];

      debounceController.scheduleRetranslation(changes);
      expect(mockCallback).not.toHaveBeenCalled();

      // Fast-forward time by 500ms - should not execute yet
      vi.advanceTimersByTime(500);
      expect(mockCallback).not.toHaveBeenCalled();

      // Fast-forward time by another 500ms - should execute now
      vi.advanceTimersByTime(500);
      await vi.runAllTimersAsync();
      expect(mockCallback).toHaveBeenCalledWith(changes);
    });

    it("should reset timer when new changes arrive", async () => {
      const changes1: FileChangeEvent[] = [
        {
          type: "change",
          path: "/test/file1.txt",
          timestamp: new Date(),
        },
      ];

      const changes2: FileChangeEvent[] = [
        {
          type: "change",
          path: "/test/file2.txt",
          timestamp: new Date(),
        },
      ];

      debounceController.scheduleRetranslation(changes1);
      vi.advanceTimersByTime(500);

      // Add more changes - should reset timer
      debounceController.scheduleRetranslation(changes2);
      vi.advanceTimersByTime(500);
      expect(mockCallback).not.toHaveBeenCalled();

      // Wait for full delay from second change
      vi.advanceTimersByTime(500);
      await vi.runAllTimersAsync();
      expect(mockCallback).toHaveBeenCalledWith([...changes1, ...changes2]);
    });
  });

  describe("Adaptive debouncing strategy", () => {
    beforeEach(() => {
      const strategy: DebounceStrategy = {
        type: "adaptive",
        delay: 1000,
        maxWait: 4000,
      };
      debounceController = new DebounceController(strategy);
      debounceController.setRetranslationCallback(mockCallback);
    });

    it("should adapt delay based on change frequency", async () => {
      const changes: FileChangeEvent[] = [
        {
          type: "change",
          path: "/test/file1.txt",
          timestamp: new Date(),
        },
      ];

      // First execution to establish baseline
      debounceController.scheduleRetranslation(changes);
      vi.advanceTimersByTime(1000);
      await vi.runAllTimersAsync();
      expect(mockCallback).toHaveBeenCalledTimes(1);

      // Rapid changes should increase delay
      for (let i = 0; i < 10; i++) {
        debounceController.scheduleRetranslation([
          {
            type: "change",
            path: `/test/file${i}.txt`,
            timestamp: new Date(),
          },
        ]);
        vi.advanceTimersByTime(100); // Simulate rapid changes
      }

      // Should not execute immediately due to adaptive delay
      vi.advanceTimersByTime(1000);
      expect(mockCallback).toHaveBeenCalledTimes(1);

      // But should execute within max wait time
      vi.advanceTimersByTime(3000);
      await vi.runAllTimersAsync();
      expect(mockCallback).toHaveBeenCalledTimes(2);
    });
  });

  describe("Batch debouncing strategy", () => {
    beforeEach(() => {
      const strategy: DebounceStrategy = {
        type: "batch",
        delay: 1000,
        batchSize: 3,
        maxWait: 5000,
      };
      debounceController = new DebounceController(strategy);
      debounceController.setRetranslationCallback(mockCallback);
    });

    it("should execute immediately when batch size is reached", async () => {
      const changes: FileChangeEvent[] = [
        {
          type: "change",
          path: "/test/file1.txt",
          timestamp: new Date(),
        },
        {
          type: "change",
          path: "/test/file2.txt",
          timestamp: new Date(),
        },
        {
          type: "change",
          path: "/test/file3.txt",
          timestamp: new Date(),
        },
      ];

      debounceController.scheduleRetranslation(changes);

      // Should execute immediately without waiting for timer
      await vi.runAllTimersAsync();
      expect(mockCallback).toHaveBeenCalledWith(changes);
    });

    it("should wait for timer if batch size not reached", async () => {
      const changes: FileChangeEvent[] = [
        {
          type: "change",
          path: "/test/file1.txt",
          timestamp: new Date(),
        },
      ];

      debounceController.scheduleRetranslation(changes);
      expect(mockCallback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1000);
      await vi.runAllTimersAsync();
      expect(mockCallback).toHaveBeenCalledWith(changes);
    });
  });

  describe("Rate limiting", () => {
    beforeEach(() => {
      const strategy: DebounceStrategy = {
        type: "batch",
        delay: 1000,
        batchSize: 2,
        rateLimitDelay: 500,
      };
      debounceController = new DebounceController(strategy);
      debounceController.setRetranslationCallback(mockCallback);
    });

    it("should process changes in batches with rate limiting", async () => {
      const changes: FileChangeEvent[] = Array.from({ length: 6 }, (_, i) => ({
        type: "change" as const,
        path: `/test/file${i}.txt`,
        timestamp: new Date(),
      }));

      debounceController.scheduleRetranslation(changes);

      // Should process in batches with delays
      await vi.runAllTimersAsync();

      // Should have been called multiple times due to batching
      expect(mockCallback).toHaveBeenCalled();
    });
  });

  describe("Change deduplication", () => {
    beforeEach(() => {
      const strategy: DebounceStrategy = {
        type: "simple",
        delay: 1000,
      };
      debounceController = new DebounceController(strategy);
      debounceController.setRetranslationCallback(mockCallback);
    });

    it("should deduplicate changes for the same file path", async () => {
      const changes: FileChangeEvent[] = [
        {
          type: "change",
          path: "/test/file1.txt",
          timestamp: new Date(1000),
        },
        {
          type: "change",
          path: "/test/file1.txt",
          timestamp: new Date(2000), // Later timestamp
        },
        {
          type: "change",
          path: "/test/file2.txt",
          timestamp: new Date(1500),
        },
      ];

      debounceController.scheduleRetranslation(changes);
      vi.advanceTimersByTime(1000);
      await vi.runAllTimersAsync();

      // Should only have 2 changes (deduplicated file1.txt, keeping the later one)
      expect(mockCallback).toHaveBeenCalledWith([
        {
          type: "change",
          path: "/test/file1.txt",
          timestamp: new Date(2000),
        },
        {
          type: "change",
          path: "/test/file2.txt",
          timestamp: new Date(1500),
        },
      ]);
    });
  });

  describe("Utility methods", () => {
    beforeEach(() => {
      const strategy: DebounceStrategy = {
        type: "simple",
        delay: 1000,
      };
      debounceController = new DebounceController(strategy);
    });

    it("should report pending status correctly", () => {
      expect(debounceController.isRetranslationPending()).toBe(false);

      const changes: FileChangeEvent[] = [
        {
          type: "change",
          path: "/test/file1.txt",
          timestamp: new Date(),
        },
      ];

      debounceController.scheduleRetranslation(changes);
      expect(debounceController.isRetranslationPending()).toBe(true);

      debounceController.cancelPending();
      expect(debounceController.isRetranslationPending()).toBe(false);
    });

    it("should calculate time until execution", () => {
      const changes: FileChangeEvent[] = [
        {
          type: "change",
          path: "/test/file1.txt",
          timestamp: new Date(),
        },
      ];

      debounceController.scheduleRetranslation(changes);
      const timeUntilExecution = debounceController.getTimeUntilExecution();
      expect(timeUntilExecution).toBeGreaterThan(0);
      expect(timeUntilExecution).toBeLessThanOrEqual(1000);
    });

    it("should provide statistics", () => {
      const stats = debounceController.getStatistics();
      expect(stats).toHaveProperty("pendingChanges");
      expect(stats).toHaveProperty("isActive");
      expect(stats).toHaveProperty("strategy");
      expect(stats).toHaveProperty("lastExecutionTime");
      expect(stats.strategy).toBe("simple");
    });
  });
});

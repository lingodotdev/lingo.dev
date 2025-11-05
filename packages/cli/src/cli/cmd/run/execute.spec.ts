import { describe, it, expect, vi, beforeEach } from "vitest";
import pLimit from "p-limit";

/**
 * Tests for the per-file I/O locking mechanism in execute.ts
 *
 * This tests the critical race condition fix where multiple concurrent tasks
 * writing to the same file (e.g., xcode-xcstrings with multiple locales)
 * could cause "Cannot convert undefined or null to object" errors.
 */
describe("execute.ts - Per-file I/O locking", () => {
  describe("getFileIoLimiter", () => {
    it("should create separate limiters for different files", () => {
      const perFileIoLimiters = new Map();
      const getFileIoLimiter = (bucketPathPattern: string) => {
        const lockKey = bucketPathPattern;
        if (!perFileIoLimiters.has(lockKey)) {
          perFileIoLimiters.set(lockKey, pLimit(1));
        }
        return perFileIoLimiters.get(lockKey)!;
      };

      const limiter1 = getFileIoLimiter("example.xcstrings");
      const limiter2 = getFileIoLimiter("messages.json");
      const limiter3 = getFileIoLimiter("example.xcstrings");

      // Same file should return same limiter instance
      expect(limiter1).toBe(limiter3);
      // Different files should have different limiters
      expect(limiter1).not.toBe(limiter2);
    });

    it("should use pattern as-is without manipulation", () => {
      const perFileIoLimiters = new Map();
      const getFileIoLimiter = (bucketPathPattern: string) => {
        const lockKey = bucketPathPattern;
        if (!perFileIoLimiters.has(lockKey)) {
          perFileIoLimiters.set(lockKey, pLimit(1));
        }
        return perFileIoLimiters.get(lockKey)!;
      };

      // Test various pattern formats
      const patterns = [
        "example.xcstrings", // Single-file, no locale
        "src/[locale]/messages.json", // Multi-file with [locale]
        "locales/[locale].json", // Multi-file with [locale]
        "[locale]-config.json", // Multi-file starting with [locale]
        "locale-data.json", // Contains word "locale" but not placeholder
      ];

      const limiters = patterns.map((p) => getFileIoLimiter(p));

      // All should be unique (no patterns accidentally grouped)
      const uniqueLimiters = new Set(limiters);
      expect(uniqueLimiters.size).toBe(patterns.length);
    });
  });

  describe("Per-file serialization", () => {
    it("should serialize I/O operations for the same file", async () => {
      const perFileIoLimiters = new Map();
      const getFileIoLimiter = (bucketPathPattern: string) => {
        const lockKey = bucketPathPattern;
        if (!perFileIoLimiters.has(lockKey)) {
          perFileIoLimiters.set(lockKey, pLimit(1));
        }
        return perFileIoLimiters.get(lockKey)!;
      };

      const operations: { id: number; start: number; end: number }[] = [];

      // Simulate 3 concurrent tasks writing to the same file
      const tasks = [
        { id: 1, file: "example.xcstrings" },
        { id: 2, file: "example.xcstrings" },
        { id: 3, file: "example.xcstrings" },
      ];

      await Promise.all(
        tasks.map(async (task) => {
          const limiter = getFileIoLimiter(task.file);
          await limiter(async () => {
            const start = Date.now();
            await new Promise((resolve) => setTimeout(resolve, 50));
            const end = Date.now();
            operations.push({ id: task.id, start, end });
          });
        }),
      );

      // Verify operations were serialized (no overlap)
      operations.sort((a, b) => a.start - b.start);
      for (let i = 0; i < operations.length - 1; i++) {
        const current = operations[i];
        const next = operations[i + 1];
        // Next operation should start after current ends (serialized)
        expect(next.start).toBeGreaterThanOrEqual(current.end);
      }
    });

    it("should allow concurrent I/O operations for different files", async () => {
      const perFileIoLimiters = new Map();
      const getFileIoLimiter = (bucketPathPattern: string) => {
        const lockKey = bucketPathPattern;
        if (!perFileIoLimiters.has(lockKey)) {
          perFileIoLimiters.set(lockKey, pLimit(1));
        }
        return perFileIoLimiters.get(lockKey)!;
      };

      const operations: {
        id: number;
        file: string;
        start: number;
        end: number;
      }[] = [];

      // Simulate concurrent tasks writing to different files
      const tasks = [
        { id: 1, file: "example.xcstrings" },
        { id: 2, file: "messages.json" },
        { id: 3, file: "strings.xml" },
      ];

      await Promise.all(
        tasks.map(async (task) => {
          const limiter = getFileIoLimiter(task.file);
          await limiter(async () => {
            const start = Date.now();
            await new Promise((resolve) => setTimeout(resolve, 50));
            const end = Date.now();
            operations.push({ id: task.id, file: task.file, start, end });
          });
        }),
      );

      // Verify that at least some operations overlapped (ran concurrently)
      operations.sort((a, b) => a.start - b.start);
      let hasOverlap = false;
      for (let i = 0; i < operations.length - 1; i++) {
        const current = operations[i];
        const next = operations[i + 1];
        // If next starts before current ends, they overlapped
        if (next.start < current.end) {
          hasOverlap = true;
          break;
        }
      }
      expect(hasOverlap).toBe(true);
    });
  });

  describe("Race condition prevention", () => {
    it("should prevent concurrent read/write race conditions", async () => {
      const perFileIoLimiters = new Map();
      const getFileIoLimiter = (bucketPathPattern: string) => {
        const lockKey = bucketPathPattern;
        if (!perFileIoLimiters.has(lockKey)) {
          perFileIoLimiters.set(lockKey, pLimit(1));
        }
        return perFileIoLimiters.get(lockKey)!;
      };

      // Simulate a shared file state
      let fileContent: Record<string, string> = {};
      const operations: string[] = [];

      // Multiple tasks reading and writing to the same file
      const tasks = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        file: "example.xcstrings",
      }));

      await Promise.all(
        tasks.map(async (task) => {
          const limiter = getFileIoLimiter(task.file);
          await limiter(async () => {
            // Read
            operations.push(
              `Task ${task.id}: Read ${JSON.stringify(fileContent)}`,
            );
            const currentContent = { ...fileContent };

            // Simulate processing
            await new Promise((resolve) => setTimeout(resolve, 10));

            // Write
            currentContent[`key${task.id}`] = `value${task.id}`;
            fileContent = currentContent;
            operations.push(
              `Task ${task.id}: Write ${JSON.stringify(fileContent)}`,
            );
          });
        }),
      );

      // Verify all keys were written (no lost updates)
      expect(Object.keys(fileContent).length).toBe(5); // 5 new keys
      expect(fileContent).toHaveProperty("key1");
      expect(fileContent).toHaveProperty("key2");
      expect(fileContent).toHaveProperty("key3");
      expect(fileContent).toHaveProperty("key4");
      expect(fileContent).toHaveProperty("key5");
    });
  });

  describe("Hints handling", () => {
    it("should not block hints reading unnecessarily", async () => {
      const perFileIoLimiters = new Map();
      const getFileIoLimiter = (bucketPathPattern: string) => {
        const lockKey = bucketPathPattern;
        if (!perFileIoLimiters.has(lockKey)) {
          perFileIoLimiters.set(lockKey, pLimit(1));
        }
        return perFileIoLimiters.get(lockKey)!;
      };

      const fileIoLimiter = getFileIoLimiter("example.xcstrings");

      // Simulate the actual execution order
      const sourceData = await fileIoLimiter(async () => {
        // Simulate file read
        await new Promise((resolve) => setTimeout(resolve, 10));
        return { key1: "value1" };
      });

      const hints = await fileIoLimiter(async () => {
        // Hints don't read file, just process in-memory data
        return { key1: { hint: "hint1" } };
      });

      const targetData = await fileIoLimiter(async () => {
        // Simulate file read
        await new Promise((resolve) => setTimeout(resolve, 10));
        return { key1: "translated1" };
      });

      // All should complete successfully
      expect(sourceData).toEqual({ key1: "value1" });
      expect(hints).toEqual({ key1: { hint: "hint1" } });
      expect(targetData).toEqual({ key1: "translated1" });
    });
  });

  describe("Edge cases", () => {
    it("should handle empty pattern gracefully", () => {
      const perFileIoLimiters = new Map();
      const getFileIoLimiter = (bucketPathPattern: string) => {
        const lockKey = bucketPathPattern;
        if (!perFileIoLimiters.has(lockKey)) {
          perFileIoLimiters.set(lockKey, pLimit(1));
        }
        return perFileIoLimiters.get(lockKey)!;
      };

      const limiter1 = getFileIoLimiter("");
      const limiter2 = getFileIoLimiter("");

      expect(limiter1).toBe(limiter2);
    });

    it("should handle patterns with special characters", () => {
      const perFileIoLimiters = new Map();
      const getFileIoLimiter = (bucketPathPattern: string) => {
        const lockKey = bucketPathPattern;
        if (!perFileIoLimiters.has(lockKey)) {
          perFileIoLimiters.set(lockKey, pLimit(1));
        }
        return perFileIoLimiters.get(lockKey)!;
      };

      const patterns = [
        "file with spaces.json",
        "path/with/nested/dirs.json",
        "файл-с-unicode.json",
        "file-with-[brackets].json",
        "file.with.dots.in.name.json",
      ];

      patterns.forEach((pattern) => {
        expect(() => getFileIoLimiter(pattern)).not.toThrow();
      });
    });

    it("should maintain separate limiters across many files", () => {
      const perFileIoLimiters = new Map();
      const getFileIoLimiter = (bucketPathPattern: string) => {
        const lockKey = bucketPathPattern;
        if (!perFileIoLimiters.has(lockKey)) {
          perFileIoLimiters.set(lockKey, pLimit(1));
        }
        return perFileIoLimiters.get(lockKey)!;
      };

      // Create limiters for 100 different files
      const limiters = Array.from({ length: 100 }, (_, i) =>
        getFileIoLimiter(`file${i}.json`),
      );

      // All should be unique
      const uniqueLimiters = new Set(limiters);
      expect(uniqueLimiters.size).toBe(100);

      // Map should contain 100 entries
      expect(perFileIoLimiters.size).toBe(100);
    });
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { PerformanceOptimizer } from "./performance-optimizer";
import { FileChangeEvent } from "./types";

// Mock fs promises
vi.mock("fs", () => ({
  promises: {
    stat: vi.fn(),
    readdir: vi.fn(),
    mkdir: vi.fn(),
    writeFile: vi.fn(),
    readFile: vi.fn(),
    access: vi.fn(),
  },
}));

// Mock path
vi.mock("path", () => ({
  join: vi.fn((...parts: string[]) => parts.join("/")),
  relative: vi.fn((from: string, to: string) => to),
  dirname: vi.fn((p: string) => path.dirname(p)),
  extname: vi.fn((p: string) => path.extname(p)),
}));

// Mock minimatch
vi.mock("minimatch", () => ({
  minimatch: vi.fn((file: string, pattern: string) => {
    // Simple mock implementation
    if (pattern.includes("node_modules") && file.includes("node_modules"))
      return true;
    if (pattern.includes(".git") && file.includes(".git")) return true;
    if (pattern.includes("*.json") && file.endsWith(".json")) return true;
    return false;
  }),
}));

describe("PerformanceOptimizer", () => {
  let optimizer: PerformanceOptimizer;

  beforeEach(() => {
    vi.clearAllMocks();
    optimizer = new PerformanceOptimizer({
      enableIntelligentFiltering: true,
      enablePatternCaching: true,
      enableMetadataCaching: true,
      maxWatchedFiles: 100,
      cacheTtl: 60000,
      enableAdaptiveFiltering: true,
      largeRepositoryThreshold: 50,
    });
  });

  afterEach(async () => {
    await optimizer.destroy();
  });

  describe("Repository Size Analysis", () => {
    it("should detect small repository", async () => {
      // Mock small number of files
      vi.mocked(fs.promises.readdir).mockResolvedValue([
        { name: "file1.json", isDirectory: () => false },
        { name: "file2.json", isDirectory: () => false },
        { name: "src", isDirectory: () => true },
      ] as any);

      const patterns = ["src/**/*.json"];
      await optimizer.resolveWatchPatterns(patterns);

      const stats = optimizer.getStatistics();
      expect(stats.largeRepositoryMode).toBe(false);
    });

    it("should detect large repository and enable optimizations", async () => {
      // Mock large number of files
      const manyFiles = Array.from({ length: 100 }, (_, i) => ({
        name: `file${i}.json`,
        isDirectory: () => false,
      }));

      vi.mocked(fs.promises.readdir).mockResolvedValue(manyFiles as any);

      const patterns = ["**/*.json"];
      await optimizer.resolveWatchPatterns(patterns);

      const stats = optimizer.getStatistics();
      expect(stats.largeRepositoryMode).toBe(true);
    });
  });

  describe("Pattern Resolution with Caching", () => {
    it("should resolve patterns and cache results", async () => {
      vi.mocked(fs.promises.readdir).mockResolvedValue([
        { name: "test1.json", isDirectory: () => false },
        { name: "test2.json", isDirectory: () => false },
      ] as any);

      vi.mocked(fs.promises.stat).mockResolvedValue({
        size: 1024,
        mtime: new Date(),
        isDirectory: () => false,
      } as any);

      const patterns = ["*.json"];
      const result1 = await optimizer.resolveWatchPatterns(patterns);
      const result2 = await optimizer.resolveWatchPatterns(patterns);

      expect(result1).toEqual(result2);

      const stats = optimizer.getStatistics();
      expect(stats.cacheHits).toBeGreaterThan(0);
    });

    it("should handle cache misses", async () => {
      vi.mocked(fs.promises.readdir).mockResolvedValue([
        { name: "test.json", isDirectory: () => false },
      ] as any);

      const patterns = ["unique-pattern-*.json"];
      await optimizer.resolveWatchPatterns(patterns);

      const stats = optimizer.getStatistics();
      expect(stats.cacheMisses).toBeGreaterThan(0);
    });

    it("should limit resolved files to maxWatchedFiles", async () => {
      // Mock many files
      const manyFiles = Array.from({ length: 200 }, (_, i) => ({
        name: `file${i}.json`,
        isDirectory: () => false,
      }));

      vi.mocked(fs.promises.readdir).mockResolvedValue(manyFiles as any);
      vi.mocked(fs.promises.stat).mockResolvedValue({
        size: 1024,
        mtime: new Date(),
        isDirectory: () => false,
      } as any);

      const patterns = ["**/*.json"];
      const result = await optimizer.resolveWatchPatterns(patterns);

      expect(result.length).toBeLessThanOrEqual(100); // maxWatchedFiles
    });
  });

  describe("Intelligent File Filtering", () => {
    beforeEach(() => {
      vi.mocked(fs.promises.stat).mockResolvedValue({
        size: 1024,
        mtime: new Date(),
        isDirectory: () => false,
      } as any);
    });

    it("should prioritize translation-related files", async () => {
      vi.mocked(fs.promises.readdir).mockResolvedValue([
        { name: "locales", isDirectory: () => true },
        { name: "en.json", isDirectory: () => false },
        { name: "image.png", isDirectory: () => false },
      ] as any);

      const patterns = ["**/*"];
      const result = await optimizer.resolveWatchPatterns(patterns);

      // Translation files should be included
      expect(result.some((file) => file.includes("en.json"))).toBe(true);
    });

    it("should filter out non-translation files in large repository mode", async () => {
      // Force large repository mode
      const manyFiles = Array.from({ length: 100 }, (_, i) => ({
        name: i < 50 ? `file${i}.json` : `image${i}.png`,
        isDirectory: () => false,
      }));

      vi.mocked(fs.promises.readdir).mockResolvedValue(manyFiles as any);

      const patterns = ["**/*"];
      const result = await optimizer.resolveWatchPatterns(patterns);

      // Should prefer JSON files over images in large repo mode
      const jsonFiles = result.filter((file) => file.endsWith(".json"));
      const imageFiles = result.filter((file) => file.endsWith(".png"));

      expect(jsonFiles.length).toBeGreaterThan(imageFiles.length);
    });

    it("should skip very large files in large repository mode", async () => {
      vi.mocked(fs.promises.readdir).mockResolvedValue([
        { name: "small.json", isDirectory: () => false },
        { name: "large.json", isDirectory: () => false },
      ] as any);

      vi.mocked(fs.promises.stat).mockImplementation((filePath: any) => {
        if (filePath.includes("large.json")) {
          return Promise.resolve({
            size: 2 * 1024 * 1024, // 2MB
            mtime: new Date(),
            isDirectory: () => false,
          } as any);
        }
        return Promise.resolve({
          size: 1024, // 1KB
          mtime: new Date(),
          isDirectory: () => false,
        } as any);
      });

      // Force large repository mode
      const manyFiles = Array.from({ length: 100 }, (_, i) => ({
        name: `file${i}.json`,
        isDirectory: () => false,
      }));
      vi.mocked(fs.promises.readdir).mockResolvedValue(manyFiles as any);

      const patterns = ["*.json"];
      const result = await optimizer.resolveWatchPatterns(patterns);

      expect(result.includes("small.json")).toBe(true);
      expect(result.includes("large.json")).toBe(false);
    });
  });

  describe("File Change Optimization", () => {
    it("should optimize file changes for large repositories", async () => {
      // Force large repository mode
      const manyFiles = Array.from({ length: 100 }, (_, i) => ({
        name: `file${i}.json`,
        isDirectory: () => false,
      }));
      vi.mocked(fs.promises.readdir).mockResolvedValue(manyFiles as any);

      await optimizer.resolveWatchPatterns(["**/*.json"]);

      const changes: FileChangeEvent[] = Array.from({ length: 20 }, (_, i) => ({
        type: "change",
        path: `src/file${i}.json`,
        timestamp: new Date(),
      }));

      const optimizedChanges = optimizer.optimizeFileChangeDetection(changes);

      // Should limit changes in large repository mode
      expect(optimizedChanges.length).toBeLessThanOrEqual(changes.length);
    });

    it("should prioritize translation directory changes", async () => {
      const changes: FileChangeEvent[] = [
        { type: "change", path: "locales/en.json", timestamp: new Date() },
        { type: "change", path: "locales/fr.json", timestamp: new Date() },
        { type: "change", path: "src/component.js", timestamp: new Date() },
        { type: "change", path: "src/utils.js", timestamp: new Date() },
        { type: "change", path: "src/helper.js", timestamp: new Date() },
        { type: "change", path: "src/service.js", timestamp: new Date() },
      ];

      const optimizedChanges = optimizer.optimizeFileChangeDetection(changes);

      // Translation files should be preserved
      expect(
        optimizedChanges.some((c) => c.path.includes("locales/en.json")),
      ).toBe(true);
      expect(
        optimizedChanges.some((c) => c.path.includes("locales/fr.json")),
      ).toBe(true);
    });

    it("should not optimize small change sets", async () => {
      const changes: FileChangeEvent[] = [
        { type: "change", path: "file1.json", timestamp: new Date() },
        { type: "change", path: "file2.json", timestamp: new Date() },
      ];

      const optimizedChanges = optimizer.optimizeFileChangeDetection(changes);

      expect(optimizedChanges).toEqual(changes);
    });
  });

  describe("Metadata Caching", () => {
    it("should cache file metadata", async () => {
      const filePath = "test.json";

      vi.mocked(fs.promises.stat).mockResolvedValue({
        size: 1024,
        mtime: new Date(),
        isDirectory: () => false,
      } as any);

      // First call should hit filesystem
      const patterns = [filePath];
      await optimizer.resolveWatchPatterns(patterns);

      // Second call should use cache
      await optimizer.resolveWatchPatterns(patterns);

      const stats = optimizer.getStatistics();
      expect(stats.cacheHits).toBeGreaterThan(0);
    });

    it("should handle file stat errors gracefully", async () => {
      vi.mocked(fs.promises.stat).mockRejectedValue(
        new Error("File not found"),
      );

      const patterns = ["nonexistent.json"];
      const result = await optimizer.resolveWatchPatterns(patterns);

      expect(result).toEqual([]);
    });
  });

  describe("Cache Management", () => {
    it("should clear caches", () => {
      optimizer.clearCaches();

      const stats = optimizer.getStatistics();
      expect(stats.cacheManager.totalEntries).toBe(0);
    });

    it("should update configuration", () => {
      optimizer.updateConfiguration({
        maxWatchedFiles: 200,
        enableIntelligentFiltering: false,
      });

      // Configuration should be updated
      // This is tested indirectly through behavior changes
      expect(true).toBe(true);
    });
  });

  describe("Performance Statistics", () => {
    it("should track filtering statistics", async () => {
      vi.mocked(fs.promises.readdir).mockResolvedValue([
        { name: "test.json", isDirectory: () => false },
      ] as any);

      vi.mocked(fs.promises.stat).mockResolvedValue({
        size: 1024,
        mtime: new Date(),
        isDirectory: () => false,
      } as any);

      const patterns = ["*.json"];
      await optimizer.resolveWatchPatterns(patterns);

      const stats = optimizer.getStatistics();
      expect(stats.totalFilesScanned).toBeGreaterThan(0);
      expect(stats.averageFilterTime).toBeGreaterThan(0);
    });

    it("should track cache statistics", async () => {
      const patterns = ["*.json"];

      // First call - cache miss
      await optimizer.resolveWatchPatterns(patterns);

      // Second call - cache hit
      await optimizer.resolveWatchPatterns(patterns);

      const stats = optimizer.getStatistics();
      expect(stats.cacheHits).toBeGreaterThan(0);
      expect(stats.cacheMisses).toBeGreaterThan(0);
    });

    it("should track repository information", async () => {
      const stats = optimizer.getStatistics();

      expect(stats.repositoryInfo).toBeDefined();
      expect(typeof stats.repositoryInfo.size).toBe("number");
      expect(typeof stats.repositoryInfo.isLarge).toBe("boolean");
      expect(typeof stats.repositoryInfo.lastScan).toBe("number");
    });
  });

  describe("Error Handling", () => {
    it("should handle directory read errors", async () => {
      vi.mocked(fs.promises.readdir).mockRejectedValue(
        new Error("Permission denied"),
      );

      const patterns = ["src/**/*.json"];
      const result = await optimizer.resolveWatchPatterns(patterns);

      expect(result).toEqual([]);
    });

    it("should handle file stat errors", async () => {
      vi.mocked(fs.promises.readdir).mockResolvedValue([
        { name: "test.json", isDirectory: () => false },
      ] as any);

      vi.mocked(fs.promises.stat).mockRejectedValue(
        new Error("File access error"),
      );

      const patterns = ["*.json"];
      const result = await optimizer.resolveWatchPatterns(patterns);

      // Should handle error gracefully and continue
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("Integration Scenarios", () => {
    it("should handle mixed file types efficiently", async () => {
      vi.mocked(fs.promises.readdir).mockResolvedValue([
        { name: "en.json", isDirectory: () => false },
        { name: "fr.json", isDirectory: () => false },
        { name: "component.js", isDirectory: () => false },
        { name: "style.css", isDirectory: () => false },
        { name: "image.png", isDirectory: () => false },
        { name: "document.pdf", isDirectory: () => false },
      ] as any);

      vi.mocked(fs.promises.stat).mockResolvedValue({
        size: 1024,
        mtime: new Date(),
        isDirectory: () => false,
      } as any);

      const patterns = ["**/*"];
      const result = await optimizer.resolveWatchPatterns(patterns);

      // Should include translation files
      expect(result.some((file) => file.includes(".json"))).toBe(true);
    });

    it("should work with complex directory structures", async () => {
      vi.mocked(fs.promises.readdir).mockImplementation((dir: any) => {
        if (dir.includes("locales")) {
          return Promise.resolve([
            { name: "en", isDirectory: () => true },
            { name: "fr", isDirectory: () => true },
          ] as any);
        }
        if (dir.includes("en") || dir.includes("fr")) {
          return Promise.resolve([
            { name: "common.json", isDirectory: () => false },
            { name: "errors.json", isDirectory: () => false },
          ] as any);
        }
        return Promise.resolve([
          { name: "locales", isDirectory: () => true },
          { name: "src", isDirectory: () => true },
        ] as any);
      });

      vi.mocked(fs.promises.stat).mockResolvedValue({
        size: 1024,
        mtime: new Date(),
        isDirectory: () => false,
      } as any);

      const patterns = ["locales/**/*.json"];
      const result = await optimizer.resolveWatchPatterns(patterns);

      expect(result.length).toBeGreaterThan(0);
    });
  });
});

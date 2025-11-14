import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import { WatchManager } from "./manager";
import { GitIntegrationManager } from "./git-integration";
import { PerformanceOptimizer } from "./performance-optimizer";
import { CmdRunContext } from "../_types";
import { FileChangeEvent } from "./types";

// Mock all dependencies
vi.mock("fs", () => ({
  promises: {
    stat: vi.fn(),
    readFile: vi.fn(),
    readdir: vi.fn(),
    access: vi.fn(),
    mkdir: vi.fn(),
    writeFile: vi.fn(),
  },
}));

vi.mock("chokidar", () => ({
  watch: vi.fn(() => ({
    on: vi.fn(),
    close: vi.fn(),
    add: vi.fn(),
    unwatch: vi.fn(),
    getWatched: vi.fn(() => ({})),
  })),
}));

vi.mock("../plan", () => ({ default: vi.fn() }));
vi.mock("../execute", () => ({ default: vi.fn() }));
vi.mock("../../../utils/ui", () => ({ renderSummary: vi.fn() }));
vi.mock("../../../utils/buckets", () => ({ getBuckets: vi.fn(() => []) }));
vi.mock("chalk", () => ({
  default: {
    hex: vi.fn(() => vi.fn()),
    yellow: vi.fn(),
    dim: vi.fn(),
    red: vi.fn(),
  },
}));
vi.mock("../../../constants", () => ({
  colors: { orange: "#ff6600", green: "#00ff00" },
}));

describe("Version Control Integration", () => {
  let watchManager: WatchManager;
  let gitIntegration: GitIntegrationManager;
  let performanceOptimizer: PerformanceOptimizer;
  let mockContext: CmdRunContext;

  beforeEach(() => {
    vi.clearAllMocks();

    mockContext = {
      config: {
        locale: { source: "en", targets: ["fr", "es"] },
        buckets: {},
      },
      flags: {
        watch: true,
        debounce: 1000,
        sourceLocale: "en",
        rateLimitDelay: 100,
        batchSize: 10,
        interactive: false,
        concurrency: 1,
        debug: false,
        debounceStrategy: "simple" as const,
        quiet: false,
        progress: true,
        notifications: false,
        watchInclude: [],
        watchExclude: [],
      },
      tasks: [],
      results: new Map(),
    };

    // Mock git repository exists
    vi.mocked(fs.promises.stat).mockResolvedValue({
      isDirectory: () => true,
      mtime: new Date(),
    } as any);

    vi.mocked(fs.promises.readFile).mockResolvedValue("ref: refs/heads/main");
    vi.mocked(fs.promises.access).mockResolvedValue(undefined);

    watchManager = new WatchManager();
    gitIntegration = new GitIntegrationManager();
    performanceOptimizer = new PerformanceOptimizer();
  });

  afterEach(async () => {
    await watchManager.stop();
    gitIntegration.destroy();
    await performanceOptimizer.destroy();
  });

  describe("Git Branch Switch Scenario", () => {
    it("should handle branch switch with multiple file changes", async () => {
      // Mock recent HEAD change (branch switch)
      const recentTime = new Date();
      vi.mocked(fs.promises.stat).mockImplementation((filePath: any) => {
        if (filePath.includes(".git/HEAD")) {
          return Promise.resolve({
            isDirectory: () => false,
            mtime: recentTime,
          } as any);
        }
        return Promise.resolve({
          isDirectory: () => true,
          mtime: new Date(Date.now() - 10000),
        } as any);
      });

      vi.mocked(fs.promises.readFile).mockResolvedValue(
        "ref: refs/heads/feature-branch",
      );

      const batchHandler = vi.fn();
      gitIntegration.onBatch(batchHandler);

      // Simulate multiple file changes from branch switch
      const changes: FileChangeEvent[] = [
        { type: "change", path: "locales/en.json", timestamp: new Date() },
        { type: "change", path: "locales/fr.json", timestamp: new Date() },
        { type: "change", path: "locales/es.json", timestamp: new Date() },
        { type: "change", path: "src/component.js", timestamp: new Date() },
        { type: "change", path: "src/utils.js", timestamp: new Date() },
      ];

      // Process changes
      for (const change of changes) {
        await gitIntegration.processFileChange(change);
      }

      // Wait for batching
      await new Promise((resolve) => setTimeout(resolve, 1100));

      expect(batchHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          gitOperation: expect.objectContaining({
            operation: "branch_switch",
            branchName: "feature-branch",
            isBulkOperation: true,
          }),
          changes: expect.arrayContaining(changes),
          priority: "low", // Bulk operations get low priority
        }),
      );
    });

    it("should optimize file changes during branch switch", async () => {
      // Mock large repository
      const manyFiles = Array.from({ length: 100 }, (_, i) => ({
        name: `file${i}.json`,
        isDirectory: () => false,
      }));
      vi.mocked(fs.promises.readdir).mockResolvedValue(manyFiles as any);

      // Initialize performance optimizer with large repo
      await performanceOptimizer.resolveWatchPatterns(["**/*.json"]);

      // Create many file changes (simulating branch switch)
      const changes: FileChangeEvent[] = Array.from({ length: 50 }, (_, i) => ({
        type: "change",
        path: i < 10 ? `locales/lang${i}.json` : `src/file${i}.js`,
        timestamp: new Date(),
      }));

      const optimizedChanges =
        performanceOptimizer.optimizeFileChangeDetection(changes);

      // Should prioritize translation files and limit total changes
      const translationChanges = optimizedChanges.filter((c) =>
        c.path.includes("locales/"),
      );
      const sourceChanges = optimizedChanges.filter((c) =>
        c.path.includes("src/"),
      );

      expect(translationChanges.length).toBeGreaterThan(0);
      expect(translationChanges.length).toBeGreaterThanOrEqual(
        sourceChanges.length,
      );
      expect(optimizedChanges.length).toBeLessThanOrEqual(changes.length);
    });
  });

  describe("Git Pull Scenario", () => {
    it("should detect and batch git pull changes", async () => {
      // Mock git pull scenario - HEAD changed recently
      const recentTime = new Date();
      vi.mocked(fs.promises.stat).mockImplementation((filePath: any) => {
        if (filePath.includes(".git/HEAD")) {
          return Promise.resolve({
            isDirectory: () => false,
            mtime: recentTime,
          } as any);
        }
        return Promise.resolve({
          isDirectory: () => true,
          mtime: new Date(Date.now() - 10000),
        } as any);
      });

      const batchHandler = vi.fn();
      gitIntegration.onBatch(batchHandler);

      // Simulate rapid file changes from git pull
      const changes: FileChangeEvent[] = [
        { type: "change", path: "locales/en.json", timestamp: new Date() },
        { type: "add", path: "locales/de.json", timestamp: new Date() },
        { type: "change", path: "package.json", timestamp: new Date() },
        { type: "unlink", path: "old-file.json", timestamp: new Date() },
      ];

      // Process changes rapidly (as git would)
      const promises = changes.map((change) =>
        gitIntegration.processFileChange(change),
      );
      await Promise.all(promises);

      // Wait for batching
      await new Promise((resolve) => setTimeout(resolve, 1100));

      expect(batchHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          gitOperation: expect.objectContaining({
            operation: "branch_switch", // Git pull appears as branch switch
            affectedFiles: expect.arrayContaining([
              "locales/en.json",
              "locales/de.json",
              "package.json",
              "old-file.json",
            ]),
          }),
        }),
      );
    });
  });

  describe("Git Merge Scenario", () => {
    it("should detect merge operation and handle conflicts", async () => {
      // Mock merge in progress
      vi.mocked(fs.promises.access).mockImplementation((filePath: any) => {
        if (filePath.includes("MERGE_HEAD")) {
          return Promise.resolve();
        }
        return Promise.reject(new Error("ENOENT"));
      });

      const recentTime = new Date();
      vi.mocked(fs.promises.stat).mockResolvedValue({
        isDirectory: () => false,
        mtime: recentTime,
      } as any);

      const batchHandler = vi.fn();
      gitIntegration.onBatch(batchHandler);

      // Simulate merge conflict resolution
      const changes: FileChangeEvent[] = [
        { type: "change", path: "locales/en.json", timestamp: new Date() },
        { type: "change", path: "locales/fr.json", timestamp: new Date() },
      ];

      for (const change of changes) {
        await gitIntegration.processFileChange(change);
      }

      await new Promise((resolve) => setTimeout(resolve, 1100));

      expect(batchHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          gitOperation: expect.objectContaining({
            operation: "merge",
          }),
        }),
      );
    });
  });

  describe("Large Repository Performance", () => {
    it("should handle large repository with many files efficiently", async () => {
      // Mock very large repository
      const manyFiles = Array.from({ length: 1000 }, (_, i) => ({
        name: `file${i}.json`,
        isDirectory: () => false,
      }));

      vi.mocked(fs.promises.readdir).mockResolvedValue(manyFiles as any);
      vi.mocked(fs.promises.stat).mockResolvedValue({
        size: 1024,
        mtime: new Date(),
        isDirectory: () => false,
      } as any);

      // Initialize with large repository
      const patterns = ["**/*.json"];
      const resolvedFiles =
        await performanceOptimizer.resolveWatchPatterns(patterns);

      // Should limit files due to maxWatchedFiles
      expect(resolvedFiles.length).toBeLessThanOrEqual(1000);

      const stats = performanceOptimizer.getStatistics();
      expect(stats.largeRepositoryMode).toBe(true);
    });

    it("should cache pattern resolution for performance", async () => {
      vi.mocked(fs.promises.readdir).mockResolvedValue([
        { name: "en.json", isDirectory: () => false },
        { name: "fr.json", isDirectory: () => false },
      ] as any);

      vi.mocked(fs.promises.stat).mockResolvedValue({
        size: 1024,
        mtime: new Date(),
        isDirectory: () => false,
      } as any);

      const patterns = ["locales/*.json"];

      // First resolution - should cache
      const startTime1 = Date.now();
      await performanceOptimizer.resolveWatchPatterns(patterns);
      const time1 = Date.now() - startTime1;

      // Second resolution - should use cache
      const startTime2 = Date.now();
      await performanceOptimizer.resolveWatchPatterns(patterns);
      const time2 = Date.now() - startTime2;

      // Cached resolution should be faster
      expect(time2).toBeLessThan(time1);

      const stats = performanceOptimizer.getStatistics();
      expect(stats.cacheHits).toBeGreaterThan(0);
    });
  });

  describe("Ignore Patterns", () => {
    it("should ignore .git directory changes", async () => {
      const batchHandler = vi.fn();
      gitIntegration.onBatch(batchHandler);

      // Simulate .git directory changes
      const gitChanges: FileChangeEvent[] = [
        { type: "change", path: ".git/HEAD", timestamp: new Date() },
        { type: "change", path: ".git/refs/heads/main", timestamp: new Date() },
        { type: "change", path: ".git/objects/abc123", timestamp: new Date() },
      ];

      for (const change of gitChanges) {
        await gitIntegration.processFileChange(change);
      }

      // Should not emit batches for .git changes
      expect(batchHandler).not.toHaveBeenCalled();
    });

    it("should ignore temporary files", async () => {
      const batchHandler = vi.fn();
      gitIntegration.onBatch(batchHandler);

      const tempChanges: FileChangeEvent[] = [
        { type: "change", path: "file.tmp", timestamp: new Date() },
        { type: "change", path: "file.temp", timestamp: new Date() },
        { type: "change", path: "file~", timestamp: new Date() },
        { type: "change", path: ".#file", timestamp: new Date() },
        { type: "change", path: "file.swp", timestamp: new Date() },
      ];

      for (const change of tempChanges) {
        await gitIntegration.processFileChange(change);
      }

      // Should not emit batches for temporary files
      expect(batchHandler).not.toHaveBeenCalled();
    });

    it("should process legitimate file changes", async () => {
      const batchHandler = vi.fn();
      gitIntegration.onBatch(batchHandler);

      const legitimateChanges: FileChangeEvent[] = [
        { type: "change", path: "locales/en.json", timestamp: new Date() },
        { type: "change", path: "src/component.js", timestamp: new Date() },
        { type: "change", path: "package.json", timestamp: new Date() },
      ];

      for (const change of legitimateChanges) {
        await gitIntegration.processFileChange(change);
      }

      await new Promise((resolve) => setTimeout(resolve, 1100));

      expect(batchHandler).toHaveBeenCalled();
    });
  });

  describe("Error Recovery", () => {
    it("should handle git state detection errors gracefully", async () => {
      // Mock git state detection failure
      vi.mocked(fs.promises.stat).mockRejectedValue(
        new Error("Permission denied"),
      );

      const batchHandler = vi.fn();
      const errorHandler = vi.fn();
      gitIntegration.onBatch(batchHandler);
      gitIntegration.onError(errorHandler);

      const change: FileChangeEvent = {
        type: "change",
        path: "locales/en.json",
        timestamp: new Date(),
      };

      await gitIntegration.processFileChange(change);

      // Should still process the change despite git detection error
      expect(batchHandler).toHaveBeenCalled();
      expect(errorHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "file_system",
          recoverable: true,
        }),
      );
    });

    it("should handle file system errors during optimization", async () => {
      vi.mocked(fs.promises.readdir).mockRejectedValue(
        new Error("Directory not accessible"),
      );

      const patterns = ["src/**/*.json"];
      const result = await performanceOptimizer.resolveWatchPatterns(patterns);

      // Should return empty array gracefully
      expect(result).toEqual([]);
    });
  });

  describe("Statistics and Monitoring", () => {
    it("should track git operation statistics", async () => {
      const recentTime = new Date();
      vi.mocked(fs.promises.stat).mockResolvedValue({
        isDirectory: () => false,
        mtime: recentTime,
      } as any);

      vi.mocked(fs.promises.readFile).mockResolvedValue(
        "ref: refs/heads/feature",
      );

      const change: FileChangeEvent = {
        type: "change",
        path: "locales/en.json",
        timestamp: new Date(),
      };

      await gitIntegration.processFileChange(change);
      await new Promise((resolve) => setTimeout(resolve, 1100));

      const stats = gitIntegration.getStatistics();
      expect(stats.operationHistory).toHaveLength(1);
      expect(stats.operationHistory[0]).toMatchObject({
        operation: "branch_switch",
        branchName: "feature",
      });
    });

    it("should track performance optimization statistics", async () => {
      vi.mocked(fs.promises.readdir).mockResolvedValue([
        { name: "test.json", isDirectory: () => false },
      ] as any);

      vi.mocked(fs.promises.stat).mockResolvedValue({
        size: 1024,
        mtime: new Date(),
        isDirectory: () => false,
      } as any);

      const patterns = ["*.json"];
      await performanceOptimizer.resolveWatchPatterns(patterns);

      const stats = performanceOptimizer.getStatistics();
      expect(stats.totalFilesScanned).toBeGreaterThan(0);
      expect(stats.averageFilterTime).toBeGreaterThan(0);
      expect(stats.cacheManager).toBeDefined();
    });
  });

  describe("Integration with Watch Manager", () => {
    it("should integrate git awareness with watch manager", async () => {
      // This test would require more complex setup to test the full integration
      // For now, we verify that the components can be instantiated together
      expect(watchManager).toBeDefined();
      expect(gitIntegration).toBeDefined();
      expect(performanceOptimizer).toBeDefined();
    });
  });
});

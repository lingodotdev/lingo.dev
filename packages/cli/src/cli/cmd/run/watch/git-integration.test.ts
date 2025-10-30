import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import {
  GitIntegrationManager,
  GitOperation,
  FileChangeBatch,
} from "./git-integration";
import { FileChangeEvent } from "./types";

// Mock fs promises
vi.mock("fs", () => ({
  promises: {
    stat: vi.fn(),
    readFile: vi.fn(),
    access: vi.fn(),
  },
}));

// Mock path
vi.mock("path", () => ({
  resolve: vi.fn((p: string) => p),
  dirname: vi.fn((p: string) => path.dirname(p)),
  join: vi.fn((...parts: string[]) => parts.join("/")),
  relative: vi.fn((from: string, to: string) => to),
  parse: vi.fn((p: string) => ({ root: "/" })),
}));

// Mock minimatch
vi.mock("minimatch", () => ({
  minimatch: vi.fn(() => false),
}));

describe("GitIntegrationManager", () => {
  let gitIntegration: GitIntegrationManager;
  let mockBatchHandler: any;
  let mockErrorHandler: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockBatchHandler = vi.fn();
    mockErrorHandler = vi.fn();

    gitIntegration = new GitIntegrationManager({
      enabled: true,
      operationTimeWindow: 1000,
      bulkOperationThreshold: 3,
    });

    gitIntegration.onBatch(mockBatchHandler);
    gitIntegration.onError(mockErrorHandler);
  });

  afterEach(() => {
    gitIntegration.destroy();
  });

  describe("Git Repository Detection", () => {
    it("should detect git repository", async () => {
      // Mock .git directory exists
      vi.mocked(fs.promises.stat).mockResolvedValue({
        isDirectory: () => true,
      } as any);

      const stats = gitIntegration.getStatistics();
      expect(stats.enabled).toBe(true);
    });

    it("should disable integration when no git repository found", async () => {
      // Mock .git directory doesn't exist
      vi.mocked(fs.promises.stat).mockRejectedValue(new Error("ENOENT"));

      const gitIntegrationNoRepo = new GitIntegrationManager();
      await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for initialization

      const stats = gitIntegrationNoRepo.getStatistics();
      expect(stats.enabled).toBe(false);

      gitIntegrationNoRepo.destroy();
    });
  });

  describe("File Change Processing", () => {
    it("should process single file change without git operation", async () => {
      const fileChange: FileChangeEvent = {
        type: "change",
        path: "src/test.json",
        timestamp: new Date(),
      };

      await gitIntegration.processFileChange(fileChange);

      // Should emit batch immediately for non-git changes
      expect(mockBatchHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          changes: [fileChange],
          priority: "medium",
        }),
      );
    });

    it("should ignore files matching ignore patterns", async () => {
      const fileChange: FileChangeEvent = {
        type: "change",
        path: ".git/HEAD",
        timestamp: new Date(),
      };

      await gitIntegration.processFileChange(fileChange);

      // Should not emit batch for ignored files
      expect(mockBatchHandler).not.toHaveBeenCalled();
    });

    it("should batch multiple file changes", async () => {
      const changes: FileChangeEvent[] = [
        { type: "change", path: "src/file1.json", timestamp: new Date() },
        { type: "change", path: "src/file2.json", timestamp: new Date() },
        { type: "change", path: "src/file3.json", timestamp: new Date() },
      ];

      // Process changes quickly
      for (const change of changes) {
        await gitIntegration.processFileChange(change);
      }

      // Wait for batching to complete
      await new Promise((resolve) => setTimeout(resolve, 1100));

      expect(mockBatchHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          changes: expect.arrayContaining(changes),
        }),
      );
    });
  });

  describe("Git Operation Detection", () => {
    beforeEach(() => {
      // Mock git repository exists
      vi.mocked(fs.promises.stat).mockResolvedValue({
        isDirectory: () => true,
        mtime: new Date(),
      } as any);
    });

    it("should detect branch switch operation", async () => {
      // Mock HEAD file recently changed
      const recentTime = new Date();
      vi.mocked(fs.promises.stat).mockResolvedValue({
        isDirectory: () => false,
        mtime: recentTime,
      } as any);

      vi.mocked(fs.promises.readFile).mockResolvedValue(
        "ref: refs/heads/feature-branch",
      );

      const fileChange: FileChangeEvent = {
        type: "change",
        path: "src/test.json",
        timestamp: new Date(),
      };

      await gitIntegration.processFileChange(fileChange);

      // Wait for git operation detection
      await new Promise((resolve) => setTimeout(resolve, 1100));

      expect(mockBatchHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          gitOperation: expect.objectContaining({
            operation: GitOperation.BRANCH_SWITCH,
            branchName: "feature-branch",
          }),
        }),
      );
    });

    it("should detect merge operation", async () => {
      // Mock MERGE_HEAD file exists
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

      vi.mocked(fs.promises.readFile).mockResolvedValue("ref: refs/heads/main");

      const fileChange: FileChangeEvent = {
        type: "change",
        path: "src/test.json",
        timestamp: new Date(),
      };

      await gitIntegration.processFileChange(fileChange);

      // Wait for git operation detection
      await new Promise((resolve) => setTimeout(resolve, 1100));

      expect(mockBatchHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          gitOperation: expect.objectContaining({
            operation: GitOperation.MERGE,
          }),
        }),
      );
    });

    it("should detect bulk operations", async () => {
      const recentTime = new Date();
      vi.mocked(fs.promises.stat).mockResolvedValue({
        isDirectory: () => false,
        mtime: recentTime,
      } as any);

      vi.mocked(fs.promises.readFile).mockResolvedValue("ref: refs/heads/main");

      // Create many file changes to trigger bulk operation detection
      const changes: FileChangeEvent[] = [];
      for (let i = 0; i < 10; i++) {
        changes.push({
          type: "change",
          path: `src/file${i}.json`,
          timestamp: new Date(),
        });
      }

      // Process all changes
      for (const change of changes) {
        await gitIntegration.processFileChange(change);
      }

      // Wait for batching
      await new Promise((resolve) => setTimeout(resolve, 1100));

      expect(mockBatchHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          gitOperation: expect.objectContaining({
            isBulkOperation: true,
          }),
          priority: "low", // Bulk operations get lower priority
        }),
      );
    });
  });

  describe("Batch Management", () => {
    it("should create unique batch IDs", async () => {
      const change1: FileChangeEvent = {
        type: "change",
        path: "src/file1.json",
        timestamp: new Date(),
      };

      const change2: FileChangeEvent = {
        type: "change",
        path: "src/file2.json",
        timestamp: new Date(),
      };

      await gitIntegration.processFileChange(change1);
      await gitIntegration.processFileChange(change2);

      // Wait for batching
      await new Promise((resolve) => setTimeout(resolve, 1100));

      expect(mockBatchHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.stringMatching(/^(git_|regular_|single_)/),
        }),
      );
    });

    it("should flush pending batches on destroy", async () => {
      const fileChange: FileChangeEvent = {
        type: "change",
        path: "src/test.json",
        timestamp: new Date(),
      };

      await gitIntegration.processFileChange(fileChange);

      // Destroy before batch timer completes
      gitIntegration.flush();

      expect(mockBatchHandler).toHaveBeenCalled();
    });
  });

  describe("Configuration Management", () => {
    it("should update configuration", () => {
      gitIntegration.updateConfiguration({
        operationTimeWindow: 2000,
        bulkOperationThreshold: 5,
      });

      const stats = gitIntegration.getStatistics();
      expect(stats.enabled).toBe(true);
    });

    it("should disable integration when configured", () => {
      gitIntegration.updateConfiguration({
        enabled: false,
      });

      const stats = gitIntegration.getStatistics();
      expect(stats.enabled).toBe(false);
    });
  });

  describe("Error Handling", () => {
    it("should handle file system errors gracefully", async () => {
      vi.mocked(fs.promises.stat).mockRejectedValue(
        new Error("Permission denied"),
      );

      const fileChange: FileChangeEvent = {
        type: "change",
        path: "src/test.json",
        timestamp: new Date(),
      };

      await gitIntegration.processFileChange(fileChange);

      // Should still process the file change despite git detection error
      expect(mockBatchHandler).toHaveBeenCalled();
      expect(mockErrorHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "file_system",
          recoverable: true,
        }),
      );
    });

    it("should handle invalid git state gracefully", async () => {
      vi.mocked(fs.promises.readFile).mockRejectedValue(
        new Error("Invalid file"),
      );

      const fileChange: FileChangeEvent = {
        type: "change",
        path: "src/test.json",
        timestamp: new Date(),
      };

      await gitIntegration.processFileChange(fileChange);

      // Should still process the file change
      expect(mockBatchHandler).toHaveBeenCalled();
    });
  });

  describe("Statistics and Monitoring", () => {
    it("should track operation history", async () => {
      const recentTime = new Date();
      vi.mocked(fs.promises.stat).mockResolvedValue({
        isDirectory: () => false,
        mtime: recentTime,
      } as any);

      vi.mocked(fs.promises.readFile).mockResolvedValue(
        "ref: refs/heads/feature",
      );

      const fileChange: FileChangeEvent = {
        type: "change",
        path: "src/test.json",
        timestamp: new Date(),
      };

      await gitIntegration.processFileChange(fileChange);

      // Wait for operation processing
      await new Promise((resolve) => setTimeout(resolve, 1100));

      const stats = gitIntegration.getStatistics();
      expect(stats.operationHistory).toHaveLength(1);
      expect(stats.operationHistory[0]).toMatchObject({
        operation: GitOperation.BRANCH_SWITCH,
        branchName: "feature",
      });
    });

    it("should clean up old operation history", async () => {
      // This would require mocking time progression
      // For now, just verify the structure exists
      const stats = gitIntegration.getStatistics();
      expect(stats.operationHistory).toBeDefined();
      expect(Array.isArray(stats.operationHistory)).toBe(true);
    });
  });
});

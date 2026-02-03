import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import os from "os";
import { fork, type ChildProcess } from "child_process";
import {
  MetadataManager,
  createEmptyMetadata,
  loadMetadata,
  cleanupExistingMetadata,
  getMetadataPath,
} from "./manager";
import type { TranslationEntry } from "../types";

// Worker helper for multi-process tests
const WORKER_PATH = path.join(__dirname, "manager.test.worker.ts");

interface WorkerMessage {
  type: "write" | "read" | "write-batch";
  dbPath: string;
  workerId?: string;
  entries?: Array<{ hash: string; sourceText?: string }>;
}

interface WorkerResponse {
  type: "success" | "error" | "ready";
  workerId?: string;
  totalEntries?: number;
  entries?: Record<string, TranslationEntry>;
  error?: string;
}

function spawnWorker(): Promise<ChildProcess> {
  return new Promise((resolve, reject) => {
    const worker = fork(WORKER_PATH, [], {
      execPath: path.join(__dirname, "../../node_modules/.bin/tsx"),
      stdio: ["pipe", "pipe", "pipe", "ipc"],
    });

    const timeout = setTimeout(() => {
      worker.kill();
      reject(new Error("Worker spawn timeout"));
    }, 5000);

    worker.once("message", (msg: WorkerResponse) => {
      clearTimeout(timeout);
      if (msg.type === "ready") {
        resolve(worker);
      } else {
        reject(new Error("Worker did not signal ready"));
      }
    });

    worker.once("error", (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

function sendToWorker(
  worker: ChildProcess,
  message: WorkerMessage,
): Promise<WorkerResponse> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error("Worker timeout")),
      10000,
    );
    worker.once("message", (response: WorkerResponse) => {
      clearTimeout(timeout);
      resolve(response);
    });
    worker.send(message);
  });
}

function createTestEntry(
  overrides: Partial<TranslationEntry> & {
    hash?: string;
    sourceText?: string;
  } = {},
): TranslationEntry {
  const hash = overrides.hash ?? `hash_${Math.random().toString(36).slice(2)}`;
  return {
    type: "content",
    hash,
    sourceText: overrides.sourceText ?? `Source text for ${hash}`,
    context: { filePath: "test.tsx", componentName: "TestComponent" },
    location: { filePath: "test.tsx", line: 1, column: 1 },
    ...overrides,
  } as TranslationEntry;
}

function createUniqueDbPath(): string {
  return path.join(
    os.tmpdir(),
    `lmdb-test-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  );
}

describe("MetadataManager", () => {
  let testDbPath: string;

  beforeEach(() => {
    testDbPath = createUniqueDbPath();
  });

  afterEach(() => {
    cleanupExistingMetadata(testDbPath);
  });

  describe("createEmptyMetadata", () => {
    it("should return valid empty metadata structure", () => {
      const metadata = createEmptyMetadata();

      expect(metadata.entries).toEqual({});
      expect(metadata.stats!.totalEntries).toBe(0);
      // Verify valid ISO date
      const date = new Date(metadata.stats!.lastUpdated);
      expect(date.getTime()).not.toBeNaN();
    });
  });

  describe("loadMetadata", () => {
    it("should return empty metadata for new database", () => {
      const metadata = loadMetadata(testDbPath);
      expect(metadata.entries).toEqual({});
      expect(metadata.stats!.totalEntries).toBe(0);
    });

    it("should load and preserve all entry fields", async () => {
      const manager = new MetadataManager(testDbPath);
      const entry: TranslationEntry = {
        type: "content",
        hash: "full-entry",
        sourceText: "Hello world",
        context: { filePath: "app.tsx", componentName: "AppComponent" },
        location: { filePath: "app.tsx", line: 42, column: 10 },
      };

      await manager.saveMetadataWithEntries([entry]);
      const metadata = loadMetadata(testDbPath);

      expect(metadata.entries["full-entry"]).toEqual(entry);
      expect(metadata.stats!.totalEntries).toBe(1);
    });

    it("should handle entries with very long sourceText", async () => {
      const manager = new MetadataManager(testDbPath);
      const longText = "A".repeat(100000);
      await manager.saveMetadataWithEntries([
        createTestEntry({ hash: "long-text", sourceText: longText }),
      ]);

      const metadata = manager.loadMetadata();
      expect(metadata.entries["long-text"].sourceText).toBe(longText);
    });
  });

  describe("saveMetadataWithEntries", () => {
    it("should save, accumulate, and update entries correctly", async () => {
      const manager = new MetadataManager(testDbPath);

      // Save single entry
      await manager.saveMetadataWithEntries([
        createTestEntry({ hash: "entry-1", sourceText: "v1" }),
      ]);
      expect(manager.loadMetadata().stats!.totalEntries).toBe(1);

      // Accumulate multiple entries
      await manager.saveMetadataWithEntries([
        createTestEntry({ hash: "entry-2" }),
        createTestEntry({ hash: "entry-3" }),
      ]);
      expect(manager.loadMetadata().stats!.totalEntries).toBe(3);

      // Update existing entry (count should not increase)
      const result = await manager.saveMetadataWithEntries([
        createTestEntry({ hash: "entry-1", sourceText: "v2" }),
      ]);
      expect(result.stats!.totalEntries).toBe(3);
      expect(result.entries["entry-1"].sourceText).toBe("v2");

      // Empty array should not change anything
      await manager.saveMetadataWithEntries([]);
      expect(manager.loadMetadata().stats!.totalEntries).toBe(3);
    });

    it("should handle large batch of entries", async () => {
      const manager = new MetadataManager(testDbPath);
      const entries = Array.from({ length: 1000 }, (_, i) =>
        createTestEntry({ hash: `batch-${i}` }),
      );

      const result = await manager.saveMetadataWithEntries(entries);
      expect(result.stats!.totalEntries).toBe(1000);
    });

    it("should maintain data integrity after many operations", async () => {
      const manager = new MetadataManager(testDbPath);

      // Many saves with overlapping keys
      for (let i = 0; i < 50; i++) {
        await manager.saveMetadataWithEntries([
          createTestEntry({
            hash: `persistent-${i % 10}`,
            sourceText: `v${i}`,
          }),
          createTestEntry({ hash: `unique-${i}` }),
        ]);
      }

      const final = manager.loadMetadata();
      // 10 persistent + 50 unique = 60
      expect(final.stats!.totalEntries).toBe(60);

      // Verify save result matches load result
      const saveResult = await manager.saveMetadataWithEntries([]);
      expect(saveResult.stats!.totalEntries).toBe(final.stats!.totalEntries);
    });
  });

  describe("concurrent access (single process)", () => {
    it("should handle concurrent operations from multiple manager instances", async () => {
      const manager1 = new MetadataManager(testDbPath);
      const manager2 = new MetadataManager(testDbPath);

      // Concurrent writes
      const promises = Array.from({ length: 20 }, (_, i) =>
        (i % 2 === 0 ? manager1 : manager2).saveMetadataWithEntries([
          createTestEntry({ hash: `concurrent-${i}` }),
        ]),
      );
      await Promise.all(promises);

      // Both managers should see all entries
      expect(manager1.loadMetadata().stats!.totalEntries).toBe(20);
      expect(manager2.loadMetadata().stats!.totalEntries).toBe(20);
    });
  });

  describe("cleanupExistingMetadata", () => {
    it("should remove database and allow reopening with fresh state", async () => {
      const manager1 = new MetadataManager(testDbPath);
      await manager1.saveMetadataWithEntries([
        createTestEntry({ hash: "before" }),
      ]);
      expect(fs.existsSync(testDbPath)).toBe(true);

      cleanupExistingMetadata(testDbPath);
      expect(fs.existsSync(testDbPath)).toBe(false);

      // Should work with fresh state after cleanup
      const manager2 = new MetadataManager(testDbPath);
      const metadata = manager2.loadMetadata();
      expect(metadata.entries["before"]).toBeUndefined();
      expect(metadata.stats!.totalEntries).toBe(0);
    });

    it("should handle non-existent path and multiple calls gracefully", () => {
      const nonExistent = path.join(os.tmpdir(), "does-not-exist-db");
      expect(() => cleanupExistingMetadata(nonExistent)).not.toThrow();
      expect(() => cleanupExistingMetadata(nonExistent)).not.toThrow();
    });
  });

  describe("getMetadataPath", () => {
    it("should return correct path based on environment and config", () => {
      const devResult = getMetadataPath({
        sourceRoot: "/app",
        lingoDir: ".lingo",
        environment: "development",
      });
      expect(devResult).toContain("metadata-dev");
      expect(devResult).not.toContain("metadata-build");

      const prodResult = getMetadataPath({
        sourceRoot: "/app",
        lingoDir: ".lingo",
        environment: "production",
      });
      expect(prodResult).toContain("metadata-build");

      const customResult = getMetadataPath({
        sourceRoot: "/app",
        lingoDir: ".custom-lingo",
        environment: "development",
      });
      expect(customResult).toContain(".custom-lingo");
    });
  });

  describe("singleton database connection", () => {
    it("should close previous db when switching paths", async () => {
      const path1 = createUniqueDbPath();
      const path2 = createUniqueDbPath();

      try {
        const manager1 = new MetadataManager(path1);
        await manager1.saveMetadataWithEntries([
          createTestEntry({ hash: "in-path1" }),
        ]);

        const manager2 = new MetadataManager(path2);
        await manager2.saveMetadataWithEntries([
          createTestEntry({ hash: "in-path2" }),
        ]);

        // Each database has its own data
        const result2 = manager2.loadMetadata();
        expect(result2.entries["in-path2"]).toBeDefined();
        expect(result2.entries["in-path1"]).toBeUndefined();
      } finally {
        cleanupExistingMetadata(path1);
        cleanupExistingMetadata(path2);
      }
    });
  });

  describe("error handling", () => {
    it("should throw descriptive error for invalid path", async () => {
      const invalidPath = "/root/definitely/cannot/create/this/path";
      expect(() => new MetadataManager(invalidPath)).toThrow();
    });
  });

  describe("multi-process scenarios (Next.js-like)", () => {
    // These tests spawn actual child processes to simulate Next.js workers.
    // Each process has its own singleton DatabaseConnection.
    // LMDB handles cross-process concurrency via OS-level locking (MVCC).

    it("should share data between separate processes", async () => {
      const worker1 = await spawnWorker();
      const worker2 = await spawnWorker();

      try {
        await sendToWorker(worker1, {
          type: "write",
          dbPath: testDbPath,
          entries: [{ hash: "from-process-1" }],
        });

        await sendToWorker(worker2, {
          type: "write",
          dbPath: testDbPath,
          entries: [{ hash: "from-process-2" }],
        });

        const read = await sendToWorker(worker1, {
          type: "read",
          dbPath: testDbPath,
        });
        expect(read.totalEntries).toBe(2);
        expect(read.entries?.["from-process-1"]).toBeDefined();
        expect(read.entries?.["from-process-2"]).toBeDefined();
      } finally {
        worker1.kill();
        worker2.kill();
      }
    });

    it("should simulate Next.js build: cleanup then multi-worker writes", async () => {
      // Pre-populate with "old" data
      const setup = new MetadataManager(testDbPath);
      await setup.saveMetadataWithEntries([
        createTestEntry({ hash: "old-entry-1" }),
        createTestEntry({ hash: "old-entry-2" }),
      ]);

      // Main runner cleans up (simulates Next.js build start)
      cleanupExistingMetadata(testDbPath);

      // Spawn workers (simulates Next.js build workers)
      const workers = await Promise.all([
        spawnWorker(),
        spawnWorker(),
        spawnWorker(),
      ]);

      try {
        // Workers write concurrently
        await Promise.all(
          workers.map((worker, i) =>
            sendToWorker(worker, {
              type: "write-batch",
              dbPath: testDbPath,
              entries: Array.from({ length: 5 }, (_, j) => ({
                hash: `worker${i}-file${j}`,
              })),
            }),
          ),
        );

        // Main process reads final metadata
        const finalMetadata = loadMetadata(testDbPath);
        expect(finalMetadata.stats!.totalEntries).toBe(15);
        expect(finalMetadata.entries["old-entry-1"]).toBeUndefined();
        expect(finalMetadata.entries["worker0-file0"]).toBeDefined();
      } finally {
        workers.forEach((w) => w.kill());
      }
    });
  });
});

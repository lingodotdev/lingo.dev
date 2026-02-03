import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import os from "os";
import {
  createEmptyMetadata,
  loadMetadata,
  saveMetadata,
  cleanupExistingMetadata,
  getMetadataPath,
} from "./manager";
import type { TranslationEntry } from "../types";

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

describe("metadata", () => {
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
    it("should return empty metadata for new database", async () => {
      const metadata = await loadMetadata(testDbPath);
      expect(metadata.entries).toEqual({});
      expect(metadata.stats!.totalEntries).toBe(0);
    });

    it("should load and preserve all entry fields", async () => {
      const entry: TranslationEntry = {
        type: "content",
        hash: "full-entry",
        sourceText: "Hello world",
        context: { filePath: "app.tsx", componentName: "AppComponent" },
        location: { filePath: "app.tsx", line: 42, column: 10 },
      };

      await saveMetadata(testDbPath, [entry]);
      const metadata = await loadMetadata(testDbPath);

      expect(metadata.entries["full-entry"]).toEqual(entry);
      expect(metadata.stats!.totalEntries).toBe(1);
    });

    it("should handle entries with very long sourceText", async () => {
      const longText = "A".repeat(100000);
      await saveMetadata(testDbPath, [
        createTestEntry({ hash: "long-text", sourceText: longText }),
      ]);

      const metadata = await loadMetadata(testDbPath);
      expect(metadata.entries["long-text"].sourceText).toBe(longText);
    });
  });

  describe("saveMetadata", () => {
    it("should save, accumulate, and update entries correctly", async () => {
      // Save single entry
      await saveMetadata(testDbPath, [
        createTestEntry({ hash: "entry-1", sourceText: "v1" }),
      ]);
      expect((await loadMetadata(testDbPath)).stats!.totalEntries).toBe(1);

      // Accumulate multiple entries
      await saveMetadata(testDbPath, [
        createTestEntry({ hash: "entry-2" }),
        createTestEntry({ hash: "entry-3" }),
      ]);
      expect((await loadMetadata(testDbPath)).stats!.totalEntries).toBe(3);

      // Update existing entry (count should not increase)
      const result = await saveMetadata(testDbPath, [
        createTestEntry({ hash: "entry-1", sourceText: "v2" }),
      ]);
      expect(result.stats!.totalEntries).toBe(3);
      expect(result.entries["entry-1"].sourceText).toBe("v2");

      // Empty array should not change anything
      await saveMetadata(testDbPath, []);
      expect((await loadMetadata(testDbPath)).stats!.totalEntries).toBe(3);
    });

    it("should handle large batch of entries", async () => {
      const entries = Array.from({ length: 1000 }, (_, i) =>
        createTestEntry({ hash: `batch-${i}` }),
      );

      const result = await saveMetadata(testDbPath, entries);
      expect(result.stats!.totalEntries).toBe(1000);
    });

    it("should maintain data integrity after many operations", async () => {
      // Many saves with overlapping keys
      for (let i = 0; i < 50; i++) {
        await saveMetadata(testDbPath, [
          createTestEntry({
            hash: `persistent-${i % 10}`,
            sourceText: `v${i}`,
          }),
          createTestEntry({ hash: `unique-${i}` }),
        ]);
      }

      const final = await loadMetadata(testDbPath);
      // 10 persistent + 50 unique = 60
      expect(final.stats!.totalEntries).toBe(60);

      // Verify save result matches load result
      const saveResult = await saveMetadata(testDbPath, []);
      expect(saveResult.stats!.totalEntries).toBe(final.stats!.totalEntries);
    });
  });

  describe("concurrent access (single process)", () => {
    it("should handle concurrent operations from multiple calls", async () => {
      // LMDB handles concurrent writes via OS-level locking
      const promises = Array.from({ length: 20 }, async (_, i) => {
        await saveMetadata(testDbPath, [
          createTestEntry({ hash: `concurrent-${i}` }),
        ]);
      });
      await Promise.all(promises);

      // Verify all entries are present
      expect((await loadMetadata(testDbPath)).stats!.totalEntries).toBe(20);
    });
  });

  describe("cleanupExistingMetadata", () => {
    it("should remove database and allow reopening with fresh state", async () => {
      await saveMetadata(testDbPath, [createTestEntry({ hash: "before" })]);
      expect(fs.existsSync(testDbPath)).toBe(true);

      // Cleanup should succeed because saveMetadata closes the DB
      cleanupExistingMetadata(testDbPath);
      expect(fs.existsSync(testDbPath)).toBe(false);

      // Should work with fresh state after cleanup
      const metadata = await loadMetadata(testDbPath);
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

  describe("error handling", () => {
    it("should throw descriptive error for invalid path", async () => {
      const invalidPath = "/root/definitely/cannot/create/this/path";
      await expect(loadMetadata(invalidPath)).rejects.toThrow();
    });
  });
});

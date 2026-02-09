import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import os from "os";
import {
  loadMetadata,
  saveMetadata,
  cleanupExistingMetadata,
  getMetadataPath,
} from "./manager";
import type { ContentTranslationEntry } from "../types";
import { generateTranslationHash } from "../utils/hash";

function createTestEntry(sourceText: string): ContentTranslationEntry {
  const context = { filePath: "test.tsx", componentName: "TestComponent" };
  return {
    type: "content",
    sourceText,
    context,
    location: { filePath: "test.tsx", line: 1, column: 1 },
    hash: generateTranslationHash(sourceText, context),
  };
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

  describe("loadMetadata", () => {
    it("should return empty metadata for new database", async () => {
      const metadata = await loadMetadata(testDbPath);
      expect(metadata).toEqual({});
    });

    it("should load and preserve all entry fields", async () => {
      const entry = createTestEntry("Hello world");

      await saveMetadata(testDbPath, [entry]);
      const metadata = await loadMetadata(testDbPath);

      expect(metadata[entry.hash]).toEqual(entry);
      expect(Object.keys(metadata).length).toBe(1);
    });

    it("should handle entries with very long sourceText", async () => {
      const longText = "A".repeat(100000);
      const entry = createTestEntry(longText);
      await saveMetadata(testDbPath, [entry]);

      const metadata = await loadMetadata(testDbPath);
      expect(metadata[entry.hash].sourceText).toBe(longText);
    });
  });

  describe("saveMetadata", () => {
    it("should save a single entry", async () => {
      const entry = createTestEntry("v1");
      await saveMetadata(testDbPath, [entry]);
      const metadata = await loadMetadata(testDbPath);
      expect(Object.keys(metadata).length).toBe(1);
      expect(metadata[entry.hash].sourceText).toBe("v1");
    });

    it("should accumulate entries across saves", async () => {
      await saveMetadata(testDbPath, [createTestEntry("text-1")]);
      await saveMetadata(testDbPath, [
        createTestEntry("text-2"),
        createTestEntry("text-3"),
      ]);
      const metadata = await loadMetadata(testDbPath);
      expect(Object.keys(metadata).length).toBe(3);
    });

    it("should overwrite existing entry on re-save", async () => {
      const entry = createTestEntry("text-1");
      await saveMetadata(testDbPath, [entry]);

      const updatedEntry = createTestEntry("text-1");
      updatedEntry.location = { filePath: "moved.tsx", line: 99, column: 5 };
      await saveMetadata(testDbPath, [updatedEntry]);

      const updated = await loadMetadata(testDbPath);
      expect(Object.keys(updated).length).toBe(1);
      expect(updated[entry.hash].location.filePath).toBe("moved.tsx");
    });

    it("should handle empty array save", async () => {
      await saveMetadata(testDbPath, []);
      const metadata = await loadMetadata(testDbPath);
      expect(Object.keys(metadata).length).toBe(0);
    });

    it("should handle large batch of entries", async () => {
      const entries = Array.from({ length: 100 }, (_, i) =>
        createTestEntry(`batch-${i}`),
      );

      await saveMetadata(testDbPath, entries);
      expect(Object.keys(await loadMetadata(testDbPath)).length).toBe(100);
    });
  });

  describe("concurrent access (single process)", () => {
    it("should handle 1000 concurrent operations", async () => {
      const promises = Array.from({ length: 1000 }, async (_, i) => {
        await saveMetadata(testDbPath, [createTestEntry(`entry-${i}`)]);
      });
      await Promise.all(promises);

      const final = await loadMetadata(testDbPath);
      expect(Object.keys(final).length).toBe(1000);
    });
  });

  describe("cleanupExistingMetadata", () => {
    it("should remove database and allow reopening with fresh state", async () => {
      const entry = createTestEntry("before");
      await saveMetadata(testDbPath, [entry]);
      expect(fs.existsSync(testDbPath)).toBe(true);

      // Cleanup should succeed because saveMetadata closes the DB
      cleanupExistingMetadata(testDbPath);
      expect(fs.existsSync(testDbPath)).toBe(false);

      // Should work with fresh state after cleanup
      const metadata = await loadMetadata(testDbPath);
      expect(metadata[entry.hash]).toBeUndefined();
      expect(Object.keys(metadata).length).toBe(0);
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
    it("should throw error for invalid path", async () => {
      const invalidPath = "/root/definitely/cannot/create/this/path";
      await expect(loadMetadata(invalidPath)).rejects.toThrow(
        `Failed to open LMDB at ${invalidPath}`,
      );
    });
  });
});

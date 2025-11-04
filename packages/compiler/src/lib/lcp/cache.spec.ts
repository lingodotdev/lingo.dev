import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { LCPCache } from "./cache";
import type { DictionaryCacheSchema, LCPSchema } from "./schema";

describe("LCPCache", () => {
  const testDir = path.join(process.cwd(), ".test-cache");
  const sourceRoot = ".";
  const lingoDir = ".test-cache";

  const mockLCP: LCPSchema = {
    files: {
      "test.tsx": {
        scopes: {
          "test-scope": {
            hash: "test-hash-123",
          },
        },
      },
    },
  };

  const mockDictionary = {
    version: 0.1,
    locale: "en",
    files: {
      "test.tsx": {
        entries: {
          "test-scope": "Hello World",
        },
      },
    },
  };

  beforeEach(() => {
    // Clean up test directory before each test
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
    fs.mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    // Clean up test directory after each test
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
  });

  describe("JSON format", () => {
    it("should write cache in JSON format", async () => {
      const params = { sourceRoot, lingoDir, lcp: mockLCP };

      await LCPCache.writeLocaleDictionary(mockDictionary, params);

      const cachePath = path.join(testDir, "dictionary.json");
      expect(fs.existsSync(cachePath)).toBe(true);

      const content = fs.readFileSync(cachePath, "utf8");
      // Should be valid JSON
      expect(() => JSON.parse(content)).not.toThrow();

      // Should not contain 'export default'
      expect(content).not.toContain("export default");
    });

    it("should read cache from JSON format", async () => {
      const params = { sourceRoot, lingoDir, lcp: mockLCP };

      // Write dictionary
      await LCPCache.writeLocaleDictionary(mockDictionary, params);

      // Read it back
      const dictionary = LCPCache.readLocaleDictionary("en", params);

      expect(dictionary.locale).toBe("en");
      expect(dictionary.version).toBe(0.1);
      expect(dictionary.files["test.tsx"].entries["test-scope"]).toBe(
        "Hello World",
      );
    });

    it("should return empty cache when file does not exist", () => {
      const params = { sourceRoot, lingoDir, lcp: mockLCP };

      const dictionary = LCPCache.readLocaleDictionary("en", params);

      expect(dictionary.locale).toBe("en");
      expect(dictionary.files).toEqual({});
    });

    it("should ensure dictionary file exists with empty JSON object", () => {
      const params = { sourceRoot, lingoDir };

      LCPCache.ensureDictionaryFile(params);

      const cachePath = path.join(testDir, "dictionary.json");
      expect(fs.existsSync(cachePath)).toBe(true);

      const content = fs.readFileSync(cachePath, "utf8");
      expect(content).toBe("{}");
    });

    it("should maintain stable key ordering", async () => {
      const params = { sourceRoot, lingoDir, lcp: mockLCP };

      const dictionaryWithMultipleEntries = {
        version: 0.1,
        locale: "en",
        files: {
          "zebra.tsx": {
            entries: {
              "zebra-scope": "Zebra",
            },
          },
          "alpha.tsx": {
            entries: {
              "alpha-scope": "Alpha",
            },
          },
          "beta.tsx": {
            entries: {
              "beta-scope": "Beta",
            },
          },
        },
      };

      const extendedLCP: LCPSchema = {
        files: {
          "zebra.tsx": { scopes: { "zebra-scope": { hash: "hash-z" } } },
          "alpha.tsx": { scopes: { "alpha-scope": { hash: "hash-a" } } },
          "beta.tsx": { scopes: { "beta-scope": { hash: "hash-b" } } },
        },
      };

      await LCPCache.writeLocaleDictionary(dictionaryWithMultipleEntries, {
        ...params,
        lcp: extendedLCP,
      });

      const cachePath = path.join(testDir, "dictionary.json");
      const content = fs.readFileSync(cachePath, "utf8");
      const cache = JSON.parse(content);

      // Files should be sorted alphabetically
      const fileKeys = Object.keys(cache.files);
      expect(fileKeys).toEqual(["alpha.tsx", "beta.tsx", "zebra.tsx"]);
    });
  });

  describe("Legacy format migration", () => {
    it("should migrate from legacy JS format to JSON", async () => {
      const legacyCachePath = path.join(testDir, "dictionary.js");
      const newCachePath = path.join(testDir, "dictionary.json");

      // Create legacy format file
      const legacyContent = `export default {
  "version": 0.1,
  "files": {
    "test.tsx": {
      "entries": {
        "test-scope": {
          "hash": "test-hash-123",
          "content": {
            "en": "Hello World"
          }
        }
      }
    }
  }
};`;
      fs.writeFileSync(legacyCachePath, legacyContent);

      const params = { sourceRoot, lingoDir, lcp: mockLCP };

      // Read should trigger migration
      const dictionary = LCPCache.readLocaleDictionary("en", params);

      expect(dictionary.locale).toBe("en");
      expect(dictionary.files["test.tsx"].entries["test-scope"]).toBe(
        "Hello World",
      );

      // Writing should create new JSON format and remove legacy
      await LCPCache.writeLocaleDictionary(mockDictionary, params);

      // New format should exist
      expect(fs.existsSync(newCachePath)).toBe(true);

      // Legacy file should be removed
      expect(fs.existsSync(legacyCachePath)).toBe(false);
    });

    it("should handle legacy format without 'export default' prefix", async () => {
      const legacyCachePath = path.join(testDir, "dictionary.js");

      // Create legacy format file without export statement (edge case)
      const legacyContent = `{
  "version": 0.1,
  "files": {}
}`;
      fs.writeFileSync(legacyCachePath, legacyContent);

      const params = { sourceRoot, lingoDir, lcp: mockLCP };

      const dictionary = LCPCache.readLocaleDictionary("en", params);

      expect(dictionary.version).toBe(0.1);
      expect(dictionary.files).toEqual({});
    });

    it("should handle corrupted legacy cache gracefully", () => {
      const legacyCachePath = path.join(testDir, "dictionary.js");

      // Create invalid legacy format
      fs.writeFileSync(legacyCachePath, "export default { invalid json");

      const params = { sourceRoot, lingoDir, lcp: mockLCP };

      // Should return empty cache without throwing
      const dictionary = LCPCache.readLocaleDictionary("en", params);

      expect(dictionary.files).toEqual({});
    });
  });

  describe("Multiple locales", () => {
    it("should handle multiple locales in cache", async () => {
      const params = { sourceRoot, lingoDir, lcp: mockLCP };

      // Write English dictionary
      await LCPCache.writeLocaleDictionary(mockDictionary, params);

      // Write Spanish dictionary
      const spanishDictionary = {
        version: 0.1,
        locale: "es",
        files: {
          "test.tsx": {
            entries: {
              "test-scope": "Hola Mundo",
            },
          },
        },
      };
      await LCPCache.writeLocaleDictionary(spanishDictionary, params);

      // Read English
      const enDictionary = LCPCache.readLocaleDictionary("en", params);
      expect(enDictionary.files["test.tsx"].entries["test-scope"]).toBe(
        "Hello World",
      );

      // Read Spanish
      const esDictionary = LCPCache.readLocaleDictionary("es", params);
      expect(esDictionary.files["test.tsx"].entries["test-scope"]).toBe(
        "Hola Mundo",
      );
    });

    it("should sort locales alphabetically in cache entries", async () => {
      const params = { sourceRoot, lingoDir, lcp: mockLCP };

      // Write locales in non-alphabetical order
      await LCPCache.writeLocaleDictionary(
        { ...mockDictionary, locale: "zh" },
        params,
      );
      await LCPCache.writeLocaleDictionary(
        { ...mockDictionary, locale: "en" },
        params,
      );
      await LCPCache.writeLocaleDictionary(
        { ...mockDictionary, locale: "es" },
        params,
      );

      const cachePath = path.join(testDir, "dictionary.json");
      const content = fs.readFileSync(cachePath, "utf8");
      const cache: DictionaryCacheSchema = JSON.parse(content);

      // Locales should be sorted
      const locales = Object.keys(
        cache.files["test.tsx"].entries["test-scope"].content,
      );
      expect(locales).toEqual(["en", "es", "zh"]);
    });
  });

  describe("Hash validation", () => {
    it("should invalidate cached entries when hash changes", async () => {
      const params = { sourceRoot, lingoDir, lcp: mockLCP };

      // Write initial dictionary
      await LCPCache.writeLocaleDictionary(mockDictionary, params);

      // Change the hash in LCP
      const updatedLCP: LCPSchema = {
        files: {
          "test.tsx": {
            scopes: {
              "test-scope": {
                hash: "new-hash-456", // Different hash
              },
            },
          },
        },
      };

      // Read with new hash
      const dictionary = LCPCache.readLocaleDictionary("en", {
        ...params,
        lcp: updatedLCP,
      });

      // Should not return the old entry because hash doesn't match
      expect(dictionary.files).toEqual({});
    });

    it("should reuse cached entries when hash matches", async () => {
      const params = { sourceRoot, lingoDir, lcp: mockLCP };

      // Write initial dictionary with multiple locales
      await LCPCache.writeLocaleDictionary(mockDictionary, params);
      await LCPCache.writeLocaleDictionary(
        { ...mockDictionary, locale: "es", files: { "test.tsx": { entries: { "test-scope": "Hola" } } } },
        params,
      );

      // Write French dictionary - should preserve existing locales
      const frenchDictionary = {
        version: 0.1,
        locale: "fr",
        files: {
          "test.tsx": {
            entries: {
              "test-scope": "Bonjour",
            },
          },
        },
      };
      await LCPCache.writeLocaleDictionary(frenchDictionary, params);

      // All three locales should exist
      const enDict = LCPCache.readLocaleDictionary("en", params);
      const esDict = LCPCache.readLocaleDictionary("es", params);
      const frDict = LCPCache.readLocaleDictionary("fr", params);

      expect(enDict.files["test.tsx"].entries["test-scope"]).toBe("Hello World");
      expect(esDict.files["test.tsx"].entries["test-scope"]).toBe("Hola");
      expect(frDict.files["test.tsx"].entries["test-scope"]).toBe("Bonjour");
    });
  });

  describe("Error handling", () => {
    it("should handle corrupted JSON cache gracefully", () => {
      const cachePath = path.join(testDir, "dictionary.json");
      fs.writeFileSync(cachePath, "{ invalid json }");

      const params = { sourceRoot, lingoDir, lcp: mockLCP };

      // Should return empty cache without throwing
      const dictionary = LCPCache.readLocaleDictionary("en", params);
      expect(dictionary.files).toEqual({});
    });

    it("should create directory if it does not exist", () => {
      const nonExistentDir = path.join(testDir, "nested", "deep");
      const params = { sourceRoot: ".", lingoDir: nonExistentDir };

      LCPCache.ensureDictionaryFile(params);

      const cachePath = path.join(nonExistentDir, "dictionary.json");
      expect(fs.existsSync(cachePath)).toBe(true);
    });
  });
});

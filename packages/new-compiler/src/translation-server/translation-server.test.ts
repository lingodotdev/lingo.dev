import { describe, expect, it } from "vitest";
import { hashConfig, stableStringify } from "./translation-server";

describe("stableStringify", () => {
  describe("consistency - same input produces same output", () => {
    it("should produce identical output for identical objects", () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(stableStringify(obj)).toBe(stableStringify(obj));
    });

    it("should produce identical output regardless of key order", () => {
      const obj1 = { a: 1, b: 2, c: 3 };
      const obj2 = { c: 3, a: 1, b: 2 };
      expect(stableStringify(obj1)).toBe(stableStringify(obj2));
    });

    it("should handle nested objects consistently", () => {
      const obj1 = { a: 1, nested: { x: 10, y: 20 } };
      const obj2 = { nested: { y: 20, x: 10 }, a: 1 };
      expect(stableStringify(obj1)).toBe(stableStringify(obj2));
    });

    it("should handle deeply nested objects", () => {
      const obj1 = {
        level1: {
          level2: {
            level3: { z: 3, y: 2, x: 1 },
            b: "beta",
          },
          a: "alpha",
        },
      };
      const obj2 = {
        level1: {
          a: "alpha",
          level2: {
            b: "beta",
            level3: { x: 1, y: 2, z: 3 },
          },
        },
      };
      expect(stableStringify(obj1)).toBe(stableStringify(obj2));
    });
  });

  describe("arrays", () => {
    it("should preserve array order", () => {
      const obj1 = { arr: [1, 2, 3] };
      const obj2 = { arr: [3, 2, 1] };
      expect(stableStringify(obj1)).not.toBe(stableStringify(obj2));
    });

    it("should handle arrays of objects", () => {
      const obj1 = {
        items: [
          { b: 2, a: 1 },
          { d: 4, c: 3 },
        ],
      };
      const obj2 = {
        items: [
          { a: 1, b: 2 },
          { c: 3, d: 4 },
        ],
      };
      expect(stableStringify(obj1)).toBe(stableStringify(obj2));
    });

    it("should handle nested arrays", () => {
      const obj = {
        matrix: [
          [1, 2],
          [3, 4],
        ],
      };
      const result = stableStringify(obj);
      expect(result).toContain("[[1,2],[3,4]]");
    });
  });

  describe("filtering - removes non-serializable values", () => {
    it("should filter out undefined values", () => {
      const obj = { a: 1, b: undefined, c: 3 };
      const result = stableStringify(obj);
      expect(result).not.toContain("b");
      expect(result).toBe('{"a":1,"c":3}');
    });

    it("should filter out undefined in arrays", () => {
      const obj = { arr: [1, undefined, 2, undefined, 3] };
      const result = stableStringify(obj);
      expect(result).toBe('{"arr":[1,2,3]}');
    });
  });

  describe("complex nested structures", () => {
    it("should handle mixed nested types", () => {
      const obj = {
        string: "value",
        number: 123,
        boolean: true,
        null: null,
        array: [1, 2, { nested: "item" }],
        object: {
          deep: {
            deeper: {
              value: "deepest",
            },
          },
        },
      };
      const result = stableStringify(obj);
      expect(result).toContain('"string":"value"');
      expect(result).toContain('"number":123');
      expect(result).toContain('"boolean":true');
      expect(result).toContain('"null":null');
      expect(result).toContain('"value":"deepest"');
    });

    it("should be deterministic across multiple calls", () => {
      const obj = {
        z: 26,
        a: 1,
        m: { y: 2, x: 1 },
        arr: [3, 2, 1],
      };
      const results = Array.from({ length: 10 }, () => stableStringify(obj));
      const allSame = results.every((r) => r === results[0]);
      expect(allSame).toBe(true);
    });
  });
});

describe("hashConfig", () => {
  describe("stability - same config produces same hash", () => {
    it("should produce same hash for identical configs", () => {
      const config = {
        sourceLocale: "en",
        targetLocales: ["es", "fr"],
        sourceRoot: "src",
      };
      const hash1 = hashConfig(config);
      const hash2 = hashConfig(config);
      expect(hash1).toBe(hash2);
    });

    it("should produce same hash regardless of key order", () => {
      const config1 = {
        sourceLocale: "en",
        targetLocales: ["es", "fr"],
        sourceRoot: "src",
      };
      const config2 = {
        targetLocales: ["es", "fr"],
        sourceRoot: "src",
        sourceLocale: "en",
      };
      const hash1 = hashConfig(config1);
      const hash2 = hashConfig(config2);
      expect(hash1).toBe(hash2);
    });

    it("should produce same hash for nested objects with different key order", () => {
      const config1 = {
        sourceLocale: "en",
        dev: { port: 3000, host: "localhost" },
        models: { en_es: "model1" },
      };
      const config2 = {
        models: { en_es: "model1" },
        sourceLocale: "en",
        dev: { host: "localhost", port: 3000 },
      };
      expect(hashConfig(config1)).toBe(hashConfig(config2));
    });
  });

  describe("differentiation - different configs produce different hashes", () => {
    it("should produce different hash when value changes", () => {
      const config1 = { sourceLocale: "en", targetLocales: ["es"] };
      const config2 = { sourceLocale: "en", targetLocales: ["fr"] };
      expect(hashConfig(config1)).not.toBe(hashConfig(config2));
    });

    it("should produce different hash when nested value changes", () => {
      const config1 = {
        sourceLocale: "en",
        dev: { port: 3000 },
      };
      const config2 = {
        sourceLocale: "en",
        dev: { port: 4000 },
      };
      expect(hashConfig(config1)).not.toBe(hashConfig(config2));
    });

    it("should produce different hash when key is added", () => {
      const config1 = { sourceLocale: "en" };
      const config2 = { sourceLocale: "en", sourceRoot: "src" };
      expect(hashConfig(config1)).not.toBe(hashConfig(config2));
    });

    it("should produce different hash when array order changes", () => {
      const config1 = { targetLocales: ["es", "fr", "de"] };
      const config2 = { targetLocales: ["de", "es", "fr"] };
      expect(hashConfig(config1)).not.toBe(hashConfig(config2));
    });
  });

  describe("real-world config examples", () => {
    it("should handle typical translation config", () => {
      const config = {
        sourceLocale: "en",
        targetLocales: ["es", "fr", "de"],
        sourceRoot: "src",
        lingoDir: ".lingo",
        models: "lingo.dev",
        pluralization: { enabled: true, model: "groq:llama3" },
        dev: {
          translationServerStartPort: 60000,
          usePseudotranslator: false,
        },
      };
      const hash = hashConfig(config);
      expect(hash).toMatch(/^[a-f0-9]{12}$/);
    });

    it("should differentiate configs with different translator settings", () => {
      const config1 = {
        sourceLocale: "en",
        models: "lingo.dev",
      };
      const config2 = {
        sourceLocale: "en",
        models: { "en:es": "openai:gpt-4" },
      };
      expect(hashConfig(config1)).not.toBe(hashConfig(config2));
    });
  });
});

import { describe, it, expect } from "vitest";
import { generateTranslationHash, isValidHash } from "./hash";

describe("hash utilities", () => {
  describe("generateTranslationHash", () => {
    it("should generate consistent hashes for same input", () => {
      const hash1 = generateTranslationHash("Hello", {
        componentName: "Component",
      });
      const hash2 = generateTranslationHash("Hello", {
        componentName: "Component",
      });
      expect(hash1).toBe(hash2);
    });

    it("should generate different hashes for different text", () => {
      const hash1 = generateTranslationHash("Hello", {
        componentName: "Component",
      });
      const hash2 = generateTranslationHash("World", {
        componentName: "Component",
      });
      expect(hash1).not.toBe(hash2);
    });

    it("should generate different hashes for different components", () => {
      const hash1 = generateTranslationHash("Hello", {
        componentName: "Component1",
      });
      const hash2 = generateTranslationHash("Hello", {
        componentName: "Component2",
      });
      expect(hash1).not.toBe(hash2);
    });
  });

  describe("isValidHash", () => {
    it("should validate correct hash format", () => {
      expect(isValidHash("a1b2c3d4e5f6")).toBe(true);
      expect(isValidHash("000000000000")).toBe(true);
      expect(isValidHash("abcdef123456")).toBe(true);
    });

    it("should reject invalid hash formats", () => {
      expect(isValidHash("too-short")).toBe(false);
      expect(isValidHash("toolongforhash")).toBe(false);
      expect(isValidHash("ABCDEF123456")).toBe(false); // uppercase
      expect(isValidHash("xyz123456789")).toBe(false); // contains x, y, z
      expect(isValidHash("")).toBe(false);
    });
  });
});

import { describe, it, expect } from "vitest";
import {
  generateTranslationHash,
  isValidHash,
  generateShortHash,
} from "./hash";

describe("hash utilities", () => {
  describe("generateTranslationHash", () => {
    it("should generate a 12-character hash", () => {
      const hash = generateTranslationHash(
        "Hello World",
        "MyComponent",
        "src/MyComponent.tsx",
      );
      expect(hash).toHaveLength(12);
    });

    it("should generate consistent hashes for same input", () => {
      const hash1 = generateTranslationHash("Hello", "Component", "file.tsx");
      const hash2 = generateTranslationHash("Hello", "Component", "file.tsx");
      expect(hash1).toBe(hash2);
    });

    it("should generate different hashes for different text", () => {
      const hash1 = generateTranslationHash("Hello", "Component", "file.tsx");
      const hash2 = generateTranslationHash("World", "Component", "file.tsx");
      expect(hash1).not.toBe(hash2);
    });

    it("should generate different hashes for different components", () => {
      const hash1 = generateTranslationHash("Hello", "Component1", "file.tsx");
      const hash2 = generateTranslationHash("Hello", "Component2", "file.tsx");
      expect(hash1).not.toBe(hash2);
    });

    it("should generate different hashes for different files", () => {
      const hash1 = generateTranslationHash("Hello", "Component", "file1.tsx");
      const hash2 = generateTranslationHash("Hello", "Component", "file2.tsx");
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

  describe("generateShortHash", () => {
    it("should generate an 8-character hash", () => {
      const hash = generateShortHash("test input");
      expect(hash).toHaveLength(8);
    });

    it("should generate consistent hashes", () => {
      const hash1 = generateShortHash("test");
      const hash2 = generateShortHash("test");
      expect(hash1).toBe(hash2);
    });
  });
});

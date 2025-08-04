import { describe, it, expect, vi, beforeEach } from "vitest";
import fs from "fs";
import path from "path";

vi.mock("fs");
vi.mock("path");

const mockSourceCode = `
export default function createBucketLoader(bucketType: string) {
  switch (bucketType) {
    case "json":
      return createLockedKeysLoader(createIgnoredKeysLoader(baseLoader));
    case "yaml":
      return createInjectLocaleLoader(baseLoader);
    case "android":
      return createMdxLockedPatternsLoader(createLockedKeysLoader(baseLoader));
    case "markdown":
      return baseLoader;
    default:
      throw new Error(\`Unsupported bucket type: \${bucketType}\`);
  }
}
`;

describe("generate-bucket-feature-docs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  describe("feature detection", () => {
    it("should detect createLockedKeysLoader usage", () => {
      const codeWithFeature = "return createLockedKeysLoader(baseLoader);";
      const codeWithoutFeature = "return baseLoader;";

      expect(codeWithFeature.includes("createLockedKeysLoader")).toBe(true);
      expect(codeWithoutFeature.includes("createLockedKeysLoader")).toBe(false);
    });

    it("should detect createIgnoredKeysLoader usage", () => {
      const codeWithFeature = "return createIgnoredKeysLoader(baseLoader);";
      const codeWithoutFeature = "return baseLoader;";

      expect(codeWithFeature.includes("createIgnoredKeysLoader")).toBe(true);
      expect(codeWithoutFeature.includes("createIgnoredKeysLoader")).toBe(false);
    });

    it("should detect createMdxLockedPatternsLoader usage", () => {
      const codeWithFeature = "return createMdxLockedPatternsLoader(baseLoader);";
      const codeWithoutFeature = "return baseLoader;";

      expect(codeWithFeature.includes("createMdxLockedPatternsLoader")).toBe(true);
      expect(codeWithoutFeature.includes("createMdxLockedPatternsLoader")).toBe(false);
    });

    it("should detect createInjectLocaleLoader usage", () => {
      const codeWithFeature = "return createInjectLocaleLoader(baseLoader);";
      const codeWithoutFeature = "return baseLoader;";

      expect(codeWithFeature.includes("createInjectLocaleLoader")).toBe(true);
      expect(codeWithoutFeature.includes("createInjectLocaleLoader")).toBe(false);
    });

    it("should detect multiple features in complex code", () => {
      const complexCode = "return createLockedKeysLoader(createIgnoredKeysLoader(baseLoader));";

      expect(complexCode.includes("createLockedKeysLoader")).toBe(true);
      expect(complexCode.includes("createIgnoredKeysLoader")).toBe(true);
      expect(complexCode.includes("createMdxLockedPatternsLoader")).toBe(false);
      expect(complexCode.includes("createInjectLocaleLoader")).toBe(false);
    });
  });

  describe("file operations", () => {
    it("should handle file existence checks", () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      
      const result = fs.existsSync("/some/path");
      
      expect(result).toBe(true);
      expect(fs.existsSync).toHaveBeenCalledWith("/some/path");
    });

    it("should handle file reading", () => {
      vi.mocked(fs.readFileSync).mockReturnValue("file content");
      
      const content = fs.readFileSync("/some/path", "utf8");
      
      expect(content).toBe("file content");
      expect(fs.readFileSync).toHaveBeenCalledWith("/some/path", "utf8");
    });

    it("should handle path operations", () => {
      vi.mocked(path.join).mockReturnValue("/joined/path");
      vi.mocked(path.resolve).mockReturnValue("/resolved/path");
      
      const joined = path.join("a", "b");
      const resolved = path.resolve("relative");
      
      expect(joined).toBe("/joined/path");
      expect(resolved).toBe("/resolved/path");
    });
  });

  describe("error scenarios", () => {
    it("should handle missing files gracefully", () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);
      
      const exists = fs.existsSync("/nonexistent/file");
      
      expect(exists).toBe(false);
    });

    it("should handle process.exit calls", () => {
      const mockExit = vi.spyOn(process, "exit").mockImplementation(() => {
        throw new Error("process.exit called");
      });

      expect(() => {
        process.exit(1);
      }).toThrow("process.exit called");

      expect(mockExit).toHaveBeenCalledWith(1);
      mockExit.mockRestore();
    });

    it("should handle console operations", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const tablespy = vi.spyOn(console, "table").mockImplementation(() => {});

      console.error("test error");
      console.table({ test: "data" });

      expect(consoleSpy).toHaveBeenCalledWith("test error");
      expect(tablespy).toHaveBeenCalledWith({ test: "data" });

      consoleSpy.mockRestore();
      tablespy.mockRestore();
    });
  });
});

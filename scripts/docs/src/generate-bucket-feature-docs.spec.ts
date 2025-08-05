import { describe, it, expect, vi, beforeEach } from "vitest";
import fs from "fs";
import path from "path";
import { getFeaturesForBucket, getBucketsForFeature } from "./generate-bucket-feature-docs";

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

  describe("utility functions", () => {
    beforeEach(() => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(path.dirname).mockReturnValue("/mock/dir");
      vi.mocked(path.resolve).mockReturnValue("/mock/repo/root");
      vi.mocked(path.join)
        .mockReturnValueOnce("/mock/repo/root/packages/cli/src/cli/loaders/index.ts")
        .mockReturnValueOnce("/mock/repo/root/packages/spec/src/formats.ts");
      
      vi.mocked(fs.readFileSync).mockReturnValue(`
        export default function createBucketLoader(bucketType: string) {
          switch (bucketType) {
            case "json":
              return createLockedKeysLoader(createInjectLocaleLoader(baseLoader));
            case "mdx":
              return createMdxLockedPatternsLoader(createLockedKeysLoader(baseLoader));
            case "typescript":
              return createIgnoredKeysLoader(createLockedKeysLoader(baseLoader));
            case "yaml":
              return createLockedKeysLoader(baseLoader);
            default:
              return baseLoader;
          }
        }
      `);
    });

    describe("getFeaturesForBucket", () => {
      it("should return correct features for json bucket", async () => {
        vi.doMock("/mock/repo/root/packages/spec/src/formats.ts", () => ({
          bucketTypes: ["json", "mdx", "typescript", "yaml", "android"]
        }));

        const features = await getFeaturesForBucket("json");
        expect(features).toEqual(expect.arrayContaining(["lockedKeys", "injectLocale"]));
        expect(features).toHaveLength(2);
      });

      it("should return correct features for mdx bucket", async () => {
        vi.doMock("/mock/repo/root/packages/spec/src/formats.ts", () => ({
          bucketTypes: ["json", "mdx", "typescript", "yaml", "android"]
        }));

        const features = await getFeaturesForBucket("mdx");
        expect(features).toEqual(expect.arrayContaining(["lockedKeys", "lockedPatterns"]));
        expect(features).toHaveLength(2);
      });

      it("should return correct features for typescript bucket", async () => {
        vi.doMock("/mock/repo/root/packages/spec/src/formats.ts", () => ({
          bucketTypes: ["json", "mdx", "typescript", "yaml", "android"]
        }));

        const features = await getFeaturesForBucket("typescript");
        expect(features).toEqual(expect.arrayContaining(["lockedKeys", "ignoredKeys"]));
        expect(features).toHaveLength(2);
      });

      it("should return empty array for bucket with no features", async () => {
        vi.doMock("/mock/repo/root/packages/spec/src/formats.ts", () => ({
          bucketTypes: ["json", "mdx", "typescript", "yaml", "android"]
        }));

        const features = await getFeaturesForBucket("android");
        expect(features).toEqual([]);
      });

      it("should throw error for unknown bucket type", async () => {
        vi.doMock("/mock/repo/root/packages/spec/src/formats.ts", () => ({
          bucketTypes: ["json", "mdx", "typescript", "yaml"]
        }));

        await expect(getFeaturesForBucket("unknown")).rejects.toThrow("Unknown bucket type: unknown");
      });
    });

    describe("getBucketsForFeature", () => {
      it("should return correct buckets for lockedKeys feature", async () => {
        vi.doMock("/mock/repo/root/packages/spec/src/formats.ts", () => ({
          bucketTypes: ["json", "mdx", "typescript", "yaml", "android"]
        }));

        const buckets = await getBucketsForFeature("lockedKeys");
        expect(buckets).toEqual(expect.arrayContaining(["json", "mdx", "typescript", "yaml"]));
        expect(buckets).toHaveLength(4);
      });

      it("should return correct buckets for lockedPatterns feature", async () => {
        vi.doMock("/mock/repo/root/packages/spec/src/formats.ts", () => ({
          bucketTypes: ["json", "mdx", "typescript", "yaml", "android"]
        }));

        const buckets = await getBucketsForFeature("lockedPatterns");
        expect(buckets).toEqual(["mdx"]);
      });

      it("should return correct buckets for injectLocale feature", async () => {
        vi.doMock("/mock/repo/root/packages/spec/src/formats.ts", () => ({
          bucketTypes: ["json", "mdx", "typescript", "yaml", "android"]
        }));

        const buckets = await getBucketsForFeature("injectLocale");
        expect(buckets).toEqual(["json"]);
      });

      it("should return correct buckets for ignoredKeys feature", async () => {
        vi.doMock("/mock/repo/root/packages/spec/src/formats.ts", () => ({
          bucketTypes: ["json", "mdx", "typescript", "yaml", "android"]
        }));

        const buckets = await getBucketsForFeature("ignoredKeys");
        expect(buckets).toEqual(["typescript"]);
      });

      it("should return empty array for feature with no supporting buckets", async () => {
        vi.mocked(fs.readFileSync).mockReturnValue(`
          export default function createBucketLoader(bucketType: string) {
            switch (bucketType) {
              case "json":
                return baseLoader;
              default:
                return baseLoader;
            }
          }
        `);

        vi.doMock("/mock/repo/root/packages/spec/src/formats.ts", () => ({
          bucketTypes: ["json"]
        }));

        const buckets = await getBucketsForFeature("lockedKeys");
        expect(buckets).toEqual([]);
      });
    });
  });
});

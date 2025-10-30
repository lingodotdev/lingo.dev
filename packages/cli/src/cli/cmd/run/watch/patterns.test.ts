import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { minimatch } from "minimatch";
import { glob } from "glob";
import { PatternResolver } from "./patterns";
import { CmdRunContext } from "../_types";
import { getBuckets } from "../../../utils/buckets";

// Mock dependencies
vi.mock("minimatch");
vi.mock("glob");
vi.mock("../../../utils/buckets");

const mockMinimatch = vi.mocked(minimatch);
const mockGlob = vi.mocked(glob);
const mockGetBuckets = vi.mocked(getBuckets);

describe("PatternResolver", () => {
  let patternResolver: PatternResolver;
  let mockContext: CmdRunContext;

  beforeEach(() => {
    patternResolver = new PatternResolver();

    // Create a basic mock context
    mockContext = {
      flags: {
        bucket: undefined,
        key: undefined,
        file: undefined,
        apiKey: undefined,
        force: undefined,
        frozen: undefined,
        verbose: undefined,
        strict: undefined,
        interactive: false,
        concurrency: 10,
        debug: false,
        sourceLocale: "en",
        targetLocale: undefined,
        watch: false,
        debounce: 5000,
        sound: undefined,
        watchInclude: undefined,
        watchExclude: undefined,
        watchConfig: undefined,
        debounceStrategy: "simple" as const,
        maxWait: undefined,
        quiet: false,
        progress: true,
        notifications: false,
        batchSize: 50,
        rateLimitDelay: 100,
      },
      config: {
        locale: {
          source: "en",
        },
      } as any,
      localizer: null,
      tasks: [],
      results: new Map(),
    };

    // Reset all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("resolveWatchPatterns", () => {
    it("should return empty patterns when no config is provided", async () => {
      mockContext.config = null;

      const result = await patternResolver.resolveWatchPatterns(mockContext);

      expect(result).toEqual({
        include: [],
        exclude: [],
        resolved: [],
      });
    });

    it("should resolve patterns from bucket configuration", async () => {
      const mockBuckets = [
        {
          type: "json",
          paths: [{ pathPattern: "src/locales/[locale].json" }],
        },
      ];

      mockGetBuckets.mockReturnValue(mockBuckets);
      mockGlob.mockResolvedValue(["src/locales/en.json"]);

      const result = await patternResolver.resolveWatchPatterns(mockContext);

      expect(result.include).toContain("src/locales/en.json");
      expect(result.exclude).toContain("**/node_modules/**");
      expect(result.resolved).toContain("src/locales/en.json");
    });

    it("should filter buckets by type when bucket flag is specified", async () => {
      mockContext.flags.bucket = ["json"];

      const mockBuckets = [
        {
          type: "json",
          paths: [{ pathPattern: "src/locales/[locale].json" }],
        },
        {
          type: "yaml",
          paths: [{ pathPattern: "src/locales/[locale].yaml" }],
        },
      ];

      mockGetBuckets.mockReturnValue(mockBuckets);
      mockGlob.mockResolvedValue(["src/locales/en.json"]);

      const result = await patternResolver.resolveWatchPatterns(mockContext);

      expect(result.include).toContain("src/locales/en.json");
      expect(result.include).not.toContain("src/locales/en.yaml");
    });
  });

  describe("validatePatterns", () => {
    it("should validate correct patterns", () => {
      mockMinimatch.mockReturnValue(true);

      const patterns = ["src/**/*.json", "config/*.yaml"];
      const result = patternResolver.validatePatterns(patterns);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect empty patterns", () => {
      const patterns = ["src/**/*.json", "", "  ", "config/*.yaml"];
      const result = patternResolver.validatePatterns(patterns);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Empty pattern found");
    });

    it("should detect invalid glob syntax", () => {
      mockMinimatch.mockImplementation((testPath: string, pattern: string) => {
        if (pattern === "invalid[pattern") {
          throw new Error("Invalid glob syntax");
        }
        return true;
      });

      const patterns = ["src/**/*.json", "invalid[pattern"];
      const result = patternResolver.validatePatterns(patterns);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(
        result.errors.some(
          (e) => e.includes("Invalid") || e.includes("pattern"),
        ),
      ).toBe(true);
    });

    it("should warn about overly broad patterns", () => {
      mockMinimatch.mockReturnValue(true);

      const patterns = ["**/**/**/*.json"];
      const result = patternResolver.validatePatterns(patterns);

      expect(result.isValid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(
        result.warnings.some(
          (w) => w.includes("broad") || w.includes("performance"),
        ),
      ).toBe(true);
    });

    it("should warn about platform-specific path issues", () => {
      mockMinimatch.mockReturnValue(true);

      // Mock Windows platform
      Object.defineProperty(process, "platform", { value: "win32" });

      const patterns = ["/absolute/path/*.json"];
      const result = patternResolver.validatePatterns(patterns);

      expect(
        result.warnings.some(
          (w) => w.includes("Windows") || w.includes("absolute"),
        ),
      ).toBe(true);
    });
  });

  describe("expandGlobPatterns", () => {
    it("should expand glob patterns to file paths", async () => {
      const patterns = ["src/**/*.json", "config/*.yaml"];
      const mockFiles1 = ["src/locales/en.json", "src/locales/fr.json"];
      const mockFiles2 = ["config/app.yaml"];

      mockGlob
        .mockResolvedValueOnce(mockFiles1)
        .mockResolvedValueOnce(mockFiles2);

      const result = await patternResolver.expandGlobPatterns(patterns);

      expect(result).toEqual(
        expect.arrayContaining([...mockFiles1, ...mockFiles2]),
      );
      expect(mockGlob).toHaveBeenCalledTimes(2);
    });

    it("should handle glob expansion errors gracefully", async () => {
      const patterns = ["src/**/*.json", "invalid-pattern"];

      mockGlob
        .mockResolvedValueOnce(["src/locales/en.json"])
        .mockRejectedValueOnce(new Error("Glob expansion failed"));

      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const result = await patternResolver.expandGlobPatterns(patterns);

      expect(result).toEqual(["src/locales/en.json"]);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Failed to expand pattern"),
      );
    });

    it("should remove duplicates and sort results", async () => {
      const patterns = ["src/**/*.json"];
      const mockFiles = ["src/b.json", "src/a.json", "src/a.json"]; // Duplicate

      mockGlob.mockResolvedValue(mockFiles);

      const result = await patternResolver.expandGlobPatterns(patterns);

      expect(result).toEqual(["src/a.json", "src/b.json"]); // Sorted and deduplicated
    });
  });

  describe("applyFilters", () => {
    beforeEach(() => {
      mockMinimatch.mockImplementation((file: string, pattern: string) => {
        // Simple mock implementation for testing
        if (pattern === "src/**/*.json")
          return file.includes("src") && file.endsWith(".json");
        if (pattern === "**/node_modules/**")
          return file.includes("node_modules");
        if (pattern === "**/*.temp") return file.endsWith(".temp");
        return false;
      });
    });

    it("should apply include filters correctly", () => {
      const files = [
        "src/en.json",
        "src/fr.json",
        "config/app.yaml",
        "docs/readme.md",
      ];
      const includePatterns = ["src/**/*.json"];
      const excludePatterns: string[] = [];

      const result = patternResolver.applyFilters(
        files,
        includePatterns,
        excludePatterns,
      );

      expect(result).toEqual(["src/en.json", "src/fr.json"]);
    });

    it("should apply exclude filters correctly", () => {
      const files = [
        "src/en.json",
        "node_modules/lib.json",
        "temp.temp",
        "config.yaml",
      ];
      const includePatterns: string[] = [];
      const excludePatterns = ["**/node_modules/**", "**/*.temp"];

      const result = patternResolver.applyFilters(
        files,
        includePatterns,
        excludePatterns,
      );

      expect(result).toEqual(["src/en.json", "config.yaml"]);
    });

    it("should apply both include and exclude filters", () => {
      const files = ["src/en.json", "src/temp.json", "config/app.yaml"];
      const includePatterns = ["src/**/*.json"];
      const excludePatterns = ["**/*temp*"];

      mockMinimatch.mockImplementation((file: string, pattern: string) => {
        if (pattern === "src/**/*.json")
          return file.includes("src") && file.endsWith(".json");
        if (pattern === "**/*temp*") return file.includes("temp");
        return false;
      });

      const result = patternResolver.applyFilters(
        files,
        includePatterns,
        excludePatterns,
      );

      expect(result).toEqual(["src/en.json"]);
    });
  });

  describe("replaceLocalePlaceholders", () => {
    it("should replace [locale] placeholder", () => {
      const patterns = [
        "src/locales/[locale].json",
        "config/[locale]/app.yaml",
      ];
      const locale = "en-US";

      const result = patternResolver.replaceLocalePlaceholders(
        patterns,
        locale,
      );

      expect(result).toEqual([
        "src/locales/en-US.json",
        "config/en-US/app.yaml",
      ]);
    });

    it("should replace multiple placeholder formats", () => {
      const patterns = [
        "src/[locale].json",
        "config/{locale}.yaml",
        "assets/[locale_underscore].png",
        "meta/{locale_base}.xml",
      ];
      const locale = "en-US";

      const result = patternResolver.replaceLocalePlaceholders(
        patterns,
        locale,
      );

      expect(result[0]).toBe("src/en-US.json");
      expect(result[1]).toBe("config/en-US.yaml");
      expect(result[2]).toBe("assets/en_US.png");
      expect(result[3]).toBe("meta/en.xml");
    });

    it("should replace dollar sign placeholder formats", () => {
      const patterns = ["docs/${locale}.md"];
      const locale = "en-US";

      const result = patternResolver.replaceLocalePlaceholders(
        patterns,
        locale,
      );

      // The current implementation should replace ${locale} correctly
      expect(result[0]).toBe("docs/en-US.md");
    });
  });

  describe("normalizePaths", () => {
    it("should normalize paths to use forward slashes", () => {
      const paths = [
        "src\\locales\\en.json",
        "config/app.yaml",
        "docs\\readme.md",
      ];

      const result = patternResolver.normalizePaths(paths);

      expect(result).toEqual([
        "src/locales/en.json",
        "config/app.yaml",
        "docs/readme.md",
      ]);
    });

    it("should remove duplicate slashes", () => {
      const paths = ["src//locales///en.json", "config////app.yaml"];

      const result = patternResolver.normalizePaths(paths);

      expect(result).toEqual(["src/locales/en.json", "config/app.yaml"]);
    });

    it("should handle relative path normalization", () => {
      const paths = [
        "./src/locales/en.json",
        "./config/app.yaml",
        "docs/readme.md",
      ];

      const result = patternResolver.normalizePaths(paths);

      expect(result).toEqual([
        "src/locales/en.json",
        "config/app.yaml",
        "docs/readme.md",
      ]);
    });

    it("should remove trailing slashes except for root", () => {
      const paths = ["src/locales/", "config/", "/", "docs/readme.md"];

      const result = patternResolver.normalizePaths(paths);

      expect(result).toEqual(["src/locales", "config", "/", "docs/readme.md"]);
    });
  });

  describe("shouldWatchFile", () => {
    beforeEach(() => {
      mockMinimatch.mockImplementation((file: string, pattern: string) => {
        if (pattern === "src/**/*.json")
          return file.includes("src") && file.endsWith(".json");
        if (pattern === "**/node_modules/**")
          return file.includes("node_modules");
        if (pattern === "**/*.temp") return file.endsWith(".temp");
        return false;
      });
    });

    it("should watch files matching include patterns", () => {
      const filePath = "src/locales/en.json";
      const includePatterns = ["src/**/*.json"];
      const excludePatterns: string[] = [];

      const result = patternResolver.shouldWatchFile(
        filePath,
        includePatterns,
        excludePatterns,
      );

      expect(result).toBe(true);
    });

    it("should not watch files matching exclude patterns", () => {
      const filePath = "node_modules/lib.json";
      const includePatterns: string[] = [];
      const excludePatterns = ["**/node_modules/**"];

      const result = patternResolver.shouldWatchFile(
        filePath,
        includePatterns,
        excludePatterns,
      );

      expect(result).toBe(false);
    });

    it("should prioritize exclude over include patterns", () => {
      const filePath = "src/temp.json";
      const includePatterns = ["src/**/*.json"];
      const excludePatterns = ["**/*.temp"];

      mockMinimatch.mockImplementation((file: string, pattern: string) => {
        if (pattern === "src/**/*.json")
          return file.includes("src") && file.endsWith(".json");
        if (pattern === "**/*.temp") return file.includes("temp");
        return false;
      });

      const result = patternResolver.shouldWatchFile(
        filePath,
        includePatterns,
        excludePatterns,
      );

      expect(result).toBe(false);
    });

    it("should watch all files when no include patterns are specified", () => {
      const filePath = "any/file.txt";
      const includePatterns: string[] = [];
      const excludePatterns: string[] = [];

      const result = patternResolver.shouldWatchFile(
        filePath,
        includePatterns,
        excludePatterns,
      );

      expect(result).toBe(true);
    });
  });

  describe("advanced pattern resolution", () => {
    it("should handle CLI include/exclude patterns", async () => {
      mockContext.flags.watchInclude = ["custom/**/*.json"];
      mockContext.flags.watchExclude = ["custom/temp/**"];

      const mockBuckets = [
        {
          type: "json" as const,
          paths: [{ pathPattern: "src/locales/[locale].json" }],
        },
      ];

      mockGetBuckets.mockReturnValue(mockBuckets);
      mockGlob.mockResolvedValue(["src/locales/en.json", "custom/app.json"]);

      const result = await patternResolver.resolveWatchPatterns(mockContext);

      expect(result.include).toContain("src/locales/en.json");
      expect(result.include).toContain("custom/**/*.json");
      expect(result.exclude).toContain("custom/temp/**");
    });

    it("should filter by file flag when specified", async () => {
      mockContext.flags.file = ["en.json"];

      const mockBuckets = [
        {
          type: "json" as const,
          paths: [
            { pathPattern: "src/locales/[locale].json" },
            { pathPattern: "config/[locale].json" },
          ],
        },
      ];

      mockGetBuckets.mockReturnValue(mockBuckets);
      mockMinimatch.mockImplementation((pattern: string, file: string) => {
        return pattern.includes("en.json") || file.includes("en.json");
      });
      mockGlob.mockResolvedValue(["src/locales/en.json"]);

      const result = await patternResolver.resolveWatchPatterns(mockContext);

      expect(result.include).toContain("src/locales/en.json");
      // The implementation includes both patterns since they both match the file filter
      expect(result.include.length).toBeGreaterThan(0);
    });

    it("should handle source locale from flags", async () => {
      mockContext.flags.sourceLocale = "fr-FR";

      const mockBuckets = [
        {
          type: "json" as const,
          paths: [{ pathPattern: "src/locales/[locale].json" }],
        },
      ];

      mockGetBuckets.mockReturnValue(mockBuckets);
      mockGlob.mockResolvedValue(["src/locales/fr-FR.json"]);

      const result = await patternResolver.resolveWatchPatterns(mockContext);

      expect(result.include).toContain("src/locales/fr-FR.json");
    });
  });

  describe("glob pattern expansion edge cases", () => {
    it("should handle patterns that resolve to no files", async () => {
      const patterns = ["nonexistent/**/*.json"];
      mockGlob.mockResolvedValue([]);

      const result = await patternResolver.expandGlobPatterns(patterns);

      expect(result).toEqual([]);
    });

    it("should handle mixed successful and failed pattern expansions", async () => {
      const patterns = ["src/**/*.json", "invalid-pattern"];

      mockGlob
        .mockResolvedValueOnce(["src/app.json"])
        .mockRejectedValueOnce(new Error("Invalid pattern"));

      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const result = await patternResolver.expandGlobPatterns(patterns);

      expect(result).toEqual(["src/app.json"]);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Failed to expand pattern 'invalid-pattern'"),
      );
    });

    it("should handle very large file lists", async () => {
      const patterns = ["**/*.json"];
      const largeFileList = Array.from(
        { length: 1000 },
        (_, i) => `file${i}.json`,
      );

      mockGlob.mockResolvedValue(largeFileList);

      const result = await patternResolver.expandGlobPatterns(patterns);

      expect(result).toHaveLength(1000);
      expect(result).toEqual(largeFileList.sort());
    });
  });

  describe("pattern validation edge cases", () => {
    it("should detect security issues with parent directory references", () => {
      mockMinimatch.mockReturnValue(true);

      const patterns = ["../../../etc/passwd", "src/**/*.json"];
      const result = patternResolver.validatePatterns(patterns);

      expect(result.isValid).toBe(true); // Still valid but with warnings
      expect(result.warnings.some((w) => w.includes("unsafe"))).toBe(true);
    });

    it("should detect performance issues with many recursive wildcards", () => {
      mockMinimatch.mockReturnValue(true);

      const patterns = ["**/**/***/**/*.json"];
      const result = patternResolver.validatePatterns(patterns);

      expect(result.isValid).toBe(true);
      expect(result.warnings.some((w) => w.includes("performance"))).toBe(true);
    });

    it("should detect patterns ending with slash", () => {
      mockMinimatch.mockReturnValue(true);

      const patterns = ["src/locales/"];
      const result = patternResolver.validatePatterns(patterns);

      expect(result.isValid).toBe(true);
      expect(result.warnings.some((w) => w.includes("slash"))).toBe(true);
    });

    it("should detect broad patterns starting with **", () => {
      mockMinimatch.mockReturnValue(true);

      const patterns = ["**json"];
      const result = patternResolver.validatePatterns(patterns);

      expect(result.isValid).toBe(true);
      expect(result.warnings.some((w) => w.includes("broadly"))).toBe(true);
    });
  });

  describe("utility methods", () => {
    it("should get file extension correctly", () => {
      expect(patternResolver.getFileExtension("file.json")).toBe("json");
      expect(patternResolver.getFileExtension("path/to/file.yaml")).toBe(
        "yaml",
      );
      expect(
        patternResolver.getFileExtension("file.with.multiple.dots.txt"),
      ).toBe("txt");
      expect(patternResolver.getFileExtension("file-without-extension")).toBe(
        "",
      );
      expect(patternResolver.getFileExtension(".hidden")).toBe("hidden");
      expect(patternResolver.getFileExtension("path/.hidden.json")).toBe(
        "json",
      );
    });

    it("should detect broad patterns correctly", () => {
      expect(patternResolver.isPatternBroad("**/*.json")).toBe(true);
      expect(patternResolver.isPatternBroad("src/**/*.json")).toBe(false);
      expect(patternResolver.isPatternBroad("**/node_modules/**")).toBe(true);
      expect(patternResolver.isPatternBroad("src/*.json")).toBe(false);
      expect(patternResolver.isPatternBroad("*.json")).toBe(false);
      expect(patternResolver.isPatternBroad("src/*/*/*/*.json")).toBe(true); // Many wildcards
    });

    it("should match patterns correctly", () => {
      mockMinimatch.mockImplementation((file: string, pattern: string) => {
        if (pattern === "src/**/*.json")
          return file.includes("src") && file.endsWith(".json");
        if (pattern === "**/*.temp") return file.endsWith(".temp");
        return false;
      });

      expect(
        patternResolver.matchesPatterns("src/app.json", ["src/**/*.json"]),
      ).toBe(true);
      expect(
        patternResolver.matchesPatterns("config.yaml", ["src/**/*.json"]),
      ).toBe(false);
      expect(
        patternResolver.matchesPatterns("temp.temp", [
          "**/*.temp",
          "src/**/*.json",
        ]),
      ).toBe(true);
    });

    it("should calculate pattern statistics", () => {
      const resolved = {
        include: ["src/**/*.json", "**/*.yaml"],
        exclude: ["**/node_modules/**"],
        resolved: ["src/a.json", "src/b.json", "config.yaml"],
      };

      const stats = patternResolver.getPatternStatistics(resolved);

      expect(stats.totalIncludePatterns).toBe(2);
      expect(stats.totalExcludePatterns).toBe(1);
      expect(stats.resolvedFileCount).toBe(3);
      expect(stats.averageFilesPerPattern).toBe(2); // 3 files / 2 patterns = 1.5, rounded to 2
      expect(stats.broadPatternCount).toBe(1); // Only **/*.yaml is broad
    });
  });

  describe("cross-platform compatibility", () => {
    it("should handle Windows paths correctly", () => {
      const windowsPaths = [
        "src\\locales\\en.json",
        "config\\app.yaml",
        "C:\\absolute\\path\\file.txt",
      ];

      const result = patternResolver.normalizePaths(windowsPaths);

      expect(result).toEqual([
        "src/locales/en.json",
        "config/app.yaml",
        "C:/absolute/path/file.txt",
      ]);
    });

    it("should handle Unix paths correctly", () => {
      const unixPaths = [
        "src/locales/en.json",
        "/absolute/path/file.txt",
        "./relative/path.yaml",
      ];

      const result = patternResolver.normalizePaths(unixPaths);

      expect(result).toEqual([
        "src/locales/en.json",
        "/absolute/path/file.txt",
        "relative/path.yaml",
      ]);
    });

    it("should validate patterns for cross-platform issues", () => {
      mockMinimatch.mockReturnValue(true);

      // Mock Unix platform
      const originalPlatform = process.platform;
      Object.defineProperty(process, "platform", { value: "linux" });

      const patterns = ["src\\windows\\path.json"];
      const result = patternResolver.validatePatterns(patterns);

      expect(result.warnings.some((w) => w.includes("Unix"))).toBe(true);

      // Restore original platform
      Object.defineProperty(process, "platform", { value: originalPlatform });
    });
  });

  describe("locale placeholder replacement", () => {
    it("should handle complex locale formats", () => {
      const patterns = [
        "src/[locale].json",
        "config/{locale}.yaml",
        "assets/[locale_underscore].png",
        "meta/{locale_base}.xml",
      ];

      const result = patternResolver.replaceLocalePlaceholders(
        patterns,
        "zh-Hans-CN",
      );

      expect(result[0]).toBe("src/zh-Hans-CN.json");
      expect(result[1]).toBe("config/zh-Hans-CN.yaml");
      expect(result[2]).toBe("assets/zh_Hans_CN.png");
      expect(result[3]).toBe("meta/zh.xml");
    });

    it("should handle patterns without placeholders", () => {
      const patterns = ["src/static.json", "config/app.yaml"];
      const result = patternResolver.replaceLocalePlaceholders(patterns, "en");

      expect(result).toEqual(patterns); // Should remain unchanged
    });

    it("should handle multiple placeholders in single pattern", () => {
      const patterns = ["src/[locale]/[locale_base].json"];
      const result = patternResolver.replaceLocalePlaceholders(
        patterns,
        "en-US",
      );

      expect(result[0]).toBe("src/en-US/en.json");
    });
  });
});

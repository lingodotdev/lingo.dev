import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { ConfigurationManager } from "./config";
import { CmdRunContext } from "../_types";
import { WatchConfiguration } from "./types";

// Mock fs module
vi.mock("fs");
vi.mock("path");
vi.mock("yaml", () => ({
  parse: vi.fn(),
}));

const mockFs = vi.mocked(fs);
const mockPath = vi.mocked(path);

describe("ConfigurationManager", () => {
  let configManager: ConfigurationManager;
  let mockContext: CmdRunContext;

  beforeEach(() => {
    configManager = new ConfigurationManager();

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

  describe("loadConfiguration", () => {
    it("should load default configuration when no config file or CLI flags are provided", async () => {
      const config = await configManager.loadConfiguration(mockContext);

      expect(config).toBeDefined();
      expect(config.patterns).toBeDefined();
      expect(config.debounce).toBeDefined();
      expect(config.monitoring).toBeDefined();
      expect(config.performance).toBeDefined();

      // Check default values
      expect(config.patterns.include).toEqual([]);
      expect(config.patterns.exclude).toContain("**/node_modules/**");
      expect(config.debounce.delay).toBeGreaterThan(0);
      expect(config.monitoring.logLevel).toBe("minimal");
      expect(config.performance.batchSize).toBeGreaterThan(0);
    });

    it("should merge CLI flags with default configuration", async () => {
      mockContext.flags.watchInclude = ["src/**/*.json"];
      mockContext.flags.watchExclude = ["src/temp/**"];
      mockContext.flags.debounce = 3000;
      mockContext.flags.quiet = true;
      mockContext.flags.batchSize = 25;

      const config = await configManager.loadConfiguration(mockContext);

      expect(config.patterns.include).toEqual(["src/**/*.json"]);
      expect(config.patterns.exclude).toContain("src/temp/**");
      expect(config.debounce.delay).toBeGreaterThanOrEqual(3000);
      expect(config.monitoring.logLevel).toBe("silent");
      expect(config.performance.batchSize).toBe(25);
    });

    it("should handle missing config file gracefully", async () => {
      mockContext.flags.watchConfig = "/nonexistent/config.json";
      mockFs.existsSync.mockReturnValue(false);

      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const config = await configManager.loadConfiguration(mockContext);

      expect(consoleSpy).toHaveBeenCalled();
      expect(config).toBeDefined();
      expect(config.patterns.include).toEqual([]);
    });

    it("should handle invalid JSON config file gracefully", async () => {
      mockContext.flags.watchConfig = "/path/to/invalid.json";
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue("invalid json content");

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const config = await configManager.loadConfiguration(mockContext);

      expect(consoleSpy).toHaveBeenCalled();
      expect(config).toBeDefined(); // Should fall back to defaults
    });
  });

  describe("validateConfiguration", () => {
    it("should validate a correct configuration", () => {
      const validConfig: WatchConfiguration = {
        patterns: {
          include: ["src/**/*.json"],
          exclude: ["node_modules/**"],
        },
        debounce: {
          delay: 1000,
          maxWait: 5000,
        },
        monitoring: {
          enableProgressIndicators: true,
          enableNotifications: false,
          logLevel: "minimal",
        },
        performance: {
          batchSize: 50,
          rateLimitDelay: 100,
        },
      };

      const result = configManager.validateConfiguration(validConfig);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect invalid debounce delay", () => {
      const invalidConfig: WatchConfiguration = {
        patterns: { include: [], exclude: [] },
        debounce: {
          delay: 50, // Too small (minimum is 100)
        },
        monitoring: {
          enableProgressIndicators: true,
          enableNotifications: false,
          logLevel: "minimal",
        },
        performance: {
          batchSize: 50,
          rateLimitDelay: 100,
        },
      };

      const result = configManager.validateConfiguration(invalidConfig);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should detect invalid maxWait value", () => {
      const invalidConfig: WatchConfiguration = {
        patterns: { include: [], exclude: [] },
        debounce: {
          delay: 5000,
          maxWait: 3000, // Less than delay
        },
        monitoring: {
          enableProgressIndicators: true,
          enableNotifications: false,
          logLevel: "minimal",
        },
        performance: {
          batchSize: 50,
          rateLimitDelay: 100,
        },
      };

      const result = configManager.validateConfiguration(invalidConfig);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should detect invalid batch size", () => {
      const invalidConfig: WatchConfiguration = {
        patterns: { include: [], exclude: [] },
        debounce: { delay: 1000 },
        monitoring: {
          enableProgressIndicators: true,
          enableNotifications: false,
          logLevel: "minimal",
        },
        performance: {
          batchSize: 0, // Invalid (must be positive)
          rateLimitDelay: 100,
        },
      };

      const result = configManager.validateConfiguration(invalidConfig);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should provide warnings for potential issues", () => {
      const configWithWarnings: WatchConfiguration = {
        patterns: {
          include: [], // No include patterns
          exclude: [],
        },
        debounce: {
          delay: 500, // Short delay
        },
        monitoring: {
          enableProgressIndicators: true,
          enableNotifications: false,
          logLevel: "minimal",
        },
        performance: {
          batchSize: 150, // Large batch size
          rateLimitDelay: 100,
        },
      };

      const result = configManager.validateConfiguration(configWithWarnings);

      expect(result.isValid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  describe("mergeWithDefaults", () => {
    it("should merge partial configuration with defaults", () => {
      const partialConfig: Partial<WatchConfiguration> = {
        patterns: {
          include: ["custom/**/*.json"],
          exclude: ["custom/temp/**"],
        },
        debounce: {
          delay: 3000,
        },
      };

      const result = configManager.mergeWithDefaults(partialConfig);

      expect(result.patterns.include).toEqual(["custom/**/*.json"]);
      expect(result.patterns.exclude).toEqual(["custom/temp/**"]);
      expect(result.debounce.delay).toBe(3000);
      expect(result.debounce.maxWait).toBeGreaterThan(0); // Default value
      expect(result.monitoring.enableProgressIndicators).toBe(true); // Default value
      expect(result.performance.batchSize).toBeGreaterThan(0); // Default value
    });

    it("should handle empty partial configuration", () => {
      const result = configManager.mergeWithDefaults({});

      expect(result.patterns.include).toEqual([]);
      expect(result.patterns.exclude).toContain("**/node_modules/**");
      expect(result.debounce.delay).toBeGreaterThan(0);
      expect(result.monitoring.logLevel).toBe("minimal");
    });

    it("should preserve boolean false values", () => {
      const partialConfig: Partial<WatchConfiguration> = {
        monitoring: {
          enableProgressIndicators: false,
          enableNotifications: false,
          logLevel: "silent",
        },
      };

      const result = configManager.mergeWithDefaults(partialConfig);

      expect(result.monitoring.enableProgressIndicators).toBe(false);
      expect(result.monitoring.enableNotifications).toBe(false);
      expect(result.monitoring.logLevel).toBe("silent");
    });
  });

  describe("error handling", () => {
    it("should handle configuration loading errors gracefully", async () => {
      mockContext.flags.watchConfig = "/path/to/config.json";
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockImplementation(() => {
        throw new Error("File read error");
      });

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const config = await configManager.loadConfiguration(mockContext);

      expect(consoleSpy).toHaveBeenCalled();
      expect(config).toBeDefined();
      expect(config.patterns.include).toEqual([]); // Should fall back to defaults
    });

    it("should handle invalid configuration validation errors", async () => {
      // Mock a configuration that will fail validation
      mockContext.flags.debounce = -100; // Invalid negative value

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const config = await configManager.loadConfiguration(mockContext);

      expect(consoleSpy).toHaveBeenCalled();
      expect(config).toBeDefined();
      expect(config.debounce.delay).toBeGreaterThan(0); // Should fall back to defaults
    });
  });

  describe("configuration schema validation", () => {
    it("should validate debounce configuration constraints", () => {
      const invalidDebounceConfig: WatchConfiguration = {
        patterns: { include: [], exclude: [] },
        debounce: {
          delay: 70000, // Too large (max is 60000)
          maxWait: 5000,
        },
        monitoring: {
          enableProgressIndicators: true,
          enableNotifications: false,
          logLevel: "minimal",
        },
        performance: {
          batchSize: 50,
          rateLimitDelay: 100,
        },
      };

      const result = configManager.validateConfiguration(invalidDebounceConfig);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should validate performance configuration constraints", () => {
      const invalidPerformanceConfig: WatchConfiguration = {
        patterns: { include: [], exclude: [] },
        debounce: { delay: 1000 },
        monitoring: {
          enableProgressIndicators: true,
          enableNotifications: false,
          logLevel: "minimal",
        },
        performance: {
          batchSize: 1500, // Too large (max is 1000)
          rateLimitDelay: 6000, // Too large (max is 5000)
        },
      };

      const result = configManager.validateConfiguration(
        invalidPerformanceConfig,
      );

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should validate monitoring log level enum", () => {
      const invalidMonitoringConfig: WatchConfiguration = {
        patterns: { include: [], exclude: [] },
        debounce: { delay: 1000 },
        monitoring: {
          enableProgressIndicators: true,
          enableNotifications: false,
          logLevel: "invalid" as any, // Invalid log level
        },
        performance: {
          batchSize: 50,
          rateLimitDelay: 100,
        },
      };

      const result = configManager.validateConfiguration(
        invalidMonitoringConfig,
      );

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some((e) => e.includes("logLevel"))).toBe(true);
    });

    it("should validate negative values are rejected", () => {
      const invalidConfig: WatchConfiguration = {
        patterns: { include: [], exclude: [] },
        debounce: { delay: 1000 },
        monitoring: {
          enableProgressIndicators: true,
          enableNotifications: false,
          logLevel: "minimal",
        },
        performance: {
          batchSize: -10, // Negative value
          rateLimitDelay: -5, // Negative value
        },
      };

      const result = configManager.validateConfiguration(invalidConfig);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe("configuration file loading", () => {
    beforeEach(() => {
      mockPath.resolve.mockImplementation((p: string) => `/resolved/${p}`);
    });

    it("should load JSON configuration file", async () => {
      mockContext.flags.watchConfig = "watch.json";
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        JSON.stringify({
          watch: {
            patterns: {
              include: ["src/**/*.json"],
              exclude: ["temp/**"],
            },
            debounce: {
              delay: 2000,
            },
          },
        }),
      );

      const config = await configManager.loadConfiguration(mockContext);

      expect(config.patterns.include).toEqual(["src/**/*.json"]);
      expect(config.patterns.exclude).toContain("temp/**");
      // The delay should be from the file config since no CLI override is provided
      expect(config.debounce.delay).toBeGreaterThanOrEqual(2000);
    });

    it("should load YAML configuration file", async () => {
      const mockYaml = await import("yaml");
      const mockParse = vi.mocked(mockYaml.parse);

      mockContext.flags.watchConfig = "watch.yaml";
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        "watch:\n  patterns:\n    include:\n      - src/**/*.json",
      );

      mockParse.mockReturnValue({
        watch: {
          patterns: {
            include: ["src/**/*.json"],
          },
        },
      });

      const config = await configManager.loadConfiguration(mockContext);

      expect(config.patterns.include).toEqual(["src/**/*.json"]);
    });

    it("should handle malformed JSON gracefully", async () => {
      mockContext.flags.watchConfig = "invalid.json";
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue("{ invalid json }");

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const config = await configManager.loadConfiguration(mockContext);

      expect(consoleSpy).toHaveBeenCalled();
      expect(config).toBeDefined(); // Should fall back to defaults
    });

    it("should handle file read errors gracefully", async () => {
      mockContext.flags.watchConfig = "config.json";
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockImplementation(() => {
        throw new Error("Permission denied");
      });

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const config = await configManager.loadConfiguration(mockContext);

      expect(consoleSpy).toHaveBeenCalled();
      expect(config).toBeDefined(); // Should fall back to defaults
    });

    it("should try JSON then YAML for unknown file extensions", async () => {
      const mockYaml = await import("yaml");
      const mockParse = vi.mocked(mockYaml.parse);

      mockContext.flags.watchConfig = "config.conf";
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        "watch:\n  patterns:\n    include:\n      - src/**/*.json",
      );

      // First JSON.parse will fail, then YAML parse should succeed
      mockParse.mockReturnValue({
        watch: {
          patterns: {
            include: ["src/**/*.json"],
          },
        },
      });

      const config = await configManager.loadConfiguration(mockContext);

      expect(config.patterns.include).toEqual(["src/**/*.json"]);
    });
  });

  describe("configuration merging", () => {
    it("should merge multiple configurations with precedence", async () => {
      // Set up file config
      mockContext.flags.watchConfig = "config.json";
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        JSON.stringify({
          watch: {
            patterns: {
              include: ["file/**/*.json"],
              exclude: ["file/temp/**"],
            },
            debounce: {
              delay: 3000,
            },
            monitoring: {
              logLevel: "verbose",
            },
          },
        }),
      );

      // Set up CLI flags (should take precedence)
      mockContext.flags.watchInclude = ["cli/**/*.json"];
      mockContext.flags.debounce = 1000;
      mockContext.flags.quiet = true; // Should override file config logLevel

      const config = await configManager.loadConfiguration(mockContext);

      // CLI flags should take precedence
      expect(config.patterns.include).toEqual([
        "file/**/*.json",
        "cli/**/*.json",
      ]);
      expect(config.patterns.exclude).toContain("file/temp/**");
      expect(config.debounce.delay).toBe(1000); // CLI override
      expect(config.monitoring.logLevel).toBe("silent"); // CLI quiet flag override
    });

    it("should handle partial configurations correctly", () => {
      const partialConfig1: Partial<WatchConfiguration> = {
        patterns: {
          include: ["src/**/*.json"],
          exclude: [],
        },
      };

      const partialConfig2: Partial<WatchConfiguration> = {
        patterns: {
          include: ["config/**/*.yaml"],
          exclude: ["temp/**"],
        },
        debounce: {
          delay: 2000,
        },
      };

      const result = configManager.mergeWithDefaults(partialConfig1);
      const result2 = configManager.mergeWithDefaults(partialConfig2);

      expect(result.patterns.include).toEqual(["src/**/*.json"]);
      expect(result2.patterns.include).toEqual(["config/**/*.yaml"]);
      expect(result2.patterns.exclude).toEqual(["temp/**"]);
      expect(result2.debounce.delay).toBe(2000);
    });
  });

  describe("CLI flag extraction", () => {
    it("should extract all CLI flags correctly", async () => {
      mockContext.flags = {
        ...mockContext.flags,
        watchInclude: ["src/**/*.json", "config/**/*.yaml"],
        watchExclude: ["temp/**", "node_modules/**"],
        debounce: 2500,
        maxWait: 10000,
        verbose: true,
        progress: false,
        notifications: true,
        batchSize: 75,
        rateLimitDelay: 200,
      };

      const config = await configManager.loadConfiguration(mockContext);

      expect(config.patterns.include).toEqual([
        "src/**/*.json",
        "config/**/*.yaml",
      ]);
      expect(config.patterns.exclude).toContain("temp/**");
      expect(config.patterns.exclude).toContain("node_modules/**");
      expect(config.debounce.delay).toBe(2500);
      expect(config.debounce.maxWait).toBe(10000);
      expect(config.monitoring.logLevel).toBe("verbose");
      expect(config.monitoring.enableProgressIndicators).toBe(false);
      expect(config.monitoring.enableNotifications).toBe(true);
      expect(config.performance.batchSize).toBe(75);
      expect(config.performance.rateLimitDelay).toBe(200);
    });

    it("should handle conflicting verbose and quiet flags", async () => {
      mockContext.flags.verbose = true;
      mockContext.flags.quiet = true;

      const config = await configManager.loadConfiguration(mockContext);

      // verbose should take precedence over quiet when both are set
      expect(config.monitoring.logLevel).toBe("verbose");
    });
  });

  describe("pattern validation integration", () => {
    it("should validate glob patterns during configuration validation", () => {
      const configWithPatterns: WatchConfiguration = {
        patterns: {
          include: ["src/**/*.json", "**/**/**/*.temp"], // One normal, one overly broad
          exclude: [],
        },
        debounce: { delay: 1000 },
        monitoring: {
          enableProgressIndicators: true,
          enableNotifications: false,
          logLevel: "minimal",
        },
        performance: {
          batchSize: 50,
          rateLimitDelay: 100,
        },
      };

      const result = configManager.validateConfiguration(configWithPatterns);

      expect(result.isValid).toBe(true); // Should still be valid
      expect(result.warnings.length).toBeGreaterThan(0); // Should have warnings about broad patterns
    });

    it("should detect unreplaced locale placeholders", () => {
      const configWithPlaceholders: WatchConfiguration = {
        patterns: {
          include: ["src/[locale].json", "config/{locale}.yaml"],
          exclude: [],
        },
        debounce: { delay: 1000 },
        monitoring: {
          enableProgressIndicators: true,
          enableNotifications: false,
          logLevel: "minimal",
        },
        performance: {
          batchSize: 50,
          rateLimitDelay: 100,
        },
      };

      const result = configManager.validateConfiguration(
        configWithPlaceholders,
      );

      expect(result.isValid).toBe(true);
      expect(result.warnings.some((w) => w.includes("placeholder"))).toBe(true);
    });

    it("should detect platform-specific path issues", () => {
      // Mock Windows platform
      const originalPlatform = process.platform;
      Object.defineProperty(process, "platform", { value: "win32" });

      const configWithAbsolutePaths: WatchConfiguration = {
        patterns: {
          include: ["/absolute/path/*.json"],
          exclude: [],
        },
        debounce: { delay: 1000 },
        monitoring: {
          enableProgressIndicators: true,
          enableNotifications: false,
          logLevel: "minimal",
        },
        performance: {
          batchSize: 50,
          rateLimitDelay: 100,
        },
      };

      const result = configManager.validateConfiguration(
        configWithAbsolutePaths,
      );

      expect(result.isValid).toBe(true);
      expect(result.warnings.some((w) => w.includes("Windows"))).toBe(true);

      // Restore original platform
      Object.defineProperty(process, "platform", { value: originalPlatform });
    });
  });

  describe("edge cases and error conditions", () => {
    it("should handle empty configuration object", () => {
      const result = configManager.mergeWithDefaults({});

      expect(result).toBeDefined();
      expect(result.patterns.include).toEqual([]);
      expect(result.patterns.exclude).toContain("**/node_modules/**");
      expect(result.debounce.delay).toBeGreaterThan(0);
    });

    it("should handle null/undefined values in partial config", () => {
      const partialConfig: Partial<WatchConfiguration> = {
        patterns: {
          include: undefined as any,
          exclude: null as any,
        },
        debounce: undefined as any,
        monitoring: null as any,
        performance: undefined as any,
      };

      const result = configManager.mergeWithDefaults(partialConfig);

      expect(result).toBeDefined();
      expect(Array.isArray(result.patterns.include)).toBe(true);
      expect(Array.isArray(result.patterns.exclude)).toBe(true);
      expect(typeof result.debounce.delay).toBe("number");
    });

    it("should validate configuration with missing required fields", () => {
      const incompleteConfig = {
        patterns: { include: [], exclude: [] },
        // Missing debounce, monitoring, performance
      } as any;

      const result = configManager.validateConfiguration(incompleteConfig);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should handle configuration with extra unknown fields", () => {
      const configWithExtra = {
        patterns: { include: [], exclude: [] },
        debounce: { delay: 1000 },
        monitoring: {
          enableProgressIndicators: true,
          enableNotifications: false,
          logLevel: "minimal" as const,
        },
        performance: {
          batchSize: 50,
          rateLimitDelay: 100,
        },
        unknownField: "should be ignored",
      } as any;

      const result = configManager.validateConfiguration(configWithExtra);

      expect(result.isValid).toBe(true); // Should ignore unknown fields
    });
  });
});

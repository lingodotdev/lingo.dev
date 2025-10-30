import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { flagsSchema, CmdRunFlags } from "./_types";

describe("CLI Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Enhanced Watch Flags Parsing", () => {
    it("should parse basic watch flags correctly", () => {
      const args = {
        watch: true,
        debounce: 3000,
        sound: true,
      };

      const result = flagsSchema.parse(args);

      expect(result.watch).toBe(true);
      expect(result.debounce).toBe(3000);
      expect(result.sound).toBe(true);
    });

    it("should parse enhanced watch include/exclude patterns", () => {
      const args = {
        watchInclude: ["src/**/*.json", "config/**/*.yaml"],
        watchExclude: ["temp/**", "node_modules/**"],
        watchConfig: "/path/to/watch.config.json",
      };

      const result = flagsSchema.parse(args);

      expect(result.watchInclude).toEqual([
        "src/**/*.json",
        "config/**/*.yaml",
      ]);
      expect(result.watchExclude).toEqual(["temp/**", "node_modules/**"]);
      expect(result.watchConfig).toBe("/path/to/watch.config.json");
    });

    it("should parse debounce strategy options", () => {
      const args = {
        debounceStrategy: "adaptive" as const,
        maxWait: 10000,
        debounce: 2000,
      };

      const result = flagsSchema.parse(args);

      expect(result.debounceStrategy).toBe("adaptive");
      expect(result.maxWait).toBe(10000);
      expect(result.debounce).toBe(2000);
    });

    it("should parse feedback and monitoring options", () => {
      const args = {
        quiet: true,
        progress: false,
        notifications: true,
        verbose: true,
      };

      const result = flagsSchema.parse(args);

      expect(result.quiet).toBe(true);
      expect(result.progress).toBe(false);
      expect(result.notifications).toBe(true);
      expect(result.verbose).toBe(true);
    });

    it("should parse performance tuning options", () => {
      const args = {
        batchSize: 75,
        rateLimitDelay: 200,
        concurrency: 5,
      };

      const result = flagsSchema.parse(args);

      expect(result.batchSize).toBe(75);
      expect(result.rateLimitDelay).toBe(200);
      expect(result.concurrency).toBe(5);
    });

    it("should apply default values for optional flags", () => {
      const args = {};

      const result = flagsSchema.parse(args);

      expect(result.watch).toBe(false);
      expect(result.debounce).toBe(5000);
      expect(result.debounceStrategy).toBe("simple");
      expect(result.quiet).toBe(false);
      expect(result.progress).toBe(true);
      expect(result.notifications).toBe(false);
      expect(result.batchSize).toBe(50);
      expect(result.rateLimitDelay).toBe(100);
      expect(result.interactive).toBe(false);
      expect(result.concurrency).toBe(10);
      expect(result.debug).toBe(false);
    });

    it("should handle array flags correctly", () => {
      const args = {
        bucket: ["json", "yaml"],
        key: ["auth.login", "auth.logout"],
        file: ["messages.json", "errors.json"],
        targetLocale: ["es", "fr", "de"],
        watchInclude: ["src/**/*.json"],
        watchExclude: ["temp/**"],
      };

      const result = flagsSchema.parse(args);

      expect(result.bucket).toEqual(["json", "yaml"]);
      expect(result.key).toEqual(["auth.login", "auth.logout"]);
      expect(result.file).toEqual(["messages.json", "errors.json"]);
      expect(result.targetLocale).toEqual(["es", "fr", "de"]);
      expect(result.watchInclude).toEqual(["src/**/*.json"]);
      expect(result.watchExclude).toEqual(["temp/**"]);
    });
  });

  describe("Flag Validation", () => {
    it("should reject invalid debounce strategy", () => {
      const args = {
        debounceStrategy: "invalid",
      };

      expect(() => flagsSchema.parse(args)).toThrow();
    });

    it("should reject negative debounce values", () => {
      const args = {
        debounce: -1000,
      };

      expect(() => flagsSchema.parse(args)).toThrow();
    });

    it("should reject negative maxWait values", () => {
      const args = {
        maxWait: -5000,
      };

      expect(() => flagsSchema.parse(args)).toThrow();
    });

    it("should reject negative batch size", () => {
      const args = {
        batchSize: -10,
      };

      expect(() => flagsSchema.parse(args)).toThrow();
    });

    it("should reject negative rate limit delay", () => {
      const args = {
        rateLimitDelay: -100,
      };

      expect(() => flagsSchema.parse(args)).toThrow();
    });

    it("should reject negative concurrency", () => {
      const args = {
        concurrency: -5,
      };

      expect(() => flagsSchema.parse(args)).toThrow();
    });

    it("should reject zero concurrency", () => {
      const args = {
        concurrency: 0,
      };

      expect(() => flagsSchema.parse(args)).toThrow();
    });
  });

  describe("Backward Compatibility", () => {
    it("should maintain compatibility with existing watch flags", () => {
      const legacyArgs = {
        watch: true,
        debounce: 3000,
        sound: true,
        verbose: true,
      };

      const result = flagsSchema.parse(legacyArgs);

      expect(result.watch).toBe(true);
      expect(result.debounce).toBe(3000);
      expect(result.sound).toBe(true);
      expect(result.verbose).toBe(true);

      // New flags should have default values
      expect(result.debounceStrategy).toBe("simple");
      expect(result.quiet).toBe(false);
      expect(result.progress).toBe(true);
      expect(result.notifications).toBe(false);
    });

    it("should maintain compatibility with existing run flags", () => {
      const legacyArgs = {
        bucket: ["json"],
        key: ["auth"],
        file: ["messages.json"],
        force: true,
        frozen: false,
        verbose: true,
        strict: true,
        interactive: true,
        concurrency: 5,
        debug: true,
        sourceLocale: "en",
        targetLocale: ["es", "fr"],
        apiKey: "test-key",
      };

      const result = flagsSchema.parse(legacyArgs);

      expect(result.bucket).toEqual(["json"]);
      expect(result.key).toEqual(["auth"]);
      expect(result.file).toEqual(["messages.json"]);
      expect(result.force).toBe(true);
      expect(result.frozen).toBe(false);
      expect(result.verbose).toBe(true);
      expect(result.strict).toBe(true);
      expect(result.interactive).toBe(true);
      expect(result.concurrency).toBe(5);
      expect(result.debug).toBe(true);
      expect(result.sourceLocale).toBe("en");
      expect(result.targetLocale).toEqual(["es", "fr"]);
      expect(result.apiKey).toBe("test-key");
    });

    it("should handle mixed legacy and new flags", () => {
      const mixedArgs = {
        // Legacy flags
        watch: true,
        debounce: 2000,
        verbose: true,

        // New flags
        watchInclude: ["src/**/*.json"],
        debounceStrategy: "batch" as const,
        maxWait: 8000,
        notifications: true,
        batchSize: 25,
      };

      const result = flagsSchema.parse(mixedArgs);

      // Legacy flags should work
      expect(result.watch).toBe(true);
      expect(result.debounce).toBe(2000);
      expect(result.verbose).toBe(true);

      // New flags should work
      expect(result.watchInclude).toEqual(["src/**/*.json"]);
      expect(result.debounceStrategy).toBe("batch");
      expect(result.maxWait).toBe(8000);
      expect(result.notifications).toBe(true);
      expect(result.batchSize).toBe(25);
    });
  });

  describe("Complex Flag Combinations", () => {
    it("should handle comprehensive watch configuration", () => {
      const comprehensiveArgs = {
        // Basic watch setup
        watch: true,
        debounce: 3000,
        debounceStrategy: "adaptive" as const,
        maxWait: 15000,

        // File patterns
        watchInclude: ["src/**/*.json", "config/**/*.yaml", "locales/**/*.po"],
        watchExclude: ["node_modules/**", "temp/**", "*.tmp", ".git/**"],
        watchConfig: "./watch.config.json",

        // Feedback and monitoring
        verbose: true,
        progress: true,
        notifications: true,
        sound: true,

        // Performance tuning
        batchSize: 100,
        rateLimitDelay: 150,
        concurrency: 8,

        // Translation filters
        bucket: ["json", "yaml"],
        key: ["auth", "navigation"],
        file: ["messages", "errors"],
        sourceLocale: "en",
        targetLocale: ["es", "fr", "de", "ja"],

        // Processing options
        force: false,
        frozen: false,
        strict: true,
        interactive: false,
      };

      const result = flagsSchema.parse(comprehensiveArgs);

      // Verify all flags are parsed correctly
      expect(result.watch).toBe(true);
      expect(result.debounce).toBe(3000);
      expect(result.debounceStrategy).toBe("adaptive");
      expect(result.maxWait).toBe(15000);
      expect(result.watchInclude).toHaveLength(3);
      expect(result.watchExclude).toHaveLength(4);
      expect(result.watchConfig).toBe("./watch.config.json");
      expect(result.verbose).toBe(true);
      expect(result.progress).toBe(true);
      expect(result.notifications).toBe(true);
      expect(result.sound).toBe(true);
      expect(result.batchSize).toBe(100);
      expect(result.rateLimitDelay).toBe(150);
      expect(result.concurrency).toBe(8);
      expect(result.bucket).toEqual(["json", "yaml"]);
      expect(result.targetLocale).toHaveLength(4);
    });

    it("should handle conflicting verbosity flags", () => {
      const conflictingArgs = {
        verbose: true,
        quiet: true,
      };

      const result = flagsSchema.parse(conflictingArgs);

      // Both flags should be preserved - resolution happens in configuration layer
      expect(result.verbose).toBe(true);
      expect(result.quiet).toBe(true);
    });

    it("should handle edge case values", () => {
      const edgeCaseArgs = {
        debounce: 100, // Minimum allowed
        maxWait: 100, // Same as debounce
        batchSize: 1, // Minimum allowed
        rateLimitDelay: 1, // Minimum allowed
        concurrency: 1, // Minimum allowed
      };

      const result = flagsSchema.parse(edgeCaseArgs);

      expect(result.debounce).toBe(100);
      expect(result.maxWait).toBe(100);
      expect(result.batchSize).toBe(1);
      expect(result.rateLimitDelay).toBe(1);
      expect(result.concurrency).toBe(1);
    });
  });

  describe("Type Safety", () => {
    it("should ensure CmdRunFlags type matches parsed schema", () => {
      const args = {
        watch: true,
        debounceStrategy: "simple" as const,
        watchInclude: ["src/**/*.json"],
        quiet: false,
        batchSize: 50,
      };

      const result: CmdRunFlags = flagsSchema.parse(args);

      // Type assertions to ensure type safety
      expect(typeof result.watch).toBe("boolean");
      expect(typeof result.debounceStrategy).toBe("string");
      expect(Array.isArray(result.watchInclude)).toBe(true);
      expect(typeof result.quiet).toBe("boolean");
      expect(typeof result.batchSize).toBe("number");
    });

    it("should handle optional fields correctly", () => {
      const minimalArgs = {};

      const result: CmdRunFlags = flagsSchema.parse(minimalArgs);

      // Optional fields should be undefined or have default values
      expect(result.watchInclude).toBeUndefined();
      expect(result.watchExclude).toBeUndefined();
      expect(result.watchConfig).toBeUndefined();
      expect(result.maxWait).toBeUndefined();
      expect(result.apiKey).toBeUndefined();

      // Fields with defaults should have values
      expect(result.watch).toBe(false);
      expect(result.debounce).toBe(5000);
      expect(result.debounceStrategy).toBe("simple");
      expect(result.quiet).toBe(false);
      expect(result.progress).toBe(true);
      expect(result.notifications).toBe(false);
      expect(result.batchSize).toBe(50);
      expect(result.rateLimitDelay).toBe(100);
      expect(result.interactive).toBe(false);
      expect(result.concurrency).toBe(10);
      expect(result.debug).toBe(false);
    });
  });

  describe("Error Messages", () => {
    it("should provide clear error messages for invalid enum values", () => {
      const args = {
        debounceStrategy: "invalid-strategy",
      };

      try {
        flagsSchema.parse(args);
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.message).toContain("debounceStrategy");
        expect(error.message).toMatch(/simple|adaptive|batch/);
      }
    });

    it("should provide clear error messages for invalid number values", () => {
      const args = {
        debounce: "not-a-number",
      };

      try {
        flagsSchema.parse(args);
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.message).toContain("Expected number");
      }
    });

    it("should provide clear error messages for negative values", () => {
      const args = {
        batchSize: -10,
      };

      try {
        flagsSchema.parse(args);
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.message).toContain("Number must be greater than 0");
      }
    });
  });
});

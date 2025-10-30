import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { WatchManager } from "./manager";
import { CmdRunContext } from "../_types";
import { WatchConfiguration } from "./types";

// Mock external dependencies
vi.mock("../plan", () => ({
  default: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../execute", () => ({
  default: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../../../utils/ui", () => ({
  renderSummary: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("chokidar", () => ({
  watch: vi.fn().mockReturnValue({
    on: vi.fn(),
    add: vi.fn(),
    unwatch: vi.fn(),
    close: vi.fn().mockResolvedValue(undefined),
    getWatched: vi.fn().mockReturnValue({}),
  }),
}));

describe("Watch Integration Tests", () => {
  let watchManager: WatchManager;
  let mockContext: CmdRunContext;
  let tempDir: string;

  beforeEach(() => {
    watchManager = new WatchManager();
    tempDir = fs.mkdtempSync(path.join(__dirname, "test-"));

    mockContext = {
      flags: {
        watch: true,
        interactive: false,
        concurrency: 1,
        debug: false,
        debounce: 1000,
        debounceStrategy: "simple" as const,
        quiet: false,
        progress: true,
        notifications: false,
        batchSize: 10,
        rateLimitDelay: 50,
      },
      config: {
        locale: {
          source: "en",
          targets: ["es", "fr"],
        },
        buckets: {
          json: {
            include: ["locales/[locale].json"],
          },
        },
      },
      tasks: [],
      results: new Map(),
      localizer: null,
    };

    // Create test files
    const localesDir = path.join(tempDir, "locales");
    fs.mkdirSync(localesDir, { recursive: true });
    fs.writeFileSync(
      path.join(localesDir, "en.json"),
      JSON.stringify({ hello: "Hello" }),
    );
  });

  afterEach(async () => {
    try {
      await watchManager.stop();
    } catch {
      // Ignore errors during cleanup
    }

    // Clean up temp directory
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe("Complete Workflow Integration", () => {
    it("should start watch manager and initialize all components", async () => {
      // Change to temp directory for test
      const originalCwd = process.cwd();
      process.chdir(tempDir);

      try {
        await watchManager.start(mockContext);

        const status = watchManager.getStatus();
        expect(status.isActive).toBe(true);
        expect(status.errorCount).toBe(0);
      } finally {
        process.chdir(originalCwd);
      }
    });

    it("should handle configuration loading and validation", async () => {
      const originalCwd = process.cwd();
      process.chdir(tempDir);

      try {
        // Create a watch config file
        const watchConfig: Partial<WatchConfiguration> = {
          debounce: {
            delay: 2000,
            maxWait: 10000,
          },
          monitoring: {
            logLevel: "verbose",
            enableProgressIndicators: true,
            enableNotifications: false,
          },
        };

        const configPath = path.join(tempDir, "watch-config.json");
        fs.writeFileSync(configPath, JSON.stringify({ watch: watchConfig }));

        mockContext.flags.watchConfig = configPath;

        await watchManager.start(mockContext);

        const status = watchManager.getStatus();
        expect(status.isActive).toBe(true);
      } finally {
        process.chdir(originalCwd);
      }
    });

    it("should handle graceful shutdown", async () => {
      const originalCwd = process.cwd();
      process.chdir(tempDir);

      try {
        await watchManager.start(mockContext);
        expect(watchManager.getStatus().isActive).toBe(true);

        await watchManager.stop();
        expect(watchManager.getStatus().isActive).toBe(false);
      } finally {
        process.chdir(originalCwd);
      }
    });

    it("should provide comprehensive statistics", async () => {
      const originalCwd = process.cwd();
      process.chdir(tempDir);

      try {
        await watchManager.start(mockContext);

        const stats = watchManager.getStatistics();
        expect(stats).toHaveProperty("totalChanges");
        expect(stats).toHaveProperty("retranslationCount");
        expect(stats).toHaveProperty("errorCount");
        expect(stats).toHaveProperty("averageRetranslationTime");
        expect(stats).toHaveProperty("uptime");
        expect(stats).toHaveProperty("debounceStats");
        expect(stats).toHaveProperty("gitIntegration");
        expect(stats).toHaveProperty("performanceOptimizer");
      } finally {
        process.chdir(originalCwd);
      }
    });

    it("should handle configuration updates without restart", async () => {
      const originalCwd = process.cwd();
      process.chdir(tempDir);

      try {
        await watchManager.start(mockContext);

        const newConfig: WatchConfiguration = {
          patterns: {
            include: ["**/*.json"],
            exclude: ["**/node_modules/**"],
          },
          debounce: {
            delay: 3000,
            maxWait: 15000,
          },
          monitoring: {
            logLevel: "verbose",
            enableProgressIndicators: false,
            enableNotifications: true,
          },
          performance: {
            batchSize: 25,
            rateLimitDelay: 200,
          },
        };

        await watchManager.updateConfiguration(newConfig);

        const status = watchManager.getStatus();
        expect(status.isActive).toBe(true);
      } finally {
        process.chdir(originalCwd);
      }
    });

    it("should handle error recovery and degradation", async () => {
      const originalCwd = process.cwd();
      process.chdir(tempDir);

      try {
        await watchManager.start(mockContext);

        // Get error recovery statistics
        const errorStats = watchManager.getErrorRecoveryStatistics();
        expect(errorStats).toHaveProperty("errorRecovery");
        expect(errorStats).toHaveProperty("degradation");
        expect(errorStats).toHaveProperty("activeErrors");

        // Test health check
        expect(watchManager.isHealthy()).toBe(true);
      } finally {
        process.chdir(originalCwd);
      }
    });

    it("should provide performance statistics", async () => {
      const originalCwd = process.cwd();
      process.chdir(tempDir);

      try {
        await watchManager.start(mockContext);

        const perfStats = watchManager.getPerformanceStatistics();
        expect(perfStats).toHaveProperty("performance");
        expect(perfStats).toHaveProperty("resources");
        expect(perfStats).toHaveProperty("queue");
        expect(perfStats).toHaveProperty("errors");
      } finally {
        process.chdir(originalCwd);
      }
    });

    it("should support manual reset to normal operation", async () => {
      const originalCwd = process.cwd();
      process.chdir(tempDir);

      try {
        await watchManager.start(mockContext);

        // Test reset functionality
        await watchManager.resetToNormalOperation();

        expect(watchManager.isHealthy()).toBe(true);
      } finally {
        process.chdir(originalCwd);
      }
    });

    it("should handle shutdown manager integration", async () => {
      const originalCwd = process.cwd();
      process.chdir(tempDir);

      try {
        await watchManager.start(mockContext);

        const shutdownManager = watchManager.getShutdownManager();
        expect(shutdownManager).toBeDefined();

        // Add a custom shutdown handler
        let handlerCalled = false;
        watchManager.addShutdownHandler(async () => {
          handlerCalled = true;
        });

        await watchManager.stop();
        expect(handlerCalled).toBe(true);
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe("Error Scenarios", () => {
    it("should handle invalid configuration gracefully", async () => {
      const originalCwd = process.cwd();
      process.chdir(tempDir);

      try {
        // Create invalid config
        const invalidConfig = {
          debounce: {
            delay: -1000, // Invalid negative delay
          },
        };

        const configPath = path.join(tempDir, "invalid-config.json");
        fs.writeFileSync(configPath, JSON.stringify({ watch: invalidConfig }));

        mockContext.flags.watchConfig = configPath;

        // Should fall back to default configuration
        await watchManager.start(mockContext);
        expect(watchManager.getStatus().isActive).toBe(true);
      } finally {
        process.chdir(originalCwd);
      }
    });

    it("should handle missing config file gracefully", async () => {
      const originalCwd = process.cwd();
      process.chdir(tempDir);

      try {
        mockContext.flags.watchConfig = "/nonexistent/config.json";

        // Should fall back to default configuration
        await watchManager.start(mockContext);
        expect(watchManager.getStatus().isActive).toBe(true);
      } finally {
        process.chdir(originalCwd);
      }
    });

    it("should prevent double initialization", async () => {
      const originalCwd = process.cwd();
      process.chdir(tempDir);

      try {
        await watchManager.start(mockContext);

        // Second start should throw error
        await expect(watchManager.start(mockContext)).rejects.toThrow(
          "Watch manager is already running",
        );
      } finally {
        process.chdir(originalCwd);
      }
    });

    it("should handle stop when not initialized", async () => {
      // Should not throw error
      await expect(watchManager.stop()).resolves.not.toThrow();
    });
  });

  describe("Feature Flags and Degradation", () => {
    it("should check feature availability in different degradation states", async () => {
      const originalCwd = process.cwd();
      process.chdir(tempDir);

      try {
        await watchManager.start(mockContext);

        // Test feature availability
        expect(watchManager.isFeatureEnabled("enableProgressIndicators")).toBe(
          true,
        );
        expect(watchManager.isFeatureEnabled("enableDetailedLogging")).toBe(
          true,
        );
      } finally {
        process.chdir(originalCwd);
      }
    });
  });
});

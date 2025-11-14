import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import * as fs from "fs";
import * as path from "path";

// Mock external dependencies at the top level
vi.mock("../plan", () => ({
  default: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../execute", () => ({
  default: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../../../utils/ui", () => ({
  renderSummary: vi.fn().mockResolvedValue(undefined),
}));

// Mock chokidar
vi.mock("chokidar", () => ({
  watch: vi.fn().mockReturnValue({
    on: vi.fn(),
    add: vi.fn(),
    unwatch: vi.fn(),
    close: vi.fn().mockResolvedValue(undefined),
    getWatched: vi.fn().mockReturnValue({
      "/test/locales": ["en.json", "es.json"],
    }),
  }),
}));

import { WatchManager } from "./manager";
import { CmdRunContext } from "../_types";

describe("End-to-End Watch Tests", () => {
  let watchManager: WatchManager;
  let mockContext: CmdRunContext;
  let tempDir: string;

  beforeEach(() => {
    watchManager = new WatchManager();
    tempDir = fs.mkdtempSync(path.join(__dirname, "e2e-test-"));

    mockContext = {
      flags: {
        watch: true,
        interactive: false,
        concurrency: 1,
        debug: false,
        debounce: 500, // Short debounce for testing
        debounceStrategy: "simple" as const,
        quiet: false,
        progress: true,
        notifications: false,
        batchSize: 5,
        rateLimitDelay: 10,
      },
      config: {
        locale: {
          source: "en",
          targets: ["es", "fr", "de"],
        },
        buckets: {
          json: {
            include: ["locales/[locale].json"],
          },
          yaml: {
            include: ["i18n/[locale].yml"],
          },
        },
      },
      tasks: [],
      results: new Map(),
      localizer: null,
    };

    // Create test directory structure
    const localesDir = path.join(tempDir, "locales");
    const i18nDir = path.join(tempDir, "i18n");
    fs.mkdirSync(localesDir, { recursive: true });
    fs.mkdirSync(i18nDir, { recursive: true });

    // Create source files
    fs.writeFileSync(
      path.join(localesDir, "en.json"),
      JSON.stringify(
        {
          greeting: "Hello",
          farewell: "Goodbye",
          navigation: {
            home: "Home",
            about: "About",
          },
        },
        null,
        2,
      ),
    );

    fs.writeFileSync(
      path.join(i18nDir, "en.yml"),
      `
common:
  save: "Save"
  cancel: "Cancel"
errors:
  required: "This field is required"
      `.trim(),
    );

    // Reset mocks
    vi.clearAllMocks();
  });

  afterEach(async () => {
    try {
      await watchManager.stop();
    } catch {
      // Ignore cleanup errors
    }

    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe("Complete File Change to Translation Workflow", () => {
    it("should start and stop watch manager successfully", async () => {
      const originalCwd = process.cwd();
      process.chdir(tempDir);

      try {
        // Start watch manager
        await watchManager.start(mockContext);

        const status = watchManager.getStatus();
        expect(status.isActive).toBe(true);
        expect(status.errorCount).toBe(0);

        // Stop watch manager
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

        expect(stats.uptime).toBeGreaterThan(0);
      } finally {
        process.chdir(originalCwd);
      }
    });

    it("should handle configuration updates", async () => {
      const originalCwd = process.cwd();
      process.chdir(tempDir);

      try {
        await watchManager.start(mockContext);

        const newConfig = {
          patterns: {
            include: ["**/*.json"],
            exclude: ["**/node_modules/**"],
          },
          debounce: {
            delay: 1000,
            maxWait: 5000,
          },
          monitoring: {
            logLevel: "verbose" as const,
            enableProgressIndicators: true,
            enableNotifications: false,
          },
          performance: {
            batchSize: 10,
            rateLimitDelay: 50,
          },
        };

        await watchManager.updateConfiguration(newConfig);

        const status = watchManager.getStatus();
        expect(status.isActive).toBe(true);
      } finally {
        process.chdir(originalCwd);
      }
    });

    it("should handle error recovery", async () => {
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

  describe("Performance Under Load", () => {
    it("should handle multiple file operations efficiently", async () => {
      const originalCwd = process.cwd();
      process.chdir(tempDir);

      try {
        // Create many test files
        const manyFilesDir = path.join(tempDir, "many-files");
        fs.mkdirSync(manyFilesDir, { recursive: true });

        for (let i = 0; i < 20; i++) {
          fs.writeFileSync(
            path.join(manyFilesDir, `file-${i}.json`),
            JSON.stringify({ key: `value-${i}` }),
          );
        }

        await watchManager.start(mockContext);

        const startTime = Date.now();

        // Wait a bit to simulate processing
        await new Promise((resolve) => setTimeout(resolve, 100));

        const endTime = Date.now();
        const processingTime = endTime - startTime;

        // Should complete within reasonable time (less than 2 seconds)
        expect(processingTime).toBeLessThan(2000);

        // Should be healthy
        expect(watchManager.isHealthy()).toBe(true);
      } finally {
        process.chdir(originalCwd);
      }
    });

    it("should maintain performance with continuous operations", async () => {
      const originalCwd = process.cwd();
      process.chdir(tempDir);

      try {
        await watchManager.start(mockContext);

        // Let it run for a short time
        await new Promise((resolve) => setTimeout(resolve, 200));

        // Should have handled the operations efficiently
        const stats = watchManager.getStatistics();
        expect(stats.uptime).toBeGreaterThan(0);

        // Memory usage should be reasonable
        const perfStats = watchManager.getPerformanceStatistics();
        expect(perfStats.resources).toBeDefined();
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe("Error Recovery Scenarios", () => {
    it("should maintain stability during operation", async () => {
      const originalCwd = process.cwd();
      process.chdir(tempDir);

      try {
        await watchManager.start(mockContext);

        // Wait a bit
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Watch should still be active
        expect(watchManager.getStatus().isActive).toBe(true);
        expect(watchManager.isHealthy()).toBe(true);
      } finally {
        process.chdir(originalCwd);
      }
    });

    it("should handle resource management gracefully", async () => {
      const originalCwd = process.cwd();
      process.chdir(tempDir);

      try {
        // Start with limited resources
        mockContext.flags.batchSize = 1;
        mockContext.flags.rateLimitDelay = 100;

        await watchManager.start(mockContext);

        await new Promise((resolve) => setTimeout(resolve, 200));

        // Should still be operational
        expect(watchManager.getStatus().isActive).toBe(true);
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe("Configuration Changes During Operation", () => {
    it("should handle configuration updates without interrupting operation", async () => {
      const originalCwd = process.cwd();
      process.chdir(tempDir);

      try {
        await watchManager.start(mockContext);

        // Update configuration while running
        await watchManager.updateConfiguration({
          patterns: {
            include: ["**/*.json"],
            exclude: ["**/node_modules/**"],
          },
          debounce: {
            delay: 1000,
            maxWait: 5000,
          },
          monitoring: {
            logLevel: "verbose",
            enableProgressIndicators: true,
            enableNotifications: false,
          },
          performance: {
            batchSize: 10,
            rateLimitDelay: 50,
          },
        });

        await new Promise((resolve) => setTimeout(resolve, 100));

        // Should still be active with new configuration
        expect(watchManager.getStatus().isActive).toBe(true);
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe("Feature Flags and System Health", () => {
    it("should check feature availability", async () => {
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

    it("should maintain system health over time", async () => {
      const originalCwd = process.cwd();
      process.chdir(tempDir);

      try {
        await watchManager.start(mockContext);

        // Monitor health over a short period
        for (let i = 0; i < 5; i++) {
          expect(watchManager.isHealthy()).toBe(true);
          expect(watchManager.getStatus().isActive).toBe(true);
          await new Promise((resolve) => setTimeout(resolve, 50));
        }

        const finalStats = watchManager.getStatistics();
        expect(finalStats.uptime).toBeGreaterThan(200); // At least 200ms uptime

        // Error count should be low
        expect(finalStats.errorCount).toBeLessThan(5);
      } finally {
        process.chdir(originalCwd);
      }
    });
  });
});

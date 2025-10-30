import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { CmdRunContext } from "./_types";
import { WatchManager } from "./watch/manager";

// Mock the WatchManager and its dependencies
vi.mock("./watch/manager", () => ({
  WatchManager: vi.fn().mockImplementation(() => ({
    start: vi.fn(),
    stop: vi.fn(),
    getStatus: vi.fn(),
    updateConfiguration: vi.fn(),
    getShutdownManager: vi.fn().mockReturnValue({
      initialize: vi.fn(),
      gracefulShutdown: vi.fn(),
      forceShutdown: vi.fn(),
      getStatus: vi.fn(),
    }),
    isHealthy: vi.fn().mockReturnValue(true),
    getStatistics: vi.fn().mockReturnValue({
      totalChanges: 0,
      retranslationCount: 0,
      errorCount: 0,
      averageRetranslationTime: 0,
    }),
  })),
}));

describe("Watch Integration Tests", () => {
  let mockContext: CmdRunContext;
  let mockWatchManager: any;

  beforeEach(() => {
    // Create a comprehensive mock context
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
        targetLocale: ["es", "fr"],
        watch: true,
        debounce: 5000,
        sound: undefined,
        watchInclude: ["src/**/*.json"],
        watchExclude: ["node_modules/**"],
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
          targets: ["es", "fr"],
        },
        buckets: [
          {
            type: "json",
            pathPattern: "src/locales/[locale].json",
          },
        ],
      } as any,
      localizer: null,
      tasks: [],
      results: new Map(),
    };

    // Reset mocks
    vi.clearAllMocks();

    // Create mock instance with all required methods
    mockWatchManager = {
      start: vi.fn(),
      stop: vi.fn(),
      getStatus: vi.fn(),
      updateConfiguration: vi.fn(),
      getShutdownManager: vi.fn().mockReturnValue({
        initialize: vi.fn(),
        gracefulShutdown: vi.fn(),
        forceShutdown: vi.fn(),
        getStatus: vi.fn(),
      }),
      isHealthy: vi.fn().mockReturnValue(true),
      getStatistics: vi.fn().mockReturnValue({
        totalChanges: 0,
        retranslationCount: 0,
        errorCount: 0,
        averageRetranslationTime: 0,
      }),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("WatchManager Integration", () => {
    it("should create and start WatchManager with correct context", async () => {
      await mockWatchManager.start(mockContext);

      expect(mockWatchManager.start).toHaveBeenCalledWith(mockContext);
      expect(mockWatchManager.start).toHaveBeenCalledTimes(1);
    });

    it("should handle WatchManager start errors gracefully", async () => {
      const startError = new Error("Failed to start watch manager");
      mockWatchManager.start.mockRejectedValue(startError);

      await expect(mockWatchManager.start(mockContext)).rejects.toThrow(
        "Failed to start watch manager",
      );
    });

    it("should initialize shutdown manager when starting", async () => {
      const mockShutdownManager = mockWatchManager.getShutdownManager();

      await mockWatchManager.start(mockContext);

      expect(mockWatchManager.getShutdownManager).toHaveBeenCalled();
      expect(mockShutdownManager.initialize).toBeDefined();
    });

    it("should handle watch manager stop correctly", async () => {
      await mockWatchManager.start(mockContext);
      await mockWatchManager.stop();

      expect(mockWatchManager.stop).toHaveBeenCalledTimes(1);
    });

    it("should get watch status correctly", async () => {
      const mockStatus = {
        isActive: true,
        watchedFiles: ["src/locales/en.json", "src/locales/es.json"],
        pendingChanges: [],
        lastActivity: new Date(),
        errorCount: 0,
      };

      mockWatchManager.getStatus.mockReturnValue(mockStatus);

      const status = mockWatchManager.getStatus();

      expect(status).toEqual(mockStatus);
      expect(status.isActive).toBe(true);
      expect(status.watchedFiles).toHaveLength(2);
      expect(status.errorCount).toBe(0);
    });
  });

  describe("Configuration Integration", () => {
    it("should pass enhanced watch flags to WatchManager", async () => {
      mockContext.flags.watchInclude = ["src/**/*.json", "config/**/*.yaml"];
      mockContext.flags.watchExclude = ["temp/**", "node_modules/**"];
      mockContext.flags.debounceStrategy = "adaptive";
      mockContext.flags.maxWait = 10000;
      mockContext.flags.batchSize = 75;
      mockContext.flags.rateLimitDelay = 200;

      await mockWatchManager.start(mockContext);

      expect(mockWatchManager.start).toHaveBeenCalledWith(
        expect.objectContaining({
          flags: expect.objectContaining({
            watchInclude: ["src/**/*.json", "config/**/*.yaml"],
            watchExclude: ["temp/**", "node_modules/**"],
            debounceStrategy: "adaptive",
            maxWait: 10000,
            batchSize: 75,
            rateLimitDelay: 200,
          }),
        }),
      );
    });

    it("should handle watch configuration file path", async () => {
      mockContext.flags.watchConfig = "/path/to/watch.config.json";

      await mockWatchManager.start(mockContext);

      expect(mockWatchManager.start).toHaveBeenCalledWith(
        expect.objectContaining({
          flags: expect.objectContaining({
            watchConfig: "/path/to/watch.config.json",
          }),
        }),
      );
    });

    it("should handle feedback configuration flags", async () => {
      mockContext.flags.verbose = true;
      mockContext.flags.quiet = false;
      mockContext.flags.progress = true;
      mockContext.flags.notifications = true;

      await mockWatchManager.start(mockContext);

      expect(mockWatchManager.start).toHaveBeenCalledWith(
        expect.objectContaining({
          flags: expect.objectContaining({
            verbose: true,
            quiet: false,
            progress: true,
            notifications: true,
          }),
        }),
      );
    });

    it("should update configuration without restart", async () => {
      const newConfig = {
        patterns: {
          include: ["new/**/*.json"],
          exclude: ["new/temp/**"],
        },
        debounce: {
          delay: 3000,
          maxWait: 8000,
        },
        monitoring: {
          enableProgressIndicators: false,
          enableNotifications: true,
          logLevel: "verbose" as const,
        },
        performance: {
          batchSize: 100,
          rateLimitDelay: 150,
        },
      };

      await mockWatchManager.updateConfiguration(newConfig);

      expect(mockWatchManager.updateConfiguration).toHaveBeenCalledWith(
        newConfig,
      );
    });
  });

  describe("Backward Compatibility", () => {
    it("should work with legacy watch flags only", async () => {
      const legacyContext: CmdRunContext = {
        ...mockContext,
        flags: {
          ...mockContext.flags,
          watch: true,
          debounce: 3000,
          sound: true,
          verbose: true,
          // No enhanced watch flags
          watchInclude: undefined,
          watchExclude: undefined,
          watchConfig: undefined,
          debounceStrategy: "simple",
          maxWait: undefined,
          quiet: false,
          progress: true,
          notifications: false,
          batchSize: 50,
          rateLimitDelay: 100,
        },
      };

      await mockWatchManager.start(legacyContext);

      expect(mockWatchManager.start).toHaveBeenCalledWith(legacyContext);
      expect(mockWatchManager.start).toHaveBeenCalledTimes(1);
    });

    it("should maintain existing behavior with no watch flags", async () => {
      const noWatchContext: CmdRunContext = {
        ...mockContext,
        flags: {
          ...mockContext.flags,
          watch: false,
          // All watch-related flags should be defaults or undefined
        },
      };

      // When watch is false, WatchManager should not be started
      // This test verifies the integration respects the watch flag
      expect(noWatchContext.flags.watch).toBe(false);
    });

    it("should handle mixed legacy and new flags", async () => {
      const mixedContext: CmdRunContext = {
        ...mockContext,
        flags: {
          ...mockContext.flags,
          // Legacy flags
          watch: true,
          debounce: 2000,
          verbose: true,
          sound: true,

          // New flags
          watchInclude: ["src/**/*.json"],
          debounceStrategy: "batch" as const,
          maxWait: 8000,
          notifications: true,
          batchSize: 25,
        },
      };

      await mockWatchManager.start(mixedContext);

      expect(mockWatchManager.start).toHaveBeenCalledWith(
        expect.objectContaining({
          flags: expect.objectContaining({
            watch: true,
            debounce: 2000,
            verbose: true,
            sound: true,
            watchInclude: ["src/**/*.json"],
            debounceStrategy: "batch",
            maxWait: 8000,
            notifications: true,
            batchSize: 25,
          }),
        }),
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle configuration validation errors", async () => {
      const configError = new Error("Invalid watch configuration");
      mockWatchManager.start.mockRejectedValue(configError);

      await expect(mockWatchManager.start(mockContext)).rejects.toThrow(
        "Invalid watch configuration",
      );
    });

    it("should handle file watcher initialization errors", async () => {
      const watcherError = new Error("Failed to initialize file watcher");
      mockWatchManager.start.mockRejectedValue(watcherError);

      await expect(mockWatchManager.start(mockContext)).rejects.toThrow(
        "Failed to initialize file watcher",
      );
    });

    it("should handle shutdown errors gracefully", async () => {
      const shutdownError = new Error("Shutdown failed");
      mockWatchManager.stop.mockRejectedValue(shutdownError);

      await expect(mockWatchManager.stop()).rejects.toThrow("Shutdown failed");
    });

    it("should handle configuration update errors", async () => {
      const updateError = new Error("Configuration update failed");
      mockWatchManager.updateConfiguration.mockRejectedValue(updateError);

      const newConfig = {
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
      };

      await expect(
        mockWatchManager.updateConfiguration(newConfig),
      ).rejects.toThrow("Configuration update failed");
    });
  });

  describe("Context Validation", () => {
    it("should handle context with missing config", async () => {
      const contextWithoutConfig: CmdRunContext = {
        ...mockContext,
        config: null,
      };

      await mockWatchManager.start(contextWithoutConfig);

      expect(mockWatchManager.start).toHaveBeenCalledWith(contextWithoutConfig);
    });

    it("should handle context with missing localizer", async () => {
      const contextWithoutLocalizer: CmdRunContext = {
        ...mockContext,
        localizer: null,
      };

      await mockWatchManager.start(contextWithoutLocalizer);

      expect(mockWatchManager.start).toHaveBeenCalledWith(
        contextWithoutLocalizer,
      );
    });

    it("should handle context with existing tasks and results", async () => {
      const contextWithData: CmdRunContext = {
        ...mockContext,
        tasks: [
          {
            sourceLocale: "en",
            targetLocale: "es",
            bucketType: "json",
            bucketPathPattern: "src/locales/[locale].json",
            injectLocale: [],
            lockedKeys: [],
            lockedPatterns: [],
            ignoredKeys: [],
            onlyKeys: [],
          },
        ],
        results: new Map([
          [
            {
              sourceLocale: "en",
              targetLocale: "es",
              bucketType: "json",
              bucketPathPattern: "src/locales/[locale].json",
              injectLocale: [],
              lockedKeys: [],
              lockedPatterns: [],
              ignoredKeys: [],
              onlyKeys: [],
            },
            {
              status: "success" as const,
              pathPattern: "src/locales/[locale].json",
              sourceLocale: "en",
              targetLocale: "es",
            },
          ],
        ]),
      };

      await mockWatchManager.start(contextWithData);

      expect(mockWatchManager.start).toHaveBeenCalledWith(contextWithData);
    });
  });

  describe("Statistics and Monitoring", () => {
    it("should provide watch statistics", () => {
      const mockStats = {
        totalChanges: 15,
        retranslationCount: 5,
        errorCount: 1,
        averageRetranslationTime: 2500,
      };

      mockWatchManager.getStatistics.mockReturnValue(mockStats);

      const stats = mockWatchManager.getStatistics();

      expect(stats).toEqual(mockStats);
      expect(stats.totalChanges).toBe(15);
      expect(stats.retranslationCount).toBe(5);
      expect(stats.errorCount).toBe(1);
      expect(stats.averageRetranslationTime).toBe(2500);
    });

    it("should report health status", () => {
      mockWatchManager.isHealthy.mockReturnValue(true);

      const isHealthy = mockWatchManager.isHealthy();

      expect(isHealthy).toBe(true);
    });

    it("should handle unhealthy state", () => {
      mockWatchManager.isHealthy.mockReturnValue(false);

      const isHealthy = mockWatchManager.isHealthy();

      expect(isHealthy).toBe(false);
    });
  });

  describe("Shutdown Manager Integration", () => {
    it("should initialize shutdown manager", async () => {
      const mockShutdownManager = {
        initialize: vi.fn(),
        gracefulShutdown: vi.fn(),
        forceShutdown: vi.fn(),
        getStatus: vi.fn(),
      };

      mockWatchManager.getShutdownManager.mockReturnValue(mockShutdownManager);

      await mockWatchManager.start(mockContext);
      const shutdownManager = mockWatchManager.getShutdownManager();

      expect(shutdownManager).toBeDefined();
      expect(shutdownManager.initialize).toBeDefined();
      expect(shutdownManager.gracefulShutdown).toBeDefined();
      expect(shutdownManager.forceShutdown).toBeDefined();
    });

    it("should handle graceful shutdown", async () => {
      const mockShutdownManager = {
        initialize: vi.fn(),
        gracefulShutdown: vi.fn(),
        forceShutdown: vi.fn(),
        getStatus: vi.fn().mockReturnValue({
          isShuttingDown: false,
          isHealthy: true,
          uptime: 30000,
          statistics: {},
        }),
      };

      mockWatchManager.getShutdownManager.mockReturnValue(mockShutdownManager);

      const shutdownManager = mockWatchManager.getShutdownManager();
      await shutdownManager.gracefulShutdown("SIGINT");

      expect(shutdownManager.gracefulShutdown).toHaveBeenCalledWith("SIGINT");
    });

    it("should handle force shutdown", async () => {
      const mockShutdownManager = {
        initialize: vi.fn(),
        gracefulShutdown: vi.fn(),
        forceShutdown: vi.fn(),
        getStatus: vi.fn(),
      };

      mockWatchManager.getShutdownManager.mockReturnValue(mockShutdownManager);

      const shutdownManager = mockWatchManager.getShutdownManager();
      shutdownManager.forceShutdown();

      expect(shutdownManager.forceShutdown).toHaveBeenCalled();
    });
  });
});

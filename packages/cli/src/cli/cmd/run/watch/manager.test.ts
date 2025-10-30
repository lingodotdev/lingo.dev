import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { WatchManager } from "./manager";
import { ConfigurationManager } from "./config";
import { FileWatcherService } from "./watcher";
import { FeedbackManager } from "./feedback";
import { DebounceController } from "./debounce";
import { PatternResolver } from "./patterns";
import { ShutdownManager } from "./shutdown";
import { CmdRunContext } from "../_types";
import { WatchConfiguration, FileChangeEvent, WatchError } from "./types";

// Mock all dependencies
vi.mock("./config");
vi.mock("./watcher");
vi.mock("./feedback");
vi.mock("./debounce");
vi.mock("./patterns");
vi.mock("./shutdown");
vi.mock("../plan");
vi.mock("../execute");
vi.mock("../../../utils/ui");

const mockConfigManager = vi.mocked(ConfigurationManager);
const mockFileWatcher = vi.mocked(FileWatcherService);
const mockFeedbackManager = vi.mocked(FeedbackManager);
const mockDebounceController = vi.mocked(DebounceController);
const mockPatternResolver = vi.mocked(PatternResolver);
const mockShutdownManager = vi.mocked(ShutdownManager);

describe("WatchManager", () => {
  let watchManager: WatchManager;
  let mockContext: CmdRunContext;
  let mockConfig: WatchConfiguration;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Create mock context
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
        watch: true,
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
          targets: ["es", "fr"],
        },
        buckets: [],
      },
      tasks: [],
      results: new Map(),
    };

    // Create mock configuration
    mockConfig = {
      patterns: {
        include: ["src/**/*.json"],
        exclude: ["node_modules/**"],
      },
      debounce: {
        delay: 5000,
        maxWait: 10000,
      },
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

    // Set up mock implementations
    mockConfigManager.prototype.loadConfiguration = vi
      .fn()
      .mockResolvedValue(mockConfig);
    mockConfigManager.prototype.validateConfiguration = vi
      .fn()
      .mockReturnValue({
        isValid: true,
        errors: [],
        warnings: [],
      });

    mockPatternResolver.prototype.resolveWatchPatterns = vi
      .fn()
      .mockResolvedValue({
        include: ["src/**/*.json"],
        exclude: ["node_modules/**"],
        resolved: ["src/locales/en.json", "src/locales/es.json"],
      });

    mockFileWatcher.prototype.initialize = vi.fn().mockResolvedValue(undefined);
    mockFileWatcher.prototype.destroy = vi.fn().mockResolvedValue(undefined);
    mockFileWatcher.prototype.getWatchedFiles = vi
      .fn()
      .mockReturnValue(["src/locales/en.json", "src/locales/es.json"]);
    mockFileWatcher.prototype.onFileChange = vi.fn();
    mockFileWatcher.prototype.onError = vi.fn();

    mockFeedbackManager.prototype.updateConfiguration = vi.fn();
    mockFeedbackManager.prototype.reportFileChange = vi.fn();
    mockFeedbackManager.prototype.reportRetranslationStart = vi.fn();
    mockFeedbackManager.prototype.reportRetranslationComplete = vi.fn();
    mockFeedbackManager.prototype.reportError = vi.fn();

    mockDebounceController.prototype.updateStrategy = vi.fn();
    mockDebounceController.prototype.setRetranslationCallback = vi.fn();
    mockDebounceController.prototype.scheduleRetranslation = vi.fn();
    mockDebounceController.prototype.cancelPending = vi.fn();
    mockDebounceController.prototype.getStatistics = vi.fn().mockReturnValue({
      pendingChanges: 0,
      isActive: false,
      strategy: "simple",
      lastExecutionTime: 0,
    });

    mockShutdownManager.prototype.initialize = vi.fn();

    // Create new instance
    watchManager = new WatchManager();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("constructor", () => {
    it("should initialize all components", () => {
      expect(mockConfigManager).toHaveBeenCalledTimes(1);
      expect(mockFileWatcher).toHaveBeenCalledTimes(1);
      expect(mockFeedbackManager).toHaveBeenCalledTimes(1);
      expect(mockPatternResolver).toHaveBeenCalledTimes(1);
      expect(mockDebounceController).toHaveBeenCalledWith({
        type: "simple",
        delay: 5000,
      });
      expect(mockShutdownManager).toHaveBeenCalledWith(
        watchManager,
        expect.any(Object),
      );
    });

    it("should initialize with default watch state", () => {
      const status = watchManager.getStatus();
      expect(status.isActive).toBe(false);
      expect(status.pendingChanges).toEqual([]);
      expect(status.errorCount).toBe(0);
    });
  });

  describe("start", () => {
    it("should start watch process successfully", async () => {
      await watchManager.start(mockContext);

      expect(
        mockConfigManager.prototype.loadConfiguration,
      ).toHaveBeenCalledWith(mockContext);
      expect(
        mockConfigManager.prototype.validateConfiguration,
      ).toHaveBeenCalledWith(mockConfig);
      expect(
        mockPatternResolver.prototype.resolveWatchPatterns,
      ).toHaveBeenCalledWith(mockContext);
      expect(mockFileWatcher.prototype.initialize).toHaveBeenCalled();
      expect(
        mockDebounceController.prototype.updateStrategy,
      ).toHaveBeenCalled();
      expect(mockShutdownManager.prototype.initialize).toHaveBeenCalled();

      const status = watchManager.getStatus();
      expect(status.isActive).toBe(true);
    });

    it("should throw error if already initialized", async () => {
      await watchManager.start(mockContext);

      await expect(watchManager.start(mockContext)).rejects.toThrow(
        "Watch manager is already running",
      );
    });

    it("should handle configuration validation errors", async () => {
      // Create a new manager to avoid state from previous tests
      const newManager = new WatchManager();

      mockConfigManager.prototype.validateConfiguration = vi
        .fn()
        .mockReturnValue({
          isValid: false,
          errors: ["Invalid debounce delay"],
          warnings: [],
        });

      await expect(newManager.start(mockContext)).rejects.toThrow(
        "Invalid watch configuration: Invalid debounce delay",
      );

      const status = newManager.getStatus();
      expect(status.isActive).toBe(false);
      expect(status.errorCount).toBe(1);
    });

    it("should handle file watcher initialization errors", async () => {
      // Create a new manager to avoid state from previous tests
      const newManager = new WatchManager();

      const error = new Error("Failed to initialize watcher");
      mockFileWatcher.prototype.initialize = vi.fn().mockRejectedValue(error);

      await expect(newManager.start(mockContext)).rejects.toThrow(error);

      const status = newManager.getStatus();
      expect(status.isActive).toBe(false);
      expect(status.errorCount).toBe(1);
    });
  });

  describe("stop", () => {
    beforeEach(async () => {
      await watchManager.start(mockContext);
    });

    it("should stop watch process successfully", async () => {
      await watchManager.stop();

      expect(mockDebounceController.prototype.cancelPending).toHaveBeenCalled();
      expect(mockFileWatcher.prototype.destroy).toHaveBeenCalled();

      const status = watchManager.getStatus();
      expect(status.isActive).toBe(false);
    });

    it("should handle stop when not initialized", async () => {
      const newManager = new WatchManager();
      await expect(newManager.stop()).resolves.not.toThrow();
    });

    it("should handle file watcher destroy errors", async () => {
      const error = new Error("Failed to destroy watcher");
      mockFileWatcher.prototype.destroy = vi.fn().mockRejectedValue(error);

      await expect(watchManager.stop()).rejects.toThrow(error);
    });
  });

  describe("getStatus", () => {
    it("should return correct status when not running", () => {
      // Override mock to return empty files when not initialized
      mockFileWatcher.prototype.getWatchedFiles = vi.fn().mockReturnValue([]);

      const status = watchManager.getStatus();

      expect(status).toEqual({
        isActive: false,
        watchedFiles: [],
        pendingChanges: [],
        lastActivity: expect.any(Date),
        errorCount: 0,
      });
    });

    it("should return correct status when running", async () => {
      await watchManager.start(mockContext);
      const status = watchManager.getStatus();

      expect(status).toEqual({
        isActive: true,
        watchedFiles: ["src/locales/en.json", "src/locales/es.json"],
        pendingChanges: [],
        lastActivity: expect.any(Date),
        errorCount: 0,
      });
    });
  });

  describe("updateConfiguration", () => {
    beforeEach(async () => {
      await watchManager.start(mockContext);
    });

    it("should update configuration successfully", async () => {
      const newConfig: WatchConfiguration = {
        ...mockConfig,
        debounce: { delay: 3000 },
      };

      await watchManager.updateConfiguration(newConfig);

      expect(
        mockConfigManager.prototype.validateConfiguration,
      ).toHaveBeenCalledWith(newConfig);
      expect(
        mockFeedbackManager.prototype.updateConfiguration,
      ).toHaveBeenCalled();
      expect(
        mockDebounceController.prototype.updateStrategy,
      ).toHaveBeenCalled();
    });

    it("should handle invalid configuration", async () => {
      const invalidConfig = { ...mockConfig };
      mockConfigManager.prototype.validateConfiguration = vi
        .fn()
        .mockReturnValue({
          isValid: false,
          errors: ["Invalid configuration"],
          warnings: [],
        });

      await expect(
        watchManager.updateConfiguration(invalidConfig),
      ).rejects.toThrow("Invalid configuration: Invalid configuration");
    });
  });

  describe("file change handling", () => {
    let fileChangeHandler: (event: FileChangeEvent) => void;

    beforeEach(async () => {
      await watchManager.start(mockContext);

      // Capture the file change handler
      const onFileChangeCall = vi.mocked(mockFileWatcher.prototype.onFileChange)
        .mock.calls[0];
      fileChangeHandler = onFileChangeCall[0];
    });

    it("should handle file change events", () => {
      const changeEvent: FileChangeEvent = {
        type: "change",
        path: "src/locales/en.json",
        timestamp: new Date(),
      };

      fileChangeHandler(changeEvent);

      expect(
        mockFeedbackManager.prototype.reportFileChange,
      ).toHaveBeenCalledWith(changeEvent);
      expect(
        mockDebounceController.prototype.scheduleRetranslation,
      ).toHaveBeenCalledWith([changeEvent]);
    });
  });

  describe("error handling", () => {
    let errorHandler: (error: WatchError) => void;

    beforeEach(async () => {
      await watchManager.start(mockContext);

      // Capture the error handler
      const onErrorCall = vi.mocked(mockFileWatcher.prototype.onError).mock
        .calls[0];
      errorHandler = onErrorCall[0];
    });

    it("should handle file watcher errors", () => {
      const watchError: WatchError = {
        type: "file_system",
        message: "File system error",
        recoverable: true,
      };

      errorHandler(watchError);

      expect(mockFeedbackManager.prototype.reportError).toHaveBeenCalledWith(
        watchError,
      );

      const status = watchManager.getStatus();
      expect(status.errorCount).toBe(1);
    });
  });

  describe("statistics", () => {
    beforeEach(async () => {
      await watchManager.start(mockContext);
    });

    it("should return detailed statistics", () => {
      const stats = watchManager.getStatistics();

      expect(stats).toEqual({
        totalChanges: 0,
        retranslationCount: 0,
        errorCount: 0,
        averageRetranslationTime: 0,
        debounceStats: {
          pendingChanges: 0,
          isActive: false,
          strategy: "simple",
          lastExecutionTime: 0,
        },
        uptime: expect.any(Number),
      });
    });
  });

  describe("health check", () => {
    it("should return false when not initialized", () => {
      expect(watchManager.isHealthy()).toBe(false);
    });

    it("should return true when running normally", async () => {
      await watchManager.start(mockContext);
      expect(watchManager.isHealthy()).toBe(true);
    });

    it("should return false when too many errors", async () => {
      await watchManager.start(mockContext);

      // Simulate multiple errors
      const errorHandler = vi.mocked(mockFileWatcher.prototype.onError).mock
        .calls[0][0];
      for (let i = 0; i < 15; i++) {
        errorHandler({
          type: "file_system",
          message: `Error ${i}`,
          recoverable: true,
        });
      }

      expect(watchManager.isHealthy()).toBe(false);
    });
  });

  describe("shutdown manager integration", () => {
    it("should provide access to shutdown manager", () => {
      const shutdownManager = watchManager.getShutdownManager();
      expect(shutdownManager).toBeInstanceOf(mockShutdownManager);
    });
  });
});

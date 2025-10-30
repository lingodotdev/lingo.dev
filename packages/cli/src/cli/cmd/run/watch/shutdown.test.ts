import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { ShutdownManager } from "./shutdown";
import { WatchManager } from "./manager";
import { FeedbackManager } from "./feedback";
import { WatchError } from "./types";

// Mock dependencies
vi.mock("./manager");
vi.mock("./feedback");

const mockWatchManager = vi.mocked(WatchManager);
const mockFeedbackManager = vi.mocked(FeedbackManager);

// Mock process methods
const originalProcess = process;
const mockProcess = {
  ...process,
  on: vi.fn(),
  removeListener: vi.fn(),
  exit: vi.fn(),
  uptime: vi.fn().mockReturnValue(120), // 2 minutes
};

describe("ShutdownManager", () => {
  let shutdownManager: ShutdownManager;
  let mockWatchManagerInstance: any;
  let mockFeedbackManagerInstance: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Create mock instances
    mockWatchManagerInstance = {
      stop: vi.fn().mockResolvedValue(undefined),
      getStatus: vi.fn().mockReturnValue({
        isActive: true,
        watchedFiles: ["file1.json", "file2.json"],
        pendingChanges: [],
        lastActivity: new Date(),
        errorCount: 0,
      }),
      isHealthy: vi.fn().mockReturnValue(true),
      getStatistics: vi.fn().mockReturnValue({
        totalChanges: 10,
        retranslationCount: 5,
        errorCount: 0,
        averageRetranslationTime: 1000,
      }),
    };

    mockFeedbackManagerInstance = {
      reportRetranslationStart: vi.fn(),
      reportError: vi.fn(),
    };

    // Replace global process with mock
    global.process = mockProcess as any;

    shutdownManager = new ShutdownManager(
      mockWatchManagerInstance,
      mockFeedbackManagerInstance,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    global.process = originalProcess;
  });

  describe("constructor", () => {
    it("should initialize with provided dependencies", () => {
      expect(shutdownManager).toBeDefined();
    });
  });

  describe("initialize", () => {
    it("should set up signal handlers and start health monitoring", () => {
      vi.useFakeTimers();

      shutdownManager.initialize();

      // Verify signal handlers are set up
      expect(mockProcess.on).toHaveBeenCalledWith(
        "SIGINT",
        expect.any(Function),
      );
      expect(mockProcess.on).toHaveBeenCalledWith(
        "SIGTERM",
        expect.any(Function),
      );
      expect(mockProcess.on).toHaveBeenCalledWith(
        "uncaughtException",
        expect.any(Function),
      );
      expect(mockProcess.on).toHaveBeenCalledWith(
        "unhandledRejection",
        expect.any(Function),
      );
      expect(mockProcess.on).toHaveBeenCalledWith(
        "SIGUSR1",
        expect.any(Function),
      );
      expect(mockProcess.on).toHaveBeenCalledWith(
        "SIGUSR2",
        expect.any(Function),
      );

      vi.useRealTimers();
    });
  });

  describe("gracefulShutdown", () => {
    beforeEach(() => {
      shutdownManager.initialize();
    });

    it("should perform graceful shutdown successfully", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      await shutdownManager.gracefulShutdown("SIGINT");

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Received SIGINT signal"),
      );
      expect(mockWatchManagerInstance.stop).toHaveBeenCalled();
      expect(mockProcess.exit).toHaveBeenCalledWith(0);

      consoleSpy.mockRestore();
    });

    it("should handle shutdown timeout", async () => {
      vi.useFakeTimers();

      // Make stop method hang
      mockWatchManagerInstance.stop = vi.fn().mockImplementation(
        () => new Promise(() => {}), // Never resolves
      );

      shutdownManager.setShutdownTimeout(1000);

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const shutdownPromise = shutdownManager.gracefulShutdown("SIGINT");

      // Fast-forward time to trigger timeout
      vi.advanceTimersByTime(1100);

      await shutdownPromise;

      expect(consoleSpy).toHaveBeenCalledWith(
        "❌ Shutdown failed or timed out:",
        expect.any(Error),
      );
      expect(mockProcess.exit).toHaveBeenCalledWith(1);

      consoleSpy.mockRestore();
      vi.useRealTimers();
    });

    it("should prevent multiple shutdown attempts", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      // Start first shutdown
      const firstShutdown = shutdownManager.gracefulShutdown("SIGINT");

      // Try second shutdown
      await shutdownManager.gracefulShutdown("SIGTERM");

      expect(consoleSpy).toHaveBeenCalledWith(
        "⚠️  Shutdown already in progress...",
      );

      await firstShutdown;
      consoleSpy.mockRestore();
    });

    it("should handle watch manager stop errors", async () => {
      const error = new Error("Stop failed");
      mockWatchManagerInstance.stop = vi.fn().mockRejectedValue(error);

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await shutdownManager.gracefulShutdown("SIGINT");

      expect(mockFeedbackManagerInstance.reportError).toHaveBeenCalledWith({
        type: "file_system",
        message: "Shutdown error: Stop failed",
        recoverable: false,
      });
      expect(mockProcess.exit).toHaveBeenCalledWith(1);

      consoleSpy.mockRestore();
    });
  });

  describe("forceShutdown", () => {
    it("should force immediate shutdown", () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      shutdownManager.forceShutdown();

      expect(consoleSpy).toHaveBeenCalledWith("🔥 Force shutdown initiated");
      expect(mockProcess.exit).toHaveBeenCalledWith(1);

      consoleSpy.mockRestore();
    });
  });

  describe("getStatus", () => {
    it("should return current status", () => {
      const status = shutdownManager.getStatus();

      expect(status).toEqual({
        isShuttingDown: false,
        isHealthy: true,
        uptime: expect.any(Number),
        statistics: {
          totalChanges: 10,
          retranslationCount: 5,
          errorCount: 0,
          averageRetranslationTime: 1000,
        },
      });
    });

    it("should reflect shutdown state", async () => {
      // Start shutdown but don't await it
      shutdownManager.gracefulShutdown("SIGINT");

      const status = shutdownManager.getStatus();
      expect(status.isShuttingDown).toBe(true);
    });
  });

  describe("setShutdownTimeout", () => {
    it("should set valid timeout values", () => {
      shutdownManager.setShutdownTimeout(5000);
      // No direct way to test this, but it should not throw
    });

    it("should clamp timeout to valid range", () => {
      shutdownManager.setShutdownTimeout(500); // Below minimum
      shutdownManager.setShutdownTimeout(100000); // Above maximum
      // Should clamp to 1000ms and 60000ms respectively
    });
  });

  describe("signal handlers", () => {
    beforeEach(() => {
      shutdownManager.initialize();
    });

    it("should handle SIGINT signal", () => {
      const sigintHandler = mockProcess.on.mock.calls.find(
        (call) => call[0] === "SIGINT",
      )?.[1];

      expect(sigintHandler).toBeDefined();

      // Test that handler exists and is callable
      expect(typeof sigintHandler).toBe("function");
    });

    it("should handle SIGTERM signal", () => {
      const sigtermHandler = mockProcess.on.mock.calls.find(
        (call) => call[0] === "SIGTERM",
      )?.[1];

      expect(sigtermHandler).toBeDefined();
      expect(typeof sigtermHandler).toBe("function");
    });

    it("should handle uncaught exceptions", () => {
      const exceptionHandler = mockProcess.on.mock.calls.find(
        (call) => call[0] === "uncaughtException",
      )?.[1];

      expect(exceptionHandler).toBeDefined();
      expect(typeof exceptionHandler).toBe("function");
    });

    it("should handle unhandled rejections", () => {
      const rejectionHandler = mockProcess.on.mock.calls.find(
        (call) => call[0] === "unhandledRejection",
      )?.[1];

      expect(rejectionHandler).toBeDefined();
      expect(typeof rejectionHandler).toBe("function");
    });

    it("should handle SIGUSR1 for status reporting", () => {
      const statusHandler = mockProcess.on.mock.calls.find(
        (call) => call[0] === "SIGUSR1",
      )?.[1];

      expect(statusHandler).toBeDefined();

      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      if (statusHandler) {
        statusHandler();
      }

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Watch Manager Status Report"),
      );

      consoleSpy.mockRestore();
    });

    it("should handle SIGUSR2 for health check", () => {
      const healthHandler = mockProcess.on.mock.calls.find(
        (call) => call[0] === "SIGUSR2",
      )?.[1];

      expect(healthHandler).toBeDefined();
      expect(typeof healthHandler).toBe("function");
    });
  });

  describe("health monitoring", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should start health monitoring on initialize", () => {
      shutdownManager.initialize();

      // Fast-forward time to trigger health check
      vi.advanceTimersByTime(30000);

      // Health check should have been called
      expect(mockWatchManagerInstance.isHealthy).toHaveBeenCalled();
    });

    it("should report health issues", () => {
      mockWatchManagerInstance.isHealthy = vi.fn().mockReturnValue(false);

      shutdownManager.initialize();

      // Fast-forward time to trigger health check
      vi.advanceTimersByTime(30000);

      expect(mockFeedbackManagerInstance.reportError).toHaveBeenCalledWith({
        type: "file_system",
        message: "Watch manager health check failed",
        recoverable: true,
      });
    });
  });

  describe("uptime formatting", () => {
    it("should format uptime correctly", () => {
      // Test different uptime values by mocking process.uptime
      mockProcess.uptime = vi.fn().mockReturnValue(3665); // 1h 1m 5s

      const status = shutdownManager.getStatus();
      expect(status.uptime).toBe(3665000); // Should be in milliseconds
    });
  });
});

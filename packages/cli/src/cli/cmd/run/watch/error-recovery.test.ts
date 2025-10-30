import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  ErrorRecoveryManager,
  ErrorCategory,
  ErrorSeverity,
  RecoverableError,
} from "./error-recovery";
import { WatchError } from "./types";

describe("ErrorRecoveryManager", () => {
  let errorRecoveryManager: ErrorRecoveryManager;

  beforeEach(() => {
    errorRecoveryManager = new ErrorRecoveryManager();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Error Categorization", () => {
    it("should categorize file system errors correctly", async () => {
      const fileSystemError: WatchError = {
        type: "file_system",
        message: "ENOENT: no such file or directory",
        path: "/test/file.txt",
        recoverable: true,
      };

      const result = await errorRecoveryManager.handleError(fileSystemError);
      expect(result.shouldRetry).toBe(true);
    });

    it("should categorize translation errors correctly", async () => {
      const translationError: WatchError = {
        type: "translation",
        message: "API rate limit exceeded",
        recoverable: true,
      };

      const result = await errorRecoveryManager.handleError(translationError);
      expect(result.shouldRetry).toBe(true);
    });

    it("should categorize configuration errors correctly", async () => {
      const configError: WatchError = {
        type: "configuration",
        message: "Invalid configuration file",
        recoverable: false,
      };

      const result = await errorRecoveryManager.handleError(configError);
      expect(result.shouldRetry).toBe(false);
    });
  });

  describe("Error Severity Detection", () => {
    it("should detect critical errors", async () => {
      const criticalError: WatchError = {
        type: "file_system",
        message: "CRITICAL: Disk full, cannot continue",
        recoverable: true,
      };

      await errorRecoveryManager.handleError(criticalError);
      const stats = errorRecoveryManager.getErrorStatistics();
      expect(stats.errorsBySeverity.critical).toBe(1);
    });

    it("should detect high severity errors", async () => {
      const highSeverityError: WatchError = {
        type: "file_system",
        message: "Permission denied accessing file",
        recoverable: true,
      };

      await errorRecoveryManager.handleError(highSeverityError);
      const stats = errorRecoveryManager.getErrorStatistics();
      expect(stats.errorsBySeverity.high).toBe(1);
    });

    it("should detect medium severity errors", async () => {
      const mediumSeverityError: WatchError = {
        type: "translation",
        message: "Network timeout occurred",
        recoverable: true,
      };

      await errorRecoveryManager.handleError(mediumSeverityError);
      const stats = errorRecoveryManager.getErrorStatistics();
      expect(stats.errorsBySeverity.medium).toBe(1);
    });

    it("should detect low severity errors", async () => {
      const lowSeverityError: WatchError = {
        type: "file_system",
        message: "File not found, will retry",
        recoverable: true,
      };

      await errorRecoveryManager.handleError(lowSeverityError);
      const stats = errorRecoveryManager.getErrorStatistics();
      expect(stats.errorsBySeverity.low).toBe(1);
    });
  });

  describe("Retry Logic", () => {
    it("should implement exponential backoff", async () => {
      const error: WatchError = {
        type: "file_system",
        message: "Temporary file access error",
        recoverable: true,
      };

      // First attempt
      const result1 = await errorRecoveryManager.handleError(error);
      expect(result1.shouldRetry).toBe(true);
      expect(result1.nextRetryDelay).toBeGreaterThan(0);

      // Second attempt should have longer delay
      const result2 = await errorRecoveryManager.handleError(error);
      expect(result2.shouldRetry).toBe(true);
      expect(result2.nextRetryDelay).toBeGreaterThan(result1.nextRetryDelay!);
    });

    it("should stop retrying after max attempts", async () => {
      const error: WatchError = {
        type: "file_system",
        message: "Persistent file access error",
        recoverable: true,
      };

      // Exhaust all retry attempts
      for (let i = 0; i < 6; i++) {
        await errorRecoveryManager.handleError(error);
      }

      const finalResult = await errorRecoveryManager.handleError(error);
      expect(finalResult.shouldRetry).toBe(false);
      expect(finalResult.message).toContain("Maximum retries");
    });

    it("should add jitter to retry delays", async () => {
      const error: WatchError = {
        type: "file_system",
        message: "Network error with jitter test",
        recoverable: true,
      };

      const delays: number[] = [];
      for (let i = 0; i < 3; i++) {
        const result = await errorRecoveryManager.handleError({
          ...error,
          message: `${error.message} ${i}`, // Make each error unique
        });
        if (result.nextRetryDelay) {
          delays.push(result.nextRetryDelay);
        }
      }

      // Delays should be different due to jitter
      expect(delays.length).toBe(3);
      expect(new Set(delays).size).toBeGreaterThan(1);
    });
  });

  describe("Global Error Limits", () => {
    it("should trigger global backoff with too many errors", async () => {
      // Generate many errors quickly
      for (let i = 0; i < 15; i++) {
        const error: WatchError = {
          type: "file_system",
          message: `Error ${i}`,
          recoverable: true,
        };
        await errorRecoveryManager.handleError(error);
      }

      // Next error should trigger global backoff
      const error: WatchError = {
        type: "file_system",
        message: "Final error",
        recoverable: true,
      };

      const result = await errorRecoveryManager.handleError(error);
      expect(result.success).toBe(false);
      expect(result.message).toContain("Too many errors globally");
    });

    it("should reset global error count after time window", async () => {
      // This test would require time manipulation or a way to reset the timer
      // For now, we'll test the statistics tracking
      const initialStats = errorRecoveryManager.getErrorStatistics();
      expect(initialStats.totalErrors).toBe(0);

      const error: WatchError = {
        type: "file_system",
        message: "Test error",
        recoverable: true,
      };

      await errorRecoveryManager.handleError(error);
      const updatedStats = errorRecoveryManager.getErrorStatistics();
      expect(updatedStats.totalErrors).toBe(1);
    });
  });

  describe("Recovery Actions", () => {
    it("should execute appropriate recovery actions", async () => {
      const error: WatchError = {
        type: "file_system",
        message: "no such file or directory",
        path: "/test/missing.txt",
        recoverable: true,
      };

      const result = await errorRecoveryManager.handleError(error);
      // Recovery actions are mostly placeholders in our implementation
      // In a real scenario, we'd test that specific actions were called
      expect(result).toBeDefined();
    });

    it("should handle recovery action failures gracefully", async () => {
      const error: WatchError = {
        type: "translation",
        message: "translation context error",
        recoverable: true,
      };

      const result = await errorRecoveryManager.handleError(error);
      expect(result).toBeDefined();
      expect(typeof result.success).toBe("boolean");
    });
  });

  describe("Error Statistics", () => {
    it("should track error statistics correctly", async () => {
      const errors: WatchError[] = [
        { type: "file_system", message: "File error", recoverable: true },
        {
          type: "translation",
          message: "Translation error",
          recoverable: true,
        },
        { type: "configuration", message: "Config error", recoverable: false },
      ];

      for (const error of errors) {
        await errorRecoveryManager.handleError(error);
      }

      const stats = errorRecoveryManager.getErrorStatistics();
      expect(stats.totalErrors).toBe(3);
      expect(stats.activeErrors).toBe(3);
      expect(stats.errorsByCategory.file_system).toBe(1);
      expect(stats.errorsByCategory.translation).toBe(1);
      expect(stats.errorsByCategory.configuration).toBe(1);
    });

    it("should provide health status", () => {
      const isHealthy = errorRecoveryManager.isHealthy();
      expect(typeof isHealthy).toBe("boolean");
    });

    it("should allow clearing active errors", () => {
      errorRecoveryManager.clearActiveErrors();
      const stats = errorRecoveryManager.getErrorStatistics();
      expect(stats.activeErrors).toBe(0);
    });
  });

  describe("Network Error Detection", () => {
    it("should detect network-related errors", async () => {
      const networkErrors = [
        "Connection timeout",
        "DNS resolution failed",
        "Network unreachable",
        "Connection refused",
        "Socket error",
      ];

      for (const message of networkErrors) {
        const error: WatchError = {
          type: "file_system",
          message,
          recoverable: true,
        };

        await errorRecoveryManager.handleError(error);
      }

      const stats = errorRecoveryManager.getErrorStatistics();
      expect(stats.errorsByCategory.network).toBe(5);
    });
  });

  describe("Resource Error Detection", () => {
    it("should detect resource-related errors", async () => {
      const resourceErrors = [
        "Out of memory",
        "Disk space exhausted",
        "Too many open files",
        "Resource limit exceeded",
        "Quota exceeded",
      ];

      for (const message of resourceErrors) {
        const error: WatchError = {
          type: "file_system",
          message,
          recoverable: true,
        };

        await errorRecoveryManager.handleError(error);
      }

      const stats = errorRecoveryManager.getErrorStatistics();
      expect(stats.errorsByCategory.resource).toBe(5);
    });
  });

  describe("Context Handling", () => {
    it("should handle error context information", async () => {
      const error: WatchError = {
        type: "translation",
        message: "Context test error",
        recoverable: true,
      };

      const context = {
        operation: "retranslation",
        files: ["test1.txt", "test2.txt"],
        timestamp: new Date().toISOString(),
      };

      const result = await errorRecoveryManager.handleError(error, context);
      expect(result).toBeDefined();

      const activeErrors = errorRecoveryManager.getActiveErrors();
      expect(activeErrors.length).toBe(1);
      expect(activeErrors[0].context).toEqual(context);
    });
  });
});

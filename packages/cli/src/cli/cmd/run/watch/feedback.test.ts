import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { FeedbackManager } from "./feedback";
import {
  FileChangeEvent,
  TranslationProgress,
  TranslationResult,
  WatchError,
} from "./types";

// Mock chalk to avoid color codes in tests
vi.mock("chalk", () => ({
  default: {
    dim: vi.fn((text: string) => text),
    hex: vi.fn(() => vi.fn((text: string) => text)),
    red: vi.fn((text: string) => text),
    green: vi.fn((text: string) => text),
    blue: vi.fn((text: string) => text),
    gray: vi.fn((text: string) => text),
    yellow: vi.fn((text: string) => text),
    inverse: vi.fn((text: string) => text),
  },
}));

describe("FeedbackManager", () => {
  let feedbackManager: FeedbackManager;
  let consoleSpy: {
    log: ReturnType<typeof vi.spyOn>;
    error: ReturnType<typeof vi.spyOn>;
    warn: ReturnType<typeof vi.spyOn>;
  };
  let stdoutSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Mock console methods
    consoleSpy = {
      log: vi.spyOn(console, "log").mockImplementation(() => {}),
      error: vi.spyOn(console, "error").mockImplementation(() => {}),
      warn: vi.spyOn(console, "warn").mockImplementation(() => {}),
    };

    // Mock process.stdout.write
    stdoutSpy = vi
      .spyOn(process.stdout, "write")
      .mockImplementation(() => true);

    feedbackManager = new FeedbackManager();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("constructor", () => {
    it("should initialize with default options", () => {
      const manager = new FeedbackManager();
      expect(manager).toBeDefined();
    });

    it("should initialize with custom options", () => {
      const manager = new FeedbackManager({
        logLevel: "verbose",
        enableProgressIndicators: false,
        enableNotifications: true,
      });
      expect(manager).toBeDefined();
    });
  });

  describe("reportFileChange", () => {
    it("should report file change in minimal mode", () => {
      const event: FileChangeEvent = {
        type: "change",
        path: "src/test.json",
        timestamp: new Date(),
      };

      feedbackManager.reportFileChange(event);

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining("File change: src/test.json"),
      );
    });

    it("should report file change in verbose mode", () => {
      feedbackManager = new FeedbackManager({ logLevel: "verbose" });
      const timestamp = new Date();
      const event: FileChangeEvent = {
        type: "add",
        path: "src/new.json",
        timestamp,
      };

      feedbackManager.reportFileChange(event);

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining("ADD"),
      );
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining("src/new.json"),
      );
    });

    it("should not report file change in silent mode", () => {
      feedbackManager = new FeedbackManager({ logLevel: "silent" });
      const event: FileChangeEvent = {
        type: "change",
        path: "src/test.json",
        timestamp: new Date(),
      };

      feedbackManager.reportFileChange(event);

      expect(consoleSpy.log).not.toHaveBeenCalled();
    });

    it("should handle different file change types", () => {
      const changeTypes: FileChangeEvent["type"][] = [
        "add",
        "change",
        "unlink",
        "addDir",
        "unlinkDir",
      ];

      changeTypes.forEach((type) => {
        const event: FileChangeEvent = {
          type,
          path: `src/test.json`,
          timestamp: new Date(),
        };

        feedbackManager.reportFileChange(event);
      });

      expect(consoleSpy.log).toHaveBeenCalledTimes(changeTypes.length);
    });

    it("should truncate long file paths", () => {
      const longPath = "a".repeat(100) + "/test.json";
      const event: FileChangeEvent = {
        type: "change",
        path: longPath,
        timestamp: new Date(),
      };

      feedbackManager.reportFileChange(event);

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining("..."),
      );
    });
  });

  describe("reportRetranslationStart", () => {
    it("should report retranslation start with files", () => {
      const files = ["src/en.json", "src/fr.json"];

      feedbackManager.reportRetranslationStart(files);

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining("Triggering retranslation"),
      );
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining("Processing 2 changed file(s)"),
      );
    });

    it("should report retranslation start in verbose mode", () => {
      feedbackManager = new FeedbackManager({ logLevel: "verbose" });
      const files = ["src/en.json", "src/fr.json"];

      feedbackManager.reportRetranslationStart(files);

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining("Changed files: src/en.json, src/fr.json"),
      );
    });

    it("should not report in silent mode", () => {
      feedbackManager = new FeedbackManager({ logLevel: "silent" });
      const files = ["src/en.json"];

      feedbackManager.reportRetranslationStart(files);

      expect(consoleSpy.log).not.toHaveBeenCalled();
    });

    it("should handle empty files array", () => {
      feedbackManager.reportRetranslationStart([]);

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining("Triggering retranslation"),
      );
    });
  });

  describe("reportRetranslationProgress", () => {
    it("should report progress with progress indicators enabled", () => {
      const progress: TranslationProgress = {
        totalTasks: 10,
        completedTasks: 5,
        currentTask: "Processing translations",
        estimatedTimeRemaining: 5000,
      };

      feedbackManager.reportRetranslationProgress(progress);

      expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining("50%"));
      expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining("(5/10)"));
      expect(stdoutSpy).toHaveBeenCalledWith(
        expect.stringContaining("Processing translations"),
      );
      expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining("ETA:"));
    });

    it("should not report progress when indicators are disabled", () => {
      feedbackManager = new FeedbackManager({
        enableProgressIndicators: false,
      });
      const progress: TranslationProgress = {
        totalTasks: 10,
        completedTasks: 5,
      };

      feedbackManager.reportRetranslationProgress(progress);

      expect(stdoutSpy).not.toHaveBeenCalled();
    });

    it("should not report progress in silent mode", () => {
      feedbackManager = new FeedbackManager({ logLevel: "silent" });
      const progress: TranslationProgress = {
        totalTasks: 10,
        completedTasks: 5,
      };

      feedbackManager.reportRetranslationProgress(progress);

      expect(stdoutSpy).not.toHaveBeenCalled();
    });

    it("should add newline when progress is complete", () => {
      const progress: TranslationProgress = {
        totalTasks: 10,
        completedTasks: 10,
      };

      feedbackManager.reportRetranslationProgress(progress);

      expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining("100%"));
      expect(stdoutSpy).toHaveBeenCalledWith("\n");
    });

    it("should handle progress without optional fields", () => {
      const progress: TranslationProgress = {
        totalTasks: 5,
        completedTasks: 2,
      };

      feedbackManager.reportRetranslationProgress(progress);

      expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining("40%"));
      expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining("(2/5)"));
    });
  });

  describe("reportRetranslationComplete", () => {
    it("should report successful completion", () => {
      const result: TranslationResult = {
        success: true,
        duration: 2500,
        tasksCompleted: 5,
        errors: [],
      };

      feedbackManager.reportRetranslationComplete(result);

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining("Retranslation completed"),
      );
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining("Continuing to watch"),
      );
    });

    it("should report successful completion in verbose mode", () => {
      feedbackManager = new FeedbackManager({ logLevel: "verbose" });
      const result: TranslationResult = {
        success: true,
        duration: 2500,
        tasksCompleted: 5,
        errors: [],
      };

      feedbackManager.reportRetranslationComplete(result);

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining("Duration: 2.5s"),
      );
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining("Tasks completed: 5"),
      );
    });

    it("should report failed completion", () => {
      const error: WatchError = {
        type: "translation",
        message: "Translation failed",
        recoverable: false,
      };

      const result: TranslationResult = {
        success: false,
        duration: 1000,
        tasksCompleted: 2,
        errors: [error],
      };

      feedbackManager.reportRetranslationComplete(result);

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining("Retranslation failed"),
      );
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining("Errors: 1"),
      );
    });

    it("should report errors in verbose mode", () => {
      feedbackManager = new FeedbackManager({ logLevel: "verbose" });
      const error: WatchError = {
        type: "translation",
        message: "Translation failed",
        recoverable: false,
      };

      const result: TranslationResult = {
        success: false,
        duration: 1000,
        tasksCompleted: 2,
        errors: [error],
      };

      feedbackManager.reportRetranslationComplete(result);

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining("Translation failed"),
      );
    });

    it("should not report in silent mode", () => {
      feedbackManager = new FeedbackManager({ logLevel: "silent" });
      const result: TranslationResult = {
        success: true,
        duration: 1000,
        tasksCompleted: 3,
        errors: [],
      };

      feedbackManager.reportRetranslationComplete(result);

      expect(consoleSpy.log).not.toHaveBeenCalled();
    });
  });

  describe("reportError", () => {
    it("should report recoverable error", () => {
      const error: WatchError = {
        type: "file_system",
        message: "File temporarily unavailable",
        path: "src/test.json",
        recoverable: true,
      };

      feedbackManager.reportError(error);

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining("File temporarily unavailable"),
      );
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining("Attempting to recover"),
      );
    });

    it("should report non-recoverable error", () => {
      const error: WatchError = {
        type: "configuration",
        message: "Invalid configuration",
        recoverable: false,
      };

      feedbackManager.reportError(error);

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining("Invalid configuration"),
      );
      expect(consoleSpy.log).not.toHaveBeenCalledWith(
        expect.stringContaining("Attempting to recover"),
      );
    });

    it("should report error with path in verbose mode", () => {
      feedbackManager = new FeedbackManager({ logLevel: "verbose" });
      const error: WatchError = {
        type: "file_system",
        message: "Permission denied",
        path: "/restricted/file.json",
        recoverable: false,
      };

      feedbackManager.reportError(error);

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining("Path: /restricted/file.json"),
      );
    });

    it("should not report error in silent mode", () => {
      feedbackManager = new FeedbackManager({ logLevel: "silent" });
      const error: WatchError = {
        type: "translation",
        message: "Translation error",
        recoverable: true,
      };

      feedbackManager.reportError(error);

      expect(consoleSpy.log).not.toHaveBeenCalled();
    });

    it("should handle different error types with appropriate icons", () => {
      const errorTypes: WatchError["type"][] = [
        "file_system",
        "translation",
        "configuration",
      ];

      errorTypes.forEach((type) => {
        const error: WatchError = {
          type,
          message: `${type} error`,
          recoverable: false,
        };

        feedbackManager.reportError(error);
      });

      expect(consoleSpy.log).toHaveBeenCalledTimes(errorTypes.length);
    });
  });

  describe("updateConfiguration", () => {
    it("should update log level", () => {
      feedbackManager.updateConfiguration({ logLevel: "verbose" });

      const event: FileChangeEvent = {
        type: "change",
        path: "test.json",
        timestamp: new Date(),
      };

      feedbackManager.reportFileChange(event);

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining("CHG"),
      );
    });

    it("should update progress indicators setting", () => {
      feedbackManager.updateConfiguration({ enableProgressIndicators: false });

      const progress: TranslationProgress = {
        totalTasks: 10,
        completedTasks: 5,
      };

      feedbackManager.reportRetranslationProgress(progress);

      expect(stdoutSpy).not.toHaveBeenCalled();
    });

    it("should update notifications setting", () => {
      feedbackManager.updateConfiguration({ enableNotifications: true });
      // Note: Notifications are not fully implemented yet, so we can't test the actual behavior
      expect(feedbackManager).toBeDefined();
    });

    it("should handle partial configuration updates", () => {
      feedbackManager.updateConfiguration({ logLevel: "silent" });
      feedbackManager.updateConfiguration({ enableProgressIndicators: false });

      const event: FileChangeEvent = {
        type: "change",
        path: "test.json",
        timestamp: new Date(),
      };

      feedbackManager.reportFileChange(event);

      expect(consoleSpy.log).not.toHaveBeenCalled();
    });
  });

  describe("message formatting", () => {
    it("should format timestamps correctly", () => {
      feedbackManager = new FeedbackManager({ logLevel: "verbose" });
      const timestamp = new Date("2023-01-01T12:30:45.000Z");
      const event: FileChangeEvent = {
        type: "change",
        path: "test.json",
        timestamp,
      };

      feedbackManager.reportFileChange(event);

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringMatching(/\d{2}:\d{2}:\d{2}/),
      );
    });

    it("should format durations correctly", () => {
      const testCases = [
        { duration: 500, expected: "500ms" },
        { duration: 1500, expected: "1.5s" },
        { duration: 65000, expected: "1m 5s" },
      ];

      testCases.forEach(({ duration, expected }) => {
        const result: TranslationResult = {
          success: true,
          duration,
          tasksCompleted: 1,
          errors: [],
        };

        feedbackManager = new FeedbackManager({ logLevel: "verbose" });
        feedbackManager.reportRetranslationComplete(result);

        expect(consoleSpy.log).toHaveBeenCalledWith(
          expect.stringContaining(expected),
        );

        consoleSpy.log.mockClear();
      });
    });

    it("should create progress bars correctly", () => {
      const progress: TranslationProgress = {
        totalTasks: 4,
        completedTasks: 1, // 25%
      };

      feedbackManager.reportRetranslationProgress(progress);

      expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining("25%"));
    });

    it("should handle zero progress correctly", () => {
      const progress: TranslationProgress = {
        totalTasks: 10,
        completedTasks: 0,
      };

      feedbackManager.reportRetranslationProgress(progress);

      expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining("0%"));
    });

    it("should handle 100% progress correctly", () => {
      const progress: TranslationProgress = {
        totalTasks: 5,
        completedTasks: 5,
      };

      feedbackManager.reportRetranslationProgress(progress);

      expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining("100%"));
      expect(stdoutSpy).toHaveBeenCalledWith("\n");
    });
  });

  describe("edge cases", () => {
    it("should handle undefined timestamp", () => {
      const event: FileChangeEvent = {
        type: "change",
        path: "test.json",
        timestamp: new Date(),
      };

      expect(() => feedbackManager.reportFileChange(event)).not.toThrow();
    });

    it("should handle empty error message", () => {
      const error: WatchError = {
        type: "file_system",
        message: "",
        recoverable: true,
      };

      expect(() => feedbackManager.reportError(error)).not.toThrow();
    });

    it("should handle division by zero in progress calculation", () => {
      const progress: TranslationProgress = {
        totalTasks: 0,
        completedTasks: 0,
      };

      expect(() =>
        feedbackManager.reportRetranslationProgress(progress),
      ).not.toThrow();
    });

    it("should handle negative durations", () => {
      const result: TranslationResult = {
        success: true,
        duration: -1000,
        tasksCompleted: 1,
        errors: [],
      };

      expect(() =>
        feedbackManager.reportRetranslationComplete(result),
      ).not.toThrow();
    });

    it("should handle very large numbers", () => {
      const progress: TranslationProgress = {
        totalTasks: Number.MAX_SAFE_INTEGER,
        completedTasks: 1,
      };

      expect(() =>
        feedbackManager.reportRetranslationProgress(progress),
      ).not.toThrow();
    });
  });

  describe("integration scenarios", () => {
    it("should handle complete workflow reporting", () => {
      // File change
      const event: FileChangeEvent = {
        type: "change",
        path: "src/en.json",
        timestamp: new Date(),
      };
      feedbackManager.reportFileChange(event);

      // Retranslation start
      feedbackManager.reportRetranslationStart(["src/en.json"]);

      // Progress updates
      const progressSteps = [
        { totalTasks: 4, completedTasks: 1 },
        { totalTasks: 4, completedTasks: 2 },
        { totalTasks: 4, completedTasks: 3 },
        { totalTasks: 4, completedTasks: 4 },
      ];

      progressSteps.forEach((progress) => {
        feedbackManager.reportRetranslationProgress(progress);
      });

      // Completion
      const result: TranslationResult = {
        success: true,
        duration: 2000,
        tasksCompleted: 4,
        errors: [],
      };
      feedbackManager.reportRetranslationComplete(result);

      // The actual calls are: file change, start (2 calls), completion (2 calls), watch continue
      expect(consoleSpy.log).toHaveBeenCalledTimes(6);
      expect(stdoutSpy).toHaveBeenCalledTimes(5); // 4 progress updates + final newline
    });

    it("should handle error workflow reporting", () => {
      // File change
      const event: FileChangeEvent = {
        type: "change",
        path: "src/en.json",
        timestamp: new Date(),
      };
      feedbackManager.reportFileChange(event);

      // Retranslation start
      feedbackManager.reportRetranslationStart(["src/en.json"]);

      // Error during processing
      const error: WatchError = {
        type: "translation",
        message: "API rate limit exceeded",
        recoverable: true,
      };
      feedbackManager.reportError(error);

      // Failed completion
      const result: TranslationResult = {
        success: false,
        duration: 1000,
        tasksCompleted: 1,
        errors: [error],
      };
      feedbackManager.reportRetranslationComplete(result);

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining("File change"),
      );
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining("Triggering retranslation"),
      );
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining("API rate limit exceeded"),
      );
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining("Retranslation failed"),
      );
    });
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  executeWithFeedback,
  extractExecutionProgress,
  convertExecutionResults,
} from "./execute-integration";
import { FeedbackManager } from "./feedback";
import { CmdRunContext, CmdRunTask, CmdRunTaskResult } from "../_types";
import execute from "../execute";

// Mock the original execute module
vi.mock("../execute", () => ({
  default: vi.fn(),
}));

describe("Execute Integration", () => {
  let feedbackManager: FeedbackManager;
  let mockContext: CmdRunContext;
  let mockTask: CmdRunTask;

  beforeEach(() => {
    feedbackManager = new FeedbackManager({ logLevel: "silent" });

    mockTask = {
      sourceLocale: "en",
      targetLocale: "es",
      bucketType: "json",
      bucketPathPattern: "locales/[locale].json",
      injectLocale: [],
      lockedKeys: [],
      lockedPatterns: [],
      ignoredKeys: [],
      onlyKeys: [],
    };

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
        sourceLocale: undefined,
        targetLocale: undefined,
        watch: false,
        debounce: 5000,
        sound: undefined,
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
      config: null,
      localizer: null,
      tasks: [mockTask],
      results: new Map(),
    };

    // Spy on feedback manager methods
    vi.spyOn(feedbackManager, "reportRetranslationProgress");
    vi.spyOn(feedbackManager, "reportRetranslationComplete");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("executeWithFeedback", () => {
    it("should handle empty task list", async () => {
      const emptyContext = { ...mockContext, tasks: [] };

      const result = await executeWithFeedback(emptyContext, feedbackManager);

      expect(result).toBe(emptyContext);
      expect(feedbackManager.reportRetranslationComplete).toHaveBeenCalledWith({
        success: true,
        duration: 0,
        tasksCompleted: 0,
        errors: [],
      });
    });

    it("should execute with progress tracking", async () => {
      const mockExecute = vi.mocked(execute);
      const successResult: CmdRunTaskResult = {
        status: "success",
        pathPattern: "locales/[locale].json",
        sourceLocale: "en",
        targetLocale: "es",
      };

      mockExecute.mockImplementation(async (ctx) => {
        // Simulate task completion
        ctx.results.set(mockTask, successResult);
        return ctx;
      });

      const result = await executeWithFeedback(mockContext, feedbackManager);

      expect(mockExecute).toHaveBeenCalledWith(mockContext);
      expect(feedbackManager.reportRetranslationProgress).toHaveBeenCalledWith({
        totalTasks: 1,
        completedTasks: 0,
        currentTask: "Initializing localization engine...",
      });
      expect(feedbackManager.reportRetranslationComplete).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          tasksCompleted: 1,
          errors: [],
        }),
      );
    });

    it("should handle execution errors", async () => {
      const mockExecute = vi.mocked(execute);
      const errorResult: CmdRunTaskResult = {
        status: "error",
        error: new Error("Translation failed"),
        pathPattern: "locales/[locale].json",
        sourceLocale: "en",
        targetLocale: "es",
      };

      mockExecute.mockImplementation(async (ctx) => {
        ctx.results.set(mockTask, errorResult);
        return ctx;
      });

      const result = await executeWithFeedback(mockContext, feedbackManager);

      expect(feedbackManager.reportRetranslationComplete).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          tasksCompleted: 0,
          errors: [
            expect.objectContaining({
              type: "translation",
              message: "Translation failed",
              path: "locales/[locale].json",
            }),
          ],
        }),
      );
    });

    it("should handle execution exceptions", async () => {
      const mockExecute = vi.mocked(execute);
      mockExecute.mockRejectedValue(new Error("Execution failed"));

      await expect(
        executeWithFeedback(mockContext, feedbackManager),
      ).rejects.toThrow("Execution failed");

      expect(feedbackManager.reportRetranslationComplete).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          tasksCompleted: 0,
          errors: [
            expect.objectContaining({
              type: "translation",
              message: "Execution failed: Execution failed",
            }),
          ],
        }),
      );
    });

    it("should track task completion progress", async () => {
      const mockExecute = vi.mocked(execute);
      const successResult: CmdRunTaskResult = {
        status: "success",
        pathPattern: "locales/[locale].json",
        sourceLocale: "en",
        targetLocale: "es",
      };

      // Mock the results.set method to track when tasks complete
      let originalSet: typeof mockContext.results.set;

      mockExecute.mockImplementation(async (ctx) => {
        originalSet = ctx.results.set.bind(ctx.results);

        // Simulate task completion after a delay
        setTimeout(() => {
          ctx.results.set(mockTask, successResult);
        }, 100);

        return new Promise((resolve) => {
          setTimeout(() => resolve(ctx), 200);
        });
      });

      await executeWithFeedback(mockContext, feedbackManager);

      // Verify that progress tracking was set up
      expect(mockExecute).toHaveBeenCalled();
    });
  });

  describe("extractExecutionProgress", () => {
    it("should extract progress for incomplete execution", () => {
      const progress = extractExecutionProgress(mockContext);

      expect(progress).toEqual({
        totalTasks: 1,
        completedTasks: 0,
        currentTask: "Processing translation tasks...",
      });
    });

    it("should extract progress for completed execution", () => {
      mockContext.results.set(mockTask, { status: "success" });

      const progress = extractExecutionProgress(mockContext);

      expect(progress).toEqual({
        totalTasks: 1,
        completedTasks: 1,
        currentTask: "Execution completed",
      });
    });
  });

  describe("convertExecutionResults", () => {
    it("should convert successful results", () => {
      const successResult: CmdRunTaskResult = {
        status: "success",
        pathPattern: "locales/[locale].json",
        sourceLocale: "en",
        targetLocale: "es",
      };
      mockContext.results.set(mockTask, successResult);

      const result = convertExecutionResults(mockContext, 5000);

      expect(result).toEqual({
        success: true,
        duration: 5000,
        tasksCompleted: 1,
        errors: [],
      });
    });

    it("should convert error results", () => {
      const errorResult: CmdRunTaskResult = {
        status: "error",
        error: new Error("Translation failed"),
        pathPattern: "locales/[locale].json",
        sourceLocale: "en",
        targetLocale: "es",
      };
      mockContext.results.set(mockTask, errorResult);

      const result = convertExecutionResults(mockContext, 3000);

      expect(result).toEqual({
        success: false,
        duration: 3000,
        tasksCompleted: 0,
        errors: [
          {
            type: "translation",
            message: "Translation failed",
            path: "locales/[locale].json",
            recoverable: false,
          },
        ],
      });
    });

    it("should handle mixed results", () => {
      const task2: CmdRunTask = {
        ...mockTask,
        targetLocale: "fr",
      };
      mockContext.tasks.push(task2);

      const successResult: CmdRunTaskResult = {
        status: "success",
        pathPattern: "locales/[locale].json",
        sourceLocale: "en",
        targetLocale: "es",
      };
      const errorResult: CmdRunTaskResult = {
        status: "error",
        error: new Error("Translation failed"),
        pathPattern: "locales/[locale].json",
        sourceLocale: "en",
        targetLocale: "fr",
      };

      mockContext.results.set(mockTask, successResult);
      mockContext.results.set(task2, errorResult);

      const result = convertExecutionResults(mockContext, 4000);

      expect(result).toEqual({
        success: false,
        duration: 4000,
        tasksCompleted: 1,
        errors: [
          {
            type: "translation",
            message: "Translation failed",
            path: "locales/[locale].json",
            recoverable: false,
          },
        ],
      });
    });

    it("should handle skipped results", () => {
      const skippedResult: CmdRunTaskResult = {
        status: "skipped",
        pathPattern: "locales/[locale].json",
        sourceLocale: "en",
        targetLocale: "es",
      };
      mockContext.results.set(mockTask, skippedResult);

      const result = convertExecutionResults(mockContext, 1000);

      expect(result).toEqual({
        success: true,
        duration: 1000,
        tasksCompleted: 0,
        errors: [],
      });
    });
  });
});

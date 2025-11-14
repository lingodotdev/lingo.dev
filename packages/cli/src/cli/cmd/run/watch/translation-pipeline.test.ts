import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  TranslationPipeline,
  createTranslationPipeline,
  extractTimingInfo,
} from "./translation-pipeline";
import { FeedbackManager } from "./feedback";
import { CmdRunContext, CmdRunTask, CmdRunTaskResult } from "../_types";
import { TranslationResult } from "./types";

// Mock the plan and execute integration modules
vi.mock("./plan-integration", () => ({
  planWithFeedback: vi.fn(),
}));

vi.mock("./execute-integration", () => ({
  executeWithFeedback: vi.fn(),
  convertExecutionResults: vi.fn(),
}));

// Import the mocked functions
import { planWithFeedback } from "./plan-integration";
import {
  executeWithFeedback,
  convertExecutionResults,
} from "./execute-integration";

describe("TranslationPipeline", () => {
  let feedbackManager: FeedbackManager;
  let pipeline: TranslationPipeline;
  let mockContext: CmdRunContext;

  beforeEach(() => {
    feedbackManager = new FeedbackManager({ logLevel: "silent" });
    pipeline = new TranslationPipeline(feedbackManager);

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
      tasks: [],
      results: new Map(),
    };

    // Spy on feedback manager methods
    vi.spyOn(feedbackManager, "reportRetranslationStart");
    vi.spyOn(feedbackManager, "reportRetranslationProgress");
    vi.spyOn(feedbackManager, "reportRetranslationComplete");
    vi.spyOn(feedbackManager, "reportError");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("execute", () => {
    it("should handle empty task list", async () => {
      const mockPlanWithFeedback = vi.mocked(planWithFeedback);
      mockPlanWithFeedback.mockResolvedValue(mockContext);

      const result = await pipeline.execute(mockContext, ["file1.json"]);

      expect(result.success).toBe(true);
      expect(result.tasksCompleted).toBe(0);
      expect(result.errors).toHaveLength(0);
      expect(feedbackManager.reportRetranslationStart).toHaveBeenCalledWith([
        "file1.json",
      ]);
      expect(feedbackManager.reportRetranslationComplete).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          tasksCompleted: 0,
        }),
      );
    });

    it("should report progress through planning and execution phases", async () => {
      // Add some mock tasks
      const mockTask: CmdRunTask = {
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
      const contextWithTasks = { ...mockContext, tasks: [mockTask] };

      const mockPlanWithFeedback = vi.mocked(planWithFeedback);
      const mockExecuteWithFeedback = vi.mocked(executeWithFeedback);
      const mockConvertResults = vi.mocked(convertExecutionResults);

      mockPlanWithFeedback.mockResolvedValue(contextWithTasks);
      mockExecuteWithFeedback.mockResolvedValue(contextWithTasks);
      mockConvertResults.mockReturnValue({
        success: true,
        duration: 1000,
        tasksCompleted: 1,
        errors: [],
      });

      const result = await pipeline.execute(mockContext, ["locales/en.json"]);

      expect(result.success).toBe(true);
      expect(result.tasksCompleted).toBe(1);
      expect(feedbackManager.reportRetranslationStart).toHaveBeenCalledWith([
        "locales/en.json",
      ]);
      expect(feedbackManager.reportRetranslationProgress).toHaveBeenCalledWith(
        expect.objectContaining({
          totalTasks: 2, // Planning + Execution phases
          completedTasks: 0,
          currentTask: "Planning translation tasks...",
        }),
      );
    });

    it("should handle execution errors", async () => {
      const mockTask: CmdRunTask = {
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
      const contextWithTasks = { ...mockContext, tasks: [mockTask] };

      const mockPlanWithFeedback = vi.mocked(planWithFeedback);
      const mockExecuteWithFeedback = vi.mocked(executeWithFeedback);

      mockPlanWithFeedback.mockResolvedValue(contextWithTasks);
      mockExecuteWithFeedback.mockRejectedValue(
        new Error("Translation failed"),
      );

      const result = await pipeline.execute(mockContext, ["locales/en.json"]);

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain("Translation failed");
      expect(result.errors[0].type).toBe("translation");
    });
  });

  describe("executeWithRetry", () => {
    it("should succeed on first attempt", async () => {
      const mockPlanWithFeedback = vi.mocked(planWithFeedback);
      mockPlanWithFeedback.mockResolvedValue(mockContext);

      const result = await pipeline.executeWithRetry(mockContext, [], 2);

      expect(result.success).toBe(true);
      expect(feedbackManager.reportError).not.toHaveBeenCalled();
    });

    it("should retry on failure and eventually succeed", async () => {
      let attemptCount = 0;
      const originalExecute = pipeline.execute.bind(pipeline);

      vi.spyOn(pipeline, "execute").mockImplementation(async (ctx, files) => {
        attemptCount++;
        if (attemptCount < 2) {
          throw new Error("Temporary failure");
        }
        return originalExecute(ctx, files);
      });

      const mockPlanWithFeedback = vi.mocked(planWithFeedback);
      mockPlanWithFeedback.mockResolvedValue(mockContext);

      const result = await pipeline.executeWithRetry(mockContext, [], 2);

      expect(result.success).toBe(true);
      expect(attemptCount).toBe(2);
      expect(feedbackManager.reportError).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "translation",
          message: expect.stringContaining("Retrying translation"),
          recoverable: true,
        }),
      );
    });

    it("should fail after max retries", async () => {
      vi.spyOn(pipeline, "execute").mockRejectedValue(
        new Error("Persistent failure"),
      );

      const result = await pipeline.executeWithRetry(mockContext, [], 1);

      expect(result.success).toBe(false);
      expect(result.errors[0].message).toContain(
        "Translation failed after 2 attempts",
      );
      expect(feedbackManager.reportError).toHaveBeenCalledTimes(2); // One retry attempt + final failure
    });
  });

  describe("getPipelineStatus", () => {
    it("should return idle status for empty context", () => {
      const status = pipeline.getPipelineStatus(mockContext);

      expect(status.phase).toBe("idle");
      expect(status.progress).toBe(0);
      expect(status.totalTasks).toBe(0);
      expect(status.completedTasks).toBe(0);
    });

    it("should return executing status when tasks exist but no results", () => {
      const mockTask: CmdRunTask = {
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
      mockContext.tasks = [mockTask];

      const status = pipeline.getPipelineStatus(mockContext);

      expect(status.phase).toBe("executing");
      expect(status.progress).toBe(0);
      expect(status.totalTasks).toBe(1);
      expect(status.completedTasks).toBe(0);
    });

    it("should return executing status with partial completion", () => {
      const mockTask1: CmdRunTask = {
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
      const mockTask2: CmdRunTask = {
        sourceLocale: "en",
        targetLocale: "fr",
        bucketType: "json",
        bucketPathPattern: "locales/[locale].json",
        injectLocale: [],
        lockedKeys: [],
        lockedPatterns: [],
        ignoredKeys: [],
        onlyKeys: [],
      };
      mockContext.tasks = [mockTask1, mockTask2];
      mockContext.results.set(mockTask1, { status: "success" });

      const status = pipeline.getPipelineStatus(mockContext);

      expect(status.phase).toBe("executing");
      expect(status.progress).toBe(50);
      expect(status.totalTasks).toBe(2);
      expect(status.completedTasks).toBe(1);
    });

    it("should return completed status when all tasks are done", () => {
      const mockTask: CmdRunTask = {
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
      mockContext.tasks = [mockTask];
      mockContext.results.set(mockTask, { status: "success" });

      const status = pipeline.getPipelineStatus(mockContext);

      expect(status.phase).toBe("completed");
      expect(status.progress).toBe(100);
      expect(status.totalTasks).toBe(1);
      expect(status.completedTasks).toBe(1);
    });
  });

  describe("createTranslationPipeline", () => {
    it("should create a pipeline instance", () => {
      const pipeline = createTranslationPipeline(feedbackManager);
      expect(pipeline).toBeInstanceOf(TranslationPipeline);
    });
  });

  describe("extractTimingInfo", () => {
    it("should extract timing information correctly", () => {
      const result: TranslationResult = {
        success: true,
        duration: 5000, // 5 seconds
        tasksCompleted: 10,
        errors: [],
      };

      const timing = extractTimingInfo(result);

      expect(timing.formattedDuration).toBe("5.0s");
      expect(timing.averageTimePerTask).toBe(500); // 500ms per task
      expect(timing.tasksPerSecond).toBe(2); // 2 tasks per second
    });

    it("should handle zero duration", () => {
      const result: TranslationResult = {
        success: true,
        duration: 0,
        tasksCompleted: 0,
        errors: [],
      };

      const timing = extractTimingInfo(result);

      expect(timing.formattedDuration).toBe("0ms");
      expect(timing.averageTimePerTask).toBe(0);
      expect(timing.tasksPerSecond).toBe(0);
    });

    it("should handle millisecond durations", () => {
      const result: TranslationResult = {
        success: true,
        duration: 500,
        tasksCompleted: 1,
        errors: [],
      };

      const timing = extractTimingInfo(result);

      expect(timing.formattedDuration).toBe("500ms");
      expect(timing.averageTimePerTask).toBe(500);
      expect(timing.tasksPerSecond).toBe(2);
    });

    it("should handle minute durations", () => {
      const result: TranslationResult = {
        success: true,
        duration: 125000, // 2m 5s
        tasksCompleted: 50,
        errors: [],
      };

      const timing = extractTimingInfo(result);

      expect(timing.formattedDuration).toBe("2m 5s");
      expect(timing.averageTimePerTask).toBe(2500);
      expect(timing.tasksPerSecond).toBe(0.4);
    });
  });
});

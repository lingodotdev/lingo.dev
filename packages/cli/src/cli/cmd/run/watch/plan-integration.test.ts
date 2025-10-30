import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { planWithFeedback, extractPlanningProgress } from "./plan-integration";
import { FeedbackManager } from "./feedback";
import { CmdRunContext } from "../_types";
import plan from "../plan";

// Mock the original plan module
vi.mock("../plan", () => ({
  default: vi.fn(),
}));

describe("Plan Integration", () => {
  let feedbackManager: FeedbackManager;
  let mockContext: CmdRunContext;
  let originalConsoleLog: typeof console.log;

  beforeEach(() => {
    feedbackManager = new FeedbackManager({ logLevel: "silent" });

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

    // Store original console.log
    originalConsoleLog = console.log;

    // Spy on feedback manager methods
    vi.spyOn(feedbackManager, "reportRetranslationProgress");
    vi.spyOn(feedbackManager, "reportError");
  });

  afterEach(() => {
    vi.clearAllMocks();
    console.log = originalConsoleLog;
  });

  describe("planWithFeedback", () => {
    it("should execute planning with progress tracking", async () => {
      const mockPlan = vi.mocked(plan);
      const expectedContext = { ...mockContext, tasks: [{ id: "test-task" }] };
      mockPlan.mockResolvedValue(expectedContext as any);

      const result = await planWithFeedback(mockContext, feedbackManager);

      expect(result).toBe(expectedContext);
      expect(mockPlan).toHaveBeenCalledWith(mockContext);
      expect(feedbackManager.reportRetranslationProgress).toHaveBeenCalledWith({
        totalTasks: 4,
        completedTasks: 0,
        currentTask: "Starting translation planning...",
      });
    });

    it("should track progress based on console output", async () => {
      const mockPlan = vi.mocked(plan);
      mockPlan.mockImplementation(async (ctx) => {
        // Simulate console output from planning
        console.log("[Planning]");
        console.log("Found 2 bucket(s)");
        console.log("Found 3 target locale(s)");
        console.log("Found 5 path pattern(s)");
        console.log("Prepared 10 translation task(s)");
        return { ...ctx, tasks: [{ id: "test-task" }] } as any;
      });

      await planWithFeedback(mockContext, feedbackManager);

      // Verify progress was reported for each step
      expect(feedbackManager.reportRetranslationProgress).toHaveBeenCalledWith({
        totalTasks: 4,
        completedTasks: 0,
        currentTask: "Initializing translation planning...",
      });
      expect(feedbackManager.reportRetranslationProgress).toHaveBeenCalledWith({
        totalTasks: 4,
        completedTasks: 1,
        currentTask: "Locating content buckets...",
      });
      expect(feedbackManager.reportRetranslationProgress).toHaveBeenCalledWith({
        totalTasks: 4,
        completedTasks: 2,
        currentTask: "Detecting locales...",
      });
      expect(feedbackManager.reportRetranslationProgress).toHaveBeenCalledWith({
        totalTasks: 4,
        completedTasks: 3,
        currentTask: "Locating localizable files...",
      });
      expect(feedbackManager.reportRetranslationProgress).toHaveBeenCalledWith({
        totalTasks: 4,
        completedTasks: 4,
        currentTask: "Computing translation tasks...",
      });
    });

    it("should handle planning errors", async () => {
      const mockPlan = vi.mocked(plan);
      const planError = new Error("Planning failed");
      mockPlan.mockRejectedValue(planError);

      await expect(
        planWithFeedback(mockContext, feedbackManager),
      ).rejects.toThrow("Planning failed");

      expect(feedbackManager.reportError).toHaveBeenCalledWith({
        type: "translation",
        message: "Planning failed: Planning failed",
        recoverable: false,
      });
    });

    it("should restore console.log after execution", async () => {
      const mockPlan = vi.mocked(plan);
      mockPlan.mockResolvedValue(mockContext);

      await planWithFeedback(mockContext, feedbackManager);

      expect(console.log).toBe(originalConsoleLog);
    });

    it("should restore console.log even after error", async () => {
      const mockPlan = vi.mocked(plan);
      mockPlan.mockRejectedValue(new Error("Planning failed"));

      try {
        await planWithFeedback(mockContext, feedbackManager);
      } catch {
        // Expected to throw
      }

      // Check that console.log was restored (it should be the original function or equivalent)
      expect(typeof console.log).toBe("function");
      expect(console.log.name).toBe("log");
    });
  });

  describe("extractPlanningProgress", () => {
    it("should return incomplete progress for empty context", () => {
      const progress = extractPlanningProgress(mockContext);

      expect(progress).toEqual({
        totalTasks: 4,
        completedTasks: 0,
        currentTask: "Planning in progress...",
      });
    });

    it("should return complete progress when tasks exist", () => {
      const contextWithTasks = {
        ...mockContext,
        tasks: [{ id: "test-task" }] as any,
      };

      const progress = extractPlanningProgress(contextWithTasks);

      expect(progress).toEqual({
        totalTasks: 4,
        completedTasks: 4,
        currentTask: "Planning completed",
      });
    });
  });
});

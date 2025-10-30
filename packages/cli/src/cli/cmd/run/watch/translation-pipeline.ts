import { CmdRunContext } from "../_types";
import { FeedbackManager, TranslationResult, WatchError } from "./types";
import { planWithFeedback } from "./plan-integration";
import {
  executeWithFeedback,
  convertExecutionResults,
} from "./execute-integration";

/**
 * Translation pipeline coordinator that integrates planning and execution
 * with comprehensive feedback reporting
 */
export class TranslationPipeline {
  private feedbackManager: FeedbackManager;

  constructor(feedbackManager: FeedbackManager) {
    this.feedbackManager = feedbackManager;
  }

  /**
   * Execute the complete translation pipeline with feedback integration
   */
  async execute(
    ctx: CmdRunContext,
    changedFiles: string[] = [],
  ): Promise<TranslationResult> {
    const startTime = Date.now();

    try {
      // Report pipeline start
      this.feedbackManager.reportRetranslationStart(changedFiles);

      // Phase 1: Planning
      this.feedbackManager.reportRetranslationProgress({
        totalTasks: 2, // Planning + Execution phases
        completedTasks: 0,
        currentTask: "Planning translation tasks...",
      });

      const plannedCtx = await planWithFeedback(ctx, this.feedbackManager);

      // Check if there are tasks to execute
      if (plannedCtx.tasks.length === 0) {
        const duration = Date.now() - startTime;
        const result: TranslationResult = {
          success: true,
          duration,
          tasksCompleted: 0,
          errors: [],
        };

        this.feedbackManager.reportRetranslationComplete(result);
        return result;
      }

      // Phase 2: Execution
      this.feedbackManager.reportRetranslationProgress({
        totalTasks: 2,
        completedTasks: 1,
        currentTask: "Executing translation tasks...",
      });

      const executedCtx = await executeWithFeedback(
        plannedCtx,
        this.feedbackManager,
      );

      // Calculate final results
      const duration = Date.now() - startTime;
      const result = convertExecutionResults(executedCtx, duration);

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorResult: TranslationResult = {
        success: false,
        duration,
        tasksCompleted: 0,
        errors: [
          {
            type: "translation",
            message: `Pipeline failed: ${error instanceof Error ? error.message : String(error)}`,
            recoverable: false,
          },
        ],
      };

      this.feedbackManager.reportRetranslationComplete(errorResult);
      return errorResult;
    }
  }

  /**
   * Execute translation pipeline with error recovery
   */
  async executeWithRetry(
    ctx: CmdRunContext,
    changedFiles: string[] = [],
    maxRetries: number = 2,
  ): Promise<TranslationResult> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        if (attempt > 1) {
          this.feedbackManager.reportError({
            type: "translation",
            message: `Retrying translation (attempt ${attempt}/${maxRetries + 1})...`,
            recoverable: true,
          });
        }

        return await this.execute(ctx, changedFiles);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt <= maxRetries) {
          this.feedbackManager.reportError({
            type: "translation",
            message: `Translation attempt ${attempt} failed: ${lastError.message}`,
            recoverable: true,
          });

          // Wait before retry (exponential backoff)
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    // All retries failed
    const errorResult: TranslationResult = {
      success: false,
      duration: 0,
      tasksCompleted: 0,
      errors: [
        {
          type: "translation",
          message: `Translation failed after ${maxRetries + 1} attempts: ${lastError?.message || "Unknown error"}`,
          recoverable: false,
        },
      ],
    };

    this.feedbackManager.reportRetranslationComplete(errorResult);
    return errorResult;
  }

  /**
   * Get pipeline status information
   */
  getPipelineStatus(ctx: CmdRunContext): {
    phase: "idle" | "planning" | "executing" | "completed" | "error";
    progress: number;
    totalTasks: number;
    completedTasks: number;
  } {
    const totalTasks = ctx.tasks.length;
    const completedTasks = ctx.results.size;

    let phase: "idle" | "planning" | "executing" | "completed" | "error" =
      "idle";
    let progress = 0;

    if (totalTasks === 0) {
      phase = "idle";
    } else if (completedTasks === 0) {
      phase = "executing";
      progress = 0;
    } else if (completedTasks < totalTasks) {
      phase = "executing";
      progress = (completedTasks / totalTasks) * 100;
    } else {
      phase = "completed";
      progress = 100;
    }

    return {
      phase,
      progress,
      totalTasks,
      completedTasks,
    };
  }
}

/**
 * Create a translation pipeline instance with feedback manager
 */
export function createTranslationPipeline(
  feedbackManager: FeedbackManager,
): TranslationPipeline {
  return new TranslationPipeline(feedbackManager);
}

/**
 * Utility function to extract timing information from translation results
 */
export function extractTimingInfo(result: TranslationResult): {
  formattedDuration: string;
  averageTimePerTask: number;
  tasksPerSecond: number;
} {
  const formattedDuration = formatDuration(result.duration);
  const averageTimePerTask =
    result.tasksCompleted > 0 ? result.duration / result.tasksCompleted : 0;
  const tasksPerSecond =
    result.duration > 0 ? (result.tasksCompleted / result.duration) * 1000 : 0;

  return {
    formattedDuration,
    averageTimePerTask,
    tasksPerSecond,
  };
}

/**
 * Format duration in milliseconds to human readable format
 */
function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  } else if (ms < 60000) {
    return `${(ms / 1000).toFixed(1)}s`;
  } else {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  }
}

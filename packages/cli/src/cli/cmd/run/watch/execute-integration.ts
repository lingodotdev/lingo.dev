import { CmdRunContext, CmdRunTask, CmdRunTaskResult } from "../_types";
import {
  FeedbackManager,
  TranslationProgress,
  TranslationResult,
  WatchError,
} from "./types";
import execute from "../execute";

/**
 * Enhanced execute function that integrates with FeedbackManager for progress tracking
 */
export async function executeWithFeedback(
  ctx: CmdRunContext,
  feedbackManager: FeedbackManager,
): Promise<CmdRunContext> {
  const startTime = Date.now();
  const totalTasks = ctx.tasks.length;

  if (totalTasks === 0) {
    feedbackManager.reportRetranslationComplete({
      success: true,
      duration: 0,
      tasksCompleted: 0,
      errors: [],
    });
    return ctx;
  }

  // Report execution start
  feedbackManager.reportRetranslationProgress({
    totalTasks,
    completedTasks: 0,
    currentTask: "Initializing localization engine...",
  });

  try {
    // Create a progress tracking wrapper
    const progressTracker = new ExecutionProgressTracker(ctx, feedbackManager);

    // Wrap the original execute function with progress tracking
    const enhancedCtx = await progressTracker.executeWithTracking();

    // Calculate final results
    const duration = Date.now() - startTime;
    const results = Array.from(enhancedCtx.results.values());
    const successCount = results.filter((r) => r.status === "success").length;
    const errorCount = results.filter((r) => r.status === "error").length;
    const errors = results
      .filter((r) => r.status === "error" && r.error)
      .map((r) => ({
        type: "translation" as const,
        message: r.error!.message,
        path: r.pathPattern,
        recoverable: false,
      }));

    // Report completion
    feedbackManager.reportRetranslationComplete({
      success: errorCount === 0,
      duration,
      tasksCompleted: successCount,
      errors,
    });

    return enhancedCtx;
  } catch (error) {
    const duration = Date.now() - startTime;

    feedbackManager.reportRetranslationComplete({
      success: false,
      duration,
      tasksCompleted: 0,
      errors: [
        {
          type: "translation",
          message: `Execution failed: ${error instanceof Error ? error.message : String(error)}`,
          recoverable: false,
        },
      ],
    });

    throw error;
  }
}

/**
 * Progress tracker for execution phase
 */
class ExecutionProgressTracker {
  private ctx: CmdRunContext;
  private feedbackManager: FeedbackManager;
  private completedTasks = 0;
  private progressUpdateInterval: NodeJS.Timeout | null = null;

  constructor(ctx: CmdRunContext, feedbackManager: FeedbackManager) {
    this.ctx = ctx;
    this.feedbackManager = feedbackManager;
  }

  async executeWithTracking(): Promise<CmdRunContext> {
    // Start progress monitoring
    this.startProgressMonitoring();

    try {
      // Patch the context to track task completion
      const originalResultsSet = this.ctx.results.set.bind(this.ctx.results);
      this.ctx.results.set = (task: CmdRunTask, result: CmdRunTaskResult) => {
        const returnValue = originalResultsSet(task, result);
        this.onTaskCompleted(task, result);
        return returnValue;
      };

      // Execute the original function
      const result = await execute(this.ctx);

      return result;
    } finally {
      this.stopProgressMonitoring();
    }
  }

  private startProgressMonitoring(): void {
    // Update progress every 2 seconds during execution
    this.progressUpdateInterval = setInterval(() => {
      this.updateProgress();
    }, 2000);
  }

  private stopProgressMonitoring(): void {
    if (this.progressUpdateInterval) {
      clearInterval(this.progressUpdateInterval);
      this.progressUpdateInterval = null;
    }
  }

  private onTaskCompleted(task: CmdRunTask, result: CmdRunTaskResult): void {
    this.completedTasks++;
    this.updateProgress(task, result);
  }

  private updateProgress(
    lastCompletedTask?: CmdRunTask,
    lastResult?: CmdRunTaskResult,
  ): void {
    const totalTasks = this.ctx.tasks.length;
    const progress: TranslationProgress = {
      totalTasks,
      completedTasks: this.completedTasks,
    };

    // Add current task information if available
    if (lastCompletedTask && lastResult) {
      const displayPath = lastCompletedTask.bucketPathPattern.replace(
        "[locale]",
        lastCompletedTask.targetLocale,
      );

      if (lastResult.status === "success") {
        progress.currentTask = `Completed: ${displayPath} (${lastCompletedTask.sourceLocale} → ${lastCompletedTask.targetLocale})`;
      } else if (lastResult.status === "error") {
        progress.currentTask = `Failed: ${displayPath} (${lastCompletedTask.sourceLocale} → ${lastCompletedTask.targetLocale})`;
      } else {
        progress.currentTask = `Skipped: ${displayPath} (${lastCompletedTask.sourceLocale} → ${lastCompletedTask.targetLocale})`;
      }
    } else if (this.completedTasks < totalTasks) {
      progress.currentTask = "Processing translation tasks...";
    }

    // Estimate remaining time based on completed tasks
    if (this.completedTasks > 0 && this.completedTasks < totalTasks) {
      const averageTimePerTask =
        (Date.now() - this.getStartTime()) / this.completedTasks;
      const remainingTasks = totalTasks - this.completedTasks;
      progress.estimatedTimeRemaining = Math.round(
        averageTimePerTask * remainingTasks,
      );
    }

    this.feedbackManager.reportRetranslationProgress(progress);
  }

  private getStartTime(): number {
    // Approximate start time based on when the first task might have started
    // This is a rough estimate since we don't have exact timing
    return Date.now() - this.completedTasks * 5000; // Assume 5s per task average
  }
}

/**
 * Extract execution progress information from context
 */
export function extractExecutionProgress(
  ctx: CmdRunContext,
): TranslationProgress {
  const totalTasks = ctx.tasks.length;
  const completedTasks = ctx.results.size;

  const progress: TranslationProgress = {
    totalTasks,
    completedTasks,
  };

  if (completedTasks < totalTasks) {
    progress.currentTask = "Processing translation tasks...";
  } else {
    progress.currentTask = "Execution completed";
  }

  return progress;
}

/**
 * Convert execution results to TranslationResult format
 */
export function convertExecutionResults(
  ctx: CmdRunContext,
  duration: number,
): TranslationResult {
  const results = Array.from(ctx.results.values());
  const successCount = results.filter((r) => r.status === "success").length;
  const errorCount = results.filter((r) => r.status === "error").length;

  const errors: WatchError[] = results
    .filter((r) => r.status === "error" && r.error)
    .map((r) => ({
      type: "translation" as const,
      message: r.error!.message,
      path: r.pathPattern,
      recoverable: false,
    }));

  return {
    success: errorCount === 0,
    duration,
    tasksCompleted: successCount,
    errors,
  };
}

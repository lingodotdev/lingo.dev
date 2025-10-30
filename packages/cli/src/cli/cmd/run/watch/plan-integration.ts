import { CmdRunContext } from "../_types";
import { FeedbackManager, TranslationProgress } from "./types";
import plan from "../plan";

/**
 * Enhanced plan function that integrates with FeedbackManager for progress tracking
 */
export async function planWithFeedback(
  ctx: CmdRunContext,
  feedbackManager: FeedbackManager,
): Promise<CmdRunContext> {
  // Report planning start
  feedbackManager.reportRetranslationProgress({
    totalTasks: 4, // Number of planning steps
    completedTasks: 0,
    currentTask: "Starting translation planning...",
  });

  try {
    // Wrap the original plan function with progress tracking
    const originalConsoleLog = console.log;
    let currentStep = 0;

    // Override console.log to track planning progress
    console.log = (...args: any[]) => {
      const message = args.join(" ");

      // Track planning steps based on console output
      if (message.includes("[Planning]")) {
        currentStep = 1;
        feedbackManager.reportRetranslationProgress({
          totalTasks: 4,
          completedTasks: 0,
          currentTask: "Initializing translation planning...",
        });
      } else if (message.includes("bucket(s)")) {
        currentStep = 2;
        feedbackManager.reportRetranslationProgress({
          totalTasks: 4,
          completedTasks: 1,
          currentTask: "Locating content buckets...",
        });
      } else if (message.includes("target locale(s)")) {
        currentStep = 3;
        feedbackManager.reportRetranslationProgress({
          totalTasks: 4,
          completedTasks: 2,
          currentTask: "Detecting locales...",
        });
      } else if (message.includes("path pattern(s)")) {
        currentStep = 4;
        feedbackManager.reportRetranslationProgress({
          totalTasks: 4,
          completedTasks: 3,
          currentTask: "Locating localizable files...",
        });
      } else if (message.includes("translation task(s)")) {
        feedbackManager.reportRetranslationProgress({
          totalTasks: 4,
          completedTasks: 4,
          currentTask: "Computing translation tasks...",
        });
      }

      // Call original console.log
      originalConsoleLog(...args);
    };

    // Execute the original plan function
    const result = await plan(ctx);

    // Restore original console.log
    console.log = originalConsoleLog;

    // Report planning completion
    feedbackManager.reportRetranslationProgress({
      totalTasks: 4,
      completedTasks: 4,
      currentTask: "Planning completed",
    });

    return result;
  } catch (error) {
    // Restore console.log in case of error
    console.log = console.log;

    feedbackManager.reportError({
      type: "translation",
      message: `Planning failed: ${error instanceof Error ? error.message : String(error)}`,
      recoverable: false,
    });

    throw error;
  }
}

/**
 * Extract planning progress information from context
 */
export function extractPlanningProgress(
  ctx: CmdRunContext,
): TranslationProgress {
  const totalSteps = 4; // Planning has 4 main steps
  const completedSteps = ctx.tasks.length > 0 ? 4 : 0; // If tasks exist, planning is complete

  return {
    totalTasks: totalSteps,
    completedTasks: completedSteps,
    currentTask:
      completedSteps === totalSteps
        ? "Planning completed"
        : "Planning in progress...",
  };
}

/**
 * Example demonstrating how to integrate the FeedbackManager with the translation pipeline
 * This file shows the complete integration pattern for task 4.2
 */

import { CmdRunContext } from "../_types";
import { FeedbackManager } from "./feedback";
import {
  TranslationPipeline,
  createTranslationPipeline,
} from "./translation-pipeline";
import { FileChangeEvent, WatchConfiguration } from "./types";

/**
 * Example of how to integrate FeedbackManager with the translation pipeline
 * in a watch context
 */
export class WatchTranslationIntegration {
  private feedbackManager: FeedbackManager;
  private translationPipeline: TranslationPipeline;

  constructor(watchConfig: WatchConfiguration) {
    // Initialize FeedbackManager with configuration from watch settings
    this.feedbackManager = new FeedbackManager({
      logLevel: watchConfig.monitoring.logLevel,
      enableProgressIndicators: watchConfig.monitoring.enableProgressIndicators,
      enableNotifications: watchConfig.monitoring.enableNotifications,
    });

    // Create translation pipeline with feedback integration
    this.translationPipeline = createTranslationPipeline(this.feedbackManager);
  }

  /**
   * Handle file changes and trigger retranslation with feedback
   */
  async handleFileChanges(
    ctx: CmdRunContext,
    changes: FileChangeEvent[],
  ): Promise<void> {
    try {
      // Report individual file changes
      changes.forEach((change) => {
        this.feedbackManager.reportFileChange(change);
      });

      // Extract changed file paths
      const changedFiles = changes.map((change) => change.path);

      // Execute translation pipeline with comprehensive feedback
      const result = await this.translationPipeline.executeWithRetry(
        ctx,
        changedFiles,
        2, // Max retries
      );

      // Additional feedback based on results
      if (result.success) {
        console.log(
          `\n✅ Successfully processed ${result.tasksCompleted} translation tasks`,
        );
        if (result.duration > 0) {
          const tasksPerSecond =
            (result.tasksCompleted / result.duration) * 1000;
          console.log(
            `⚡ Performance: ${tasksPerSecond.toFixed(2)} tasks/second`,
          );
        }
      } else {
        console.log(
          `\n❌ Translation failed with ${result.errors.length} errors`,
        );
        result.errors.forEach((error) => {
          this.feedbackManager.reportError(error);
        });
      }
    } catch (error) {
      this.feedbackManager.reportError({
        type: "translation",
        message: `Unexpected error during translation: ${error instanceof Error ? error.message : String(error)}`,
        recoverable: false,
      });
    }
  }

  /**
   * Get current pipeline status for monitoring
   */
  getStatus(ctx: CmdRunContext) {
    return this.translationPipeline.getPipelineStatus(ctx);
  }

  /**
   * Update feedback configuration dynamically
   */
  updateFeedbackConfiguration(options: {
    logLevel?: "silent" | "minimal" | "verbose";
    enableProgressIndicators?: boolean;
    enableNotifications?: boolean;
  }) {
    this.feedbackManager.updateConfiguration(options);
  }
}

/**
 * Example usage in a watch manager context
 */
export async function exampleWatchManagerIntegration(
  ctx: CmdRunContext,
  watchConfig: WatchConfiguration,
): Promise<void> {
  // Create integrated watch translation handler
  const integration = new WatchTranslationIntegration(watchConfig);

  // Simulate file changes
  const mockChanges: FileChangeEvent[] = [
    {
      type: "change",
      path: "locales/en.json",
      timestamp: new Date(),
    },
    {
      type: "change",
      path: "locales/messages.json",
      timestamp: new Date(),
    },
  ];

  // Handle the changes with full feedback integration
  await integration.handleFileChanges(ctx, mockChanges);

  // Check final status
  const status = integration.getStatus(ctx);
  console.log(
    `\nPipeline Status: ${status.phase} (${status.progress}% complete)`,
  );
}

/**
 * Example of progress tracking callback for advanced scenarios
 */
export function createProgressTrackingCallback(
  feedbackManager: FeedbackManager,
) {
  return (progress: number, currentTask?: string) => {
    feedbackManager.reportRetranslationProgress({
      totalTasks: 100, // Example total
      completedTasks: Math.round(progress),
      currentTask,
      estimatedTimeRemaining: currentTask ? (100 - progress) * 1000 : undefined,
    });
  };
}

/**
 * Example of error handling with recovery suggestions
 */
export function handleTranslationError(
  error: Error,
  feedbackManager: FeedbackManager,
  context: { filePath?: string; operation?: string },
): void {
  let errorType: "file_system" | "translation" | "configuration" =
    "translation";
  let recoverable = true;

  // Categorize error type
  if (
    error.message.includes("ENOENT") ||
    error.message.includes("permission")
  ) {
    errorType = "file_system";
  } else if (
    error.message.includes("config") ||
    error.message.includes("invalid")
  ) {
    errorType = "configuration";
    recoverable = false;
  }

  feedbackManager.reportError({
    type: errorType,
    message: error.message,
    path: context.filePath,
    recoverable,
  });

  // Provide recovery suggestions based on error type
  if (errorType === "file_system") {
    console.log(
      "💡 Suggestion: Check file permissions and ensure the file exists",
    );
  } else if (errorType === "configuration") {
    console.log("💡 Suggestion: Review your i18n.json configuration file");
  } else {
    console.log("💡 Suggestion: Check your API key and network connection");
  }
}

/**
 * Example of batch processing with progress feedback
 */
export async function processBatchWithFeedback(
  ctx: CmdRunContext,
  feedbackManager: FeedbackManager,
  batchSize: number = 10,
): Promise<void> {
  const totalTasks = ctx.tasks.length;
  const batches = Math.ceil(totalTasks / batchSize);

  for (let batchIndex = 0; batchIndex < batches; batchIndex++) {
    const startIndex = batchIndex * batchSize;
    const endIndex = Math.min(startIndex + batchSize, totalTasks);
    const batchTasks = ctx.tasks.slice(startIndex, endIndex);

    // Report batch progress
    feedbackManager.reportRetranslationProgress({
      totalTasks: batches,
      completedTasks: batchIndex,
      currentTask: `Processing batch ${batchIndex + 1}/${batches} (${batchTasks.length} tasks)`,
    });

    // Process batch (simplified example)
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate processing

    // Report batch completion
    console.log(`✅ Completed batch ${batchIndex + 1}/${batches}`);
  }

  // Report final completion
  feedbackManager.reportRetranslationProgress({
    totalTasks: batches,
    completedTasks: batches,
    currentTask: "All batches completed",
  });
}

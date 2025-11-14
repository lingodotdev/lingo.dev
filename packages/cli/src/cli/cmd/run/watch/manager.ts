import { CmdRunContext } from "../_types";
import {
  WatchManager as IWatchManager,
  WatchStatus,
  WatchConfiguration,
  WatchState,
  WatchStatistics,
  FileChangeEvent,
  WatchError,
} from "./types";
import { ConfigurationManager } from "./config";
import { FileWatcherService } from "./watcher";
import { FeedbackManager } from "./feedback";
import { DebounceController } from "./debounce";
import { PatternResolver } from "./patterns";
import { ShutdownManager } from "./shutdown";
import { ErrorRecoveryManager, RecoverableError } from "./error-recovery";
import { GracefulDegradationManager } from "./graceful-degradation";
import {
  PerformanceMonitor,
  PerformanceMetrics,
  PerformanceAlert,
} from "./performance-monitor";
import { ResourceManager } from "./resource-manager";
import { GitIntegrationManager, FileChangeBatch } from "./git-integration";
import { PerformanceOptimizer } from "./performance-optimizer";
import plan from "../plan";
import execute from "../execute";
import { renderSummary } from "../../../utils/ui";

/**
 * WatchManager orchestrates the entire file watching lifecycle and coordinates
 * between all watch components including file watcher, configuration, and feedback systems.
 */
export class WatchManager implements IWatchManager {
  private configManager: ConfigurationManager;
  private fileWatcher: FileWatcherService;
  private feedbackManager: FeedbackManager;
  private debounceController: DebounceController;
  private patternResolver: PatternResolver;
  private shutdownManager: ShutdownManager;
  private errorRecoveryManager: ErrorRecoveryManager;
  private gracefulDegradationManager: GracefulDegradationManager;
  private performanceMonitor: PerformanceMonitor;
  private resourceManager: ResourceManager;
  private gitIntegration: GitIntegrationManager;
  private performanceOptimizer: PerformanceOptimizer;
  private watchState: WatchState;
  private isInitialized: boolean = false;
  private currentContext: CmdRunContext | null = null;
  private shutdownHandlers: (() => Promise<void>)[] = [];
  private activeErrors: RecoverableError[] = [];

  constructor() {
    this.configManager = new ConfigurationManager();
    this.fileWatcher = new FileWatcherService();
    this.feedbackManager = new FeedbackManager();
    this.patternResolver = new PatternResolver();
    this.shutdownManager = new ShutdownManager(this, this.feedbackManager);
    this.errorRecoveryManager = new ErrorRecoveryManager();
    this.gracefulDegradationManager = new GracefulDegradationManager();
    this.performanceMonitor = new PerformanceMonitor();
    this.resourceManager = new ResourceManager({
      maxMemoryUsage: 0.8,
      maxWatchedFiles: 1000,
      maxConcurrentOperations: 10,
      rateLimitDelay: 100,
      batchSize: 50,
    });
    this.gitIntegration = new GitIntegrationManager();
    this.performanceOptimizer = new PerformanceOptimizer();

    // Initialize default watch state
    this.watchState = {
      isRunning: false,
      isRetranslating: false,
      pendingChanges: new Map<string, FileChangeEvent>(),
      watchedPatterns: [],
      startTime: new Date(),
      statistics: {
        totalChanges: 0,
        retranslationCount: 0,
        errorCount: 0,
        averageRetranslationTime: 0,
      },
    };

    // Initialize debounce controller with default strategy
    this.debounceController = new DebounceController({
      type: "simple",
      delay: 5000,
    });

    // Set up component coordination
    this.setupComponentCoordination();
  }

  /**
   * Start the watch process with the given context
   */
  async start(ctx: CmdRunContext): Promise<void> {
    if (this.isInitialized) {
      throw new Error("Watch manager is already running");
    }

    try {
      this.currentContext = ctx;

      // Load and validate configuration
      const watchConfig = await this.configManager.loadConfiguration(ctx);
      const validationResult =
        this.configManager.validateConfiguration(watchConfig);

      if (!validationResult.isValid) {
        throw new Error(
          `Invalid watch configuration: ${validationResult.errors.join(", ")}`,
        );
      }

      // Initialize watch state
      this.watchState.startTime = new Date();
      this.watchState.isRunning = true;

      // Update feedback manager with configuration
      this.feedbackManager.updateConfiguration({
        logLevel: watchConfig.monitoring.logLevel,
        enableProgressIndicators:
          watchConfig.monitoring.enableProgressIndicators,
        enableNotifications: watchConfig.monitoring.enableNotifications,
      });

      // Resolve watch patterns with performance optimization
      const basePatterns = await this.patternResolver.resolveWatchPatterns(ctx);
      const optimizedPatterns =
        await this.performanceOptimizer.resolveWatchPatterns(
          basePatterns.resolved,
        );
      this.watchState.watchedPatterns = optimizedPatterns;

      // Initialize file watcher with resolved patterns
      const watchOptions = {
        debounceDelay: watchConfig.debounce.delay,
        ignoreInitial: true,
        awaitWriteFinish: {
          stabilityThreshold: 500,
          pollInterval: 100,
        },
        ignored: basePatterns.exclude,
      };

      await this.fileWatcher.initialize(optimizedPatterns, watchOptions);

      // Configure debouncing strategy
      this.debounceController.updateStrategy({
        type: "simple", // TODO: Make configurable
        delay: watchConfig.debounce.delay,
        maxWait: watchConfig.debounce.maxWait,
        batchSize: watchConfig.performance.batchSize,
        rateLimitDelay: watchConfig.performance.rateLimitDelay,
      });

      // Initialize shutdown manager
      this.shutdownManager.initialize();

      // Start performance monitoring
      this.performanceMonitor.startMonitoring(5000); // Monitor every 5 seconds
      this.setupPerformanceMonitoring();

      // Update resource manager with file count
      this.resourceManager.updateResourceLimits({
        maxWatchedFiles: optimizedPatterns.length,
      });

      // Set up git integration
      this.gitIntegration.onBatch((batch: FileChangeBatch) => {
        this.handleFileChangeBatch(batch);
      });

      this.gitIntegration.onError((error) => {
        this.handleErrorWithRecovery(error);
      });

      this.isInitialized = true;

      console.log("👀 Watch manager started successfully");
      console.log(`   Watching ${optimizedPatterns.length} file(s)`);
      console.log(`   Debounce delay: ${watchConfig.debounce.delay}ms`);
      console.log(`   Performance monitoring: enabled`);
      console.log(
        `   Git integration: ${this.gitIntegration.getStatistics().enabled ? "enabled" : "disabled"}`,
      );
      console.log("");
    } catch (error) {
      this.watchState.isRunning = false;
      this.watchState.statistics.errorCount++;

      const watchError: WatchError = {
        type: "configuration",
        message: `Failed to start watch manager: ${error instanceof Error ? error.message : String(error)}`,
        recoverable: false,
      };

      this.feedbackManager.reportError(watchError);
      throw error;
    }
  }

  /**
   * Stop the watch process and clean up resources
   */
  async stop(): Promise<void> {
    if (!this.isInitialized) {
      return;
    }

    try {
      console.log("🛑 Stopping watch manager...");

      // Cancel pending debounced operations
      this.debounceController.cancelPending();

      // Stop performance monitoring
      this.performanceMonitor.stopMonitoring();

      // Shutdown resource manager
      this.resourceManager.shutdown();

      // Clean up git integration and performance optimizer
      this.gitIntegration.destroy();
      this.performanceOptimizer.destroy();

      // Stop file watcher
      await this.fileWatcher.destroy();

      // Execute shutdown handlers
      for (const handler of this.shutdownHandlers) {
        try {
          await handler();
        } catch (error) {
          console.error("Error in shutdown handler:", error);
        }
      }

      // Clean up state
      this.watchState.isRunning = false;
      this.watchState.pendingChanges.clear();
      this.isInitialized = false;
      this.currentContext = null;
      this.shutdownHandlers = [];

      console.log("✅ Watch manager stopped successfully");
    } catch (error) {
      this.watchState.statistics.errorCount++;

      const watchError: WatchError = {
        type: "file_system",
        message: `Error stopping watch manager: ${error instanceof Error ? error.message : String(error)}`,
        recoverable: false,
      };

      this.feedbackManager.reportError(watchError);
      throw error;
    }
  }

  /**
   * Get current watch status
   */
  getStatus(): WatchStatus {
    return {
      isActive: this.watchState.isRunning,
      watchedFiles: this.fileWatcher.getWatchedFiles(),
      pendingChanges: Array.from(this.watchState.pendingChanges.keys()),
      lastActivity:
        this.watchState.lastRetranslation || this.watchState.startTime,
      errorCount: this.watchState.statistics.errorCount,
    };
  }

  /**
   * Update watch configuration without restarting
   */
  async updateConfiguration(config: WatchConfiguration): Promise<void> {
    const validationResult = this.configManager.validateConfiguration(config);

    if (!validationResult.isValid) {
      throw new Error(
        `Invalid configuration: ${validationResult.errors.join(", ")}`,
      );
    }

    try {
      // Update feedback manager configuration
      this.feedbackManager.updateConfiguration({
        logLevel: config.monitoring.logLevel,
        enableProgressIndicators: config.monitoring.enableProgressIndicators,
        enableNotifications: config.monitoring.enableNotifications,
      });

      // Update debouncing strategy
      this.debounceController.updateStrategy({
        type: "simple", // TODO: Make configurable
        delay: config.debounce.delay,
        maxWait: config.debounce.maxWait,
        batchSize: config.performance.batchSize,
        rateLimitDelay: config.performance.rateLimitDelay,
      });

      // TODO: Update file watcher patterns if needed
      // This would require comparing current patterns with new ones
      // and adding/removing patterns as needed

      console.log("⚙️ Watch configuration updated");
    } catch (error) {
      this.watchState.statistics.errorCount++;

      const watchError: WatchError = {
        type: "configuration",
        message: `Failed to update configuration: ${error instanceof Error ? error.message : String(error)}`,
        recoverable: true,
      };

      this.feedbackManager.reportError(watchError);
      throw error;
    }
  }

  /**
   * Handle file change events from the file watcher
   */
  private async handleFileChange(event: FileChangeEvent): Promise<void> {
    this.watchState.statistics.totalChanges++;
    this.feedbackManager.reportFileChange(event);

    // Process through git integration for batching and optimization
    await this.gitIntegration.processFileChange(event);
  }

  /**
   * Handle batched file changes from git integration
   */
  private async handleFileChangeBatch(batch: FileChangeBatch): Promise<void> {
    // Optimize file changes for large repositories
    const optimizedChanges =
      this.performanceOptimizer.optimizeFileChangeDetection(batch.changes);

    // Update pending changes
    for (const change of optimizedChanges) {
      this.watchState.pendingChanges.set(change.path, change);
    }

    // Log batch information
    if (batch.gitOperation) {
      console.log(
        `🔄 Processing ${batch.gitOperation.operation} with ${optimizedChanges.length} files`,
      );
    }

    // Trigger debounced retranslation with optimized changes
    this.debounceController.scheduleRetranslation(optimizedChanges);
  }

  /**
   * Execute retranslation for pending changes
   */
  private async executeRetranslation(
    changes: FileChangeEvent[],
  ): Promise<void> {
    if (this.watchState.isRetranslating || !this.currentContext) {
      return;
    }

    // Use resource manager to execute retranslation with proper resource controls
    await this.resourceManager.executeOperation(async () => {
      this.watchState.isRetranslating = true;
      const startTime = Date.now();

      try {
        const changedFiles = changes.map((change) => change.path);
        this.feedbackManager.reportRetranslationStart(changedFiles);

        // Record file operations for performance monitoring
        changes.forEach(() => this.performanceMonitor.recordFileOperation());

        // Create a new context for this run (preserve original flags but reset tasks/results)
        const runCtx: CmdRunContext = {
          ...this.currentContext!,
          tasks: [],
          results: new Map(),
        };

        // Execute translation pipeline with resource management
        await this.resourceManager.executeOperation(async () => {
          await plan(runCtx);
        }, 1); // High priority for planning

        if (runCtx.tasks.length === 0) {
          this.feedbackManager.reportRetranslationComplete({
            success: true,
            duration: Date.now() - startTime,
            tasksCompleted: 0,
            errors: [],
          });
        } else {
          // Execute tasks in batches using resource manager

          if (this.isFeatureEnabled("enableProgressIndicators")) {
            this.feedbackManager.reportRetranslationProgress({
              totalTasks: runCtx.tasks.length,
              completedTasks: 0,
              currentTask: "Starting execution...",
            });
          }

          await this.resourceManager.executeOperation(async () => {
            await execute(runCtx);
          }, 1); // High priority for execution

          await renderSummary(runCtx.results);

          this.feedbackManager.reportRetranslationComplete({
            success: true,
            duration: Date.now() - startTime,
            tasksCompleted: runCtx.tasks.length,
            errors: [],
          });
        }

        // Update statistics
        const duration = Date.now() - startTime;
        this.watchState.statistics.retranslationCount++;
        this.watchState.statistics.averageRetranslationTime =
          (this.watchState.statistics.averageRetranslationTime *
            (this.watchState.statistics.retranslationCount - 1) +
            duration) /
          this.watchState.statistics.retranslationCount;

        this.watchState.lastRetranslation = new Date();
        this.watchState.pendingChanges.clear();
      } catch (error) {
        this.watchState.statistics.errorCount++;

        const watchError: WatchError = {
          type: "translation",
          message: error instanceof Error ? error.message : String(error),
          recoverable: true,
        };

        await this.handleErrorWithRecovery(watchError, {
          operation: "retranslation",
          changedFiles: changes.map((c) => c.path),
        });

        this.feedbackManager.reportRetranslationComplete({
          success: false,
          duration: Date.now() - startTime,
          tasksCompleted: 0,
          errors: [watchError],
        });
      } finally {
        this.watchState.isRetranslating = false;
      }
    }, 2); // Medium priority for overall retranslation operation
  }

  /**
   * Set up coordination between watch components
   */
  private setupComponentCoordination(): void {
    // Set up file change handler
    this.fileWatcher.onFileChange((event: FileChangeEvent) => {
      this.handleFileChange(event);
    });

    // Set up error handler with recovery
    this.fileWatcher.onError(async (error: WatchError) => {
      await this.handleErrorWithRecovery(error);
    });

    // Set up debounce callback
    this.debounceController.setRetranslationCallback(
      (changes: FileChangeEvent[]) => this.executeRetranslation(changes),
    );
  }

  /**
   * Get detailed statistics about the watch process
   */
  getStatistics(): WatchStatistics & {
    debounceStats: any;
    uptime: number;
    gitIntegration: any;
    performanceOptimizer: any;
  } {
    const uptime = Date.now() - this.watchState.startTime.getTime();

    return {
      ...this.watchState.statistics,
      debounceStats: this.debounceController.getStatistics(),
      gitIntegration: this.gitIntegration.getStatistics(),
      performanceOptimizer: this.performanceOptimizer.getStatistics(),
      uptime,
    };
  }

  /**
   * Add a custom shutdown handler
   */
  addShutdownHandler(handler: () => Promise<void>): void {
    this.shutdownHandlers.push(handler);
  }

  /**
   * Check if the watch manager is healthy
   */
  isHealthy(): boolean {
    return (
      this.isInitialized &&
      this.watchState.isRunning &&
      this.watchState.statistics.errorCount < 10 // Arbitrary threshold
    );
  }

  /**
   * Get the shutdown manager for external control
   */
  getShutdownManager(): ShutdownManager {
    return this.shutdownManager;
  }

  /**
   * Handle errors with recovery and degradation logic
   */
  private async handleErrorWithRecovery(
    error: WatchError,
    context?: Record<string, any>,
  ): Promise<void> {
    this.watchState.statistics.errorCount++;

    // Attempt error recovery
    const recoveryResult = await this.errorRecoveryManager.handleError(
      error,
      context,
    );

    if (recoveryResult.success) {
      console.log(`✅ Recovered from error: ${recoveryResult.message}`);
      return;
    }

    // Add to active errors for degradation evaluation
    const recoverableError: RecoverableError = {
      ...error,
      category: this.categorizeError(error),
      severity: this.determineErrorSeverity(error),
      retryCount: 0,
      context,
    };

    this.activeErrors.push(recoverableError);
    this.feedbackManager.reportError(error);

    // Evaluate if system degradation is needed
    await this.evaluateSystemDegradation();

    // Schedule retry if appropriate
    if (recoveryResult.shouldRetry && recoveryResult.nextRetryDelay) {
      setTimeout(async () => {
        await this.retryFailedOperation(error, context);
      }, recoveryResult.nextRetryDelay);
    }
  }

  /**
   * Evaluate if system degradation is needed based on current errors
   */
  private async evaluateSystemDegradation(): Promise<void> {
    const systemMetrics = await this.getSystemMetrics();
    const degradationDecision =
      this.gracefulDegradationManager.evaluateDegradation(
        this.activeErrors,
        systemMetrics,
      );

    if (degradationDecision.shouldDegrade && this.currentContext) {
      const currentConfig = await this.configManager.loadConfiguration(
        this.currentContext,
      );
      const degradedConfig =
        await this.gracefulDegradationManager.applyDegradation(
          degradationDecision.targetLevel,
          currentConfig,
          degradationDecision.reason || "System degradation triggered",
        );

      // Apply degraded configuration
      await this.applyDegradedConfiguration(degradedConfig);
    }
  }

  /**
   * Apply degraded configuration to the watch system
   */
  private async applyDegradedConfiguration(degradedConfig: any): Promise<void> {
    try {
      // Update debounce controller with degraded settings
      this.debounceController.updateStrategy({
        type: "simple",
        delay: degradedConfig.debounce.delay,
        maxWait: degradedConfig.debounce.maxWait,
        batchSize: degradedConfig.performance.batchSize,
        rateLimitDelay: degradedConfig.performance.rateLimitDelay,
      });

      // Update feedback manager with degraded monitoring settings
      this.feedbackManager.updateConfiguration({
        logLevel: degradedConfig.monitoring.logLevel,
        enableProgressIndicators:
          degradedConfig.monitoring.enableProgressIndicators,
        enableNotifications: degradedConfig.monitoring.enableNotifications,
      });

      console.log(
        `⚙️ Applied degraded configuration (${degradedConfig.degradationLevel} mode)`,
      );
    } catch (error) {
      console.error("Failed to apply degraded configuration:", error);
    }
  }

  /**
   * Retry a failed operation
   */
  private async retryFailedOperation(
    originalError: WatchError,
    _context?: Record<string, any>,
  ): Promise<void> {
    try {
      // This is a placeholder for operation-specific retry logic
      // In a real implementation, this would depend on the error type
      console.log(
        `🔄 Retrying operation that failed with: ${originalError.message}`,
      );

      // Remove the error from active errors if retry succeeds
      this.activeErrors = this.activeErrors.filter(
        (e) =>
          e.message !== originalError.message || e.path !== originalError.path,
      );
    } catch (retryError) {
      console.warn(`Retry failed: ${retryError}`);
    }
  }

  /**
   * Categorize error for recovery purposes
   */
  private categorizeError(error: WatchError): any {
    // This would use the ErrorCategory enum from error-recovery.ts
    // For now, return a simple mapping
    switch (error.type) {
      case "file_system":
        return "file_system";
      case "translation":
        return "translation";
      case "configuration":
        return "configuration";
      default:
        return "file_system";
    }
  }

  /**
   * Determine error severity
   */
  private determineErrorSeverity(error: WatchError): any {
    // This would use the ErrorSeverity enum from error-recovery.ts
    // For now, return a simple mapping based on error characteristics
    const message = error.message.toLowerCase();

    if (message.includes("critical") || message.includes("fatal")) {
      return "critical";
    } else if (
      message.includes("permission") ||
      message.includes("access denied")
    ) {
      return "high";
    } else if (message.includes("network") || message.includes("timeout")) {
      return "medium";
    } else {
      return "low";
    }
  }

  /**
   * Get current system metrics for degradation evaluation
   */
  private async getSystemMetrics(): Promise<any> {
    const memoryUsage = process.memoryUsage();
    const totalMemory = memoryUsage.heapTotal + memoryUsage.external;
    const usedMemory = memoryUsage.heapUsed;

    return {
      memoryUsage: usedMemory / totalMemory,
      cpuUsage: 0.5, // Placeholder - would need actual CPU monitoring
      fileDescriptors: 0, // Placeholder - would need actual FD count
      watchedFiles: this.fileWatcher.getWatchedFiles().length,
    };
  }

  /**
   * Get error recovery statistics
   */
  getErrorRecoveryStatistics(): any {
    return {
      errorRecovery: this.errorRecoveryManager.getErrorStatistics(),
      degradation: {
        currentLevel: this.gracefulDegradationManager.getCurrentLevel(),
        healthStatus: this.gracefulDegradationManager.getHealthStatus(),
        history: this.gracefulDegradationManager.getDegradationHistory(),
      },
      activeErrors: this.activeErrors.length,
    };
  }

  /**
   * Manually reset system to normal operation
   */
  async resetToNormalOperation(): Promise<void> {
    await this.gracefulDegradationManager.resetToNormal();
    this.errorRecoveryManager.clearActiveErrors();
    this.activeErrors = [];

    // Reload original configuration if available
    if (this.currentContext) {
      const originalConfig = await this.configManager.loadConfiguration(
        this.currentContext,
      );
      await this.updateConfiguration(originalConfig);
    }
  }

  /**
   * Check if a feature is enabled in current degradation state
   */
  isFeatureEnabled(feature: string): boolean {
    return this.gracefulDegradationManager.isFeatureEnabled(feature as any);
  }

  /**
   * Set up performance monitoring event handlers
   */
  private setupPerformanceMonitoring(): void {
    // Handle performance alerts
    this.performanceMonitor.on("alert", (alert: PerformanceAlert) => {
      console.warn(`⚠️  Performance Alert [${alert.level}]: ${alert.message}`);

      if (alert.level === "critical") {
        // Trigger immediate degradation for critical alerts
        this.evaluateSystemDegradation();
      }
    });

    // Update resource manager with performance metrics
    this.performanceMonitor.on("metrics", (metrics: PerformanceMetrics) => {
      this.resourceManager.updateResourceUsage(metrics);

      // Update file system metrics with current watch data
      this.performanceMonitor.updateFileSystemMetrics({
        watchedFiles: this.fileWatcher.getWatchedFiles().length,
      });

      // Update watch metrics
      this.performanceMonitor.updateWatchMetrics({
        totalChanges: this.watchState.statistics.totalChanges,
        retranslationCount: this.watchState.statistics.retranslationCount,
        averageRetranslationTime:
          this.watchState.statistics.averageRetranslationTime,
        errorRate:
          this.watchState.statistics.errorCount /
          Math.max(this.watchState.statistics.totalChanges, 1),
      });
    });

    // Handle resource manager events
    this.resourceManager.on("operationQueued", (event) => {
      if (this.isFeatureEnabled("enableDetailedLogging")) {
        console.log(`📋 Operation queued (queue size: ${event.queueSize})`);
      }
    });

    this.resourceManager.on("resourceUsageUpdated", (usage) => {
      if (usage.memoryUsage > 0.9) {
        console.warn(
          "⚠️  High memory usage detected, forcing garbage collection",
        );
        this.resourceManager.forceGarbageCollection();
      }
    });
  }

  /**
   * Get comprehensive performance statistics
   */
  getPerformanceStatistics(): {
    performance: any;
    resources: any;
    queue: any;
    errors: any;
  } {
    return {
      performance: this.performanceMonitor.getPerformanceSummary(),
      resources: this.resourceManager.getResourceUsage(),
      queue: this.resourceManager.getQueueStatistics(),
      errors: this.getErrorRecoveryStatistics(),
    };
  }
}

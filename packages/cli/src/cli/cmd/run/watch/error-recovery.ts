import { WatchError, ErrorRecoveryStrategy, RecoveryAction } from "./types";

/**
 * Error categories for different types of failures
 */
export enum ErrorCategory {
  FILE_SYSTEM = "file_system",
  TRANSLATION = "translation",
  CONFIGURATION = "configuration",
  NETWORK = "network",
  RESOURCE = "resource",
}

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

/**
 * Enhanced error interface with recovery metadata
 */
export interface RecoverableError extends WatchError {
  category: ErrorCategory;
  severity: ErrorSeverity;
  retryCount: number;
  lastRetryAt?: Date;
  context?: Record<string, any>;
}

/**
 * Recovery attempt result
 */
export interface RecoveryResult {
  success: boolean;
  message: string;
  shouldRetry: boolean;
  nextRetryDelay?: number;
}

/**
 * Comprehensive error recovery manager that implements retry logic with exponential backoff,
 * error categorization, and appropriate recovery actions for different failure types.
 */
export class ErrorRecoveryManager {
  private activeErrors = new Map<string, RecoverableError>();
  private recoveryStrategies = new Map<ErrorCategory, ErrorRecoveryStrategy>();
  private recoveryActions = new Map<string, RecoveryAction>();
  private maxGlobalRetries = 10;
  private globalErrorCount = 0;
  private lastGlobalReset = Date.now();

  constructor() {
    this.initializeRecoveryActions();
    this.initializeDefaultStrategies();
  }

  /**
   * Process an error and attempt recovery if appropriate
   */
  async handleError(
    error: WatchError,
    context?: Record<string, any>,
  ): Promise<RecoveryResult> {
    const recoverableError = this.categorizeError(error, context);
    const errorKey = this.getErrorKey(recoverableError);

    // Check if we've seen this error before
    const existingError = this.activeErrors.get(errorKey);
    if (existingError) {
      recoverableError.retryCount = existingError.retryCount;
      recoverableError.lastRetryAt = existingError.lastRetryAt;
    }

    this.activeErrors.set(errorKey, recoverableError);
    this.globalErrorCount++;

    // Check global error limits
    if (this.shouldTriggerGlobalBackoff()) {
      return {
        success: false,
        message: "Too many errors globally, entering backoff mode",
        shouldRetry: false,
      };
    }

    // Get recovery strategy for this error category
    const strategy = this.recoveryStrategies.get(recoverableError.category);
    if (!strategy) {
      return {
        success: false,
        message: `No recovery strategy for error category: ${recoverableError.category}`,
        shouldRetry: false,
      };
    }

    // Check if we've exceeded retry limits for this specific error
    if (recoverableError.retryCount >= strategy.maxRetries) {
      return {
        success: false,
        message: `Maximum retries (${strategy.maxRetries}) exceeded for error: ${recoverableError.message}`,
        shouldRetry: false,
      };
    }

    // Attempt recovery
    return await this.attemptRecovery(recoverableError, strategy);
  }

  /**
   * Attempt to recover from an error using the appropriate strategy
   */
  private async attemptRecovery(
    error: RecoverableError,
    strategy: ErrorRecoveryStrategy,
  ): Promise<RecoveryResult> {
    error.retryCount++;
    error.lastRetryAt = new Date();

    // Calculate exponential backoff delay
    const baseDelay = this.getBaseDelayForSeverity(error.severity);
    const backoffDelay =
      baseDelay * Math.pow(strategy.backoffMultiplier, error.retryCount - 1);
    const jitteredDelay = this.addJitter(backoffDelay);

    // Find applicable recovery actions
    const applicableActions = strategy.recoveryActions.filter((action) =>
      action.condition(new Error(error.message)),
    );

    if (applicableActions.length === 0) {
      return {
        success: false,
        message: `No applicable recovery actions for error: ${error.message}`,
        shouldRetry: error.retryCount < strategy.maxRetries,
        nextRetryDelay: jitteredDelay,
      };
    }

    // Execute recovery actions
    for (const action of applicableActions) {
      try {
        await action.action(new Error(error.message));

        // If we get here, the action succeeded
        this.markErrorAsRecovered(error);
        return {
          success: true,
          message: `Recovered using action: ${action.description}`,
          shouldRetry: false,
        };
      } catch (actionError) {
        console.warn(
          `Recovery action failed: ${action.description}`,
          actionError,
        );
      }
    }

    // All recovery actions failed
    return {
      success: false,
      message: `All recovery actions failed for error: ${error.message}`,
      shouldRetry: error.retryCount < strategy.maxRetries,
      nextRetryDelay: jitteredDelay,
    };
  }

  /**
   * Categorize an error and determine its severity
   */
  private categorizeError(
    error: WatchError,
    context?: Record<string, any>,
  ): RecoverableError {
    let category: ErrorCategory;
    let severity: ErrorSeverity;

    // Categorize based on error type and message content
    switch (error.type) {
      case "file_system":
        category = ErrorCategory.FILE_SYSTEM;
        severity = this.categorizeFileSystemError(error.message);
        break;
      case "translation":
        category = ErrorCategory.TRANSLATION;
        severity = this.categorizeTranslationError(error.message);
        break;
      case "configuration":
        category = ErrorCategory.CONFIGURATION;
        severity = ErrorSeverity.HIGH; // Configuration errors are usually serious
        break;
      default:
        category = ErrorCategory.FILE_SYSTEM;
        severity = ErrorSeverity.MEDIUM;
    }

    // Check for network-related errors
    if (this.isNetworkError(error.message)) {
      category = ErrorCategory.NETWORK;
      severity = ErrorSeverity.MEDIUM;
    }

    // Check for resource-related errors
    if (this.isResourceError(error.message)) {
      category = ErrorCategory.RESOURCE;
      severity = ErrorSeverity.HIGH;
    }

    return {
      ...error,
      category,
      severity,
      retryCount: 0,
      context,
    };
  }

  /**
   * Categorize file system error severity
   */
  private categorizeFileSystemError(message: string): ErrorSeverity {
    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes("permission denied") ||
      lowerMessage.includes("access denied")
    ) {
      return ErrorSeverity.HIGH;
    }
    if (
      lowerMessage.includes("no such file") ||
      lowerMessage.includes("not found")
    ) {
      return ErrorSeverity.LOW;
    }
    if (
      lowerMessage.includes("device not ready") ||
      lowerMessage.includes("network")
    ) {
      return ErrorSeverity.MEDIUM;
    }
    if (
      lowerMessage.includes("disk full") ||
      lowerMessage.includes("no space")
    ) {
      return ErrorSeverity.CRITICAL;
    }

    return ErrorSeverity.MEDIUM;
  }

  /**
   * Categorize translation error severity
   */
  private categorizeTranslationError(message: string): ErrorSeverity {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("api") || lowerMessage.includes("network")) {
      return ErrorSeverity.MEDIUM;
    }
    if (lowerMessage.includes("rate limit") || lowerMessage.includes("quota")) {
      return ErrorSeverity.HIGH;
    }
    if (
      lowerMessage.includes("authentication") ||
      lowerMessage.includes("unauthorized")
    ) {
      return ErrorSeverity.CRITICAL;
    }

    return ErrorSeverity.LOW;
  }

  /**
   * Check if error is network-related
   */
  private isNetworkError(message: string): boolean {
    const networkKeywords = [
      "network",
      "connection",
      "timeout",
      "dns",
      "resolve",
      "unreachable",
      "refused",
      "reset",
      "socket",
    ];
    const lowerMessage = message.toLowerCase();
    return networkKeywords.some((keyword) => lowerMessage.includes(keyword));
  }

  /**
   * Check if error is resource-related
   */
  private isResourceError(message: string): boolean {
    const resourceKeywords = [
      "memory",
      "disk",
      "space",
      "quota",
      "limit",
      "capacity",
      "too many",
      "exhausted",
      "overflow",
    ];
    const lowerMessage = message.toLowerCase();
    return resourceKeywords.some((keyword) => lowerMessage.includes(keyword));
  }

  /**
   * Get base delay for error severity
   */
  private getBaseDelayForSeverity(severity: ErrorSeverity): number {
    switch (severity) {
      case ErrorSeverity.LOW:
        return 1000; // 1 second
      case ErrorSeverity.MEDIUM:
        return 2000; // 2 seconds
      case ErrorSeverity.HIGH:
        return 5000; // 5 seconds
      case ErrorSeverity.CRITICAL:
        return 10000; // 10 seconds
      default:
        return 2000;
    }
  }

  /**
   * Add jitter to delay to prevent thundering herd
   */
  private addJitter(delay: number): number {
    const jitterFactor = 0.1; // 10% jitter
    const jitter = delay * jitterFactor * Math.random();
    return Math.floor(delay + jitter);
  }

  /**
   * Generate a unique key for an error
   */
  private getErrorKey(error: RecoverableError): string {
    return `${error.category}:${error.type}:${error.path || "global"}`;
  }

  /**
   * Mark an error as recovered and remove it from active errors
   */
  private markErrorAsRecovered(error: RecoverableError): void {
    const errorKey = this.getErrorKey(error);
    this.activeErrors.delete(errorKey);
  }

  /**
   * Check if we should trigger global backoff due to too many errors
   */
  private shouldTriggerGlobalBackoff(): boolean {
    const now = Date.now();
    const timeSinceLastReset = now - this.lastGlobalReset;
    const resetInterval = 5 * 60 * 1000; // 5 minutes

    // Reset global error count every 5 minutes
    if (timeSinceLastReset > resetInterval) {
      this.globalErrorCount = 0;
      this.lastGlobalReset = now;
      return false;
    }

    return this.globalErrorCount > this.maxGlobalRetries;
  }

  /**
   * Initialize default recovery strategies for each error category
   */
  private initializeDefaultStrategies(): void {
    // File system errors - moderate retry with exponential backoff
    this.recoveryStrategies.set(ErrorCategory.FILE_SYSTEM, {
      maxRetries: 5,
      backoffMultiplier: 2,
      recoveryActions: [
        this.recoveryActions.get("wait_and_retry")!,
        this.recoveryActions.get("check_file_exists")!,
        this.recoveryActions.get("recreate_watcher")!,
      ].filter(Boolean),
    });

    // Translation errors - fewer retries, longer backoff
    this.recoveryStrategies.set(ErrorCategory.TRANSLATION, {
      maxRetries: 3,
      backoffMultiplier: 3,
      recoveryActions: [
        this.recoveryActions.get("wait_and_retry")!,
        this.recoveryActions.get("reset_translation_context")!,
      ].filter(Boolean),
    });

    // Configuration errors - minimal retries, usually not recoverable
    this.recoveryStrategies.set(ErrorCategory.CONFIGURATION, {
      maxRetries: 1,
      backoffMultiplier: 1,
      recoveryActions: [
        this.recoveryActions.get("reload_configuration")!,
      ].filter(Boolean),
    });

    // Network errors - aggressive retry with backoff
    this.recoveryStrategies.set(ErrorCategory.NETWORK, {
      maxRetries: 7,
      backoffMultiplier: 2,
      recoveryActions: [
        this.recoveryActions.get("wait_and_retry")!,
        this.recoveryActions.get("check_network_connectivity")!,
      ].filter(Boolean),
    });

    // Resource errors - conservative retry, may need manual intervention
    this.recoveryStrategies.set(ErrorCategory.RESOURCE, {
      maxRetries: 2,
      backoffMultiplier: 5,
      recoveryActions: [
        this.recoveryActions.get("cleanup_resources")!,
        this.recoveryActions.get("wait_and_retry")!,
      ].filter(Boolean),
    });
  }

  /**
   * Initialize recovery actions
   */
  private initializeRecoveryActions(): void {
    // Basic wait and retry action
    this.recoveryActions.set("wait_and_retry", {
      condition: () => true, // Always applicable
      action: async (error: Error) => {
        // The actual waiting is handled by the retry mechanism
        // This action just indicates that waiting and retrying is appropriate
      },
      description: "Wait and retry the operation",
    });

    // Check if file exists before retrying
    this.recoveryActions.set("check_file_exists", {
      condition: (error: Error) =>
        error.message.includes("no such file") ||
        error.message.includes("not found"),
      action: async (error: Error) => {
        // This would be implemented to check file existence
        // For now, just a placeholder that always succeeds
      },
      description: "Verify file existence before retry",
    });

    // Recreate file watcher
    this.recoveryActions.set("recreate_watcher", {
      condition: (error: Error) =>
        error.message.includes("watcher") || error.message.includes("watch"),
      action: async (error: Error) => {
        // This would be implemented to recreate the file watcher
        // For now, just a placeholder
      },
      description: "Recreate file watcher instance",
    });

    // Reset translation context
    this.recoveryActions.set("reset_translation_context", {
      condition: (error: Error) =>
        error.message.includes("translation") ||
        error.message.includes("context"),
      action: async (error: Error) => {
        // This would be implemented to reset translation state
        // For now, just a placeholder
      },
      description: "Reset translation context and state",
    });

    // Reload configuration
    this.recoveryActions.set("reload_configuration", {
      condition: (error: Error) =>
        error.message.includes("config") ||
        error.message.includes("configuration"),
      action: async (error: Error) => {
        // This would be implemented to reload configuration
        // For now, just a placeholder
      },
      description: "Reload configuration from disk",
    });

    // Check network connectivity
    this.recoveryActions.set("check_network_connectivity", {
      condition: (error: Error) =>
        error.message.includes("network") ||
        error.message.includes("connection"),
      action: async (error: Error) => {
        // This would be implemented to check network connectivity
        // For now, just a placeholder
      },
      description: "Verify network connectivity",
    });

    // Cleanup resources
    this.recoveryActions.set("cleanup_resources", {
      condition: (error: Error) =>
        error.message.includes("memory") || error.message.includes("resource"),
      action: async (error: Error) => {
        // This would be implemented to cleanup resources
        // For now, just a placeholder that triggers garbage collection
        if (global.gc) {
          global.gc();
        }
      },
      description: "Clean up system resources",
    });
  }

  /**
   * Get current error statistics
   */
  getErrorStatistics(): {
    activeErrors: number;
    totalErrors: number;
    errorsByCategory: Record<ErrorCategory, number>;
    errorsBySeverity: Record<ErrorSeverity, number>;
  } {
    const errorsByCategory: Record<ErrorCategory, number> = {
      [ErrorCategory.FILE_SYSTEM]: 0,
      [ErrorCategory.TRANSLATION]: 0,
      [ErrorCategory.CONFIGURATION]: 0,
      [ErrorCategory.NETWORK]: 0,
      [ErrorCategory.RESOURCE]: 0,
    };

    const errorsBySeverity: Record<ErrorSeverity, number> = {
      [ErrorSeverity.LOW]: 0,
      [ErrorSeverity.MEDIUM]: 0,
      [ErrorSeverity.HIGH]: 0,
      [ErrorSeverity.CRITICAL]: 0,
    };

    for (const error of this.activeErrors.values()) {
      errorsByCategory[error.category]++;
      errorsBySeverity[error.severity]++;
    }

    return {
      activeErrors: this.activeErrors.size,
      totalErrors: this.globalErrorCount,
      errorsByCategory,
      errorsBySeverity,
    };
  }

  /**
   * Clear all active errors (useful for testing or manual reset)
   */
  clearActiveErrors(): void {
    this.activeErrors.clear();
  }

  /**
   * Get all active errors
   */
  getActiveErrors(): RecoverableError[] {
    return Array.from(this.activeErrors.values());
  }

  /**
   * Check if the system is in a healthy state (few active errors)
   */
  isHealthy(): boolean {
    const stats = this.getErrorStatistics();
    return (
      stats.activeErrors < 5 &&
      stats.errorsBySeverity[ErrorSeverity.CRITICAL] === 0
    );
  }
}

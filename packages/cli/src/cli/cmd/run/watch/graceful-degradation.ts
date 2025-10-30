import { WatchError, WatchConfiguration } from "./types";
import {
  ErrorCategory,
  ErrorSeverity,
  RecoverableError,
} from "./error-recovery";

/**
 * Degradation levels for different system states
 */
export enum DegradationLevel {
  NORMAL = "normal",
  REDUCED = "reduced",
  MINIMAL = "minimal",
  EMERGENCY = "emergency",
}

/**
 * Feature flags that can be disabled during degradation
 */
export interface FeatureFlags {
  enableProgressIndicators: boolean;
  enableNotifications: boolean;
  enableDetailedLogging: boolean;
  enablePatternExpansion: boolean;
  enableAdvancedDebouncing: boolean;
  enableStatisticsTracking: boolean;
  enablePerformanceMonitoring: boolean;
}

/**
 * Degraded configuration with reduced functionality
 */
export interface DegradedConfiguration extends WatchConfiguration {
  degradationLevel: DegradationLevel;
  disabledFeatures: string[];
  reducedLimits: {
    maxWatchedFiles: number;
    maxRetries: number;
    debounceDelay: number;
    batchSize: number;
  };
}

/**
 * Graceful degradation manager that reduces system functionality
 * when errors occur to maintain core operations
 */
export class GracefulDegradationManager {
  private currentLevel: DegradationLevel = DegradationLevel.NORMAL;
  private originalConfig: WatchConfiguration | null = null;
  private degradedConfig: DegradedConfiguration | null = null;
  private featureFlags: FeatureFlags;
  private errorThresholds: Map<DegradationLevel, ErrorThreshold>;
  private degradationHistory: DegradationEvent[] = [];

  constructor() {
    this.featureFlags = this.getDefaultFeatureFlags();
    this.errorThresholds = this.initializeErrorThresholds();
  }

  /**
   * Evaluate current system state and determine if degradation is needed
   */
  evaluateDegradation(
    errors: RecoverableError[],
    systemMetrics: SystemMetrics,
  ): DegradationDecision {
    const currentThreshold = this.errorThresholds.get(this.currentLevel);
    if (!currentThreshold) {
      return { shouldDegrade: false, targetLevel: this.currentLevel };
    }

    // Count errors by severity
    const errorCounts = this.countErrorsBySeverity(errors);

    // Check if we should degrade further
    const shouldDegradeDown = this.shouldDegradeDown(
      errorCounts,
      systemMetrics,
      currentThreshold,
    );
    if (shouldDegradeDown) {
      const targetLevel = this.getNextDegradationLevel(this.currentLevel);
      return {
        shouldDegrade: true,
        targetLevel,
        reason: "Error threshold exceeded",
      };
    }

    // Check if we can recover to a better level
    const shouldRecover = this.shouldRecover(errorCounts, systemMetrics);
    if (shouldRecover) {
      const targetLevel = this.getPreviousDegradationLevel(this.currentLevel);
      return {
        shouldDegrade: true,
        targetLevel,
        reason: "System stabilized, recovering",
      };
    }

    return { shouldDegrade: false, targetLevel: this.currentLevel };
  }

  /**
   * Apply degradation to the given level
   */
  async applyDegradation(
    level: DegradationLevel,
    config: WatchConfiguration,
    reason: string,
  ): Promise<DegradedConfiguration> {
    if (!this.originalConfig) {
      this.originalConfig = { ...config };
    }

    const previousLevel = this.currentLevel;
    this.currentLevel = level;

    // Create degraded configuration
    this.degradedConfig = this.createDegradedConfiguration(config, level);

    // Update feature flags
    this.featureFlags = this.getFeatureFlagsForLevel(level);

    // Record degradation event
    this.degradationHistory.push({
      timestamp: new Date(),
      fromLevel: previousLevel,
      toLevel: level,
      reason,
      triggeredBy: "error_threshold",
    });

    // Log degradation
    console.warn(`⚠️  System degraded to ${level} mode: ${reason}`);
    this.logDisabledFeatures(level);

    return this.degradedConfig;
  }

  /**
   * Create a degraded configuration for the specified level
   */
  private createDegradedConfiguration(
    config: WatchConfiguration,
    level: DegradationLevel,
  ): DegradedConfiguration {
    const baseConfig = { ...config };
    const disabledFeatures: string[] = [];

    switch (level) {
      case DegradationLevel.REDUCED:
        // Reduce performance settings
        baseConfig.performance.batchSize = Math.min(
          baseConfig.performance.batchSize,
          25,
        );
        baseConfig.performance.rateLimitDelay = Math.max(
          baseConfig.performance.rateLimitDelay,
          200,
        );
        baseConfig.debounce.delay = Math.max(baseConfig.debounce.delay, 3000);

        // Disable non-essential monitoring
        baseConfig.monitoring.enableNotifications = false;
        disabledFeatures.push("notifications");
        break;

      case DegradationLevel.MINIMAL:
        // Further reduce performance settings
        baseConfig.performance.batchSize = Math.min(
          baseConfig.performance.batchSize,
          10,
        );
        baseConfig.performance.rateLimitDelay = Math.max(
          baseConfig.performance.rateLimitDelay,
          500,
        );
        baseConfig.debounce.delay = Math.max(baseConfig.debounce.delay, 5000);

        // Disable more features
        baseConfig.monitoring.enableNotifications = false;
        baseConfig.monitoring.enableProgressIndicators = false;
        baseConfig.monitoring.logLevel = "minimal";
        disabledFeatures.push(
          "notifications",
          "progress_indicators",
          "verbose_logging",
        );
        break;

      case DegradationLevel.EMERGENCY:
        // Minimal functionality only
        baseConfig.performance.batchSize = 5;
        baseConfig.performance.rateLimitDelay = 1000;
        baseConfig.debounce.delay = 10000;
        baseConfig.debounce.maxWait = 30000;

        // Disable all non-essential features
        baseConfig.monitoring.enableNotifications = false;
        baseConfig.monitoring.enableProgressIndicators = false;
        baseConfig.monitoring.logLevel = "silent";
        disabledFeatures.push(
          "notifications",
          "progress_indicators",
          "verbose_logging",
          "pattern_expansion",
          "advanced_debouncing",
          "statistics_tracking",
        );
        break;

      default:
        // Normal level - no changes
        break;
    }

    return {
      ...baseConfig,
      degradationLevel: level,
      disabledFeatures,
      reducedLimits: {
        maxWatchedFiles: this.getMaxWatchedFilesForLevel(level),
        maxRetries: this.getMaxRetriesForLevel(level),
        debounceDelay: baseConfig.debounce.delay,
        batchSize: baseConfig.performance.batchSize,
      },
    };
  }

  /**
   * Get feature flags for the specified degradation level
   */
  private getFeatureFlagsForLevel(level: DegradationLevel): FeatureFlags {
    const flags = this.getDefaultFeatureFlags();

    switch (level) {
      case DegradationLevel.REDUCED:
        flags.enableNotifications = false;
        break;

      case DegradationLevel.MINIMAL:
        flags.enableNotifications = false;
        flags.enableProgressIndicators = false;
        flags.enableDetailedLogging = false;
        break;

      case DegradationLevel.EMERGENCY:
        flags.enableNotifications = false;
        flags.enableProgressIndicators = false;
        flags.enableDetailedLogging = false;
        flags.enablePatternExpansion = false;
        flags.enableAdvancedDebouncing = false;
        flags.enableStatisticsTracking = false;
        flags.enablePerformanceMonitoring = false;
        break;

      default:
        // Normal level - all features enabled
        break;
    }

    return flags;
  }

  /**
   * Check if a feature is enabled in the current degradation state
   */
  isFeatureEnabled(feature: keyof FeatureFlags): boolean {
    return this.featureFlags[feature];
  }

  /**
   * Get current degradation level
   */
  getCurrentLevel(): DegradationLevel {
    return this.currentLevel;
  }

  /**
   * Get current degraded configuration
   */
  getDegradedConfiguration(): DegradedConfiguration | null {
    return this.degradedConfig;
  }

  /**
   * Reset to normal operation
   */
  async resetToNormal(): Promise<void> {
    if (this.currentLevel === DegradationLevel.NORMAL) {
      return;
    }

    const previousLevel = this.currentLevel;
    this.currentLevel = DegradationLevel.NORMAL;
    this.degradedConfig = null;
    this.featureFlags = this.getDefaultFeatureFlags();

    // Record recovery event
    this.degradationHistory.push({
      timestamp: new Date(),
      fromLevel: previousLevel,
      toLevel: DegradationLevel.NORMAL,
      reason: "Manual reset to normal operation",
      triggeredBy: "manual",
    });

    console.log("✅ System restored to normal operation");
  }

  /**
   * Get degradation history
   */
  getDegradationHistory(): DegradationEvent[] {
    return [...this.degradationHistory];
  }

  /**
   * Get system health status based on degradation level
   */
  getHealthStatus(): SystemHealthStatus {
    switch (this.currentLevel) {
      case DegradationLevel.NORMAL:
        return { status: "healthy", message: "All systems operational" };
      case DegradationLevel.REDUCED:
        return {
          status: "degraded",
          message: "Operating with reduced functionality",
        };
      case DegradationLevel.MINIMAL:
        return {
          status: "impaired",
          message: "Operating with minimal functionality",
        };
      case DegradationLevel.EMERGENCY:
        return {
          status: "critical",
          message: "Emergency mode - core functionality only",
        };
      default:
        return { status: "unknown", message: "Unknown system state" };
    }
  }

  // Private helper methods

  private getDefaultFeatureFlags(): FeatureFlags {
    return {
      enableProgressIndicators: true,
      enableNotifications: true,
      enableDetailedLogging: true,
      enablePatternExpansion: true,
      enableAdvancedDebouncing: true,
      enableStatisticsTracking: true,
      enablePerformanceMonitoring: true,
    };
  }

  private initializeErrorThresholds(): Map<DegradationLevel, ErrorThreshold> {
    const thresholds = new Map<DegradationLevel, ErrorThreshold>();

    thresholds.set(DegradationLevel.NORMAL, {
      maxCriticalErrors: 0,
      maxHighErrors: 2,
      maxMediumErrors: 5,
      maxLowErrors: 10,
      maxTotalErrors: 15,
      timeWindow: 5 * 60 * 1000, // 5 minutes
    });

    thresholds.set(DegradationLevel.REDUCED, {
      maxCriticalErrors: 1,
      maxHighErrors: 5,
      maxMediumErrors: 10,
      maxLowErrors: 20,
      maxTotalErrors: 30,
      timeWindow: 5 * 60 * 1000,
    });

    thresholds.set(DegradationLevel.MINIMAL, {
      maxCriticalErrors: 2,
      maxHighErrors: 8,
      maxMediumErrors: 15,
      maxLowErrors: 30,
      maxTotalErrors: 50,
      timeWindow: 5 * 60 * 1000,
    });

    thresholds.set(DegradationLevel.EMERGENCY, {
      maxCriticalErrors: 999, // No further degradation
      maxHighErrors: 999,
      maxMediumErrors: 999,
      maxLowErrors: 999,
      maxTotalErrors: 999,
      timeWindow: 5 * 60 * 1000,
    });

    return thresholds;
  }

  private countErrorsBySeverity(errors: RecoverableError[]): ErrorCounts {
    const now = Date.now();
    const timeWindow = 5 * 60 * 1000; // 5 minutes

    // Filter recent errors
    const recentErrors = errors.filter((error) => {
      const errorTime = error.lastRetryAt?.getTime() || 0;
      return now - errorTime < timeWindow;
    });

    return recentErrors.reduce(
      (counts, error) => {
        counts.total++;
        switch (error.severity) {
          case ErrorSeverity.CRITICAL:
            counts.critical++;
            break;
          case ErrorSeverity.HIGH:
            counts.high++;
            break;
          case ErrorSeverity.MEDIUM:
            counts.medium++;
            break;
          case ErrorSeverity.LOW:
            counts.low++;
            break;
        }
        return counts;
      },
      { critical: 0, high: 0, medium: 0, low: 0, total: 0 },
    );
  }

  private shouldDegradeDown(
    errorCounts: ErrorCounts,
    systemMetrics: SystemMetrics,
    threshold: ErrorThreshold,
  ): boolean {
    return (
      errorCounts.critical > threshold.maxCriticalErrors ||
      errorCounts.high > threshold.maxHighErrors ||
      errorCounts.medium > threshold.maxMediumErrors ||
      errorCounts.low > threshold.maxLowErrors ||
      errorCounts.total > threshold.maxTotalErrors ||
      systemMetrics.memoryUsage > 0.9 ||
      systemMetrics.cpuUsage > 0.8
    );
  }

  private shouldRecover(
    errorCounts: ErrorCounts,
    systemMetrics: SystemMetrics,
  ): boolean {
    // Only consider recovery if we're not at normal level
    if (this.currentLevel === DegradationLevel.NORMAL) {
      return false;
    }

    // Get threshold for the level above current
    const targetLevel = this.getPreviousDegradationLevel(this.currentLevel);
    const targetThreshold = this.errorThresholds.get(targetLevel);
    if (!targetThreshold) {
      return false;
    }

    // Check if error counts are well below the target threshold
    const safetyMargin = 0.5; // 50% safety margin
    return (
      errorCounts.critical <=
        targetThreshold.maxCriticalErrors * safetyMargin &&
      errorCounts.high <= targetThreshold.maxHighErrors * safetyMargin &&
      errorCounts.medium <= targetThreshold.maxMediumErrors * safetyMargin &&
      errorCounts.total <= targetThreshold.maxTotalErrors * safetyMargin &&
      systemMetrics.memoryUsage < 0.7 &&
      systemMetrics.cpuUsage < 0.6
    );
  }

  private getNextDegradationLevel(current: DegradationLevel): DegradationLevel {
    switch (current) {
      case DegradationLevel.NORMAL:
        return DegradationLevel.REDUCED;
      case DegradationLevel.REDUCED:
        return DegradationLevel.MINIMAL;
      case DegradationLevel.MINIMAL:
        return DegradationLevel.EMERGENCY;
      default:
        return DegradationLevel.EMERGENCY;
    }
  }

  private getPreviousDegradationLevel(
    current: DegradationLevel,
  ): DegradationLevel {
    switch (current) {
      case DegradationLevel.EMERGENCY:
        return DegradationLevel.MINIMAL;
      case DegradationLevel.MINIMAL:
        return DegradationLevel.REDUCED;
      case DegradationLevel.REDUCED:
        return DegradationLevel.NORMAL;
      default:
        return DegradationLevel.NORMAL;
    }
  }

  private getMaxWatchedFilesForLevel(level: DegradationLevel): number {
    switch (level) {
      case DegradationLevel.NORMAL:
        return 1000;
      case DegradationLevel.REDUCED:
        return 500;
      case DegradationLevel.MINIMAL:
        return 200;
      case DegradationLevel.EMERGENCY:
        return 50;
      default:
        return 1000;
    }
  }

  private getMaxRetriesForLevel(level: DegradationLevel): number {
    switch (level) {
      case DegradationLevel.NORMAL:
        return 5;
      case DegradationLevel.REDUCED:
        return 3;
      case DegradationLevel.MINIMAL:
        return 2;
      case DegradationLevel.EMERGENCY:
        return 1;
      default:
        return 5;
    }
  }

  private logDisabledFeatures(level: DegradationLevel): void {
    const disabledFeatures = this.degradedConfig?.disabledFeatures || [];
    if (disabledFeatures.length > 0) {
      console.warn(`   Disabled features: ${disabledFeatures.join(", ")}`);
    }
  }
}

// Supporting interfaces and types

interface ErrorThreshold {
  maxCriticalErrors: number;
  maxHighErrors: number;
  maxMediumErrors: number;
  maxLowErrors: number;
  maxTotalErrors: number;
  timeWindow: number;
}

interface ErrorCounts {
  critical: number;
  high: number;
  medium: number;
  low: number;
  total: number;
}

interface SystemMetrics {
  memoryUsage: number; // 0-1 (percentage)
  cpuUsage: number; // 0-1 (percentage)
  fileDescriptors: number;
  watchedFiles: number;
}

interface DegradationDecision {
  shouldDegrade: boolean;
  targetLevel: DegradationLevel;
  reason?: string;
}

interface DegradationEvent {
  timestamp: Date;
  fromLevel: DegradationLevel;
  toLevel: DegradationLevel;
  reason: string;
  triggeredBy: "error_threshold" | "manual" | "system_metric";
}

interface SystemHealthStatus {
  status: "healthy" | "degraded" | "impaired" | "critical" | "unknown";
  message: string;
}

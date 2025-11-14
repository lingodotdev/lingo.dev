import { EventEmitter } from "events";
import { WatchError } from "./types";

/**
 * Performance metrics collected by the monitor
 */
export interface PerformanceMetrics {
  memory: MemoryMetrics;
  cpu: CpuMetrics;
  fileSystem: FileSystemMetrics;
  watch: WatchMetrics;
  timestamp: Date;
}

/**
 * Memory usage metrics
 */
export interface MemoryMetrics {
  heapUsed: number;
  heapTotal: number;
  external: number;
  rss: number;
  usagePercentage: number;
  arrayBuffers: number;
}

/**
 * CPU usage metrics
 */
export interface CpuMetrics {
  userTime: number;
  systemTime: number;
  totalTime: number;
  usagePercentage: number;
}

/**
 * File system metrics
 */
export interface FileSystemMetrics {
  watchedFiles: number;
  openFileDescriptors: number;
  fileOperationsPerSecond: number;
  averageFileSize: number;
}

/**
 * Watch-specific metrics
 */
export interface WatchMetrics {
  totalChanges: number;
  changesPerMinute: number;
  averageDebounceTime: number;
  retranslationCount: number;
  averageRetranslationTime: number;
  errorRate: number;
}

/**
 * Performance thresholds for warnings and limits
 */
export interface PerformanceThresholds {
  memory: {
    warningPercentage: number;
    criticalPercentage: number;
    maxHeapSize: number;
  };
  cpu: {
    warningPercentage: number;
    criticalPercentage: number;
    maxSustainedUsage: number;
  };
  fileSystem: {
    maxWatchedFiles: number;
    maxFileDescriptors: number;
    maxFileOperationsPerSecond: number;
  };
  watch: {
    maxChangesPerMinute: number;
    maxErrorRate: number;
    maxRetranslationTime: number;
  };
}

/**
 * Performance alert levels
 */
export enum AlertLevel {
  INFO = "info",
  WARNING = "warning",
  CRITICAL = "critical",
}

/**
 * Performance alert
 */
export interface PerformanceAlert {
  level: AlertLevel;
  category: string;
  message: string;
  metric: string;
  currentValue: number;
  threshold: number;
  timestamp: Date;
  suggestions: string[];
}

/**
 * Resource limits and controls
 */
export interface ResourceLimits {
  maxMemoryUsage: number;
  maxWatchedFiles: number;
  maxConcurrentOperations: number;
  rateLimitDelay: number;
  batchSize: number;
}

/**
 * Performance monitoring and resource management system that tracks system metrics,
 * enforces resource limits, and provides warnings when thresholds are exceeded.
 */
export class PerformanceMonitor extends EventEmitter {
  private metrics: PerformanceMetrics[] = [];
  private thresholds: PerformanceThresholds;
  private resourceLimits: ResourceLimits;
  private isMonitoring: boolean = false;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private lastCpuUsage: NodeJS.CpuUsage | null = null;
  private fileOperationCount: number = 0;
  private lastFileOperationReset: number = Date.now();
  private activeAlerts: Map<string, PerformanceAlert> = new Map();
  private metricsHistory: PerformanceMetrics[] = [];
  private maxHistorySize: number = 1000; // Keep last 1000 metrics

  constructor(
    thresholds?: Partial<PerformanceThresholds>,
    limits?: Partial<ResourceLimits>,
  ) {
    super();
    this.thresholds = this.mergeWithDefaultThresholds(thresholds || {});
    this.resourceLimits = this.mergeWithDefaultLimits(limits || {});
  }

  /**
   * Start performance monitoring
   */
  startMonitoring(intervalMs: number = 5000): void {
    if (this.isMonitoring) {
      return;
    }

    this.isMonitoring = true;
    this.lastCpuUsage = process.cpuUsage();

    this.monitoringInterval = setInterval(() => {
      this.collectMetrics();
    }, intervalMs);

    console.log(
      `📊 Performance monitoring started (interval: ${intervalMs}ms)`,
    );
  }

  /**
   * Stop performance monitoring
   */
  stopMonitoring(): void {
    if (!this.isMonitoring) {
      return;
    }

    this.isMonitoring = false;

    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    console.log("📊 Performance monitoring stopped");
  }

  /**
   * Collect current performance metrics
   */
  private collectMetrics(): void {
    const metrics: PerformanceMetrics = {
      memory: this.collectMemoryMetrics(),
      cpu: this.collectCpuMetrics(),
      fileSystem: this.collectFileSystemMetrics(),
      watch: this.collectWatchMetrics(),
      timestamp: new Date(),
    };

    this.metricsHistory.push(metrics);

    // Limit history size
    if (this.metricsHistory.length > this.maxHistorySize) {
      this.metricsHistory = this.metricsHistory.slice(-this.maxHistorySize);
    }

    // Check thresholds and generate alerts
    this.checkThresholds(metrics);

    // Emit metrics event
    this.emit("metrics", metrics);
  }

  /**
   * Collect memory metrics
   */
  private collectMemoryMetrics(): MemoryMetrics {
    const memUsage = process.memoryUsage();
    const totalMemory = memUsage.heapTotal + memUsage.external;
    const usedMemory = memUsage.heapUsed;

    return {
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      external: memUsage.external,
      rss: memUsage.rss,
      usagePercentage: totalMemory > 0 ? (usedMemory / totalMemory) * 100 : 0,
      arrayBuffers: memUsage.arrayBuffers || 0,
    };
  }

  /**
   * Collect CPU metrics
   */
  private collectCpuMetrics(): CpuMetrics {
    const currentUsage = process.cpuUsage(this.lastCpuUsage || undefined);
    this.lastCpuUsage = process.cpuUsage();

    const totalTime = currentUsage.user + currentUsage.system;
    const usagePercentage = totalTime > 0 ? (totalTime / 1000000) * 100 : 0; // Convert microseconds to percentage

    return {
      userTime: currentUsage.user,
      systemTime: currentUsage.system,
      totalTime,
      usagePercentage: Math.min(usagePercentage, 100), // Cap at 100%
    };
  }

  /**
   * Collect file system metrics
   */
  private collectFileSystemMetrics(): FileSystemMetrics {
    const now = Date.now();
    const timeSinceReset = now - this.lastFileOperationReset;
    const fileOperationsPerSecond =
      timeSinceReset > 0
        ? (this.fileOperationCount / timeSinceReset) * 1000
        : 0;

    // Reset file operation counter every minute
    if (timeSinceReset > 60000) {
      this.fileOperationCount = 0;
      this.lastFileOperationReset = now;
    }

    return {
      watchedFiles: 0, // Will be updated by external components
      openFileDescriptors: this.getOpenFileDescriptorCount(),
      fileOperationsPerSecond,
      averageFileSize: 0, // Placeholder - would need actual file size tracking
    };
  }

  /**
   * Collect watch-specific metrics
   */
  private collectWatchMetrics(): WatchMetrics {
    // These metrics would be updated by the watch system
    // For now, return default values
    return {
      totalChanges: 0,
      changesPerMinute: 0,
      averageDebounceTime: 0,
      retranslationCount: 0,
      averageRetranslationTime: 0,
      errorRate: 0,
    };
  }

  /**
   * Get approximate open file descriptor count
   */
  private getOpenFileDescriptorCount(): number {
    try {
      // This is a rough approximation - actual implementation would vary by OS
      return process.getuid ? process.getuid() : 0;
    } catch {
      return 0;
    }
  }

  /**
   * Check performance thresholds and generate alerts
   */
  private checkThresholds(metrics: PerformanceMetrics): void {
    this.checkMemoryThresholds(metrics.memory);
    this.checkCpuThresholds(metrics.cpu);
    this.checkFileSystemThresholds(metrics.fileSystem);
    this.checkWatchThresholds(metrics.watch);
  }

  /**
   * Check memory thresholds
   */
  private checkMemoryThresholds(memory: MemoryMetrics): void {
    const { warningPercentage, criticalPercentage, maxHeapSize } =
      this.thresholds.memory;

    if (memory.usagePercentage >= criticalPercentage) {
      this.generateAlert({
        level: AlertLevel.CRITICAL,
        category: "memory",
        message: `Critical memory usage: ${memory.usagePercentage.toFixed(1)}%`,
        metric: "memory.usagePercentage",
        currentValue: memory.usagePercentage,
        threshold: criticalPercentage,
        timestamp: new Date(),
        suggestions: [
          "Consider reducing batch size",
          "Limit number of watched files",
          "Restart the watch process",
          "Check for memory leaks",
        ],
      });
    } else if (memory.usagePercentage >= warningPercentage) {
      this.generateAlert({
        level: AlertLevel.WARNING,
        category: "memory",
        message: `High memory usage: ${memory.usagePercentage.toFixed(1)}%`,
        metric: "memory.usagePercentage",
        currentValue: memory.usagePercentage,
        threshold: warningPercentage,
        timestamp: new Date(),
        suggestions: [
          "Monitor memory usage closely",
          "Consider reducing batch size",
        ],
      });
    }

    if (memory.heapUsed >= maxHeapSize) {
      this.generateAlert({
        level: AlertLevel.CRITICAL,
        category: "memory",
        message: `Heap size limit exceeded: ${(memory.heapUsed / 1024 / 1024).toFixed(1)}MB`,
        metric: "memory.heapUsed",
        currentValue: memory.heapUsed,
        threshold: maxHeapSize,
        timestamp: new Date(),
        suggestions: [
          "Increase heap size limit",
          "Reduce memory usage",
          "Restart the process",
        ],
      });
    }
  }

  /**
   * Check CPU thresholds
   */
  private checkCpuThresholds(cpu: CpuMetrics): void {
    const { warningPercentage, criticalPercentage } = this.thresholds.cpu;

    if (cpu.usagePercentage >= criticalPercentage) {
      this.generateAlert({
        level: AlertLevel.CRITICAL,
        category: "cpu",
        message: `Critical CPU usage: ${cpu.usagePercentage.toFixed(1)}%`,
        metric: "cpu.usagePercentage",
        currentValue: cpu.usagePercentage,
        threshold: criticalPercentage,
        timestamp: new Date(),
        suggestions: [
          "Reduce file watching frequency",
          "Increase debounce delays",
          "Limit concurrent operations",
        ],
      });
    } else if (cpu.usagePercentage >= warningPercentage) {
      this.generateAlert({
        level: AlertLevel.WARNING,
        category: "cpu",
        message: `High CPU usage: ${cpu.usagePercentage.toFixed(1)}%`,
        metric: "cpu.usagePercentage",
        currentValue: cpu.usagePercentage,
        threshold: warningPercentage,
        timestamp: new Date(),
        suggestions: ["Monitor CPU usage", "Consider optimizing file patterns"],
      });
    }
  }

  /**
   * Check file system thresholds
   */
  private checkFileSystemThresholds(fileSystem: FileSystemMetrics): void {
    const { maxWatchedFiles, maxFileDescriptors, maxFileOperationsPerSecond } =
      this.thresholds.fileSystem;

    if (fileSystem.watchedFiles >= maxWatchedFiles) {
      this.generateAlert({
        level: AlertLevel.WARNING,
        category: "filesystem",
        message: `Too many watched files: ${fileSystem.watchedFiles}`,
        metric: "fileSystem.watchedFiles",
        currentValue: fileSystem.watchedFiles,
        threshold: maxWatchedFiles,
        timestamp: new Date(),
        suggestions: [
          "Reduce file patterns scope",
          "Use more specific include/exclude patterns",
          "Consider splitting into multiple watch processes",
        ],
      });
    }

    if (fileSystem.fileOperationsPerSecond >= maxFileOperationsPerSecond) {
      this.generateAlert({
        level: AlertLevel.WARNING,
        category: "filesystem",
        message: `High file operation rate: ${fileSystem.fileOperationsPerSecond.toFixed(1)}/sec`,
        metric: "fileSystem.fileOperationsPerSecond",
        currentValue: fileSystem.fileOperationsPerSecond,
        threshold: maxFileOperationsPerSecond,
        timestamp: new Date(),
        suggestions: [
          "Increase debounce delay",
          "Implement rate limiting",
          "Check for file system loops",
        ],
      });
    }
  }

  /**
   * Check watch-specific thresholds
   */
  private checkWatchThresholds(watch: WatchMetrics): void {
    const { maxChangesPerMinute, maxErrorRate, maxRetranslationTime } =
      this.thresholds.watch;

    if (watch.changesPerMinute >= maxChangesPerMinute) {
      this.generateAlert({
        level: AlertLevel.WARNING,
        category: "watch",
        message: `High change rate: ${watch.changesPerMinute} changes/min`,
        metric: "watch.changesPerMinute",
        currentValue: watch.changesPerMinute,
        threshold: maxChangesPerMinute,
        timestamp: new Date(),
        suggestions: [
          "Increase debounce delay",
          "Check for file system loops",
          "Review file patterns",
        ],
      });
    }

    if (watch.errorRate >= maxErrorRate) {
      this.generateAlert({
        level: AlertLevel.CRITICAL,
        category: "watch",
        message: `High error rate: ${(watch.errorRate * 100).toFixed(1)}%`,
        metric: "watch.errorRate",
        currentValue: watch.errorRate,
        threshold: maxErrorRate,
        timestamp: new Date(),
        suggestions: [
          "Check system resources",
          "Review error logs",
          "Consider system degradation",
        ],
      });
    }

    if (watch.averageRetranslationTime >= maxRetranslationTime) {
      this.generateAlert({
        level: AlertLevel.WARNING,
        category: "watch",
        message: `Slow retranslation: ${watch.averageRetranslationTime}ms average`,
        metric: "watch.averageRetranslationTime",
        currentValue: watch.averageRetranslationTime,
        threshold: maxRetranslationTime,
        timestamp: new Date(),
        suggestions: [
          "Optimize translation pipeline",
          "Reduce batch size",
          "Check API performance",
        ],
      });
    }
  }

  /**
   * Generate and emit a performance alert
   */
  private generateAlert(alert: PerformanceAlert): void {
    const alertKey = `${alert.category}:${alert.metric}`;

    // Avoid duplicate alerts for the same issue
    const existingAlert = this.activeAlerts.get(alertKey);
    if (existingAlert && existingAlert.level === alert.level) {
      return;
    }

    this.activeAlerts.set(alertKey, alert);
    this.emit("alert", alert);

    // Log alert
    const levelColor =
      alert.level === AlertLevel.CRITICAL
        ? "\x1b[31m"
        : alert.level === AlertLevel.WARNING
          ? "\x1b[33m"
          : "\x1b[36m";
    console.log(
      `${levelColor}⚠️  [${alert.level.toUpperCase()}] ${alert.message}\x1b[0m`,
    );

    if (alert.suggestions.length > 0) {
      console.log(`   Suggestions: ${alert.suggestions.join(", ")}`);
    }
  }

  /**
   * Update watch metrics from external components
   */
  updateWatchMetrics(metrics: Partial<WatchMetrics>): void {
    if (this.metricsHistory.length > 0) {
      const latest = this.metricsHistory[this.metricsHistory.length - 1];
      latest.watch = { ...latest.watch, ...metrics };
    }
  }

  /**
   * Update file system metrics from external components
   */
  updateFileSystemMetrics(metrics: Partial<FileSystemMetrics>): void {
    if (this.metricsHistory.length > 0) {
      const latest = this.metricsHistory[this.metricsHistory.length - 1];
      latest.fileSystem = { ...latest.fileSystem, ...metrics };
    }
  }

  /**
   * Record a file operation for rate tracking
   */
  recordFileOperation(): void {
    this.fileOperationCount++;
  }

  /**
   * Get current performance metrics
   */
  getCurrentMetrics(): PerformanceMetrics | null {
    return this.metricsHistory.length > 0
      ? this.metricsHistory[this.metricsHistory.length - 1]
      : null;
  }

  /**
   * Get metrics history
   */
  getMetricsHistory(limit?: number): PerformanceMetrics[] {
    if (limit) {
      return this.metricsHistory.slice(-limit);
    }
    return [...this.metricsHistory];
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): PerformanceAlert[] {
    return Array.from(this.activeAlerts.values());
  }

  /**
   * Clear an active alert
   */
  clearAlert(category: string, metric: string): void {
    const alertKey = `${category}:${metric}`;
    this.activeAlerts.delete(alertKey);
  }

  /**
   * Clear all active alerts
   */
  clearAllAlerts(): void {
    this.activeAlerts.clear();
  }

  /**
   * Check if resource limits are exceeded
   */
  checkResourceLimits(): { exceeded: boolean; violations: string[] } {
    const violations: string[] = [];
    const currentMetrics = this.getCurrentMetrics();

    if (!currentMetrics) {
      return { exceeded: false, violations };
    }

    if (
      currentMetrics.memory.usagePercentage >
      this.resourceLimits.maxMemoryUsage * 100
    ) {
      violations.push(
        `Memory usage (${currentMetrics.memory.usagePercentage.toFixed(1)}%) exceeds limit (${(this.resourceLimits.maxMemoryUsage * 100).toFixed(1)}%)`,
      );
    }

    if (
      currentMetrics.fileSystem.watchedFiles >
      this.resourceLimits.maxWatchedFiles
    ) {
      violations.push(
        `Watched files (${currentMetrics.fileSystem.watchedFiles}) exceeds limit (${this.resourceLimits.maxWatchedFiles})`,
      );
    }

    return {
      exceeded: violations.length > 0,
      violations,
    };
  }

  /**
   * Get resource limits
   */
  getResourceLimits(): ResourceLimits {
    return { ...this.resourceLimits };
  }

  /**
   * Update resource limits
   */
  updateResourceLimits(limits: Partial<ResourceLimits>): void {
    this.resourceLimits = { ...this.resourceLimits, ...limits };
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary(): {
    current: PerformanceMetrics | null;
    alerts: number;
    resourceViolations: string[];
    uptime: number;
  } {
    const resourceCheck = this.checkResourceLimits();
    const startTime =
      this.metricsHistory.length > 0
        ? this.metricsHistory[0].timestamp.getTime()
        : Date.now();

    return {
      current: this.getCurrentMetrics(),
      alerts: this.activeAlerts.size,
      resourceViolations: resourceCheck.violations,
      uptime: Date.now() - startTime,
    };
  }

  // Private helper methods

  private mergeWithDefaultThresholds(
    thresholds: Partial<PerformanceThresholds>,
  ): PerformanceThresholds {
    return {
      memory: {
        warningPercentage: 70,
        criticalPercentage: 90,
        maxHeapSize: 1024 * 1024 * 1024, // 1GB
        ...thresholds.memory,
      },
      cpu: {
        warningPercentage: 70,
        criticalPercentage: 90,
        maxSustainedUsage: 80,
        ...thresholds.cpu,
      },
      fileSystem: {
        maxWatchedFiles: 1000,
        maxFileDescriptors: 1024,
        maxFileOperationsPerSecond: 100,
        ...thresholds.fileSystem,
      },
      watch: {
        maxChangesPerMinute: 100,
        maxErrorRate: 0.1, // 10%
        maxRetranslationTime: 30000, // 30 seconds
        ...thresholds.watch,
      },
    };
  }

  private mergeWithDefaultLimits(
    limits: Partial<ResourceLimits>,
  ): ResourceLimits {
    return {
      maxMemoryUsage: 0.8, // 80%
      maxWatchedFiles: 1000,
      maxConcurrentOperations: 10,
      rateLimitDelay: 100,
      batchSize: 50,
      ...limits,
    };
  }
}

import { EventEmitter } from "events";
import { ResourceLimits, PerformanceMetrics } from "./performance-monitor";

/**
 * Resource usage tracking
 */
export interface ResourceUsage {
  activeOperations: number;
  queuedOperations: number;
  totalOperations: number;
  memoryUsage: number;
  fileHandles: number;
  lastOperationTime: Date;
}

/**
 * Rate limiting configuration
 */
export interface RateLimitConfig {
  maxOperationsPerSecond: number;
  maxOperationsPerMinute: number;
  burstLimit: number;
  windowSizeMs: number;
}

/**
 * Operation queue item
 */
interface QueuedOperation {
  id: string;
  operation: () => Promise<any>;
  priority: number;
  timestamp: Date;
  resolve: (value: any) => void;
  reject: (error: any) => void;
}

/**
 * Resource manager that handles rate limiting, operation queuing,
 * and resource usage monitoring for the watch system.
 */
export class ResourceManager extends EventEmitter {
  private resourceLimits: ResourceLimits;
  private rateLimitConfig: RateLimitConfig;
  private resourceUsage: ResourceUsage;
  private operationQueue: QueuedOperation[] = [];
  private activeOperations = new Set<string>();
  private operationHistory: Date[] = [];
  private isProcessingQueue: boolean = false;
  private queueProcessor: NodeJS.Timeout | null = null;
  private operationCounter: number = 0;

  constructor(
    limits: ResourceLimits,
    rateLimitConfig?: Partial<RateLimitConfig>,
  ) {
    super();
    this.resourceLimits = limits;
    this.rateLimitConfig = this.mergeWithDefaultRateLimit(
      rateLimitConfig || {},
    );
    this.resourceUsage = {
      activeOperations: 0,
      queuedOperations: 0,
      totalOperations: 0,
      memoryUsage: 0,
      fileHandles: 0,
      lastOperationTime: new Date(),
    };

    this.startQueueProcessor();
  }

  /**
   * Execute an operation with resource management and rate limiting
   */
  async executeOperation<T>(
    operation: () => Promise<T>,
    priority: number = 0,
  ): Promise<T> {
    // Check if we can execute immediately
    if (this.canExecuteImmediately()) {
      return await this.executeImmediately(operation);
    }

    // Queue the operation
    return await this.queueOperation(operation, priority);
  }

  /**
   * Execute a batch of operations with resource management
   */
  async executeBatch<T>(
    operations: (() => Promise<T>)[],
    batchSize?: number,
  ): Promise<T[]> {
    const effectiveBatchSize = batchSize || this.resourceLimits.batchSize;
    const results: T[] = [];

    for (let i = 0; i < operations.length; i += effectiveBatchSize) {
      const batch = operations.slice(i, i + effectiveBatchSize);
      const batchPromises = batch.map((op) => this.executeOperation(op));

      try {
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);

        // Add delay between batches if configured
        if (
          i + effectiveBatchSize < operations.length &&
          this.resourceLimits.rateLimitDelay > 0
        ) {
          await this.delay(this.resourceLimits.rateLimitDelay);
        }
      } catch (error) {
        console.error(
          `Batch execution failed at batch starting at index ${i}:`,
          error,
        );
        throw error;
      }
    }

    return results;
  }

  /**
   * Check if an operation can be executed immediately
   */
  private canExecuteImmediately(): boolean {
    // Check active operation limits
    if (
      this.activeOperations.size >= this.resourceLimits.maxConcurrentOperations
    ) {
      return false;
    }

    // Check rate limits
    if (!this.isWithinRateLimit()) {
      return false;
    }

    // Check resource usage
    if (this.resourceUsage.memoryUsage > this.resourceLimits.maxMemoryUsage) {
      return false;
    }

    return true;
  }

  /**
   * Execute an operation immediately
   */
  private async executeImmediately<T>(operation: () => Promise<T>): Promise<T> {
    const operationId = this.generateOperationId();

    try {
      this.startOperation(operationId);
      const result = await operation();
      this.completeOperation(operationId, true);
      return result;
    } catch (error) {
      this.completeOperation(operationId, false);
      throw error;
    }
  }

  /**
   * Queue an operation for later execution
   */
  private async queueOperation<T>(
    operation: () => Promise<T>,
    priority: number,
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const queuedOperation: QueuedOperation = {
        id: this.generateOperationId(),
        operation,
        priority,
        timestamp: new Date(),
        resolve,
        reject,
      };

      // Insert operation in priority order (higher priority first)
      const insertIndex = this.operationQueue.findIndex(
        (op) => op.priority < priority,
      );

      if (insertIndex === -1) {
        this.operationQueue.push(queuedOperation);
      } else {
        this.operationQueue.splice(insertIndex, 0, queuedOperation);
      }

      this.resourceUsage.queuedOperations = this.operationQueue.length;
      this.emit("operationQueued", {
        operationId: queuedOperation.id,
        queueSize: this.operationQueue.length,
        priority,
      });
    });
  }

  /**
   * Start the queue processor
   */
  private startQueueProcessor(): void {
    if (this.queueProcessor) {
      return;
    }

    this.queueProcessor = setInterval(() => {
      this.processQueue();
    }, 100); // Process queue every 100ms
  }

  /**
   * Process queued operations
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.operationQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    try {
      while (this.operationQueue.length > 0 && this.canExecuteImmediately()) {
        const queuedOperation = this.operationQueue.shift();
        if (!queuedOperation) {
          break;
        }

        this.resourceUsage.queuedOperations = this.operationQueue.length;

        try {
          this.startOperation(queuedOperation.id);
          const result = await queuedOperation.operation();
          this.completeOperation(queuedOperation.id, true);
          queuedOperation.resolve(result);
        } catch (error) {
          this.completeOperation(queuedOperation.id, false);
          queuedOperation.reject(error);
        }
      }
    } finally {
      this.isProcessingQueue = false;
    }
  }

  /**
   * Start tracking an operation
   */
  private startOperation(operationId: string): void {
    this.activeOperations.add(operationId);
    this.resourceUsage.activeOperations = this.activeOperations.size;
    this.resourceUsage.totalOperations++;
    this.resourceUsage.lastOperationTime = new Date();

    // Add to operation history for rate limiting
    this.operationHistory.push(new Date());
    this.cleanupOperationHistory();

    this.emit("operationStarted", {
      operationId,
      activeOperations: this.activeOperations.size,
      totalOperations: this.resourceUsage.totalOperations,
    });
  }

  /**
   * Complete an operation
   */
  private completeOperation(operationId: string, success: boolean): void {
    this.activeOperations.delete(operationId);
    this.resourceUsage.activeOperations = this.activeOperations.size;

    this.emit("operationCompleted", {
      operationId,
      success,
      activeOperations: this.activeOperations.size,
    });
  }

  /**
   * Check if current operations are within rate limits
   */
  private isWithinRateLimit(): boolean {
    const now = Date.now();
    const windowStart = now - this.rateLimitConfig.windowSizeMs;

    // Count operations in the current window
    const operationsInWindow = this.operationHistory.filter(
      (timestamp) => timestamp.getTime() > windowStart,
    ).length;

    // Check per-second limit
    const perSecondLimit = this.rateLimitConfig.maxOperationsPerSecond;
    const operationsInLastSecond = this.operationHistory.filter(
      (timestamp) => timestamp.getTime() > now - 1000,
    ).length;

    if (operationsInLastSecond >= perSecondLimit) {
      return false;
    }

    // Check per-minute limit
    const perMinuteLimit = this.rateLimitConfig.maxOperationsPerMinute;
    const operationsInLastMinute = this.operationHistory.filter(
      (timestamp) => timestamp.getTime() > now - 60000,
    ).length;

    if (operationsInLastMinute >= perMinuteLimit) {
      return false;
    }

    // Check burst limit
    if (operationsInWindow >= this.rateLimitConfig.burstLimit) {
      return false;
    }

    return true;
  }

  /**
   * Clean up old operation history entries
   */
  private cleanupOperationHistory(): void {
    const cutoff =
      Date.now() -
      Math.max(
        this.rateLimitConfig.windowSizeMs,
        60000, // Keep at least 1 minute of history
      );

    this.operationHistory = this.operationHistory.filter(
      (timestamp) => timestamp.getTime() > cutoff,
    );
  }

  /**
   * Generate a unique operation ID
   */
  private generateOperationId(): string {
    return `op_${++this.operationCounter}_${Date.now()}`;
  }

  /**
   * Update resource usage from performance metrics
   */
  updateResourceUsage(metrics: PerformanceMetrics): void {
    this.resourceUsage.memoryUsage = metrics.memory.usagePercentage / 100;
    this.resourceUsage.fileHandles = metrics.fileSystem.openFileDescriptors;

    this.emit("resourceUsageUpdated", this.resourceUsage);
  }

  /**
   * Get current resource usage
   */
  getResourceUsage(): ResourceUsage {
    return { ...this.resourceUsage };
  }

  /**
   * Get queue statistics
   */
  getQueueStatistics(): {
    queueSize: number;
    activeOperations: number;
    totalOperations: number;
    averageQueueTime: number;
    operationsPerSecond: number;
  } {
    const now = Date.now();
    const recentOperations = this.operationHistory.filter(
      (timestamp) => timestamp.getTime() > now - 1000,
    );

    // Calculate average queue time (simplified)
    const averageQueueTime =
      this.operationQueue.length > 0
        ? this.operationQueue.reduce(
            (sum, op) => sum + (now - op.timestamp.getTime()),
            0,
          ) / this.operationQueue.length
        : 0;

    return {
      queueSize: this.operationQueue.length,
      activeOperations: this.activeOperations.size,
      totalOperations: this.resourceUsage.totalOperations,
      averageQueueTime,
      operationsPerSecond: recentOperations.length,
    };
  }

  /**
   * Clear the operation queue
   */
  clearQueue(): void {
    // Reject all queued operations
    for (const queuedOperation of this.operationQueue) {
      queuedOperation.reject(new Error("Operation queue cleared"));
    }

    this.operationQueue = [];
    this.resourceUsage.queuedOperations = 0;

    this.emit("queueCleared");
  }

  /**
   * Update resource limits
   */
  updateResourceLimits(limits: Partial<ResourceLimits>): void {
    this.resourceLimits = { ...this.resourceLimits, ...limits };
    this.emit("resourceLimitsUpdated", this.resourceLimits);
  }

  /**
   * Update rate limit configuration
   */
  updateRateLimitConfig(config: Partial<RateLimitConfig>): void {
    this.rateLimitConfig = { ...this.rateLimitConfig, ...config };
    this.emit("rateLimitConfigUpdated", this.rateLimitConfig);
  }

  /**
   * Get current resource limits
   */
  getResourceLimits(): ResourceLimits {
    return { ...this.resourceLimits };
  }

  /**
   * Get current rate limit configuration
   */
  getRateLimitConfig(): RateLimitConfig {
    return { ...this.rateLimitConfig };
  }

  /**
   * Check if the system is under resource pressure
   */
  isUnderResourcePressure(): boolean {
    return (
      this.resourceUsage.memoryUsage >
        this.resourceLimits.maxMemoryUsage * 0.8 ||
      this.activeOperations.size >=
        this.resourceLimits.maxConcurrentOperations * 0.8 ||
      this.operationQueue.length > 50 ||
      !this.isWithinRateLimit()
    );
  }

  /**
   * Force garbage collection if available
   */
  forceGarbageCollection(): void {
    if (global.gc) {
      global.gc();
      this.emit("garbageCollectionForced");
    }
  }

  /**
   * Shutdown the resource manager
   */
  shutdown(): void {
    if (this.queueProcessor) {
      clearInterval(this.queueProcessor);
      this.queueProcessor = null;
    }

    this.clearQueue();
    this.activeOperations.clear();
    this.operationHistory = [];

    this.emit("shutdown");
  }

  // Private helper methods

  private mergeWithDefaultRateLimit(
    config: Partial<RateLimitConfig>,
  ): RateLimitConfig {
    return {
      maxOperationsPerSecond: 10,
      maxOperationsPerMinute: 300,
      burstLimit: 20,
      windowSizeMs: 5000, // 5 seconds
      ...config,
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

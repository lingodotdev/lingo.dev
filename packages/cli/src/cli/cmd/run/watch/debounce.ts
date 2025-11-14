import {
  DebounceController as IDebounceController,
  FileChangeEvent,
  DebounceStrategy,
} from "./types";

/**
 * DebounceController implements configurable debouncing strategies to prevent
 * excessive retranslation during rapid file changes.
 */
export class DebounceController implements IDebounceController {
  private strategy: DebounceStrategy;
  private pendingTimer: ReturnType<typeof setTimeout> | null = null;
  private pendingChanges: FileChangeEvent[] = [];
  private retranslationCallback:
    | ((changes: FileChangeEvent[]) => Promise<void>)
    | null = null;
  private lastExecutionTime: number = 0;
  private timerStartTime: number = 0;
  private changeFrequencyWindow: number[] = [];
  private readonly FREQUENCY_WINDOW_SIZE = 10;
  private rateLimitQueue: FileChangeEvent[] = [];
  private isProcessingQueue: boolean = false;

  constructor(strategy: DebounceStrategy) {
    this.strategy = strategy;
  }

  /**
   * Schedule retranslation with debouncing based on the configured strategy
   */
  scheduleRetranslation(changes: FileChangeEvent[]): void {
    // Apply rate limiting if configured
    if (this.strategy.type === "batch" && this.strategy.rateLimitDelay) {
      this.addToRateLimitQueue(changes);
      return;
    }

    // Track change frequency for adaptive strategy
    this.trackChangeFrequency(changes.length);

    // Deduplicate changes by path, keeping the latest change for each file
    const deduplicatedChanges = this.deduplicateChanges(changes);
    this.pendingChanges.push(...deduplicatedChanges);

    // Cancel existing timer
    if (this.pendingTimer) {
      clearTimeout(this.pendingTimer);
      this.pendingTimer = null;
    }

    // Apply debouncing strategy
    switch (this.strategy.type) {
      case "simple":
        this.scheduleSimpleDebounce();
        break;
      case "adaptive":
        this.scheduleAdaptiveDebounce();
        break;
      case "batch":
        this.scheduleBatchDebounce();
        break;
      default:
        this.scheduleSimpleDebounce();
    }
  }

  /**
   * Cancel any pending retranslation
   */
  cancelPending(): void {
    if (this.pendingTimer) {
      clearTimeout(this.pendingTimer);
      this.pendingTimer = null;
    }
    this.pendingChanges = [];
  }

  /**
   * Check if retranslation is currently pending
   */
  isRetranslationPending(): boolean {
    return this.pendingTimer !== null;
  }

  /**
   * Get time until next execution in milliseconds
   */
  getTimeUntilExecution(): number {
    if (!this.pendingTimer || this.timerStartTime === 0) {
      return 0;
    }

    const elapsed = Date.now() - this.timerStartTime;
    const remaining = this.strategy.delay - elapsed;
    return Math.max(0, remaining);
  }

  /**
   * Set the callback function to execute when debounce timer fires
   */
  setRetranslationCallback(
    callback: (changes: FileChangeEvent[]) => Promise<void>,
  ): void {
    this.retranslationCallback = callback;
  }

  /**
   * Update debouncing strategy
   */
  updateStrategy(strategy: DebounceStrategy): void {
    this.strategy = strategy;

    // If there's a pending operation, reschedule with new strategy
    if (this.pendingTimer && this.pendingChanges.length > 0) {
      const changes = [...this.pendingChanges];
      this.cancelPending();
      this.scheduleRetranslation(changes);
    }
  }

  /**
   * Simple debouncing - fixed delay after last change
   */
  private scheduleSimpleDebounce(): void {
    this.timerStartTime = Date.now();
    this.pendingTimer = setTimeout(async () => {
      await this.executeRetranslation();
    }, this.strategy.delay);
  }

  /**
   * Adaptive debouncing - adjusts delay based on change frequency
   */
  private scheduleAdaptiveDebounce(): void {
    const now = Date.now();
    const timeSinceLastExecution = now - this.lastExecutionTime;
    const changeFrequency = this.getAverageChangeFrequency();

    // Calculate adaptive delay based on change frequency and time since last execution
    let adaptiveDelay = this.strategy.delay;

    // If changes are happening frequently, increase delay
    if (
      changeFrequency > 5 ||
      timeSinceLastExecution < this.strategy.delay * 2
    ) {
      const multiplier = Math.min(changeFrequency / 5, 3); // Cap at 3x delay
      adaptiveDelay = Math.min(
        this.strategy.delay * (1 + multiplier),
        this.strategy.maxWait || this.strategy.delay * 4,
      );
    }

    // If it's been a while since last execution, reduce delay for responsiveness
    if (timeSinceLastExecution > this.strategy.delay * 5) {
      adaptiveDelay = Math.max(this.strategy.delay * 0.5, 100); // Minimum 100ms
    }

    this.timerStartTime = Date.now();
    this.pendingTimer = setTimeout(async () => {
      await this.executeRetranslation();
    }, adaptiveDelay);
  }

  /**
   * Batch debouncing - waits for batch size or max wait time
   */
  private scheduleBatchDebounce(): void {
    const batchSize = this.strategy.batchSize || 10;
    const maxWait = this.strategy.maxWait || this.strategy.delay * 6;

    // Execute immediately if batch size reached
    if (this.pendingChanges.length >= batchSize) {
      this.executeRetranslation();
      return;
    }

    // Otherwise wait for more changes or max wait time
    this.timerStartTime = Date.now();
    this.pendingTimer = setTimeout(
      async () => {
        await this.executeRetranslation();
      },
      Math.min(this.strategy.delay, maxWait),
    );
  }

  /**
   * Execute the retranslation callback with pending changes
   */
  private async executeRetranslation(): Promise<void> {
    if (!this.retranslationCallback || this.pendingChanges.length === 0) {
      this.pendingTimer = null;
      return;
    }

    const changes = [...this.pendingChanges];
    this.pendingChanges = [];
    this.pendingTimer = null;
    this.lastExecutionTime = Date.now();

    try {
      await this.retranslationCallback(changes);
    } catch (error) {
      // TODO: Handle retranslation errors
      // Should probably emit error event or call error handler
      console.error("Retranslation failed:", error);
    }
  }

  /**
   * Get statistics about debouncing performance
   */
  getStatistics(): {
    pendingChanges: number;
    isActive: boolean;
    strategy: string;
    lastExecutionTime: number;
  } {
    return {
      pendingChanges: this.pendingChanges.length,
      isActive: this.pendingTimer !== null,
      strategy: this.strategy.type,
      lastExecutionTime: this.lastExecutionTime,
    };
  }

  /**
   * Add changes to rate limit queue for batch processing
   */
  private addToRateLimitQueue(changes: FileChangeEvent[]): void {
    this.rateLimitQueue.push(...changes);

    if (!this.isProcessingQueue) {
      this.processRateLimitQueue();
    }
  }

  /**
   * Process rate limit queue with configured delay
   */
  private async processRateLimitQueue(): Promise<void> {
    if (this.isProcessingQueue || this.rateLimitQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;
    const rateLimitDelay = this.strategy.rateLimitDelay || 100;

    while (this.rateLimitQueue.length > 0) {
      // Take a batch of changes from the queue
      const batchSize = Math.min(
        this.strategy.batchSize || 10,
        this.rateLimitQueue.length,
      );
      const batch = this.rateLimitQueue.splice(0, batchSize);

      // Process this batch normally
      this.trackChangeFrequency(batch.length);
      const deduplicatedChanges = this.deduplicateChanges(batch);
      this.pendingChanges.push(...deduplicatedChanges);

      // Apply debouncing for this batch
      if (this.pendingTimer) {
        clearTimeout(this.pendingTimer);
        this.pendingTimer = null;
      }
      this.scheduleBatchDebounce();

      // Wait for rate limit delay before processing next batch
      if (this.rateLimitQueue.length > 0) {
        await new Promise((resolve) => setTimeout(resolve, rateLimitDelay));
      }
    }

    this.isProcessingQueue = false;
  }

  /**
   * Track change frequency for adaptive debouncing
   */
  private trackChangeFrequency(changeCount: number): void {
    const now = Date.now();
    this.changeFrequencyWindow.push(now);

    // Keep only recent changes within the window
    const windowDuration = 5000; // 5 seconds
    const cutoff = now - windowDuration;
    this.changeFrequencyWindow = this.changeFrequencyWindow.filter(
      (timestamp) => timestamp > cutoff,
    );

    // Limit window size to prevent memory growth
    if (this.changeFrequencyWindow.length > this.FREQUENCY_WINDOW_SIZE) {
      this.changeFrequencyWindow = this.changeFrequencyWindow.slice(
        -this.FREQUENCY_WINDOW_SIZE,
      );
    }
  }

  /**
   * Get average change frequency over the recent window
   */
  private getAverageChangeFrequency(): number {
    if (this.changeFrequencyWindow.length < 2) {
      return 0;
    }

    const windowDuration = 5000; // 5 seconds
    const changesPerSecond =
      this.changeFrequencyWindow.length / (windowDuration / 1000);
    return changesPerSecond;
  }

  /**
   * Deduplicate changes by path, keeping the latest change for each file
   */
  private deduplicateChanges(changes: FileChangeEvent[]): FileChangeEvent[] {
    const changeMap = new Map<string, FileChangeEvent>();

    // Process changes in order, later changes override earlier ones for the same path
    for (const change of changes) {
      const existing = changeMap.get(change.path);
      if (!existing || change.timestamp > existing.timestamp) {
        changeMap.set(change.path, change);
      }
    }

    return Array.from(changeMap.values());
  }
}

import * as fs from "fs";
import * as path from "path";
import { minimatch } from "minimatch";
import { FileChangeEvent, WatchError } from "./types";

/**
 * Git operation types that can trigger bulk file changes
 */
export enum GitOperation {
  BRANCH_SWITCH = "branch_switch",
  PULL = "pull",
  MERGE = "merge",
  REBASE = "rebase",
  CHECKOUT = "checkout",
  RESET = "reset",
}

/**
 * Configuration for git-aware file change handling
 */
export interface GitIntegrationConfig {
  /** Enable git operation detection */
  enabled: boolean;
  /** Patterns to ignore (relative to repository root) */
  ignorePatterns: string[];
  /** Maximum time window to consider changes as part of same git operation (ms) */
  operationTimeWindow: number;
  /** Minimum number of files changed to consider it a bulk operation */
  bulkOperationThreshold: number;
  /** Enable detection of specific git operations */
  detectOperations: {
    branchSwitch: boolean;
    pull: boolean;
    merge: boolean;
    rebase: boolean;
    checkout: boolean;
    reset: boolean;
  };
}

/**
 * Information about a detected git operation
 */
export interface GitOperationInfo {
  operation: GitOperation;
  timestamp: Date;
  affectedFiles: string[];
  branchName?: string;
  commitHash?: string;
  isBulkOperation: boolean;
}

/**
 * Batch of file changes that should be processed together
 */
export interface FileChangeBatch {
  id: string;
  changes: FileChangeEvent[];
  gitOperation?: GitOperationInfo;
  timestamp: Date;
  priority: "high" | "medium" | "low";
}

/**
 * Default ignore patterns for git-aware watching
 */
const DEFAULT_GIT_IGNORE_PATTERNS = [
  ".git/**",
  ".git/*",
  "**/.git/**",
  "**/.git/*",
  "*.tmp",
  "*.temp",
  "*~",
  ".#*",
  "#*#",
  "*.swp",
  "*.swo",
  ".DS_Store",
  "Thumbs.db",
  "*.lock",
  "node_modules/**",
  ".vscode/**",
  ".idea/**",
];

/**
 * GitIntegrationManager handles git-aware file change detection and batching
 * to optimize performance during version control operations.
 */
export class GitIntegrationManager {
  private config: GitIntegrationConfig;
  private repositoryRoot: string | null = null;
  private pendingChanges: Map<string, FileChangeEvent> = new Map();
  private operationHistory: GitOperationInfo[] = [];
  private batchTimer: NodeJS.Timeout | null = null;
  private currentBatch: FileChangeBatch | null = null;
  private batchHandlers: ((batch: FileChangeBatch) => void)[] = [];
  private errorHandlers: ((error: WatchError) => void)[] = [];

  constructor(config: Partial<GitIntegrationConfig> = {}) {
    this.config = {
      enabled: true,
      ignorePatterns: DEFAULT_GIT_IGNORE_PATTERNS,
      operationTimeWindow: 2000, // 2 seconds
      bulkOperationThreshold: 5,
      detectOperations: {
        branchSwitch: true,
        pull: true,
        merge: true,
        rebase: true,
        checkout: true,
        reset: true,
      },
      ...config,
    };

    this.initializeRepository();
  }

  /**
   * Initialize git repository detection
   */
  private async initializeRepository(): Promise<void> {
    try {
      this.repositoryRoot = await this.findGitRepository();
      if (this.repositoryRoot) {
        console.log(
          `🔧 Git integration enabled for repository: ${this.repositoryRoot}`,
        );
      } else {
        console.log("🔧 Git repository not found, git integration disabled");
        this.config.enabled = false;
      }
    } catch (error) {
      this.handleError({
        type: "configuration",
        message: `Failed to initialize git integration: ${error instanceof Error ? error.message : String(error)}`,
        recoverable: true,
      });
    }
  }

  /**
   * Find the git repository root directory
   */
  private async findGitRepository(
    startPath: string = process.cwd(),
  ): Promise<string | null> {
    let currentPath = path.resolve(startPath);
    const root = path.parse(currentPath).root;

    while (currentPath !== root) {
      const gitPath = path.join(currentPath, ".git");

      try {
        const stats = await fs.promises.stat(gitPath);
        if (stats.isDirectory()) {
          return currentPath;
        }
      } catch {
        // .git directory doesn't exist, continue searching
      }

      currentPath = path.dirname(currentPath);
    }

    return null;
  }

  /**
   * Process a file change event with git awareness
   */
  async processFileChange(event: FileChangeEvent): Promise<void> {
    if (!this.config.enabled) {
      // If git integration is disabled, create immediate single-file batch
      const batch: FileChangeBatch = {
        id: `single_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        changes: [event],
        timestamp: new Date(),
        priority: "medium",
      };
      this.emitBatch(batch);
      return;
    }

    // Check if file should be ignored
    if (this.shouldIgnoreFile(event.path)) {
      return;
    }

    // Add to pending changes
    this.pendingChanges.set(event.path, event);

    // Detect if this is part of a git operation
    const gitOperation = await this.detectGitOperation(event);

    if (gitOperation) {
      await this.handleGitOperation(gitOperation);
    } else {
      // Handle as regular file change with batching
      await this.handleRegularFileChange(event);
    }
  }

  /**
   * Check if a file should be ignored based on git ignore patterns
   */
  private shouldIgnoreFile(filePath: string): boolean {
    const relativePath = this.repositoryRoot
      ? path.relative(this.repositoryRoot, filePath)
      : filePath;

    return this.config.ignorePatterns.some((pattern) =>
      minimatch(relativePath, pattern, { dot: true }),
    );
  }

  /**
   * Detect if a file change is part of a git operation
   */
  private async detectGitOperation(
    event: FileChangeEvent,
  ): Promise<GitOperationInfo | null> {
    if (!this.repositoryRoot || !this.config.enabled) {
      return null;
    }

    try {
      // Check for recent git operations by examining git state
      const gitOperation = await this.analyzeGitState();

      if (gitOperation) {
        // Check if this change is within the operation time window
        const timeDiff =
          event.timestamp.getTime() - gitOperation.timestamp.getTime();
        if (timeDiff <= this.config.operationTimeWindow) {
          return gitOperation;
        }
      }

      return null;
    } catch (error) {
      this.handleError({
        type: "file_system",
        message: `Failed to detect git operation: ${error instanceof Error ? error.message : String(error)}`,
        path: event.path,
        recoverable: true,
      });
      return null;
    }
  }

  /**
   * Analyze current git state to detect recent operations
   */
  private async analyzeGitState(): Promise<GitOperationInfo | null> {
    if (!this.repositoryRoot) return null;

    try {
      // Check for recent HEAD changes
      const headPath = path.join(this.repositoryRoot, ".git", "HEAD");
      const headStats = await fs.promises.stat(headPath);
      const headAge = Date.now() - headStats.mtime.getTime();

      if (headAge <= this.config.operationTimeWindow) {
        const headContent = await fs.promises.readFile(headPath, "utf8");
        const branchMatch = headContent.match(/ref: refs\/heads\/(.+)/);
        const branchName = branchMatch ? branchMatch[1].trim() : "detached";

        // Determine operation type based on git state
        const operation = await this.determineGitOperation();

        return {
          operation,
          timestamp: headStats.mtime,
          affectedFiles: [],
          branchName,
          isBulkOperation: false, // Will be determined later based on file count
        };
      }

      return null;
    } catch (error) {
      // Git state analysis failed, not necessarily an error
      return null;
    }
  }

  /**
   * Determine the type of git operation based on git state
   */
  private async determineGitOperation(): Promise<GitOperation> {
    if (!this.repositoryRoot) return GitOperation.CHECKOUT;

    try {
      // Check for merge state
      const mergeHeadPath = path.join(
        this.repositoryRoot,
        ".git",
        "MERGE_HEAD",
      );
      if (await this.fileExists(mergeHeadPath)) {
        return GitOperation.MERGE;
      }

      // Check for rebase state
      const rebasePath = path.join(this.repositoryRoot, ".git", "rebase-merge");
      const rebaseApplyPath = path.join(
        this.repositoryRoot,
        ".git",
        "rebase-apply",
      );
      if (
        (await this.fileExists(rebasePath)) ||
        (await this.fileExists(rebaseApplyPath))
      ) {
        return GitOperation.REBASE;
      }

      // Check for cherry-pick state
      const cherryPickPath = path.join(
        this.repositoryRoot,
        ".git",
        "CHERRY_PICK_HEAD",
      );
      if (await this.fileExists(cherryPickPath)) {
        return GitOperation.CHECKOUT; // Treat as checkout for simplicity
      }

      // Default to branch switch/checkout
      return GitOperation.BRANCH_SWITCH;
    } catch {
      return GitOperation.CHECKOUT;
    }
  }

  /**
   * Check if a file exists
   */
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.promises.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Handle a detected git operation
   */
  private async handleGitOperation(
    gitOperation: GitOperationInfo,
  ): Promise<void> {
    // If we already have a current batch for this operation, extend it
    if (
      this.currentBatch &&
      this.currentBatch.gitOperation?.operation === gitOperation.operation
    ) {
      // Add pending changes to current batch
      for (const [filePath, change] of this.pendingChanges) {
        if (!this.currentBatch.changes.some((c) => c.path === filePath)) {
          this.currentBatch.changes.push(change);
        }
      }

      // Reset batch timer
      if (this.batchTimer) {
        clearTimeout(this.batchTimer);
      }

      this.batchTimer = setTimeout(() => {
        this.finalizeBatch();
      }, this.config.operationTimeWindow);

      return;
    }

    // Create new batch for git operation
    const changes = Array.from(this.pendingChanges.values());
    const isBulkOperation =
      changes.length >= this.config.bulkOperationThreshold;

    this.currentBatch = {
      id: `git_${gitOperation.operation}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      changes,
      gitOperation: {
        ...gitOperation,
        affectedFiles: changes.map((c) => c.path),
        isBulkOperation,
      },
      timestamp: new Date(),
      priority: isBulkOperation ? "low" : "medium", // Lower priority for bulk operations
    };

    // Clear pending changes as they're now in the batch
    this.pendingChanges.clear();

    // Set timer to finalize batch
    this.batchTimer = setTimeout(() => {
      this.finalizeBatch();
    }, this.config.operationTimeWindow);

    console.log(
      `🔄 Detected ${gitOperation.operation} operation affecting ${changes.length} files`,
    );
  }

  /**
   * Handle regular file changes (not part of git operations)
   */
  private async handleRegularFileChange(event: FileChangeEvent): Promise<void> {
    // For regular changes, use shorter batching window
    const batchWindow = Math.min(this.config.operationTimeWindow / 2, 1000);

    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
    }

    this.batchTimer = setTimeout(() => {
      this.finalizeBatch();
    }, batchWindow);
  }

  /**
   * Finalize and emit the current batch
   */
  private finalizeBatch(): void {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    // If no current batch, create one from pending changes
    if (!this.currentBatch && this.pendingChanges.size > 0) {
      const changes = Array.from(this.pendingChanges.values());
      this.currentBatch = {
        id: `regular_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        changes,
        timestamp: new Date(),
        priority:
          changes.length >= this.config.bulkOperationThreshold
            ? "low"
            : "medium",
      };
    }

    if (this.currentBatch) {
      // Add any remaining pending changes to the batch
      for (const [filePath, change] of this.pendingChanges) {
        if (!this.currentBatch.changes.some((c) => c.path === filePath)) {
          this.currentBatch.changes.push(change);
        }
      }

      // Update git operation info if needed
      if (this.currentBatch.gitOperation) {
        this.currentBatch.gitOperation.affectedFiles =
          this.currentBatch.changes.map((c) => c.path);
        this.currentBatch.gitOperation.isBulkOperation =
          this.currentBatch.changes.length >=
          this.config.bulkOperationThreshold;

        // Add to operation history
        this.operationHistory.push(this.currentBatch.gitOperation);

        // Keep only recent operations in history
        const cutoffTime = Date.now() - this.config.operationTimeWindow * 10;
        this.operationHistory = this.operationHistory.filter(
          (op) => op.timestamp.getTime() > cutoffTime,
        );
      }

      this.emitBatch(this.currentBatch);
      this.currentBatch = null;
      this.pendingChanges.clear();
    }
  }

  /**
   * Emit a batch to all registered handlers
   */
  private emitBatch(batch: FileChangeBatch): void {
    for (const handler of this.batchHandlers) {
      try {
        handler(batch);
      } catch (error) {
        this.handleError({
          type: "file_system",
          message: `Error in batch handler: ${error instanceof Error ? error.message : String(error)}`,
          recoverable: true,
        });
      }
    }
  }

  /**
   * Register a handler for file change batches
   */
  onBatch(handler: (batch: FileChangeBatch) => void): void {
    this.batchHandlers.push(handler);
  }

  /**
   * Register an error handler
   */
  onError(handler: (error: WatchError) => void): void {
    this.errorHandlers.push(handler);
  }

  /**
   * Handle and emit errors
   */
  private handleError(error: WatchError): void {
    for (const handler of this.errorHandlers) {
      try {
        handler(error);
      } catch (handlerError) {
        console.error("Error in git integration error handler:", handlerError);
      }
    }
  }

  /**
   * Get statistics about git operations and batching
   */
  getStatistics(): {
    enabled: boolean;
    repositoryRoot: string | null;
    operationHistory: GitOperationInfo[];
    pendingChanges: number;
    currentBatch: FileChangeBatch | null;
  } {
    return {
      enabled: this.config.enabled,
      repositoryRoot: this.repositoryRoot,
      operationHistory: [...this.operationHistory],
      pendingChanges: this.pendingChanges.size,
      currentBatch: this.currentBatch ? { ...this.currentBatch } : null,
    };
  }

  /**
   * Update configuration
   */
  updateConfiguration(config: Partial<GitIntegrationConfig>): void {
    this.config = { ...this.config, ...config };

    // Re-initialize repository if enabled status changed
    if (config.enabled !== undefined) {
      this.initializeRepository();
    }
  }

  /**
   * Force finalize any pending batch (useful for shutdown)
   */
  flush(): void {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
    this.finalizeBatch();
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.flush();
    this.batchHandlers = [];
    this.errorHandlers = [];
    this.pendingChanges.clear();
    this.operationHistory = [];
    this.currentBatch = null;
  }
}

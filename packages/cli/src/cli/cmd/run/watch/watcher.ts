import * as chokidar from "chokidar";
import { minimatch } from "minimatch";
import chalk from "chalk";
import {
  FileWatcherService as IFileWatcherService,
  WatchOptions,
  FileChangeEvent,
  WatchError,
} from "./types";
import { CmdRunContext } from "../_types";
import { getBuckets } from "../../../utils/buckets";
import plan from "../plan";
import execute from "../execute";
import { renderSummary } from "../../../utils/ui";
import { colors } from "../../../constants";

/**
 * Internal state for tracking watch operations
 */
interface WatchState {
  isRunning: boolean;
  pendingChanges: Set<string>;
  debounceTimer?: NodeJS.Timeout;
}

/**
 * FileWatcherService wraps chokidar with enhanced error handling, recovery,
 * and provides a clean interface for file system monitoring.
 *
 * This class refactors the original watch.ts logic into a more modular,
 * testable, and maintainable structure while preserving all existing functionality.
 */
export class FileWatcherService implements IFileWatcherService {
  private watcher: chokidar.FSWatcher | null = null;
  private watchedPatterns: string[] = [];
  private isInitialized: boolean = false;
  private changeHandlers: ((event: FileChangeEvent) => void)[] = [];
  private errorHandlers: ((error: WatchError) => void)[] = [];

  // State management from original watch.ts
  private watchState: WatchState = {
    isRunning: false,
    pendingChanges: new Set(),
  };

  // Context for retranslation operations
  private ctx: CmdRunContext | null = null;

  /**
   * Initialize the file watcher with patterns and options
   * Refactored from original watch.ts initialization logic
   */
  async initialize(patterns: string[], options: WatchOptions): Promise<void> {
    if (this.isInitialized) {
      throw new Error("FileWatcherService is already initialized");
    }

    try {
      this.watchedPatterns = [...patterns];

      if (patterns.length === 0) {
        console.log(chalk.yellow("⚠️  No source files found to watch"));
        return;
      }

      console.log(chalk.dim(`Watching ${patterns.length} file pattern(s):`));
      patterns.forEach((pattern) => {
        console.log(chalk.dim(`  • ${pattern}`));
      });
      console.log("");

      // Create chokidar watcher with enhanced options (from original watch.ts)
      this.watcher = chokidar.watch(patterns, {
        ignoreInitial: options.ignoreInitial,
        persistent: true,
        awaitWriteFinish: options.awaitWriteFinish,
        ignored: options.ignored,
        // Additional chokidar options for stability
        usePolling: false,
        interval: 100,
        binaryInterval: 300,
        alwaysStat: false,
        depth: undefined,
        followSymlinks: true,
        cwd: process.cwd(),
        atomic: true,
      });

      // Set up event handlers
      this.setupEventHandlers();

      this.isInitialized = true;
    } catch (error) {
      this.handleError({
        type: "file_system",
        message: `Failed to initialize file watcher: ${error instanceof Error ? error.message : String(error)}`,
        recoverable: false,
      });
      throw error;
    }
  }

  /**
   * Initialize with context for retranslation operations
   * This method combines initialization with context setup for backward compatibility
   */
  async initializeWithContext(ctx: CmdRunContext): Promise<void> {
    this.ctx = ctx;

    // Get watch patterns using the original logic from watch.ts
    const watchPatterns = await this.getWatchPatterns(ctx);

    const options: WatchOptions = {
      debounceDelay: ctx.flags.debounce || 5000,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 500,
        pollInterval: 100,
      },
      ignored: [],
    };

    await this.initialize(watchPatterns, options);

    // Set up graceful shutdown (from original watch.ts)
    this.setupGracefulShutdown();
  }

  /**
   * Add a new pattern to watch
   */
  async addPattern(pattern: string): Promise<void> {
    if (!this.watcher) {
      throw new Error("FileWatcherService not initialized");
    }

    try {
      this.watcher.add(pattern);
      this.watchedPatterns.push(pattern);
    } catch (error) {
      this.handleError({
        type: "file_system",
        message: `Failed to add watch pattern '${pattern}': ${error instanceof Error ? error.message : String(error)}`,
        path: pattern,
        recoverable: true,
      });
      throw error;
    }
  }

  /**
   * Remove a pattern from watching
   */
  async removePattern(pattern: string): Promise<void> {
    if (!this.watcher) {
      throw new Error("FileWatcherService not initialized");
    }

    try {
      this.watcher.unwatch(pattern);
      this.watchedPatterns = this.watchedPatterns.filter((p) => p !== pattern);
    } catch (error) {
      this.handleError({
        type: "file_system",
        message: `Failed to remove watch pattern '${pattern}': ${error instanceof Error ? error.message : String(error)}`,
        path: pattern,
        recoverable: true,
      });
      throw error;
    }
  }

  /**
   * Get list of currently watched files
   */
  getWatchedFiles(): string[] {
    if (!this.watcher) {
      return [];
    }

    // TODO: Get actual watched files from chokidar
    // This requires accessing the internal state of chokidar
    return Object.keys(this.watcher.getWatched()).reduce(
      (files: string[], dir: string) => {
        const dirFiles = this.watcher!.getWatched()[dir];
        return files.concat(dirFiles.map((file: string) => `${dir}/${file}`));
      },
      [],
    );
  }

  /**
   * Clean up and destroy the file watcher
   */
  async destroy(): Promise<void> {
    if (!this.watcher) {
      return;
    }

    try {
      await this.watcher.close();
      this.watcher = null;
      this.watchedPatterns = [];
      this.isInitialized = false;
      this.changeHandlers = [];
      this.errorHandlers = [];
    } catch (error) {
      this.handleError({
        type: "file_system",
        message: `Failed to destroy file watcher: ${error instanceof Error ? error.message : String(error)}`,
        recoverable: false,
      });
      throw error;
    }
  }

  /**
   * Add a handler for file change events
   */
  onFileChange(handler: (event: FileChangeEvent) => void): void {
    this.changeHandlers.push(handler);
  }

  /**
   * Add a handler for error events
   */
  onError(handler: (error: WatchError) => void): void {
    this.errorHandlers.push(handler);
  }

  /**
   * Set up chokidar event handlers
   * Enhanced with original watch.ts logic for file change handling
   */
  private setupEventHandlers(): void {
    if (!this.watcher) {
      return;
    }

    // File/directory added - trigger retranslation (from original watch.ts)
    this.watcher.on("add", (path: string, stats?: any) => {
      const event: FileChangeEvent = {
        type: "add",
        path,
        timestamp: new Date(),
        stats,
      };
      this.emitFileChange(event);
      this.handleFileChangeWithDebounce(path);
    });

    // File changed - trigger retranslation (from original watch.ts)
    this.watcher.on("change", (path: string, stats?: any) => {
      const event: FileChangeEvent = {
        type: "change",
        path,
        timestamp: new Date(),
        stats,
      };
      this.emitFileChange(event);
      this.handleFileChangeWithDebounce(path);
    });

    // File/directory removed - trigger retranslation (from original watch.ts)
    this.watcher.on("unlink", (path: string) => {
      const event: FileChangeEvent = {
        type: "unlink",
        path,
        timestamp: new Date(),
      };
      this.emitFileChange(event);
      this.handleFileChangeWithDebounce(path);
    });

    // Directory added
    this.watcher.on("addDir", (path: string, stats?: any) => {
      this.emitFileChange({
        type: "addDir",
        path,
        timestamp: new Date(),
        stats,
      });
    });

    // Directory removed
    this.watcher.on("unlinkDir", (path: string) => {
      this.emitFileChange({
        type: "unlinkDir",
        path,
        timestamp: new Date(),
      });
    });

    // Error handling (enhanced from original watch.ts)
    this.watcher.on("error", (error: any) => {
      console.error(
        chalk.red(
          `Watch error: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );

      this.handleError({
        type: "file_system",
        message: error instanceof Error ? error.message : String(error),
        recoverable: true,
      });
    });

    // Ready event (initial scan complete)
    this.watcher.on("ready", () => {
      // TODO: Emit ready event or callback
    });
  }

  /**
   * Emit file change event to all handlers
   */
  private emitFileChange(event: FileChangeEvent): void {
    for (const handler of this.changeHandlers) {
      try {
        handler(event);
      } catch (error) {
        this.handleError({
          type: "file_system",
          message: `Error in file change handler: ${error instanceof Error ? error.message : String(error)}`,
          path: event.path,
          recoverable: true,
        });
      }
    }
  }

  /**
   * Handle and emit error events
   */
  private handleError(error: WatchError): void {
    for (const handler of this.errorHandlers) {
      try {
        handler(error);
      } catch (handlerError) {
        // Avoid infinite error loops - just log to console
        console.error("Error in error handler:", handlerError);
      }
    }
  }

  /**
   * Get watch patterns from context configuration
   * Extracted from original watch.ts getWatchPatterns function
   */
  private async getWatchPatterns(ctx: CmdRunContext): Promise<string[]> {
    if (!ctx.config) return [];

    const buckets = getBuckets(ctx.config);
    const patterns: string[] = [];

    for (const bucket of buckets) {
      // Skip if specific buckets are filtered
      if (ctx.flags.bucket && !ctx.flags.bucket.includes(bucket.type)) {
        continue;
      }

      for (const bucketPath of bucket.paths) {
        // Skip if specific files are filtered
        if (ctx.flags.file) {
          if (
            !ctx.flags.file.some(
              (f) =>
                bucketPath.pathPattern.includes(f) ||
                minimatch(bucketPath.pathPattern, f),
            )
          ) {
            continue;
          }
        }

        // Get the source locale pattern (replace [locale] with source locale)
        const sourceLocale = ctx.flags.sourceLocale || ctx.config.locale.source;
        const sourcePattern = bucketPath.pathPattern.replace(
          "[locale]",
          sourceLocale,
        );

        patterns.push(sourcePattern);
      }
    }

    return patterns;
  }

  /**
   * Handle file change events with debouncing
   * Extracted from original watch.ts handleFileChange function
   */
  private handleFileChangeWithDebounce(filePath: string): void {
    if (!this.ctx) {
      console.error("Context not available for file change handling");
      return;
    }

    const debounceDelay = this.ctx.flags.debounce || 5000;

    this.watchState.pendingChanges.add(filePath);

    console.log(chalk.dim(`📝 File changed: ${filePath}`));

    // Clear existing debounce timer
    if (this.watchState.debounceTimer) {
      clearTimeout(this.watchState.debounceTimer);
    }

    // Set new debounce timer
    this.watchState.debounceTimer = setTimeout(async () => {
      if (this.watchState.isRunning) {
        console.log(
          chalk.yellow("⏳ Translation already in progress, skipping..."),
        );
        return;
      }

      await this.triggerRetranslation();
    }, debounceDelay);
  }

  /**
   * Trigger retranslation process
   * Extracted from original watch.ts triggerRetranslation function
   */
  private async triggerRetranslation(): Promise<void> {
    if (!this.ctx || this.watchState.isRunning) return;

    this.watchState.isRunning = true;

    try {
      const changedFiles = Array.from(this.watchState.pendingChanges);
      this.watchState.pendingChanges.clear();

      console.log(chalk.hex(colors.green)("\n🔄 Triggering retranslation..."));
      console.log(chalk.dim(`Changed files: ${changedFiles.join(", ")}`));
      console.log("");

      // Create a new context for this run (preserve original flags but reset tasks/results)
      const runCtx: CmdRunContext = {
        ...this.ctx,
        tasks: [],
        results: new Map(),
      };

      // Re-run the translation pipeline
      await plan(runCtx);

      if (runCtx.tasks.length === 0) {
        console.log(chalk.dim("✨ No translation tasks needed"));
      } else {
        await execute(runCtx);
        await renderSummary(runCtx.results);
      }

      console.log(chalk.hex(colors.green)("✅ Retranslation completed"));
      console.log(chalk.dim("👀 Continuing to watch for changes...\n"));
    } catch (error: any) {
      console.error(chalk.red(`❌ Retranslation failed: ${error.message}`));
      console.log(chalk.dim("👀 Continuing to watch for changes...\n"));

      this.handleError({
        type: "translation",
        message: error.message,
        recoverable: true,
      });
    } finally {
      this.watchState.isRunning = false;
    }
  }

  /**
   * Set up graceful shutdown handling
   * Extracted from original watch.ts process signal handling
   */
  private setupGracefulShutdown(): void {
    process.on("SIGINT", () => {
      console.log(chalk.yellow("\n\n🛑 Stopping watch mode..."));
      this.destroy()
        .then(() => {
          process.exit(0);
        })
        .catch((error) => {
          console.error("Error during shutdown:", error);
          process.exit(1);
        });
    });
  }

  /**
   * Start watching and keep the process alive
   * Replaces the main watch function from original watch.ts
   */
  async startWatching(ctx: CmdRunContext): Promise<void> {
    console.log(chalk.hex(colors.orange)("[Watch Mode]"));
    console.log(
      `👀 Watching for changes... (Press ${chalk.yellow("Ctrl+C")} to stop)`,
    );
    console.log(
      chalk.dim(`   Debounce delay: ${ctx.flags.debounce || 5000}ms`),
    );
    console.log("");

    await this.initializeWithContext(ctx);

    // Keep the process running (from original watch.ts)
    await new Promise(() => {}); // Never resolves, keeps process alive
  }
}

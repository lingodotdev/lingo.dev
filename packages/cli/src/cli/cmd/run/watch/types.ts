import { CmdRunContext } from "../_types";
import type { Stats } from "fs";

// Core watch configuration interface
export interface WatchConfiguration {
  patterns: {
    include: string[];
    exclude: string[];
  };
  debounce: {
    delay: number;
    maxWait?: number;
  };
  monitoring: {
    enableProgressIndicators: boolean;
    enableNotifications: boolean;
    logLevel: "silent" | "minimal" | "verbose";
  };
  performance: {
    batchSize: number;
    rateLimitDelay: number;
  };
}

// Watch status and state interfaces
export interface WatchStatus {
  isActive: boolean;
  watchedFiles: string[];
  pendingChanges: string[];
  lastActivity: Date;
  errorCount: number;
}

export interface WatchState {
  isRunning: boolean;
  isRetranslating: boolean;
  pendingChanges: Map<string, FileChangeEvent>;
  watchedPatterns: string[];
  startTime: Date;
  lastRetranslation?: Date;
  statistics: WatchStatistics;
}

export interface WatchStatistics {
  totalChanges: number;
  retranslationCount: number;
  errorCount: number;
  averageRetranslationTime: number;
}

// Enhanced watch context
export interface EnhancedWatchContext extends CmdRunContext {
  watchConfig: WatchConfiguration;
  watchState: WatchState;
  feedbackManager: FeedbackManager;
}

// File change event interface
export interface FileChangeEvent {
  type: "add" | "change" | "unlink" | "addDir" | "unlinkDir";
  path: string;
  timestamp: Date;
  stats?: Stats;
}

// Watch options for file watcher service
export interface WatchOptions {
  debounceDelay: number;
  ignoreInitial: boolean;
  awaitWriteFinish: {
    stabilityThreshold: number;
    pollInterval: number;
  };
  ignored: string[];
}

// Debouncing strategy configuration
export interface DebounceStrategy {
  type: "simple" | "adaptive" | "batch";
  delay: number;
  maxWait?: number;
  batchSize?: number;
  rateLimitDelay?: number;
}

// Translation progress and result interfaces
export interface TranslationProgress {
  totalTasks: number;
  completedTasks: number;
  currentTask?: string;
  estimatedTimeRemaining?: number;
}

export interface TranslationResult {
  success: boolean;
  duration: number;
  tasksCompleted: number;
  errors: WatchError[];
}

// Error handling interfaces
export interface WatchError {
  type: "file_system" | "translation" | "configuration";
  message: string;
  path?: string;
  recoverable: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Pattern resolution interfaces
export interface ResolvedPatterns {
  include: string[];
  exclude: string[];
  resolved: string[];
}

// Error recovery strategy interface
export interface ErrorRecoveryStrategy {
  maxRetries: number;
  backoffMultiplier: number;
  recoveryActions: RecoveryAction[];
}

export interface RecoveryAction {
  condition: (error: Error) => boolean;
  action: (error: Error) => Promise<void>;
  description: string;
}

// Forward declarations for interfaces (will be implemented in respective files)
export interface WatchManager {
  start(ctx: CmdRunContext): Promise<void>;
  stop(): Promise<void>;
  getStatus(): WatchStatus;
  updateConfiguration(config: WatchConfiguration): Promise<void>;
}

export interface ConfigurationManager {
  loadConfiguration(ctx: CmdRunContext): Promise<WatchConfiguration>;
  validateConfiguration(config: WatchConfiguration): ValidationResult;
  mergeWithDefaults(config: Partial<WatchConfiguration>): WatchConfiguration;
}

export interface FileWatcherService {
  initialize(patterns: string[], options: WatchOptions): Promise<void>;
  addPattern(pattern: string): Promise<void>;
  removePattern(pattern: string): Promise<void>;
  getWatchedFiles(): string[];
  destroy(): Promise<void>;
}

export interface DebounceController {
  scheduleRetranslation(changes: FileChangeEvent[]): void;
  cancelPending(): void;
  isRetranslationPending(): boolean;
  getTimeUntilExecution(): number;
}

export interface FeedbackManager {
  reportFileChange(event: FileChangeEvent): void;
  reportRetranslationStart(files: string[]): void;
  reportRetranslationProgress(progress: TranslationProgress): void;
  reportRetranslationComplete(result: TranslationResult): void;
  reportError(error: WatchError): void;
}

export interface PatternResolver {
  resolveWatchPatterns(ctx: CmdRunContext): Promise<ResolvedPatterns>;
  validatePatterns(patterns: string[]): ValidationResult;
  expandGlobPatterns(patterns: string[]): Promise<string[]>;
}

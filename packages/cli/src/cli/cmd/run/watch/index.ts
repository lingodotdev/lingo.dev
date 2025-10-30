// Main entry point for the enhanced watch module
export { WatchManager } from './manager';
export { ConfigurationManager } from './config';
export { FileWatcherService } from './watcher';
export { DebounceController } from './debounce';
export { FeedbackManager } from './feedback';
export { PatternResolver } from './patterns';

// Re-export types
export * from './types';
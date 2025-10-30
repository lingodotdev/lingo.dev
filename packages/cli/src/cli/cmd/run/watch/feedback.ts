import chalk from "chalk";
import { 
  FeedbackManager as IFeedbackManager,
  FileChangeEvent,
  TranslationProgress,
  TranslationResult,
  WatchError
} from './types';

/**
 * FeedbackManager provides real-time feedback to developers about file changes,
 * translation progress, and errors during the watch process.
 */
export class FeedbackManager implements IFeedbackManager {
  private logLevel: 'silent' | 'minimal' | 'verbose';
  private enableProgressIndicators: boolean;
  private enableNotifications: boolean;
  private currentProgress: TranslationProgress | null = null;

  constructor(options: {
    logLevel?: 'silent' | 'minimal' | 'verbose';
    enableProgressIndicators?: boolean;
    enableNotifications?: boolean;
  } = {}) {
    this.logLevel = options.logLevel || 'minimal';
    this.enableProgressIndicators = options.enableProgressIndicators ?? true;
    this.enableNotifications = options.enableNotifications ?? false;
  }

  /**
   * Report a file change event
   */
  reportFileChange(event: FileChangeEvent): void {
    if (this.logLevel === 'silent') {
      return;
    }

    const timestamp = this.formatTimestamp(event.timestamp);
    const changeType = this.formatChangeType(event.type);
    const filePath = this.formatFilePath(event.path);

    if (this.logLevel === 'verbose') {
      console.log(chalk.dim(`${timestamp} ${changeType} ${filePath}`));
    } else {
      console.log(chalk.dim(`📝 File ${event.type}: ${filePath}`));
    }
  }

  /**
   * Report the start of retranslation process
   */
  reportRetranslationStart(files: string[]): void {
    if (this.logLevel === 'silent') {
      return;
    }

    console.log(chalk.hex('#ff6b35')('\n🔄 Triggering retranslation...'));
    
    if (files.length > 0) {
      if (this.logLevel === 'verbose') {
        console.log(chalk.dim(`Changed files: ${files.join(', ')}`));
      } else {
        console.log(chalk.dim(`Processing ${files.length} changed file(s)`));
      }
    }
    
    console.log('');
  }

  /**
   * Report progress during retranslation
   */
  reportRetranslationProgress(progress: TranslationProgress): void {
    if (this.logLevel === 'silent' || !this.enableProgressIndicators) {
      return;
    }

    this.currentProgress = progress;
    
    const percentage = Math.round((progress.completedTasks / progress.totalTasks) * 100);
    const progressBar = this.createProgressBar(percentage);
    
    let message = `${progressBar} ${percentage}% (${progress.completedTasks}/${progress.totalTasks})`;
    
    if (progress.currentTask) {
      message += ` - ${progress.currentTask}`;
    }
    
    if (progress.estimatedTimeRemaining) {
      message += ` - ETA: ${this.formatDuration(progress.estimatedTimeRemaining)}`;
    }

    // Use carriage return to overwrite previous progress line
    process.stdout.write(`\r${message}`);
    
    // Add newline when complete
    if (progress.completedTasks === progress.totalTasks) {
      process.stdout.write('\n');
    }
  }

  /**
   * Report completion of retranslation
   */
  reportRetranslationComplete(result: TranslationResult): void {
    if (this.logLevel === 'silent') {
      return;
    }

    if (result.success) {
      console.log(chalk.hex('#4ade80')('✅ Retranslation completed'));
      
      if (this.logLevel === 'verbose') {
        console.log(chalk.dim(`Duration: ${this.formatDuration(result.duration)}`));
        console.log(chalk.dim(`Tasks completed: ${result.tasksCompleted}`));
      }
    } else {
      console.log(chalk.red('❌ Retranslation failed'));
      
      if (result.errors.length > 0) {
        console.log(chalk.red(`Errors: ${result.errors.length}`));
        if (this.logLevel === 'verbose') {
          result.errors.forEach(error => this.reportError(error));
        }
      }
    }
    
    console.log(chalk.dim('👀 Continuing to watch for changes...\n'));
  }

  /**
   * Report an error during the watch process
   */
  reportError(error: WatchError): void {
    if (this.logLevel === 'silent') {
      return;
    }

    const errorIcon = this.getErrorIcon(error.type);
    const errorColor = error.recoverable ? chalk.yellow : chalk.red;
    
    console.log(errorColor(`${errorIcon} ${error.message}`));
    
    if (error.path && this.logLevel === 'verbose') {
      console.log(chalk.dim(`   Path: ${error.path}`));
    }
    
    if (error.recoverable) {
      console.log(chalk.dim('   Attempting to recover...'));
    }
  }

  /**
   * Update feedback configuration
   */
  updateConfiguration(options: {
    logLevel?: 'silent' | 'minimal' | 'verbose';
    enableProgressIndicators?: boolean;
    enableNotifications?: boolean;
  }): void {
    if (options.logLevel !== undefined) {
      this.logLevel = options.logLevel;
    }
    if (options.enableProgressIndicators !== undefined) {
      this.enableProgressIndicators = options.enableProgressIndicators;
    }
    if (options.enableNotifications !== undefined) {
      this.enableNotifications = options.enableNotifications;
    }
  }

  /**
   * Format timestamp for display
   */
  private formatTimestamp(timestamp: Date): string {
    return timestamp.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  /**
   * Format file change type with appropriate styling
   */
  private formatChangeType(type: FileChangeEvent['type']): string {
    switch (type) {
      case 'add':
        return chalk.green('ADD');
      case 'change':
        return chalk.blue('CHG');
      case 'unlink':
        return chalk.red('DEL');
      case 'addDir':
        return chalk.green('ADD_DIR');
      case 'unlinkDir':
        return chalk.red('DEL_DIR');
      default:
        return chalk.gray('UNK');
    }
  }

  /**
   * Format file path for display (truncate if too long)
   */
  private formatFilePath(path: string): string {
    const maxLength = 60;
    if (path.length <= maxLength) {
      return path;
    }
    
    return '...' + path.slice(-(maxLength - 3));
  }

  /**
   * Create a visual progress bar
   */
  private createProgressBar(percentage: number, width: number = 20): string {
    const filled = Math.round((percentage / 100) * width);
    const empty = width - filled;
    
    return chalk.green('█'.repeat(filled)) + chalk.gray('░'.repeat(empty));
  }

  /**
   * Format duration in milliseconds to human readable format
   */
  private formatDuration(ms: number): string {
    if (ms < 1000) {
      return `${ms}ms`;
    } else if (ms < 60000) {
      return `${(ms / 1000).toFixed(1)}s`;
    } else {
      const minutes = Math.floor(ms / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      return `${minutes}m ${seconds}s`;
    }
  }

  /**
   * Get appropriate icon for error type
   */
  private getErrorIcon(type: WatchError['type']): string {
    switch (type) {
      case 'file_system':
        return '📁';
      case 'translation':
        return '🔤';
      case 'configuration':
        return '⚙️';
      default:
        return '❌';
    }
  }

  /**
   * Send system notification (if enabled and supported)
   */
  private sendNotification(title: string, message: string): void {
    if (!this.enableNotifications) {
      return;
    }

    // TODO: Implement system notifications
    // Could use node-notifier or similar library
    // For now, just log to console
    console.log(chalk.inverse(` ${title} `), message);
  }
}
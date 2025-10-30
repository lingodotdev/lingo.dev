import { WatchManager } from "./manager";
import { FeedbackManager } from "./feedback";
import { WatchError } from "./types";

/**
 * ShutdownManager handles graceful shutdown of the watch process,
 * including cleanup of resources, status reporting, and health checks.
 */
export class ShutdownManager {
  private watchManager: WatchManager;
  private feedbackManager: FeedbackManager;
  private isShuttingDown: boolean = false;
  private shutdownTimeout: number = 10000; // 10 seconds
  private healthCheckInterval: NodeJS.Timeout | null = null;

  constructor(watchManager: WatchManager, feedbackManager: FeedbackManager) {
    this.watchManager = watchManager;
    this.feedbackManager = feedbackManager;
  }

  /**
   * Initialize shutdown handlers and health monitoring
   */
  initialize(): void {
    this.setupSignalHandlers();
    this.startHealthMonitoring();
  }

  /**
   * Perform graceful shutdown with timeout
   */
  async gracefulShutdown(signal?: string): Promise<void> {
    if (this.isShuttingDown) {
      console.log("⚠️  Shutdown already in progress...");
      return;
    }

    this.isShuttingDown = true;
    console.log(
      `\n🛑 Received ${signal || "shutdown"} signal, shutting down gracefully...`,
    );

    // Stop health monitoring
    this.stopHealthMonitoring();

    // Set up shutdown timeout
    const shutdownPromise = this.performShutdown();
    const timeoutPromise = new Promise<void>((_, reject) => {
      setTimeout(() => {
        reject(new Error("Shutdown timeout exceeded"));
      }, this.shutdownTimeout);
    });

    try {
      await Promise.race([shutdownPromise, timeoutPromise]);
      console.log("✅ Graceful shutdown completed");
      process.exit(0);
    } catch (error) {
      console.error("❌ Shutdown failed or timed out:", error);
      console.log("🔥 Forcing shutdown...");
      process.exit(1);
    }
  }

  /**
   * Force immediate shutdown (used as fallback)
   */
  forceShutdown(): void {
    console.log("🔥 Force shutdown initiated");
    process.exit(1);
  }

  /**
   * Get shutdown status and health information
   */
  getStatus(): {
    isShuttingDown: boolean;
    isHealthy: boolean;
    uptime: number;
    statistics: any;
  } {
    return {
      isShuttingDown: this.isShuttingDown,
      isHealthy: this.watchManager.isHealthy(),
      uptime: this.getUptime(),
      statistics: this.watchManager.getStatistics(),
    };
  }

  /**
   * Set custom shutdown timeout
   */
  setShutdownTimeout(timeout: number): void {
    this.shutdownTimeout = Math.max(1000, Math.min(60000, timeout)); // 1s to 60s
  }

  /**
   * Perform the actual shutdown process
   */
  private async performShutdown(): Promise<void> {
    try {
      // Report shutdown start
      this.feedbackManager.reportRetranslationStart([]);

      // Get final status before shutdown
      const finalStatus = this.watchManager.getStatus();
      console.log(
        `📊 Final status: ${finalStatus.watchedFiles.length} files watched, ${finalStatus.errorCount} errors`,
      );

      // Stop the watch manager
      await this.watchManager.stop();

      // Clean up any remaining resources
      await this.cleanup();
    } catch (error) {
      const shutdownError: WatchError = {
        type: "file_system",
        message: `Shutdown error: ${error instanceof Error ? error.message : String(error)}`,
        recoverable: false,
      };

      this.feedbackManager.reportError(shutdownError);
      throw error;
    }
  }

  /**
   * Set up signal handlers for graceful shutdown
   */
  private setupSignalHandlers(): void {
    // Handle SIGINT (Ctrl+C)
    process.on("SIGINT", () => {
      this.gracefulShutdown("SIGINT");
    });

    // Handle SIGTERM (termination request)
    process.on("SIGTERM", () => {
      this.gracefulShutdown("SIGTERM");
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (error) => {
      console.error("💥 Uncaught exception:", error);
      this.gracefulShutdown("uncaughtException");
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (reason, promise) => {
      console.error("💥 Unhandled rejection at:", promise, "reason:", reason);
      this.gracefulShutdown("unhandledRejection");
    });

    // Handle SIGUSR1 for status reporting
    process.on("SIGUSR1", () => {
      this.reportStatus();
    });

    // Handle SIGUSR2 for health check
    process.on("SIGUSR2", () => {
      this.performHealthCheck();
    });
  }

  /**
   * Start periodic health monitoring
   */
  private startHealthMonitoring(): void {
    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck();
    }, 30000); // Check every 30 seconds
  }

  /**
   * Stop health monitoring
   */
  private stopHealthMonitoring(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }

  /**
   * Perform health check and report issues
   */
  private performHealthCheck(): void {
    const status = this.getStatus();

    if (!status.isHealthy) {
      const healthError: WatchError = {
        type: "file_system",
        message: "Watch manager health check failed",
        recoverable: true,
      };

      this.feedbackManager.reportError(healthError);

      // Consider restarting components if unhealthy for too long
      // This could be implemented as an auto-recovery mechanism
    }
  }

  /**
   * Report current status to console
   */
  private reportStatus(): void {
    const status = this.getStatus();
    console.log("\n📊 Watch Manager Status Report:");
    console.log(`   Healthy: ${status.isHealthy ? "✅" : "❌"}`);
    console.log(`   Uptime: ${this.formatUptime(status.uptime)}`);
    console.log(`   Shutting down: ${status.isShuttingDown ? "✅" : "❌"}`);
    console.log(`   Statistics:`, status.statistics);
    console.log("");
  }

  /**
   * Clean up any remaining resources
   */
  private async cleanup(): Promise<void> {
    // Clear any remaining timers
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }

    // Additional cleanup can be added here
    // e.g., closing database connections, clearing caches, etc.
  }

  /**
   * Get uptime in milliseconds
   */
  private getUptime(): number {
    return process.uptime() * 1000;
  }

  /**
   * Format uptime for display
   */
  private formatUptime(uptimeMs: number): string {
    const seconds = Math.floor(uptimeMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }
}

// Process exit handler with flush timeout logic

import type { Logger } from "pino";

// Track if exit handlers have been registered to avoid duplicate registration
let handlersRegistered = false;

// Track all active loggers that need to be flushed on exit
const activeLoggers = new Set<Logger>();

/**
 * Register a logger for automatic flushing on process exit.
 * Sets up SIGTERM and SIGINT handlers if not already registered.
 *
 * @param logger - Pino logger instance to register
 */
export function registerExitHandler(logger: Logger): void {
  // Add logger to the active set
  activeLoggers.add(logger);

  // Only register handlers once
  if (handlersRegistered) {
    return;
  }

  handlersRegistered = true;

  // Register SIGTERM handler
  process.on("SIGTERM", () => {
    flushAndExit("SIGTERM");
  });

  // Register SIGINT handler (Ctrl+C)
  process.on("SIGINT", () => {
    flushAndExit("SIGINT");
  });

  // Register beforeExit handler for graceful shutdown
  process.on("beforeExit", () => {
    flushLoggersSync();
  });
}

/**
 * Flush all active loggers and exit the process.
 * Implements a 5-second timeout to force exit if flushing takes too long.
 *
 * @param signal - The signal that triggered the exit
 */
function flushAndExit(signal: string): void {
  // Set up 5-second timeout to force exit
  const forceExitTimeout = setTimeout(() => {
    console.error(
      `[Logging] Flush timeout exceeded (5s) for ${signal}, forcing exit`
    );
    process.exit(1);
  }, 5000);

  // Prevent the timeout from keeping the process alive
  forceExitTimeout.unref();

  // Flush all loggers
  const flushPromises = Array.from(activeLoggers).map((logger) => {
    return new Promise<void>((resolve) => {
      // Pino's flush method ensures all pending writes complete
      logger.flush(() => {
        resolve();
      });
    });
  });

  // Wait for all flushes to complete
  Promise.all(flushPromises)
    .then(() => {
      clearTimeout(forceExitTimeout);
      process.exit(0);
    })
    .catch((err) => {
      console.error(`[Logging] Error flushing loggers:`, err);
      clearTimeout(forceExitTimeout);
      process.exit(1);
    });
}

/**
 * Synchronously flush all loggers (used for beforeExit).
 * Note: This is a best-effort flush and may not complete if the event loop is ending.
 */
function flushLoggersSync(): void {
  for (const logger of activeLoggers) {
    try {
      // Trigger flush without waiting
      logger.flush();
    } catch (err) {
      console.error(`[Logging] Error flushing logger:`, err);
    }
  }
}

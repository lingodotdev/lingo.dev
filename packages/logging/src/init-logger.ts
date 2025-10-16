import pino from "pino";
import type { Logger } from "pino";
import type { LoggerCacheEntry, LoggerConfig } from "./types.js";
import {
  LOG_DIR,
  DEFAULT_LOG_LEVEL,
  DEFAULT_REDACT_PATHS,
} from "./constants.js";

const loggerCache = new Map<string, LoggerCacheEntry>();

/**
 * Initialize or retrieve a cached logger instance for the given slug.
 * Returns the same logger instance when called multiple times with the same slug.
 * If logger initialization fails, returns a no-op logger that silently discards all logs.
 *
 * @param slug - Unique identifier for the logger
 * @returns Pino logger instance (or no-op logger on failure)
 */
export function initLogger(slug: string): Logger {
  const cached = loggerCache.get(slug);
  if (cached) {
    return cached.logger;
  }

  try {
    const logFilePath = `${LOG_DIR}/${slug}.log`;

    const config: LoggerConfig = {
      slug,
      logDir: LOG_DIR,
      logFilePath,
    };

    const logger = createLogger(config);

    loggerCache.set(slug, { logger, config });

    return logger;
  } catch (error) {
    // Log initialization failed - return a no-op logger to prevent CLI crashes
    // The CLI will continue to work, but logging will be silently disabled
    return createNoOpLogger();
  }
}

/**
 * Create a logger that writes to file with sensitive data redaction.
 * Uses synchronous writes for immediate persistence in CLI applications.
 */
function createLogger(config: LoggerConfig): Logger {
  const destination = pino.destination({
    dest: config.logFilePath,
    sync: true,
    mkdir: true,
  });

  // Handle runtime errors on the destination stream to prevent crashes
  destination.on("error", (err) => {
    // Silently ignore logging errors - don't let them crash the CLI
    // In production, you might want to write to stderr or a fallback location
  });

  const logger = pino(
    {
      level: DEFAULT_LOG_LEVEL,
      redact: {
        paths: [...DEFAULT_REDACT_PATHS],
        censor: "[REDACTED]",
      },
    },
    destination,
  );

  return logger;
}

/**
 * Create a no-op logger that discards all log messages.
 * Used as a fallback when file logging initialization fails.
 */
function createNoOpLogger(): Logger {
  // Pino with level 'silent' discards all logs
  return pino({ level: "silent" });
}

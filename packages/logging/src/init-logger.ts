import pino from "pino";
import type { Logger } from "pino";
import { createStream } from "rotating-file-stream";
import { basename } from "node:path";
import type { LoggerCacheEntry, LoggerConfig } from "./types.js";
import {
  LOG_DIR,
  DEFAULT_LOG_LEVEL,
  DEFAULT_REDACT_PATHS,
  LOG_ROTATION_MAX_SIZE,
  LOG_ROTATION_MAX_FILES,
  LOG_ROTATION_INTERVAL,
  LOG_ROTATION_COMPRESS,
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
 * Create a logger with automatic log rotation.
 */
function createLogger(config: LoggerConfig): Logger {
  const logFileName = basename(config.logFilePath);

  // Create rotating file stream with smart defaults
  const stream = createStream(logFileName, {
    size: LOG_ROTATION_MAX_SIZE, // Rotate at 10MB
    interval: LOG_ROTATION_INTERVAL, // Daily rotation
    maxFiles: LOG_ROTATION_MAX_FILES, // Keep 10 files
    compress: LOG_ROTATION_COMPRESS, // Gzip old files
    path: config.logDir, // Directory for logs
  });

  // Handle runtime errors on the stream to prevent crashes
  stream.on("error", (err) => {
    // Log to stderr so errors are visible but don't crash the CLI
    console.error(`[Logger error]: ${err.message}`);
  });

  const logger = pino(
    {
      level: DEFAULT_LOG_LEVEL,
      redact: {
        paths: [...DEFAULT_REDACT_PATHS],
        censor: "[REDACTED]",
      },
    },
    stream,
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

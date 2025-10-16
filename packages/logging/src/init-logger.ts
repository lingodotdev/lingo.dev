// Logger initialization logic

import { mkdirSync, accessSync, constants as fsConstants } from "node:fs";
import pino from "pino";
import type { Logger } from "pino";
import { createStream } from "rotating-file-stream";
import type { LoggerCacheEntry, LoggerConfig } from "./types.js";
import {
  LOG_DIR,
  DEFAULT_LOG_LEVEL,
  ROTATION_CONFIG,
  DEFAULT_REDACT_PATHS,
} from "./constants.js";
import { registerExitHandler } from "./exit-handler.js";

// Singleton cache for logger instances, keyed by slug
const loggerCache = new Map<string, LoggerCacheEntry>();

/**
 * Initialize or retrieve a cached logger instance for the given slug.
 *
 * @param slug - Unique identifier for the logger
 * @returns Pino logger instance
 */
export function initLogger(slug: string): Logger {
  // Check if logger already exists in cache
  const cached = loggerCache.get(slug);
  if (cached) {
    return cached.logger;
  }

  // Ensure log directory exists
  ensureDirectoryExists(LOG_DIR);

  // Construct log file path
  const logFilePath = `${LOG_DIR}/${slug}.log`;

  // Create logger configuration
  const config: LoggerConfig = {
    slug,
    logDir: LOG_DIR,
    logFilePath,
  };

  // Create logger instance
  const logger = createLogger(config);

  // Register exit handler for graceful shutdown
  registerExitHandler(logger);

  // Cache the logger
  loggerCache.set(slug, { logger, config });

  return logger;
}

/**
 * Ensure a directory exists, creating it if necessary.
 * Throws an error if the directory cannot be created or accessed.
 */
function ensureDirectoryExists(dirPath: string): void {
  mkdirSync(dirPath, { recursive: true });
  accessSync(dirPath, fsConstants.W_OK);
}

/**
 * Create a Pino logger instance with rotation and redaction.
 */
function createLogger(config: LoggerConfig): Logger {
  // Create rotating file stream
  const stream = createStream(config.slug + ".log", {
    path: config.logDir,
    size: ROTATION_CONFIG.size,
    interval: ROTATION_CONFIG.interval,
    intervalBoundary: ROTATION_CONFIG.intervalBoundary,
    maxFiles: ROTATION_CONFIG.maxFiles,
    compress: false, // Don't compress rotated files
  });

  // Create Pino logger with the rotating stream
  const logger = pino(
    {
      level: DEFAULT_LOG_LEVEL,
      // Redact sensitive data
      redact: {
        paths: [...DEFAULT_REDACT_PATHS],
        censor: "[REDACTED]",
      },
      // Use pretty printing in development
      transport:
        process.env.NODE_ENV === "development"
          ? {
              target: "pino-pretty",
              options: {
                colorize: true,
                translateTime: "SYS:standard",
                ignore: "pid,hostname",
              },
            }
          : undefined,
    },
    stream
  );

  return logger;
}

// Logger initialization logic

import { mkdirSync, accessSync, constants as fsConstants } from "node:fs";
import pino from "pino";
import type { Logger } from "pino";
import type { LoggerCacheEntry, LoggerConfig } from "./types.js";
import {
  LOG_DIR,
  DEFAULT_LOG_LEVEL,
  DEFAULT_REDACT_PATHS,
} from "./constants.js";

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
 * Create a Pino logger instance with file destination and redaction.
 * Uses pino.destination() which is optimal for CLI applications.
 */
function createLogger(config: LoggerConfig): Logger {
  // Use pino.destination for reliable file writes with immediate flushing
  // This is the recommended approach for CLI tools as of October 2025
  const destination = pino.destination({
    dest: config.logFilePath,
    sync: true, // Synchronous writes ensure immediate persistence for CLI apps
    mkdir: true, // Auto-create directory
  });

  // Create Pino logger with the destination
  const logger = pino(
    {
      level: DEFAULT_LOG_LEVEL,
      // Redact sensitive data
      redact: {
        paths: [...DEFAULT_REDACT_PATHS],
        censor: "[REDACTED]",
      },
    },
    destination
  );

  return logger;
}

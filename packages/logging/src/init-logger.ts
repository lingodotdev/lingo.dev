// Logger initialization logic

import { mkdirSync, accessSync, constants as fsConstants } from "node:fs";
import pino from "pino";
import type { Logger } from "pino";
import { createStream } from "rotating-file-stream";
import type { LoggerCacheEntry, LoggerConfig } from "./types.js";
import {
  PRIMARY_LOG_DIR,
  FALLBACK_LOG_DIR,
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

  // Resolve log directory (primary or fallback)
  const logDir = resolveLogDirectory();

  // Construct log file path
  const logFilePath = `${logDir}/${slug}.log`;

  // Create logger configuration
  const config: LoggerConfig = {
    slug,
    logDir,
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
 * Resolve the log directory, trying primary first, then fallback.
 */
function resolveLogDirectory(): string {
  try {
    // Try to use the primary directory
    return ensureDirectoryExists(PRIMARY_LOG_DIR);
  } catch (primaryError) {
    // If primary fails, try fallback directory
    try {
      return ensureDirectoryExists(FALLBACK_LOG_DIR);
    } catch (fallbackError) {
      throw new Error(
        `Failed to create log directory. Primary: ${primaryError instanceof Error ? primaryError.message : String(primaryError)}. Fallback: ${fallbackError instanceof Error ? fallbackError.message : String(fallbackError)}`
      );
    }
  }
}

/**
 * Ensure a directory exists, creating it if necessary.
 * Throws an error if the directory cannot be created or accessed.
 */
function ensureDirectoryExists(dirPath: string): string {
  try {
    // Try to create the directory (recursive: true will create parent dirs)
    mkdirSync(dirPath, { recursive: true });

    // Verify we can write to the directory
    accessSync(dirPath, fsConstants.W_OK);

    return dirPath;
  } catch (error) {
    // Handle specific error cases
    if (error && typeof error === "object" && "code" in error) {
      const code = (error as { code: string }).code;

      if (code === "EACCES" || code === "EPERM") {
        throw new Error(`Permission denied: cannot write to ${dirPath}`);
      }

      if (code === "EROFS") {
        throw new Error(`Read-only filesystem: cannot write to ${dirPath}`);
      }

      if (code === "ENOSPC") {
        throw new Error(`No space left on device: ${dirPath}`);
      }
    }

    // Re-throw with more context
    throw new Error(
      `Failed to create or access directory ${dirPath}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
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

  // Handle stream errors
  stream.on("error", (err) => {
    console.error(`[Logging] Stream error for ${config.slug}:`, err);
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

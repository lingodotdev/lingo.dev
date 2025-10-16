import { mkdirSync, accessSync, constants as fsConstants } from "node:fs";
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
 *
 * @param slug - Unique identifier for the logger
 * @returns Pino logger instance
 */
export function initLogger(slug: string): Logger {
  const cached = loggerCache.get(slug);
  if (cached) {
    return cached.logger;
  }

  ensureDirectoryExists(LOG_DIR);

  const logFilePath = `${LOG_DIR}/${slug}.log`;

  const config: LoggerConfig = {
    slug,
    logDir: LOG_DIR,
    logFilePath,
  };

  const logger = createLogger(config);

  loggerCache.set(slug, { logger, config });

  return logger;
}

/**
 * Ensure a directory exists and is writable.
 * Throws if the directory cannot be created or accessed.
 */
function ensureDirectoryExists(dirPath: string): void {
  mkdirSync(dirPath, { recursive: true });
  accessSync(dirPath, fsConstants.W_OK);
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

  const logger = pino(
    {
      level: DEFAULT_LOG_LEVEL,
      redact: {
        paths: [...DEFAULT_REDACT_PATHS],
        censor: "[REDACTED]",
      },
    },
    destination
  );

  return logger;
}

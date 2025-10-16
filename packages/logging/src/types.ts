// Type definitions for the logging package

import type { Logger } from "pino";

/**
 * Internal configuration for the logger
 */
export interface LoggerConfig {
  slug: string;
  logDir: string;
  logFilePath: string;
}

/**
 * Cache entry for singleton logger instances
 */
export interface LoggerCacheEntry {
  logger: Logger;
  config: LoggerConfig;
}

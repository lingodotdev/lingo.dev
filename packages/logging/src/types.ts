import type { Logger } from "pino";

export interface LoggerConfig {
  slug: string;
  logDir: string;
  logFilePath: string;
}

export interface LoggerCacheEntry {
  logger: Logger;
  config: LoggerConfig;
}

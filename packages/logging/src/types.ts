import type { Logger } from "pino";

export type LoggerConfig = {
  slug: string;
  logDir: string;
  logFilePath: string;
};

export type LoggerCacheEntry = {
  logger: Logger;
  config: LoggerConfig;
};

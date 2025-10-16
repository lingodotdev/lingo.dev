// Constants for the logging package

import envPaths from "env-paths";

const paths = envPaths("lingo.dev", { suffix: "" });

/**
 * Log directory (user's state/log directory)
 */
export const LOG_DIR = paths.log;

/**
 * Default log level
 */
export const DEFAULT_LOG_LEVEL = "info";

/**
 * Default paths to redact in logs
 */
export const DEFAULT_REDACT_PATHS = [
  "apiKey",
  "*.apiKey",
  "accessToken",
  "*.accessToken",
  "password",
  "*.password",
  "secret",
  "*.secret",
  "authorization",
  "*.authorization",
] as const;

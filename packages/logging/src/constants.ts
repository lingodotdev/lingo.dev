// Constants for the logging package

import envPaths from "env-paths";

const paths = envPaths("lingo.dev");

/**
 * Log directory (user's state/log directory)
 */
export const LOG_DIR = paths.log;

/**
 * Default log level
 */
export const DEFAULT_LOG_LEVEL = "info";

/**
 * Log rotation settings
 */
export const ROTATION_CONFIG = {
  /**
   * Rotate daily at midnight UTC
   */
  interval: "1d" as const,

  /**
   * Align rotation to day boundaries
   */
  intervalBoundary: true,

  /**
   * Maximum file size before rotation (10MB)
   */
  size: "10M" as const,

  /**
   * Maximum number of rotated files to keep
   */
  maxFiles: 7,
} as const;

/**
 * Default paths to redact in logs
 */
export const DEFAULT_REDACT_PATHS = [
  "*.apiKey",
  "*.accessToken",
  "*.password",
  "*.secret",
  "*.authorization",
] as const;

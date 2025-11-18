import envPaths from "env-paths";

const paths = envPaths("lingo.dev", { suffix: "" });

export const LOG_DIR = paths.log;

export const DEFAULT_LOG_LEVEL = "info";

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

// Smart defaults for log rotation
export const LOG_ROTATION_MAX_SIZE = "10M"; // Rotate when file reaches 10MB
export const LOG_ROTATION_MAX_FILES = 10; // Keep last 10 rotated files
export const LOG_ROTATION_INTERVAL = "1d"; // Daily rotation
export const LOG_ROTATION_COMPRESS = "gzip" as const; // Compress old files

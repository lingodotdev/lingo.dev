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

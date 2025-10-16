// Type definitions for the logging package

export interface InitLoggerOptions {
  slug?: string;
  projectPath?: string;
  level?: string;
  redact?: string[];
}

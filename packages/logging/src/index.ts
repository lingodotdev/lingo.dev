// Main entry point for @lingo.dev/_logging package

export { initLogger } from "./init-logger.js";
export { detectProjectPath } from "./detect-project-path.js";

// Re-export Logger type from pino so consumers don't need to import pino directly
export type { Logger } from "pino";

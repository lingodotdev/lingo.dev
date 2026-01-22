#!/usr/bin/env node

/**
 * CLI Entry Point
 *
 * This is the main entry point for the translate CLI command.
 * It initializes the application and passes command-line arguments.
 */

import { App } from "../App.js";

// Create and run the application
const app = new App();
app.run(process.argv).catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

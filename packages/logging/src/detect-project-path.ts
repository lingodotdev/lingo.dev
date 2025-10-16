// Project path detection utility

import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { cwd } from "node:process";

// Config files to search for, in order of precedence
const CONFIG_FILES = [
  "i18n.json",
  "next.config.js",
  "next.config.mjs",
  "next.config.ts",
  "vite.config.js",
  "vite.config.mjs",
  "vite.config.ts",
] as const;

/**
 * Detect the project root directory by searching for config files.
 * Searches upward from the current working directory until a config file is found.
 *
 * @returns The detected project root path, or null if no config is found
 */
export function detectProjectPath(): string | null {
  let currentDir = cwd();
  const root = resolve("/");

  // Traverse upward until we find a config file or reach the root
  while (true) {
    // Check if any config file exists in the current directory
    for (const configFile of CONFIG_FILES) {
      const configPath = resolve(currentDir, configFile);
      if (existsSync(configPath)) {
        return currentDir;
      }
    }

    // If we've reached the filesystem root, stop
    if (currentDir === root) {
      break;
    }

    // Move up one directory
    const parentDir = dirname(currentDir);

    // If we can't go up anymore (shouldn't happen, but safety check)
    if (parentDir === currentDir) {
      break;
    }

    currentDir = parentDir;
  }

  // No config file found
  return null;
}

import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { cwd } from "node:process";

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
 * Detect the project root by searching upward for known config files.
 *
 * @returns The project root path, or null if no config file is found
 */
export function detectProjectPath(): string | null {
  let currentDir = cwd();
  const root = resolve("/");

  while (true) {
    for (const configFile of CONFIG_FILES) {
      const configPath = resolve(currentDir, configFile);
      if (existsSync(configPath)) {
        return currentDir;
      }
    }

    if (currentDir === root) {
      break;
    }

    currentDir = dirname(currentDir);
  }

  return null;
}

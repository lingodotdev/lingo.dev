import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { cwd } from "node:process";

/**
 * Detect the project root by searching upward for specified config files.
 *
 * @param configFiles - Array of config filenames to search for (e.g., ['i18n.json'])
 * @returns The project root path, or null if no config file is found
 */
export function detectProjectPath(
  configFiles: readonly string[],
): string | null {
  let currentDir = cwd();
  const root = resolve("/");

  while (true) {
    for (const configFile of configFiles) {
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

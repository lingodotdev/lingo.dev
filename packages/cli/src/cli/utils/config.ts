import _ from "lodash";
import fs from "fs";
import path from "path";
import { I18nConfig, parseI18nConfig } from "@lingo.dev/_spec";

let _cachedConfigPath: string | null = null;
let _cachedConfigRoot: string | null = null;

export function getConfig(resave = true): I18nConfig | null {
  const configInfo = _findConfigPath();
  if (!configInfo) {
    return null;
  }

  const { configPath, configRoot } = configInfo;

  const fileContents = fs.readFileSync(configPath, "utf8");
  const rawConfig = JSON.parse(fileContents);

  const result = parseI18nConfig(rawConfig);
  const didConfigChange = !_.isEqual(rawConfig, result);

  if (resave && didConfigChange) {
    // Ensure the config is saved with the latest version / schema
    saveConfig(result);
  }

  return result;
}

export function getConfigOrThrow(resave = true): I18nConfig {
  const config = getConfig(resave);

  if (!config) {
    // Try to find configs in subdirectories to provide helpful error message
    const foundBelow = findConfigsDownwards();
    if (foundBelow.length > 0) {
      const configList = foundBelow
        .slice(0, 5) // Limit to 5 to avoid overwhelming output
        .map((p) => `  - ${p}`)
        .join("\n");
      const moreText =
        foundBelow.length > 5
          ? `\n  ... and ${foundBelow.length - 5} more`
          : "";
      throw new Error(
        `i18n.json not found in current directory or parent directories.\n\n` +
          `Found ${foundBelow.length} config file(s) in subdirectories:\n` +
          configList +
          moreText +
          `\n\nPlease cd into one of these directories, or run \`lingo.dev init\` to initialize a new project.`,
      );
    } else {
      throw new Error(
        `i18n.json not found. Please run \`lingo.dev init\` to initialize the project.`,
      );
    }
  }

  return config;
}

export function saveConfig(config: I18nConfig) {
  const configInfo = _findConfigPath();
  if (!configInfo) {
    throw new Error("Cannot save config: i18n.json not found");
  }

  const serialized = JSON.stringify(config, null, 2);
  fs.writeFileSync(configInfo.configPath, serialized);

  return config;
}

export function getConfigRoot(): string | null {
  const configInfo = _findConfigPath();
  return configInfo?.configRoot || null;
}

export function findConfigsDownwards(
  startDir: string = process.cwd(),
  maxDepth: number = 3,
): string[] {
  const found: string[] = [];

  function search(dir: string, depth: number) {
    if (depth > maxDepth) return;

    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          // Skip common directories that shouldn't contain configs
          if (
            entry.name === "node_modules" ||
            entry.name === ".git" ||
            entry.name === "dist" ||
            entry.name === "build" ||
            entry.name.startsWith(".")
          ) {
            continue;
          }

          const subDir = path.join(dir, entry.name);
          const configPath = path.join(subDir, "i18n.json");

          if (fs.existsSync(configPath)) {
            found.push(path.relative(startDir, configPath));
          }

          search(subDir, depth + 1);
        }
      }
    } catch (error) {
      // Ignore permission errors, etc.
    }
  }

  search(startDir, 0);
  return found;
}

// Private

function _findConfigPath(): { configPath: string; configRoot: string } | null {
  // Use cached path if available
  if (_cachedConfigPath && _cachedConfigRoot) {
    return { configPath: _cachedConfigPath, configRoot: _cachedConfigRoot };
  }

  const result = _findConfigUpwards(process.cwd());
  if (result) {
    _cachedConfigPath = result.configPath;
    _cachedConfigRoot = result.configRoot;
  }

  return result;
}

function _findConfigUpwards(
  startDir: string,
): { configPath: string; configRoot: string } | null {
  let currentDir = path.resolve(startDir);
  const root = path.parse(currentDir).root;

  while (true) {
    const configPath = path.join(currentDir, "i18n.json");

    if (fs.existsSync(configPath)) {
      return {
        configPath,
        configRoot: currentDir,
      };
    }

    // Check if we've reached the filesystem root
    if (currentDir === root) {
      break;
    }

    // Move up one directory
    currentDir = path.dirname(currentDir);
  }

  return null;
}

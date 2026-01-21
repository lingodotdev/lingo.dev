/**
 * Path resolution utilities
 * Centralize path construction logic to eliminate duplication
 */

import path from "path";
import type { PathConfig } from "../types";

/**
 * Resolve a path to absolute, using cwd as base if relative
 *
 * @param configPath - Path from config (may be relative or absolute)
 * @param basePath - Base path to resolve against (defaults to cwd)
 * @returns Absolute path
 *
 * @example
 * ```typescript
 * resolveAbsolutePath("src") // -> "/full/path/to/cwd/src"
 * resolveAbsolutePath("/abs/path") // -> "/abs/path"
 * ```
 */
export function resolveAbsolutePath(
  configPath: string,
  basePath: string = process.cwd(),
): string {
  return path.isAbsolute(configPath)
    ? configPath
    : path.join(basePath, configPath);
}

/**
 * Get the absolute path to the lingo directory
 *
 * @param config - Config with sourceRoot and lingoDir
 * @returns Absolute path to .lingo directory
 *
 * @example
 * ```typescript
 * getLingoDir({ sourceRoot: "src", lingoDir: ".lingo" })
 * // -> "/full/path/to/src/.lingo"
 * ```
 */
export function getLingoDir(config: PathConfig): string {
  const rootPath = resolveAbsolutePath(config.sourceRoot);
  return path.join(rootPath, config.lingoDir);
}

export function getCacheDir(config: PathConfig): string {
  const lingoDir = getLingoDir(config);
  return path.join(lingoDir, "cache");
}

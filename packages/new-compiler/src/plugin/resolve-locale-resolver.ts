/**
 * Utilities for resolving custom locale resolver paths
 */

import fs from "fs";
import path from "path";

const EXTENSIONS = [".ts", ".tsx", ".js", ".jsx"];

/**
 * Normalize path for Turbopack compatibility
 * Turbopack requires forward slashes, even on Windows
 */
export function normalizeTurbopackPath(filePath: string): string {
  return filePath.replace(/\\/g, "/");
}

/**
 * Resolve a locale resolver file path
 * Tries the provided path with various extensions
 *
 * @param basePath - Base path from config (e.g., "./locale-resolver-server")
 * @param projectRoot - Project root directory
 * @returns Resolved absolute path
 */
function resolveResolverPath(basePath: string, projectRoot: string): string {
  // Try with the provided extension first
  const absolutePath = path.resolve(projectRoot, basePath);
  if (fs.existsSync(absolutePath)) {
    return absolutePath;
  }

  for (const ext of EXTENSIONS) {
    const pathWithExt = absolutePath + ext;
    if (fs.existsSync(pathWithExt)) {
      return pathWithExt;
    }
  }

  return absolutePath;
}

/**
 * Resolve custom locale resolver paths for Turbopack
 *
 * Convention: Custom resolvers must be located at:
 * - <sourceRoot>/<lingoDir>/locale-resolver-server.ts (or .js, .tsx, .jsx)
 * - <sourceRoot>/<lingoDir>/locale-resolver-client.ts (or .js, .tsx, .jsx)
 *
 * Returns relative, normalized paths for Turbopack.
 * Turbopack requires relative paths (starting with ./ or ../) to properly
 * bundle user files. Absolute paths are treated as external modules.
 *
 * @param sourceRoot - Source root directory (e.g., "./app")
 * @param lingoDir - Lingo directory (e.g., ".lingo")
 * @param projectRoot - Project root directory (for resolving absolute paths)
 * @returns Object with normalized server and client resolver paths (relative to projectRoot)
 */
export function resolveCustomResolverPaths(
  sourceRoot: string,
  lingoDir: string,
  projectRoot: string,
): {
  serverResolver: string;
  clientResolver: string;
} {
  const baseDir = path.join(projectRoot, sourceRoot, lingoDir);

  const serverPath = resolveResolverPath("locale-resolver-server", baseDir);
  const clientPath = resolveResolverPath("locale-resolver-client", baseDir);

  // Convert absolute paths to relative paths from projectRoot
  // Turbopack needs relative paths to bundle them correctly
  const relativeServerPath = path.relative(projectRoot, serverPath);
  const relativeClientPath = path.relative(projectRoot, clientPath);

  // Ensure paths start with ./ for Turbopack compatibility
  const serverWithPrefix = relativeServerPath.startsWith(".")
    ? relativeServerPath
    : `./${relativeServerPath}`;
  const clientWithPrefix = relativeClientPath.startsWith(".")
    ? relativeClientPath
    : `./${relativeClientPath}`;

  return {
    serverResolver: normalizeTurbopackPath(serverWithPrefix),
    clientResolver: normalizeTurbopackPath(clientWithPrefix),
  };
}

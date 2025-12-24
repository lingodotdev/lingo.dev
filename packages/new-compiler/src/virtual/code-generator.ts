/**
 * Shared code generation for virtual modules
 * Used by both unplugin (virtual modules) and Turbopack loaders
 *
 * This module provides FULL module generators, not just function bodies.
 * Both loaders and unplugin use these to generate complete modules.
 */

import type { LingoConfig } from "../types";
import { getCacheDir } from "../utils/path-helpers";

/**
 * Generate complete config module
 * Exports serverUrl and cacheDir constants
 */
export function generateConfigModule(config: LingoConfig): string {
  const serverUrl = config.dev.translationServerUrl;
  const cacheDir = getCacheDir(config);

  return `export const serverUrl = ${JSON.stringify(serverUrl)};
export const cacheDir = ${JSON.stringify(cacheDir)};
export const sourceLocale = ${JSON.stringify(config.sourceLocale)};
`;
}

/**
 * Generate complete locale/server module
 * Exports async getServerLocale() function
 */
export function generateServerLocaleModule(config: LingoConfig): string {
  return `
import { createNextCookieLocaleResolver } from '@lingo.dev/compiler/react/next';
export const getServerLocale = createNextCookieLocaleResolver({ cookieConfig: ${JSON.stringify(config.localePersistence.config)}, defaultLocale: ${JSON.stringify(config.sourceLocale)} });
`;
}

/**
 * Generate complete locale/client module
 * Exports getClientLocale() and persistLocale() functions
 */
export function generateClientLocaleModule(config: LingoConfig): string {
  const cookieName = config.localePersistence.config.name;
  const maxAge = config.localePersistence.config.maxAge;

  return `
export function getClientLocale() {
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(/${cookieName}=([^;]+)/);
    if (match) return match[1];
  }
  // Fallback to source locale
  return ${JSON.stringify(config.sourceLocale)};
}

export function persistLocale(locale) {
  if (typeof document !== 'undefined') {
    document.cookie = \`${cookieName}=\${locale}; path=/; max-age=${maxAge}\`;
  }
}
`;
}

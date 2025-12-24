/**
 * Core translation service - framework-agnostic
 * Handles fetching translations from dev server or filesystem
 *
 * This is the UNIVERSAL pattern that works across all frameworks:
 * Given a locale, fetch the translation dictionary for that locale.
 *
 * @module @lingo.dev/compiler/react/server/translations
 */

import { readFile } from "fs/promises";
import { join } from "path";
import { logger } from "../../utils/logger";
import { fetchTranslations as fetchFromDevServer } from "../shared/utils";
import { cacheDir, serverUrl } from "@lingo.dev/compiler/virtual/config";
import type { LocaleCode } from "lingo.dev/spec";

/**
 * Configuration for translation fetching
 */
export interface TranslationFetchConfig {
  /**
   * Base path for translation files (default: process.cwd())
   */
  basePath?: string;
}

/**
 * Read translations from filesystem
 * Used in production builds or as fallback in development
 *
 * Tries multiple common locations for translation files:
 * - .lingo/cache/{locale}.json (dev cache)
 * - .next/{locale}.json (Next.js)
 *
 * @param locale - Target locale
 * @param basePath - Base directory to search from (default: cwd)
 * @returns Translation dictionary (hash -> translated text)
 */
async function readFromFilesystem(
  locale: LocaleCode,
  basePath: string = process.cwd(),
): Promise<Record<string, string>> {
  // TODO (AleksandrSl 15/12/2025): What should be the correct way here to load translations on server for other frameworks?
  const possiblePaths = [
    join(basePath, cacheDir, `${locale}.json`),
    join(basePath, ".next", `${locale}.json`),
  ];

  // Try each path until we find the file
  for (const filePath of possiblePaths) {
    try {
      const fileContent = await readFile(filePath, "utf-8");
      const data = JSON.parse(fileContent);
      const translations = data.entries || {};

      logger.debug(
        `Loaded ${Object.keys(translations).length} translations from ${filePath}`,
      );
      return translations;
    } catch {
      // File doesn't exist at this path, try next one
      continue;
    }
  }

  // No translations found
  if (process.env.NODE_ENV === "development") {
    logger.warn(
      `Translation file not found for locale: ${locale}. Tried: ${possiblePaths.join(", ")}`,
    );
  }

  return {};
}

/**
 * Fetch translations for a given locale
 *
 * This is the CORE UNIVERSAL function that works across all frameworks.
 * It handles the logic of fetching translations from either:
 * - Development server (if running)
 * - Filesystem (production or fallback)
 *
 * Framework-specific code should NOT duplicate this logic.
 * Instead, they should:
 * 1. Resolve the locale (framework-specific: cookies, URL, headers, etc.)
 * 2. Call this function to get translations
 *
 * @example
 * ```typescript
 * // In Next.js locale resolver
 * const locale = await getLocaleFromCookies();
 * const translations = await fetchTranslations(locale);
 * ```
 *
 * @example
 * ```typescript
 * // In React Router loader
 * const locale = getLocaleFromUrl(request.url);
 * const translations = await fetchTranslations(locale);
 * ```
 */
export async function fetchTranslationsOnServer(
  locale: LocaleCode,
  hashes: string[],
  config: TranslationFetchConfig = {},
): Promise<Record<string, string>> {
  const isDev = process.env.NODE_ENV === "development";

  // Development mode: Try dev server first, then filesystem
  if (isDev && serverUrl) {
    logger.debug(
      `Server. Fetching translations for ${locale} and ${hashes.join(", ")} from dev server (${serverUrl})`,
    );
    try {
      return await fetchFromDevServer(locale, hashes, serverUrl);
    } catch (error) {
      logger.warn(
        `Failed to fetch translations from translation server: ${error}.`,
      );
      return {};
    }
  }

  logger.debug(`Reading translations for ${locale} from filesystem`);
  return await readFromFilesystem(locale, config.basePath);
}

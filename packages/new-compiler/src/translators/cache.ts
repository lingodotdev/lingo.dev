/**
 * Translation cache abstraction
 *
 * Cache stores hash -> translated text mappings for each locale.
 * It doesn't need to know about metadata structure or context -
 * it's purely an optimization layer.
 */

import type { LocaleCode } from "lingo.dev/spec";

/**
 * Translation cache interface
 * Implementations can be local disk, remote server, memory, etc.
 */
export interface TranslationCache {
  /**
   * Get cached translations for a locale
   * Returns empty object if no cache exists
   */
  get(locale: LocaleCode): Promise<Record<string, string>>;
  get(locale: LocaleCode, hashes: string[]): Promise<Record<string, string>>;

  /**
   * Update cache with new translations
   * Merges with existing cache (doesn't replace)
   */
  update(
    locale: LocaleCode,
    translations: Record<string, string>,
  ): Promise<void>;

  /**
   * Replace entire cache for a locale
   */
  set(locale: LocaleCode, translations: Record<string, string>): Promise<void>;

  /**
   * Check if cache exists for a locale
   */
  has(locale: LocaleCode): Promise<boolean>;

  /**
   * Clear cache for a specific locale
   */
  clear(locale: LocaleCode): Promise<void>;

  /**
   * Clear all cached translations
   */
  clearAll(): Promise<void>;
}

/**
 * Configuration for local disk cache
 */
export interface LocalCacheConfig {
  cacheDir: string;
}

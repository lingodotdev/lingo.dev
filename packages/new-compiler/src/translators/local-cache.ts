/**
 * Local disk-based translation cache implementation
 */

import * as fs from "fs/promises";
import * as path from "path";
import type { LocalCacheConfig, TranslationCache } from "./cache";
import { dictionaryFrom, type DictionarySchema } from "./api";
import { DEFAULT_TIMEOUTS, withTimeout } from "../utils/timeout";
import type { Logger } from "../utils/logger";
import type { LocaleCode } from "lingo.dev/spec";

/**
 * Local file system cache for translations
 * Stores translations as JSON files in .lingo/cache/
 */
export class LocalTranslationCache implements TranslationCache {
  private config: LocalCacheConfig;

  constructor(
    config: LocalCacheConfig,
    private logger: Logger,
  ) {
    this.config = config;
  }

  private getCachePath(locale: LocaleCode): string {
    return path.join(this.config.cacheDir, `${locale}.json`);
  }

  /**
   * Read dictionary file from disk
   * Times out after 10 seconds to prevent indefinite hangs
   */
  async getDictionary(locale: LocaleCode): Promise<DictionarySchema | null> {
    try {
      const cachePath = this.getCachePath(locale);
      const content = await withTimeout(
        fs.readFile(cachePath, "utf-8"),
        DEFAULT_TIMEOUTS.FILE_IO,
        `Read cache for ${locale}`,
      );
      return JSON.parse(content);
    } catch {
      return null;
    }
  }

  /**
   * Write dictionary file to disk
   * Times out after 10 seconds to prevent indefinite hangs
   */
  private async setDictionary(
    locale: LocaleCode,
    dictionary: DictionarySchema,
  ): Promise<void> {
    try {
      const cachePath = this.getCachePath(locale);
      const cacheDir = path.dirname(cachePath);

      // Ensure cache directory exists
      await withTimeout(
        fs.mkdir(cacheDir, { recursive: true }),
        DEFAULT_TIMEOUTS.FILE_IO,
        `Create cache directory for ${locale}`,
      );

      // Write cache file
      await withTimeout(
        fs.writeFile(cachePath, JSON.stringify(dictionary, null, 2), "utf-8"),
        DEFAULT_TIMEOUTS.FILE_IO,
        `Write cache for ${locale}`,
      );
    } catch (error) {
      this.logger.error(`Failed to write cache for locale ${locale}:`, error);
      throw error;
    }
  }

  /**
   * Get cached translations for a locale
   */
  async get(
    locale: LocaleCode,
    hashes?: string[],
  ): Promise<Record<string, string>> {
    const dictionary = await this.getDictionary(locale);
    if (!dictionary) {
      return {};
    }
    if (hashes) {
      return hashes.reduce(
        (acc, hash) => ({ ...acc, [hash]: dictionary.entries[hash] }),
        {},
      );
    }
    return dictionary.entries || {};
  }

  /**
   * Update cache with new translations (merge)
   */
  async update(
    locale: LocaleCode,
    translations: Record<string, string>,
  ): Promise<void> {
    const existing = await this.get(locale);

    const merged = { ...existing, ...translations };

    await this.set(locale, merged);
  }

  /**
   * Replace entire cache for a locale
   */
  async set(
    locale: LocaleCode,
    translations: Record<string, string>,
  ): Promise<void> {
    await this.setDictionary(locale, dictionaryFrom(locale, translations));
  }

  /**
   * Check if cache exists for a locale
   */
  async has(locale: LocaleCode): Promise<boolean> {
    try {
      const cachePath = this.getCachePath(locale);
      await fs.access(cachePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Clear cache for a specific locale
   */
  async clear(locale: LocaleCode): Promise<void> {
    try {
      const cachePath = this.getCachePath(locale);
      await fs.unlink(cachePath);
    } catch {
      // Ignore errors if file doesn't exist
    }
  }

  /**
   * Clear all cached translations
   */
  async clearAll(): Promise<void> {
    try {
      const files = await fs.readdir(this.config.cacheDir);

      await Promise.all(
        files
          .filter((file) => file.endsWith(".json"))
          .map((file) => fs.unlink(path.join(this.config.cacheDir, file))),
      );
    } catch {
      // Ignore errors if directory doesn't exist
    }
  }
}

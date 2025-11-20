/**
 * Server-side disk cache for translations
 * Only works in Node.js environments (Server Components)
 */

import * as fs from "fs/promises";
import * as path from "path";
import type { DictionarySchema } from "../react/server";

/**
 * Server-side cache configuration
 */
export interface ServerCacheConfig {
  cacheDir: string;
  sourceRoot?: string;
}

/**
 * Server-side translation cache (disk-based)
 */
export class ServerTranslationCache {
  private config: ServerCacheConfig;

  constructor(config: ServerCacheConfig) {
    this.config = config;
  }

  /**
   * Get cache file path for a locale
   */
  private getCachePath(locale: string): string {
    const baseDir = this.config.sourceRoot
      ? path.join(process.cwd(), this.config.sourceRoot, this.config.cacheDir)
      : path.join(process.cwd(), this.config.cacheDir);

    return path.join(baseDir, "cache", `${locale}.json`);
  }

  /**
   * Check if translations exist in cache for a locale
   */
  async has(locale: string): Promise<boolean> {
    try {
      const cachePath = this.getCachePath(locale);
      await fs.access(cachePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get cached translations for a locale
   */
  async get(locale: string): Promise<DictionarySchema | null> {
    try {
      const cachePath = this.getCachePath(locale);
      const content = await fs.readFile(cachePath, "utf-8");
      return JSON.parse(content);
    } catch {
      return null;
    }
  }

  /**
   * Extract flat hash -> translation map from dictionary
   */
  private extractTranslations(
    dictionary: DictionarySchema,
  ): Record<string, string> {
    const translations: Record<string, string> = {};
    for (const file of Object.values(dictionary.files)) {
      Object.assign(translations, file.entries);
    }
    return translations;
  }

  /**
   * Get flat hash -> translation map from cache
   */
  async getTranslations(locale: string): Promise<Record<string, string>> {
    const dictionary = await this.get(locale);
    if (!dictionary) {
      return {};
    }
    return this.extractTranslations(dictionary);
  }

  /**
   * Save translations to cache
   */
  async set(locale: string, dictionary: DictionarySchema): Promise<void> {
    try {
      const cachePath = this.getCachePath(locale);
      const cacheDir = path.dirname(cachePath);

      // Ensure cache directory exists
      await fs.mkdir(cacheDir, { recursive: true });

      // Write cache file
      await fs.writeFile(
        cachePath,
        JSON.stringify(dictionary, null, 2),
        "utf-8",
      );
    } catch (error) {
      console.error(
        `[lingo.dev] Failed to write cache for locale ${locale}:`,
        error,
      );
    }
  }

  /**
   * Clear cache for a specific locale
   */
  async clear(locale: string): Promise<void> {
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
      const baseDir = this.config.sourceRoot
        ? path.join(process.cwd(), this.config.sourceRoot, this.config.cacheDir)
        : path.join(process.cwd(), this.config.cacheDir);

      const cacheDir = path.join(baseDir, "cache");
      const files = await fs.readdir(cacheDir);

      await Promise.all(
        files
          .filter((file) => file.endsWith(".json"))
          .map((file) => fs.unlink(path.join(cacheDir, file))),
      );
    } catch {
      // Ignore errors if directory doesn't exist
    }
  }
}

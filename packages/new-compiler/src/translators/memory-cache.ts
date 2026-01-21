import type { TranslationCache } from "./cache";
import type { LocaleCode } from "lingo.dev/spec";

/**
 * In memory translation cache implementation
 */
export class MemoryTranslationCache implements TranslationCache {
  private cache: Map<LocaleCode, Map<string, string>> = new Map();

  constructor() {}

  async get(
    locale: LocaleCode,
    hashes?: string[],
  ): Promise<Record<string, string>> {
    const localeCache = this.cache.get(locale);
    if (!localeCache) {
      return {};
    }
    if (hashes) {
      return hashes.reduce(
        (acc, hash) => ({ ...acc, [hash]: localeCache.get(hash) }),
        {},
      );
    }
    return Object.fromEntries(localeCache);
  }

  /**
   * Update cache with new translations (merge)
   */
  async update(
    locale: LocaleCode,
    translations: Record<string, string>,
  ): Promise<void> {
    let localeCache = this.cache.get(locale);
    if (!localeCache) {
      localeCache = new Map();
      this.cache.set(locale, localeCache);
    }
    for (const [key, value] of Object.entries(translations)) {
      localeCache.set(key, value);
    }
  }

  /**
   * Replace entire cache for a locale
   */
  async set(
    locale: LocaleCode,
    translations: Record<string, string>,
  ): Promise<void> {
    this.cache.set(locale, new Map(Object.entries(translations)));
  }

  async has(locale: LocaleCode): Promise<boolean> {
    return this.cache.has(locale);
  }

  async clear(locale: LocaleCode): Promise<void> {
    this.cache.delete(locale);
  }

  async clearAll(): Promise<void> {
    this.cache.clear();
  }
}

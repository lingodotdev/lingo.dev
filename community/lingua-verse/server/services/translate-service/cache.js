import NodeCache from "node-cache";
import config from "../../config/index.js";

class TranslationCache {
  constructor() {
    this.cache = new NodeCache({
      stdTTL: config.cache.ttl,
      checkperiod: config.cache.checkPeriod,
      useClones: false, // Better performance
    });

    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
    };
  }

  /**
   * Generate cache key from translation parameters
   */
  generateKey(text, targetLang, sourceLang = "en", context = null) {
    const contextStr = context ? JSON.stringify(context) : "";
    return `${sourceLang}:${targetLang}:${contextStr}:${text}`;
  }

  /**
   * Get cached translation
   */
  get(text, targetLang, sourceLang = "en", context = null) {
    const key = this.generateKey(text, targetLang, sourceLang, context);
    const value = this.cache.get(key);

    if (value !== undefined) {
      this.stats.hits++;
      return value;
    }

    this.stats.misses++;
    return null;
  }

  /**
   * Set cached translation
   */
  set(text, targetLang, translation, sourceLang = "en", context = null) {
    const key = this.generateKey(text, targetLang, sourceLang, context);
    this.cache.set(key, translation);
    this.stats.sets++;
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const total = this.stats.hits + this.stats.misses;
    const hitRate =
      total > 0 ? ((this.stats.hits / total) * 100).toFixed(2) : 0;

    return {
      ...this.stats,
      total,
      hitRate: `${hitRate}%`,
      keys: this.cache.keys().length,
    };
  }

  /**
   * Clear all cached translations
   */
  clear() {
    this.cache.flushAll();
    this.stats = { hits: 0, misses: 0, sets: 0 };
  }
}

export default new TranslationCache();

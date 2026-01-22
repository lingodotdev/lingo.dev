import config from "../../config/index.js";
import cache from "./cache.js";
import { GLOSSARY_TERMS } from "../../../config/lingo-config/index.js";
import { LingoDotDevEngine } from "lingo.dev/sdk";

/**
 * Translation Service
 * Wraps Lingo.dev SDK with caching, batching, and fallback logic
 */
class TranslateService {
  constructor() {
    this.apiKey = config.lingo.apiKey;
    // Initialize Lingo.dev SDK
    this.engine = new LingoDotDevEngine({
      apiKey: this.apiKey,
    });
  }

  /**
   * Check if a term should be preserved (not translated)
   */
  shouldPreserveTerm(text) {
    return GLOSSARY_TERMS.PRESERVE.some((term) => text.includes(term));
  }

  /**
   * Apply custom glossary translations
   */
  applyGlossary(text, targetLang) {
    let result = text;

    Object.entries(GLOSSARY_TERMS.CUSTOM).forEach(([term, translations]) => {
      if (text.includes(term) && translations[targetLang]) {
        result = result.replace(
          new RegExp(term, "g"),
          translations[targetLang],
        );
      }
    });

    return result;
  }

  /**
   * Translate text using Lingo.dev SDK
   */
  async translate(text, targetLang, options = {}) {
    const { sourceLang = "en", context = null, useCache = true } = options;

    // Return original if same language
    if (sourceLang === targetLang) {
      return text;
    }

    // Check cache first
    if (useCache) {
      const cached = cache.get(text, targetLang, sourceLang, context);
      if (cached) {
        return cached;
      }
    }

    try {
      // Apply glossary preprocessing
      const processedText = this.applyGlossary(text, targetLang);

      // Use Lingo.dev SDK to translate
      const translation = await this.engine.localizeText(processedText, {
        sourceLocale: sourceLang,
        targetLocale: targetLang,
        fast: true, // Use fast mode for real-time chat
      });

      // Cache the result
      if (useCache) {
        cache.set(text, targetLang, translation, sourceLang, context);
      }

      return translation;
    } catch (error) {
      console.error("Translation error:", error);
      // Fallback: return original text
      return text;
    }
  }

  /**
   * Batch translate multiple texts
   */
  async translateBatch(texts, targetLang, options = {}) {
    const { sourceLang = "en", context = null, useCache = true } = options;

    // Check cache for all texts
    const results = [];
    const toTranslate = [];
    const indices = [];

    for (let i = 0; i < texts.length; i++) {
      const text = texts[i];

      if (useCache) {
        const cached = cache.get(text, targetLang, sourceLang, context);
        if (cached) {
          results[i] = cached;
          continue;
        }
      }

      toTranslate.push(text);
      indices.push(i);
    }

    // If all cached, return immediately
    if (toTranslate.length === 0) {
      return results;
    }

    try {
      // Use SDK's batch translation method
      const translations = await this.engine.localizeStringArray(toTranslate, {
        sourceLocale: sourceLang,
        targetLocale: targetLang,
        fast: true,
      });

      // Fill in results and cache
      translations.forEach((translation, i) => {
        const originalIndex = indices[i];
        results[originalIndex] = translation;

        if (useCache) {
          cache.set(
            toTranslate[i],
            targetLang,
            translation,
            sourceLang,
            context,
          );
        }
      });

      return results;
    } catch (error) {
      console.error("Batch translation error:", error);
      // Fallback: return original texts
      indices.forEach((originalIndex, i) => {
        results[originalIndex] = toTranslate[i];
      });
      return results;
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return cache.getStats();
  }

  /**
   * Clear translation cache
   */
  clearCache() {
    cache.clear();
  }
}

export default new TranslateService();

/**
 * Translation Service
 *
 * Handles text translation using the Lingo.dev SDK.
 * Provides graceful fallback if translation fails.
 */

import { LingoDotDevEngine } from "lingo.dev/sdk";

/**
 * TranslationService class manages text translation
 */
export class TranslationService {
  constructor(apiKey) {
    this.lingo = new LingoDotDevEngine({ apiKey });
  }

  /**
   * Translates text to target language
   *
   * @param {string} text - Text to translate
   * @param {string} targetLang - Target language code (ISO 639-1)
   * @returns {Promise<string>} - Translated text or original on error
   */
  async translate(text, targetLang = "en") {
    // Basic validation
    if (!text || typeof text !== "string") {
      return "";
    }

    // Skip translation if target is English
    if (!targetLang || targetLang === "en") {
      return text;
    }

    try {
      const result = await this.lingo.localizeText(text, {
        sourceLocale: "en",
        targetLocale: targetLang,
        fast: true, // Use fast translation mode
      });

      return result || text;
    } catch (error) {
      console.error(`Translation failed [${targetLang}]:`, error.message);
      // Graceful fallback to original text
      return text;
    }
  }

  /**
   * Translates multiple texts in parallel
   *
   * @param {string[]} texts - Array of texts to translate
   * @param {string} targetLang - Target language code
   * @returns {Promise<string[]>} - Array of translated texts
   */
  async translateMultiple(texts, targetLang = "en") {
    const promises = texts.map((text) => this.translate(text, targetLang));
    return Promise.all(promises);
  }
}

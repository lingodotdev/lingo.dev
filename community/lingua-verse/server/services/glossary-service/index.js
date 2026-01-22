import { GLOSSARY_TERMS } from "../../../config/lingo-config/index.js";

/**
 * Glossary Service
 * Manages team-specific terminology and custom translation rules
 */
class GlossaryService {
  constructor() {
    // In-memory storage for custom glossaries
    // In production, this would be a database
    this.customGlossaries = new Map();
  }

  /**
   * Get all preserved terms
   */
  getPreservedTerms() {
    return GLOSSARY_TERMS.PRESERVE;
  }

  /**
   * Get custom translations for a term
   */
  getCustomTranslations(term) {
    return GLOSSARY_TERMS.CUSTOM[term] || null;
  }

  /**
   * Add a custom glossary entry
   */
  addCustomEntry(term, translations) {
    this.customGlossaries.set(term, translations);
  }

  /**
   * Remove a custom glossary entry
   */
  removeCustomEntry(term) {
    this.customGlossaries.delete(term);
  }

  /**
   * Get all custom glossary entries
   */
  getAllCustomEntries() {
    return Object.fromEntries(this.customGlossaries);
  }

  /**
   * Check if a term should be preserved
   */
  shouldPreserve(term) {
    return GLOSSARY_TERMS.PRESERVE.includes(term);
  }

  /**
   * Get translation for a term in a specific language
   */
  getTranslation(term, targetLang) {
    // Check custom glossaries first
    if (this.customGlossaries.has(term)) {
      const translations = this.customGlossaries.get(term);
      return translations[targetLang] || null;
    }

    // Check default glossary
    const defaultTranslations = GLOSSARY_TERMS.CUSTOM[term];
    if (defaultTranslations) {
      return defaultTranslations[targetLang] || null;
    }

    return null;
  }

  /**
   * Export glossary for a specific language
   */
  exportForLanguage(targetLang) {
    const result = {};

    // Add default glossary terms
    Object.entries(GLOSSARY_TERMS.CUSTOM).forEach(([term, translations]) => {
      if (translations[targetLang]) {
        result[term] = translations[targetLang];
      }
    });

    // Add custom glossary terms
    this.customGlossaries.forEach((translations, term) => {
      if (translations[targetLang]) {
        result[term] = translations[targetLang];
      }
    });

    return result;
  }
}

export default new GlossaryService();

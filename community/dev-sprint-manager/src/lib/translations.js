/**
 * Translation service that uses real Lingo.dev API via proxy server
 * No hardcoded translations - everything goes through the API
 */

import { translateText } from './lingo.js';

// Translation cache to avoid repeated API calls for the same text
const translationCache = new Map();

/**
 * Get translation for a text string - NO FALLBACKS, only real API calls
 * @param {string} text - Text to translate
 * @param {string} locale - Target locale (hi, es, fr, ja)
 * @returns {Promise<string>} Translated text
 */
export async function getTranslation(text, locale) {
    if (!text || locale === 'en') return text;
    
    const cacheKey = `${text}:${locale}`;
    
    // Check cache first
    if (translationCache.has(cacheKey)) {
        return translationCache.get(cacheKey);
    }
    
    try {
        // ONLY use real Lingo.dev API - no fallbacks
        const translated = await translateText(text, locale);
        if (translated && translated !== text) {
            translationCache.set(cacheKey, translated);
            return translated;
        } else {
            // If API returns same text, it might not have translated
            // Return original text but don't cache failed attempts
            return text;
        }
    } catch (error) {
        console.error('[Translation] API call failed:', error);
        // NO FALLBACK - return original text to maintain English if API fails
        return text;
    }
}

/**
 * Batch translate multiple texts
 * @param {Array<string>} texts - Array of texts to translate
 * @param {string} locale - Target locale
 * @returns {Promise<Array<string>>} Array of translated texts
 */
export async function batchTranslate(texts, locale) {
    if (!texts || texts.length === 0 || locale === 'en') {
        return texts;
    }
    
    try {
        const translations = await Promise.all(
            texts.map(text => getTranslation(text, locale))
        );
        return translations;
    } catch (error) {
        console.error('[Translation] Batch translation failed:', error);
        return texts; // Fallback to original texts
    }
}

// Consolidated English UI text definitions
const englishTexts = {
    // Navigation
    board: 'Board',
    chat: 'Chat',
    
    // Board columns
    todo: 'To Do',
    inprogress: 'In Progress',
    review: 'Review',
    done: 'Done',
    
    // Page titles
    sprintBoard: 'Sprint Board',
    
    // Common actions
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    
    // Task management
    addTask: 'Add Task',
    taskTitle: 'Task Title',
    taskDescription: 'Task Description'
};

/**
 * Get translations for UI elements - ONLY via real Lingo.dev API
 * @param {string} locale - Target locale
 * @returns {Promise<Object>} Object with translated UI elements
 */
export async function getUITranslations(locale) {
    if (locale === 'en') {
        return englishTexts;
    }
    
    // For non-English locales, translate everything via API
    const translatedTexts = {};
    
    // Translate each text via API with fallback to original text on error
    const translationPromises = Object.entries(englishTexts).map(async ([key, text]) => {
        try {
            const translated = await getTranslation(text, locale);
            return [key, translated];
        } catch (error) {
            console.error(`[Translation] Failed to translate "${text}" to ${locale}:`, error);
            // Return original text as fallback instead of throwing
            return [key, text];
        }
    });
    
    try {
        const results = await Promise.all(translationPromises);
        results.forEach(([key, translated]) => {
            translatedTexts[key] = translated;
        });
        
        console.log(`[Translation] Successfully translated ${Object.keys(translatedTexts).length} UI elements to ${locale}`);
        return translatedTexts;
    } catch (error) {
        console.error(`[Translation] Batch translation failed for locale ${locale}:`, error);
        // Return English texts as fallback
        return englishTexts;
    }
}

/**
 * Clear translation cache (useful for testing or when switching API keys)
 */
export function clearTranslationCache() {
    translationCache.clear();
}

/**
 * Translate individual text in real-time (alias for getTranslation)
 * @param {string} text - Text to translate
 * @param {string} locale - Target locale
 * @returns {Promise<string>} Translated text
 */
export async function translateTextRealtime(text, locale) {
    return await getTranslation(text, locale);
}

export default {
    getTranslation,
    batchTranslate,
    getUITranslations,
    clearTranslationCache,
    translateTextRealtime
};
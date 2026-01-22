/**
 * Lingo.dev Translation Service
 * Using local proxy server to handle Lingo.dev API calls and bypass CORS
 */

/**
 * Translate text using Lingo.dev via local proxy server
 * @param {string} text - Text to translate
 * @param {string} targetLocale - Target language code (hi, es, fr, ja)
 * @returns {Promise<string>} Translated text
 */
export async function translateText(text, targetLocale) {
    if (!text || targetLocale === 'en') return text;

    try {
        const response = await fetch('http://localhost:3001/api/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                sourceLocale: 'en',
                targetLocale: targetLocale
            })
        });

        if (response.ok) {
            const result = await response.json();
            return result.translatedText || text;
        } else {
            const errorData = await response.json();
            console.error('[Lingo.dev] Translation API error:', errorData);
            return text;
        }
    } catch (error) {
        console.error('[Lingo.dev] Translation error:', error);
        return text;
    }
}

/**
 * Translate chat messages via local proxy server
 * @param {Array} messages - Array of {name, text} objects
 * @param {string} targetLocale - Target language code
 * @returns {Promise<Array>} Translated messages
 */
export async function translateChat(messages, targetLocale) {
    if (!messages || messages.length === 0 || targetLocale === 'en') {
        return messages;
    }

    try {
        const translatedMessages = await Promise.all(
            messages.map(async (msg) => ({
                name: msg.name || 'User',
                text: await translateText(msg.content || msg.text, targetLocale)
            }))
        );

        return translatedMessages;
    } catch (error) {
        console.error('[Lingo.dev] Chat translation error:', error);
        return messages;
    }
}

/**
 * Batch translate to multiple languages via local proxy server
 * @param {string} text - Text to translate
 * @param {Array<string>} targetLocales - Array of target language codes
 * @returns {Promise<Array<string>>} Array of translations
 */
export async function batchTranslate(text, targetLocales) {
    if (!text || targetLocales.length === 0) return [];

    try {
        const results = await Promise.all(
            targetLocales.map(locale => translateText(text, locale))
        );
        return results;
    } catch (error) {
        console.error('[Lingo.dev] Batch translation error:', error);
        return targetLocales.map(() => text);
    }
}

/**
 * Detect language of text (simplified implementation)
 * @param {string} text - Text to analyze
 * @returns {Promise<string>} Detected language code
 */
export async function detectLanguage(text) {
    // Simple pattern-based detection for demo
    if (/[हिन्दी]/.test(text)) return 'hi';
    if (/[ñáéíóú]/.test(text)) return 'es';
    if (/[àâäéèêëïîôöùûüÿç]/.test(text)) return 'fr';
    if (/[ひらがなカタカナ漢字]/.test(text)) return 'ja';
    return 'en';
}

// Remove SDK exports since we're using proxy server
export default null;
const { LingoDotDevEngine } = require("lingo.dev/sdk");

// Initialize the Lingo.dev engine if KEY is present
const apiKey = process.env.LINGO_API_KEY;
let lingoDotDev = null;

if (apiKey && apiKey !== 'your_api_key_here') {
    lingoDotDev = new LingoDotDevEngine({ apiKey });
}

/**
 * Localizes an error message or object to the target language.
 * @param {string|object} content - The error message or object to localize.
 * @param {string} targetLocale - The target language code (e.g., 'es', 'fr').
 * @returns {Promise<string|object>} - The localized content.
 */
async function localizeError(content, targetLocale) {
  if (!targetLocale || targetLocale.startsWith('en')) {
    return content;
  }

  // MOCK MODE: If no API key is set, return mock translations
  if (!lingoDotDev) {
    console.log(`[Mock] Localizing to ${targetLocale}:`, JSON.stringify(content));
    const isString = typeof content === 'string';
    
    // Simple mock translation function
    const mockTranslate = (str) => `[${targetLocale}] ${str}`;

    if (isString) {
        return mockTranslate(content);
    } else {
        const translated = {};
        for (const [key, value] of Object.entries(content)) {
            if (typeof value === 'string') {
                translated[key] = mockTranslate(value);
            } else {
                translated[key] = value;
            }
        }
        return translated;
    }
  }

  try {
    const isString = typeof content === 'string';
    const input = isString ? { message: content } : content;

    const translated = await lingoDotDev.localizeObject(input, {
        sourceLocale: "en",
        targetLocale: targetLocale,
    });
    
    return isString ? translated.message : translated;

  } catch (error) {
    console.error("Localization failed:", error.message);
    return content;
  }
}

module.exports = { localizeError };

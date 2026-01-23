// Translation service using backend proxy to avoid CORS issues
// The backend server handles Lingo.dev SDK calls

const API_BASE_URL = "/api";

// Check if backend is available
let backendAvailable = false;

/**
 * Check backend server status
 */
async function checkBackendStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    backendAvailable = data.lingoConfigured;
    return data;
  } catch (error) {
    console.warn("Translation server not available:", error.message);
    backendAvailable = false;
    return null;
  }
}

// Check on module load
checkBackendStatus();

/**
 * Map UI language codes to Lingo.dev locale codes
 */
const localeMap = {
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  ja: "ja-JP",
  hi: "hi-IN",
  de: "de-DE",
  zh: "zh-CN",
  ar: "ar-SA",
  pt: "pt-PT",
  ru: "ru-RU",
};

/**
 * Convert UI language code to Lingo.dev locale code
 */
function mapToLingoLocale(languageCode) {
  return localeMap[languageCode] || languageCode;
}

/**
 * Translate text using backend API
 * @param {string} text - Text to translate
 * @param {string} targetLocale - Target language code
 * @param {string} sourceLocale - Source language code (optional)
 * @returns {Promise<string>} Translated text
 */
export async function translateText(text, targetLocale, sourceLocale = null) {
  if (!text || text.trim() === "") {
    return text;
  }

  if (sourceLocale && sourceLocale === targetLocale) {
    return text;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        targetLocale: mapToLingoLocale(targetLocale),
        sourceLocale: sourceLocale ? mapToLingoLocale(sourceLocale) : null,
        type: "text",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Translation failed");
    }

    const data = await response.json();
    return data.translated;
  } catch (error) {
    console.error("Translation error:", error.message);

    // Show user-friendly error
    if (error.message.includes("fetch")) {
      throw new Error(
        "Translation server not running. Start it with: npm run server",
      );
    }

    throw error;
  }
}

/**
 * Translate README markdown content
 * @param {string} markdown - README content
 * @param {string} targetLocale - Target language
 * @returns {Promise<string>} Translated markdown
 */
export async function translateReadme(markdown, targetLocale) {
  if (!markdown || markdown.trim() === "") return "";

  try {
    console.log(`🌍 Translating README to ${targetLocale}...`);

    const response = await fetch(`${API_BASE_URL}/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: markdown,
        targetLocale: mapToLingoLocale(targetLocale),
        sourceLocale: null,
        type: "readme",
      }),
    });

    if (!response.ok) {
      const error = await response.json();

      if (response.status === 503) {
        return `# ⚠️ Translation Service Not Available

> **Server Not Running:** The translation backend server is not running.

## How to Fix:

1. Open a new terminal
2. Navigate to the project: \`cd codebridge\`
3. Start the server: \`npm run server\`
4. Refresh this page and try again

---

## Original Content:

${markdown}`;
      }

      throw new Error(error.message || "Translation failed");
    }

    const data = await response.json();
    console.log("✅ README translation completed");
    return data.translated;
  } catch (error) {
    console.error("README translation error:", error);

    if (
      error.message.includes("fetch") ||
      error.message.includes("Failed to fetch")
    ) {
      return `# ⚠️ Translation Server Not Running

> **Error:** Could not connect to translation server.

## Quick Fix:

\`\`\`bash
# In a new terminal:
npm run server
\`\`\`

Then refresh and try again.

---

## Original Content:

${markdown}`;
    }

    return `# Translation Error

> ${error.message}

---

${markdown}`;
  }
}

/**
 * Translate code comments in batch
 * @param {Array} comments - Array of comment objects
 * @param {string} targetLocale - Target language
 * @returns {Promise<Array>} Array of translated comments
 */
export async function translateComments(comments, targetLocale) {
  if (!comments || comments.length === 0) return [];

  try {
    console.log(
      `🌍 Translating ${comments.length} comments to ${targetLocale}...`,
    );

    const texts = comments.map((c) => c.text.trim());

    const response = await fetch(`${API_BASE_URL}/translate-batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        texts,
        targetLocale: mapToLingoLocale(targetLocale),
        sourceLocale: null,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Batch translation failed");
    }

    const data = await response.json();

    const translatedComments = comments.map((comment, index) => ({
      ...comment,
      translatedText: data.translated[index],
    }));

    console.log("✅ Comment translation completed");
    return translatedComments;
  } catch (error) {
    console.error("Comment translation error:", error);

    // Return comments with error notice
    return comments.map((comment) => ({
      ...comment,
      translatedText: `[Server error: ${error.message}] ${comment.text}`,
      error: error.message,
    }));
  }
}

/**
 * Translate entire code file
 * @param {string} code - Source code
 * @param {string} language - Programming language
 * @param {string} targetLocale - Target language
 * @returns {Promise<string>} Code with translated comments
 */
export async function translateCode(code, language, targetLocale) {
  if (!code) return code;

  try {
    const { extractComments, injectTranslations } = await import(
      "../utils/codeParser.js"
    );

    const comments = extractComments(code, language);

    if (comments.length === 0) {
      console.warn("No comments found to translate");
      return code;
    }

    const translatedComments = await translateComments(comments, targetLocale);
    const translatedCode = injectTranslations(
      code,
      translatedComments,
      language,
    );

    return translatedCode;
  } catch (error) {
    console.error("Code translation error:", error);
    return code;
  }
}

/**
 * Generate AI summary of code using Lingo.dev
 * @param {string} code - Source code
 * @param {string} language - Programming language
 * @param {string} targetLocale - Target language for summary
 * @param {string} fileName - Name of the file
 * @returns {Promise<string>} AI-generated summary
 */
export async function summarizeCode(code, language, targetLocale, fileName) {
  if (!code) return "";

  try {
    console.log(`🤖 Generating AI summary for ${fileName}...`);

    const response = await fetch(`${API_BASE_URL}/summarize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        language,
        targetLocale: mapToLingoLocale(targetLocale),
        fileName,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Summarization failed");
    }

    const data = await response.json();
    console.log("✅ AI summary generated");
    return data.summary;
  } catch (error) {
    console.error("Summarization error:", error);

    if (
      error.message.includes("fetch") ||
      error.message.includes("Failed to fetch")
    ) {
      throw new Error(
        "Translation server not running. Start it with: npm run server",
      );
    }

    throw error;
  }
}

/**
 * Check if translation backend is configured and running
 * @returns {Promise<boolean>}
 */
export async function isLingoConfigured() {
  const status = await checkBackendStatus();
  return status?.lingoConfigured || false;
}

/**
 * Get backend server status
 * @returns {Promise<object>}
 */
export async function getServerStatus() {
  return await checkBackendStatus();
}

/**
 * Get supported language codes
 * @returns {Array<string>}
 */
export function getSupportedLanguages() {
  return Object.keys(localeMap);
}

/**
 * Get language name from code
 * @param {string} code - Language code
 * @returns {string} Language name
 */
export function getLanguageName(code) {
  const names = {
    en: "English",
    es: "Español",
    fr: "Français",
    ja: "日本語",
    hi: "हिन्दी",
    de: "Deutsch",
    zh: "中文",
    ar: "العربية",
    pt: "Português",
    ru: "Русский",
  };
  return names[code] || code;
}

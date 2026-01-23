require('dotenv').config();
const { LingoDotDevEngine } = require('lingo.dev/sdk');

function normalizeLang(code) {
  if (!code) return 'en';
  return String(code).toLowerCase().split('_')[0].split('-')[0];
}

let lingoEngine;
function getEngine() {
  if (!lingoEngine) {
    const apiKey = process.env.LINGO_API_KEY;
    if (!apiKey) return null;
    lingoEngine = new LingoDotDevEngine({ apiKey });
  }
  return lingoEngine;
}

async function translate(text, targetLang) {
  const lang = normalizeLang(targetLang);

  // Skip if target is English or no content
  if (!text || !text.trim()) return text;
  if (lang === 'en') return text;

  const engine = getEngine();
  if (!engine) {
    console.warn('⚠️ Lingo.dev translation skipped: missing LINGODOTDEV_API_KEY');
    return text;
  }

  try {
    const translated = await engine.localizeText(text, {
      sourceLocale: 'en',
      targetLocale: lang,
    });
    if (typeof translated === 'string' && translated.trim()) return translated;
    // Some SDKs return { output: string }
    if (typeof translated?.output === 'string' && translated.output.trim()) return translated.output;
    console.warn('⚠️ Lingo.dev translation returned empty/unknown shape, falling back to English');
    return text;
  } catch (err) {
    console.error('❌ Lingo.dev translation failed:', err.response?.data || err.message);
    return text;
  }
}

// Translate arbitrary input to English, auto-detecting source when possible.
async function translateToEnglish(text) {
  if (!text || !text.trim()) return text;
  const engine = getEngine();
  if (!engine) return text; // fall back: use original text
  try {
    const out = await engine.localizeText(text, {
      // omit sourceLocale to allow engine detection
      sourceLocale: 'en',
      targetLocale: 'en',
    });
    if (typeof out === 'string' && out.trim()) return out;
    if (typeof out?.output === 'string' && out.output.trim()) return out.output;
    return text;
  } catch (err) {
    console.error('❌ Lingo.dev input-to-English failed:', err.response?.data || err.message);
    return text;
  }
}

module.exports = { translate, translateToEnglish, normalizeLang };

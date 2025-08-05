/**
 * Data loader for locale names
 * For now, returns basic data to keep package size small
 * Full CLDR data can be loaded separately
 */

interface NameData {
  [key: string]: string;
}

// Basic data for common locales (keeps package size small)
const basicTerritories: Record<string, NameData> = {
  en: {
    US: "United States",
    CN: "China",
    DE: "Germany",
    FR: "France",
    GB: "United Kingdom",
    JP: "Japan",
    IN: "India",
    BR: "Brazil",
    CA: "Canada",
    AU: "Australia",
  },
  es: {
    US: "Estados Unidos",
    CN: "China",
    DE: "Alemania",
    FR: "Francia",
    GB: "Reino Unido",
    JP: "Japón",
    IN: "India",
    BR: "Brasil",
    CA: "Canadá",
    AU: "Australia",
  },
};

const basicLanguages: Record<string, NameData> = {
  en: {
    en: "English",
    es: "Spanish",
    zh: "Chinese",
    fr: "French",
    de: "German",
    ja: "Japanese",
    ko: "Korean",
    ar: "Arabic",
    hi: "Hindi",
    pt: "Portuguese",
  },
  es: {
    en: "inglés",
    es: "español",
    zh: "chino",
    fr: "francés",
    de: "alemán",
    ja: "japonés",
    ko: "coreano",
    ar: "árabe",
    hi: "hindi",
    pt: "portugués",
  },
};

const basicScripts: Record<string, NameData> = {
  en: {
    Latn: "Latin",
    Cyrl: "Cyrillic",
    Hans: "Simplified",
    Hant: "Traditional",
    Arab: "Arabic",
    Deva: "Devanagari",
    Hira: "Hiragana",
    Kana: "Katakana",
    Hang: "Hangul",
    Thai: "Thai",
  },
  es: {
    Latn: "latino",
    Cyrl: "cirílico",
    Hans: "simplificado",
    Hant: "tradicional",
    Arab: "árabe",
    Deva: "devanagari",
    Hira: "hiragana",
    Kana: "katakana",
    Hang: "hangul",
    Thai: "tailandés",
  },
};

/**
 * Loads country/territory names for a specific display language
 */
export async function loadTerritoryNames(
  displayLanguage: string,
): Promise<NameData> {
  // Return basic data for supported languages, fallback to English
  return basicTerritories[displayLanguage] || basicTerritories.en;
}

/**
 * Loads language names for a specific display language
 */
export async function loadLanguageNames(
  displayLanguage: string,
): Promise<NameData> {
  // Return basic data for supported languages, fallback to English
  return basicLanguages[displayLanguage] || basicLanguages.en;
}

/**
 * Loads script names for a specific display language
 */
export async function loadScriptNames(
  displayLanguage: string,
): Promise<NameData> {
  // Return basic data for supported languages, fallback to English
  return basicScripts[displayLanguage] || basicScripts.en;
}

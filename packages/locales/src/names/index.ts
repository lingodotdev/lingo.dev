import {
  loadTerritoryNames,
  loadLanguageNames,
  loadScriptNames,
} from "./loader";

/**
 * Gets a country name in the specified display language
 *
 * @param countryCode - The ISO country code (e.g., "US", "CN", "DE")
 * @param displayLanguage - The language to display the name in (default: "en")
 * @returns Promise<string> - The localized country name
 *
 * @example
 * ```typescript
 * // Default English
 * await getCountryName("US");           // "United States"
 * await getCountryName("CN");           // "China"
 *
 * // Spanish
 * await getCountryName("US", "es");     // "Estados Unidos"
 * await getCountryName("CN", "es");     // "China"
 *
 * // French
 * await getCountryName("US", "fr");     // "États-Unis"
 * ```
 */
export async function getCountryName(
  countryCode: string,
  displayLanguage: string = "en",
): Promise<string> {
  if (!countryCode) {
    throw new Error("Country code is required");
  }

  const territories = await loadTerritoryNames(displayLanguage);
  const name = territories[countryCode.toUpperCase()];

  if (!name) {
    throw new Error(`Country code "${countryCode}" not found`);
  }

  return name;
}

/**
 * Gets a language name in the specified display language
 *
 * @param languageCode - The ISO language code (e.g., "en", "zh", "es")
 * @param displayLanguage - The language to display the name in (default: "en")
 * @returns Promise<string> - The localized language name
 *
 * @example
 * ```typescript
 * // Default English
 * await getLanguageName("en");          // "English"
 * await getLanguageName("zh");          // "Chinese"
 *
 * // Spanish
 * await getLanguageName("en", "es");    // "inglés"
 * await getLanguageName("zh", "es");    // "chino"
 *
 * // Chinese
 * await getLanguageName("en", "zh");    // "英语"
 * ```
 */
export async function getLanguageName(
  languageCode: string,
  displayLanguage: string = "en",
): Promise<string> {
  if (!languageCode) {
    throw new Error("Language code is required");
  }

  const languages = await loadLanguageNames(displayLanguage);
  const name = languages[languageCode.toLowerCase()];

  if (!name) {
    throw new Error(`Language code "${languageCode}" not found`);
  }

  return name;
}

/**
 * Gets a script name in the specified display language
 *
 * @param scriptCode - The ISO script code (e.g., "Hans", "Hant", "Latn")
 * @param displayLanguage - The language to display the name in (default: "en")
 * @returns Promise<string> - The localized script name
 *
 * @example
 * ```typescript
 * // Default English
 * await getScriptName("Hans");          // "Simplified"
 * await getScriptName("Hant");          // "Traditional"
 * await getScriptName("Latn");          // "Latin"
 *
 * // Spanish
 * await getScriptName("Hans", "es");    // "simplificado"
 * await getScriptName("Cyrl", "es");    // "cirílico"
 *
 * // Chinese
 * await getScriptName("Latn", "zh");    // "拉丁文"
 * ```
 */
export async function getScriptName(
  scriptCode: string,
  displayLanguage: string = "en",
): Promise<string> {
  if (!scriptCode) {
    throw new Error("Script code is required");
  }

  const scripts = await loadScriptNames(displayLanguage);
  const name = scripts[scriptCode];

  if (!name) {
    throw new Error(`Script code "${scriptCode}" not found`);
  }

  return name;
}

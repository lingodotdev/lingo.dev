import type { LocaleComponents, LocaleDelimiter, ParseResult } from "./types";
import { LOCALE_REGEX } from "./constants";

/**
 * Normalizes the case of locale components before parsing
 *
 * @param locale - The locale string to normalize
 * @returns The normalized locale string
 *
 * @example
 * normalizeLocaleCase("EN-US")     // "en-US"
 * normalizeLocaleCase("en-us")     // "en-US"
 * normalizeLocaleCase("zh-hans-cn") // "zh-Hans-CN"
 */
function normalizeLocaleCase(locale: string): string {
  // Split by either hyphen or underscore
  const parts = locale.split(/[-_]/);

  if (parts.length === 1) {
    // Language only: normalize to lowercase
    return parts[0].toLowerCase();
  }

  if (parts.length === 2) {
    // Language-region: normalize language to lowercase, region to uppercase
    const language = parts[0].toLowerCase();
    const region = parts[1].toUpperCase();
    return `${language}-${region}`;
  }

  if (parts.length === 3) {
    // Language-script-region: normalize language to lowercase, preserve script case, region to uppercase
    const language = parts[0].toLowerCase();
    const script = parts[1]; // Preserve original case as-is
    const region = parts[2].toUpperCase();
    return `${language}-${script}-${region}`;
  }

  // For any other number of parts, return as-is
  return locale;
}

/**
 * Breaks apart a locale string into its components
 *
 * @param locale - The locale string to parse
 * @returns LocaleComponents object with language, script, and region
 *
 * @example
 * ```typescript
 * parseLocale("en-US");          // { language: "en", region: "US" }
 * parseLocale("en_US");          // { language: "en", region: "US" }
 * parseLocale("zh-Hans-CN");     // { language: "zh", script: "Hans", region: "CN" }
 * parseLocale("zh_Hans_CN");     // { language: "zh", script: "Hans", region: "CN" }
 * parseLocale("es");             // { language: "es" }
 * parseLocale("sr-Cyrl-RS");     // { language: "sr", script: "Cyrl", region: "RS" }
 * ```
 */
export function parseLocale(locale: string): LocaleComponents {
  if (typeof locale !== "string") {
    throw new Error("Locale must be a string");
  }

  if (!locale.trim()) {
    throw new Error("Locale cannot be empty");
  }

  // Normalize case before parsing:
  // - Language: convert to lowercase (e.g., "EN" -> "en")
  // - Script: preserve case (e.g., "Hans", "hans" -> "Hans")
  // - Region: convert to uppercase (e.g., "us" -> "US")
  const normalizedLocale = normalizeLocaleCase(locale);

  const match = normalizedLocale.match(LOCALE_REGEX);

  if (!match) {
    throw new Error(`Invalid locale format: ${locale}`);
  }

  const [, language, script, region] = match;

  const components: LocaleComponents = {
    language: language.toLowerCase(),
  };

  // Add script if present
  if (script) {
    components.script = script;
  }

  // Add region if present
  if (region) {
    components.region = region.toUpperCase();
  }

  return components;
}

/**
 * Parses a locale string and returns detailed information about the parsing result
 *
 * @param locale - The locale string to parse
 * @returns ParseResult with components, delimiter, and validation info
 */
export function parseLocaleWithDetails(locale: string): ParseResult {
  try {
    const components = parseLocale(locale);

    // Determine the delimiter used
    let delimiter: LocaleDelimiter | null = null;
    if (locale.includes("-")) {
      delimiter = "-";
    } else if (locale.includes("_")) {
      delimiter = "_";
    }

    return {
      components,
      delimiter,
      isValid: true,
    };
  } catch (error) {
    return {
      components: { language: "" },
      delimiter: null,
      isValid: false,
      error: error instanceof Error ? error.message : "Unknown parsing error",
    };
  }
}

/**
 * Extracts just the language code from a locale string
 *
 * @param locale - The locale string to parse
 * @returns The language code
 *
 * @example
 * ```typescript
 * getLanguageCode("en-US");      // "en"
 * getLanguageCode("zh-Hans-CN"); // "zh"
 * getLanguageCode("es-MX");      // "es"
 * getLanguageCode("fr_CA");      // "fr"
 * ```
 */
export function getLanguageCode(locale: string): string {
  return parseLocale(locale).language;
}

/**
 * Extracts the script code from a locale string
 *
 * @param locale - The locale string to parse
 * @returns The script code or null if not present
 *
 * @example
 * ```typescript
 * getScriptCode("zh-Hans-CN");   // "Hans"
 * getScriptCode("zh-Hant-TW");   // "Hant"
 * getScriptCode("sr-Cyrl-RS");   // "Cyrl"
 * getScriptCode("en-US");        // null
 * getScriptCode("es");           // null
 * ```
 */
export function getScriptCode(locale: string): string | null {
  const components = parseLocale(locale);
  return components.script || null;
}

/**
 * Extracts the region/country code from a locale string
 *
 * @param locale - The locale string to parse
 * @returns The region code or null if not present
 *
 * @example
 * ```typescript
 * getRegionCode("en-US");        // "US"
 * getRegionCode("zh-Hans-CN");   // "CN"
 * getRegionCode("es");           // null
 * getRegionCode("fr_CA");        // "CA"
 * ```
 */
export function getRegionCode(locale: string): string | null {
  const components = parseLocale(locale);
  return components.region || null;
}

import type { LocaleComponents, LocaleDelimiter, ParseResult } from "./types";

/**
 * Regular expression to parse locale strings
 *
 * Matches patterns like:
 * - "en-US" -> language: "en", region: "US"
 * - "en_US" -> language: "en", region: "US"
 * - "zh-Hans-CN" -> language: "zh", script: "Hans", region: "CN"
 * - "zh_Hans_CN" -> language: "zh", script: "Hans", region: "CN"
 * - "sr-Cyrl-RS" -> language: "sr", script: "Cyrl", region: "RS"
 * - "es" -> language: "es"
 *
 * Groups:
 * 1. Language code (2-3 lowercase letters)
 * 2. Script code (4 letters, optional)
 * 3. Region code (2-3 letters or digits, optional)
 */
const LOCALE_REGEX =
  /^([a-z]{2,3})(?:[-_]([A-Za-z]{4}))?(?:[-_]([A-Z]{2}|[0-9]{3}))?$/i;

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

  const match = locale.match(LOCALE_REGEX);

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

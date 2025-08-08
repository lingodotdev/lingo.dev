/**
 * Represents the components of a locale string
 */
export interface LocaleComponents {
  /** The language code (e.g., "en", "zh", "es") */
  language: string;
  /** The script code (e.g., "Hans", "Hant", "Cyrl") - optional */
  script?: string;
  /** The region/country code (e.g., "US", "CN", "RS") - optional */
  region?: string;
}

/**
 * Locale delimiter types
 */
export type LocaleDelimiter = "-" | "_";

/**
 * Validation result for locale parsing
 */
export interface ParseResult {
  /** The parsed locale components */
  components: LocaleComponents;
  /** The delimiter used in the original string */
  delimiter: LocaleDelimiter | null;
  /** Whether the locale string was valid */
  isValid: boolean;
  /** Error message if parsing failed */
  error?: string;
}

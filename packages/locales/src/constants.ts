/**
 * Shared constants for locale parsing and validation
 */

/**
 * Regular expression for parsing locale strings
 *
 * This regex is case-sensitive and expects normalized locale strings:
 * - Language code: 2-3 lowercase letters (e.g., "en", "zh", "es")
 * - Script code: 4 letters with preserved case (e.g., "Hans", "hans", "Cyrl")
 * - Region code: 2-3 uppercase letters or digits (e.g., "US", "CN", "123")
 *
 * Matches locale strings in the format: language[-_]script?[-_]region?
 *
 * Groups:
 * 1. Language code (2-3 lowercase letters)
 * 2. Script code (4 letters, optional)
 * 3. Region code (2-3 letters or digits, optional)
 *
 * Examples:
 * - "en" -> language: "en"
 * - "en-US" -> language: "en", region: "US"
 * - "zh-Hans-CN" -> language: "zh", script: "Hans", region: "CN"
 * - "sr_Cyrl_RS" -> language: "sr", script: "Cyrl", region: "RS"
 *
 * Note: The parser automatically normalizes case before applying this regex:
 * - Language codes are converted to lowercase
 * - Script codes preserve their original case
 * - Region codes are converted to uppercase
 */
export const LOCALE_REGEX =
  /^([a-z]{2,3})(?:[-_]([A-Za-z]{4}))?(?:[-_]([A-Z]{2}|[0-9]{3}))?$/;

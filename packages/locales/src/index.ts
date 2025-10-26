// Export types
export type { LocaleComponents, LocaleDelimiter, ParseResult } from "./types";

// Export constants
export { LOCALE_REGEX } from "./constants";

// Export parsing functions
export {
  parseLocale,
  parseLocaleWithDetails,
  getLanguageCode,
  getScriptCode,
  getRegionCode,
} from "./parser";

// Export validation functions
export {
  isValidLocale,
  isValidLanguageCode,
  isValidScriptCode,
  isValidRegionCode,
} from "./validation";

// Export async name resolution functions
export { getCountryName, getLanguageName, getScriptName } from "./names";

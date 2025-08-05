// Export types
export type { LocaleComponents, LocaleDelimiter, ParseResult } from "./types";

// Export parsing functions
export {
  parseLocale,
  parseLocaleWithDetails,
  getLanguageCode,
  getScriptCode,
  getRegionCode,
} from "./parser";

// Export async name resolution functions
export { getCountryName, getLanguageName, getScriptName } from "./names";

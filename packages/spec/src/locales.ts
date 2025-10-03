import Z from "zod";

const localeMap = {
  // Urdu (Pakistan)
  ur: ["ur-PK"],
  // Vietnamese (Vietnam)
  vi: ["vi-VN"],
  // Turkish (Turkey)
  tr: ["tr-TR"],
  // Tamil (India)
  ta: [
    "ta-IN", // India
    "ta-SG", // Singapore
  ],
  // Serbian
  sr: [
    "sr-RS", // Serbian (Latin)
    "sr-Latn-RS", // Serbian (Latin)
    "sr-Cyrl-RS", // Serbian (Cyrillic)
  ],
  // Hungarian (Hungary)
  hu: ["hu-HU"],
  // Hebrew (Israel)
  he: ["he-IL"],
  // Estonian (Estonia)
  et: ["et-EE"],
  // Greek
  el: [
    "el-GR", // Greece
    "el-CY", // Cyprus
  ],
  // Danish (Denmark)
  da: ["da-DK"],
  // Azerbaijani (Azerbaijan)
  az: ["az-AZ"],
  // Thai (Thailand)
  th: ["th-TH"],
  // Swedish (Sweden)
  sv: ["sv-SE"],
  // English
  en: [
    "en-US", // United States
    "en-GB", // United Kingdom
    "en-AU", // Australia
    "en-CA", // Canada
    "en-SG", // Singapore
    "en-IE", // Ireland
  ],
  // Spanish
  es: [
    "es-ES", // Spain
    "es-419", // Latin America
    "es-MX", // Mexico
    "es-AR", // Argentina
  ],
  // French
  fr: [
    "fr-FR", // France
    "fr-CA", // Canada
    "fr-BE", // Belgium
    "fr-LU", // Luxembourg
  ],
  // Catalan (Spain)
  ca: ["ca-ES"],
  // Japanese (Japan)
  ja: ["ja-JP"],
  // Kazakh (Kazakhstan)
  kk: ["kk-KZ"],
  // German
  de: [
    "de-DE", // Germany
    "de-AT", // Austria
    "de-CH", // Switzerland
  ],
  // Portuguese
  pt: [
    "pt-PT", // Portugal
    "pt-BR", // Brazil
  ],
  // Italian
  it: [
    "it-IT", // Italy
    "it-CH", // Switzerland
  ],
  // Russian
  ru: [
    "ru-RU", // Russia
    "ru-BY", // Belarus
  ],
  // Ukrainian (Ukraine)
  uk: ["uk-UA"],
  // Belarusian (Belarus)
  be: ["be-BY"],
  // Hindi (India)
  hi: ["hi-IN"],
  // Chinese
  zh: [
    "zh-CN", // Simplified Chinese (China)
    "zh-TW", // Traditional Chinese (Taiwan)
    "zh-HK", // Traditional Chinese (Hong Kong)
    "zh-SG", // Simplified Chinese (Singapore)
    "zh-Hans", // Simplified Chinese
    "zh-Hant", // Traditional Chinese
    "zh-Hant-HK", // Traditional Chinese (Hong Kong)
    "zh-Hant-TW", // Traditional Chinese (Taiwan)
    "zh-Hant-CN", // Traditional Chinese (China)
    "zh-Hans-HK", // Simplified Chinese (Hong Kong)
    "zh-Hans-TW", // Simplified Chinese (China)
    "zh-Hans-CN", // Simplified Chinese (China)
  ],
  // Korean (South Korea)
  ko: ["ko-KR"],
  // Arabic
  ar: [
    "ar-EG", // Egypt
    "ar-SA", // Saudi Arabia
    "ar-AE", // United Arab Emirates
    "ar-MA", // Morocco
  ],
  // Bulgarian (Bulgaria)
  bg: ["bg-BG"],
  // Czech (Czech Republic)
  cs: ["cs-CZ"],
  // Welsh (Wales)
  cy: ["cy-GB"],
  // Dutch
  nl: [
    "nl-NL", // Netherlands
    "nl-BE", // Belgium
  ],
  // Polish (Poland)
  pl: ["pl-PL"],
  // Indonesian (Indonesia)
  id: ["id-ID"],
  is: ["is-IS"],
  // Malay (Malaysia)
  ms: ["ms-MY"],
  // Finnish (Finland)
  fi: ["fi-FI"],
  // Basque (Spain)
  eu: ["eu-ES"],
  // Croatian (Croatia)
  hr: ["hr-HR"],
  // Hebrew (Israel) - alternative code
  iw: ["iw-IL"],
  // Khmer (Cambodia)
  km: ["km-KH"],
  // Latvian (Latvia)
  lv: ["lv-LV"],
  // Lithuanian (Lithuania)
  lt: ["lt-LT"],
  // Norwegian
  no: [
    "no-NO", // Norway (legacy)
    "nb-NO", // Norwegian Bokmål
    "nn-NO", // Norwegian Nynorsk
  ],
  // Romanian (Romania)
  ro: ["ro-RO"],
  // Slovak (Slovakia)
  sk: ["sk-SK"],
  // Swahili
  sw: [
    "sw-TZ", // Tanzania
    "sw-KE", // Kenya
    "sw-UG", // Uganda
    "sw-CD", // Democratic Republic of Congo
    "sw-RW", // Rwanda
  ],
  // Persian (Iran)
  fa: ["fa-IR"],
  // Filipino (Philippines)
  fil: ["fil-PH"],
  // Punjabi
  pa: [
    "pa-IN", // India
    "pa-PK", // Pakistan
  ],
  // Bengali
  bn: [
    "bn-BD", // Bangladesh
    "bn-IN", // India
  ],
  // Irish (Ireland)
  ga: ["ga-IE"],
  // Galician (Spain)
  gl: ["gl-ES"],
  // Maltese (Malta)
  mt: ["mt-MT"],
  // Slovenian (Slovenia)
  sl: ["sl-SI"],
  // Albanian (Albania)
  sq: ["sq-AL"],
  // Bavarian (Germany)
  bar: ["bar-DE"],
  // Neapolitan (Italy)
  nap: ["nap-IT"],
  // Afrikaans (South Africa)
  af: ["af-ZA"],
  // Uzbek (Latin)
  uz: ["uz-Latn"],
  // Somali (Somalia)
  so: ["so-SO"],
  // Tigrinya (Ethiopia)
  ti: ["ti-ET"],
  // Standard Moroccan Tamazight (Morocco)
  zgh: ["zgh-MA"],
  // Tagalog (Philippines)
  tl: ["tl-PH"],
  // Telugu (India)
  te: ["te-IN"],
  // Kinyarwanda (Rwanda)
  rw: ["rw-RW"],
  // Georgian (Georgia)
  ka: ["ka-GE"],
  // Malayalam (India)
  ml: ["ml-IN"],
  // Armenian (Armenia)
  hy: ["hy-AM"],
  // Macedonian (Macedonia)
  mk: ["mk-MK"],
} as const;

export type LocaleCodeShort = keyof typeof localeMap;
export type LocaleCodeFull = (typeof localeMap)[LocaleCodeShort][number];
export type LocaleCode = LocaleCodeShort | LocaleCodeFull;
export type LocaleDelimiter = "-" | "_" | null;

export const localeCodesShort = Object.keys(localeMap) as LocaleCodeShort[];
export const localeCodesFull = Object.values(
  localeMap,
).flat() as LocaleCodeFull[];
export const localeCodesFullUnderscore = localeCodesFull.map((value) =>
  value.replace("-", "_"),
);
export const localeCodesFullExplicitRegion = localeCodesFull.map((value) => {
  const chunks = value.split("-");
  const result = [chunks[0], "-r", chunks.slice(1).join("-")].join("");
  return result;
});
export const localeCodes = [
  ...localeCodesShort,
  ...localeCodesFull,
  ...localeCodesFullUnderscore,
  ...localeCodesFullExplicitRegion,
] as LocaleCode[];

export const localeCodeSchema = Z.string().refine(
  (value) => localeCodes.includes(value as any),
  {
    message: "Invalid locale code",
  },
);

/**
 * Resolves a locale code to its full locale representation.
 *
 *  If the provided locale code is already a full locale code, it returns as is.
 *  If the provided locale code is a short locale code, it returns the first corresponding full locale.
 *  If the locale code is not found, it throws an error.
 *
 * @param {localeCodes} value - The locale code to resolve (either short or full)
 * @return {LocaleCodeFull} The resolved full locale code
 * @throws {Error} If the provided locale code is invalid.
 */
export const resolveLocaleCode = (value: string): LocaleCodeFull => {
  const existingFullLocaleCode = Object.values(localeMap)
    .flat()
    .includes(value as any);
  if (existingFullLocaleCode) {
    return value as LocaleCodeFull;
  }

  const existingShortLocaleCode = Object.keys(localeMap).includes(value);
  if (existingShortLocaleCode) {
    const correspondingFullLocales = localeMap[value as LocaleCodeShort];
    const fallbackFullLocale = correspondingFullLocales[0];
    return fallbackFullLocale;
  }

  throw new Error(`Invalid locale code: ${value}`);
};

/**
 * Determines the delimiter used in a locale code
 *
 * @param {string} locale - the locale string (e.g.,"en_US","en-GB")
 * @return { string | null} - The delimiter ("_" or "-") if found, otherwise `null`.
 */

export const getLocaleCodeDelimiter = (locale: string): LocaleDelimiter => {
  if (locale.includes("_")) {
    return "_";
  } else if (locale.includes("-")) {
    return "-";
  } else {
    return null;
  }
};

/**
 * Replaces the delimiter in a locale string with the specified delimiter.
 *
 * @param {string}locale - The locale string (e.g.,"en_US", "en-GB").
 * @param {"-" | "_" | null} [delimiter] - The new delimiter to replace the existing one.
 * @returns {string} The locale string with the replaced delimiter, or the original locale if no delimiter is provided.
 */

export const resolveOverriddenLocale = (
  locale: string,
  delimiter?: LocaleDelimiter,
): string => {
  if (!delimiter) {
    return locale;
  }

  const currentDelimiter = getLocaleCodeDelimiter(locale);
  if (!currentDelimiter) {
    return locale;
  }

  return locale.replace(currentDelimiter, delimiter);
};

/**
 * Normalizes a locale string by replacing underscores with hyphens
 * and removing the "r" in certain regional codes (e.g., "fr-rCA" → "fr-CA")
 *
 * @param {string} locale - The locale string (e.g.,"en_US", "en-GB").
 * @return {string} The normalized locale string.
 */

export function normalizeLocale(locale: string): string {
  return locale.replaceAll("_", "-").replace(/([a-z]{2,3}-)r/, "$1");
}

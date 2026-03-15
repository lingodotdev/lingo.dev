import { LOCALE_REGEX } from "./constants";
import { iso6393, type Language } from "iso-639-3";

/**
 * Validation functions for locale codes and components
 */

// Create a set of all valid ISO 639-1, 639-2, and 639-3 language codes
// This includes 2-letter codes (ISO 639-1) and 3-letter codes (ISO 639-2/3)
const VALID_LANGUAGE_CODES = new Set(
  iso6393.flatMap((lang: Language) =>
    [
      lang.iso6391, // 2-letter code (ISO 639-1)
      lang.iso6392B, // 3-letter bibliographic code (ISO 639-2)
      lang.iso6392T, // 3-letter terminologic code (ISO 639-2)
      lang.iso6393, // 3-letter code (ISO 639-3)
    ]
      .filter((code): code is string => Boolean(code))
      .map((code) => code.toLowerCase()),
  ),
);


// ISO 15924 script codes (most common)
const VALID_SCRIPT_CODES = new Set([
  "Adlm",
  "Afak",
  "Aghb",
  "Ahom",
  "Arab",
  "Aran",
  "Armi",
  "Armn",
  "Avst",
  "Bali",
  "Bamu",
  "Bass",
  "Batk",
  "Beng",
  "Bhks",
  "Blis",
  "Bopo",
  "Brah",
  "Brai",
  "Bugi",
  "Buhd",
  "Cakm",
  "Cans",
  "Cari",
  "Cham",
  "Cher",
  "Chrs",
  "Cirt",
  "Copt",
  "Cpmn",
  "Cprt",
  "Cyrl",
  "Cyrs",
  "Deva",
  "Diak",
  "Dogr",
  "Dsrt",
  "Dupl",
  "Egyd",
  "Egyh",
  "Egyp",
  "Elba",
  "Elym",
  "Ethi",
  "Gara",
  "Gong",
  "Gonm",
  "Goth",
  "Gran",
  "Grek",
  "Gujr",
  "Guru",
  "Hanb",
  "Hang",
  "Hani",
  "Hano",
  "Hans",
  "Hant",
  "Hatr",
  "Hebr",
  "Hira",
  "Hluw",
  "Hmng",
  "Hmnp",
  "Hrkt",
  "Hung",
  "Inds",
  "Ital",
  "Jamo",
  "Java",
  "Jpan",
  "Jurc",
  "Kali",
  "Kana",
  "Khar",
  "Khmr",
  "Khoj",
  "Kits",
  "Knda",
  "Kore",
  "Kpel",
  "Kthi",
  "Lana",
  "Laoo",
  "Latf",
  "Latg",
  "Latn",
  "Leke",
  "Lepc",
  "Limb",
  "Lina",
  "Linb",
  "Lisu",
  "Loma",
  "Lyci",
  "Lydi",
  "Mahj",
  "Maka",
  "Mand",
  "Mani",
  "Marc",
  "Maya",
  "Medf",
  "Mend",
  "Merc",
  "Mero",
  "Mlym",
  "Modi",
  "Mong",
  "Moon",
  "Mroo",
  "Mtei",
  "Mult",
  "Mymr",
  "Nand",
  "Narb",
  "Nbat",
  "Newa",
  "Nkgb",
  "Nkoo",
  "Nshu",
  "Ogam",
  "Olck",
  "Orkh",
  "Orya",
  "Osge",
  "Osma",
  "Ougr",
  "Palm",
  "Pauc",
  "Perm",
  "Phag",
  "Phli",
  "Phlp",
  "Phlv",
  "Phnx",
  "Plrd",
  "Prti",
  "Qaaa",
  "Qabx",
  "Rjng",
  "Rohg",
  "Roro",
  "Runr",
  "Samr",
  "Sara",
  "Sarb",
  "Saur",
  "Sgnw",
  "Shaw",
  "Shrd",
  "Shui",
  "Sidd",
  "Sind",
  "Sinh",
  "Sogd",
  "Sogo",
  "Sora",
  "Soyo",
  "Sund",
  "Sylo",
  "Syrc",
  "Syre",
  "Syrj",
  "Syrn",
  "Tagb",
  "Takr",
  "Tale",
  "Talu",
  "Taml",
  "Tang",
  "Tavt",
  "Telu",
  "Teng",
  "Tfng",
  "Tglg",
  "Thaa",
  "Thai",
  "Tibt",
  "Tirh",
  "Ugar",
  "Vaii",
  "Visp",
  "Wara",
  "Wcho",
  "Wole",
  "Xpeo",
  "Xsux",
  "Yezi",
  "Yiii",
  "Zanb",
  "Zinh",
  "Zmth",
  "Zsye",
  "Zsym",
  "Zxxx",
  "Zyyy",
  "Zzzz",
]);

// ISO 3166-1 alpha-2 country codes (most common)
const VALID_REGION_CODES = new Set([
  "AD",
  "AE",
  "AF",
  "AG",
  "AI",
  "AL",
  "AM",
  "AO",
  "AQ",
  "AR",
  "AS",
  "AT",
  "AU",
  "AW",
  "AX",
  "AZ",
  "BA",
  "BB",
  "BD",
  "BE",
  "BF",
  "BG",
  "BH",
  "BI",
  "BJ",
  "BL",
  "BM",
  "BN",
  "BO",
  "BQ",
  "BR",
  "BS",
  "BT",
  "BV",
  "BW",
  "BY",
  "BZ",
  "CA",
  "CC",
  "CD",
  "CF",
  "CG",
  "CH",
  "CI",
  "CK",
  "CL",
  "CM",
  "CN",
  "CO",
  "CR",
  "CU",
  "CV",
  "CW",
  "CX",
  "CY",
  "CZ",
  "DE",
  "DJ",
  "DK",
  "DM",
  "DO",
  "DZ",
  "EC",
  "EE",
  "EG",
  "EH",
  "ER",
  "ES",
  "ET",
  "FI",
  "FJ",
  "FK",
  "FM",
  "FO",
  "FR",
  "GA",
  "GB",
  "GD",
  "GE",
  "GF",
  "GG",
  "GH",
  "GI",
  "GL",
  "GM",
  "GN",
  "GP",
  "GQ",
  "GR",
  "GS",
  "GT",
  "GU",
  "GW",
  "GY",
  "HK",
  "HM",
  "HN",
  "HR",
  "HT",
  "HU",
  "ID",
  "IE",
  "IL",
  "IM",
  "IN",
  "IO",
  "IQ",
  "IR",
  "IS",
  "IT",
  "JE",
  "JM",
  "JO",
  "JP",
  "KE",
  "KG",
  "KH",
  "KI",
  "KM",
  "KN",
  "KP",
  "KR",
  "KW",
  "KY",
  "KZ",
  "LA",
  "LB",
  "LC",
  "LI",
  "LK",
  "LR",
  "LS",
  "LT",
  "LU",
  "LV",
  "LY",
  "MA",
  "MC",
  "MD",
  "ME",
  "MF",
  "MG",
  "MH",
  "MK",
  "ML",
  "MM",
  "MN",
  "MO",
  "MP",
  "MQ",
  "MR",
  "MS",
  "MT",
  "MU",
  "MV",
  "MW",
  "MX",
  "MY",
  "MZ",
  "NA",
  "NC",
  "NE",
  "NF",
  "NG",
  "NI",
  "NL",
  "NO",
  "NP",
  "NR",
  "NU",
  "NZ",
  "OM",
  "PA",
  "PE",
  "PF",
  "PG",
  "PH",
  "PK",
  "PL",
  "PM",
  "PN",
  "PR",
  "PS",
  "PT",
  "PW",
  "PY",
  "QA",
  "RE",
  "RO",
  "RS",
  "RU",
  "RW",
  "SA",
  "SB",
  "SC",
  "SD",
  "SE",
  "SG",
  "SH",
  "SI",
  "SJ",
  "SK",
  "SL",
  "SM",
  "SN",
  "SO",
  "SR",
  "SS",
  "ST",
  "SV",
  "SX",
  "SY",
  "SZ",
  "TC",
  "TD",
  "TF",
  "TG",
  "TH",
  "TJ",
  "TK",
  "TL",
  "TM",
  "TN",
  "TO",
  "TR",
  "TT",
  "TV",
  "TW",
  "TZ",
  "UA",
  "UG",
  "UM",
  "US",
  "UY",
  "UZ",
  "VA",
  "VC",
  "VE",
  "VG",
  "VI",
  "VN",
  "VU",
  "WF",
  "WS",
  "YE",
  "YT",
  "ZA",
  "ZM",
  "ZW",
]);

// UN M.49 numeric region codes (most common)
const VALID_NUMERIC_REGION_CODES = new Set([
  "001",
  "002",
  "003",
  "005",
  "009",
  "010",
  "011",
  "013",
  "014",
  "015",
  "017",
  "018",
  "019",
  "021",
  "029",
  "030",
  "034",
  "035",
  "039",
  "053",
  "054",
  "057",
  "061",
  "142",
  "143",
  "145",
  "150",
  "151",
  "154",
  "155",
  "202",
  "419",
  "AC",
  "BL",
  "BQ",
  "BV",
  "CP",
  "CW",
  "DG",
  "EA",
  "EU",
  "EZ",
  "FK",
  "FO",
  "GF",
  "GG",
  "GI",
  "GL",
  "GP",
  "GS",
  "GU",
  "HM",
  "IC",
  "IM",
  "IO",
  "JE",
  "KY",
  "MF",
  "MH",
  "MO",
  "MP",
  "MQ",
  "MS",
  "NC",
  "NF",
  "PF",
  "PM",
  "PN",
  "PR",
  "PS",
  "RE",
  "SH",
  "SJ",
  "SX",
  "TC",
  "TF",
  "TK",
  "TL",
  "UM",
  "VA",
  "VC",
  "VG",
  "VI",
  "WF",
  "YT",
]);

/**
 * Checks if a locale string is properly formatted and uses real codes
 *
 * @param locale - The locale string to validate
 * @returns true if the locale is valid, false otherwise
 *
 * @example
 * ```typescript
 * isValidLocale("en-US");        // true
 * isValidLocale("en_US");        // true
 * isValidLocale("zh-Hans-CN");   // true
 * isValidLocale("invalid");      // false
 * isValidLocale("en-FAKE");      // false
 * isValidLocale("xyz-US");       // false
 * ```
 */
export function isValidLocale(locale: string): boolean {
  if (typeof locale !== "string" || !locale.trim()) {
    return false;
  }

  try {
    const match = locale.match(LOCALE_REGEX);
    if (!match) {
      return false;
    }

    const [, language, script, region] = match;

    // Validate language code
    if (!isValidLanguageCode(language)) {
      return false;
    }

    // Validate script code if present
    if (script && !isValidScriptCode(script)) {
      return false;
    }

    // Validate region code if present
    if (region && !isValidRegionCode(region)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if a language code is valid
 *
 * @param code - The language code to validate
 * @returns true if the language code is valid, false otherwise
 *
 * @example
 * ```typescript
 * isValidLanguageCode("en");     // true
 * isValidLanguageCode("zh");     // true
 * isValidLanguageCode("es");     // true
 * isValidLanguageCode("xyz");    // false
 * isValidLanguageCode("fake");   // false
 * ```
 */
export function isValidLanguageCode(code: string): boolean {
  if (typeof code !== "string" || !code.trim()) {
    return false;
  }
  return VALID_LANGUAGE_CODES.has(code.toLowerCase());
}

/**
 * Checks if a script code is valid
 *
 * @param code - The script code to validate
 * @returns true if the script code is valid, false otherwise
 *
 * @example
 * ```typescript
 * isValidScriptCode("Hans");     // true (Simplified Chinese)
 * isValidScriptCode("Hant");     // true (Traditional Chinese)
 * isValidScriptCode("Latn");     // true (Latin alphabet)
 * isValidScriptCode("Cyrl");     // true (Cyrillic)
 * isValidScriptCode("Fake");     // false
 * ```
 */
export function isValidScriptCode(code: string): boolean {
  if (typeof code !== "string" || !code.trim()) {
    return false;
  }
  return VALID_SCRIPT_CODES.has(code);
}

/**
 * Checks if a region/country code is valid
 *
 * @param code - The region code to validate
 * @returns true if the region code is valid, false otherwise
 *
 * @example
 * ```typescript
 * isValidRegionCode("US");       // true
 * isValidRegionCode("CN");       // true
 * isValidRegionCode("GB");       // true
 * isValidRegionCode("ZZ");       // false
 * isValidRegionCode("FAKE");     // false
 * ```
 */
export function isValidRegionCode(code: string): boolean {
  if (typeof code !== "string" || !code.trim()) {
    return false;
  }

  const upperCode = code.toUpperCase();
  return (
    VALID_REGION_CODES.has(upperCode) ||
    VALID_NUMERIC_REGION_CODES.has(upperCode)
  );
}

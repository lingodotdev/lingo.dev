# @lingo.dev/locales

A JavaScript package that helps developers work with locale codes (like "en-US" or "zh-Hans-CN") and get country/language names in different languages.

## Features

- **Locale Parsing**: Break apart locale strings into language, script, and region components
- **Validation**: Check if locale codes are properly formatted and use real ISO codes
- **Name Resolution**: Get localized names for countries, languages, and scripts in 200+ languages
- **Small Bundle Size**: Core package is ~12KB with on-demand data loading
- **Full TypeScript Support**: Complete type definitions included

## Installation

```bash
npm install @lingo.dev/locales
```

## Usage

### Locale Parsing

```typescript
import {
  parseLocale,
  getLanguageCode,
  getScriptCode,
  getRegionCode,
} from "@lingo.dev/locales";

// Parse complete locale
parseLocale("en-US"); // { language: "en", region: "US" }
parseLocale("zh-Hans-CN"); // { language: "zh", script: "Hans", region: "CN" }
parseLocale("sr-Cyrl-RS"); // { language: "sr", script: "Cyrl", region: "RS" }

// Extract individual components
getLanguageCode("en-US"); // "en"
getScriptCode("zh-Hans-CN"); // "Hans"
getRegionCode("en-US"); // "US"
```

### Validation

```typescript
import {
  isValidLocale,
  isValidLanguageCode,
  isValidScriptCode,
  isValidRegionCode,
} from "@lingo.dev/locales";

// Validate complete locales
isValidLocale("en-US"); // true
isValidLocale("en-FAKE"); // false
isValidLocale("xyz-US"); // false

// Validate individual components
isValidLanguageCode("en"); // true
isValidLanguageCode("xyz"); // false
isValidScriptCode("Hans"); // true
isValidScriptCode("Fake"); // false
isValidRegionCode("US"); // true
isValidRegionCode("ZZ"); // false
```

### Name Resolution (Async)

```typescript
import {
  getCountryName,
  getLanguageName,
  getScriptName,
} from "@lingo.dev/locales";

// Get country names in different languages
await getCountryName("US"); // "United States"
await getCountryName("US", "es"); // "Estados Unidos"
await getCountryName("CN", "fr"); // "Chine"

// Get language names in different languages
await getLanguageName("en"); // "English"
await getLanguageName("en", "es"); // "inglés"
await getLanguageName("zh", "fr"); // "chinois"

// Get script names in different languages
await getScriptName("Hans"); // "Simplified Han"
await getScriptName("Hans", "es"); // "han simplificado"
await getScriptName("Latn", "zh"); // "拉丁文"
```

## API Reference

### Parsing Functions

#### `parseLocale(locale: string): LocaleComponents`

Breaks apart a locale string into its components.

**Parameters:**

- `locale` (string): The locale string to parse

**Returns:** `LocaleComponents` object with `language`, `script`, and `region` properties

**Examples:**

```typescript
parseLocale("en-US"); // { language: "en", region: "US" }
parseLocale("zh-Hans-CN"); // { language: "zh", script: "Hans", region: "CN" }
parseLocale("es"); // { language: "es" }
```

#### `getLanguageCode(locale: string): string`

Extracts just the language part from a locale string.

#### `getScriptCode(locale: string): string | null`

Extracts the script part from a locale string.

#### `getRegionCode(locale: string): string | null`

Extracts the region/country part from a locale string.

### Validation Functions

#### `isValidLocale(locale: string): boolean`

Checks if a locale string is properly formatted and uses real codes.

#### `isValidLanguageCode(code: string): boolean`

Checks if a language code is valid (ISO 639-1).

#### `isValidScriptCode(code: string): boolean`

Checks if a script code is valid (ISO 15924).

#### `isValidRegionCode(code: string): boolean`

Checks if a region code is valid (ISO 3166-1 alpha-2 or UN M.49).

### Name Resolution Functions

#### `getCountryName(countryCode: string, displayLanguage = "en"): Promise<string>`

Gets a country name in the specified language.

**Parameters:**

- `countryCode` (string): The country code (e.g., "US", "CN")
- `displayLanguage` (string, optional): The language to display the name in (default: "en")

**Returns:** Promise<string> - The localized country name

#### `getLanguageName(languageCode: string, displayLanguage = "en"): Promise<string>`

Gets a language name in the specified language.

#### `getScriptName(scriptCode: string, displayLanguage = "en"): Promise<string>`

Gets a script name in the specified language.

## Supported Formats

The package supports both hyphen (`-`) and underscore (`_`) delimiters:

- `en-US` or `en_US` → `{ language: "en", region: "US" }`
- `zh-Hans-CN` or `zh_Hans_CN` → `{ language: "zh", script: "Hans", region: "CN" }`

## Data Sources

- **Locale parsing**: Uses regex-based parsing with ISO standard validation
- **Name resolution**: Uses Unicode CLDR (Common Locale Data Repository) data
- **Validation**: Uses official ISO 639-1, ISO 15924, and ISO 3166-1 standards

## Performance

- **Bundle size**: Core package is ~12KB (ESM) / ~14KB (CJS)
- **Runtime data**: Loaded on-demand from GitHub raw URLs
- **Caching**: In-memory cache to avoid repeated network requests
- **Fallback**: Graceful degradation to English when language data is unavailable

## Error Handling

All functions include comprehensive error handling:

```typescript
try {
  parseLocale("invalid");
} catch (error) {
  console.log(error.message); // "Invalid locale format: invalid"
}

try {
  await getCountryName("XX");
} catch (error) {
  console.log(error.message); // "Country code "XX" not found"
}
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
interface LocaleComponents {
  language: string;
  script?: string;
  region?: string;
}

type LocaleDelimiter = "-" | "_";

interface ParseResult {
  components: LocaleComponents;
  delimiter: LocaleDelimiter | null;
  isValid: boolean;
  error?: string;
}
```

## License

Apache 2.0

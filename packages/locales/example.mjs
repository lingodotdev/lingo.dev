import {
  parseLocale,
  getLanguageCode,
  getScriptCode,
  getRegionCode,
  getCountryName,
  getLanguageName,
  getScriptName,
} from "./build/index.mjs";

// Example usage of parseLocale function
console.log("=== Locale Parsing Examples ===");

// Basic language-region locales
console.log("parseLocale('bn-BD'):", parseLocale("bn-BD"));
console.log("parseLocale('bn-IN'):", parseLocale("bn-IN"));
console.log('parseLocale("en-US"):', parseLocale("en-US"));
console.log('parseLocale("en_US"):', parseLocale("en_US"));

// Language-script-region locales
console.log('parseLocale("zh-Hans-CN"):', parseLocale("zh-Hans-CN"));
console.log('parseLocale("zh_Hans_CN"):', parseLocale("zh_Hans_CN"));

// Language-only locales
console.log('parseLocale("es"):', parseLocale("es"));

// Complex script locales
console.log('parseLocale("sr-Cyrl-RS"):', parseLocale("sr-Cyrl-RS"));

console.log("\n=== Individual Component Extraction ===");

// Language codes
console.log('getLanguageCode("en-US"):', getLanguageCode("en-US"));
console.log('getLanguageCode("zh-Hans-CN"):', getLanguageCode("zh-Hans-CN"));
console.log('getLanguageCode("es-MX"):', getLanguageCode("es-MX"));
console.log('getLanguageCode("fr_CA"):', getLanguageCode("fr_CA"));

// Script codes
console.log('getScriptCode("zh-Hans-CN"):', getScriptCode("zh-Hans-CN"));
console.log('getScriptCode("zh-Hant-TW"):', getScriptCode("zh-Hant-TW"));
console.log('getScriptCode("sr-Cyrl-RS"):', getScriptCode("sr-Cyrl-RS"));
console.log('getScriptCode("en-US"):', getScriptCode("en-US")); // null

// Region codes
console.log('getRegionCode("en-US"):', getRegionCode("en-US"));
console.log('getRegionCode("zh-Hans-CN"):', getRegionCode("zh-Hans-CN"));
console.log('getRegionCode("fr_CA"):', getRegionCode("fr_CA"));
console.log('getRegionCode("es"):', getRegionCode("es")); // null

console.log("\n=== Error Handling Examples ===");

// Error cases
try {
  parseLocale("invalid");
} catch (error) {
  console.log('Error for "invalid":', error.message);
}

try {
  parseLocale("");
} catch (error) {
  console.log("Error for empty string:", error.message);
}

try {
  parseLocale(null);
} catch (error) {
  console.log("Error for null:", error.message);
}

// Async examples function
async function runAsyncExamples() {
  console.log("\n=== Async Name Resolution Examples ===");

  // Country names
  console.log("=== Country Names ===");
  console.log('await getCountryName("US"):', await getCountryName("US"));
  console.log(
    'await getCountryName("US", "es"):',
    await getCountryName("IN", "es"),
  );
  console.log('await getCountryName("CN"):', await getCountryName("CN"));
  console.log(
    'await getCountryName("DE", "es"):',
    await getCountryName("DE", "es"),
  );
  console.log('await getCountryName("us"):', await getCountryName("us")); // Case normalization

  // Language names
  console.log("\n=== Language Names ===");
  console.log('await getLanguageName("en"):', await getLanguageName("en"));
  console.log(
    'await getLanguageName("en", "es"):',
    await getLanguageName("en", "es"),
  );
  console.log('await getLanguageName("zh"):', await getLanguageName("zh"));
  console.log(
    'await getLanguageName("fr", "es"):',
    await getLanguageName("fr", "es"),
  );
  console.log('await getLanguageName("EN"):', await getLanguageName("EN")); // Case normalization

  // Script names
  console.log("\n=== Script Names ===");
  console.log('await getScriptName("Latn"):', await getScriptName("Latn"));
  console.log(
    'await getScriptName("Hans", "es"):',
    await getScriptName("Hans", "es"),
  );
  console.log('await getScriptName("Cyrl"):', await getScriptName("Cyrl"));
  console.log(
    'await getScriptName("Arab", "es"):',
    await getScriptName("Arab", "es"),
  );
  console.log('await getScriptName("Latn"):', await getScriptName("Latn")); // Case normalization

  console.log("\n=== Async Error Handling Examples ===");

  // Error cases for async functions
  try {
    await getCountryName("");
  } catch (error) {
    console.log("Error for empty country code:", error.message);
  }

  try {
    await getLanguageName(null);
  } catch (error) {
    console.log("Error for null language code:", error.message);
  }

  try {
    await getScriptName("XX");
  } catch (error) {
    console.log("Error for invalid script code:", error.message);
  }

  try {
    await getCountryName("XX");
  } catch (error) {
    console.log("Error for invalid country code:", error.message);
  }
}

// Run the async examples
runAsyncExamples().catch(console.error);

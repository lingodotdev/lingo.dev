import {
  parseLocale,
  getLanguageCode,
  getScriptCode,
  getRegionCode,
  getCountryName,
  getLanguageName,
  getScriptName,
  isValidLocale,
  isValidLanguageCode,
  isValidScriptCode,
  isValidRegionCode,
} from "./build/index.mjs";

console.log("=== Locale Parsing Examples ===");
console.log("parseLocale('bn-BD'):", parseLocale("bn-BD"));
console.log("parseLocale('bn-IN'):", parseLocale("bn-IN"));
console.log('parseLocale("en-US"):', parseLocale("en-US"));
console.log('parseLocale("en_US"):', parseLocale("en_US"));
console.log('parseLocale("zh-Hans-CN"):', parseLocale("zh-Hans-CN"));
console.log('parseLocale("zh_Hans_CN"):', parseLocale("zh_Hans_CN"));
console.log('parseLocale("es"):', parseLocale("es"));
console.log('parseLocale("sr-Cyrl-RS"):', parseLocale("sr-Cyrl-RS"));

console.log("\n=== Individual Component Extraction ===");
console.log('getLanguageCode("en-US"):', getLanguageCode("en-US"));
console.log('getLanguageCode("zh-Hans-CN"):', getLanguageCode("zh-Hans-CN"));
console.log('getLanguageCode("es-MX"):', getLanguageCode("es-MX"));
console.log('getLanguageCode("fr_CA"):', getLanguageCode("fr_CA"));
console.log('getScriptCode("zh-Hans-CN"):', getScriptCode("zh-Hans-CN"));
console.log('getScriptCode("zh-Hant-TW"):', getScriptCode("zh-Hant-TW"));
console.log('getScriptCode("sr-Cyrl-RS"):', getScriptCode("sr-Cyrl-RS"));
console.log('getScriptCode("en-US"):', getScriptCode("en-US"));
console.log('getRegionCode("en-US"):', getRegionCode("en-US"));
console.log('getRegionCode("zh-Hans-CN"):', getRegionCode("zh-Hans-CN"));
console.log('getRegionCode("fr_CA"):', getRegionCode("fr_CA"));
console.log('getRegionCode("es"):', getRegionCode("es"));

console.log("\n=== Validation Examples ===");
console.log('isValidLocale("en-US"):', isValidLocale("en-US"));
console.log('isValidLocale("en_US"):', isValidLocale("en_US"));
console.log('isValidLocale("zh-Hans-CN"):', isValidLocale("zh-Hans-CN"));
console.log('isValidLocale("invalid"):', isValidLocale("invalid"));
console.log('isValidLocale("en-FAKE"):', isValidLocale("en-FAKE"));
console.log('isValidLocale("xyz-US"):', isValidLocale("xyz-US"));

console.log("\n=== Language Code Validation ===");
console.log('isValidLanguageCode("en"):', isValidLanguageCode("en"));
console.log('isValidLanguageCode("zh"):', isValidLanguageCode("zh"));
console.log('isValidLanguageCode("es"):', isValidLanguageCode("es"));
console.log('isValidLanguageCode("xyz"):', isValidLanguageCode("xyz"));
console.log('isValidLanguageCode("fake"):', isValidLanguageCode("fake"));

console.log("\n=== Script Code Validation ===");
console.log('isValidScriptCode("Hans"):', isValidScriptCode("Hans"));
console.log('isValidScriptCode("Hant"):', isValidScriptCode("Hant"));
console.log('isValidScriptCode("Latn"):', isValidScriptCode("Latn"));
console.log('isValidScriptCode("Cyrl"):', isValidScriptCode("Cyrl"));
console.log('isValidScriptCode("Fake"):', isValidScriptCode("Fake"));

console.log("\n=== Region Code Validation ===");
console.log('isValidRegionCode("US"):', isValidRegionCode("US"));
console.log('isValidRegionCode("CN"):', isValidRegionCode("CN"));
console.log('isValidRegionCode("GB"):', isValidRegionCode("GB"));
console.log('isValidRegionCode("419"):', isValidRegionCode("419")); // Latin America
console.log('isValidRegionCode("ZZ"):', isValidRegionCode("ZZ"));
console.log('isValidRegionCode("FAKE"):', isValidRegionCode("FAKE"));

console.log("\n=== Error Handling Examples ===");
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

async function runAsyncExamples() {
  console.log("\n=== Async Name Resolution Examples ===");

  console.log("=== Country Names ===");
  console.log('await getCountryName("US"):', await getCountryName("US"));
  console.log(
    'await getCountryName("US", "es"):',
    await getCountryName("US", "es"),
  );
  console.log('await getCountryName("CN"):', await getCountryName("CN"));
  console.log(
    'await getCountryName("DE", "es"):',
    await getCountryName("DE", "es"),
  );
  console.log('await getCountryName("us"):', await getCountryName("us"));

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
  console.log('await getLanguageName("EN"):', await getLanguageName("EN"));

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
  console.log('await getScriptName("Latn"):', await getScriptName("Latn"));

  console.log("\n=== Async Error Handling Examples ===");
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

runAsyncExamples().catch(console.error);

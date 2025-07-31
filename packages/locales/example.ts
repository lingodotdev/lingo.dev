import {
  parseLocale,
  getLanguageCode,
  getScriptCode,
  getRegionCode,
} from "./src/index";

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
  console.log('Error for "invalid":', (error as Error).message);
}

try {
  parseLocale("");
} catch (error) {
  console.log("Error for empty string:", (error as Error).message);
}

try {
  parseLocale(null as any);
} catch (error) {
  console.log("Error for null:", (error as Error).message);
}

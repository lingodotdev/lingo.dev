import { describe, it, expect } from "vitest";
import {
  isValidLocale,
  isValidLanguageCode,
  isValidScriptCode,
  isValidRegionCode,
} from "./validation";

describe("isValidLocale", () => {
  it("should validate basic language-region locales with hyphen", () => {
    expect(isValidLocale("en-US")).toBe(true);
    expect(isValidLocale("es-MX")).toBe(true);
    expect(isValidLocale("fr-CA")).toBe(true);
  });

  it("should validate basic language-region locales with underscore", () => {
    expect(isValidLocale("en_US")).toBe(true);
    expect(isValidLocale("es_MX")).toBe(true);
    expect(isValidLocale("fr_CA")).toBe(true);
  });

  it("should validate language-script-region locales", () => {
    expect(isValidLocale("zh-Hans-CN")).toBe(true);
    expect(isValidLocale("zh-Hant-TW")).toBe(true);
    expect(isValidLocale("sr-Cyrl-RS")).toBe(true);
  });

  it("should validate language-only locales", () => {
    expect(isValidLocale("es")).toBe(true);
    expect(isValidLocale("fr")).toBe(true);
    expect(isValidLocale("zh")).toBe(true);
  });

  it("should validate locales with numeric region codes", () => {
    expect(isValidLocale("es-419")).toBe(true); // Latin America
    expect(isValidLocale("en-001")).toBe(true); // World
  });

  it("should reject invalid locale formats", () => {
    expect(isValidLocale("invalid")).toBe(false);
    expect(isValidLocale("en-")).toBe(false);
    expect(isValidLocale("-US")).toBe(false);
    expect(isValidLocale("en-US-")).toBe(false);
  });

  it("should reject locales with invalid language codes", () => {
    expect(isValidLocale("xyz-US")).toBe(false);
    expect(isValidLocale("fake-CN")).toBe(false);
  });

  it("should reject locales with invalid script codes", () => {
    expect(isValidLocale("en-Fake-US")).toBe(false);
    expect(isValidLocale("zh-Invalid-CN")).toBe(false);
  });

  it("should reject locales with invalid region codes", () => {
    expect(isValidLocale("en-US-FAKE")).toBe(false);
    expect(isValidLocale("en-ZZ")).toBe(false);
  });

  it("should handle edge cases", () => {
    expect(isValidLocale("")).toBe(false);
    expect(isValidLocale("   ")).toBe(false);
    expect(isValidLocale(null as any)).toBe(false);
    expect(isValidLocale(undefined as any)).toBe(false);
  });
});

describe("isValidLanguageCode", () => {
  it("should validate common language codes", () => {
    expect(isValidLanguageCode("en")).toBe(true);
    expect(isValidLanguageCode("es")).toBe(true);
    expect(isValidLanguageCode("fr")).toBe(true);
    expect(isValidLanguageCode("zh")).toBe(true);
    expect(isValidLanguageCode("ar")).toBe(true);
    expect(isValidLanguageCode("ja")).toBe(true);
    expect(isValidLanguageCode("ko")).toBe(true);
  });

  it("should validate less common language codes", () => {
    expect(isValidLanguageCode("aa")).toBe(true); // Afar
    expect(isValidLanguageCode("zu")).toBe(true); // Zulu
    expect(isValidLanguageCode("yi")).toBe(true); // Yiddish
  });

  it("should handle case insensitive validation", () => {
    expect(isValidLanguageCode("EN")).toBe(true);
    expect(isValidLanguageCode("Es")).toBe(true);
    expect(isValidLanguageCode("FR")).toBe(true);
  });

  it("should reject invalid language codes", () => {
    expect(isValidLanguageCode("xyz")).toBe(false);
    expect(isValidLanguageCode("fake")).toBe(false);
    expect(isValidLanguageCode("invalid")).toBe(false);
  });

  it("should handle edge cases", () => {
    expect(isValidLanguageCode("")).toBe(false);
    expect(isValidLanguageCode("   ")).toBe(false);
    expect(isValidLanguageCode(null as any)).toBe(false);
    expect(isValidLanguageCode(undefined as any)).toBe(false);
  });
});

describe("isValidScriptCode", () => {
  it("should validate common script codes", () => {
    expect(isValidScriptCode("Hans")).toBe(true); // Simplified Chinese
    expect(isValidScriptCode("Hant")).toBe(true); // Traditional Chinese
    expect(isValidScriptCode("Latn")).toBe(true); // Latin
    expect(isValidScriptCode("Cyrl")).toBe(true); // Cyrillic
    expect(isValidScriptCode("Arab")).toBe(true); // Arabic
    expect(isValidScriptCode("Hira")).toBe(true); // Hiragana
    expect(isValidScriptCode("Kana")).toBe(true); // Katakana
  });

  it("should validate less common script codes", () => {
    expect(isValidScriptCode("Adlm")).toBe(true); // Adlam
    expect(isValidScriptCode("Zzzz")).toBe(true); // Unknown script
    expect(isValidScriptCode("Qaaa")).toBe(true); // Private use
  });

  it("should be case sensitive", () => {
    expect(isValidScriptCode("hans")).toBe(false);
    expect(isValidScriptCode("HANS")).toBe(false);
    expect(isValidScriptCode("Hans")).toBe(true);
  });

  it("should reject invalid script codes", () => {
    expect(isValidScriptCode("Fake")).toBe(false);
    expect(isValidScriptCode("Invalid")).toBe(false);
    expect(isValidScriptCode("XYZ")).toBe(false);
  });

  it("should handle edge cases", () => {
    expect(isValidScriptCode("")).toBe(false);
    expect(isValidScriptCode("   ")).toBe(false);
    expect(isValidScriptCode(null as any)).toBe(false);
    expect(isValidScriptCode(undefined as any)).toBe(false);
  });
});

describe("isValidRegionCode", () => {
  it("should validate common country codes", () => {
    expect(isValidRegionCode("US")).toBe(true);
    expect(isValidRegionCode("CN")).toBe(true);
    expect(isValidRegionCode("GB")).toBe(true);
    expect(isValidRegionCode("DE")).toBe(true);
    expect(isValidRegionCode("FR")).toBe(true);
    expect(isValidRegionCode("JP")).toBe(true);
    expect(isValidRegionCode("KR")).toBe(true);
  });

  it("should validate numeric region codes", () => {
    expect(isValidRegionCode("419")).toBe(true); // Latin America
    expect(isValidRegionCode("001")).toBe(true); // World
    expect(isValidRegionCode("142")).toBe(true); // Asia
    expect(isValidRegionCode("150")).toBe(true); // Europe
  });

  it("should handle case insensitive validation", () => {
    expect(isValidRegionCode("us")).toBe(true);
    expect(isValidRegionCode("cn")).toBe(true);
    expect(isValidRegionCode("gb")).toBe(true);
  });

  it("should reject invalid region codes", () => {
    expect(isValidRegionCode("ZZ")).toBe(false);
    expect(isValidRegionCode("FAKE")).toBe(false);
    expect(isValidRegionCode("INVALID")).toBe(false);
  });

  it("should handle edge cases", () => {
    expect(isValidRegionCode("")).toBe(false);
    expect(isValidRegionCode("   ")).toBe(false);
    expect(isValidRegionCode(null as any)).toBe(false);
    expect(isValidRegionCode(undefined as any)).toBe(false);
  });
});

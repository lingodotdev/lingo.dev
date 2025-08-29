import { describe, it, expect } from "vitest";
import {
  parseLocale,
  getLanguageCode,
  getScriptCode,
  getRegionCode,
} from "./parser";

describe("parseLocale", () => {
  it("should parse basic language-region locales with hyphen", () => {
    expect(parseLocale("en-US")).toEqual({
      language: "en",
      region: "US",
    });
  });

  it("should parse basic language-region locales with underscore", () => {
    expect(parseLocale("en_US")).toEqual({
      language: "en",
      region: "US",
    });
  });

  it("should parse language-script-region locales with hyphen", () => {
    expect(parseLocale("zh-Hans-CN")).toEqual({
      language: "zh",
      script: "Hans",
      region: "CN",
    });
  });

  it("should parse language-script-region locales with underscore", () => {
    expect(parseLocale("zh_Hans_CN")).toEqual({
      language: "zh",
      script: "Hans",
      region: "CN",
    });
  });

  it("should parse language-only locales", () => {
    expect(parseLocale("es")).toEqual({
      language: "es",
    });
  });

  it("should parse complex script locales", () => {
    expect(parseLocale("sr-Cyrl-RS")).toEqual({
      language: "sr",
      script: "Cyrl",
      region: "RS",
    });
  });

  it("should handle numeric region codes", () => {
    expect(parseLocale("es-419")).toEqual({
      language: "es",
      region: "419",
    });
  });

  it("should normalize language to lowercase", () => {
    expect(parseLocale("EN-US")).toEqual({
      language: "en",
      region: "US",
    });
  });

  it("should normalize region to uppercase", () => {
    expect(parseLocale("en-us")).toEqual({
      language: "en",
      region: "US",
    });
  });

  it("should preserve script case", () => {
    expect(parseLocale("zh-hans-cn")).toEqual({
      language: "zh",
      script: "hans",
      region: "CN",
    });
  });

  it("should throw error for invalid locale format", () => {
    expect(() => parseLocale("invalid")).toThrow(
      "Invalid locale format: invalid",
    );
  });

  it("should throw error for empty string", () => {
    expect(() => parseLocale("")).toThrow("Locale cannot be empty");
  });

  it("should throw error for non-string input", () => {
    expect(() => parseLocale(null as any)).toThrow("Locale must be a string");
  });
});

describe("getLanguageCode", () => {
  it("should extract language code from various formats", () => {
    expect(getLanguageCode("en-US")).toBe("en");
    expect(getLanguageCode("zh-Hans-CN")).toBe("zh");
    expect(getLanguageCode("es-MX")).toBe("es");
    expect(getLanguageCode("fr_CA")).toBe("fr");
    expect(getLanguageCode("es")).toBe("es");
  });
});

describe("getScriptCode", () => {
  it("should extract script code when present", () => {
    expect(getScriptCode("zh-Hans-CN")).toBe("Hans");
    expect(getScriptCode("zh-Hant-TW")).toBe("Hant");
    expect(getScriptCode("sr-Cyrl-RS")).toBe("Cyrl");
  });

  it("should return null when script is not present", () => {
    expect(getScriptCode("en-US")).toBeNull();
    expect(getScriptCode("es")).toBeNull();
  });
});

describe("getRegionCode", () => {
  it("should extract region code when present", () => {
    expect(getRegionCode("en-US")).toBe("US");
    expect(getRegionCode("zh-Hans-CN")).toBe("CN");
    expect(getRegionCode("fr_CA")).toBe("CA");
  });

  it("should return null when region is not present", () => {
    expect(getRegionCode("es")).toBeNull();
    expect(getRegionCode("zh-Hans")).toBeNull();
  });
});

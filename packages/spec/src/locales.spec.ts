import { describe, it, expect } from "vitest";
import {
  getLocaleCodeDelimiter,
  normalizeLocale,
  resolveLocaleCode,
  resolveOverriddenLocale,
} from "./locales";

describe("normalizeLocale", () => {
  it("should return normalized locale for short locale codes", () => {
    expect(normalizeLocale("en")).toEqual("en");
    expect(normalizeLocale("fr")).toEqual("fr");
  });

  it("should return normalized locale for full locale codes", () => {
    expect(normalizeLocale("en-US")).toEqual("en-US");
    expect(normalizeLocale("fr-FR")).toEqual("fr-FR");
  });

  it("should return normalized locale for full underscore locale codes", () => {
    expect(normalizeLocale("en_US")).toEqual("en-US");
    expect(normalizeLocale("fr_FR")).toEqual("fr-FR");
    expect(normalizeLocale("zh_Hans_CN")).toEqual("zh-Hans-CN");
  });

  it("should return normalized locale for full explicit region locale codes", () => {
    expect(normalizeLocale("en-rUS")).toEqual("en-US");
    expect(normalizeLocale("fr-rFR")).toEqual("fr-FR");
    expect(normalizeLocale("zh-rCN")).toEqual("zh-CN");
  });
});

describe("resolveLocaleCode", () => {
  it("should resolve a short locale code to the first full locale code in the map", () => {
    expect(resolveLocaleCode("en")).toEqual("en-US");
    expect(resolveLocaleCode("fr")).toEqual("fr-FR");
    expect(resolveLocaleCode("az")).toEqual("az-AZ");
  });

  it("should return the full locale code if it is already provided", () => {
    expect(resolveLocaleCode("en-US")).toEqual("en-US");
    expect(resolveLocaleCode("fr-CA")).toEqual("fr-CA");
    expect(resolveLocaleCode("es-MX")).toEqual("es-MX");
  });

  it("should throw an error for an invalid or unsupported locale code", () => {
    expect(() => resolveLocaleCode("az-US")).toThrow("Invalid locale code");
    expect(() => resolveLocaleCode("au")).toThrow("Invalid locale code");
  });

  it("should return first code for locales with multiple variants", () => {
    expect(resolveLocaleCode("sr")).toEqual("sr-RS");
    expect(resolveLocaleCode("zh")).toEqual("zh-CN");
  });
});

describe("getLocaleCodeDelimiter", () => {
  it("should return '-' for locale codes with hyphen delimiter", () => {
    expect(getLocaleCodeDelimiter("en-US")).toEqual("-");
    expect(getLocaleCodeDelimiter("fr-FR")).toEqual("-");
  });

  it("should return '_' for locale codes with underscore delimiter", () => {
    expect(getLocaleCodeDelimiter("en_US")).toEqual("_");
    expect(getLocaleCodeDelimiter("fr_FR")).toEqual("_");
  });

  it("should return undefined for locale codes without a recognized delimiter", () => {
    expect(getLocaleCodeDelimiter("enUS")).toBeNull();
    expect(getLocaleCodeDelimiter("frFR")).toBeNull();
    expect(getLocaleCodeDelimiter("kaGE")).toBeNull();
  });
});

describe("resolveOverridenLocale", () => {
  it("should return the same locale if no delimiter is provided", () => {
    expect(resolveOverriddenLocale("en-US")).toEqual("en-US");
    expect(resolveOverriddenLocale("fr_FR")).toEqual("fr_FR");
  });

  it("should replace the delimiter with the specified one", () => {
    expect(resolveOverriddenLocale("en-US", "_")).toEqual("en_US");
    expect(resolveOverriddenLocale("fr_FR", "-")).toEqual("fr-FR");
  });

  it("should return the same locale if no recognized delimiter is found", () => {
    expect(resolveOverriddenLocale("enUS", "_")).toEqual("enUS");
    expect(resolveOverriddenLocale("frFR", "-")).toEqual("frFR");
  });
});

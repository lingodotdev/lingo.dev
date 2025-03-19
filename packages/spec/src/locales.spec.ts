import { describe, it, expect } from "vitest";
import { normalizeLocale } from "./locales";

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

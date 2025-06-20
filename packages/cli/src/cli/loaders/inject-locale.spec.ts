import { describe, it, expect } from "vitest";
import createInjectLocaleLoader from "./inject-locale";

const locale = "en";
const originalLocale = "en";

describe("createInjectLocaleLoader", () => {
  describe("pull", () => {
    it("should return data unchanged if injectLocaleKeys is not provided", async () => {
      const loader = createInjectLocaleLoader();
      loader.setDefaultLocale(locale);
      const data = { a: 1, b: 2 };
      const result = await loader.pull(locale, data);
      expect(result).toEqual(data);
    });

    it("should omit keys where value matches locale", async () => {
      const loader = createInjectLocaleLoader(["lang", "meta.locale"]);
      loader.setDefaultLocale(locale);
      const data = { lang: "en", value: 42, meta: { locale: "en", other: 1 } };
      const result = await loader.pull(locale, data);
      expect(result).toEqual({ value: 42, meta: { other: 1 } });
    });

    it("should not omit keys if their value does not match locale", async () => {
      const loader = createInjectLocaleLoader(["lang", "meta.locale"]);
      loader.setDefaultLocale(locale);
      const data = { lang: "fr", value: 42, meta: { locale: "de", other: 1 } };
      const result = await loader.pull(locale, data);
      expect(result).toEqual(data);
    });

    it("should handle empty data object", async () => {
      const loader = createInjectLocaleLoader(["lang"]);
      loader.setDefaultLocale(locale);
      const data = {};
      const result = await loader.pull(locale, data);
      expect(result).toEqual({});
    });
  });

  describe("push", () => {
    it("should return data unchanged if injectLocaleKeys is not provided", async () => {
      const loader = createInjectLocaleLoader();
      loader.setDefaultLocale(locale);
      await loader.pull(locale, { a: 1 });
      const data = { a: 2 };
      const result = await loader.push(locale, data);
      expect(result).toEqual(data);
    });

    it("should set injectLocaleKeys to new locale if they matched originalLocale", async () => {
      const loader = createInjectLocaleLoader(["lang", "meta.locale"]);
      loader.setDefaultLocale(originalLocale);
      const originalInput = {
        lang: "en",
        value: 42,
        meta: { locale: "en", other: 1 },
      };
      await loader.pull(originalLocale, originalInput);
      const data = { value: 99, meta: { other: 2 } };
      const result = await loader.push("fr", data);
      expect(result).toEqual({
        lang: "fr",
        value: 99,
        meta: { locale: "fr", other: 2 },
      });
    });

    it("should not change injectLocaleKeys if they do not match originalLocale", async () => {
      const loader = createInjectLocaleLoader(["lang", "meta.locale"]);
      loader.setDefaultLocale(originalLocale);
      const originalInput = {
        lang: "de",
        value: 42,
        meta: { locale: "es", other: 1 },
      };
      await loader.pull(originalLocale, originalInput);
      const data = { lang: "de", value: 99, meta: { locale: "es", other: 2 } };
      const result = await loader.push("fr", data);
      expect(result).toEqual({
        lang: "de",
        value: 99,
        meta: { locale: "es", other: 2 },
      });
    });

    it("should merge originalInput and data, then update injectLocaleKeys, does not add extra keys from originalInput", async () => {
      const loader = createInjectLocaleLoader(["lang", "meta.locale"]);
      loader.setDefaultLocale(originalLocale);
      const originalInput = {
        lang: "en",
        value: 1,
        meta: { locale: "en", other: 1 },
        extra: 5,
      };
      await loader.pull(originalLocale, originalInput);
      const data = { value: 2, meta: { other: 2 } };
      const result = await loader.push("fr", data);
      expect(result).toEqual({
        lang: "fr",
        value: 2,
        meta: { locale: "fr", other: 2 },
      });
    });
  });
});

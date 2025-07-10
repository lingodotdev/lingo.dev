import { describe, it, expect } from "vitest";
import createInjectLocaleLoader from "./inject-locale";

const locale = "en";
const originalLocale = "en";

describe("createInjectLocaleLoader", () => {
  describe("pull", () => {
    it("should return data unchanged if injectLocaleKeys is not provided", async () => {
      const loader = createInjectLocaleLoader();
      loader.setDefaultLocale(locale);
      const data = { a: 1, b: 2, locale: "en" };
      const result = await loader.pull(locale, data);
      expect(result).toEqual(data);
    });

    it("should omit keys where value matches locale", async () => {
      const loader = createInjectLocaleLoader([
        "lang",
        "meta.locale",
        "obj.locale",
      ]);
      loader.setDefaultLocale(locale);
      const data = {
        lang: "en",
        value: 42,
        meta: { locale: "en", other: 1 },
        obj: { locale: "en" },
      };
      const result = await loader.pull(locale, data);
      expect(result).toEqual({ value: 42, meta: { other: 1 }, obj: {} });
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

    it("should omit keys matching wildcard pattern where value matches locale", async () => {
      const loader = createInjectLocaleLoader([
        "pages.*.locale",
        "meta/*/lang",
      ]);
      loader.setDefaultLocale(locale);
      const data = {
        pages: {
          foo: { locale: "en", value: 1 },
          bar: { locale: "en", value: 2 },
          baz: { locale: "fr", value: 3 },
        },
        other: 42,
        "meta/a/lang": "en",
        "meta/b/lang": "fr",
        "meta/c/lang": "en",
      };
      const result = await loader.pull(locale, data);
      expect(result).toEqual({
        pages: {
          foo: { value: 1 },
          bar: { value: 2 },
          baz: { locale: "fr", value: 3 },
        },
        other: 42,
        "meta/b/lang": "fr",
      });
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
      const loader = createInjectLocaleLoader([
        "lang",
        "meta.locale",
        "obj.locale",
      ]);
      loader.setDefaultLocale(originalLocale);
      const originalInput = {
        lang: "de",
        value: 42,
        meta: { locale: "es", other: 1 },
        obj: { locale: "fr" },
      };
      await loader.pull(originalLocale, originalInput);
      const data = {
        lang: "de",
        value: 99,
        meta: { locale: "es", other: 2 },
        obj: { locale: "fr" },
      };
      const result = await loader.push("fr", data);
      expect(result).toEqual({
        lang: "de",
        value: 99,
        meta: { locale: "es", other: 2 },
        obj: { locale: "fr" },
      });
    });

    it("should update injectLocaleKeys, does not add extra keys from originalInput", async () => {
      const loader = createInjectLocaleLoader([
        "lang",
        "meta.locale",
        "obj.locale",
      ]);
      loader.setDefaultLocale(originalLocale);
      const originalInput = {
        lang: "en",
        value: 1,
        meta: { locale: "en", other: 1 },
        obj: { locale: "en" },
        extra: 5,
      };
      await loader.pull(originalLocale, originalInput);
      const data = { value: 2, meta: { other: 2 } };
      const result = await loader.push("fr", data);
      expect(result).toEqual({
        lang: "fr",
        value: 2,
        meta: { locale: "fr", other: 2 },
        obj: { locale: "fr" },
      });
    });

    it("should not inject locale if it was not in originalInput", async () => {
      const loader = createInjectLocaleLoader(["lang"]);
      loader.setDefaultLocale(originalLocale);
      const originalInput = { value: 1, meta: { other: 1 } };
      await loader.pull(originalLocale, originalInput);
      const data = { value: 2, meta: { other: 2 } };
    });

    it("should set wildcard-matched keys to new locale if they matched originalLocale", async () => {
      const loader = createInjectLocaleLoader([
        "pages.*.locale",
        "meta/*/lang",
      ]);
      loader.setDefaultLocale(originalLocale);
      const originalInput = {
        pages: {
          foo: { locale: "en", value: 1 },
          bar: { locale: "en", value: 2 },
          baz: { locale: "fr", value: 3 },
        },
        "meta/a/lang": "en",
        "meta/b/lang": "fr",
        "meta/c/lang": "en",
      };
      await loader.pull(originalLocale, originalInput);
      const data = {
        pages: {
          foo: { value: 10 },
          bar: { value: 20 },
          baz: { locale: "fr", value: 30 },
        },
        "meta/b/lang": "fr",
      };
      const result = await loader.push("de", data);
      expect(result).toEqual({
        pages: {
          foo: { locale: "de", value: 10 },
          bar: { locale: "de", value: 20 },
          baz: { locale: "fr", value: 30 },
        },
        "meta/a/lang": "de",
        "meta/b/lang": "fr",
        "meta/c/lang": "de",
      });
    });
  });
});

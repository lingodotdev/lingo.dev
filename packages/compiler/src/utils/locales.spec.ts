import { describe, it, expect } from "vitest";
import { getInvalidLocales, getLocaleModel } from "./locales";

describe("utils/locales", () => {
  describe("getLocaleModel", () => {
    const models = {
      "en:es": "groq:llama3",
      "en:*": "google:g2",
      "*:es": "mistral:m-small",
      "*:*": "openrouter:gpt",
    };

    it.each([
      ["en", "es", { provider: "groq", model: "llama3" }],
      ["en", "fr", { provider: "google", model: "g2" }],
      ["de", "es", { provider: "mistral", model: "m-small" }],
      ["de", "fr", { provider: "openrouter", model: "gpt" }],
    ])("resolves locales", (sourceLocale, targetLocale, expected) => {
      expect(getLocaleModel(models, sourceLocale, targetLocale)).toEqual(
        expected,
      );
    });

    it("returns undefined for missing mapping", () => {
      expect(getLocaleModel({ "en:es": "groq:llama3" }, "en", "fr")).toEqual({
        provider: undefined,
        model: undefined,
      });
    });

    it("returns undefined for invalid value", () => {
      expect(getLocaleModel({ "en:fr": "invalidFormat" }, "en", "fr")).toEqual({
        provider: undefined,
        model: undefined,
      });
    });
  });

  describe("getInvalidLocales", () => {
    it("returns targets with unresolved models", () => {
      const models = { "en:es": "groq:llama3", "*:fr": "google:g2" };
      const invalid = getInvalidLocales(models, "en", ["es", "fr", "de"]);
      expect(invalid).toEqual(["de"]);
    });
  });
});

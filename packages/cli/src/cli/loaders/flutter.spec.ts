import { describe, it, expect } from "vitest";
import createFlutterLoader from "./flutter";

const locale = "en";
const originalLocale = "en";

describe("createFlutterLoader", () => {
  describe("pull", () => {
    it("should remove metadata keys starting with @", async () => {
      const loader = createFlutterLoader();
      loader.setDefaultLocale(locale);
      const input = {
        "@metadata": "some-data",
        hello: "world",
        another_key: "another_value",
        "@@locale": "en",
      };
      const expected = {
        hello: "world",
        another_key: "another_value",
      };
      const result = await loader.pull("en", input);
      expect(result).toEqual(expected);
    });

    it("should return an empty object if all keys are metadata", async () => {
      const loader = createFlutterLoader();
      loader.setDefaultLocale(locale);
      const input = {
        "@metadata": "some-data",
        "@@locale": "en",
      };
      const expected = {};
      const result = await loader.pull("en", input);
      expect(result).toEqual(expected);
    });

    it("should return the same object if no keys are metadata", async () => {
      const loader = createFlutterLoader();
      loader.setDefaultLocale(locale);
      const input = {
        hello: "world",
        another_key: "another_value",
      };
      const expected = {
        hello: "world",
        another_key: "another_value",
      };
      const result = await loader.pull("en", input);
      expect(result).toEqual(expected);
    });

    it("should handle empty input", async () => {
      const loader = createFlutterLoader();
      loader.setDefaultLocale(locale);
      const input = {};
      const expected = {};
      const result = await loader.pull("en", input);
      expect(result).toEqual(expected);
    });
  });

  describe("push", () => {
    it("should merge data and add locale", async () => {
      const loader = createFlutterLoader();
      loader.setDefaultLocale(locale);
      const originalInput = {
        hello: "world",
        "@metadata": "some-data",
      };
      await loader.pull(originalLocale, originalInput);
      const data = {
        foo: "bar",
        hello: "monde",
      };
      const expected = {
        hello: "monde",
        foo: "bar",
        "@metadata": "some-data",
        "@@locale": "fr",
      };
      const result = await loader.push("fr", data);
      expect(result).toEqual(expected);
    });

    it("should handle empty original input", async () => {
      const loader = createFlutterLoader();
      loader.setDefaultLocale(locale);
      const originalInput = {};
      await loader.pull(originalLocale, originalInput);
      const data = {
        foo: "bar",
      };
      const expected = {
        foo: "bar",
        "@@locale": "en",
      };
      const result = await loader.push("en", data);
      expect(result).toEqual(expected);
    });

    it("should handle empty data, not add extra keys from originalInput", async () => {
      const loader = createFlutterLoader();
      loader.setDefaultLocale(locale);
      const originalInput = {
        hello: "world",
      };
      await loader.pull(originalLocale, originalInput);
      const data = {
        goodbye: "moon",
      };
      const expected = {
        goodbye: "moon",
        "@@locale": "en",
      };
      const result = await loader.push("en", data);
      expect(result).toEqual(expected);
    });
  });
});

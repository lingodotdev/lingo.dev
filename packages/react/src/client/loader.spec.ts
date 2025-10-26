import { describe, it, expect } from "vitest";
import { loadDictionary_internal } from "./loader";

vi.mock("../core", () => {
  return {
    getDictionary: vi.fn(async (locale, loaders) => {
      if (locale === "es") return { hello: "Hola" };
      if (locale === "en") return { hello: "Hello" };
      return {};
    }),
  };
});

import { getDictionary } from "../core";

describe("client/loader", () => {
  describe("loadDictionary_internal", () => {
    it("delegates to core getDictionary via internal wrapper", async () => {
      const loaders = {
        en: async () => ({ default: { hello: "Hello" } }),
        es: async () => ({ default: { hello: "Hola" } }),
      };
      const result = await loadDictionary_internal("es", loaders);
      expect(getDictionary).toHaveBeenCalledWith("es", loaders);
      expect(result).toEqual({ hello: "Hola" });
    });
  });
});

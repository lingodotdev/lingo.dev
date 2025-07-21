import { describe, it, expect, vi, beforeEach } from "vitest";
import { LCPServer } from "./server";
import { LCPSchema } from "./schema";
import { LCPCache } from "./cache";
import { LCPAPI } from "./api";

describe("LCPServer", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.mock("fs");
    vi.mock("path");
  });

  describe("loadDictionaries", () => {
    it("should load dictionaries for all target locales", async () => {
      const lcp: LCPSchema = {
        version: 0.1,
        files: {},
      };
      const loadDictionaryForLocaleSpy = vi.spyOn(
        LCPServer,
        "loadDictionaryForLocale",
      );
      const dictionaries = await LCPServer.loadDictionaries({
        models: {
          "*:*": "groq:mistral-saba-24b",
        },
        lcp,
        sourceLocale: "en",
        targetLocales: ["fr", "es", "de"],
        sourceRoot: "src",
        lingoDir: "lingo",
      });

      expect(loadDictionaryForLocaleSpy).toHaveBeenCalledTimes(4);
      expect(dictionaries).toEqual({
        fr: {
          version: 0.1,
          locale: "fr",
          files: {},
        },
        es: {
          version: 0.1,
          locale: "es",
          files: {},
        },
        de: {
          version: 0.1,
          locale: "de",
          files: {},
        },
        en: {
          version: 0.1,
          locale: "en",
          files: {},
        },
      });
    });
  });

  describe("loadDictionaryForLocale", () => {
    it("should correctly extract the source dictionary when source and target locales are the same", async () => {
      // Mock LCPAPI.translate() to ensure it's not called
      const translateSpy = vi.spyOn(LCPAPI, "translate");

      const lcp: LCPSchema = {
        version: 0.1,
        files: {
          "app/test.tsx": {
            scopes: {
              key1: {
                content: "Hello World",
                hash: "abcd1234",
              },
              key2: {
                content: "Button Text",
                hash: "efgh5678",
              },
            },
          },
        },
      };

      const result = await LCPServer.loadDictionaryForLocale({
        lcp,
        sourceLocale: "en",
        targetLocale: "en", // Same locale
        sourceRoot: "src",
        lingoDir: "lingo",
      });

      // Verify the structure
      expect(result).toEqual({
        version: 0.1,
        locale: "en",
        files: {
          "app/test.tsx": {
            entries: {
              key1: "Hello World",
              key2: "Button Text",
            },
          },
        },
      });

      // Ensure LCPAPI.translate() wasn't called since source == target
      expect(translateSpy).not.toHaveBeenCalled();
    });

    it("should return empty dictionary when source dictionary is empty", async () => {
      // Mock LCPAPI.translate() to ensure it's not called
      const translateSpy = vi.spyOn(LCPAPI, "translate");

      const lcp: LCPSchema = {
        version: 0.1,
        files: {},
      };

      const result = await LCPServer.loadDictionaryForLocale({
        lcp,
        sourceLocale: "en",
        targetLocale: "es",
        sourceRoot: "src",
        lingoDir: "lingo",
      });

      // Verify the structure
      expect(result).toEqual({
        version: 0.1,
        locale: "es",
        files: {},
      });

      // Ensure LCPAPI.translate() wasn't called since source == target
      expect(translateSpy).not.toHaveBeenCalled();
    });

    it("should handle overrides in source content", async () => {
      // Mock LCPAPI.translate() to ensure it's not called
      vi.spyOn(LCPAPI, "translate").mockImplementation(() =>
        Promise.resolve({
          version: 0.1,
          locale: "fr",
          files: {
            "app/test.tsx": {
              entries: {
                key1: "Bonjour le monde",
                key2: "Texte du bouton",
              },
            },
          },
        }),
      );

      const lcp: LCPSchema = {
        version: 0.1,
        files: {
          "app/test.tsx": {
            scopes: {
              key1: {
                content: "Hello World",
                hash: "abcd1234",
              },
              key2: {
                content: "Button Text",
                hash: "efgh5678",
              },
              key3: {
                content: "Original",
                hash: "1234abcd",
                overrides: {
                  fr: "Remplacé", // French override for 'key3'
                },
              },
            },
          },
        },
      };

      const result = await LCPServer.loadDictionaryForLocale({
        lcp,
        sourceLocale: "en",
        targetLocale: "fr",
        sourceRoot: "src",
        lingoDir: "lingo",
      });

      // Check that the overrides were applied
      expect(result.files["app/test.tsx"].entries).toEqual({
        key1: "Bonjour le monde",
        key2: "Texte du bouton",
        key3: "Remplacé",
      });
      expect(result.locale).toBe("fr");
    });

    it("should create empty dictionary when no files are provided", async () => {
      const lcp: LCPSchema = {
        version: 0.1,
      };

      const result = await LCPServer.loadDictionaryForLocale({
        lcp,
        sourceLocale: "en",
        targetLocale: "en",
        sourceRoot: "src",
        lingoDir: "lingo",
      });

      expect(result).toEqual({
        version: 0.1,
        locale: "en",
        files: {},
      });
    });

    it("should read dictionary from cache only, not call LCPAPI.translate()", async () => {
      vi.spyOn(LCPCache, "readLocaleDictionary").mockReturnValue({
        version: 0.1,
        locale: "en",
        files: {
          "app/test.tsx": {
            entries: {
              key1: "Hello World",
              key2: "Button Text",
              key3: "New text",
            },
          },
        },
      });
      const translateSpy = vi
        .spyOn(LCPAPI, "translate")
        .mockImplementation(() => {
          throw new Error("Should not translate anything");
        });

      const lcp: LCPSchema = {
        version: 0.1,
        files: {
          "app/test.tsx": {
            scopes: {
              key1: {
                content: "Hello World",
              },
            },
          },
        },
      };

      await LCPServer.loadDictionaryForLocale({
        lcp,
        sourceLocale: "en",
        targetLocale: "fr",
        sourceRoot: "src",
        lingoDir: "lingo",
      });

      expect(translateSpy).not.toHaveBeenCalled();
      expect(LCPCache.readLocaleDictionary).toHaveBeenCalledWith("fr", {
        lcp,
        sourceLocale: "en",
        lingoDir: "lingo",
        sourceRoot: "src",
      });
    });

    it("should write dictionary to cache", async () => {
      vi.spyOn(LCPCache, "writeLocaleDictionary");
      vi.spyOn(LCPAPI, "translate").mockReturnValue({
        version: 0.1,
        locale: "fr",
        files: {
          "app/test.tsx": {
            entries: {
              key1: "Bonjour le monde",
              key2: "Texte du bouton",
            },
          },
        },
      });

      const lcp: LCPSchema = {
        version: 0.1,
        files: {
          "app/test.tsx": {
            scopes: {
              key1: {
                content: "Hello World",
                hash: "abcd1234",
              },
              key2: {
                content: "Button Text",
                hash: "efgh5678",
              },
            },
          },
        },
      };

      await LCPServer.loadDictionaryForLocale({
        lcp,
        sourceLocale: "en",
        targetLocale: "fr",
        sourceRoot: "src",
        lingoDir: "lingo",
      });

      expect(LCPCache.writeLocaleDictionary).toHaveBeenCalledWith(
        {
          files: {
            "app/test.tsx": {
              entries: {
                key1: "Bonjour le monde",
                key2: "Texte du bouton",
              },
            },
          },
          locale: "fr",
          version: 0.1,
        },
        {
          lcp,
          sourceLocale: "en",
          lingoDir: "lingo",
          sourceRoot: "src",
        },
      );
    });

    it("should reuse cached keys with matching hash, call LCPAPI.translate() for keys with different hash, fallback to source locale, cache new translations", async () => {
      vi.spyOn(LCPCache, "readLocaleDictionary").mockReturnValue({
        version: 0.1,
        locale: "fr",
        files: {
          "app/test.tsx": {
            entries: {
              key1: "Bonjour le monde",
            },
          },
        },
      });
      const writeCacheSpy = vi.spyOn(LCPCache, "writeLocaleDictionary");
      const translateSpy = vi.spyOn(LCPAPI, "translate").mockResolvedValue({
        version: 0.1,
        locale: "fr",
        files: {
          "app/test.tsx": {
            entries: {
              key2: "Nouveau texte du bouton",
              key3: "", // LLM might return empty string
            },
          },
        },
      });

      const lcp: LCPSchema = {
        version: 0.1,
        files: {
          "app/test.tsx": {
            scopes: {
              key1: {
                content: "Hello World",
                hash: "abcd1234",
              },
              key2: {
                content: "Button Text",
                hash: "new_hash",
              },
              key3: {
                content: "New text",
                hash: "ijkl4321",
              },
            },
          },
        },
      };

      const models = {
        "*:*": "groq:mistral-saba-24b",
      };

      const result = await LCPServer.loadDictionaryForLocale({
        models,
        lcp,
        sourceLocale: "en",
        targetLocale: "fr",
        sourceRoot: "src",
        lingoDir: "lingo",
      });

      // Verify that only changed content was sent for translation
      expect(translateSpy).toHaveBeenCalledWith(
        models,
        {
          version: 0.1,
          locale: "en",
          files: {
            "app/test.tsx": {
              entries: {
                key2: "Button Text",
                key3: "New text",
              },
            },
          },
        },
        "en",
        "fr",
        undefined,
      );

      // Verify final result combines cached and newly translated content
      expect(result).toEqual({
        version: 0.1,
        locale: "fr",
        files: {
          "app/test.tsx": {
            entries: {
              key1: "Bonjour le monde",
              key2: "Nouveau texte du bouton",
              key3: "New text", // LLM returned empty string, but result contains fallback to source locale string
            },
          },
        },
      });

      // when LLM returns empty string, we cache empty string (the result contains fallback to source locale string)
      result.files["app/test.tsx"].entries.key3 = "";

      // Verify cache is updated with new translations
      expect(writeCacheSpy).toHaveBeenCalledWith(result, {
        lcp,
        sourceLocale: "en",
        lingoDir: "lingo",
        sourceRoot: "src",
      });
    });
  });

  describe("_getDictionaryDiff", () => {
    it("should return diff between source and target dictionaries", () => {
      const sourceDictionary = {
        version: 0.1,
        locale: "en",
        files: {
          "app/test.tsx": {
            entries: {
              key1: "Hello World",
              key2: "Button Text",
              key3: "New Text",
              key4: "More text",
            },
          },
        },
      };

      const targetDictionary = {
        version: 0.1,
        locale: "es",
        files: {
          "app/test.tsx": {
            entries: {
              key1: "Hola mundo",
              key2: "El texto del botón",
              key3: "", // empty string is valid value
            },
          },
        },
      };

      const diff = (LCPServer as any)._getDictionaryDiff(
        sourceDictionary,
        targetDictionary,
      );

      expect(diff).toEqual({
        version: 0.1,
        locale: "en",
        files: {
          "app/test.tsx": {
            entries: {
              key4: "More text",
            },
          },
        },
      });
    });
  });

  describe("_mergeDictionaries", () => {
    it("should merge dictionaries", () => {
      const sourceDictionary = {
        version: 0.1,
        locale: "es",
        files: {
          "app/test.tsx": {
            entries: {
              key2: "",
              key3: "Nuevo texto",
            },
          },
          "app/test3.tsx": {
            entries: {
              key1: "Como estas?",
              key2: "Yo soy bien",
            },
          },
        },
      };

      const targetDictionary = {
        version: 0.1,
        locale: "es",
        files: {
          "app/test.tsx": {
            entries: {
              key1: "Hola mundo",
              key2: "Hola",
            },
          },
          "app/test2.tsx": {
            entries: {
              key1: "Yo soy un programador",
              key2: "",
            },
          },
        },
      };

      const merge = (LCPServer as any)._mergeDictionaries(
        sourceDictionary,
        targetDictionary,
      );

      expect(merge).toEqual({
        version: 0.1,
        locale: "es",
        files: {
          "app/test.tsx": {
            entries: {
              key1: "Hola mundo",
              key2: "",
              key3: "Nuevo texto",
            },
          },
          "app/test2.tsx": {
            entries: {
              key1: "Yo soy un programador",
              key2: "",
            },
          },
          "app/test3.tsx": {
            entries: {
              key1: "Como estas?",
              key2: "Yo soy bien",
            },
          },
        },
      });
    });

    it("should remove empty entries when merging dictionaries", () => {
      const sourceDictionary = {
        version: 0.1,
        locale: "es",
        files: {
          "app/test.tsx": {
            entries: {
              key1: "",
              key2: "El texto del botón",
            },
          },
          "app/test2.tsx": {
            entries: {
              key1: "Yo soy un programador",
              key2: "",
            },
          },
        },
      };

      const targetDictionary = {
        version: 0.1,
        locale: "es",
        files: {
          "app/test.tsx": {
            entries: {
              key1: "Hello world",
              key2: "Button Text",
            },
          },
          "app/test2.tsx": {
            entries: {
              key1: "I am a programmer",
              key2: "You are a gardener",
            },
          },
        },
      };

      const merge = (LCPServer as any)._mergeDictionaries(
        sourceDictionary,
        targetDictionary,
        true,
      );

      expect(merge).toEqual({
        version: 0.1,
        locale: "es",
        files: {
          "app/test.tsx": {
            entries: {
              key1: "Hello world",
              key2: "El texto del botón",
            },
          },
          "app/test2.tsx": {
            entries: {
              key1: "Yo soy un programador",
              key2: "You are a gardener",
            },
          },
        },
      });
    });
  });
});

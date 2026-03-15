import { describe, it, expect } from "vitest";
import createXcodeXcstringsV2Loader from "./xcode-xcstrings-v2";

describe("loaders/xcode-xcstrings-v2", () => {
  const defaultLocale = "en";

  const mockInput = {
    sourceLanguage: "en",
    strings: {
      "app.title": {
        comment: "The main app title",
        localizations: {
          en: {
            stringUnit: {
              state: "translated",
              value: "My App",
            },
          },
          es: {
            stringUnit: {
              state: "translated",
              value: "Mi App",
            },
          },
        },
      },
      item_count: {
        comment: "Number of items",
        localizations: {
          en: {
            variations: {
              plural: {
                one: {
                  stringUnit: {
                    state: "translated",
                    value: "1 item",
                  },
                },
                other: {
                  stringUnit: {
                    state: "translated",
                    value: "%d items",
                  },
                },
              },
            },
          },
          es: {
            variations: {
              plural: {
                one: {
                  stringUnit: {
                    state: "translated",
                    value: "1 artículo",
                  },
                },
                other: {
                  stringUnit: {
                    state: "translated",
                    value: "%d artículos",
                  },
                },
              },
            },
          },
        },
      },
      notification_message: {
        comment: "Notification with substitutions",
        localizations: {
          en: {
            stringUnit: {
              state: "translated",
              value: "You have %#@COUNT@ pending",
            },
            substitutions: {
              COUNT: {
                argNum: 1,
                formatSpecifier: "lld",
                variations: {
                  plural: {
                    one: {
                      stringUnit: {
                        state: "translated",
                        value: "1 notification",
                      },
                    },
                    other: {
                      stringUnit: {
                        state: "translated",
                        value: "%arg notifications",
                      },
                    },
                  },
                },
              },
            },
          },
          es: {
            stringUnit: {
              state: "translated",
              value: "Tienes %#@COUNT@ pendientes",
            },
            substitutions: {
              COUNT: {
                argNum: 1,
                formatSpecifier: "lld",
                variations: {
                  plural: {
                    one: {
                      stringUnit: {
                        state: "translated",
                        value: "1 notificación",
                      },
                    },
                    other: {
                      stringUnit: {
                        state: "translated",
                        value: "%arg notificaciones",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      phrase: {
        comment: "String set for Siri",
        localizations: {
          en: {
            stringSet: {
              state: "translated",
              values: ["First variant", "Second variant"],
            },
          },
          es: {
            stringSet: {
              state: "translated",
              values: ["Primera variante", "Segunda variante"],
            },
          },
        },
      },
      "key.no-translate": {
        shouldTranslate: false,
        localizations: {
          en: {
            stringUnit: {
              state: "translated",
              value: "Do not translate",
            },
          },
        },
      },
      "key.source-only": {
        localizations: {},
      },
      "key.missing-localization": {
        localizations: {
          es: {
            stringUnit: {
              state: "translated",
              value: "solo español",
            },
          },
        },
      },
    },
    version: "1.0",
  };

  describe("pull", () => {
    it("should pull simple string translations", async () => {
      const loader = createXcodeXcstringsV2Loader(defaultLocale);
      loader.setDefaultLocale(defaultLocale);
      await loader.pull(defaultLocale, mockInput);
      const result = await loader.pull("es", mockInput);

      expect(result).toMatchObject({
        "app.title": {
          stringUnit: "Mi App",
        },
      });
    });

    it("should pull plural variations and convert to ICU", async () => {
      const loader = createXcodeXcstringsV2Loader(defaultLocale);
      loader.setDefaultLocale(defaultLocale);
      await loader.pull(defaultLocale, mockInput);
      const result = await loader.pull("es", mockInput);

      expect(result["item_count"]).toHaveProperty("variations");
      expect(result["item_count"].variations).toHaveProperty("plural");
      expect(typeof result["item_count"].variations.plural).toBe("string");
      expect(result["item_count"].variations.plural).toMatch(
        /^\{[\w]+,\s*plural,/,
      );
    });

    it("should pull substitutions with ICU conversion", async () => {
      const loader = createXcodeXcstringsV2Loader(defaultLocale);
      loader.setDefaultLocale(defaultLocale);
      await loader.pull(defaultLocale, mockInput);
      const result = await loader.pull("es", mockInput);

      expect(result["notification_message"]).toHaveProperty("stringUnit");
      expect(result["notification_message"].stringUnit).toBe(
        "Tienes %#@COUNT@ pendientes",
      );

      expect(result["notification_message"]).toHaveProperty("substitutions");
      expect(result["notification_message"].substitutions).toHaveProperty(
        "COUNT",
      );
      expect(
        typeof result["notification_message"].substitutions.COUNT.variations
          .plural,
      ).toBe("string");
      expect(
        result["notification_message"].substitutions.COUNT.variations.plural,
      ).toMatch(/^\{[\w]+,\s*plural,/);
    });

    it("should pull stringSet arrays", async () => {
      const loader = createXcodeXcstringsV2Loader(defaultLocale);
      loader.setDefaultLocale(defaultLocale);
      await loader.pull(defaultLocale, mockInput);
      const result = await loader.pull("es", mockInput);

      expect(result["phrase"]).toHaveProperty("stringSet");
      expect(result["phrase"].stringSet).toEqual([
        "Primera variante",
        "Segunda variante",
      ]);
    });

    it("should skip keys marked with shouldTranslate: false", async () => {
      const loader = createXcodeXcstringsV2Loader(defaultLocale);
      loader.setDefaultLocale(defaultLocale);
      await loader.pull(defaultLocale, mockInput);
      const result = await loader.pull("en", mockInput);

      expect(result).not.toHaveProperty("key.no-translate");
    });

    it("should handle source language fallback for missing localizations", async () => {
      const loader = createXcodeXcstringsV2Loader(defaultLocale);
      loader.setDefaultLocale(defaultLocale);
      await loader.pull(defaultLocale, mockInput);
      const result = await loader.pull("en", mockInput);

      expect(result["key.source-only"]).toHaveProperty("stringUnit");
      expect(result["key.source-only"].stringUnit).toBe("key.source-only");
    });

    it("should not include missing localizations for non-source language", async () => {
      const loader = createXcodeXcstringsV2Loader(defaultLocale);
      loader.setDefaultLocale(defaultLocale);
      await loader.pull(defaultLocale, mockInput);
      const result = await loader.pull("es", mockInput);

      expect(result).not.toHaveProperty("key.source-only");
    });

    it("should handle zero form in plural variations", async () => {
      const inputWithZero = {
        sourceLanguage: "en",
        strings: {
          items: {
            localizations: {
              en: {
                variations: {
                  plural: {
                    zero: {
                      stringUnit: {
                        state: "translated",
                        value: "No items",
                      },
                    },
                    one: {
                      stringUnit: {
                        state: "translated",
                        value: "1 item",
                      },
                    },
                    other: {
                      stringUnit: {
                        state: "translated",
                        value: "%d items",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };

      const loader = createXcodeXcstringsV2Loader(defaultLocale);
      loader.setDefaultLocale(defaultLocale);
      const result = await loader.pull("en", inputWithZero);

      // English "zero" is optional, so it should be converted to =0
      expect(result["items"].variations.plural).toContain("=0 {No items}");
      expect(result["items"].variations.plural).toContain("one {1 item}");
      expect(result["items"].variations.plural).toContain("other {%d items}");
    });

    it("should handle exact match forms (=0, =1) in ICU strings", async () => {
      const inputWithExact = {
        sourceLanguage: "en",
        strings: {
          downloads: {
            localizations: {
              en: {
                variations: {
                  plural: {
                    "=0": {
                      stringUnit: {
                        state: "translated",
                        value: "No downloads",
                      },
                    },
                    "=1": {
                      stringUnit: {
                        state: "translated",
                        value: "One download",
                      },
                    },
                    other: {
                      stringUnit: {
                        state: "translated",
                        value: "%d downloads",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };

      const loader = createXcodeXcstringsV2Loader(defaultLocale);
      loader.setDefaultLocale(defaultLocale);
      const result = await loader.pull("en", inputWithExact);

      expect(result["downloads"].variations.plural).toContain(
        "=0 {No downloads}",
      );
      expect(result["downloads"].variations.plural).toContain(
        "=1 {One download}",
      );
    });

    it("should handle different format specifiers in plural forms", async () => {
      const inputWithSpecifiers = {
        sourceLanguage: "en",
        strings: {
          messages: {
            localizations: {
              en: {
                stringUnit: {
                  state: "translated",
                  value: "You have %#@COUNT@",
                },
                substitutions: {
                  COUNT: {
                    formatSpecifier: "lld",
                    variations: {
                      plural: {
                        one: {
                          stringUnit: {
                            state: "translated",
                            value: "%arg message",
                          },
                        },
                        other: {
                          stringUnit: {
                            state: "translated",
                            value: "%@ messages",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };

      const loader = createXcodeXcstringsV2Loader(defaultLocale);
      loader.setDefaultLocale(defaultLocale);
      const result = await loader.pull("en", inputWithSpecifiers);

      const icuString =
        result["messages"].substitutions.COUNT.variations.plural;
      expect(icuString).toContain("%arg message");
      expect(icuString).toContain("%@ messages");
    });

    it("should handle multiple substitutions in one string", async () => {
      const inputWithMultipleSubs = {
        sourceLanguage: "en",
        strings: {
          complex: {
            localizations: {
              en: {
                stringUnit: {
                  state: "translated",
                  value: "%#@FILES@ in %#@FOLDERS@",
                },
                substitutions: {
                  FILES: {
                    formatSpecifier: "d",
                    variations: {
                      plural: {
                        one: {
                          stringUnit: {
                            state: "translated",
                            value: "1 file",
                          },
                        },
                        other: {
                          stringUnit: {
                            state: "translated",
                            value: "%d files",
                          },
                        },
                      },
                    },
                  },
                  FOLDERS: {
                    formatSpecifier: "d",
                    variations: {
                      plural: {
                        one: {
                          stringUnit: {
                            state: "translated",
                            value: "1 folder",
                          },
                        },
                        other: {
                          stringUnit: {
                            state: "translated",
                            value: "%d folders",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };

      const loader = createXcodeXcstringsV2Loader(defaultLocale);
      loader.setDefaultLocale(defaultLocale);
      const result = await loader.pull("en", inputWithMultipleSubs);

      expect(result["complex"].stringUnit).toBe("%#@FILES@ in %#@FOLDERS@");
      expect(result["complex"].substitutions).toHaveProperty("FILES");
      expect(result["complex"].substitutions).toHaveProperty("FOLDERS");
      expect(result["complex"].substitutions.FILES.variations.plural).toMatch(
        /^\{[\w]+,\s*plural,/,
      );
      expect(result["complex"].substitutions.FOLDERS.variations.plural).toMatch(
        /^\{[\w]+,\s*plural,/,
      );
    });

    it("should handle stringSet with empty array", async () => {
      const inputWithEmptySet = {
        sourceLanguage: "en",
        strings: {
          empty_phrase: {
            localizations: {
              en: {
                stringSet: {
                  state: "translated",
                  values: [],
                },
              },
            },
          },
        },
      };

      const loader = createXcodeXcstringsV2Loader(defaultLocale);
      loader.setDefaultLocale(defaultLocale);
      const result = await loader.pull("en", inputWithEmptySet);

      // Empty stringSet should not be included
      expect(result["empty_phrase"]).toEqual({});
    });

    it("should work with constructor defaultLocale parameter", async () => {
      const loader = createXcodeXcstringsV2Loader("en");
      // Pass defaultLocale via constructor and call setDefaultLocale
      loader.setDefaultLocale("en");
      const result = await loader.pull("en", mockInput);

      // Should work the same as when defaultLocale is set explicitly
      expect(result["key.source-only"]).toHaveProperty("stringUnit");
      expect(result["key.source-only"].stringUnit).toBe("key.source-only");
    });
  });

  describe("push", () => {
    it("should push simple string translations", async () => {
      const loader = createXcodeXcstringsV2Loader(defaultLocale);
      loader.setDefaultLocale(defaultLocale);

      // Must pull first to initialize state
      await loader.pull(defaultLocale, mockInput);

      const payload = {
        "app.title": {
          stringUnit: "Mon Application",
        },
      };

      const result = await loader.push("fr", payload);

      expect(result!.strings["app.title"].localizations["fr"]).toEqual({
        stringUnit: {
          state: "translated",
          value: "Mon Application",
        },
      });
    });

    it("should push plural variations from ICU format", async () => {
      const loader = createXcodeXcstringsV2Loader(defaultLocale);
      loader.setDefaultLocale(defaultLocale);

      // Must pull first to initialize state (pull both locales to get full state)
      await loader.pull(defaultLocale, mockInput);
      await loader.pull("es", mockInput);

      const payload = {
        item_count: {
          variations: {
            plural: "{count, plural, one {1 article} other {%d articles}}",
          },
        },
      };

      const result = await loader.push("fr", payload);

      expect(result).not.toBeNull();
      expect(result!.strings["item_count"]).toBeDefined();
      expect(result!.strings["item_count"].localizations).toBeDefined();
      expect(result!.strings["item_count"].localizations["fr"]).toBeDefined();
      expect(result!.strings["item_count"].localizations["fr"]).toHaveProperty(
        "variations",
      );
      expect(
        result!.strings["item_count"].localizations["fr"].variations,
      ).toHaveProperty("plural");
      expect(
        result!.strings["item_count"].localizations["fr"].variations.plural,
      ).toHaveProperty("one");
      expect(
        result!.strings["item_count"].localizations["fr"].variations.plural,
      ).toHaveProperty("other");
    });

    it("should push substitutions with plural variations", async () => {
      const loader = createXcodeXcstringsV2Loader(defaultLocale);
      loader.setDefaultLocale(defaultLocale);

      // Must pull first to initialize state (pull both locales to get full state)
      await loader.pull(defaultLocale, mockInput);
      await loader.pull("es", mockInput);

      const payload = {
        notification_message: {
          stringUnit: "Vous avez %#@COUNT@ en attente",
          substitutions: {
            COUNT: {
              variations: {
                plural:
                  "{count, plural, one {1 notification} other {%lld notifications}}",
              },
            },
          },
        },
      };

      const result = await loader.push("fr", payload);

      expect(
        result!.strings["notification_message"].localizations["fr"].stringUnit,
      ).toEqual({
        state: "translated",
        value: "Vous avez %#@COUNT@ en attente",
      });

      expect(
        result!.strings["notification_message"].localizations["fr"],
      ).toHaveProperty("substitutions");
      expect(
        result!.strings["notification_message"].localizations["fr"]
          .substitutions.COUNT,
      ).toHaveProperty("formatSpecifier");
      expect(
        result!.strings["notification_message"].localizations["fr"]
          .substitutions.COUNT.formatSpecifier,
      ).toBe("lld");
    });

    it("should push plural variations with locale-specific forms (Russian few/many)", async () => {
      const loader = createXcodeXcstringsV2Loader(defaultLocale);
      loader.setDefaultLocale(defaultLocale);

      // Pull English (has one/other) to initialize
      await loader.pull(defaultLocale, mockInput);

      // Push Russian with extra plural forms (one/few/many/other)
      // This simulates backend adding locale-specific forms
      const payload = {
        item_count: {
          variations: {
            plural:
              "{count, plural, one {1 артикул} few {%d артикула} many {%d артикулов} other {%d артикулов}}",
          },
        },
      };

      const result = await loader.push("ru", payload);

      expect(
        result!.strings["item_count"].localizations["ru"].variations.plural,
      ).toHaveProperty("one");
      expect(
        result!.strings["item_count"].localizations["ru"].variations.plural,
      ).toHaveProperty("few");
      expect(
        result!.strings["item_count"].localizations["ru"].variations.plural,
      ).toHaveProperty("many");
      expect(
        result!.strings["item_count"].localizations["ru"].variations.plural,
      ).toHaveProperty("other");

      // Verify all forms have format specifiers restored (not {variable:0})
      expect(
        result!.strings["item_count"].localizations["ru"].variations.plural.few
          .stringUnit.value,
      ).toBe("%d артикула");
      expect(
        result!.strings["item_count"].localizations["ru"].variations.plural.many
          .stringUnit.value,
      ).toBe("%d артикулов");
      expect(
        result!.strings["item_count"].localizations["ru"].variations.plural
          .other.stringUnit.value,
      ).toBe("%d артикулов");
    });

    it("should push stringSet arrays", async () => {
      const loader = createXcodeXcstringsV2Loader(defaultLocale);
      loader.setDefaultLocale(defaultLocale);

      // Must pull first to initialize state
      await loader.pull(defaultLocale, mockInput);

      const payload = {
        phrase: {
          stringSet: ["Première variante", "Deuxième variante"],
        },
      };

      const result = await loader.push("fr", payload);

      expect(result!.strings["phrase"].localizations["fr"]).toEqual({
        stringSet: {
          state: "translated",
          values: ["Première variante", "Deuxième variante"],
        },
      });
    });

    it("should preserve shouldTranslate flag", async () => {
      const loader = createXcodeXcstringsV2Loader(defaultLocale);
      loader.setDefaultLocale(defaultLocale);

      // Must pull first to initialize state
      await loader.pull(defaultLocale, mockInput);

      const payload = {
        "key.no-translate": {
          stringUnit: "Still do not translate",
        },
      };

      const result = await loader.push("fr", payload);

      expect(result!.strings["key.no-translate"].shouldTranslate).toBe(false);
    });

    it("should preserve extractionState from original", async () => {
      const loader = createXcodeXcstringsV2Loader(defaultLocale);
      loader.setDefaultLocale(defaultLocale);

      const inputWithExtraction = {
        ...mockInput,
        strings: {
          test: {
            extractionState: "manual",
            localizations: {
              en: {
                stringUnit: { state: "translated", value: "Test" },
              },
            },
          },
        },
      };

      // Must pull first to initialize state
      await loader.pull(defaultLocale, inputWithExtraction);

      const payload = {
        test: {
          stringUnit: "Prueba",
        },
      };

      const result = await loader.push("es", payload);

      expect(result!.strings.test.extractionState).toBe("manual");
    });

    it("should push to source locale (defaultLocale)", async () => {
      const loader = createXcodeXcstringsV2Loader(defaultLocale);
      loader.setDefaultLocale(defaultLocale);

      await loader.pull(defaultLocale, mockInput);

      const payload = {
        "app.title": {
          stringUnit: "Updated App",
        },
      };

      const result = await loader.push("en", payload);

      expect(result!.strings["app.title"].localizations["en"]).toEqual({
        stringUnit: {
          state: "translated",
          value: "Updated App",
        },
      });
    });

    it("should push exact match forms (=0, =1) from ICU", async () => {
      const loader = createXcodeXcstringsV2Loader(defaultLocale);
      loader.setDefaultLocale(defaultLocale);

      await loader.pull(defaultLocale, mockInput);

      const payload = {
        downloads: {
          variations: {
            plural:
              "{count, plural, =0 {No downloads} =1 {One download} other {%d downloads}}",
          },
        },
      };

      const result = await loader.push("fr", payload);

      // Exact matches (=0, =1) should be converted back to CLDR names (zero, one)
      expect(
        result!.strings["downloads"].localizations["fr"].variations.plural,
      ).toHaveProperty("zero");
      expect(
        result!.strings["downloads"].localizations["fr"].variations.plural,
      ).toHaveProperty("one");
      expect(
        result!.strings["downloads"].localizations["fr"].variations.plural[
          "zero"
        ].stringUnit.value,
      ).toBe("No downloads");
      expect(
        result!.strings["downloads"].localizations["fr"].variations.plural[
          "one"
        ].stringUnit.value,
      ).toBe("One download");
    });

    it("should push multiple substitutions correctly", async () => {
      const loader = createXcodeXcstringsV2Loader(defaultLocale);
      loader.setDefaultLocale(defaultLocale);

      const inputWithMultipleSubs = {
        sourceLanguage: "en",
        strings: {
          complex: {
            localizations: {
              en: {
                stringUnit: {
                  state: "translated",
                  value: "%#@FILES@ in %#@FOLDERS@",
                },
                substitutions: {
                  FILES: {
                    formatSpecifier: "d",
                    variations: {
                      plural: {
                        one: {
                          stringUnit: {
                            state: "translated",
                            value: "1 file",
                          },
                        },
                        other: {
                          stringUnit: {
                            state: "translated",
                            value: "%d files",
                          },
                        },
                      },
                    },
                  },
                  FOLDERS: {
                    formatSpecifier: "d",
                    variations: {
                      plural: {
                        one: {
                          stringUnit: {
                            state: "translated",
                            value: "1 folder",
                          },
                        },
                        other: {
                          stringUnit: {
                            state: "translated",
                            value: "%d folders",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };

      await loader.pull(defaultLocale, inputWithMultipleSubs);

      const payload = {
        complex: {
          stringUnit: "%#@FILES@ dans %#@FOLDERS@",
          substitutions: {
            FILES: {
              variations: {
                plural: "{count, plural, one {1 fichier} other {%d fichiers}}",
              },
            },
            FOLDERS: {
              variations: {
                plural: "{count, plural, one {1 dossier} other {%d dossiers}}",
              },
            },
          },
        },
      };

      const result = await loader.push("fr", payload);

      expect(
        result!.strings["complex"].localizations["fr"].stringUnit.value,
      ).toBe("%#@FILES@ dans %#@FOLDERS@");
      expect(
        result!.strings["complex"].localizations["fr"].substitutions.FILES
          .variations.plural,
      ).toHaveProperty("one");
      expect(
        result!.strings["complex"].localizations["fr"].substitutions.FILES
          .variations.plural,
      ).toHaveProperty("other");
      expect(
        result!.strings["complex"].localizations["fr"].substitutions.FOLDERS
          .variations.plural,
      ).toHaveProperty("one");
      expect(
        result!.strings["complex"].localizations["fr"].substitutions.FOLDERS
          .variations.plural,
      ).toHaveProperty("other");
    });

    it("should handle missing formatSpecifier in substitutions with fallback", async () => {
      const inputNoFormatSpec = {
        sourceLanguage: "en",
        strings: {
          test: {
            localizations: {
              en: {
                stringUnit: {
                  state: "translated",
                  value: "You have %#@COUNT@",
                },
                substitutions: {
                  COUNT: {
                    // Missing formatSpecifier
                    variations: {
                      plural: {
                        one: {
                          stringUnit: {
                            state: "translated",
                            value: "1 item",
                          },
                        },
                        other: {
                          stringUnit: {
                            state: "translated",
                            value: "%d items",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };

      const loader = createXcodeXcstringsV2Loader(defaultLocale);
      loader.setDefaultLocale(defaultLocale);

      await loader.pull(defaultLocale, inputNoFormatSpec);

      const payload = {
        test: {
          stringUnit: "Vous avez %#@COUNT@",
          substitutions: {
            COUNT: {
              variations: {
                plural: "{count, plural, one {1 article} other {%d articles}}",
              },
            },
          },
        },
      };

      const result = await loader.push("fr", payload);

      // Should use subName as fallback
      expect(
        result!.strings["test"].localizations["fr"].substitutions.COUNT
          .formatSpecifier,
      ).toBe("COUNT");
    });

    it("should throw error for malformed ICU plural string (unclosed brace)", async () => {
      const loader = createXcodeXcstringsV2Loader(defaultLocale);
      loader.setDefaultLocale(defaultLocale);

      await loader.pull(defaultLocale, mockInput);

      const payload = {
        item_count: {
          variations: {
            plural: "{count, plural, one {1 item} other {%d items}",
          },
        },
      };

      await expect(loader.push("fr", payload)).rejects.toThrow(
        /Unclosed brace|Failed to write plural translation/,
      );
    });

    it("should handle nested braces in ICU strings", async () => {
      const loader = createXcodeXcstringsV2Loader(defaultLocale);
      loader.setDefaultLocale(defaultLocale);

      await loader.pull(defaultLocale, mockInput);

      // ICU with nested structure (contrived example but tests parser)
      const payload = {
        nested: {
          variations: {
            plural:
              "{count, plural, one {Item: {name}} other {Items: {names}}}",
          },
        },
      };

      const result = await loader.push("fr", payload);

      expect(
        result!.strings["nested"].localizations["fr"].variations.plural.one
          .stringUnit.value,
      ).toBe("Item: {name}");
      expect(
        result!.strings["nested"].localizations["fr"].variations.plural.other
          .stringUnit.value,
      ).toBe("Items: {names}");
    });
  });

  describe("pullHints", () => {
    it("should pull hints from comments", async () => {
      const loader = createXcodeXcstringsV2Loader(defaultLocale);
      loader.setDefaultLocale(defaultLocale);

      // Must pull first to initialize state
      await loader.pull(defaultLocale, mockInput);

      const hints = await loader.pullHints();

      expect(hints).toBeDefined();
      expect(hints!["app.title"]).toEqual({
        hint: "The main app title",
      });
      expect(hints!["item_count"]).toEqual({
        hint: "Number of items",
      });
      expect(hints!["notification_message"]).toEqual({
        hint: "Notification with substitutions",
      });
    });

    it("should return empty object for input without comments", async () => {
      const loader = createXcodeXcstringsV2Loader(defaultLocale);
      loader.setDefaultLocale(defaultLocale);

      const inputNoComments = {
        sourceLanguage: "en",
        strings: {
          test: {
            localizations: {
              en: {
                stringUnit: { state: "translated", value: "Test" },
              },
            },
          },
        },
      };

      // Must pull first to initialize state
      await loader.pull(defaultLocale, inputNoComments);

      const hints = await loader.pullHints();

      expect(hints).toEqual({});
    });
  });

  describe("ICU plural form normalization", () => {
    it("should convert optional English forms (zero) to exact match (=0)", async () => {
      const loader = createXcodeXcstringsV2Loader("en");
      loader.setDefaultLocale("en");

      const input = {
        sourceLanguage: "en",
        strings: {
          items: {
            localizations: {
              en: {
                variations: {
                  plural: {
                    zero: { stringUnit: { value: "No items" } },
                    one: { stringUnit: { value: "1 item" } },
                    other: { stringUnit: { value: "%d items" } },
                  },
                },
              },
            },
          },
        },
      };

      const result = await loader.pull("en", input);

      // English: one/other are required, zero is optional → becomes =0
      expect(result.items.variations.plural).toBe(
        "{count, plural, =0 {No items} one {1 item} other {%d items}}",
      );
    });

    it("should keep required Russian forms as CLDR keywords", async () => {
      const loader = createXcodeXcstringsV2Loader("ru");
      loader.setDefaultLocale("ru");

      const input = {
        sourceLanguage: "ru",
        strings: {
          items: {
            localizations: {
              ru: {
                variations: {
                  plural: {
                    one: { stringUnit: { value: "1 предмет" } },
                    few: { stringUnit: { value: "%d предмета" } },
                    many: { stringUnit: { value: "%d предметов" } },
                    other: { stringUnit: { value: "%d элементов" } },
                  },
                },
              },
            },
          },
        },
      };

      const result = await loader.pull("ru", input);

      // Russian: all forms are required, stay as CLDR keywords
      expect(result.items.variations.plural).toContain("one {");
      expect(result.items.variations.plural).toContain("few {");
      expect(result.items.variations.plural).toContain("many {");
      expect(result.items.variations.plural).toContain("other {");
      expect(result.items.variations.plural).not.toContain("=");
    });

    it("should convert Chinese optional one to =1", async () => {
      const loader = createXcodeXcstringsV2Loader("zh");
      loader.setDefaultLocale("zh");

      const input = {
        sourceLanguage: "zh",
        strings: {
          items: {
            localizations: {
              zh: {
                variations: {
                  plural: {
                    one: { stringUnit: { value: "1 件商品" } },
                    other: { stringUnit: { value: "%d 件商品" } },
                  },
                },
              },
            },
          },
        },
      };

      const result = await loader.pull("zh", input);

      // Chinese: only "other" is required, "one" is optional → becomes =1
      expect(result.items.variations.plural).toBe(
        "{count, plural, =1 {1 件商品} other {%d 件商品}}",
      );
    });

    it("should round-trip: xcstrings → ICU (=0) → xcstrings (zero)", async () => {
      const loader = createXcodeXcstringsV2Loader("en");
      loader.setDefaultLocale("en");

      const originalInput = {
        sourceLanguage: "en",
        strings: {
          items: {
            localizations: {
              en: {
                variations: {
                  plural: {
                    zero: { stringUnit: { value: "No items" } },
                    one: { stringUnit: { value: "1 item" } },
                    other: { stringUnit: { value: "%d items" } },
                  },
                },
              },
            },
          },
        },
      };

      // Pull: xcstrings → ICU (converts zero to =0)
      const pulled = await loader.pull("en", originalInput);
      expect(pulled.items.variations.plural).toContain("=0 {No items}");

      // Push back: ICU → xcstrings (converts =0 back to zero)
      const pushed = await loader.push("en", pulled);

      expect(
        pushed.strings.items.localizations.en.variations.plural,
      ).toHaveProperty("zero");
      expect(
        pushed.strings.items.localizations.en.variations.plural,
      ).toHaveProperty("one");
      expect(
        pushed.strings.items.localizations.en.variations.plural,
      ).toHaveProperty("other");
      expect(
        pushed.strings.items.localizations.en.variations.plural.zero.stringUnit
          .value,
      ).toBe("No items");
    });
  });

  describe("Backend response filtering", () => {
    it("should filter out invalid plural forms for English (keep only one, other, exact matches)", async () => {
      const loader = createXcodeXcstringsV2Loader("en");
      loader.setDefaultLocale("en");

      const originalInput = {
        sourceLanguage: "en",
        version: "1.0",
        strings: {
          items: {
            localizations: {
              en: {
                variations: {
                  plural: {
                    one: {
                      stringUnit: { state: "translated", value: "1 item" },
                    },
                    other: {
                      stringUnit: { state: "translated", value: "%d items" },
                    },
                  },
                },
              },
            },
          },
        },
      };

      // Initialize loader state
      await loader.pull("en", originalInput);

      // Simulate backend response with extra forms that English doesn't need
      const backendResponse = {
        "items/variations/plural":
          "{count, plural, one {1 item} few {%d items (few)} many {%d items (many)} other {%d items}}",
      };

      const pushed = await loader.push("en", backendResponse);

      // Should only have 'one' and 'other', not 'few' or 'many'
      expect(
        pushed.strings.items.localizations.en.variations.plural,
      ).toHaveProperty("one");
      expect(
        pushed.strings.items.localizations.en.variations.plural,
      ).toHaveProperty("other");
      expect(
        pushed.strings.items.localizations.en.variations.plural,
      ).not.toHaveProperty("few");
      expect(
        pushed.strings.items.localizations.en.variations.plural,
      ).not.toHaveProperty("many");
    });

    it("should keep all required plural forms for Russian", async () => {
      const loader = createXcodeXcstringsV2Loader("en");
      loader.setDefaultLocale("en");

      const originalInput = {
        sourceLanguage: "en",
        version: "1.0",
        strings: {
          items: {
            localizations: {
              en: {
                variations: {
                  plural: {
                    one: {
                      stringUnit: { state: "translated", value: "1 item" },
                    },
                    other: {
                      stringUnit: { state: "translated", value: "%d items" },
                    },
                  },
                },
              },
            },
          },
        },
      };

      // Initialize loader state
      await loader.pull("en", originalInput);

      // Russian requires: one, few, many, other
      const backendResponse = {
        items: {
          variations: {
            plural:
              "{count, plural, one {%d товар} few {%d товара} many {%d товаров} other {%d товаров}}",
          },
        },
      };

      const pushed = await loader.push("ru", backendResponse);

      // Should keep all Russian forms
      expect(
        pushed.strings.items.localizations.ru.variations.plural,
      ).toHaveProperty("one");
      expect(
        pushed.strings.items.localizations.ru.variations.plural,
      ).toHaveProperty("few");
      expect(
        pushed.strings.items.localizations.ru.variations.plural,
      ).toHaveProperty("many");
      expect(
        pushed.strings.items.localizations.ru.variations.plural,
      ).toHaveProperty("other");
    });

    it("should filter out optional forms for Chinese (keep only other, exact matches)", async () => {
      const loader = createXcodeXcstringsV2Loader("en");
      loader.setDefaultLocale("en");

      const originalInput = {
        sourceLanguage: "en",
        version: "1.0",
        strings: {
          items: {
            localizations: {
              en: {
                variations: {
                  plural: {
                    one: {
                      stringUnit: { state: "translated", value: "1 item" },
                    },
                    other: {
                      stringUnit: { state: "translated", value: "%d items" },
                    },
                  },
                },
              },
            },
          },
        },
      };

      // Initialize loader state
      await loader.pull("en", originalInput);

      // Chinese only requires 'other', but backend might return 'one'
      const backendResponse = {
        items: {
          variations: {
            plural: "{count, plural, one {1 件商品} other {%d 件商品}}",
          },
        },
      };

      const pushed = await loader.push("zh", backendResponse);

      // Should only have 'other', not 'one'
      expect(
        pushed.strings.items.localizations.zh.variations.plural,
      ).not.toHaveProperty("one");
      expect(
        pushed.strings.items.localizations.zh.variations.plural,
      ).toHaveProperty("other");
    });

    it("should always preserve exact match forms (=0, =1, =2) for any locale", async () => {
      const loader = createXcodeXcstringsV2Loader("en");
      loader.setDefaultLocale("en");

      const originalInput = {
        sourceLanguage: "en",
        version: "1.0",
        strings: {
          items: {
            localizations: {
              en: {
                variations: {
                  plural: {
                    one: {
                      stringUnit: { state: "translated", value: "1 item" },
                    },
                    other: {
                      stringUnit: { state: "translated", value: "%d items" },
                    },
                  },
                },
              },
            },
          },
        },
      };

      // Initialize loader state
      await loader.pull("en", originalInput);

      // Backend returns exact matches along with required forms
      const backendResponseEn = {
        items: {
          variations: {
            plural:
              "{count, plural, =0 {No items} =1 {One item} other {%d items}}",
          },
        },
      };

      // Test for English
      const pushedEn = await loader.push("en", backendResponseEn);
      expect(
        pushedEn.strings.items.localizations.en.variations.plural,
      ).toHaveProperty("zero"); // =0 → zero
      expect(
        pushedEn.strings.items.localizations.en.variations.plural,
      ).toHaveProperty("one"); // =1 → one
      expect(
        pushedEn.strings.items.localizations.en.variations.plural,
      ).toHaveProperty("other");

      // Test for Chinese (which doesn't normally use 'one', but exact matches should be kept)
      const backendResponseZh = {
        items: {
          variations: {
            plural:
              "{count, plural, =0 {没有商品} =1 {一件商品} other {%d 件商品}}",
          },
        },
      };
      const pushedZh = await loader.push("zh", backendResponseZh);
      expect(
        pushedZh.strings.items.localizations.zh.variations.plural,
      ).toHaveProperty("zero"); // =0 → zero
      expect(
        pushedZh.strings.items.localizations.zh.variations.plural,
      ).toHaveProperty("one"); // =1 → one
      expect(
        pushedZh.strings.items.localizations.zh.variations.plural,
      ).toHaveProperty("other");
    });
  });
});

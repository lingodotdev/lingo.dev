import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { resolve } from "path";
import { LCPCache, LCPCacheParams } from "./cache";
import { LCPSchema } from "./schema";
import { LCP_DICTIONARY_FILE_NAME } from "../../_const";

const { mockExistsSync, mockReadFileSync, mockWriteFileSync, mockPrettierFormat, mockPrettierResolveConfig } = vi.hoisted(() => {
  return {
    mockExistsSync: vi.fn(),
    mockReadFileSync: vi.fn(),
    mockWriteFileSync: vi.fn(),
    mockPrettierFormat: vi.fn(),
    mockPrettierResolveConfig: vi.fn(),
  };
});

vi.mock("fs", () => ({
  existsSync: mockExistsSync,
  readFileSync: mockReadFileSync,
  writeFileSync: mockWriteFileSync,
}));

vi.mock("prettier", () => ({
  format: mockPrettierFormat,
  resolveConfig: mockPrettierResolveConfig,
}));

// cached JSON is stored in JS file, we need to add export default to make it valid JS file
function toCachedString(cache: any) {
  return `export default ${JSON.stringify(cache, null, 2)};`;
}

describe("LCPCache", () => {
  const lcp: LCPSchema = {
    version: 0.1,
    files: {
      "test.ts": {
        scopes: {
          key1: {
            hash: "123",
          },
          newKey: {
            hash: "111",
          },
        },
      },
      "old.ts": {
        scopes: {
          oldKey: {
            hash: "456",
          },
        },
      },
      "new.ts": {
        scopes: {
          brandNew: {
            hash: "222",
          },
        },
      },
    },
  };
  const params: LCPCacheParams = {
    sourceRoot: ".",
    lingoDir: ".lingo",
    lcp,
  };
  const cachePath = resolve(
    process.cwd(),
    params.sourceRoot,
    params.lingoDir,
    LCP_DICTIONARY_FILE_NAME,
  );

  beforeEach(() => {
    vi.clearAllMocks();
    mockPrettierFormat.mockImplementation(
      async (value: string) => value,
    );
  });

  describe("readLocaleDictionary", () => {
    it("returns empty dictionary when no cache exists", () => {
      mockExistsSync.mockReturnValue(false);

      const dictionary = LCPCache.readLocaleDictionary("en", params);

      expect(dictionary).toEqual({
        version: 0.1,
        locale: "en",
        files: {},
      });
    });

    it("returns empty dictionary when cache exists but has no entries for requested locale", () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(
        toCachedString({
          version: 0.1,
          files: {
            "test.ts": {
              entries: {
                key1: {
                  content: {
                    fr: "Bonjour",
                  },
                },
              },
            },
          },
        }),
      );

      const dictionary = LCPCache.readLocaleDictionary("en", params);

      expect(dictionary).toEqual({
        version: 0.1,
        locale: "en",
        files: {},
      });
    });

    it("returns dictionary entries with matching hashfor requested locale when cache exists", () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(
        toCachedString({
          version: 0.1,
          files: {
            "test.ts": {
              entries: {
                key1: {
                  content: {
                    en: "Hello",
                    fr: "Bonjour",
                  },
                  hash: "123",
                },
                newKey: {
                  content: {
                    en: "New",
                    fr: "Nouveau",
                  },
                  hash: "888",
                },
              },
            },
            "somewhere-else.ts": {
              entries: {
                somethingElse: {
                  content: {
                    en: "Something else",
                    fr: "Autre chose",
                  },
                  hash: "222",
                },
              },
            },
          },
        }),
      );

      const dictionary = LCPCache.readLocaleDictionary("en", params);

      expect(dictionary).toEqual({
        version: 0.1,
        locale: "en",
        files: {
          "new.ts": {
            entries: {
              brandNew: "Something else", // found in somewhere-else.ts under different key via matching hash
            },
          },
          "test.ts": {
            entries: {
              key1: "Hello", // found in test.ts under the same key via matching hash
            },
          },
        },
      });
    });
  });

  describe("writeLocaleDictionary", () => {
    it("creates new cache when no cache exists", async () => {
      mockExistsSync.mockReturnValue(false);
      mockWriteFileSync.mockImplementation(() => {});

      const dictionary = {
        version: 0.1,
        locale: "en",
        files: {
          "test.ts": {
            entries: {
              key1: "Hello",
            },
          },
        },
      };

      await LCPCache.writeLocaleDictionary(dictionary, params);

      expect(mockWriteFileSync).toHaveBeenCalledWith(
        cachePath,
        toCachedString({
          version: 0.1,
          files: {
            "test.ts": {
              entries: {
                key1: {
                  content: {
                    en: "Hello",
                  },
                  hash: "123",
                },
              },
            },
          },
        }),
      );
    });

    it("adds new locale to existing cache", async () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(
        toCachedString({
          version: 0.1,
          files: {
            "test.ts": {
              entries: {
                key1: {
                  content: {
                    en: "Hello",
                  },
                  hash: "123",
                },
              },
            },
          },
        }),
      );
      mockWriteFileSync.mockImplementation(() => {});

      const dictionary = {
        version: 0.1,
        locale: "fr",
        files: {
          "test.ts": {
            entries: {
              key1: "Bonjour",
            },
          },
        },
      };

      await LCPCache.writeLocaleDictionary(dictionary, params);

      expect(mockWriteFileSync).toHaveBeenCalledWith(
        cachePath,
        toCachedString({
          version: 0.1,
          files: {
            "test.ts": {
              entries: {
                key1: {
                  content: {
                    en: "Hello",
                    fr: "Bonjour",
                  },
                  hash: "123",
                },
              },
            },
          },
        }),
      );
    });

    it("overrides existing locale entries in cache", async () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(
        toCachedString({
          version: 0.1,
          files: {
            "test.ts": {
              entries: {
                key1: {
                  content: {
                    en: "Hello",
                    fr: "Bonjour",
                  },
                  hash: "123",
                },
              },
            },
          },
        }),
      );
      mockWriteFileSync.mockImplementation(() => {});

      const dictionary = {
        version: 0.1,
        locale: "en",
        files: {
          "test.ts": {
            entries: {
              key1: "Hi",
            },
          },
        },
      };

      await LCPCache.writeLocaleDictionary(dictionary, params);

      expect(mockWriteFileSync).toHaveBeenCalledWith(
        cachePath,
        toCachedString({
          version: 0.1,
          files: {
            "test.ts": {
              entries: {
                key1: {
                  content: {
                    en: "Hi",
                    fr: "Bonjour",
                  },
                  hash: "123",
                },
              },
            },
          },
        }),
      );
    });

    it("handles different files and entries between cache and dictionary", async () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(
        toCachedString({
          version: 0.1,
          files: {
            "old.ts": {
              entries: {
                oldKey: {
                  content: {
                    en: "Old",
                    fr: "Vieux",
                  },
                  hash: "456",
                },
              },
            },
            "test.ts": {
              entries: {
                key1: {
                  content: {
                    en: "Hello",
                    fr: "Bonjour",
                  },
                  hash: "123",
                },
                newKey: {
                  content: {
                    en: "New",
                    fr: "Nouveau",
                  },
                  hash: "111",
                },
              },
            },
          },
        }),
      );
      mockWriteFileSync.mockImplementation(() => {});

      const dictionary = {
        version: 0.1,
        locale: "en",
        files: {
          "test.ts": {
            entries: {
              key1: "Hi",
              newKey: "Newer",
            },
          },
          "new.ts": {
            entries: {
              brandNew: "Brand New",
            },
          },
        },
      };

      await LCPCache.writeLocaleDictionary(dictionary, params);

      expect(mockWriteFileSync).toHaveBeenCalledWith(
        cachePath,
        toCachedString({
          version: 0.1,
          files: {
            "new.ts": {
              entries: {
                brandNew: {
                  content: {
                    en: "Brand New",
                  },
                  hash: "222",
                },
              },
            },
            "test.ts": {
              entries: {
                key1: {
                  content: {
                    en: "Hi",
                    fr: "Bonjour",
                  },
                  hash: "123",
                },
                newKey: {
                  content: {
                    en: "Newer",
                    fr: "Nouveau",
                  },
                  hash: "111",
                },
              },
            },
          },
        }),
      );
    });

    it("formats the cache with prettier", async () => {
      mockPrettierResolveConfig.mockResolvedValue({});
      mockPrettierFormat.mockResolvedValue("formatted");

      const dictionary = {
        version: 0.1,
        locale: "en",
        files: {
          "test.ts": {
            entries: {
              key1: "Hi",
            },
          },
        },
      };

      await LCPCache.writeLocaleDictionary(dictionary, params);

      expect(mockPrettierResolveConfig).toHaveBeenCalledTimes(1);
      expect(mockPrettierFormat).toHaveBeenCalledTimes(1);
      expect(mockWriteFileSync).toHaveBeenCalledWith(cachePath, "formatted");
    });
  });
});

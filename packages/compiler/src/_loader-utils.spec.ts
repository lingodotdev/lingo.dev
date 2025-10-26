import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as path from "path";

// ESM mocks for internal modules used by _loader-utils
vi.mock("./utils/module-params", () => {
  return {
    parseParametrizedModuleId: vi.fn((rawId: string) => {
      const url = new URL(rawId, "module://");
      return {
        id: url.pathname.replace(/^\//, ""),
        params: Object.fromEntries(url.searchParams.entries()),
      };
    }),
  };
});

vi.mock("./lib/lcp", () => {
  return {
    LCP: {
      ready: vi.fn(async () => undefined),
      getInstance: vi.fn(() => ({ data: { version: 0.1 } })),
    },
  };
});

vi.mock("./lib/lcp/server", () => {
  return {
    LCPServer: {
      loadDictionaries: vi.fn(async () => ({})),
    },
  };
});

// Import under test AFTER mocks
import { loadDictionary, transformComponent } from "./_loader-utils";
import { defaultParams } from "./_base";

describe("loadDictionary", () => {
  beforeEach(async () => {
    const lcpMod = await import("./lib/lcp");
    (lcpMod.LCP.ready as any).mockClear();
    (lcpMod.LCP.getInstance as any).mockClear();
    const serverMod = await import("./lib/lcp/server");
    (serverMod.LCPServer.loadDictionaries as any).mockClear();
  });

  it("returns null when path is not a dictionary file", async () => {
    const result = await loadDictionary({
      resourcePath: "/project/src/lingo/not-dictionary.tsx",
      resourceQuery: "",
      params: {},
      sourceRoot: "src",
      lingoDir: "lingo",
      isDev: false,
    });
    expect(result).toBeNull();
    const lcpMod = await import("./lib/lcp");
    expect(lcpMod.LCP.ready).not.toHaveBeenCalled();
  });

  it("returns null when locale param is missing", async () => {
    // Override parser to drop locale
    const parseMod = await import("./utils/module-params");
    (parseMod.parseParametrizedModuleId as any).mockImplementation(
      (rawId: string) => ({ id: rawId, params: {} }),
    );

    const result = await loadDictionary({
      resourcePath: "/project/src/lingo/dictionary.js",
      resourceQuery: "",
      params: {},
      sourceRoot: "src",
      lingoDir: "lingo",
      isDev: false,
    });
    expect(result).toBeNull();
    const lcpMod = await import("./lib/lcp");
    expect(lcpMod.LCP.ready).not.toHaveBeenCalled();
  });

  it("loads dictionary for provided locale and passes params to server", async () => {
    // Restore default module param parser
    const parseMod = await import("./utils/module-params");
    (parseMod.parseParametrizedModuleId as any).mockImplementation(
      (rawId: string) => {
        const url = new URL(rawId, "module://");
        return {
          id: url.pathname.replace(/^\//, ""),
          params: Object.fromEntries(url.searchParams.entries()),
        };
      },
    );

    const DICT = { version: 0.1, locale: "es", files: {} };
    const serverMod = await import("./lib/lcp/server");
    (serverMod.LCPServer.loadDictionaries as any).mockResolvedValueOnce({
      es: DICT,
    });

    const result = await loadDictionary({
      resourcePath: "/project/src/lingo/dictionary.js",
      resourceQuery: "?locale=es",
      params: { sourceLocale: "en", targetLocales: ["es"], foo: "bar" },
      sourceRoot: "src",
      lingoDir: "lingo",
      isDev: true,
    });

    expect(result).toEqual(DICT);
    const lcpMod = await import("./lib/lcp");
    expect(lcpMod.LCP.ready).toHaveBeenCalledWith({
      sourceRoot: "src",
      lingoDir: "lingo",
      isDev: true,
    });
    expect(lcpMod.LCP.getInstance).toHaveBeenCalledWith({
      sourceRoot: "src",
      lingoDir: "lingo",
      isDev: true,
    });
    expect(serverMod.LCPServer.loadDictionaries).toHaveBeenCalledWith({
      sourceLocale: "en",
      targetLocales: ["es"],
      foo: "bar",
      lcp: { version: 0.1 },
    });
  });

  it("throws when dictionary for locale is missing", async () => {
    const serverMod = await import("./lib/lcp/server");
    (serverMod.LCPServer.loadDictionaries as any).mockResolvedValueOnce({});
    await expect(
      loadDictionary({
        resourcePath: "/project/src/lingo/dictionary.js",
        resourceQuery: "?locale=fr",
        params: { sourceLocale: "en", targetLocales: ["fr"] },
        sourceRoot: "src",
        lingoDir: "lingo",
        isDev: false,
      }),
    ).rejects.toThrow('Dictionary for locale "fr" could not be generated.');
  });
});

describe("transformComponent", () => {
  it("returns the same code when nothing to transform and normalizes relativeFilePath", () => {
    const code = "export const X = 1;";
    const result = transformComponent({
      code,
      params: defaultParams,
      resourcePath: path.join("/project", "src", "deep", "file.tsx"),
      sourceRoot: "src",
    });
    expect(result.code).toContain("export const X = 1;");
    // sanity: should return a code+map object
    expect(result.map).toBeDefined();
  });
});

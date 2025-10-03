import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock providers factory to observe routing
vi.mock("@lingo.dev/providers", async (importActual) => {
  const actual = await importActual<any>();
  return {
    ...actual,
    createProviderClient: vi.fn(() => ({} as any)),
  };
});

// Mock AI SDK generateText to return the last message content (XML)
vi.mock("ai", () => {
  return {
    generateText: vi.fn((args: any) => {
      const last = args.messages[args.messages.length - 1];
      return { text: last.content } as any;
    }),
    // Provide a dummy export to satisfy named import in source
    LanguageModel: class {},
  };
});

describe("LCPAPI routes providers via factory", () => {
  beforeEach(async () => {
    const mod = await import("@lingo.dev/providers");
    vi.mocked(mod.createProviderClient as any).mockClear();
  });

  it("accepts every SUPPORTED_PROVIDERS and calls createProviderClient", async () => {
    const { SUPPORTED_PROVIDERS, createProviderClient } = await import(
      "@lingo.dev/providers"
    );
    const { LCPAPI } = await import("./index");

    for (const providerId of SUPPORTED_PROVIDERS) {
      vi.mocked(createProviderClient as any).mockClear();

      const models = { "*:*": `${providerId}:dummy-model` } as Record<
        string,
        string
      >;

      // Minimal dictionary
      const dictionary = {
        version: 0.1,
        locale: "en",
        files: {
          "a.json": { entries: { hello: "Hello" } },
        },
      } as const;

      const result = await LCPAPI.translate(
        models,
        dictionary as any,
        "en",
        "es",
        null,
      );

      expect(result).toBeTruthy();
      // In compiler LCP path, factory is called with (providerId, model) only
      const call = vi.mocked(createProviderClient as any).mock.calls[0];
      expect(call[0]).toBe(providerId);
      expect(call[1]).toBe("dummy-model");
    }
  });
});

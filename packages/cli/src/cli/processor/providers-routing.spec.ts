import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock providers factory to observe routing
vi.mock("@lingo.dev/providers", async (importActual) => {
  const actual = await importActual<any>();
  return {
    ...actual,
    createProviderClient: vi.fn(() => ({} as any)),
  };
});

describe("processor routes providers via factory", () => {
  beforeEach(async () => {
    const mod = await import("@lingo.dev/providers");
    vi.mocked(mod.createProviderClient as any).mockClear();
  });

  it("accepts every SUPPORTED_PROVIDERS and calls createProviderClient", async () => {
    const { SUPPORTED_PROVIDERS, createProviderClient } = await import(
      "@lingo.dev/providers"
    );
    const createProcessor = (await import("./index")).default;

    for (const providerId of SUPPORTED_PROVIDERS) {
      vi.mocked(createProviderClient as any).mockClear();

      const processor = createProcessor(
        {
          id: providerId as any,
          model: "test-model",
          prompt: "test",
        } as any,
        { apiUrl: "http://localhost" },
      );

      expect(typeof processor).toBe("function");
      expect(createProviderClient).toHaveBeenCalledWith(
        providerId,
        "test-model",
        expect.any(Object),
      );
    }
  });
});

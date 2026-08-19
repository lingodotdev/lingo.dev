import { describe, expect, it, vi } from "vitest";

import { Logger } from "../../utils/logger";
import { DEFAULT_TIMEOUTS } from "../../utils/timeout";

const localizeObject = vi.fn(() => new Promise(() => {}));

vi.mock("lingo.dev/sdk", () => ({
  LingoDotDevEngine: class {
    localizeObject = localizeObject;
  },
}));

vi.mock("./model-factory", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./model-factory")>()),
  validateAndGetApiKeys: () => ({ "lingo.dev": "test-key" }),
}));

const { LingoTranslator } = await import("./translator");

function hangingTranslator(aiTimeout?: number) {
  return new LingoTranslator(
    { models: "lingo.dev", sourceLocale: "en", aiTimeout },
    new Logger({ enableConsole: false }),
  );
}

const entry = { h0: { text: "text", context: {} } };

describe("aiTimeout", () => {
  it("should wait as long as the caller asked instead of the default", async () => {
    vi.useFakeTimers();
    const run = hangingTranslator(300_000)
      .translate("de", entry)
      .catch((caught: unknown) => caught);

    await vi.advanceTimersByTimeAsync(DEFAULT_TIMEOUTS.AI_API);
    expect(await settled(run)).toBe(false);

    await vi.advanceTimersByTimeAsync(300_000 - DEFAULT_TIMEOUTS.AI_API);
    vi.useRealTimers();

    expect((await run) as Error).toHaveProperty(
      "message",
      expect.stringContaining("timed out after 300000ms"),
    );
  });

  it("should fall back to the default when the caller says nothing", async () => {
    vi.useFakeTimers();
    const run = hangingTranslator()
      .translate("de", entry)
      .catch((caught: unknown) => caught);

    await vi.advanceTimersByTimeAsync(DEFAULT_TIMEOUTS.AI_API);
    vi.useRealTimers();

    expect((await run) as Error).toHaveProperty(
      "message",
      expect.stringContaining(`timed out after ${DEFAULT_TIMEOUTS.AI_API}ms`),
    );
  });
});

async function settled(promise: Promise<unknown>) {
  const marker = Symbol("pending");
  return (await Promise.race([promise, Promise.resolve(marker)])) !== marker;
}

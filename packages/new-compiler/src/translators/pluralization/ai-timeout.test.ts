import { describe, expect, it, vi } from "vitest";

import { Logger } from "../../utils/logger";
import { DEFAULT_TIMEOUTS } from "../../utils/timeout";

vi.mock("ai", () => ({
  generateText: vi.fn(() => new Promise(() => {})),
}));

vi.mock("../lingo/model-factory", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../lingo/model-factory")>()),
  validateAndGetApiKeys: () => ({ groq: "test-key" }),
  createAiModel: () => ({ modelId: "test-model" }),
}));

const { PluralizationService } = await import("./service");

function hangingService(aiTimeout?: number) {
  return new PluralizationService(
    {
      sourceLocale: "en",
      enabled: true,
      model: "groq:llama-3.1-8b-instant",
      aiTimeout,
    },
    new Logger({ enableConsole: false }),
  );
}

const candidates = [{ hash: "h0", sourceText: "You have 1 message" }];

describe("aiTimeout in pluralization", () => {
  it("should give a batch twice the configured timeout", async () => {
    vi.useFakeTimers();
    const run = hangingService(300_000).generateBatch(candidates);

    await vi.advanceTimersByTimeAsync(300_000);
    expect(await settled(run)).toBe(false);

    await vi.advanceTimersByTimeAsync(300_000);
    vi.useRealTimers();

    expect((await run).get("h0")?.error).toContain("timed out after 600000ms");
  });

  it("should fall back to twice the default when nothing is configured", async () => {
    vi.useFakeTimers();
    const run = hangingService().generateBatch(candidates);

    await vi.advanceTimersByTimeAsync(DEFAULT_TIMEOUTS.AI_API * 2);
    vi.useRealTimers();

    expect((await run).get("h0")?.error).toContain(
      `timed out after ${DEFAULT_TIMEOUTS.AI_API * 2}ms`,
    );
  });
});

async function settled(promise: Promise<unknown>) {
  const marker = Symbol("pending");
  return (await Promise.race([promise, Promise.resolve(marker)])) !== marker;
}

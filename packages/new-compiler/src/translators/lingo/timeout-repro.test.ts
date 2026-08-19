import { describe, expect, it, vi } from "vitest";

import { PartialTranslationError } from "../api";
import { Logger } from "../../utils/logger";

const localizeObject = vi.fn();

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

function sourceEntries(count: number) {
  return Object.fromEntries(
    Array.from({ length: count }, (_, i) => [
      `h${i}`,
      { text: `text ${i}`, context: {} },
    ]),
  );
}

const AI_TIMEOUT = 60_000;

describe("the reported failure: a chunk exceeds the API timeout", () => {
  it("should keep the chunks that finished before the timeout", async () => {
    vi.useFakeTimers();

    // Chunks 1 and 2 come back; chunk 3 hangs, which the timeout ceiling
    // turns into a TimeoutError.
    localizeObject
      .mockImplementationOnce(async (dictionary) => translated(dictionary))
      .mockImplementationOnce(async (dictionary) => translated(dictionary))
      .mockImplementationOnce(() => new Promise(() => {}));

    const translator = new LingoTranslator(
      { models: "lingo.dev", sourceLocale: "en", aiTimeout: AI_TIMEOUT },
      new Logger({ enableConsole: false }),
    );

    const run = translator
      .translate("de", sourceEntries(250))
      .catch((caught: unknown) => caught);

    await vi.advanceTimersByTimeAsync(AI_TIMEOUT);
    const error = await run;

    vi.useRealTimers();

    expect(error).toBeInstanceOf(PartialTranslationError);
    expect((error as Error).message).toContain(
      `timed out after ${AI_TIMEOUT}ms`,
    );

    const partial = (error as PartialTranslationError).partialTranslations;
    expect(Object.keys(partial)).toHaveLength(200);
    expect(partial.h0).toBe("h0-de");
    expect(partial.h199).toBe("h199-de");
    expect(partial.h200).toBeUndefined();
  });
});

function translated(dictionary: { entries: Record<string, string> }) {
  return {
    ...dictionary,
    locale: "de",
    entries: Object.fromEntries(
      Object.keys(dictionary.entries).map((hash) => [hash, `${hash}-de`]),
    ),
  };
}

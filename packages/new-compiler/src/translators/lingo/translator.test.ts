import { describe, expect, it, vi } from "vitest";

import { PartialTranslationError, type DictionarySchema } from "../api";
import { LingoTranslator } from "./translator";
import { Logger } from "../../utils/logger";

vi.mock("lingo.dev/sdk", () => ({
  LingoDotDevEngine: class {
    localizeObject = () => {
      throw new Error("the SDK must not be reached from this test");
    };
  },
}));

vi.mock("./model-factory", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./model-factory")>()),
  validateAndGetApiKeys: () => ({ "lingo.dev": "test-key" }),
}));

type TranslateChunkFn = (
  chunk: DictionarySchema,
  targetLocale: string,
) => Promise<DictionarySchema>;

function makeTranslator(translateChunk: TranslateChunkFn) {
  const translator = new LingoTranslator(
    { models: "lingo.dev", sourceLocale: "en" },
    new Logger({ enableConsole: false }),
  );

  Object.assign(translator as unknown as { translateChunk: TranslateChunkFn }, {
    translateChunk,
  });

  return translator;
}

function sourceEntries(count: number) {
  return Object.fromEntries(
    Array.from({ length: count }, (_, i) => [
      `h${i}`,
      { text: `text ${i}`, context: {} },
    ]),
  );
}

describe("LingoTranslator.translate when a chunk fails", () => {
  it("should hand back the chunks that completed before the failure", async () => {
    // MAX_ENTRIES_PER_CHUNK is 100, so 250 entries is three chunks and
    // failing the third leaves the first two, i.e. 200 entries.
    let call = 0;
    const translator = makeTranslator(async (chunk) => {
      call += 1;
      if (call === 3) throw new Error("timed out after 60000ms");
      return {
        version: chunk.version,
        locale: "de",
        entries: Object.fromEntries(
          Object.keys(chunk.entries).map((hash) => [hash, `${hash}-de`]),
        ),
      };
    });

    const error = await translator
      .translate("de", sourceEntries(250))
      .catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(PartialTranslationError);
    const partial = (error as PartialTranslationError).partialTranslations;
    expect(Object.keys(partial)).toHaveLength(200);
    expect(partial.h0).toBe("h0-de");
    expect(partial.h199).toBe("h199-de");
    expect(partial.h200).toBeUndefined();
  });

  it("should keep the original error reachable as the cause", async () => {
    const cause = new Error("timed out after 60000ms");
    const translator = makeTranslator(async () => {
      throw cause;
    });

    const error = await translator
      .translate("de", sourceEntries(1))
      .catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(PartialTranslationError);
    expect((error as PartialTranslationError).cause).toBe(cause);
    expect((error as PartialTranslationError).partialTranslations).toEqual({});
  });
});

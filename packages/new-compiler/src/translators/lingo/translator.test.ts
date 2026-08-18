import { describe, expect, it, vi } from "vitest";
import type { LocaleCode } from "lingo.dev/spec";

import { PartialTranslationError, type DictionarySchema } from "../api";
import { LingoTranslator } from "./translator";
import type { Logger } from "../../utils/logger";

vi.mock("./model-factory", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./model-factory")>()),
  validateAndGetApiKeys: () => ({ "lingo.dev": "test-key" }),
}));

const silentLogger = {
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
} as unknown as Logger;

// One chunk is 100 entries, so 250 entries is three chunks.
function entriesOf(count: number, offset = 0) {
  return Object.fromEntries(Array.from({ length: count }, (_, i) => [`h${offset + i}`, `text ${offset + i}`]));
}

function makeTranslator(translateChunk: (chunk: DictionarySchema) => Promise<DictionarySchema>) {
  const translator = new LingoTranslator({ models: "lingo.dev", sourceLocale: "en" as LocaleCode }, silentLogger);

  Object.assign(translator as never, { translateChunk });

  return translator;
}

describe("LingoTranslator.translate when a chunk fails", () => {
  it("hands back the chunks that completed before the failure", async () => {
    let call = 0;
    const translator = makeTranslator(async (chunk) => {
      call += 1;
      if (call === 3) throw new Error("Lingo.dev API translation to de timed out after 60000ms");
      return {
        version: chunk.version,
        locale: "de" as LocaleCode,
        entries: Object.fromEntries(Object.keys(chunk.entries).map((hash) => [hash, `${hash}-de`])),
      };
    });

    const entries = Object.fromEntries(
      Object.entries(entriesOf(250)).map(([hash, text]) => [hash, { text, context: {} }]),
    );

    const error = await translator.translate("de" as LocaleCode, entries).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(PartialTranslationError);
    const partial = (error as PartialTranslationError).partialTranslations;
    expect(Object.keys(partial)).toHaveLength(200);
    expect(partial.h0).toBe("h0-de");
    expect(partial.h199).toBe("h199-de");
    expect(partial.h200).toBeUndefined();
  });

  it("keeps the original error reachable as the cause", async () => {
    const cause = new Error("timed out after 60000ms");
    const translator = makeTranslator(async () => {
      throw cause;
    });

    const error = await translator
      .translate("de" as LocaleCode, { h0: { text: "text", context: {} } })
      .catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(PartialTranslationError);
    expect((error as PartialTranslationError).cause).toBe(cause);
    expect((error as PartialTranslationError).partialTranslations).toEqual({});
  });
});

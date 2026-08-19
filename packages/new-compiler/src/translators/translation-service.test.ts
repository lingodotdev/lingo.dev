import { describe, expect, it, vi } from "vitest";

import { PartialTranslationError, type Translator } from "./api";
import { TranslationService } from "./translation-service";
import { MemoryTranslationCache } from "./memory-cache";
import type { TranslationCache } from "./cache";
import type { MetadataSchema } from "../types";
import { Logger } from "../utils/logger";

type TranslateFn = Translator<unknown>["translate"];

function metadataOf(entries: Record<string, string>): MetadataSchema {
  return Object.fromEntries(
    Object.entries(entries).map(([hash, sourceText]) => [
      hash,
      {
        type: "content",
        hash,
        sourceText,
        context: { filePath: "src/App.tsx" },
        location: { filePath: "src/App.tsx", line: 1, column: 1 },
      },
    ]),
  ) as MetadataSchema;
}

function makeService(translate: TranslateFn) {
  const service = new TranslationService(
    {
      sourceLocale: "en",
      sourceRoot: "src",
      lingoDir: "lingo",
      cacheType: "local",
      pluralization: { enabled: false, model: "groq:llama3-8b-8192" },
      models: "lingo.dev",
      environment: "development",
      dev: { usePseudotranslator: true },
    },
    new Logger({ enableConsole: false }),
  );

  const cache = new MemoryTranslationCache();
  Object.assign(
    service as unknown as {
      translator: Translator<unknown>;
      cache: TranslationCache;
    },
    { translator: { config: {}, translate }, cache },
  );

  return { service, cache };
}

describe("TranslationService.translate on a failed run", () => {
  it("should cache the entries the translator finished before it failed", async () => {
    const { service, cache } = makeService(async () => {
      throw new PartialTranslationError(
        "Lingo.dev API translation to de timed out after 60000ms",
        { a: "Alpha-de", b: "Bravo-de" },
        new Error("timed out"),
      );
    });

    const result = await service.translate(
      "de",
      metadataOf({ a: "Alpha", b: "Bravo", c: "Charlie" }),
    );

    expect(await cache.get("de")).toEqual({ a: "Alpha-de", b: "Bravo-de" });
    expect(result.translations).toMatchObject({
      a: "Alpha-de",
      b: "Bravo-de",
    });
  });

  it("should count only the hashes still missing a translation", async () => {
    const { service } = makeService(async () => {
      throw new PartialTranslationError("boom", { a: "Alpha-de" }, undefined);
    });

    const result = await service.translate(
      "de",
      metadataOf({ a: "Alpha", b: "Bravo" }),
    );

    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toMatchObject({ hash: "all" });
    expect(result.stats.failed).toBe(1);
  });

  it("should cache nothing when the run fails before any entry completes", async () => {
    const { service, cache } = makeService(async () => {
      throw new PartialTranslationError("boom", {}, undefined);
    });

    await service.translate("de", metadataOf({ a: "Alpha" }));

    expect(await cache.get("de")).toEqual({});
  });

  it("should survive a plain error that carries no partial results", async () => {
    const { service, cache } = makeService(async () => {
      throw new Error("network down");
    });

    const result = await service.translate("de", metadataOf({ a: "Alpha" }));

    expect(await cache.get("de")).toEqual({});
    expect(result.errors).toHaveLength(1);
  });

  it("should not re-request what the failed run already cached", async () => {
    const translate = vi
      .fn<TranslateFn>()
      .mockRejectedValueOnce(
        new PartialTranslationError(
          "timeout",
          { a: "Alpha-de" },
          new Error("timed out"),
        ),
      )
      .mockResolvedValueOnce({ b: "Bravo-de" });
    const { service } = makeService(translate);
    const metadata = metadataOf({ a: "Alpha", b: "Bravo" });

    await service.translate("de", metadata);
    await service.translate("de", metadata);

    expect(Object.keys(translate.mock.calls[1][1])).toEqual(["b"]);
  });
});

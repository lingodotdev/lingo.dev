import { describe, expect, it, vi } from "vitest";
import type { LocaleCode } from "lingo.dev/spec";

import { PartialTranslationError, type TranslatableEntry } from "./api";
import { TranslationService } from "./translation-service";
import { MemoryTranslationCache } from "./memory-cache";
import type { MetadataSchema } from "../types";
import type { Logger } from "../utils/logger";

const silentLogger = {
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
} as unknown as Logger;

type TranslateFn = (locale: LocaleCode, entries: Record<string, TranslatableEntry>) => Promise<Record<string, string>>;

function metadataOf(entries: Record<string, string>): MetadataSchema {
  return Object.fromEntries(
    Object.entries(entries).map(([hash, sourceText]) => [hash, { sourceText, context: {} }]),
  ) as MetadataSchema;
}

// The service builds its own translator and cache, so there is no constructor
// seam. Take the pseudotranslator path, which needs no API keys, then swap both
// collaborators for controllable ones.
function makeService(translate: TranslateFn) {
  const service = new TranslationService(
    {
      sourceLocale: "en" as LocaleCode,
      pluralization: { enabled: false },
      models: "lingo.dev",
      environment: "development",
      dev: { usePseudotranslator: true },
      cacheDir: "/tmp/lingo-test-cache-unused",
    } as never,
    silentLogger,
  );

  const cache = new MemoryTranslationCache();
  Object.assign(service as never, {
    translator: { config: {}, translate },
    cache,
  });

  return { service, cache };
}

describe("TranslationService.translate on a failed run", () => {
  it("caches the entries the translator finished before it failed, because they were already billed", async () => {
    const { service, cache } = makeService(async () => {
      throw new PartialTranslationError(
        { a: "Alpha-de", b: "Bravo-de" },
        new Error("Lingo.dev API translation to de timed out after 60000ms"),
      );
    });

    const result = await service.translate("de" as LocaleCode, metadataOf({ a: "Alpha", b: "Bravo", c: "Charlie" }));

    expect(await cache.get("de" as LocaleCode)).toEqual({
      a: "Alpha-de",
      b: "Bravo-de",
    });
    expect(result.translations).toMatchObject({
      a: "Alpha-de",
      b: "Bravo-de",
    });
  });

  it("still reports the failure so the build does not go green", async () => {
    const { service } = makeService(async () => {
      throw new PartialTranslationError({ a: "Alpha-de" }, new Error("boom"));
    });

    const result = await service.translate("de" as LocaleCode, metadataOf({ a: "Alpha", b: "Bravo" }));

    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toMatchObject({ hash: "all" });
    expect(result.stats.failed).toBe(1);
  });

  it("caches nothing when the run fails before any entry completes", async () => {
    const { service, cache } = makeService(async () => {
      throw new PartialTranslationError({}, new Error("boom"));
    });

    await service.translate("de" as LocaleCode, metadataOf({ a: "Alpha" }));

    expect(await cache.get("de" as LocaleCode)).toEqual({});
  });

  it("survives a plain error that carries no partial results", async () => {
    const { service, cache } = makeService(async () => {
      throw new Error("network down");
    });

    const result = await service.translate("de" as LocaleCode, metadataOf({ a: "Alpha" }));

    expect(await cache.get("de" as LocaleCode)).toEqual({});
    expect(result.errors).toHaveLength(1);
  });

  it("does not re-request what the failed run already cached", async () => {
    const translate = vi
      .fn<TranslateFn>()
      .mockRejectedValueOnce(new PartialTranslationError({ a: "Alpha-de" }, new Error("timeout")))
      .mockResolvedValueOnce({ b: "Bravo-de" });
    const { service } = makeService(translate);
    const metadata = metadataOf({ a: "Alpha", b: "Bravo" });

    await service.translate("de" as LocaleCode, metadata);
    await service.translate("de" as LocaleCode, metadata);

    expect(Object.keys(translate.mock.calls[1][1])).toEqual(["b"]);
  });
});

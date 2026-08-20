import { describe, it, expect, vi } from "vitest";
import pLimit from "p-limit";

import { persistChecksums } from "./execute";
import { CmdRunContext } from "./_types";

function setup(flags: Partial<CmdRunContext["flags"]> = {}) {
  const writes: Record<string, string>[] = [];
  const deltaProcessor = {
    saveChecksums: vi.fn(async (checksums: Record<string, string>) => {
      writes.push({ ...checksums });
    }),
  } as any;

  return {
    writes,
    deltaProcessor,
    args: {
      ctx: { flags } as CmdRunContext,
      ioLimiter: pLimit(1),
      lastWrittenChecksums: new Map<string, string>(),
      deltaProcessor,
    },
  };
}

describe("persistChecksums", () => {
  const PATTERN = "src/i18n/locales/[locale]/auth.ts";

  it("writes once when every locale of a pattern produces the same payload", async () => {
    const { args, writes } = setup();
    const checksums = { "auth.title": "abc123" };

    for (let locale = 0; locale < 24; locale++) {
      await persistChecksums({
        ...args,
        bucketPathPattern: PATTERN,
        checksums,
      });
    }

    expect(writes).toEqual([{ "auth.title": "abc123" }]);
  });

  // Two bucket entries can share one path pattern - they are deduped by
  // `pathPattern::delimiter`, while the lockfile section is keyed by the
  // pattern alone - so one section can legitimately receive alternating
  // payloads. Skipping a repeat payload must never leave the wrong one on disk.
  it("rewrites when the payload for a pattern alternates (A, B, A)", async () => {
    const { args, writes } = setup();
    const a = { key: "payload-a" };
    const b = { key: "payload-b" };

    for (const checksums of [a, b, a]) {
      await persistChecksums({
        ...args,
        bucketPathPattern: PATTERN,
        checksums,
      });
    }

    expect(writes).toEqual([a, b, a]);
    expect(writes.at(-1)).toEqual(a);
  });

  it("tracks patterns independently", async () => {
    const { args, writes } = setup();
    const other = "src/i18n/locales/[locale]/lab.ts";

    await persistChecksums({
      ...args,
      bucketPathPattern: PATTERN,
      checksums: { a: "1" },
    });
    await persistChecksums({
      ...args,
      bucketPathPattern: other,
      checksums: { b: "2" },
    });
    await persistChecksums({
      ...args,
      bucketPathPattern: PATTERN,
      checksums: { a: "1" },
    });
    await persistChecksums({
      ...args,
      bucketPathPattern: other,
      checksums: { b: "2" },
    });

    expect(writes).toEqual([{ a: "1" }, { b: "2" }]);
  });

  it.each([{ targetLocale: ["de-DE"] }, { key: ["auth/login"] }])(
    "writes nothing when %o narrows the run",
    async (flags) => {
      const { args, writes } = setup(flags);

      await persistChecksums({
        ...args,
        bucketPathPattern: PATTERN,
        checksums: { a: "1" },
      });

      expect(writes).toEqual([]);
    },
  );

  it("does not mark a pattern as written when the write fails", async () => {
    const { args, writes, deltaProcessor } = setup();
    deltaProcessor.saveChecksums.mockRejectedValueOnce(new Error("disk full"));

    await expect(
      persistChecksums({
        ...args,
        bucketPathPattern: PATTERN,
        checksums: { a: "1" },
      }),
    ).rejects.toThrow("disk full");

    // A later locale of the same pattern must retry rather than assume success.
    await persistChecksums({
      ...args,
      bucketPathPattern: PATTERN,
      checksums: { a: "1" },
    });
    expect(writes).toEqual([{ a: "1" }]);
  });

  it("writes once when a pattern is persisted concurrently", async () => {
    const { args, writes, deltaProcessor } = setup();
    deltaProcessor.saveChecksums.mockImplementation(
      async (checksums: Record<string, string>) => {
        await new Promise((resolve) => setTimeout(resolve, 5));
        writes.push({ ...checksums });
      },
    );
    const checksums = { "auth.title": "abc123" };

    await Promise.all(
      Array.from({ length: 8 }, () =>
        persistChecksums({ ...args, bucketPathPattern: PATTERN, checksums }),
      ),
    );

    expect(writes).toEqual([{ "auth.title": "abc123" }]);
  });

  it("serializes concurrent writes through the shared io limiter", async () => {
    const { args } = setup();
    let inFlight = 0;
    let maxInFlight = 0;
    args.deltaProcessor.saveChecksums = vi.fn(async () => {
      inFlight += 1;
      maxInFlight = Math.max(maxInFlight, inFlight);
      await new Promise((resolve) => setTimeout(resolve, 5));
      inFlight -= 1;
    });

    await Promise.all(
      Array.from({ length: 8 }, (_, i) =>
        persistChecksums({
          ...args,
          bucketPathPattern: `pattern-${i}`,
          checksums: { key: `value-${i}` },
        }),
      ),
    );

    expect(maxInFlight).toBe(1);
  });
});

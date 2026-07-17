import { describe, it, expect, beforeEach, vi } from "vitest";
import path from "path";
import { applyFormatterConfig, formatDataWithBiome, pickFormatterConfig } from "./biome";
import { mockStorage } from "../../../../tests/mock-storage";

// Integration tests: they run the real bundled Biome (js-api + wasm) against a
// biome.jsonc served from the in-memory fs mock, exactly as the CLI does.

const SOURCE = `export default { greeting: "Hello", bye: "Bye" };\n`;

function setConfig(config: object) {
  mockStorage.set({ "biome.jsonc": JSON.stringify(config, null, 2) });
}

function format() {
  const filePath = path.join(process.cwd(), "en.ts");
  return formatDataWithBiome(SOURCE, filePath, { bucketPathPattern: filePath });
}

describe("formatDataWithBiome (real bundled Biome)", () => {
  beforeEach(() => mockStorage.clear());

  it("applies the configured single-quote style", async () => {
    setConfig({
      formatter: { enabled: true },
      javascript: { formatter: { quoteStyle: "single" } },
    });
    const out = await format();
    expect(out).toContain("greeting: 'Hello'");
    expect(out).not.toContain('greeting: "Hello"');
  });

  // Regression (the reported bug): a grit `plugins` entry made applyConfiguration
  // throw, which silently disabled formatting and let files be committed with
  // double quotes. The project's quote style must still apply with `plugins` present.
  it("still formats when the config has a grit `plugins` entry", async () => {
    setConfig({
      plugins: ["./my-plugin.grit"],
      formatter: { enabled: true },
      javascript: { formatter: { quoteStyle: "single" } },
    });
    const out = await format();
    expect(out).toContain("greeting: 'Hello'");
    expect(out).not.toContain('greeting: "Hello"');
  });

  // An unknown top-level section must never disable formatting. (The bundled Biome
  // ignores unknown keys rather than throwing, so the full config still applies —
  // this locks that behavior in case a future version starts rejecting them.)
  it("keeps formatting when the config has an unknown top-level section", async () => {
    setConfig({
      formatter: { enabled: true },
      javascript: { formatter: { quoteStyle: "single" } },
      someFutureUnknownSection: { whatever: true },
    });
    const out = await format();
    expect(out).toContain("greeting: 'Hello'");
  });

  // Per-glob formatter settings under `overrides` must survive alongside `plugins`
  // (Astra's config shape). The quote style comes from the override, not the root.
  it("honors per-glob `overrides` quote style with `plugins` present", async () => {
    setConfig({
      plugins: ["./my-plugin.grit"],
      formatter: { enabled: true },
      overrides: [{ includes: ["**/*.ts"], javascript: { formatter: { quoteStyle: "single" } } }],
    });
    const out = await format();
    expect(out).toContain("greeting: 'Hello'");
    expect(out).not.toContain('greeting: "Hello"');
  });

  // A genuinely invalid formatter value must not be swallowed: formatting is
  // skipped (source returned unchanged) rather than crashing, and a message is
  // logged so the config mistake stays visible.
  it("does not crash on an invalid formatter value", async () => {
    const warn = vi.spyOn(console, "log").mockImplementation(() => {});
    setConfig({
      formatter: { enabled: true },
      javascript: { formatter: { quoteStyle: "triple" } },
    });
    const out = await format();
    expect(out).toBe(SOURCE);
    warn.mockRestore();
  });
});

// Unit tests for the fallback with an injected fake Biome, so the recovery path
// is exercised deterministically regardless of which keys the real js-api rejects.
describe("applyFormatterConfig (fallback)", () => {
  // A fake Biome whose applyConfiguration rejects any config still containing a
  // key outside `allowed`, mirroring how the real js-api rejects CLI-only sections.
  function fakeBiome(allowed: string[]) {
    const calls: Record<string, unknown>[] = [];
    return {
      calls,
      applyConfiguration(_key: unknown, config: Record<string, unknown>) {
        calls.push(config);
        const bad = Object.keys(config).find((k) => !allowed.includes(k));
        if (bad) throw new Error(""); // real js-api throws with an empty message
      },
    };
  }

  it("retries with the formatter-only subset when the full config is rejected", () => {
    const biome = fakeBiome(["formatter", "javascript", "overrides"]);
    applyFormatterConfig(
      biome,
      "key",
      {
        plugins: ["./x.grit"],
        formatter: { enabled: true },
        javascript: { formatter: { quoteStyle: "single" } },
      },
      "biome.jsonc",
    );
    // Second (successful) call must be the formatter-only subset, no `plugins`.
    const applied = biome.calls.at(-1)!;
    expect(applied).not.toHaveProperty("plugins");
    expect(applied).toHaveProperty("javascript");
  });

  it("keeps `overrides` in the fallback subset", () => {
    const overrides = [{ includes: ["**/*.ts"], javascript: { formatter: { quoteStyle: "single" } } }];
    const subset = pickFormatterConfig({
      plugins: ["./x.grit"],
      formatter: { enabled: true },
      overrides,
    });
    expect(subset).toHaveProperty("overrides", overrides);
    expect(subset).not.toHaveProperty("plugins");
  });

  it("throws an actionable error when even the formatter subset is rejected", () => {
    // `allowed: []` => every config, including the formatter-only subset, is rejected.
    const biome = fakeBiome([]);
    expect(() => applyFormatterConfig(biome, "key", { formatter: { enabled: true } }, "biome.jsonc")).toThrow(
      /Invalid Biome configuration in biome\.jsonc/,
    );
  });
});

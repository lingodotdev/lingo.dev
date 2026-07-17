import { describe, it, expect, beforeEach } from "vitest";
import path from "path";
import { formatDataWithBiome } from "./biome";
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

describe("formatDataWithBiome", () => {
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

  // Regression: a grit `plugins` entry made applyConfiguration throw, which
  // silently disabled formatting and let files be committed with double quotes.
  // Formatting must still apply the project's quote style with `plugins` present.
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

  // Harden: any unknown/future top-level section must not disable formatting.
  it("falls back to formatter-only settings on an unknown config section", async () => {
    setConfig({
      formatter: { enabled: true },
      javascript: { formatter: { quoteStyle: "single" } },
      someFutureUnknownSection: { whatever: true },
    });
    const out = await format();
    expect(out).toContain("greeting: 'Hello'");
  });
});

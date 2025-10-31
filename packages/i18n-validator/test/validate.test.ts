import { validateI18nConfig } from "../src/validate.js";
import type { I18nConfig } from "../src/validate.js";

describe("i18n config validation", () => {
  test("valid minimal config", () => {
    const config: I18nConfig = {
      locale: { source: "en", targets: ["es", "fr"] },
    };
    const result = validateI18nConfig(config);
    expect(result.ok).toBe(true);
    expect(result.parsed).toBeDefined();
  });

  test("valid complete config", () => {
    const config: I18nConfig = {
      $schema: "https://lingo.dev/schema/i18n.json",
      version: "1.10",
      locale: {
        source: "en",
        targets: ["es", "fr", "de"],
        extraSource: "en-US",
      },
      provider: {
        id: "openai",
        model: "gpt-4",
        prompt: "Translate this text",
        baseUrl: "https://api.openai.com",
        settings: { temperature: 0.1 },
      },
      formatter: "prettier",
      buckets: {
        json: {
          include: ["locales/[locale].json", { path: "data/[locale].json", delimiter: "-" }],
          exclude: ["locales/[locale].backup.json"],
          lockedKeys: ["api_key"],
          ignoredKeys: ["debug_info"],
          injectLocale: ["current_locale"],
        },
      },
    };
    const result = validateI18nConfig(config);
    expect(result.ok).toBe(true);
  });

  test("missing locale.source", () => {
    const config = {
      locale: { targets: ["es"] },
    } as any;
    const result = validateI18nConfig(config);
    expect(result.ok).toBe(false);
    expect(result.suggestions?.some((s) => s.includes("locale.source"))).toBe(true);
  });

  test("missing locale.targets", () => {
    const config = {
      locale: { source: "en" },
    } as any;
    const result = validateI18nConfig(config);
    expect(result.ok).toBe(false);
    expect(result.suggestions?.some((s) => s.includes("locale.targets"))).toBe(true);
  });

  test("empty locale.targets array", () => {
    const config = {
      locale: { source: "en", targets: [] },
    };
    const result = validateI18nConfig(config);
    expect(result.ok).toBe(false);
    expect(result.suggestions?.some((s) => s.includes("at least one target"))).toBe(true);
  });

  test("missing [locale] placeholder in include pattern", () => {
    const config = {
      locale: { source: "en", targets: ["es"] },
      buckets: { json: { include: ["locales/en.json"] } },
    };
    const result = validateI18nConfig(config);
    expect(result.ok).toBe(false);
    expect(result.errors?.some((e) => e.includes("[locale] placeholder"))).toBe(true);
  });

  test("missing [locale] placeholder in exclude pattern", () => {
    const config = {
      locale: { source: "en", targets: ["es"] },
      buckets: {
        json: {
          include: ["locales/[locale].json"],
          exclude: ["locales/backup.json"],
        },
      },
    };
    const result = validateI18nConfig(config);
    expect(result.ok).toBe(false);
    expect(result.errors?.some((e) => e.includes("exclude pattern"))).toBe(true);
  });

  test("invalid provider id", () => {
    const config = {
      locale: { source: "en", targets: ["es"] },
      provider: { id: "invalid-provider", model: "test", prompt: "test" },
    } as any;
    const result = validateI18nConfig(config);
    expect(result.ok).toBe(false);
    expect(result.suggestions?.some((s) => s.includes("supported provider"))).toBe(true);
  });

  test("invalid formatter", () => {
    const config = {
      locale: { source: "en", targets: ["es"] },
      formatter: "invalid-formatter",
    } as any;
    const result = validateI18nConfig(config);
    expect(result.ok).toBe(false);
    expect(result.suggestions?.some((s) => s.includes("supported formatter"))).toBe(true);
  });

  test("invalid temperature value", () => {
    const config = {
      locale: { source: "en", targets: ["es"] },
      provider: {
        id: "openai",
        model: "gpt-4",
        prompt: "test",
        settings: { temperature: 3 },
      },
    } as any;
    const result = validateI18nConfig(config);
    expect(result.ok).toBe(false);
    expect(result.suggestions?.some((s) => s.includes("between 0 and 2"))).toBe(true);
  });

  test("bucket with object-style include patterns", () => {
    const config = {
      locale: { source: "en", targets: ["es"] },
      buckets: {
        json: {
          include: [
            { path: "locales/[locale].json", delimiter: "-" },
            { path: "data/[locale].json", delimiter: "_" },
          ],
        },
      },
    };
    const result = validateI18nConfig(config);
    expect(result.ok).toBe(true);
  });

  test("completely invalid JSON structure", () => {
    const config = "not an object";
    const result = validateI18nConfig(config);
    expect(result.ok).toBe(false);
    expect(result.errors).toBeDefined();
  });
});
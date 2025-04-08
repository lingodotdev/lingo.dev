import { describe, it, expect } from "vitest";
import { parseI18nConfig, defaultConfig, LATEST_CONFIG_DEFINITION } from "./config";

// Helper function to create a v0 config
const createV0Config = () => ({
  version: 0,
});

// Helper function to create a v1 config
const createV1Config = () => ({
  version: 1,
  locale: {
    source: "en",
    targets: ["es"],
  },
  buckets: {
    "src/ui/[locale]/.json": "json",
    "src/blog/[locale]/*.md": "markdown",
  },
});

// Helper function to create a v1.1 config
const createV1_1Config = () => ({
  version: 1.1,
  locale: {
    source: "en",
    targets: ["es", "fr", "pt-PT", "pt_BR"],
  },
  buckets: {
    json: {
      include: ["src/ui/[locale]/.json"],
    },
    markdown: {
      include: ["src/blog/[locale]/*.md"],
      exclude: ["src/blog/[locale]/drafts.md"],
    },
  },
});

const createV1_2Config = () => ({
  ...createV1_1Config(),
  version: 1.2,
});

const createV1_3Config = () => ({
  ...createV1_2Config(),
  version: 1.3,
});

const createV1_4Config = () => ({
  ...createV1_3Config(),
  version: 1.4,
  $schema: "https://lingo.dev/schema/i18n.json",
});

const createInvalidLocaleConfig = () => ({
  version: 1,
  locale: {
    source: "bbbb",
    targets: ["es", "aaaa"],
  },
  buckets: {
    "src/ui/[locale]/.json": "json",
    "src/blog/[locale]/*.md": "markdown",
  },
});

describe("I18n Config Parser", () => {
  it("should upgrade v0 config to latest version", () => {
    const v0Config = createV0Config();
    const result = parseI18nConfig(v0Config);

    expect(result["$schema"]).toBeDefined();
    expect(result.version).toBe(LATEST_CONFIG_DEFINITION.defaultValue.version);
    expect(result.locale).toEqual(defaultConfig.locale);
    expect(result.buckets).toEqual({});
  });

  it("should upgrade v1 config to latest version", () => {
    const v1Config = createV1Config();
    const result = parseI18nConfig(v1Config);

    expect(result["$schema"]).toBeDefined();
    expect(result.version).toBe(LATEST_CONFIG_DEFINITION.defaultValue.version);
    expect(result.locale).toEqual(v1Config.locale);
    expect(result.buckets).toEqual({
      json: {
        include: ["src/ui/[locale]/.json"],
      },
      markdown: {
        include: ["src/blog/[locale]/*.md"],
      },
    });
  });

  it("should throw an error for invalid configurations", () => {
    const invalidConfig = { version: "invalid" };
    expect(() => parseI18nConfig(invalidConfig)).toThrow("Failed to parse config");
  });

  it("should handle empty config and use defaults", () => {
    const emptyConfig = {};
    const result = parseI18nConfig(emptyConfig);

    expect(result).toEqual(defaultConfig);
  });

  it("should ignore extra fields in the config", () => {
    const configWithExtra = {
      ...createV1_4Config(),
      extraField: "should be ignored",
    };
    const result = parseI18nConfig(configWithExtra);

    expect(result).not.toHaveProperty("extraField");
    expect(result).toEqual(createV1_4Config());
  });

  it("should throw an error for unsupported locales", () => {
    const invalidLocaleConfig = createInvalidLocaleConfig();
    expect(() => parseI18nConfig(invalidLocaleConfig)).toThrow(
      `\nUnsupported locale: ${invalidLocaleConfig.locale.source}\nUnsupported locale: ${invalidLocaleConfig.locale.targets[1]}`
    );
  });
});

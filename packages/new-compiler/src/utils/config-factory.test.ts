import { describe, expect, it } from "vitest";
import { createLingoConfig } from "./config-factory";

describe("createLingoConfig pluralization defaults", () => {
  it("disables pluralization by default when not configured", () => {
    const config = createLingoConfig({
      sourceLocale: "en",
      targetLocales: ["es"],
    });

    expect(config.pluralization.enabled).toBe(false);
  });

  it("infers pluralization model from translation models when enabled", () => {
    const config = createLingoConfig({
      sourceLocale: "en",
      targetLocales: ["es"],
      models: {
        "*:*": "google:gemini-2.5-flash",
      },
      pluralization: {
        enabled: true,
      },
    });

    expect(config.pluralization.enabled).toBe(true);
    expect(config.pluralization.model).toBe("google:gemini-2.5-flash");
  });

  it("prefers specific locale models over wildcard fallback", () => {
    const config = createLingoConfig({
      sourceLocale: "en",
      targetLocales: ["es"],
      models: {
        "*:*": "google:gemini-2.5-flash",
        "en:es": "openai:gpt-4",
      },
      pluralization: {
        enabled: true,
      },
    });

    expect(config.pluralization.model).toBe("openai:gpt-4");
  });

  it("enables pluralization when model is provided without explicit enabled", () => {
    const config = createLingoConfig({
      sourceLocale: "en",
      targetLocales: ["es"],
      models: {
        "*:*": "google:gemini-2.5-flash",
      },
      pluralization: {
        model: "groq:llama-3.1-8b-instant",
      },
    });

    expect(config.pluralization.enabled).toBe(true);
    expect(config.pluralization.model).toBe("groq:llama-3.1-8b-instant");
  });

  it("throws when pluralization is enabled with empty models map", () => {
    expect(() =>
      createLingoConfig({
        sourceLocale: "en",
        targetLocales: ["es"],
        models: {},
        pluralization: {
          enabled: true,
        },
      }),
    ).toThrow(/pluralization\.model/);
  });

  it("throws when pluralization is enabled without a model and models are lingo.dev", () => {
    expect(() =>
      createLingoConfig({
        sourceLocale: "en",
        targetLocales: ["es"],
        models: "lingo.dev",
        pluralization: {
          enabled: true,
        },
      }),
    ).toThrow(/pluralization\.model/);
  });
});

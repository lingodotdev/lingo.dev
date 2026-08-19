import { describe, expect, it, vi } from "vitest";

import { createLingoConfig } from "../utils/config-factory";
import { DEFAULT_CONFIG } from "../utils/config-factory";
import { Logger } from "../utils/logger";
import type { LingoPluginOptions } from "../plugin/unplugin";

vi.mock("./lingo/model-factory", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./lingo/model-factory")>()),
  validateAndGetApiKeys: () => ({ "lingo.dev": "test-key", groq: "test-key" }),
  createAiModel: () => ({ modelId: "test-model" }),
}));

vi.mock("lingo.dev/sdk", () => ({
  LingoDotDevEngine: class {
    localizeObject = () => new Promise(() => {});
  },
}));

const { TranslationService } = await import("./translation-service");

function serviceFromPluginOptions(options: Partial<LingoPluginOptions>) {
  const config = createLingoConfig({
    sourceLocale: "en",
    sourceRoot: "src",
    targetLocales: ["de"],
    environment: "production",
    ...options,
  } as never);

  return {
    config,
    service: new TranslationService(
      config,
      new Logger({ enableConsole: false }),
    ),
  };
}

function collaborator(
  service: object,
  name: "translator" | "pluralizationService",
) {
  return (service as Record<string, Record<string, unknown>>)[name];
}

describe("aiTimeout from plugin options to the collaborators that use it", () => {
  it("should default to two minutes", () => {
    expect(DEFAULT_CONFIG.aiTimeout).toBe(120_000);
    expect(serviceFromPluginOptions({}).config.aiTimeout).toBe(120_000);
  });

  it("should reach the translator a caller configured it for", () => {
    const { service } = serviceFromPluginOptions({ aiTimeout: 300_000 });

    expect(collaborator(service, "translator").config).toMatchObject({
      aiTimeout: 300_000,
    });
  });

  it("should reach pluralization", () => {
    const { service } = serviceFromPluginOptions({
      aiTimeout: 300_000,
      pluralization: { enabled: true, model: "groq:llama-3.1-8b-instant" },
    } as never);

    expect(collaborator(service, "pluralizationService")).toHaveProperty(
      "aiTimeout",
      300_000,
    );
  });

  it("should let a pluralization-specific value win over the shared one", () => {
    const { service } = serviceFromPluginOptions({
      aiTimeout: 300_000,
      pluralization: {
        enabled: true,
        model: "groq:llama-3.1-8b-instant",
        aiTimeout: 600_000,
      },
    } as never);

    expect(collaborator(service, "pluralizationService")).toHaveProperty(
      "aiTimeout",
      600_000,
    );
  });
});

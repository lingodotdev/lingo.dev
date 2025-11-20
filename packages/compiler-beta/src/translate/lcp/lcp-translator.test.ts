import { describe, it, expect } from "vitest";
import { LCPTranslator } from "./lcp-translator";

describe("LCPTranslator", () => {
  it("should create an instance with config", () => {
    const translator = new LCPTranslator({
      models: "lingo.dev",
      sourceLocale: "en",
    });

    expect(translator).toBeDefined();
    expect(translator.config.models).toBe("lingo.dev");
    expect(translator.config.sourceLocale).toBe("en");
  });

  it("should create an instance with custom models", () => {
    const translator = new LCPTranslator({
      models: {
        "en:es": "google:gemini-2.0-flash",
        "*:*": "groq:llama3-8b-8192",
      },
      sourceLocale: "en",
      prompt: "Translate professionally",
    });

    expect(translator).toBeDefined();
    expect(translator.config.models).toEqual({
      "en:es": "google:gemini-2.0-flash",
      "*:*": "groq:llama3-8b-8192",
    });
    expect(translator.config.prompt).toBe("Translate professionally");
  });

  it("should implement Translator interface methods", () => {
    const translator = new LCPTranslator({
      models: "lingo.dev",
      sourceLocale: "en",
    });

    expect(typeof translator.translate).toBe("function");
    expect(typeof translator.batchTranslate).toBe("function");
  });
});

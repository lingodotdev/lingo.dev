import { describe, it, expect } from "vitest";
import { providerDetails } from "./provider-details";

describe("provider-details", () => {
  it("should provide data for all supported providers", () => {
    expect(Object.keys(providerDetails)).toEqual([
      "groq",
      "google",
      "openrouter",
      "ollama",
      "mistral",
      "gemini",
      "lingo.dev",
    ]);
  });
  
  it("should have correct configuration for Gemini provider", () => {
    const gemini = providerDetails.gemini;
    expect(gemini).toBeDefined();
    expect(gemini.name).toBe("Gemini (Google)");
    expect(gemini.apiKeyEnvVar).toBe("GEMINI_API_KEY");
    expect(gemini.apiKeyConfigKey).toBe("llm.geminiApiKey");
    expect(gemini.getKeyLink).toBe("https://aistudio.google.com/apikey");
    expect(gemini.docsLink).toBe("https://ai.google.dev/docs");
  });
});

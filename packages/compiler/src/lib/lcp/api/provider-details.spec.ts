import { describe, it, expect } from "vitest";
import { providerDetails } from "./provider-details";

describe("provider-details", () => {
  it("should provide data for all supported providers", () => {
    expect(Object.keys(providerDetails)).toEqual([
      "groq",
      "google",
      "aimlapi",
      "openrouter",
      "ollama",
      "mistral",
      "lingo.dev",
    ]);
  });
});

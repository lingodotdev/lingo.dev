import { describe, it, expect } from "vitest";
import { getSystemPrompt } from "./prompt";

describe("getSystemPrompt", () => {
  it("names the source and target languages in the built-in prompt", () => {
    const result = getSystemPrompt({ sourceLocale: "en", targetLocale: "es" });
    expect(result).toContain("Source language (locale code): en (English)");
    expect(result).toContain("Target language (locale code): es (Spanish)");
  });

  it("names non-Latin target languages", () => {
    const result = getSystemPrompt({
      sourceLocale: "en",
      targetLocale: "zh-Hans",
    });
    expect(result).toContain(
      "Target language (locale code): zh-Hans (Simplified Chinese)",
    );
  });

  it("uses the user-defined prompt with locale substitution when provided", () => {
    const result = getSystemPrompt({
      sourceLocale: "en",
      targetLocale: "es",
      prompt: "Translate from {SOURCE_LOCALE} to {TARGET_LOCALE}.",
    });
    expect(result).toBe("Translate from en to es.");
  });
});

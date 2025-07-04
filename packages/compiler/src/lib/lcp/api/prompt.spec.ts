import prompt from "./prompt";
import { describe, it, expect, vi } from "vitest";

const baseArgs = {
  sourceLocale: "en",
  targetLocale: "es",
};

describe("prompt", () => {
  it("returns user-defined prompt with replacements", () => {
    const args = {
      ...baseArgs,
      prompt: "Translate from {SOURCE_LOCALE} to {TARGET_LOCALE}.",
    };
    const result = prompt(args);
    expect(result).toBe("Translate from en to es.");
  });

  it("trims and replaces variables in user prompt", () => {
    const args = {
      ...baseArgs,
      prompt: "  {SOURCE_LOCALE} => {TARGET_LOCALE}  ",
    };
    const result = prompt(args);
    expect(result).toBe("en => es");
  });

  it("falls back to built-in prompt if no user prompt", () => {
    const args = { ...baseArgs };
    const result = prompt(args);
    expect(result).toContain("You are an advanced AI localization engine");
    expect(result).toContain("Source language (locale code): en");
    expect(result).toContain("Target language (locale code): es");
  });

  it("logs when using user-defined prompt", () => {
    const spy = vi.spyOn(console, "log");
    const args = {
      ...baseArgs,
      prompt: "Prompt {SOURCE_LOCALE} {TARGET_LOCALE}",
    };
    prompt(args);
    expect(spy).toHaveBeenCalledWith(
      "✨ Compiler is using user-defined prompt.",
    );
    spy.mockRestore();
  });

  it("returns built-in prompt if user prompt is empty or whitespace", () => {
    const args = {
      ...baseArgs,
      prompt: "   ",
    };
    const result = prompt(args);
    expect(result).toContain("You are an advanced AI localization engine");
  });
});

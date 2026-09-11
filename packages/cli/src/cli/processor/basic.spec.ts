import { afterEach, describe, expect, it, vi } from "vitest";
import type { LanguageModelV3CallOptions, LanguageModelV3Prompt } from "ai";
import { MockLanguageModelV3 } from "ai/test";
import { createBasicTranslator } from "./basic";

/**
 * The AI SDK reports prompt-shape problems by writing to `console.warn`, not by
 * failing the call: since `ai` 6.0.170 a system message passed inside `messages`
 * (rather than through the `system` option) is flagged as a prompt-injection
 * risk. That means a dependency bump can start printing a warning on every BYOK
 * run without a single test failing, so these specs assert the translator keeps
 * the console quiet.
 */
function createModel() {
  let prompt: LanguageModelV3Prompt | undefined;
  const model = new MockLanguageModelV3({
    doGenerate: async (options: LanguageModelV3CallOptions) => {
      prompt = options.prompt;
      return {
        finishReason: "stop" as const,
        usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
        content: [
          { type: "text" as const, text: JSON.stringify({ greeting: "Hola" }) },
        ],
        warnings: [],
      };
    },
  });
  return { model, getPrompt: () => prompt };
}

const input = {
  sourceLocale: "en",
  targetLocale: "es",
  sourceData: { greeting: "Hello" },
  processableData: { greeting: "Hello" },
  targetData: {},
};

describe("createBasicTranslator", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("translates without the SDK warning about the prompt", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { model } = createModel();

    const result = await createBasicTranslator(model, "Translate")(
      input,
      () => {},
    );

    expect(result).toEqual({ greeting: "Hola" });
    expect(warn).not.toHaveBeenCalled();
  });

  it("sends the system prompt through the system option, with locales substituted", async () => {
    const { model, getPrompt } = createModel();

    await createBasicTranslator(
      model,
      "Translate from {source} to {target}",
    )(input, () => {});

    const prompt = getPrompt()!;
    expect(prompt[0].role).toBe("system");
    expect(prompt[0].content).toContain("Translate from en to es");
    expect(prompt.slice(1).map((message) => message.role)).not.toContain(
      "system",
    );
  });
});

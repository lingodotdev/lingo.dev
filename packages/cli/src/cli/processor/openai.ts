import { generateText, LanguageModelV1 } from "ai";
import { LocalizerInput, LocalizerProgressFn } from "./_base";

export function createBasicTranslator(model: LanguageModelV1, systemPrompt: string) {
  return async (input: LocalizerInput, onProgress: LocalizerProgressFn) => {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set");
    }

    const response = await generateText({
      model,
      messages: [
        {
          role: "system",
          content: JSON.stringify({
            role: "system",
            content: systemPrompt.replaceAll("{source}", input.sourceLocale).replaceAll("{target}", input.targetLocale),
          }),
        },
        {
          role: "user",
          content: JSON.stringify({
            sourceLocale: "en",
            targetLocale: "es",
            data: {
              message: "Hello, world!",
            },
          }),
        },
        {
          role: "assistant",
          content: JSON.stringify({
            sourceLocale: "en",
            targetLocale: "es",
            data: {
              message: "Hola, mundo!",
            },
          }),
        },
        {
          role: "user",
          content: JSON.stringify({
            sourceLocale: "en",
            targetLocale: "es",
            data: input.processableData,
          }),
        },
      ],
    });

    const result = JSON.parse(response.text);

    return result;
  };
}

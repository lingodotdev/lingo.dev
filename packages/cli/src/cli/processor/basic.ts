import { generateText, LanguageModel } from "ai";
import { LocalizerInput, LocalizerProgressFn } from "./_base";
import _ from "lodash";

import { extractPayloadChunks } from "../utils/chunk";
type ModelSettings = {
  temperature?: number;
  batchSize?: number;
};

export function createBasicTranslator(
  model: LanguageModel,
  systemPrompt: string,
  settings: ModelSettings = {},
) {
  return async (input: LocalizerInput, onProgress: LocalizerProgressFn) => {
    const chunks = extractPayloadChunks(
      input.processableData,
      settings.batchSize,
    );

    const subResults: Record<string, any>[] = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const result = await doJob({
        ...input,
        processableData: chunk,
      });
      subResults.push(result);
      onProgress(((i + 1) / chunks.length) * 100, chunk, result);
    }

    const result = _.merge({}, ...subResults);

    return result;
  };

  async function doJob(input: LocalizerInput) {
    if (!Object.keys(input.processableData).length) {
      return input.processableData;
    }

    const response = await generateText({
      model,
      ...settings,
      messages: [
        {
          role: "system",
          content: JSON.stringify({
            role: "system",
            content: systemPrompt
              .replaceAll("{source}", input.sourceLocale)
              .replaceAll("{target}", input.targetLocale),
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
            sourceLocale: input.sourceLocale,
            targetLocale: input.targetLocale,
            data: input.processableData,
          }),
        },
      ],
    });

    const result = JSON.parse(response.text);

    return result?.data || {};
  }
}

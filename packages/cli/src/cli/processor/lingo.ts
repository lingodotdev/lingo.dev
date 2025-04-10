import { LingoDotDevEngine } from "@lingo.dev/_sdk";
import { LocalizerInput, LocalizerProgressFn } from "./_base";

export function createLingoLocalizer(params: { apiKey: string; apiUrl: string }) {
  return async (input: LocalizerInput, onProgress: LocalizerProgressFn) => {
    if (!Object.keys(input.processableData).length) {
      return input.processableData;
    }

    const lingo = new LingoDotDevEngine({
      apiKey: params.apiKey,
      apiUrl: params.apiUrl,
    });

    const result = await lingo.localizeObject(
      input.processableData,
      {
        sourceLocale: input.sourceLocale,
        targetLocale: input.targetLocale,
        reference: {
          [input.sourceLocale]: input.sourceData,
          [input.targetLocale]: input.targetData,
        },
      },
      onProgress,
    );

    return result;
  };
}

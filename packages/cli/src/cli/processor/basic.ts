import { generateText, LanguageModelV1 } from "ai";
import { LocalizerInput, LocalizerProgressFn } from "./_base";
import _ from "lodash";

export function createBasicTranslator(
  model: LanguageModelV1,
  systemPrompt: string,
) {
  return async (input: LocalizerInput, onProgress: LocalizerProgressFn) => {
    const chunks = extractPayloadChunks(input.processableData);

    const subResults: Record<string, any>[] = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const result = await doJob({
        ...input,
        processableData: chunk,
      });
      subResults.push(result);
      onProgress((i / chunks.length) * 100, chunk, result);
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

/**
 * Extract payload chunks based on the ideal chunk size
 * @param payload - The payload to be chunked
 * @returns An array of payload chunks
 */
function extractPayloadChunks(
  payload: Record<string, string>,
): Record<string, string>[] {
  const idealBatchItemSize = 250;
  const batchSize = 25;
  const result: Record<string, string>[] = [];
  let currentChunk: Record<string, string> = {};
  let currentChunkItemCount = 0;

  const payloadEntries = Object.entries(payload);
  for (let i = 0; i < payloadEntries.length; i++) {
    const [key, value] = payloadEntries[i];
    currentChunk[key] = value;
    currentChunkItemCount++;

    const currentChunkSize = countWordsInRecord(currentChunk);
    if (
      currentChunkSize > idealBatchItemSize ||
      currentChunkItemCount >= batchSize ||
      i === payloadEntries.length - 1
    ) {
      result.push(currentChunk);
      currentChunk = {};
      currentChunkItemCount = 0;
    }
  }

  return result;
}

/**
 * Count words in a record or array
 * @param payload - The payload to count words in
 * @returns The total number of words
 */
function countWordsInRecord(
  payload: any | Record<string, any> | Array<any>,
): number {
  if (Array.isArray(payload)) {
    return payload.reduce((acc, item) => acc + countWordsInRecord(item), 0);
  } else if (typeof payload === "object" && payload !== null) {
    return Object.values(payload).reduce(
      (acc: number, item) => acc + countWordsInRecord(item),
      0,
    );
  } else if (typeof payload === "string") {
    return payload.trim().split(/\s+/).filter(Boolean).length;
  } else {
    return 0;
  }
}

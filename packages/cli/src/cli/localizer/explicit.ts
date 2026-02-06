import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { createMistral } from "@ai-sdk/mistral";
import { I18nConfig } from "@lingo.dev/_spec";
import chalk from "chalk";
import dedent from "dedent";
import { ILocalizer, LocalizerData, LocalizerProgressFn } from "./_types";
import { LanguageModel, ModelMessage, generateText } from "ai";
import { colors } from "../constants";
import { jsonrepair } from "jsonrepair";
import { createOllama } from "ollama-ai-provider-v2";
import _ from "lodash";

export default function createExplicitLocalizer(
  provider: NonNullable<I18nConfig["provider"]>,
  batchSize?: number,
): ILocalizer {
  const settings = provider.settings || {};

  switch (provider.id) {
    default:
      throw new Error(
        dedent`
          You're trying to use unsupported provider: ${chalk.dim(provider.id)}.

          To fix this issue:
          1. Switch to one of the supported providers, or
          2. Remove the ${chalk.italic(
          "provider",
        )} node from your i18n.json configuration to switch to ${chalk.hex(
          colors.green,
        )("Lingo.dev")}

          ${chalk.hex(colors.blue)("Docs: https://lingo.dev/go/docs")}
        `,
      );
    case "openai":
      return createAiSdkLocalizer({
        factory: (params) => createOpenAI(params).languageModel(provider.model),
        id: provider.id,
        prompt: provider.prompt,
        apiKeyName: "OPENAI_API_KEY",
        baseUrl: provider.baseUrl,
        settings,
        batchSize,
      });
    case "anthropic":
      return createAiSdkLocalizer({
        factory: (params) =>
          createAnthropic(params).languageModel(provider.model),
        id: provider.id,
        prompt: provider.prompt,
        apiKeyName: "ANTHROPIC_API_KEY",
        baseUrl: provider.baseUrl,
        settings,
        batchSize,
      });
    case "google":
      return createAiSdkLocalizer({
        factory: (params) =>
          createGoogleGenerativeAI(params).languageModel(provider.model),
        id: provider.id,
        prompt: provider.prompt,
        apiKeyName: "GOOGLE_API_KEY",
        baseUrl: provider.baseUrl,
        settings,
        batchSize,
      });
    case "openrouter":
      return createAiSdkLocalizer({
        factory: (params) =>
          createOpenRouter(params).languageModel(provider.model),
        id: provider.id,
        prompt: provider.prompt,
        apiKeyName: "OPENROUTER_API_KEY",
        baseUrl: provider.baseUrl,
        settings,
        batchSize,
      });
    case "ollama":
      return createAiSdkLocalizer({
        factory: (_params) => createOllama().languageModel(provider.model),
        id: provider.id,
        prompt: provider.prompt,
        skipAuth: true,
        settings,
        batchSize,
      });
    case "mistral":
      return createAiSdkLocalizer({
        factory: (params) =>
          createMistral(params).languageModel(provider.model),
        id: provider.id,
        prompt: provider.prompt,
        apiKeyName: "MISTRAL_API_KEY",
        baseUrl: provider.baseUrl,
        settings,
        batchSize,
      });
  }
}

function createAiSdkLocalizer(params: {
  factory: (params: { apiKey?: string; baseUrl?: string }) => LanguageModel;
  id: NonNullable<I18nConfig["provider"]>["id"];
  prompt: string;
  apiKeyName?: string;
  baseUrl?: string;
  skipAuth?: boolean;
  settings?: { temperature?: number };
  batchSize?: number;
}): ILocalizer {
  const skipAuth = params.skipAuth === true;

  const apiKey = process.env[params?.apiKeyName ?? ""];
  if (!skipAuth && (!apiKey || !params.apiKeyName)) {
    throw new Error(
      dedent`
        You're trying to use raw ${chalk.dim(params.id)} API for translation. ${params.apiKeyName
          ? `However, ${chalk.dim(
            params.apiKeyName,
          )} environment variable is not set.`
          : "However, that provider is unavailable."
        }

        To fix this issue:
        1. ${params.apiKeyName
          ? `Set ${chalk.dim(
            params.apiKeyName,
          )} in your environment variables`
          : "Set the environment variable for your provider (if required)"
        }, or
        2. Remove the ${chalk.italic(
          "provider",
        )} node from your i18n.json configuration to switch to ${chalk.hex(
          colors.green,
        )("Lingo.dev")}

        ${chalk.hex(colors.blue)("Docs: https://lingo.dev/go/docs")}
      `,
    );
  }

  const model = params.factory(
    skipAuth ? {} : { apiKey, baseUrl: params.baseUrl },
  );

  return {
    id: params.id,
    checkAuth: async () => {
      // For BYOK providers, auth check is not meaningful
      // Configuration validation happens in validateSettings
      return { authenticated: true, username: "anonymous" };
    },
    validateSettings: async () => {
      try {
        await generateText({
          model,
          ...params.settings,
          messages: [
            { role: "system", content: "You are an echo server" },
            { role: "user", content: "OK" },
            { role: "assistant", content: "OK" },
            { role: "user", content: "OK" },
          ],
        });

        return { valid: true };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        return { valid: false, error: errorMessage };
      }
    },
    localize: async (
      input: LocalizerData,
      onProgress?: LocalizerProgressFn,
    ) => {
      const chunks = extractPayloadChunks(
        input.processableData,
        params.batchSize,
      );
      const subResults: Record<string, any>[] = [];

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];

        const systemPrompt = params.prompt
          .replaceAll("{source}", input.sourceLocale)
          .replaceAll("{target}", input.targetLocale);

        const shots = [
          [
            {
              sourceLocale: "en",
              targetLocale: "es",
              data: {
                message: "Hello, world!",
              },
            },
            {
              sourceLocale: "en",
              targetLocale: "es",
              data: {
                message: "Hola, mundo!",
              },
            },
          ],
          [
            {
              sourceLocale: "en",
              targetLocale: "es",
              data: {
                spring: "Spring",
              },
              hints: {
                spring: ["A source of water"],
              },
            },
            {
              sourceLocale: "en",
              targetLocale: "es",
              data: {
                spring: "Manantial",
              },
            },
          ],
        ];

        const chunkHints = input.hints
          ? _.pick(input.hints, Object.keys(chunk))
          : undefined;
        const hasHints = chunkHints && Object.keys(chunkHints).length > 0;

        const payload = {
          sourceLocale: input.sourceLocale,
          targetLocale: input.targetLocale,
          data: chunk,
          ...(hasHints && { hints: chunkHints }),
        };

        const response = await generateText({
          model,
          ...params.settings,
          messages: [
            { role: "system", content: systemPrompt },
            ...shots.flatMap(
              ([userShot, assistantShot]) =>
                [
                  { role: "user", content: JSON.stringify(userShot) },
                  { role: "assistant", content: JSON.stringify(assistantShot) },
                ] as ModelMessage[],
            ),
            { role: "user", content: JSON.stringify(payload) },
          ],
        });

        const result = JSON.parse(response.text);
        let finalResult: Record<string, any> = {};

        // Handle both object and string responses
        if (typeof result.data === "object" && result.data !== null) {
          finalResult = result.data;
        } else {
          // Handle string responses - extract and repair JSON
          const index = result.data.indexOf("{");
          const lastIndex = result.data.lastIndexOf("}");
          if (index !== -1 && lastIndex !== -1) {
            const trimmed = result.data.slice(index, lastIndex + 1);
            const repaired = jsonrepair(trimmed);
            const parsed = JSON.parse(repaired);
            finalResult = parsed.data || {};
          }
        }

        subResults.push(finalResult);
        if (onProgress) {
          onProgress(((i + 1) / chunks.length) * 100, chunk, finalResult);
        }
      }

      const result = _.merge({}, ...subResults);
      return result;
    },
  };
}

/**
 * Extract payload chunks based on the ideal chunk size
 * @param payload - The payload to be chunked
 * @param batchSize - Max number of keys per chunk (default: 25)
 * @returns An array of payload chunks
 */
function extractPayloadChunks(
  payload: Record<string, string>,
  batchSize: number = 25,
): Record<string, string>[] {
  const idealBatchItemSize = 250;
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

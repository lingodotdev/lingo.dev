import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { I18nConfig } from "@lingo.dev/_spec";
import chalk from "chalk";
import dedent from "dedent";
import { ILocalizer, LocalizerData } from "./_types";
import { LanguageModel, Message, generateText } from "ai";
import { colors } from "../constants";
import { jsonrepair } from "jsonrepair";
import { createOllama } from "ollama-ai-provider";

export default function createExplicitLocalizer(
  provider: NonNullable<I18nConfig["provider"]>,
): ILocalizer {
  switch (provider.id) {
    default:
      throw new Error(
        dedent`
          You're trying to use unsupported provider: ${chalk.dim(provider.id)}.

          To fix this issue:
          1. Switch to one of the supported providers, or
          2. Remove the ${chalk.italic("provider")} node from your i18n.json configuration to switch to ${chalk.hex(colors.green)("Lingo.dev")}

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
      });
    case "anthropic":
      return createAiSdkLocalizer({
        factory: (params) =>
          createAnthropic(params).languageModel(provider.model),
        id: provider.id,
        prompt: provider.prompt,
        apiKeyName: "ANTHROPIC_API_KEY",
        baseUrl: provider.baseUrl,
      });
    case "google":
      return createAiSdkLocalizer({
        factory: (params) =>
          createGoogleGenerativeAI(params).languageModel(provider.model),
        id: provider.id,
        prompt: provider.prompt,
        apiKeyName: "GOOGLE_API_KEY",
        baseUrl: provider.baseUrl,
      });
    case "openrouter":
      return createAiSdkLocalizer({
        factory: (params) =>
          createOpenRouter(params).languageModel(provider.model),
        id: provider.id,
        prompt: provider.prompt,
        apiKeyName: "OPENROUTER_API_KEY",
        baseUrl: provider.baseUrl,
    case "ollama":
      return createAiSdkLocalizer({
        factory: (_params) => createOllama().languageModel(provider.model),
        id: provider.id,
        prompt: provider.prompt,
        skipAuth: true,
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
}): ILocalizer {
  const skipAuth = params.skipAuth === true;

  const apiKey = process.env[params?.apiKeyName ?? ""];
  if ((!skipAuth && !apiKey) || !params.apiKeyName) {
    throw new Error(
      dedent`
        You're trying to use raw ${chalk.dim(params.id)} API for translation. ${params.apiKeyName ? `However, ${chalk.dim(params.apiKeyName)} environment variable is not set.` : "However, that provider is unavailable."}

        To fix this issue:
        1. ${params.apiKeyName ? `Set ${chalk.dim(params.apiKeyName)} in your environment variables` : "Set the environment variable for your provider (if required)"}, or
        2. Remove the ${chalk.italic("provider")} node from your i18n.json configuration to switch to ${chalk.hex(colors.green)("Lingo.dev")}

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
      try {
        await generateText({
          model,
          messages: [
            { role: "system", content: "You are an echo server" },
            { role: "user", content: "OK" },
            { role: "assistant", content: "OK" },
            { role: "user", content: "OK" },
          ],
        });

        return { authenticated: true, username: "anonymous" };
      } catch (error) {
        return { authenticated: false };
      }
    },
    localize: async (input: LocalizerData) => {
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
      ];

      const payload = {
        sourceLocale: input.sourceLocale,
        targetLocale: input.targetLocale,
        data: input.processableData,
      };

      const response = await generateText({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "OK" },
          ...shots.flatMap(
            ([userShot, assistantShot]) =>
              [
                { role: "user", content: JSON.stringify(userShot) },
                { role: "assistant", content: JSON.stringify(assistantShot) },
              ] as Message[],
          ),
          { role: "user", content: JSON.stringify(payload) },
        ],
      });

      const result = JSON.parse(response.text);
      const index = result.data.indexOf("{");
      const lastIndex = result.data.lastIndexOf("}");
      const trimmed = result.data.slice(index, lastIndex + 1);
      const repaired = jsonrepair(trimmed);
      const finalResult = JSON.parse(repaired);

      return finalResult.data;
    },
  };
}

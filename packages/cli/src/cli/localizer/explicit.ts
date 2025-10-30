import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { createMistral } from "@ai-sdk/mistral";
import { I18nConfig } from "@lingo.dev/_spec";
import chalk from "chalk";
import dedent from "dedent";
import { ILocalizer, LocalizerData } from "./_types";
import { LanguageModel, Message, generateText } from "ai";
import { colors } from "../constants";
import { jsonrepair } from "jsonrepair";
import { createOllama } from "ollama-ai-provider";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function createExplicitLocalizer(
  provider: NonNullable<I18nConfig["provider"]>,
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
      });
    case "ollama":
      return createAiSdkLocalizer({
        factory: (_params) => createOllama().languageModel(provider.model),
        id: provider.id,
        prompt: provider.prompt,
        skipAuth: true,
        settings,
      });
    case "mistral":
      return createAiSdkLocalizer({
        factory: (params) => createMistral(params).languageModel(provider.model),
        id: provider.id,
        prompt: provider.prompt,
        apiKeyName: "MISTRAL_API_KEY",
        baseUrl: provider.baseUrl,
        settings,
      });
    case "gemini":
      return createGeminiLocalizer();
  }
}

function createGeminiLocalizer(): ILocalizer {
  return {
    id: "gemini",
    checkAuth: async () => {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error(
          dedent`
            You're trying to use raw ${chalk.dim("gemini")} API for translation. However, ${chalk.dim(
              "GEMINI_API_KEY"
            )} environment variable is not set.

            To fix this issue:
            1. Set ${chalk.dim("GEMINI_API_KEY")} in your environment variables, or
            2. Remove the ${chalk.italic(
              "provider"
            )} node from your i18n.json configuration to switch to ${chalk.hex(
              colors.green
            )("Lingo.dev")}

            ${chalk.hex(colors.blue)("Docs: https://lingo.dev/go/docs")}
          `
        );
      }
      return { authenticated: true, username: "anonymous" };
    },
    validateSettings: async () => {
      try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
          return { valid: false, error: "GEMINI_API_KEY environment variable is not set" };
        }
        
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        
        const result = await model.generateContent("Test connection");
        return { valid: true };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { valid: false, error: errorMessage };
      }
    },
    async localize(input: LocalizerData) {
       try {
         const apiKey = process.env.GEMINI_API_KEY;
         if (!apiKey) {
           throw new Error("GEMINI_API_KEY environment variable is not set");
         }
         
         const genAI = new GoogleGenerativeAI(apiKey);
         const model = genAI.getGenerativeModel({ 
           model: "gemini-1.5-pro",
           generationConfig: {
             temperature: 0.2,
             topP: 0.8,
             topK: 40,
           }
         });
         
         const systemPrompt = `You are a professional translator. Translate the following content from ${input.sourceLocale} to ${input.targetLocale}. Return ONLY valid JSON.`;
         
         const prompt = `${systemPrompt}\n\nContent to translate:\n${JSON.stringify(input.processableData, null, 2)}`;
        
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        
        try {
          // Try to parse as JSON first
          const repairedJson = jsonrepair(response);
          return JSON.parse(repairedJson);
        } catch (e) {
          // If not valid JSON, return empty object
          console.error("Error parsing Gemini response:", e);
          return {};
        }
      } catch (error) {
        console.error("Error with Gemini API:", error);
        throw error;
      }
    },
  };
}

function createAiSdkLocalizer(params: {
  factory: (params: any) => LanguageModel;
  id: string;
  prompt: string;
  apiKeyName?: string;
  baseUrl?: string;
  skipAuth?: boolean;
  settings?: { temperature?: number };
}): ILocalizer {
  const skipAuth = params.skipAuth || false;
  const apiKey = params.apiKeyName ? process.env[params.apiKeyName] : undefined;
  
  if (!skipAuth && params.apiKeyName && !apiKey) {
    throw new Error(
      dedent`
        You're trying to use raw ${chalk.dim(params.id)} API for translation. However, ${chalk.dim(
          params.apiKeyName
        )} environment variable is not set.

        To fix this issue:
        1. Set ${chalk.dim(params.apiKeyName)} in your environment variables, or
        2. Remove the ${chalk.italic(
          "provider"
        )} node from your i18n.json configuration to switch to ${chalk.hex(
          colors.green
        )("Lingo.dev")}

        ${chalk.hex(colors.blue)("Docs: https://lingo.dev/go/docs")}
      `
    );
  }

  const model = params.factory(
    skipAuth ? {} : { apiKey, baseUrl: params.baseUrl },
  );

  return {
    id: params.id as "Lingo.dev" | NonNullable<I18nConfig["provider"]>["id"],
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
        ...params.settings,
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

      // Handle both object and string responses
      if (typeof result.data === "object" && result.data !== null) {
        return result.data;
      }

      // Handle string responses - extract and repair JSON
      const index = result.data.indexOf("{");
      const lastIndex = result.data.lastIndexOf("}");
      const trimmed = result.data.slice(index, lastIndex + 1);
      const repaired = jsonrepair(trimmed);
      const finalResult = JSON.parse(repaired);

      return finalResult.data;
    },
  };
}

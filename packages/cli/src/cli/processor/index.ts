import { I18nConfig } from "@lingo.dev/_spec";
import chalk from "chalk";
import dedent from "dedent";
import { LocalizerFn } from "./_base";
import { createLingoLocalizer } from "./lingo";
import { createBasicTranslator } from "./basic";
import { createOpenAI } from "@ai-sdk/openai";
import { colors } from "../constants";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { createMistral } from "@ai-sdk/mistral";
import { createOllama } from "ollama-ai-provider";

export default function createProcessor(
  provider: I18nConfig["provider"],
  params: { apiKey?: string; apiUrl: string },
): LocalizerFn {
  if (!provider) {
    const result = createLingoLocalizer(params);
    return result;
  } else {
    const model = getPureModelProvider(provider);
    const result = createBasicTranslator(model, provider.prompt);
    return result;
  }
}

function getPureModelProvider(provider: I18nConfig["provider"]) {
  const createMissingKeyErrorMessage = (
    providerId: string,
    envVar?: string,
  ) => dedent`
  You're trying to use raw ${chalk.dim(providerId)} API for translation. ${
    envVar
      ? `However, ${chalk.dim(envVar)} environment variable is not set.`
      : "However, that provider is unavailable."
  }

  To fix this issue:
  1. ${
    envVar
      ? `Set ${chalk.dim(envVar)} in your environment variables`
      : "Set the environment variable for your provider (if required)"
  }, or
  2. Remove the ${chalk.italic(
    "provider",
  )} node from your i18n.json configuration to switch to ${chalk.hex(
    colors.green,
  )("Lingo.dev")}

  ${chalk.hex(colors.blue)("Docs: https://lingo.dev/go/docs")}
`;

  const createUnsupportedProviderErrorMessage = (providerId?: string) =>
    dedent`
  You're trying to use unsupported provider: ${chalk.dim(providerId)}.

  To fix this issue:
  1. Switch to one of the supported providers, or
  2. Remove the ${chalk.italic(
    "provider",
  )} node from your i18n.json configuration to switch to ${chalk.hex(
    colors.green,
  )("Lingo.dev")}

  ${chalk.hex(colors.blue)("Docs: https://lingo.dev/go/docs")}
  `;

  switch (provider?.id) {
    case "openai": {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error(
          createMissingKeyErrorMessage("OpenAI", "OPENAI_API_KEY"),
        );
      }
      return createOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: provider.baseUrl,
      })(provider.model);
    }
    case "anthropic": {
      if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error(
          createMissingKeyErrorMessage("Anthropic", "ANTHROPIC_API_KEY"),
        );
      }
      return createAnthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      })(provider.model);
    }
    case "google": {
      if (!process.env.GOOGLE_API_KEY) {
        throw new Error(
          createMissingKeyErrorMessage("Google", "GOOGLE_API_KEY"),
        );
      }
      return createGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_API_KEY,
      })(provider.model);
    }
    case "openrouter": {
      if (!process.env.OPENROUTER_API_KEY) {
        throw new Error(
          createMissingKeyErrorMessage("OpenRouter", "OPENROUTER_API_KEY"),
        );
      }
      return createOpenRouter({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: provider.baseUrl,
      })(provider.model);
    }
    case "ollama": {
      // No API key check needed for Ollama
      return createOllama()(provider.model);
    }
    case "mistral": {
      if (!process.env.MISTRAL_API_KEY) {
        throw new Error(
          createMissingKeyErrorMessage("Mistral", "MISTRAL_API_KEY"),
        );
      }
      return createMistral({
        apiKey: process.env.MISTRAL_API_KEY,
        baseURL: provider.baseUrl,
      })(provider.model);
    }
    default: {
      throw new Error(createUnsupportedProviderErrorMessage(provider?.id));
    }
  }
}

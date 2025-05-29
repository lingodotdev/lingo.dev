import { I18nConfig, ProviderConfig, ProviderId } from "@lingo.dev/_spec";
import chalk from "chalk";
import dedent from "dedent";
import { LocalizerFn } from "./_base";
import { createLingoLocalizer } from "./lingo";
import { createBasicTranslator } from "./basic";
import { createOpenAI } from "@ai-sdk/openai";
import { colors } from "../constants";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGroq } from "@ai-sdk/groq";

export default function createProcessor(
  config: I18nConfig,
  params: { apiKey: string; apiUrl: string },
  sourceLocale?: string,
  targetLocale?: string,
): LocalizerFn {
  if (config.provider) {
    const model = getPureModelProvider(config.provider);
    const result = createBasicTranslator(model, config.provider.prompt);
    return result;
  }
  
  if (!config.providers && !config.models) {
    const result = createLingoLocalizer(params);
    return result;
  }
  
  const modelKey = resolveModelKey(config.models, sourceLocale, targetLocale);
  if (!modelKey) {
    const result = createLingoLocalizer(params);
    return result;
  }
  
  const [providerId, modelName] = modelKey.split("/");
  
  const providerConfig = config.providers?.[providerId as ProviderId];
  if (!providerConfig) {
    const result = createLingoLocalizer(params);
    return result;
  }
  
  const provider: ProviderConfig = {
    id: providerId as ProviderId,
    model: modelName,
    prompt: resolvePrompt(config.prompt, sourceLocale, targetLocale),
  };
  
  if (typeof providerConfig === 'object') {
    if (providerConfig.baseUrl) {
      provider.baseUrl = providerConfig.baseUrl;
    }
    if (providerConfig.prompt) {
      provider.prompt = providerConfig.prompt;
    }
  }
  
  const model = getPureModelProvider(provider);
  const result = createBasicTranslator(model, provider.prompt);
  return result;
}

function resolveModelKey(models: I18nConfig["models"], sourceLocale?: string, targetLocale?: string): string | null {
  if (!models) return null;
  
  if (sourceLocale && targetLocale) {
    const specificKey = `${sourceLocale}:${targetLocale}`;
    if (models[specificKey]) {
      return models[specificKey];
    }
  }
  
  return models["*:*"] || Object.values(models)[0] || null;
}

function resolvePrompt(prompt: I18nConfig["prompt"], sourceLocale?: string, targetLocale?: string): string {
  if (typeof prompt === 'function' && sourceLocale && targetLocale) {
    return prompt({ sourceLocale, targetLocale });
  }
  return typeof prompt === 'string' 
    ? prompt 
    : "You're a helpful assistant that translates between languages.";
}

function getPureModelProvider(provider: NonNullable<I18nConfig["provider"]>) {
  const createMissingKeyErrorMessage = (
    providerId: string,
    envVar: string,
  ) => dedent`
  You're trying to use raw ${chalk.dim(providerId)} API for translation, however, ${chalk.dim(envVar)} environment variable is not set.

  To fix this issue:
  1. Set ${chalk.dim(envVar)} in your environment variables, or
  2. Remove the ${chalk.italic("provider")} node from your i18n.json configuration to switch to ${chalk.hex(colors.green)("Lingo.dev")}

  ${chalk.hex(colors.blue)("Docs: https://lingo.dev/go/docs")}
`;

  const createUnsupportedProviderErrorMessage = (providerId?: string) =>
    dedent`
  You're trying to use unsupported provider: ${chalk.dim(providerId)}.

  To fix this issue:
  1. Switch to one of the supported providers, or
  2. Remove the ${chalk.italic("provider")} node from your i18n.json configuration to switch to ${chalk.hex(colors.green)("Lingo.dev")}

  ${chalk.hex(colors.blue)("Docs: https://lingo.dev/go/docs")}
  `;

  switch (provider.id) {
    case "openai":
      if (!process.env.OPENAI_API_KEY) {
        throw new Error(
          createMissingKeyErrorMessage("OpenAI", "OPENAI_API_KEY"),
        );
      }
      return createOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: provider.baseUrl,
      })(provider.model);
    case "anthropic":
      if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error(
          createMissingKeyErrorMessage("Anthropic", "ANTHROPIC_API_KEY"),
        );
      }
      return createAnthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      })(provider.model);
    case "groq":
      if (!process.env.GROQ_API_KEY) {
        throw new Error(
          createMissingKeyErrorMessage("Groq", "GROQ_API_KEY"),
        );
      }
      return createGroq({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: provider.baseUrl,
      })(provider.model);
    default:
      throw new Error(createUnsupportedProviderErrorMessage(provider.id));
  }
}

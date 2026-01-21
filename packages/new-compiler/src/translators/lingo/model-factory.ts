/**
 * Shared utilities for creating AI model instances
 */

import { createGroq } from "@ai-sdk/groq";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { ollama } from "ai-sdk-ollama";
import { createMistral } from "@ai-sdk/mistral";
import type { LanguageModel } from "ai";
import * as dotenv from "dotenv";
import * as path from "path";
import { formatNoApiKeysError } from "./provider-details";

export type LocaleModel = {
  provider: string;
  name: string;
};

export function getKeyFromEnv(envVarName: string): string | undefined {
  if (process.env[envVarName]) {
    return process.env[envVarName];
  }

  const projectRoot = process.cwd();

  const result = dotenv.config({
    path: [
      path.resolve(projectRoot, ".env"),
      path.resolve(projectRoot, ".env.local"),
      path.resolve(projectRoot, ".env.development"),
    ],
  });

  return result?.parsed?.[envVarName];
}

/**
 * Pre-validated API keys for all providers
 * Keys are fetched and validated once at initialization
 */
export type ValidatedApiKeys = Record<string, string>;

/**
 * Provider configuration including env var names and requirements
 */
type ProviderConfig = {
  name: string; // Display name (e.g., "Groq", "Google")
  apiKeyEnvVar?: string; // Environment variable name (e.g., "GROQ_API_KEY")
  apiKeyConfigKey?: string; // Config key if applicable (e.g., "llm.groqApiKey")
  getKeyLink: string; // Link to get API key
  docsLink: string; // Link to API docs for troubleshooting
};

export const providerDetails: Record<string, ProviderConfig> = {
  groq: {
    name: "Groq",
    apiKeyEnvVar: "GROQ_API_KEY",
    apiKeyConfigKey: "llm.groqApiKey",
    getKeyLink: "https://groq.com",
    docsLink: "https://console.groq.com/docs/errors",
  },
  google: {
    name: "Google",
    apiKeyEnvVar: "GOOGLE_API_KEY",
    apiKeyConfigKey: "llm.googleApiKey",
    getKeyLink: "https://ai.google.dev/",
    docsLink: "https://ai.google.dev/gemini-api/docs/troubleshooting",
  },
  openai: {
    name: "OpenAI",
    apiKeyEnvVar: "OPENAI_API_KEY",
    apiKeyConfigKey: "llm.openaiApiKey",
    getKeyLink: "https://platform.openai.com/account/api-keys",
    docsLink: "https://platform.openai.com/docs",
  },
  anthropic: {
    name: "Anthropic",
    apiKeyEnvVar: "ANTHROPIC_API_KEY",
    apiKeyConfigKey: "llm.anthropicApiKey",
    getKeyLink: "https://console.anthropic.com/get-api-key",
    docsLink: "https://console.anthropic.com/docs",
  },
  openrouter: {
    name: "OpenRouter",
    apiKeyEnvVar: "OPENROUTER_API_KEY",
    apiKeyConfigKey: "llm.openrouterApiKey",
    getKeyLink: "https://openrouter.ai",
    docsLink: "https://openrouter.ai/docs",
  },
  ollama: {
    name: "Ollama",
    apiKeyEnvVar: undefined, // Ollama doesn't require an API key
    apiKeyConfigKey: undefined, // Ollama doesn't require an API key
    getKeyLink: "https://ollama.com/download",
    docsLink: "https://github.com/ollama/ollama/tree/main/docs",
  },
  mistral: {
    name: "Mistral",
    apiKeyEnvVar: "MISTRAL_API_KEY",
    apiKeyConfigKey: "llm.mistralApiKey",
    getKeyLink: "https://console.mistral.ai",
    docsLink: "https://docs.mistral.ai",
  },
  "lingo.dev": {
    name: "Lingo.dev",
    apiKeyEnvVar: "LINGODOTDEV_API_KEY",
    apiKeyConfigKey: "auth.apiKey",
    getKeyLink: "https://lingo.dev",
    docsLink: "https://lingo.dev/docs",
  },
};

/**
 * Get provider and model for a specific locale pair
 */
export function getLocaleModel(
  localeModels: Record<string, string>,
  sourceLocale: string,
  targetLocale: string,
): LocaleModel | undefined {
  const localeKeys = [
    `${sourceLocale}:${targetLocale}`,
    `*:${targetLocale}`,
    `${sourceLocale}:*`,
    "*:*",
  ];

  const modelKey = localeKeys.find((key) => key in localeModels);
  if (!modelKey) {
    return undefined;
  }

  const value = localeModels[modelKey];
  if (!value) {
    return undefined;
  }

  return parseModelString(value);
}

/**
 * Parse provider and model from model string
 * Format: "provider:model" (e.g., "groq:llama3-8b-8192")
 *
 * @param modelString Model string to parse
 * @returns Object with provider and model
 * @throws Error if format is invalid
 */
export function parseModelString(modelString: string): LocaleModel | undefined {
  // Split on first colon only
  const [provider, name] = modelString.split(":", 2);

  if (!provider || !name) {
    return undefined;
  }

  return { provider, name };
}

/**
 * Validate and fetch all necessary API keys for the given configuration
 * This should be called once at initialization time
 *
 * @param config Model configuration ("lingo.dev" or locale-pair mapping)
 * @returns Validated API keys (provider ID -> API key)
 * @throws Error if required keys are missing
 */
export function validateAndGetApiKeys(
  config: "lingo.dev" | Record<string, string>,
): ValidatedApiKeys {
  const keys: ValidatedApiKeys = {};
  const missingProviders: string[] = [];

  // Determine which providers are configured
  let providersToValidate: string[];

  if (config === "lingo.dev") {
    // Only need lingo.dev provider
    providersToValidate = ["lingo.dev"];
  } else {
    // Extract unique providers from model strings
    const providerSet = new Set<string>();
    Object.values(config).forEach((modelString) => {
      const model = parseModelString(modelString);
      if (model) {
        providerSet.add(model.provider);
      }
    });
    providersToValidate = Array.from(providerSet);
  }

  // Validate and fetch keys for each provider
  for (const provider of providersToValidate) {
    const providerConfig = providerDetails[provider];

    if (!providerConfig) {
      throw new Error(
        `⚠️ Unknown provider "${provider}". Supported providers: ${Object.keys(providerDetails).join(", ")}`,
      );
    }

    // Skip providers that don't require keys (like Ollama)
    if (!providerConfig.apiKeyEnvVar) {
      continue;
    }

    const key = getKeyFromEnv(providerConfig.apiKeyEnvVar);
    if (key) {
      keys[provider] = key;
    } else {
      missingProviders.push(provider);
    }
  }

  // If any keys are missing, throw with detailed error
  if (missingProviders.length > 0) {
    throw new Error(formatNoApiKeysError(missingProviders));
  }

  return keys;
}

/**
 * Create AI model instance from provider and model ID
 *
 * @param model Provider name (groq, google, openrouter, ollama, mistral) and model identifier
 * @param validatedKeys Pre-validated API keys from validateAndFetchApiKeys()
 * @returns LanguageModel instance
 * @throws Error if provider is not supported or API key is missing
 */
export function createAiModel(
  model: LocaleModel,
  validatedKeys: ValidatedApiKeys,
): LanguageModel {
  const providerConfig = providerDetails[model.provider];

  if (!providerConfig) {
    throw new Error(
      `⚠️  Provider "${model.provider}" is not supported. Supported providers: ${Object.keys(providerDetails).join(", ")}`,
    );
  }

  // Get API key if required
  const apiKey = providerConfig.apiKeyEnvVar
    ? validatedKeys[model.provider]
    : undefined;

  // TODO (AleksandrSl 25/12/2025): Do we really need to make a second check? Maybe creation should be combined with validation.
  // Verify key is present for providers that require it
  if (providerConfig.apiKeyEnvVar && !apiKey) {
    throw new Error(
      `⚠️  ${providerConfig.name} API key not found. Please set ${providerConfig.apiKeyEnvVar} environment variable.\n\n` +
        `This should not happen if validateAndFetchApiKeys() was called. Please restart the service.`,
    );
  }

  // Create the appropriate model instance
  switch (model.provider) {
    case "groq":
      return createGroq({ apiKey: apiKey! })(model.name);

    case "google":
      return createGoogleGenerativeAI({ apiKey: apiKey! })(model.name);

    case "openrouter":
      return createOpenRouter({ apiKey: apiKey! })(model.name);

    case "ollama":
      return ollama(model.name);

    case "mistral":
      return createMistral({ apiKey: apiKey! })(model.name);

    default:
      // This should be unreachable due to check above
      throw new Error(`⚠️  Provider "${model.provider}" is not implemented`);
  }
}

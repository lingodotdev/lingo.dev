import { LanguageModel } from "ai";
import { ProviderId } from "./metadata";
import { resolveProviderApiKey } from "./keys";
import { PROVIDER_METADATA } from "./metadata";
import { UnsupportedProviderError } from "./errors";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { createOllama } from "ollama-ai-provider";
import { createMistral } from "@ai-sdk/mistral";
import { createGroq } from "@ai-sdk/groq";

export interface ClientOptions {
  apiKey?: string;
  baseUrl?: string;
  skipAuth?: boolean;
}

export function createProviderClient(
  providerId: ProviderId,
  modelId: string,
  options?: ClientOptions,
): LanguageModel {
  const skipAuth =
    options?.skipAuth === true || !PROVIDER_METADATA[providerId]?.apiKeyEnvVar;
  const apiKey = options?.apiKey ?? resolveProviderApiKey(providerId, { required: !skipAuth });

  switch (providerId) {
    case "openai": {
      const client = createOpenAI({ apiKey, baseURL: options?.baseUrl });
      return client(modelId);
    }
    case "anthropic": {
      const client = createAnthropic({ apiKey, baseURL: options?.baseUrl });
      return client(modelId);
    }
    case "google": {
      const client = createGoogleGenerativeAI({ apiKey });
      return client(modelId);
    }
    case "openrouter": {
      const client = createOpenRouter({ apiKey, baseURL: options?.baseUrl });
      return client(modelId);
    }
    case "ollama": {
      const client = createOllama();
      return client(modelId);
    }
    case "mistral": {
      const client = createMistral({ apiKey, baseURL: options?.baseUrl });
      return client(modelId);
    }
    case "groq": {
      const client = createGroq({ apiKey });
      return client(modelId);
    }
    default:
      throw new UnsupportedProviderError(providerId);
  }
}

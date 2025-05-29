import { I18nConfig, ProviderConfig, ProviderId } from "@lingo.dev/_spec";

import createLingoDotDevLocalizer from "./lingodotdev";
import createExplicitLocalizer from "./explicit";
import { ILocalizer } from "./_types";

export default function createLocalizer(
  config: I18nConfig,
  sourceLocale?: string,
  targetLocale?: string,
): ILocalizer {
  if (config.provider) {
    return createExplicitLocalizer(config.provider);
  }
  
  if (!config.providers && !config.models) {
    return createLingoDotDevLocalizer();
  }
  
  const modelKey = resolveModelKey(config.models, sourceLocale, targetLocale);
  if (!modelKey) {
    return createLingoDotDevLocalizer();
  }
  
  const [providerId, modelName] = modelKey.split("/");
  
  const providerConfig = config.providers?.[providerId as ProviderId];
  if (!providerConfig) {
    return createLingoDotDevLocalizer();
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
  
  return createExplicitLocalizer(provider);
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

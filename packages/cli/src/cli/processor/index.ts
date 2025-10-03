import { I18nConfig } from "@lingo.dev/_spec";
import chalk from "chalk";
import dedent from "dedent";
import { LocalizerFn } from "./_base";
import { createLingoLocalizer } from "./lingo";
import { createBasicTranslator } from "./basic";
import { colors } from "../constants";
import {
  createProviderClient,
  ProviderKeyMissingError,
  PROVIDER_METADATA,
  SUPPORTED_PROVIDERS,
  type ProviderId,
} from "@lingo.dev/providers";

export default function createProcessor(
  provider: I18nConfig["provider"],
  params: { apiKey?: string; apiUrl: string },
): LocalizerFn {
  if (!provider) {
    const result = createLingoLocalizer(params);
    return result;
  } else {
    const model = getPureModelProvider(provider);
    const settings = provider.settings || {};
    const result = createBasicTranslator(model, provider.prompt, settings);
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

  const supported = new Set(SUPPORTED_PROVIDERS as readonly string[]);

  if (!supported.has(provider?.id as any)) {
    throw new Error(createUnsupportedProviderErrorMessage(provider?.id));
  }

  const skipAuth = provider?.id === "ollama";
  try {
    return createProviderClient(provider!.id as ProviderId, provider!.model, {
      baseUrl: provider!.baseUrl,
      skipAuth,
    });
  } catch (error: unknown) {
    if (error instanceof ProviderKeyMissingError) {
      const meta = PROVIDER_METADATA[error.providerId];
      throw new Error(
        createMissingKeyErrorMessage(meta?.name ?? error.providerId, meta?.apiKeyEnvVar),
      );
    }
    throw error as Error;
  }
}

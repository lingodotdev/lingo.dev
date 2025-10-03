import { I18nConfig } from "@lingo.dev/_spec";
import chalk from "chalk";
import dedent from "dedent";
import { ILocalizer, LocalizerData } from "./_types";
import { LanguageModel, Message, generateText } from "ai";
import { colors } from "../constants";
import { jsonrepair } from "jsonrepair";
import {
  createProviderClient,
  ProviderKeyMissingError,
  PROVIDER_METADATA,
  SUPPORTED_PROVIDERS,
  type ProviderId,
} from "@lingo.dev/providers";

export default function createExplicitLocalizer(
  provider: NonNullable<I18nConfig["provider"]>,
): ILocalizer {
  const supported = new Set(SUPPORTED_PROVIDERS as readonly string[]);

  if (!supported.has(provider.id as any)) {
    throw new Error(
      dedent`
        You're trying to use unsupported provider: ${chalk.dim(provider.id)}.

        To fix this issue:
        1. Switch to one of the supported providers, or
        2. Remove the ${chalk.italic("provider")} node from your i18n.json configuration to switch to ${chalk.hex(
          colors.green,
        )("Lingo.dev")}

        ${chalk.hex(colors.blue)("Docs: https://lingo.dev/go/docs")}
      `,
    );
  }

  const skipAuth = provider.id === "ollama";
  try {
    const model = createProviderClient(provider.id as ProviderId, provider.model, {
      baseUrl: provider.baseUrl,
      skipAuth,
    });
    return createLocalizerFromModel({
      model,
      id: provider.id,
      prompt: provider.prompt,
      skipAuth,
    });
  } catch (error: unknown) {
    if (error instanceof ProviderKeyMissingError) {
      const meta = PROVIDER_METADATA[error.providerId];
      const envVar = meta?.apiKeyEnvVar;
      throw new Error(
        dedent`
          You're trying to use raw ${chalk.dim(provider.id)} API for translation. ${
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
          2. Remove the ${chalk.italic("provider")} node from your i18n.json configuration to switch to ${chalk.hex(
            colors.green,
          )("Lingo.dev")}

          ${chalk.hex(colors.blue)("Docs: https://lingo.dev/go/docs")}
        `,
      );
    }
    throw error as Error;
  }
}

function createLocalizerFromModel(params: {
  model: LanguageModel;
  id: NonNullable<I18nConfig["provider"]>["id"];
  prompt: string;
  skipAuth?: boolean;
}): ILocalizer {
  const { model } = params;

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

import dedent from "dedent";
import { ILocalizer, LocalizerData } from "./_types";
import chalk from "chalk";
import { colors } from "../constants";
import { LingoDotDevEngine } from "@lingo.dev/_sdk";
import { getSettings } from "../utils/settings";

export default function createLingoDotDevLocalizer(
  explicitApiKey?: string,
  engineId?: string,
): ILocalizer {
  const settings = getSettings(explicitApiKey);

  if (!settings.auth.apiKey) {
    throw new Error(
      dedent`
        You're trying to use ${chalk.hex(colors.green)(
          "Lingo.dev",
        )} provider, however, you are not authenticated.

        To fix this issue:
        1. Run ${chalk.dim("lingo.dev login")} to authenticate, or
        2. Use the ${chalk.dim("--api-key")} flag to provide an API key.
        3. Set ${chalk.dim("LINGO_API_KEY")} environment variable.
      `,
    );
  }

  const triggerType = process.env.CI ? "ci" : "cli";

  const engine = new LingoDotDevEngine({
    apiKey: settings.auth.apiKey,
    apiUrl: settings.auth.apiUrl,
    ...(engineId && { engineId }),
  });

  return {
    id: "Lingo.dev",
    checkAuth: async () => {
      try {
        const response = await engine.whoami();
        if (!response) {
          return {
            authenticated: false,
            error:
              "Invalid API key. Run `lingo.dev login` or check your LINGO_API_KEY.",
          };
        }
        return {
          authenticated: true,
          username: response.email,
          userId: response.id,
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        return { authenticated: false, error: errorMessage };
      }
    },
    localize: async (input: LocalizerData, onProgress) => {
      // Nothing to translate – return the input as-is.
      if (!Object.keys(input.processableData).length) {
        return input.processableData;
      }

      const processedData = await engine.localizeObject(
        input.processableData,
        {
          sourceLocale: input.sourceLocale,
          targetLocale: input.targetLocale,
          reference: {
            [input.sourceLocale]: input.sourceData,
            [input.targetLocale]: input.targetData,
          },
          hints: input.hints,
          filePath: input.filePath,
          triggerType,
        },
        onProgress,
      );

      return processedData;
    },
  };
}

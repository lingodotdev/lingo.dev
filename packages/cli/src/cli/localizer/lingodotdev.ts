import dedent from "dedent";
import { ILocalizer, LocalizerData } from "./_types";
import chalk from "chalk";
import { colors } from "../constants";
import { LingoDotDevEngine } from "@lingo.dev/_sdk";
import { getSettings } from "../utils/settings";

export default function createLingoDotDevLocalizer(
  explicitApiKey?: string,
): ILocalizer {
  const { auth } = getSettings(explicitApiKey);

  if (!auth) {
    throw new Error(
      dedent`
        You're trying to use ${chalk.hex(colors.green)(
          "Lingo.dev",
        )} provider, however, you are not authenticated.

        To fix this issue:
        1. Run ${chalk.dim("lingo.dev login")} to authenticate, or
        2. Use the ${chalk.dim("--api-key")} flag to provide an API key.
        3. Set ${chalk.dim("LINGODOTDEV_API_KEY")} environment variable.
      `,
    );
  }

  const engine = new LingoDotDevEngine({
    apiKey: auth.apiKey,
    apiUrl: auth.apiUrl,
  });

  return {
    id: "Lingo.dev",
    checkAuth: async () => {
      try {
        const response = await engine.whoami();
        return {
          authenticated: !!response,
          username: response?.email,
        };
      } catch {
        return { authenticated: false };
      }
    },
    localize: async (input: LocalizerData, onProgress) => {
      // Nothing to translate – return the input as-is.
      if (!Object.keys(input.processableData).length) {
        return input;
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
        },
        onProgress,
      );

      return processedData;
    },
  };
}

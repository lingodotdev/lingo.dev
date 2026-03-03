import dedent from "dedent";
import { ILocalizer, LocalizerData } from "./_types";
import chalk from "chalk";
import { colors } from "../constants";
import { LingoDotDevEngine } from "@lingo.dev/_sdk";
import { getSettings } from "../utils/settings";

export default function createLingoDotDevVNextLocalizer(
  processId: string,
): ILocalizer {
  const settings = getSettings(undefined);

  // Use LINGO_API_KEY from environment or settings
  const apiKey = process.env.LINGO_API_KEY || settings.auth.vnext?.apiKey;

  if (!apiKey) {
    throw new Error(
      dedent`
        You're trying to use ${chalk.hex(colors.green)(
          "Lingo.dev vNext",
        )} provider, however, no API key is configured.

        To fix this issue:
        1. Set ${chalk.dim("LINGO_API_KEY")} environment variable, or
        2. Add the key to your ${chalk.dim("~/.lingodotdevrc")} file under ${chalk.dim("[auth.vnext]")} section.
      `,
    );
  }

  // Use LINGO_API_URL from environment or default to api.lingo.dev
  const apiUrl = process.env.LINGO_API_URL || "https://api.lingo.dev";

  const triggerType = process.env.CI ? "ci" : "cli";

  const engine = new LingoDotDevEngine({
    apiKey,
    apiUrl,
    engineId: processId,
  });

  return {
    id: "Lingo.dev vNext",
    checkAuth: async () => {
      try {
        const response = await engine.whoami();
        return {
          authenticated: !!response,
          username: response?.email,
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

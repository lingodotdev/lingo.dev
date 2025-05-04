import chalk from "chalk";
import { Listr, ListrDefaultRendererLogLevels } from "listr2";

import { colors } from "./constants";
import { SetupState } from "./_types";
import { getSettings } from "../../utils/settings";
import { getConfig } from "../../utils/config";
import { CLIError } from "../../utils/errors";
import { validateAuth } from "../i18n";

export async function setup(): Promise<SetupState> {
  console.log(chalk.hex(colors.orange)("[Setup]"));

  const setupTasks = new Listr<SetupState>(
    [
      {
        title: "Loading i18n configuration",
        task: async (ctx, task) => {
          const i18nConfig = getConfig();
          if (!i18nConfig) {
            throw new CLIError({
              message:
                "Couldn't load i18n configuration: i18n.json not found in the current directory. Please run `lingo.dev init` to initialize the project.",
              docUrl: "i18nNotFound",
            });
          }
          ctx.i18nConfig = i18nConfig;
          task.title = `Loaded i18n configuration`;
        },
      },
      {
        title: "Authenticating with Lingo.dev / Checking Provider",
        task: async (ctx, task) => {
          let providerName: string;
          if (ctx.i18nConfig.provider) {
            providerName = ctx.i18nConfig.provider.id;
          } else {
            providerName = "lingo.dev";
          }

          if (providerName !== "lingo.dev") {
            task.title = `Using provider: ${chalk.hex(colors.yellow)(providerName)}`;
            ctx.auth = null;
            return;
          }

          task.title = "Authenticating with Lingo.dev...";
          const settings = getSettings(undefined);
          try {
            const auth = await validateAuth(settings);
            ctx.auth = auth;
            task.title = `Authenticated as ${chalk.hex(colors.yellow)(auth.email)}`;
          } catch (error: any) {
            if (error instanceof CLIError) {
              throw error;
            }
            throw new CLIError({
              message: `Authentication failed: ${error.message}. Please run 'lingo.dev auth --login'.`,
              docUrl: "authError",
            });
          }
        },
      },
      {
        title: "Choosing localization provider",
        task: async (ctx, task) => {
          await new Promise((res) => setTimeout(res, 750));
          task.title = `Using ${chalk.hex(colors.green)("Lingo.dev")} instead of raw LLM API`;
        },
      },
    ],
    {
      exitOnError: true,
      rendererOptions: {
        color: {
          [ListrDefaultRendererLogLevels.COMPLETED]: (msg?: string) =>
            msg ? chalk.hex(colors.green)(msg) : chalk.hex(colors.green)(""),
        },
        icon: {
          [ListrDefaultRendererLogLevels.COMPLETED]: chalk.hex(colors.green)(
            "✓",
          ),
        },
      },
    },
  );

  const result = await setupTasks.run();
  return result;
}

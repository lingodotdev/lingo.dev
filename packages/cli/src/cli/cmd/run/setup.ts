import chalk from "chalk";
import { Listr, ListrDefaultRendererLogLevels } from "listr2";

import { colors } from "../../constants";
import { SetupState } from "./_types";
import { getSettings } from "../../utils/settings";
import { getConfig } from "../../utils/config";
import { CLIError } from "../../utils/errors";
import { validateAuth } from "../i18n";
import createProcessor from "../../processor";

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
        title: "Selecting translation provider",
        task: async (ctx, task) => {
          const provider = ctx.i18nConfig.provider;
          const providerName = provider?.id ?? "lingo.dev";
          task.output = `Initializing ${chalk.hex(colors.yellow)(providerName)} processor...`;

          const processor = createProcessor(provider, {
            apiKey: "",
            apiUrl: "",
          });
          ctx.localizer = {
            type: providerName,
            processor: processor,
          };

          if (providerName === "lingo.dev") {
            task.title = `Using ${chalk.hex(colors.green)("Lingo.dev")} instead of raw LLM API`;
          } else {
            task.title = `Using raw ${chalk.hex(colors.yellow)(providerName)} LLM API instead of Lingo.dev`;
          }
        },
      },
      {
        title: "Authenticating",
        task: async (ctx, task) => {
          if (ctx.localizer.type === "lingo.dev") {
            task.title = "Authenticating with Lingo.dev...";
            const settings = getSettings(undefined);
            const auth = await validateAuth(settings);
            ctx.auth = auth;
            task.title = `Authenticated with Lingo.dev as ${chalk.hex(
              colors.yellow,
            )(auth.email)}`;
          } else {
            ctx.auth = null;
            task.title = `Lingo.dev authentication not required for ${chalk.hex(colors.yellow)(ctx.localizer.type)} processor`;
          }
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

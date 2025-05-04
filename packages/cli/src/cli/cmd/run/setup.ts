import chalk from "chalk";
import { Listr, ListrDefaultRendererLogLevels } from "listr2";

import { colors } from "./constants";
import { I18nConfig } from "@lingo.dev/_spec";
import { SetupState } from "./_types";
import { getSettings } from "../../utils/settings";
import { getConfig } from "../../utils/config";
import { CLIError } from "../../utils/errors";

export async function setup(): Promise<SetupState> {
  console.log(chalk.hex(colors.orange)("[Setup]"));

  let i18nConfig: SetupState["i18nConfig"] | null = null;
  let authConfig: SetupState["auth"] | null = null;

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
        title: "Authenticating with Lingo.dev",
        task: async (ctx, task) => {
          await new Promise((res) => setTimeout(res, 750));
          const email = "user@example.com";
          authConfig = { email, id: "123" }; // TODO
          task.title = `Authenticated as ${chalk.hex(colors.yellow)(email)}`; // or tell it's skipped
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

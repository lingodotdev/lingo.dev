import chalk from "chalk";
import { Listr, ListrDefaultRendererLogLevels } from "listr2";

import { colors } from "./constants";
import { I18nConfig } from "@lingo.dev/_spec";
import { SetupState } from "./_types";

export async function setup(): Promise<SetupState> {
  console.log(chalk.hex(colors.orange)("[Setup]"));

  let i18nConfig: SetupState["i18nConfig"] | null = null;
  let authConfig: SetupState["auth"] | null = null;

  const setupTasks = new Listr<SetupState>(
    [
      {
        title: "Loading i18n configuration",
        task: async (ctx, task) => {
          await new Promise((res) => setTimeout(res, 500));
          // i18nConfig = await loadI18nConfig();
          task.title = `Loaded i18n configuration`;
        },
      },
      {
        title: "Authenticating with Lingo.dev",
        task: async (ctx, task) => {
          await new Promise((res) => setTimeout(res, 750));
          const email = "user@example.com";
          authConfig = { email, id: "123" }; // TODO
          task.title = `Authenticated as ${chalk.hex(colors.yellow)(email)}`;
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

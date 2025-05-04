import chalk from "chalk";
import { Listr, ListrDefaultRendererLogLevels } from "listr2";

import { colors } from "./constants";

export interface SetupState {
  i18nConfig: any;
  auth: any;
}

export async function setup(): Promise<SetupState> {
  console.log(chalk.hex(colors.orange)("[Setup]"));

  const setupTasks = new Listr<SetupState>(
    [
      {
        title: "Loading i18n configuration",
        task: async (ctx, task) => {
          await new Promise((res) => setTimeout(res, 500));
          ctx.i18nConfig = {};
          task.title = `Loaded i18n configuration`;
        },
      },
      {
        title: "Authenticating with Lingo.dev",
        task: async (ctx, task) => {
          await new Promise((res) => setTimeout(res, 750));
          const email = "user@example.com";
          ctx.auth = { email };
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

  const result = await setupTasks.run({ i18nConfig: {}, auth: {} });
  return result;
}

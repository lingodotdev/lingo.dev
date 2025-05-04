import chalk from "chalk";
import { Listr, ListrDefaultRendererLogLevels } from "listr2";

import { colors } from "../../constants";

export interface PlanState {
  tasks: any[];
}

export async function plan(_i18nConfig: any): Promise<PlanState> {
  console.log(chalk.hex(colors.orange)("[Planning]"));

  const planTasks = new Listr(
    [
      { title: "Analyzing project", task: () => sleep(300) },
      { title: "Scanning files", task: () => sleep(500) },
      { title: "Detecting locales", task: () => sleep(400) },
      { title: "Preparing translations", task: () => sleep(350) },
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

  await planTasks.run();
  return { tasks: [] };
}

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

import chalk from "chalk";
import { Listr, ListrDefaultRendererLogLevels } from "listr2";
import pLimit from "p-limit";

import { colors } from "./constants";

export interface ProcessState {
  results: any[];
}

export async function process(
  _auth: any,
  _tasks: any,
  concurrency: number,
): Promise<ProcessState> {
  console.log(chalk.hex(colors.orange)("[Localization]"));

  const errors: Error[] = [];
  const totalTasks = 100;

  const processTasks = new Listr(
    [
      {
        title: "Initializing translation engine",
        task: async (_ctx, task) => {
          await sleep(300);
          task.title = `Translation engine ${chalk.hex(colors.green)("ready")}`;
        },
      },
      {
        title: "Processing translation tasks",
        task: async (ctx, task) => {
          const bucketTypes = ["json", "yaml", "xml"];
          const targetLocales = ["es", "fr"];
          const allTasks = Array.from({ length: totalTasks }, (_, i) => ({
            id: i,
            bucketType: bucketTypes[i % bucketTypes.length],
            sourceLocale: "en",
            targetLocale: targetLocales[i % targetLocales.length],
            filePath: `file_${i}.${bucketTypes[i % bucketTypes.length]}`,
          }));

          const limit = pLimit(concurrency || 10);
          let completed = 0;

          const subtasks = Array.from({ length: 10 }, (_, threadIndex) => ({
            title: "Initializing...",
            task: async (_subCtx: any, subTask: any) => {
              const tasksForThread = allTasks.filter(
                (_, idx) => idx % 10 === threadIndex,
              );

              for (const t of tasksForThread) {
                try {
                  subTask.title = `Processing: ${chalk.dim(t.filePath)} (${chalk.yellow(t.sourceLocale)} -> ${chalk.yellow(t.targetLocale)})`;
                  await limit(() => sleep(500 + Math.random() * 1000));
                  completed++;
                  task.title = `Processed ${chalk.green(completed)}/${totalTasks}, Failed ${chalk.red(errors.length)}`;
                } catch (err: any) {
                  errors.push(err);
                  task.title = `Processed ${chalk.green(completed)}/${totalTasks}, Failed ${chalk.red(errors.length)}`;
                }
              }
              subTask.title = "Done";
            },
          }));

          return task.newListr(subtasks, {
            concurrent: true,
            exitOnError: false,
            rendererOptions: {
              collapseSubtasks: true,
              color: {
                [ListrDefaultRendererLogLevels.COMPLETED]: (msg?: string) =>
                  msg
                    ? chalk.hex(colors.green)(msg)
                    : chalk.hex(colors.green)(""),
              },
              icon: {
                [ListrDefaultRendererLogLevels.COMPLETED]: chalk.hex(
                  colors.green,
                )("✓"),
              },
            },
          });
        },
      },
      {
        title: "Finalizing translations",
        task: async (_ctx, task) => {
          await sleep(250);
          const totalTranslated = 1248;
          task.title = `Finalized ${chalk.hex(colors.yellow)(totalTranslated.toString())} translations`;
        },
      },
    ],
    {
      exitOnError: false,
      rendererOptions: {
        collapseSubtasks: true,
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

  await processTasks.run();

  if (errors.length) {
    console.log(" ");
    console.log(chalk.hex(colors.red)("[Errors]"));
    errors.forEach((e) =>
      console.log(`${chalk.hex(colors.red)("✗")} ${e.message}`),
    );
  }

  return { results: [] };
}

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

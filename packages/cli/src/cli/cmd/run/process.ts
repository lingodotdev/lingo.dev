import chalk from "chalk";
import { Listr, ListrDefaultRendererLogLevels } from "listr2";
import pLimit from "p-limit";
import _ from "lodash";
import path from "path";

import { colors } from "../../constants";
import { SetupState, LocalizationTask, ProcessState } from "./_types";
import createBucketLoader from "../../loaders";
import { createDeltaProcessor } from "../../utils/delta";

export async function process(
  setupState: SetupState,
  tasks: LocalizationTask[],
  concurrency: number,
): Promise<ProcessState> {
  console.log(chalk.hex(colors.orange)("[Localization]"));

  const results: ProcessState["results"] = [];
  const errors: Error[] = [];

  const limit = pLimit(concurrency > 0 ? concurrency : 10);

  async function runSingleTask(localizationTask: LocalizationTask) {
    const { bucketType, filePathPlaceholder, sourceLocale, targetLocale } =
      localizationTask;

    try {
      const bucketLoader = createBucketLoader(
        bucketType as any,
        filePathPlaceholder,
        {
          isCacheRestore: false,
          defaultLocale: sourceLocale,
          injectLocale: [],
        },
      );

      bucketLoader.setDefaultLocale(sourceLocale);
      await bucketLoader.init();

      const sourceData = await bucketLoader.pull(sourceLocale);
      const targetData = await bucketLoader.pull(targetLocale);

      const deltaProcessor = createDeltaProcessor(filePathPlaceholder);
      const checksums = await deltaProcessor.loadChecksums();
      const delta = await deltaProcessor.calculateDelta({
        sourceData,
        targetData,
        checksums,
      });

      const processableData = _.chain(sourceData)
        .entries()
        .filter(
          ([key]) => delta.added.includes(key) || delta.updated.includes(key),
        )
        .fromPairs()
        .value();

      if (!Object.keys(processableData).length) {
        return { success: true } as const;
      }

      const processedChunk = await setupState.localizer.processor(
        {
          sourceLocale,
          sourceData,
          processableData,
          targetLocale,
          targetData,
        },
        () => {},
      );

      const finalTargetData = _.merge({}, targetData, processedChunk);
      await bucketLoader.push(targetLocale, finalTargetData);

      const updatedChecksums = await deltaProcessor.createChecksums(sourceData);
      await deltaProcessor.saveChecksums(updatedChecksums);

      return { success: true } as const;
    } catch (error: any) {
      return { success: false as const, error: error as Error };
    }
  }

  const processTasks = new Listr(
    [
      {
        title: "Initializing translation engine",
        task: async (_ctx, task) => {
          await sleep(300);
          const providerName = setupState.localizer.type;
          task.title = `Translation engine ${chalk.hex(colors.green)("ready")} (${providerName})`;
        },
      },
      {
        title: "Processing translation tasks",
        task: (_ctx, task) => {
          const completed = { success: 0, failed: 0 };

          const workerCount =
            Number.isFinite(concurrency) && concurrency > 0
              ? concurrency
              : Math.min(10, tasks.length);
          const workerTasks = Array.from(
            { length: workerCount },
            (_, workerIdx) => ({
              title: "Initializing...",
              task: async (_subCtx: any, subTask: any) => {
                const assignedTasks = tasks.filter(
                  (_, idx) => idx % workerCount === workerIdx,
                );

                for (const assignedTask of assignedTasks) {
                  const displayPath = path.relative(
                    globalThis.process.cwd(),
                    assignedTask.filePathPlaceholder.replace(
                      "[locale]",
                      assignedTask.targetLocale,
                    ),
                  );
                  subTask.title = `Processing: ${chalk.dim(displayPath)} (${chalk.yellow(
                    assignedTask.sourceLocale,
                  )} -> ${chalk.yellow(assignedTask.targetLocale)})`;

                  const { success, error } = await limit(() =>
                    runSingleTask(assignedTask),
                  );

                  results.push({ task: assignedTask, success, error });

                  if (success) {
                    completed.success++;
                  } else {
                    completed.failed++;
                    if (error) errors.push(error);
                  }

                  task.title = `Processed ${chalk.green(completed.success)}/${tasks.length}, Failed ${chalk.red(
                    completed.failed,
                  )}`;
                }

                subTask.title = "Done";
              },
            }),
          );

          return task.newListr(workerTasks, {
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
          const succeedCount = tasks.length - errors.length;
          task.title = `Finalized ${chalk.hex(colors.yellow)(succeedCount.toString())} translations`;
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

  return {
    results,
    errors,
  };
}

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export type { ProcessState } from "./_types";

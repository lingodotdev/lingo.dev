import chalk from "chalk";
import { Listr, ListrTask } from "listr2";
import pLimit, { LimitFunction } from "p-limit";
import _ from "lodash";
import { minimatch } from "minimatch";

import { colors } from "../../constants";
import { CmdRunContext, CmdRunTask, CmdRunTaskResult } from "./_types";
import { commonTaskRendererOptions } from "./_const";
import createBucketLoader from "../../loaders";
import { createDeltaProcessor, Delta } from "../../utils/delta";

const MAX_WORKER_COUNT = 10;

export default async function execute(input: CmdRunContext) {
  const effectiveConcurrency = Math.min(
    input.flags.concurrency,
    input.tasks.length,
    MAX_WORKER_COUNT,
  );
  console.log(chalk.hex(colors.orange)(`[Localization]`));

  return new Listr<CmdRunContext>(
    [
      {
        title: "Initializing localization engine",
        task: async (ctx, task) => {
          task.title = `Localization engine ${chalk.hex(colors.green)(
            "ready",
          )} (${ctx.localizer!.id})`;
        },
      },
      {
        title: `Processing localization tasks ${chalk.dim(
          `(tasks: ${input.tasks.length}, concurrency: ${effectiveConcurrency})`,
        )}`,
        task: (ctx, task) => {
          if (input.tasks.length < 1) {
            task.title = `Skipping, nothing to localize.`;
            task.skip();
            return;
          }

          const i18nLimiter = pLimit(effectiveConcurrency);
          const ioLimiter = pLimit(1);
          const workersCount = effectiveConcurrency;

          const workerTasks: ListrTask[] = [];
          for (let i = 0; i < workersCount; i++) {
            const assignedTasks = ctx.tasks.filter(
              (_, idx) => idx % workersCount === i,
            );
            workerTasks.push(
              createWorkerTask({
                ctx,
                assignedTasks,
                ioLimiter,
                i18nLimiter,
                onDone() {
                  task.title = createExecutionProgressMessage(ctx);
                },
              }),
            );
          }

          return task.newListr(workerTasks, {
            concurrent: true,
            exitOnError: false,
            rendererOptions: {
              ...commonTaskRendererOptions,
              collapseSubtasks: true,
            },
          });
        },
      },
    ],
    {
      exitOnError: false,
      rendererOptions: commonTaskRendererOptions,
    },
  ).run(input);
}

function createWorkerStatusMessage(args: {
  assignedTask: CmdRunTask;
  percentage: number;
}) {
  const displayPath = args.assignedTask.bucketPathPattern.replace(
    "[locale]",
    args.assignedTask.targetLocale,
  );
  return `[${chalk.hex(colors.yellow)(
    `${args.percentage}%`,
  )}] Processing: ${chalk.dim(displayPath)} (${chalk.hex(colors.yellow)(
    args.assignedTask.sourceLocale,
  )} -> ${chalk.hex(colors.yellow)(args.assignedTask.targetLocale)})`;
}

function createExecutionProgressMessage(ctx: CmdRunContext) {
  const succeededTasksCount = countTasks(
    ctx,
    (_t, result) => result.status === "success",
  );
  const failedTasksCount = countTasks(
    ctx,
    (_t, result) => result.status === "error",
  );
  const skippedTasksCount = countTasks(
    ctx,
    (_t, result) => result.status === "skipped",
  );

  return `Processed ${chalk.green(succeededTasksCount)}/${
    ctx.tasks.length
  }, Failed ${chalk.red(failedTasksCount)}, Skipped ${chalk.dim(
    skippedTasksCount,
  )}`;
}

function createLoaderForTask(assignedTask: CmdRunTask) {
  const bucketLoader = createBucketLoader(
    assignedTask.bucketType,
    assignedTask.bucketPathPattern,
    {
      defaultLocale: assignedTask.sourceLocale,
      injectLocale: assignedTask.injectLocale,
    },
    assignedTask.lockedKeys,
    assignedTask.lockedPatterns,
  );
  bucketLoader.setDefaultLocale(assignedTask.sourceLocale);

  return bucketLoader;
}

function createWorkerTask(args: {
  ctx: CmdRunContext;
  assignedTasks: CmdRunTask[];
  ioLimiter: LimitFunction;
  i18nLimiter: LimitFunction;
  onDone: () => void;
}): ListrTask {
  return {
    title: "Initializing...",
    task: async (_subCtx: any, subTask: any) => {
      for (const assignedTask of args.assignedTasks) {
        subTask.title = createWorkerStatusMessage({
          assignedTask,
          percentage: 0,
        });
        const bucketLoader = createLoaderForTask(assignedTask);
        const deltaProcessor = createDeltaProcessor(
          assignedTask.bucketPathPattern,
        );

        const taskResult = await args.i18nLimiter(async () => {
          try {
            const sourceData = await bucketLoader.pull(
              assignedTask.sourceLocale,
            );
            const targetData = await bucketLoader.pull(
              assignedTask.targetLocale,
            );
            const checksums = await deltaProcessor.loadChecksums();
            const delta = await deltaProcessor.calculateDelta({
              sourceData,
              targetData,
              checksums,
            });

            const processableData = _.chain(sourceData)
              .entries()
              .filter(
                ([key, value]) =>
                  delta.added.includes(key) ||
                  delta.updated.includes(key) ||
                  !!args.ctx.flags.force,
              )
              .filter(
                ([key]) =>
                  !assignedTask.onlyKeys.length ||
                  assignedTask.onlyKeys?.some((pattern) =>
                    minimatch(key, pattern),
                  ),
              )
              .fromPairs()
              .value();

            if (!Object.keys(processableData).length) {
              await args.ioLimiter(async () => {
                // re-push in case some of the unlocalizable / meta data changed
                await bucketLoader.push(assignedTask.targetLocale, targetData);
              });
              return { status: "skipped" } satisfies CmdRunTaskResult;
            }

            const processedTargetData = await args.ctx.localizer!.localize(
              {
                sourceLocale: assignedTask.sourceLocale,
                targetLocale: assignedTask.targetLocale,
                sourceData,
                targetData,
                processableData,
              },
              async (progress, _sourceChunk, processedChunk) => {
                // write translated chunks as they are received from LLM
                await args.ioLimiter(async () => {
                  // pull the latest source data before pushing for buckets that store all locales in a single file
                  await bucketLoader.pull(assignedTask.sourceLocale);
                  // pull the latest target data to include all already processed chunks
                  const latestTargetData = await bucketLoader.pull(
                    assignedTask.targetLocale,
                  );
                  // add the new chunk to target data
                  const _partialData = _.merge(
                    {},
                    latestTargetData,
                    processedChunk,
                  );
                  // process renamed keys
                  const finalChunkTargetData = processRenamedKeys(
                    delta,
                    _partialData,
                  );
                  // push final chunk to the target locale
                  await bucketLoader.push(
                    assignedTask.targetLocale,
                    finalChunkTargetData,
                  );
                });

                subTask.title = createWorkerStatusMessage({
                  assignedTask,
                  percentage: progress,
                });
              },
            );

            const finalTargetData = _.merge(
              {},
              sourceData,
              targetData,
              processedTargetData,
            );
            const finalRenamedTargetData = processRenamedKeys(
              delta,
              finalTargetData,
            );

            await args.ioLimiter(async () => {
              // not all localizers have progress callback (eg. explicit localizer),
              // the final target data might not be pushed yet - push now to ensure it's up to date
              await bucketLoader.pull(assignedTask.sourceLocale);
              await bucketLoader.push(
                assignedTask.targetLocale,
                finalRenamedTargetData,
              );

              const checksums =
                await deltaProcessor.createChecksums(sourceData);
              if (!args.ctx.flags.targetLocale?.length) {
                await deltaProcessor.saveChecksums(checksums);
              }
            });

            return { status: "success" } satisfies CmdRunTaskResult;
          } catch (error) {
            return {
              status: "error",
              error: error as Error,
            } satisfies CmdRunTaskResult;
          }
        });

        args.ctx.results.set(assignedTask, taskResult);
      }

      subTask.title = "Done";
    },
  };
}

function countTasks(
  ctx: CmdRunContext,
  predicate: (task: CmdRunTask, result: CmdRunTaskResult) => boolean,
) {
  return Array.from(ctx.results.entries()).filter(([task, result]) =>
    predicate(task, result),
  ).length;
}

function processRenamedKeys(delta: Delta, targetData: Record<string, string>) {
  return _.chain(targetData)
    .entries()
    .map(([key, value]) => {
      const renaming = delta.renamed.find(([oldKey]) => oldKey === key);
      if (!renaming) {
        return [key, value];
      }
      return [renaming[1], value];
    })
    .fromPairs()
    .value();
}

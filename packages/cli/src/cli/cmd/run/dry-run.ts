import chalk from "chalk";
import { Listr } from "listr2";
import _ from "lodash";
import { minimatch } from "minimatch";

import { colors } from "../../constants";
import { CmdRunContext, CmdRunTask } from "./_types";
import { commonTaskRendererOptions } from "./_const";
import createBucketLoader from "../../loaders";
import { createDeltaProcessor } from "../../utils/delta";

type DryRunResult = {
  task: CmdRunTask;
  sourceCount: number;
  targetCount: number;
  added: number;
  updated: number;
  renamed: number;
  removed: number;
  toTranslate: number;
};

export default async function dryRun(input: CmdRunContext) {
  console.log(chalk.hex(colors.orange)(`[Dry Run - Preview Mode]`));

  const results: DryRunResult[] = [];

  await new Listr<CmdRunContext>(
    [
      {
        title: "Analyzing translation requirements",
        task: async (ctx, task) => {
          if (input.tasks.length < 1) {
            task.title = `No tasks to analyze.`;
            task.skip();
            return;
          }

          const subtasks = ctx.tasks.map((assignedTask) => ({
            title: `Analyzing: ${assignedTask.bucketPathPattern.replace(
              "[locale]",
              assignedTask.targetLocale,
            )}`,
            task: async () => {
              const bucketLoader = createBucketLoader(
                assignedTask.bucketType,
                assignedTask.bucketPathPattern,
                {
                  defaultLocale: assignedTask.sourceLocale,
                  injectLocale: assignedTask.injectLocale,
                  formatter: assignedTask.formatter,
                },
                assignedTask.lockedKeys,
                assignedTask.lockedPatterns,
                assignedTask.ignoredKeys,
              );
              bucketLoader.setDefaultLocale(assignedTask.sourceLocale);

              const deltaProcessor = createDeltaProcessor(
                assignedTask.bucketPathPattern,
              );

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
                      !!ctx.flags.force,
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

                results.push({
                  task: assignedTask,
                  sourceCount: Object.keys(sourceData).length,
                  targetCount: Object.keys(targetData).length,
                  added: delta.added.length,
                  updated: delta.updated.length,
                  renamed: delta.renamed.length,
                  removed: delta.removed.length,
                  toTranslate: Object.keys(processableData).length,
                });
              } catch (error: any) {
                results.push({
                  task: assignedTask,
                  sourceCount: 0,
                  targetCount: 0,
                  added: 0,
                  updated: 0,
                  renamed: 0,
                  removed: 0,
                  toTranslate: 0,
                });
              }
            },
          }));

          return task.newListr(subtasks, {
            concurrent: true,
            exitOnError: false,
            rendererOptions: {
              ...commonTaskRendererOptions,
              collapseSubtasks: false,
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

  // Display summary
  console.log();
  console.log(chalk.hex(colors.orange)("[Dry Run Summary]"));
  console.log();

  if (results.length === 0) {
    console.log(chalk.dim("No translation tasks found."));
    return;
  }

  // Group results by bucket path pattern
  const groupedResults = _.groupBy(
    results,
    (r) => r.task.bucketPathPattern,
  );

  let totalToTranslate = 0;
  let totalAdded = 0;
  let totalUpdated = 0;
  let totalRenamed = 0;

  for (const [pathPattern, taskResults] of Object.entries(groupedResults)) {
    console.log(chalk.hex(colors.yellow)(`${pathPattern}`));
    
    for (const result of taskResults) {
      const displayPath = result.task.bucketPathPattern.replace(
        "[locale]",
        result.task.targetLocale,
      );
      
      console.log(
        `  ${chalk.dim("→")} ${chalk.hex(colors.yellow)(
          result.task.sourceLocale,
        )} -> ${chalk.hex(colors.yellow)(result.task.targetLocale)}`,
      );
      console.log(
        `     ${chalk.dim("Source strings:")} ${chalk.white(
          result.sourceCount,
        )}`,
      );
      console.log(
        `     ${chalk.dim("Target strings:")} ${chalk.white(
          result.targetCount,
        )}`,
      );

      if (result.added > 0) {
        console.log(
          `     ${chalk.hex(colors.green)("+")} ${chalk.green(
            result.added,
          )} ${chalk.dim("new")}`,
        );
      }
      if (result.updated > 0) {
        console.log(
          `     ${chalk.hex(colors.orange)("~")} ${chalk.hex(colors.orange)(
            result.updated,
          )} ${chalk.dim("updated")}`,
        );
      }
      if (result.renamed > 0) {
        console.log(
          `     ${chalk.hex(colors.yellow)("↻")} ${chalk.hex(colors.yellow)(
            result.renamed,
          )} ${chalk.dim("renamed")}`,
        );
      }
      if (result.removed > 0) {
        console.log(
          `     ${chalk.red("-")} ${chalk.red(result.removed)} ${chalk.dim(
            "removed",
          )}`,
        );
      }

      if (result.toTranslate > 0) {
        console.log(
          `     ${chalk.hex(colors.green)("→ Would translate:")} ${chalk.bold(
            chalk.hex(colors.green)(result.toTranslate),
          )} ${chalk.dim("strings")}`,
        );
      } else {
        console.log(
          `     ${chalk.dim("→ Would translate:")} ${chalk.dim(
            "0 strings (up to date)",
          )}`,
        );
      }

      totalToTranslate += result.toTranslate;
      totalAdded += result.added;
      totalUpdated += result.updated;
      totalRenamed += result.renamed;
      
      console.log();
    }
  }

  // Overall summary
  console.log(chalk.hex(colors.orange)("─".repeat(60)));
  console.log();
  console.log(
    `${chalk.hex(colors.green)("Total files to process:")} ${chalk.bold(
      results.length,
    )}`,
  );
  console.log(
    `${chalk.hex(colors.green)("Total strings to translate:")} ${chalk.bold(
      totalToTranslate,
    )}`,
  );
  
  if (totalAdded > 0) {
    console.log(
      `  ${chalk.green("+")} ${chalk.green(totalAdded)} ${chalk.dim(
        "new strings",
      )}`,
    );
  }
  if (totalUpdated > 0) {
    console.log(
      `  ${chalk.hex(colors.orange)("~")} ${chalk.hex(colors.orange)(
        totalUpdated,
      )} ${chalk.dim("updated strings")}`,
    );
  }
  if (totalRenamed > 0) {
    console.log(
      `  ${chalk.hex(colors.yellow)("↻")} ${chalk.hex(colors.yellow)(
        totalRenamed,
      )} ${chalk.dim("renamed strings")}`,
    );
  }

  console.log();
  console.log(
    chalk.dim(
      "Run without --dry-run to perform the actual translation.",
    ),
  );
}

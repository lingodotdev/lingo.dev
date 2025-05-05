import chalk from "chalk";
import { Listr, ListrDefaultRendererLogLevels } from "listr2";
import path from "path";

import { colors } from "../../constants";
import { PlanState, LocalizationTask } from "./_types";
import { I18nConfig, resolveOverriddenLocale } from "@lingo.dev/_spec";
import { getBuckets } from "../../utils/buckets";

export async function plan(i18nConfig: I18nConfig): Promise<PlanState> {
  console.log(chalk.hex(colors.orange)("[Planning]"));

  return new Listr<PlanState>(
    [
      {
        title: "Analyzing project",
        task: async (ctx, task) => {
          task.title = `Found ${chalk.hex(colors.yellow)(Object.keys(i18nConfig.buckets).length.toString())} bucket(s)`;
        },
      },
      {
        title: "Scanning documents",
        task: async (ctx, task) => {
          const buckets = getBuckets(i18nConfig);

          // Calculate total number of placeholdered paths for display purposes
          const totalPathPatterns = buckets.reduce(
            (acc, b) => acc + b.paths.length,
            0,
          );

          task.title = `Found ${chalk.hex(colors.yellow)(totalPathPatterns.toString())} path pattern(s)`;
        },
      },
      {
        title: "Detecting locales",
        task: async (ctx, task) => {
          const targets = i18nConfig.locale.targets;
          task.title = `Found ${chalk.hex(colors.yellow)(targets.length.toString())} target locales: ${targets.map((l) => chalk.hex(colors.yellow)(l)).join(", ")}`;
        },
      },
      {
        title: "Computing translation tasks",
        task: async (ctx, task) => {
          const buckets = getBuckets(i18nConfig);

          for (const bucket of buckets) {
            for (const bucketPath of bucket.paths) {
              const sourceLocale = resolveOverriddenLocale(
                i18nConfig.locale.source,
                bucketPath.delimiter,
              );

              for (const _targetLocale of i18nConfig.locale.targets) {
                const targetLocale = resolveOverriddenLocale(
                  _targetLocale,
                  bucketPath.delimiter,
                );

                // Skip if source and target are identical (shouldn't happen but guard)
                if (sourceLocale === targetLocale) continue;

                const taskItem: LocalizationTask = {
                  sourceLocale,
                  targetLocale,
                  bucketType: bucket.type,
                  filePathPlaceholder: path.normalize(bucketPath.pathPattern),
                };

                ctx.tasks.push(taskItem);
              }
            }
          }

          task.title = `Prepared ${chalk.hex(colors.green)(ctx.tasks.length.toString())} translation task(s)`;
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
  ).run({ tasks: [] });
}

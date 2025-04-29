import chalk from "chalk";
import { Listr } from "listr2";

import { colors } from "../../constants";
import { resolveOverriddenLocale } from "@lingo.dev/_spec";
import { getBuckets } from "../../utils/buckets";
import { commonTaskRendererOptions } from "./_const";
import { CmdRunContext } from "./_types";

export default async function plan(
  input: CmdRunContext,
): Promise<CmdRunContext> {
  console.log(chalk.hex(colors.orange)("[Planning]"));

  let buckets = getBuckets(input.config!);
  if (input.flags.bucket) {
    buckets = buckets.filter((b) => input.flags.bucket!.includes(b.type));
  }

  let locales = input.config!.locale.targets;
  if (input.flags.locale) {
    locales = locales.filter((l) => input.flags.locale!.includes(l));
  }

  return new Listr<CmdRunContext>(
    [
      {
        title: "Locating content buckets",
        task: async (ctx, task) => {
          const bucketCount = buckets.length;
          const bucketFilter = input.flags.bucket
            ? ` ${chalk.dim(`(filtered by: ${chalk.hex(colors.yellow)(input.flags.bucket!.join(", "))})`)}`
            : "";
          task.title = `Found ${chalk.hex(colors.yellow)(bucketCount.toString())} bucket(s)${bucketFilter}`;
        },
      },
      {
        title: "Detecting locales",
        task: async (ctx, task) => {
          if (!locales.length) {
            throw new Error(
              `No target locales found in config. Please add locales to your i18n.json config file.`,
            );
          }

          const localeFilter = input.flags.locale
            ? ` ${chalk.dim(`(filtered by: ${chalk.hex(colors.yellow)(input.flags.locale!.join(", "))})`)}`
            : "";
          task.title = `Found ${chalk.hex(colors.yellow)(locales.length.toString())} target locale(s)${localeFilter}`;
        },
      },
      {
        title: "Locating localizable files",
        task: async (ctx, task) => {
          const patterns: string[] = [];

          for (const bucket of buckets) {
            for (const bucketPath of bucket.paths) {
              if (input.flags.file) {
                if (
                  !input.flags.file.some((f) =>
                    bucketPath.pathPattern.includes(f),
                  )
                ) {
                  continue;
                }
              }

              patterns.push(bucketPath.pathPattern);
            }
          }

          const fileFilter = input.flags.file
            ? ` ${chalk.dim(`(filtered by: ${chalk.hex(colors.yellow)(input.flags.file.join(", "))})`)}`
            : "";
          task.title = `Found ${chalk.hex(colors.yellow)(patterns.length.toString())} path pattern(s)${fileFilter}`;
        },
      },
      {
        title: "Computing translation tasks",
        task: async (ctx, task) => {
          for (const bucket of buckets) {
            for (const bucketPath of bucket.paths) {
              if (input.flags.file) {
                if (
                  !input.flags.file.some((f) =>
                    bucketPath.pathPattern.includes(f),
                  )
                ) {
                  continue;
                }
              }

              const sourceLocale = resolveOverriddenLocale(
                ctx.config!.locale.source,
                bucketPath.delimiter,
              );

              for (const _targetLocale of locales) {
                const targetLocale = resolveOverriddenLocale(
                  _targetLocale,
                  bucketPath.delimiter,
                );

                // Skip if source and target are identical (shouldn't happen but guard)
                if (sourceLocale === targetLocale) continue;

                ctx.tasks.push({
                  sourceLocale,
                  targetLocale,
                  bucketType: bucket.type,
                  bucketPathPattern: bucketPath.pathPattern,
                  injectLocale: bucket.injectLocale || [],
                  lockedKeys: bucket.lockedKeys || [],
                  lockedPatterns: bucket.lockedPatterns || [],
                });
              }
            }
          }

          task.title = `Prepared ${chalk.hex(colors.green)(ctx.tasks.length.toString())} translation task(s)`;
        },
      },
    ],
    {
      rendererOptions: commonTaskRendererOptions,
    },
  ).run(input);
}

import chalk from "chalk";
import { Listr } from "listr2";
import { minimatch } from "minimatch";

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

  const _sourceLocale = input.flags.sourceLocale || input.config!.locale.source;
  if (!_sourceLocale) {
    throw new Error(
      `No source locale provided. Use --source-locale to specify the source locale or add it to i18n.json (locale.source)`,
    );
  }
  const _targetLocales =
    input.flags.targetLocale || input.config!.locale.targets;
  if (!_targetLocales.length) {
    throw new Error(
      `No target locales provided. Use --target-locale to specify the target locales or add them to i18n.json (locale.targets)`,
    );
  }

  return new Listr<CmdRunContext>(
    [
      {
        title: "Locating content buckets",
        task: async (ctx, task) => {
          const bucketCount = buckets.length;
          const bucketFilter = input.flags.bucket
            ? ` ${chalk.dim(
                `(filtered by: ${chalk.hex(colors.yellow)(
                  input.flags.bucket!.join(", "),
                )})`,
              )}`
            : "";
          task.title = `Found ${chalk.hex(colors.yellow)(
            bucketCount.toString(),
          )} bucket(s)${bucketFilter}`;
        },
      },
      {
        title: "Detecting locales",
        task: async (ctx, task) => {
          task.title = `Found ${chalk.hex(colors.yellow)(
            _targetLocales.length.toString(),
          )} target locale(s)`;
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
                    minimatch(bucketPath.pathPattern, f),
                  )
                ) {
                  continue;
                }
              }

              patterns.push(bucketPath.pathPattern);
            }
          }

          const fileFilter = input.flags.file
            ? ` ${chalk.dim(
                `(filtered by: ${chalk.hex(colors.yellow)(
                  input.flags.file.join(", "),
                )})`,
              )}`
            : "";
          task.title = `Found ${chalk.hex(colors.yellow)(
            patterns.length.toString(),
          )} path pattern(s)${fileFilter}`;
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
                    minimatch(bucketPath.pathPattern, f),
                  )
                ) {
                  continue;
                }
              }

              const sourceLocale = resolveOverriddenLocale(
                _sourceLocale,
                bucketPath.delimiter,
              );

              for (const _targetLocale of _targetLocales) {
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
                  onlyKeys: input.flags.key || [],
                });
              }
            }
          }

          task.title = `Prepared ${chalk.hex(colors.green)(
            ctx.tasks.length.toString(),
          )} translation task(s)`;
        },
      },
    ],
    {
      rendererOptions: commonTaskRendererOptions,
    },
  ).run(input);
}

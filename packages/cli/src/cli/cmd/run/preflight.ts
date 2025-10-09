import chalk from "chalk";
import { Listr } from "listr2";
import _ from "lodash";
import { colors } from "../../constants";
import { CmdRunContext } from "./_types";
import { commonTaskRendererOptions } from "./_const";
import { getBuckets } from "../../utils/buckets";
import createBucketLoader from "../../loaders";
import { createDeltaProcessor } from "../../utils/delta";
import { resolveOverriddenLocale } from "@lingo.dev/_spec";

export default async function preflightFrozen(input: CmdRunContext) {
  console.log(chalk.hex(colors.orange)("[Frozen Validation]"));

  return new Listr<CmdRunContext>(
    [
      {
        title: "Checking lockfile updates (--frozen)",
        task: async (ctx, task) => {
          let buckets = getBuckets(ctx.config!);
          if (ctx.flags.bucket) {
            buckets = buckets.filter((b) => ctx.flags.bucket!.includes(b.type));
          }

          const sourceLocale =
            ctx.flags.sourceLocale || ctx.config!.locale.source;
          const targetLocales =
            ctx.flags.targetLocale || ctx.config!.locale.targets;

          let requiresUpdate: string | null = null;

          bucketLoop: for (const bucket of buckets) {
            for (const bucketPath of bucket.paths) {
              // Apply file filter if specified
              if (ctx.flags.file) {
                const matchesFilter = ctx.flags.file.some((f) =>
                  bucketPath.pathPattern.includes(f),
                );
                if (!matchesFilter) {
                  continue;
                }
              }

              const resolvedSourceLocale = resolveOverriddenLocale(
                sourceLocale,
                bucketPath.delimiter,
              );

              const bucketLoader = createBucketLoader(
                bucket.type,
                bucketPath.pathPattern,
                {
                  defaultLocale: resolvedSourceLocale,
                  returnUnlocalizedKeys: true,
                  injectLocale: bucket.injectLocale,
                  formatter: ctx.config!.formatter,
                },
                bucket.lockedKeys,
                bucket.lockedPatterns,
                bucket.ignoredKeys,
              );
              bucketLoader.setDefaultLocale(resolvedSourceLocale);
              await bucketLoader.init?.();

              const { unlocalizable: sourceUnlocalizable, ...sourceData } =
                await bucketLoader.pull(sourceLocale);
              const deltaProcessor = createDeltaProcessor(
                bucketPath.pathPattern,
              );
              const sourceChecksums =
                await deltaProcessor.createChecksums(sourceData);
              const savedChecksums = await deltaProcessor.loadChecksums();

              // Check for updated keys in source
              const updatedSourceData = _.pickBy(
                sourceData,
                (value, key) => sourceChecksums[key] !== savedChecksums[key],
              );

              if (Object.keys(updatedSourceData).length > 0) {
                requiresUpdate = "updated";
                break bucketLoop;
              }

              // Check each target locale
              for (const _targetLocale of targetLocales) {
                const resolvedTargetLocale = resolveOverriddenLocale(
                  _targetLocale,
                  bucketPath.delimiter,
                );
                const { unlocalizable: targetUnlocalizable, ...targetData } =
                  await bucketLoader.pull(resolvedTargetLocale);

                const missingKeys = _.difference(
                  Object.keys(sourceData),
                  Object.keys(targetData),
                );
                const extraKeys = _.difference(
                  Object.keys(targetData),
                  Object.keys(sourceData),
                );
                const unlocalizableDataDiff = !_.isEqual(
                  sourceUnlocalizable,
                  targetUnlocalizable,
                );

                if (missingKeys.length > 0) {
                  requiresUpdate = "missing";
                  break bucketLoop;
                }

                if (extraKeys.length > 0) {
                  requiresUpdate = "extra";
                  break bucketLoop;
                }

                if (unlocalizableDataDiff) {
                  requiresUpdate = "unlocalizable";
                  break bucketLoop;
                }
              }
            }
          }

          if (requiresUpdate) {
            const message = {
              updated: "Source file has been updated.",
              missing: "Target file is missing translations.",
              extra:
                "Target file has extra translations not present in the source file.",
              unlocalizable:
                "Unlocalizable data (such as booleans, dates, URLs, etc.) do not match.",
            }[requiresUpdate];

            throw new Error(
              `Localization data has changed; please update i18n.lock or run without --frozen. Details: ${message}`,
            );
          }

          task.title = "No lockfile updates required (--frozen)";
        },
      },
    ],
    {
      exitOnError: input.flags.strict,
      rendererOptions: commonTaskRendererOptions,
    },
  ).run(input);
}

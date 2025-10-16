import chalk from "chalk";
import { Listr } from "listr2";
import _ from "lodash";
import { minimatch } from "minimatch";

import { colors } from "../../constants";
import { CmdRunContext } from "./_types";
import { commonTaskRendererOptions } from "./_const";
import { getBuckets } from "../../utils/buckets";
import createBucketLoader from "../../loaders";
import { createDeltaProcessor } from "../../utils/delta";
import { resolveOverriddenLocale } from "@lingo.dev/_spec";

export default async function frozen(input: CmdRunContext) {
  console.log(chalk.hex(colors.orange)("[Frozen]"));

  // Prepare filtered buckets consistently with the planning step
  let buckets = getBuckets(input.config!);
  if (input.flags.bucket?.length) {
    buckets = buckets.filter((b) => input.flags.bucket!.includes(b.type));
  }

  if (input.flags.file?.length) {
    buckets = buckets
      .map((bucket: any) => {
        const paths = bucket.paths.filter((p: any) =>
          input.flags.file!.some(
            (f) => p.pathPattern.includes(f) || minimatch(p.pathPattern, f),
          ),
        );
        return { ...bucket, paths };
      })
      .filter((bucket: any) => bucket.paths.length > 0);
  }

  const _sourceLocale = input.flags.sourceLocale || input.config!.locale.source;
  const _targetLocales =
    input.flags.targetLocale || input.config!.locale.targets;

  return new Listr<CmdRunContext>(
    [
      {
        title: "Setting up localization cache",
        task: async (_ctx, task) => {
          const checkLockfileProcessor = createDeltaProcessor("");
          const lockfileExists =
            await checkLockfileProcessor.checkIfLockExists();
          if (!lockfileExists) {
            for (const bucket of buckets) {
              for (const bucketPath of bucket.paths) {
                const resolvedSourceLocale = resolveOverriddenLocale(
                  _sourceLocale,
                  bucketPath.delimiter,
                );

                const loader = createBucketLoader(
                  bucket.type,
                  bucketPath.pathPattern,
                  {
                    defaultLocale: resolvedSourceLocale,
                    injectLocale: bucket.injectLocale,
                    formatter: input.config!.formatter,
                  },
                  bucket.lockedKeys,
                  bucket.lockedPatterns,
                  bucket.ignoredKeys,
                );
                loader.setDefaultLocale(resolvedSourceLocale);
                await loader.init();

                const sourceData = await loader.pull(_sourceLocale);

                const delta = createDeltaProcessor(bucketPath.pathPattern);
                const checksums = await delta.createChecksums(sourceData);
                await delta.saveChecksums(checksums);
              }
            }
            task.title = "Localization cache initialized";
          } else {
            task.title = "Localization cache loaded";
          }
        },
      },
      {
        title: "Validating frozen state",
        enabled: () => !!input.flags.frozen,
        task: async (_ctx, task) => {
          for (const bucket of buckets) {
            for (const bucketPath of bucket.paths) {
              const resolvedSourceLocale = resolveOverriddenLocale(
                _sourceLocale,
                bucketPath.delimiter,
              );

              const loader = createBucketLoader(
                bucket.type,
                bucketPath.pathPattern,
                {
                  defaultLocale: resolvedSourceLocale,
                  returnUnlocalizedKeys: true,
                  injectLocale: bucket.injectLocale,
                },
                bucket.lockedKeys,
                bucket.lockedPatterns,
                bucket.ignoredKeys,
              );
              loader.setDefaultLocale(resolvedSourceLocale);
              await loader.init();

              const { unlocalizable: srcUnlocalizable, ...src } =
                await loader.pull(_sourceLocale);

              const delta = createDeltaProcessor(bucketPath.pathPattern);
              const sourceChecksums = await delta.createChecksums(src);
              const savedChecksums = await delta.loadChecksums();

              const updatedSourceData = _.pickBy(
                src,
                (value, key) => sourceChecksums[key] !== savedChecksums[key],
              );
              if (Object.keys(updatedSourceData).length > 0) {
                throw new Error(
                  `Localization data has changed; please update i18n.lock or run without --frozen. Details: Source file has been updated.`,
                );
              }

              for (const _tgt of _targetLocales) {
                const resolvedTargetLocale = resolveOverriddenLocale(
                  _tgt,
                  bucketPath.delimiter,
                );
                const { unlocalizable: tgtUnlocalizable, ...tgt } =
                  await loader.pull(resolvedTargetLocale);

                const missingKeys = _.difference(
                  Object.keys(src),
                  Object.keys(tgt),
                );
                if (missingKeys.length > 0) {
                  throw new Error(
                    `Localization data has changed; please update i18n.lock or run without --frozen. Details: Target file is missing translations.`,
                  );
                }

                const extraKeys = _.difference(
                  Object.keys(tgt),
                  Object.keys(src),
                );
                if (extraKeys.length > 0) {
                  throw new Error(
                    `Localization data has changed; please update i18n.lock or run without --frozen. Details: Target file has extra translations not present in the source file.`,
                  );
                }

                const unlocalizableDataDiff = !_.isEqual(
                  srcUnlocalizable,
                  tgtUnlocalizable,
                );
                if (unlocalizableDataDiff) {
                  throw new Error(
                    `Localization data has changed; please update i18n.lock or run without --frozen. Details: Unlocalizable data (such as booleans, dates, URLs, etc.) do not match.`,
                  );
                }
              }
            }
          }

          task.title = "No lockfile updates required";
        },
      },
    ],
    {
      rendererOptions: commonTaskRendererOptions,
    },
  ).run(input);
}

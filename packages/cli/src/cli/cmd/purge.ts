import { Command } from "interactive-commander";
import _ from "lodash";
import Ora from "ora";
import { getConfig } from "../utils/config";
import { getBuckets } from "../utils/buckets";
import { resolveOverriddenLocale } from "@lingo.dev/_spec";
import createBucketLoader from "../loaders";
import { minimatch } from "minimatch";
import { confirm } from "@inquirer/prompts";

interface PurgeOptions {
  bucket?: string[];
  file?: string[];
  key?: string;
  locale?: string[];
  yesReally?: boolean;
}

export default new Command()
  .command("purge")
  .description(
    "Delete translation entries from the bucket path patterns defined in i18n.json. Without filters every managed key is removed from every target locale.",
  )
  .helpOption("-h, --help", "Show help")
  .option(
    "--bucket <bucket>",
    "Limit the purge to specific bucket types defined under `buckets` in i18n.json. Repeat the flag to target multiple types; omit it to touch every bucket",
    (val: string, prev: string[]) => (prev ? [...prev, val] : [val]),
  )
  .option(
    "--file [files...]",
    "Restrict to pathPattern strings that contain these values. Matching is done on the literal `[locale]` pattern text; the CLI does not expand globs or scan the filesystem",
  )
  .option(
    "--key <key>",
    "Only delete keys whose slash-separated path matches this glob-style pattern (for example auth/login/**). Leave it empty to erase every key. Keys marked as locked or ignored in i18n.json are skipped automatically",
  )
  .option(
    "--locale <locale>",
    "Locale codes to rewrite, using the values from i18n.json. Repeat for multiple locales. Leave unset to purge every configured target locale. (Passing the source locale will delete from it too; delimiters are adjusted per bucket.)",
    (val: string, prev: string[]) => (prev ? [...prev, val] : [val]),
  )
  .option(
    "--yes-really",
    "Skip the per-path confirmation preview. Required for scripted or CI purges.",
  )
  .action(async function (options: PurgeOptions) {
    const ora = Ora();
    try {
      ora.start("Loading configuration...");
      const i18nConfig = getConfig();
      if (!i18nConfig) {
        throw new Error("i18n.json not found. Please run `lingo.dev init`.");
      }
      ora.succeed("Configuration loaded");

      let buckets = getBuckets(i18nConfig);
      if (options.bucket && options.bucket.length) {
        buckets = buckets.filter((bucket) =>
          options.bucket!.includes(bucket.type),
        );
      }
      if (options.file && options.file.length) {
        buckets = buckets
          .map((bucket) => {
            const paths = bucket.paths.filter((bucketPath) =>
              options.file?.some((f) => bucketPath.pathPattern.includes(f)),
            );
            return { ...bucket, paths };
          })
          .filter((bucket) => bucket.paths.length > 0);
        if (buckets.length === 0) {
          ora.fail("All files were filtered out by --file option.");
          process.exit(1);
        }
      }
      const sourceLocale = i18nConfig.locale.source;
      const targetLocales =
        options.locale && options.locale.length
          ? options.locale
          : i18nConfig.locale.targets;
      let removedAny = false;
      for (const bucket of buckets) {
        console.log();
        ora.info(`Processing bucket: ${bucket.type}`);
        for (const bucketPath of bucket.paths) {
          for (const _targetLocale of targetLocales) {
            const targetLocale = resolveOverriddenLocale(
              _targetLocale,
              bucketPath.delimiter,
            );
            const bucketOra = Ora({ indent: 2 }).start(
              `Processing path: ${bucketPath.pathPattern} [${targetLocale}]`,
            );
            try {
              const bucketLoader = createBucketLoader(
                bucket.type,
                bucketPath.pathPattern,
                {
                  defaultLocale: sourceLocale,
                  injectLocale: bucket.injectLocale,
                },
                bucket.lockedKeys,
                bucket.lockedPatterns,
                bucket.ignoredKeys,
              );
              await bucketLoader.init();
              bucketLoader.setDefaultLocale(sourceLocale);
              await bucketLoader.pull(sourceLocale);
              let targetData = await bucketLoader.pull(targetLocale);
              if (!targetData || Object.keys(targetData).length === 0) {
                bucketOra.info(
                  `No translations found for ${bucketPath.pathPattern} [${targetLocale}]`,
                );
                continue;
              }
              let newData = { ...targetData };
              let keysToRemove: string[] = [];
              if (options.key) {
                // minimatch for key patterns
                keysToRemove = Object.keys(newData).filter((k) =>
                  minimatch(k, options.key!),
                );
              } else {
                // No key specified: remove all keys
                keysToRemove = Object.keys(newData);
              }
              if (keysToRemove.length > 0) {
                // Show what will be deleted
                if (options.key) {
                  bucketOra.info(
                    `About to delete ${keysToRemove.length} key(s) matching '${options.key}' from ${bucketPath.pathPattern} [${targetLocale}]:\n  ${keysToRemove.slice(0, 10).join(", ")}${keysToRemove.length > 10 ? ", ..." : ""}`,
                  );
                } else {
                  bucketOra.info(
                    `About to delete all (${keysToRemove.length}) keys from ${bucketPath.pathPattern} [${targetLocale}]`,
                  );
                }

                if (!options.yesReally) {
                  bucketOra.warn(
                    "This is a destructive operation. If you are sure, type 'y' to continue. (Use --yes-really to skip this check.)",
                  );
                  const confirmed = await confirm({
                    message: `Delete these keys from ${bucketPath.pathPattern} [${targetLocale}]?`,
                    default: false,
                  });
                  if (!confirmed) {
                    bucketOra.info("Skipped by user.");
                    continue;
                  }
                }
                for (const key of keysToRemove) {
                  delete newData[key];
                }
                removedAny = true;
                await bucketLoader.push(targetLocale, newData);
                if (options.key) {
                  bucketOra.succeed(
                    `Removed ${keysToRemove.length} key(s) matching '${options.key}' from ${bucketPath.pathPattern} [${targetLocale}]`,
                  );
                } else {
                  bucketOra.succeed(
                    `Removed all keys (${keysToRemove.length}) from ${bucketPath.pathPattern} [${targetLocale}]`,
                  );
                }
              } else if (options.key) {
                bucketOra.info(
                  `No keys matching '${options.key}' found in ${bucketPath.pathPattern} [${targetLocale}]`,
                );
              } else {
                bucketOra.info("No keys to remove.");
              }
            } catch (error) {
              const err = error as Error;
              bucketOra.fail(`Failed: ${err.message}`);
            }
          }
        }
      }
      if (!removedAny) {
        ora.info("No keys were removed.");
      } else {
        ora.succeed("Purge completed.");
      }
    } catch (error) {
      const err = error as Error;
      ora.fail(err.message);
      process.exit(1);
    }
  });

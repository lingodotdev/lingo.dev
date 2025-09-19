import { I18nConfig, resolveOverriddenLocale } from "@lingo.dev/_spec";
import { Command } from "interactive-commander";
import _ from "lodash";
import { getConfig } from "../utils/config";
import { CLIError } from "../utils/errors";
import Ora from "ora";
import createBucketLoader from "../loaders";
import { getBuckets } from "../utils/buckets";

export default new Command()
  .command("cleanup")
  .description(
    "Remove translation keys from target locales that no longer exist in the source locale",
  )
  .helpOption("-h, --help", "Show help")
  .option(
    "--locale <locale>",
    "Limit cleanup to a specific target locale from i18n.json. Defaults to all configured target locales",
  )
  .option(
    "--bucket <bucket>",
    "Limit cleanup to a specific bucket type defined under `buckets` in i18n.json",
  )
  .option(
    "--dry-run",
    "Preview which keys would be deleted without making any changes",
  )
  .option(
    "--verbose",
    "Print detailed output showing the specific keys to be removed for each locale",
  )
  .action(async function (options) {
    const ora = Ora();
    const results: any = [];

    try {
      ora.start("Loading configuration...");
      const i18nConfig = getConfig();
      validateConfig(i18nConfig);
      ora.succeed("Configuration loaded");

      let buckets = getBuckets(i18nConfig!);
      if (options.bucket) {
        buckets = buckets.filter(
          (bucket: any) => bucket.type === options.bucket,
        );
      }

      const targetLocales = options.locale
        ? [options.locale]
        : i18nConfig!.locale.targets;

      // Process each bucket
      for (const bucket of buckets) {
        console.log();
        ora.info(`Processing bucket: ${bucket.type}`);

        for (const bucketConfig of bucket.paths) {
          const sourceLocale = resolveOverriddenLocale(
            i18nConfig!.locale.source,
            bucketConfig.delimiter,
          );
          const bucketOra = Ora({ indent: 2 }).info(
            `Processing path: ${bucketConfig.pathPattern}`,
          );
          const bucketLoader = createBucketLoader(
            bucket.type,
            bucketConfig.pathPattern,
            {
              defaultLocale: sourceLocale,
            },
          );
          bucketLoader.setDefaultLocale(sourceLocale);

          // Load source data
          const sourceData = await bucketLoader.pull(sourceLocale);
          const sourceKeys = Object.keys(sourceData);

          for (const _targetLocale of targetLocales) {
            const targetLocale = resolveOverriddenLocale(
              _targetLocale,
              bucketConfig.delimiter,
            );
            try {
              const targetData = await bucketLoader.pull(targetLocale);
              const targetKeys = Object.keys(targetData);
              const keysToRemove = _.difference(targetKeys, sourceKeys);

              if (keysToRemove.length === 0) {
                bucketOra.succeed(`[${targetLocale}] No keys to remove`);
                continue;
              }

              if (options.verbose) {
                bucketOra.info(
                  `[${targetLocale}] Keys to remove: ${JSON.stringify(
                    keysToRemove,
                    null,
                    2,
                  )}`,
                );
              }

              if (!options.dryRun) {
                const cleanedData = _.pick(targetData, sourceKeys);
                await bucketLoader.push(targetLocale, cleanedData);
                bucketOra.succeed(
                  `[${targetLocale}] Removed ${keysToRemove.length} keys`,
                );
              } else {
                bucketOra.succeed(
                  `[${targetLocale}] Would remove ${keysToRemove.length} keys (dry run)`,
                );
              }
            } catch (error: any) {
              bucketOra.fail(
                `[${targetLocale}] Failed to cleanup: ${error.message}`,
              );
              results.push({
                step: `Cleanup ${bucket.type}/${bucketConfig} for ${targetLocale}`,
                status: "Failed",
                error: error.message,
              });
            }
          }
        }
      }

      console.log();
      ora.succeed("Cleanup completed!");
    } catch (error: any) {
      ora.fail(error.message);
      process.exit(1);
    } finally {
      displaySummary(results);
    }
  });

function validateConfig(i18nConfig: I18nConfig | null) {
  if (!i18nConfig) {
    throw new CLIError({
      message:
        "i18n.json not found. Please run `lingo.dev init` to initialize the project.",
      docUrl: "i18nNotFound",
    });
  }
  if (!i18nConfig.buckets || !Object.keys(i18nConfig.buckets).length) {
    throw new CLIError({
      message:
        "No buckets found in i18n.json. Please add at least one bucket containing i18n content.",
      docUrl: "bucketNotFound",
    });
  }
}

function displaySummary(results: any[]) {
  if (results.length === 0) return;

  console.log("\nProcess Summary:");
  results.forEach((result) => {
    console.log(`${result.step}: ${result.status}`);
    if (result.error) console.log(`  - Error: ${result.error}`);
  });
}

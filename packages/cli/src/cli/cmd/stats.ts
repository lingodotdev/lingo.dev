import {
  bucketTypeSchema,
  I18nConfig,
  localeCodeSchema,
  resolveOverriddenLocale,
} from "@lingo.dev/_spec";
import { Command } from "interactive-commander";
import Z from "zod";
import { getConfig } from "../utils/config";
import { CLIError } from "../utils/errors";
import Ora from "ora";
import createBucketLoader from "../loaders";
import { getBuckets } from "../utils/buckets";
import chalk from "chalk";
import Table from "cli-table3";
import { exitGracefully } from "../utils/exit-gracefully";

// Define types for our statistics
interface LocaleStats {
  totalKeys: number;
  translatedKeys: number;
  missingKeys: string[];
  coverage: number;
}

export default new Command()
  .command("stats")
  .description("Generate translation statistics report for all locales")
  .helpOption("-h, --help", "Show help")
  .option(
    "--locale <locale>",
    "Limit the report to specific target locales from i18n.json. Repeat the flag to include multiple locales. Defaults to all configured target locales",
    (val: string, prev: string[]) => (prev ? [...prev, val] : [val]),
  )
  .option(
    "--bucket <bucket>",
    "Limit the report to specific bucket types defined in i18n.json (e.g., json, yaml, android). Repeat the flag to include multiple bucket types. Defaults to all buckets",
    (val: string, prev: string[]) => (prev ? [...prev, val] : [val]),
  )
  .option(
    "--show-missing",
    "Show list of missing keys for each language",
  )
  .action(async function (options: any) {
    const ora = Ora();
    const flags = parseFlags(options);

    try {
      ora.start("Loading configuration...");
      const i18nConfig = getConfig();
      ora.succeed("Configuration loaded");

      ora.start("Validating localization configuration...");
      validateParams(i18nConfig, flags);
      ora.succeed("Localization configuration is valid");

      let buckets = getBuckets(i18nConfig!);
      if (flags.bucket?.length) {
        buckets = buckets.filter((bucket: any) =>
          flags.bucket!.includes(bucket.type),
        );
      }
      ora.succeed("Buckets retrieved");

      const targetLocales = flags.locale?.length
        ? flags.locale
        : i18nConfig!.locale.targets;

      // Aggregate statistics across all buckets
      const localeStatsMap: Record<string, LocaleStats> = {};

      // Track translated and missing keys per locale using Sets to avoid duplicates
      const translatedKeysPerLocale: Record<string, Set<string>> = {};
      const missingKeysPerLocale: Record<string, Set<string>> = {};

      // Initialize stats for each locale
      for (const locale of targetLocales) {
        localeStatsMap[locale] = {
          totalKeys: 0,
          translatedKeys: 0,
          missingKeys: [],
          coverage: 0,
        };
        translatedKeysPerLocale[locale] = new Set<string>();
        missingKeysPerLocale[locale] = new Set<string>();
      }

      // Track all unique keys across all buckets
      const allSourceKeys = new Set<string>();

      // Process each bucket
      for (const bucket of buckets) {
        try {
          ora.info(`Analyzing bucket: ${bucket.type}`);

          for (const bucketPath of bucket.paths) {
            const bucketOra = Ora({ indent: 2 }).info(
              `Analyzing path: ${bucketPath.pathPattern}`,
            );

            const sourceLocale = resolveOverriddenLocale(
              i18nConfig!.locale.source,
              bucketPath.delimiter,
            );
            const bucketLoader = createBucketLoader(
              bucket.type,
              bucketPath.pathPattern,
              {
                defaultLocale: sourceLocale,
                injectLocale: bucket.injectLocale,
                formatter: i18nConfig!.formatter,
              },
              bucket.lockedKeys,
              bucket.lockedPatterns,
              bucket.ignoredKeys,
            );

            bucketLoader.setDefaultLocale(sourceLocale);
            await bucketLoader.init();

            // Get source data
            const sourceData = await bucketLoader.pull(sourceLocale);
            const sourceKeys = Object.keys(sourceData);

            // Add to global set of all keys
            sourceKeys.forEach((key) => allSourceKeys.add(key));

            // Process each target locale
            for (const _targetLocale of targetLocales) {
              const targetLocale = resolveOverriddenLocale(
                _targetLocale,
                bucketPath.delimiter,
              );

              let targetData = {};
              let fileExists = true;

              try {
                targetData = await bucketLoader.pull(targetLocale);
              } catch (error) {
                fileExists = false;
              }

              // Count translated vs missing keys
              for (const key of sourceKeys) {
                const targetValue = (targetData as Record<string, any>)[key];

                // Consider a key translated if:
                // 1. The target file exists
                // 2. The key exists in target data
                // 3. The value is non-empty (not null, undefined, or empty string)
                let isTranslated = false;
                if (
                  fileExists &&
                  targetValue !== undefined &&
                  targetValue !== null &&
                  targetValue !== ""
                ) {
                  if (typeof targetValue === "string") {
                    isTranslated = targetValue.trim().length > 0;
                  } else {
                    // Non-string values are considered translated if they exist
                    isTranslated = true;
                  }
                }

                if (isTranslated) {
                  translatedKeysPerLocale[_targetLocale].add(key);
                  // Remove from missing if it was there (e.g., from a previous bucket)
                  missingKeysPerLocale[_targetLocale].delete(key);
                } else {
                  // Only add to missing if not already translated
                  if (!translatedKeysPerLocale[_targetLocale].has(key)) {
                    missingKeysPerLocale[_targetLocale].add(key);
                  }
                }
              }
            }

            bucketOra.succeed(`Completed analysis for ${bucketPath.pathPattern}`);
          }
        } catch (error: any) {
          ora.fail(`Failed to analyze bucket ${bucket.type}: ${error.message}`);
        }
      }

      // Use the total unique keys across all buckets as the total
      const totalUniqueKeys = allSourceKeys.size;

      // Calculate final statistics from the sets
      for (const locale of targetLocales) {
        const stats = localeStatsMap[locale];
        stats.totalKeys = totalUniqueKeys;
        stats.translatedKeys = translatedKeysPerLocale[locale].size;
        stats.missingKeys = Array.from(missingKeysPerLocale[locale]).sort();
        stats.coverage =
          stats.totalKeys > 0
            ? (stats.translatedKeys / stats.totalKeys) * 100
            : 0;
      }

      // Display the report
      console.log();
      ora.succeed(chalk.green("Translation statistics generated."));

      // Print header
      console.log(chalk.bold.cyan(`\n╔═══════════════════════════════════════════════════╗`));
      console.log(chalk.bold.cyan(`║     TRANSLATION STATISTICS REPORT                 ║`));
      console.log(chalk.bold.cyan(`╚═══════════════════════════════════════════════════╝`));

      // Summary section
      console.log(chalk.bold(`\n📊 SUMMARY:`));
      console.log(`• Source language: ${chalk.green(i18nConfig!.locale.source)}`);
      console.log(`• Total keys: ${chalk.yellow(totalUniqueKeys.toString())}`);
      
      // Calculate overall stats
      let totalTranslated = 0;
      let totalPossible = totalUniqueKeys * targetLocales.length;
      for (const locale of targetLocales) {
        totalTranslated += localeStatsMap[locale].translatedKeys;
      }
      const overallCoverage = totalPossible > 0 
        ? (totalTranslated / totalPossible) * 100 
        : 0;

      console.log(`• Overall coverage: ${chalk.cyan(overallCoverage.toFixed(1) + "%")}`);
      console.log(`• Target locales: ${chalk.yellow(targetLocales.length.toString())}`);

      // Per-language table
      console.log(chalk.bold(`\n🌐 PER-LANGUAGE BREAKDOWN:`));

      const table = new Table({
        head: [
          "Language",
          "Total Keys",
          "Translated",
          "Missing",
          "Coverage",
        ],
        style: {
          head: ["white"],
          border: [],
        },
        colWidths: [12, 15, 15, 15, 15],
      });

      for (const locale of targetLocales) {
        const stats = localeStatsMap[locale];
        const coverageColor =
          stats.coverage === 100
            ? chalk.green
            : stats.coverage >= 80
              ? chalk.yellow
              : chalk.red;

        table.push([
          locale,
          stats.totalKeys.toString(),
          stats.translatedKeys.toString(),
          stats.missingKeys.length.toString(),
          coverageColor(`${stats.coverage.toFixed(1)}%`),
        ]);
      }

      console.log(table.toString());

      // Missing keys section
      if (flags.showMissing) {
        console.log(chalk.bold(`\n🔍 MISSING KEYS:`));
        for (const locale of targetLocales) {
          const stats = localeStatsMap[locale];
          if (stats.missingKeys.length > 0) {
            console.log(chalk.bold(`\n${locale}:`));
            // Show up to 20 missing keys, or all if less than 20
            const keysToShow = stats.missingKeys.slice(0, 20);
            keysToShow.forEach((key) => {
              console.log(`  • ${chalk.red(key)}`);
            });
            if (stats.missingKeys.length > 20) {
              console.log(
                chalk.dim(`  ... and ${stats.missingKeys.length - 20} more keys`),
              );
            }
          } else {
            console.log(chalk.green(`\n${locale}: All keys translated ✅`));
          }
        }
      } else {
        // Show summary of missing keys
        console.log(chalk.bold(`\n💡 TIP:`));
        console.log(
          `  Use ${chalk.cyan("--show-missing")} flag to see the list of missing keys for each language`,
        );
      }

      exitGracefully();
    } catch (error: any) {
      ora.fail(error.message);
      process.exit(1);
    }
  });

function parseFlags(options: any) {
  return Z.object({
    locale: Z.array(localeCodeSchema).optional(),
    bucket: Z.array(bucketTypeSchema).optional(),
    showMissing: Z.boolean().optional(),
  }).parse(options);
}

function validateParams(
  i18nConfig: I18nConfig | null,
  flags: ReturnType<typeof parseFlags>,
) {
  if (!i18nConfig) {
    throw new CLIError({
      message:
        "i18n.json not found. Please run `lingo.dev init` to initialize the project.",
      docUrl: "i18nNotFound",
    });
  } else if (!i18nConfig.buckets || !Object.keys(i18nConfig.buckets).length) {
    throw new CLIError({
      message:
        "No buckets found in i18n.json. Please add at least one bucket containing i18n content.",
      docUrl: "bucketNotFound",
    });
  } else if (
    flags.locale?.some((locale: string) => !i18nConfig.locale.targets.includes(locale))
  ) {
    throw new CLIError({
      message: `One or more specified locales do not exist in i18n.json locale.targets. Please add them to the list and try again.`,
      docUrl: "localeTargetNotFound",
    });
  } else if (
    flags.bucket?.some(
      (bucket: string) =>
        !i18nConfig.buckets[bucket as keyof typeof i18nConfig.buckets],
    )
  ) {
    throw new CLIError({
      message: `One or more specified buckets do not exist in i18n.json. Please add them to the list and try again.`,
      docUrl: "bucketNotFound",
    });
  }
}


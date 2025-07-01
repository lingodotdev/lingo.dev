import {
  bucketTypeSchema,
  I18nConfig,
  localeCodeSchema,
  resolveOverriddenLocale,
} from "@lingo.dev/_spec";
import { Command } from "interactive-commander";
import Z from "zod";
import _ from "lodash";
import * as path from "path";
import { getConfig } from "../utils/config";
import { getSettings } from "../utils/settings";
import { CLIError } from "../utils/errors";
import Ora from "ora";
import createBucketLoader from "../loaders";
import { createAuthenticator } from "../utils/auth";
import { getBuckets } from "../utils/buckets";
import chalk from "chalk";
import Table from "cli-table3";
import { createDeltaProcessor } from "../utils/delta";
import trackEvent from "../utils/observability";
import { minimatch } from "minimatch";

// Define types for our language stats
interface LanguageStats {
  complete: number;
  missing: number;
  updated: number;
  words: number;
}

export default new Command()
  .command("status")
  .description("Show the status of the localization process")
  .helpOption("-h, --help", "Show help")
  .option(
    "--locale <locale>",
    "Locale to process",
    (val: string, prev: string[]) => (prev ? [...prev, val] : [val]),
  )
  .option(
    "--bucket <bucket>",
    "Bucket to process",
    (val: string, prev: string[]) => (prev ? [...prev, val] : [val]),
  )
  .option(
    "--file [files...]",
    "File to process. Process only a specific path, may contain asterisk * to match multiple files.",
  )
  .option(
    "--force",
    "Ignore lockfile and process all keys, useful for estimating full re-translation",
  )
  .option("--verbose", "Show detailed output including key-level word counts")
  .option(
    "--api-key <api-key>",
    "Explicitly set the API key to use, override the default API key from settings",
  )
  .action(async function (options) {
    const ora = Ora();
    const flags = parseFlags(options);
    let authId: string | null = null;

    try {
      ora.start("Loading configuration...");
      const i18nConfig = getConfig();
      const settings = getSettings(flags.apiKey);
      ora.succeed("Configuration loaded");

      // Try to authenticate, but continue even if not authenticated
      try {
        ora.start("Checking authentication status...");
        const auth = await tryAuthenticate(settings);
        if (auth) {
          authId = auth.id;
          ora.succeed(`Authenticated as ${auth.email}`);
        } else {
          ora.info(
            "Not authenticated. Continuing without authentication. (Run `lingo.dev auth --login` to authenticate)",
          );
        }
      } catch (error) {
        ora.info("Authentication failed. Continuing without authentication.");
      }

      ora.start("Validating localization configuration...");
      validateParams(i18nConfig, flags);
      ora.succeed("Localization configuration is valid");

      // Track event with or without authentication
      trackEvent(authId || "status", "cmd.status.start", {
        i18nConfig,
        flags,
      });

      let buckets = getBuckets(i18nConfig!);
      if (flags.bucket?.length) {
        buckets = buckets.filter((bucket: any) =>
          flags.bucket!.includes(bucket.type),
        );
      }
      ora.succeed("Buckets retrieved");

      if (flags.file?.length) {
        buckets = buckets
          .map((bucket: any) => {
            const paths = bucket.paths.filter((path: any) =>
              flags.file!.find(
                (file) =>
                  path.pathPattern?.includes(file) ||
                  path.pathPattern?.match(file) ||
                  minimatch(path.pathPattern, file),
              ),
            );
            return { ...bucket, paths };
          })
          .filter((bucket: any) => bucket.paths.length > 0);
        if (buckets.length === 0) {
          ora.fail(
            "No buckets found. All buckets were filtered out by --file option.",
          );
          process.exit(1);
        } else {
          ora.info(`\x1b[36mProcessing only filtered buckets:\x1b[0m`);
          buckets.map((bucket: any) => {
            ora.info(`  ${bucket.type}:`);
            bucket.paths.forEach((path: any) => {
              ora.info(`    - ${path.pathPattern}`);
            });
          });
        }
      }

      const targetLocales = flags.locale?.length
        ? flags.locale
        : i18nConfig!.locale.targets;

      // Global stats
      let totalSourceKeyCount = 0;
      let uniqueKeysToTranslate = 0;
      let totalExistingTranslations = 0;
      const totalWordCount = new Map<string, number>(); // Words per language
      const languageStats: Record<string, LanguageStats> = {};

      // Initialize per-language stats
      for (const locale of targetLocales) {
        languageStats[locale] = {
          complete: 0,
          missing: 0,
          updated: 0,
          words: 0,
        };
        totalWordCount.set(locale, 0);
      }

      // Per-file stats
      const fileStats: Record<
        string,
        {
          path: string;
          sourceKeys: number;
          wordCount: number;
          languageStats: Record<
            string,
            {
              complete: number;
              missing: number;
              updated: number;
              words: number;
            }
          >;
        }
      > = {};

      // Process each bucket
      for (const bucket of buckets) {
        try {
          console.log();
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
              },
              bucket.lockedKeys,
            );

            bucketLoader.setDefaultLocale(sourceLocale);
            await bucketLoader.init();

            // Initialize file stats
            const filePath = bucketPath.pathPattern;
            if (!fileStats[filePath]) {
              fileStats[filePath] = {
                path: filePath,
                sourceKeys: 0,
                wordCount: 0,
                languageStats: {},
              };

              for (const locale of targetLocales) {
                fileStats[filePath].languageStats[locale] = {
                  complete: 0,
                  missing: 0,
                  updated: 0,
                  words: 0,
                };
              }
            }

            // Get source data and count source keys
            const sourceData = await bucketLoader.pull(sourceLocale);
            const sourceKeys = Object.keys(sourceData);
            fileStats[filePath].sourceKeys = sourceKeys.length;
            totalSourceKeyCount += sourceKeys.length;

            // Calculate source word count
            let sourceWordCount = 0;
            for (const key of sourceKeys) {
              const value = sourceData[key];
              if (typeof value === "string") {
                const words = value.trim().split(/\s+/).length;
                sourceWordCount += words;
              }
            }
            fileStats[filePath].wordCount = sourceWordCount;

            // Process each target locale
            for (const _targetLocale of targetLocales) {
              const targetLocale = resolveOverriddenLocale(
                _targetLocale,
                bucketPath.delimiter,
              );
              bucketOra.start(
                `[${sourceLocale} -> ${targetLocale}] Analyzing translation status...`,
              );

              let targetData = {};
              let fileExists = true;

              try {
                targetData = await bucketLoader.pull(targetLocale);
              } catch (error) {
                fileExists = false;
                bucketOra.info(
                  `[${sourceLocale} -> ${targetLocale}] Target file not found, assuming all keys need translation.`,
                );
              }

              if (!fileExists) {
                // All keys are missing for this locale
                fileStats[filePath].languageStats[_targetLocale].missing =
                  sourceKeys.length;
                fileStats[filePath].languageStats[_targetLocale].words =
                  sourceWordCount;
                languageStats[_targetLocale].missing += sourceKeys.length;
                languageStats[_targetLocale].words += sourceWordCount;
                totalWordCount.set(
                  _targetLocale,
                  (totalWordCount.get(_targetLocale) || 0) + sourceWordCount,
                );

                bucketOra.succeed(
                  `[${sourceLocale} -> ${targetLocale}] ${chalk.red(
                    `0% complete`,
                  )} (0/${sourceKeys.length} keys) - file not found`,
                );
                continue;
              }

              // Calculate delta for existing file
              const deltaProcessor = createDeltaProcessor(
                bucketPath.pathPattern,
              );
              const checksums = await deltaProcessor.loadChecksums();
              const delta = await deltaProcessor.calculateDelta({
                sourceData,
                targetData,
                checksums,
              });

              const missingKeys = delta.added;
              const updatedKeys = delta.updated;
              const completeKeys = sourceKeys.filter(
                (key) =>
                  !missingKeys.includes(key) && !updatedKeys.includes(key),
              );

              // Count words that need translation
              let wordsToTranslate = 0;
              const keysToProcess = flags.force
                ? sourceKeys
                : [...missingKeys, ...updatedKeys];

              for (const key of keysToProcess) {
                const value = sourceData[String(key)];
                if (typeof value === "string") {
                  const words = value.trim().split(/\s+/).length;
                  wordsToTranslate += words;
                }
              }

              // Update file stats
              fileStats[filePath].languageStats[_targetLocale].missing =
                missingKeys.length;
              fileStats[filePath].languageStats[_targetLocale].updated =
                updatedKeys.length;
              fileStats[filePath].languageStats[_targetLocale].complete =
                completeKeys.length;
              fileStats[filePath].languageStats[_targetLocale].words =
                wordsToTranslate;

              // Update global stats
              languageStats[_targetLocale].missing += missingKeys.length;
              languageStats[_targetLocale].updated += updatedKeys.length;
              languageStats[_targetLocale].complete += completeKeys.length;
              languageStats[_targetLocale].words += wordsToTranslate;
              totalWordCount.set(
                _targetLocale,
                (totalWordCount.get(_targetLocale) || 0) + wordsToTranslate,
              );

              // Display progress
              const totalKeysInFile = sourceKeys.length;
              const completionPercent = (
                (completeKeys.length / totalKeysInFile) *
                100
              ).toFixed(1);

              if (missingKeys.length === 0 && updatedKeys.length === 0) {
                bucketOra.succeed(
                  `[${sourceLocale} -> ${targetLocale}] ${chalk.green(
                    `100% complete`,
                  )} (${completeKeys.length}/${totalKeysInFile} keys)`,
                );
              } else {
                const message = `[${sourceLocale} -> ${targetLocale}] ${
                  parseFloat(completionPercent) > 50
                    ? chalk.yellow(`${completionPercent}% complete`)
                    : chalk.red(`${completionPercent}% complete`)
                } (${completeKeys.length}/${totalKeysInFile} keys)`;

                bucketOra.succeed(message);

                if (flags.verbose) {
                  if (missingKeys.length > 0) {
                    console.log(
                      `    ${chalk.red(`Missing:`)} ${missingKeys.length} keys, ~${wordsToTranslate} words`,
                    );
                    console.log(
                      `    ${chalk.red(`Missing:`)} ${
                        missingKeys.length
                      } keys, ~${wordsToTranslate} words`,
                    );
                    console.log(
                      `    ${chalk.dim(
                        `Example missing: ${missingKeys
                          .slice(0, 2)
                          .join(", ")}${missingKeys.length > 2 ? "..." : ""}`,
                      )}`,
                    );
                  }
                  if (updatedKeys.length > 0) {
                    console.log(
                      `    ${chalk.yellow(`Updated:`)} ${
                        updatedKeys.length
                      } keys that changed in source`,
                    );
                  }
                }
              }
            }
          }
        } catch (error: any) {
          ora.fail(`Failed to analyze bucket ${bucket.type}: ${error.message}`);
        }
      }

      // Calculate unique keys needing translation and keys fully translated
      // Count unique keys that need translation
      const totalKeysNeedingTranslation = Object.values(languageStats).reduce(
        (sum, stats) => {
          return sum + stats.missing + stats.updated;
        },
        0,
      );

      // Calculate keys that are completely translated
      const totalCompletedKeys =
        totalSourceKeyCount -
        totalKeysNeedingTranslation / targetLocales.length;

      // Summary output
      console.log();
      ora.succeed(chalk.green(`Localization status completed.`));

      // Create a visually impactful main header
      console.log(chalk.bold.cyan(`\n╔════════════════════════════════════╗`));
      console.log(chalk.bold.cyan(`║   LOCALIZATION STATUS REPORT       ║`));
      console.log(chalk.bold.cyan(`╚════════════════════════════════════╝`));

      // Source content overview
      console.log(chalk.bold(`\n📝 SOURCE CONTENT:`));
      console.log(
        `• Source language: ${chalk.green(i18nConfig!.locale.source)}`,
      );
      console.log(
        `• Source keys: ${chalk.yellow(
          totalSourceKeyCount.toString(),
        )} keys across all files`,
      );

      // Create a language-by-language breakdown table
      console.log(chalk.bold(`\n🌐 LANGUAGE BY LANGUAGE BREAKDOWN:`));

      // Create a new table instance with cli-table3
      const table = new Table({
        head: [
          "Language",
          "Status",
          "Complete",
          "Missing",
          "Updated",
          "Total Keys",
          "Words to Translate",
        ],
        style: {
          head: ["white"], // White color for headers
          border: [], // No color for borders
        },
        colWidths: [12, 20, 18, 12, 12, 12, 15], // Explicit column widths, making Status column wider
      });

      // Data rows
      let totalWordsToTranslate = 0;
      for (const locale of targetLocales) {
        const stats = languageStats[locale];
        const percentComplete = (
          (stats.complete / totalSourceKeyCount) *
          100
        ).toFixed(1);
        const totalNeeded = stats.missing + stats.updated;

        // Determine status text and color
        let statusText;
        let statusColor;
        if (stats.missing === totalSourceKeyCount) {
          statusText = "🔴 Not started";
          statusColor = chalk.red;
        } else if (stats.missing === 0 && stats.updated === 0) {
          statusText = "✅ Complete";
          statusColor = chalk.green;
        } else if (parseFloat(percentComplete) > 80) {
          statusText = "🟡 Almost done";
          statusColor = chalk.yellow;
        } else if (parseFloat(percentComplete) > 0) {
          statusText = "🟠 In progress";
          statusColor = chalk.yellow;
        } else {
          statusText = "🔴 Not started";
          statusColor = chalk.red;
        }

        // Create row data
        const words = totalWordCount.get(locale) || 0;
        totalWordsToTranslate += words;

        // Add row to the table
        table.push([
          locale,
          statusColor(statusText),
          `${stats.complete}/${totalSourceKeyCount} (${percentComplete}%)`,
          stats.missing > 0 ? chalk.red(stats.missing.toString()) : "0",
          stats.updated > 0 ? chalk.yellow(stats.updated.toString()) : "0",
          totalNeeded > 0 ? chalk.magenta(totalNeeded.toString()) : "0",
          words > 0 ? `~${words.toLocaleString()}` : "0",
        ]);
      }

      // Display the table
      console.log(table.toString());

      // Total usage summary
      console.log(chalk.bold(`\n📊 USAGE ESTIMATE:`));
      console.log(
        `• WORDS TO BE CONSUMED: ~${chalk.yellow.bold(
          totalWordsToTranslate.toLocaleString(),
        )} words across all languages`,
      );
      console.log(
        `  (Words are counted from source language for keys that need translation in target languages)`,
      );

      // Breakdown by language if we have multiple languages
      if (targetLocales.length > 1) {
        console.log(`• Per-language breakdown:`);
        for (const locale of targetLocales) {
          const words = totalWordCount.get(locale) || 0;
          const percent = ((words / totalWordsToTranslate) * 100).toFixed(1);
          console.log(
            `  - ${locale}: ~${words.toLocaleString()} words (${percent}% of total)`,
          );
        }
      }

      // Detailed stats if flags.confirm is specified
      if (flags.confirm && Object.keys(fileStats).length > 0) {
        console.log(chalk.bold(`\n📑 BREAKDOWN BY FILE:`));

        Object.entries(fileStats)
          .sort((a, b) => b[1].wordCount - a[1].wordCount) // Sort by word count
          .forEach(([path, stats]) => {
            // Skip files with no source keys
            if (stats.sourceKeys === 0) return;

            console.log(chalk.bold(`\n• ${path}:`));
            console.log(
              `  ${
                stats.sourceKeys
              } source keys, ~${stats.wordCount.toLocaleString()} source words`,
            );

            // Create file detail table
            const fileTable = new Table({
              head: ["Language", "Status", "Details"],
              style: {
                head: ["white"],
                border: [],
              },
              colWidths: [12, 20, 50], // Explicit column widths for file detail table
            });

            for (const locale of targetLocales) {
              const langStats = stats.languageStats[locale];
              const complete = langStats.complete;
              const total = stats.sourceKeys;
              const completion = ((complete / total) * 100).toFixed(1);

              let status = "✅ Complete";
              let statusColor = chalk.green;

              if (langStats.missing === total) {
                status = "❌ Not started";
                statusColor = chalk.red;
              } else if (langStats.missing > 0 || langStats.updated > 0) {
                status = `⚠️ ${completion}% complete`;
                statusColor = chalk.yellow;
              }

              // Show counts only if there's something missing or updated
              let details = "";
              if (langStats.missing > 0 || langStats.updated > 0) {
                const parts = [];
                if (langStats.missing > 0)
                  parts.push(`${langStats.missing} missing`);
                if (langStats.updated > 0)
                  parts.push(`${langStats.updated} changed`);
                details = `${parts.join(", ")}, ~${langStats.words} words`;
              } else {
                details = "All keys translated";
              }

              fileTable.push([locale, statusColor(status), details]);
            }

            console.log(fileTable.toString());
          });
      }

      // Find fully translated and missing languages
      const completeLanguages = targetLocales.filter(
        (locale) =>
          languageStats[locale].missing === 0 &&
          languageStats[locale].updated === 0,
      );

      const missingLanguages = targetLocales.filter(
        (locale) => languageStats[locale].complete === 0,
      );

      // Add optimization tips
      console.log(chalk.bold.green(`\n💡 OPTIMIZATION TIPS:`));

      if (missingLanguages.length > 0) {
        console.log(
          `• ${chalk.yellow(missingLanguages.join(", "))} ${
            missingLanguages.length === 1 ? "has" : "have"
          } no translations yet`,
        );
      }

      if (completeLanguages.length > 0) {
        console.log(
          `• ${chalk.green(completeLanguages.join(", "))} ${
            completeLanguages.length === 1 ? "is" : "are"
          } completely translated`,
        );
      }

      // Other tips
      if (targetLocales.length > 1) {
        console.log(`• Translating one language at a time reduces complexity`);
        console.log(
          `• Try 'lingo.dev@latest i18n --locale ${targetLocales[0]}' to process just one language`,
        );
      }

      // Track successful completion
      trackEvent(authId || "status", "cmd.status.success", {
        i18nConfig,
        flags,
        totalSourceKeyCount,
        languageStats,
        totalWordsToTranslate,
        authenticated: !!authId,
      });
    } catch (error: any) {
      ora.fail(error.message);
      trackEvent(authId || "status", "cmd.status.error", {
        flags,
        error: error.message,
        authenticated: !!authId,
      });
      process.exit(1);
    }
  });

function parseFlags(options: any) {
  return Z.object({
    locale: Z.array(localeCodeSchema).optional(),
    bucket: Z.array(bucketTypeSchema).optional(),
    force: Z.boolean().optional(),
    confirm: Z.boolean().optional(),
    verbose: Z.boolean().optional(),
    file: Z.array(Z.string()).optional(),
    apiKey: Z.string().optional(),
  }).parse(options);
}

async function tryAuthenticate(settings: ReturnType<typeof getSettings>) {
  if (!settings.auth.apiKey) {
    return null;
  }

  try {
    const authenticator = createAuthenticator({
      apiKey: settings.auth.apiKey,
      apiUrl: settings.auth.apiUrl,
    });
    const user = await authenticator.whoami();
    return user;
  } catch (error) {
    return null;
  }
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
    flags.locale?.some((locale) => !i18nConfig.locale.targets.includes(locale))
  ) {
    throw new CLIError({
      message: `One or more specified locales do not exist in i18n.json locale.targets. Please add them to the list and try again.`,
      docUrl: "localeTargetNotFound",
    });
  } else if (
    flags.bucket?.some(
      (bucket) =>
        !i18nConfig.buckets[bucket as keyof typeof i18nConfig.buckets],
    )
  ) {
    throw new CLIError({
      message: `One or more specified buckets do not exist in i18n.json. Please add them to the list and try again.`,
      docUrl: "bucketNotFound",
    });
  }
}

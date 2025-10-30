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
import { exitGracefully } from "../utils/exit-gracefully";

// --- Types
interface LanguageStats {
  complete: number;
  missing: number;
  updated: number;
  words: number;
}

interface FileLangStats {
  complete: number;
  missing: number;
  updated: number;
  words: number;
}

// --- Helpers
const formatPercent = (num: number, denom: number) =>
  denom === 0 ? "0.0" : ((num / denom) * 100).toFixed(1);

const plural = (n: number, singular: string, pluralForm?: string) =>
  `${n} ${n === 1 ? singular : pluralForm ?? singular + "s"}`;

const buildTable = (head: string[], colWidths?: number[]) =>
  new Table({ head, style: { head: ["white"], border: [] }, colWidths });

// --- Main command
export default new Command()
  .command("status")
  .description("Show the status of the localization process")
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
    "--file [files...]",
    "Filter the status report to only include files whose paths contain these substrings. Example: 'components' to match any file path containing 'components'",
  )
  .option(
    "--force",
    "Force all keys to be counted as needing translation, bypassing change detection. Shows word estimates for a complete retranslation regardless of current translation status",
  )
  .option(
    "--verbose",
    "Print detailed output showing missing and updated key counts with example key names for each file and locale",
  )
  .option(
    "--api-key <api-key>",
    "Override the API key from settings or environment variables for this run",
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

      // Authentication (best-effort)
      try {
        ora.start("Checking authentication status...");
        const auth = await tryAuthenticate(settings);
        if (auth) {
          authId = auth.id;
          ora.succeed(`Authenticated as ${auth.email}`);
        } else {
          ora.info(
            "Not authenticated. Continuing without authentication. (Run `lingo.dev login` to authenticate)",
          );
        }
      } catch (err) {
        ora.info("Authentication failed. Continuing without authentication.");
      }

      ora.start("Validating localization configuration...");
      validateParams(i18nConfig, flags);
      ora.succeed("Localization configuration is valid");

      trackEvent(authId || "status", "cmd.status.start", { i18nConfig, flags });

      // Filter buckets
      let buckets = getBuckets(i18nConfig!);
      if (flags.bucket?.length) {
        buckets = buckets.filter((b: any) => flags.bucket!.includes(b.type));
      }

      if (flags.file?.length) {
        buckets = buckets
          .map((bucket: any) => {
            const paths = bucket.paths.filter((p: any) =>
              flags.file!.some((f) =>
                p.pathPattern?.includes(f) || p.pathPattern?.match(f) || minimatch(p.pathPattern, f),
              ),
            );
            return { ...bucket, paths };
          })
          .filter((b: any) => b.paths.length > 0);

        if (buckets.length === 0) {
          ora.fail("No buckets found. All buckets were filtered out by --file option.");
          process.exit(1);
        } else {
          ora.info(`\x1b[36mProcessing only filtered buckets:\x1b[0m`);
          buckets.forEach((bucket: any) => {
            ora.info(`  ${bucket.type}:`);
            bucket.paths.forEach((p: any) => ora.info(`    - ${p.pathPattern}`));
          });
        }
      }

      const targetLocales = flags.locale?.length ? flags.locale : i18nConfig!.locale.targets;

      // Initialize global tracking
      let totalSourceKeyCount = 0;
      const totalWordCount = new Map<string, number>();
      const languageStats: Record<string, LanguageStats> = {};
      const fileStats: Record<string, { path: string; sourceKeys: number; wordCount: number; languageStats: Record<string, FileLangStats>; }> = {};

      for (const locale of targetLocales) {
        languageStats[locale] = { complete: 0, missing: 0, updated: 0, words: 0 };
        totalWordCount.set(locale, 0);
      }

      // Process each bucket and file
      for (const bucket of buckets) {
        try {
          console.log();
          ora.info(`Analyzing bucket: ${bucket.type}`);

          for (const bucketPath of bucket.paths) {
            const bucketOra = Ora({ indent: 2 }).info(`Analyzing path: ${bucketPath.pathPattern}`);

            const sourceLocale = resolveOverriddenLocale(i18nConfig!.locale.source, bucketPath.delimiter);
            const bucketLoader = createBucketLoader(
              bucket.type,
              bucketPath.pathPattern,
              { defaultLocale: sourceLocale, injectLocale: bucket.injectLocale, formatter: i18nConfig!.formatter },
              bucket.lockedKeys,
              bucket.lockedPatterns,
              bucket.ignoredKeys,
            );

            bucketLoader.setDefaultLocale(sourceLocale);
            await bucketLoader.init();

            const filePath = bucketPath.pathPattern;
            if (!fileStats[filePath]) {
              fileStats[filePath] = { path: filePath, sourceKeys: 0, wordCount: 0, languageStats: {} };
              for (const locale of targetLocales) {
                fileStats[filePath].languageStats[locale] = { complete: 0, missing: 0, updated: 0, words: 0 };
              }
            }

            const sourceData = await bucketLoader.pull(sourceLocale);
            const sourceKeys = Object.keys(sourceData || {});
            fileStats[filePath].sourceKeys = sourceKeys.length;
            totalSourceKeyCount += sourceKeys.length;

            // Count words in source
            let sourceWordCount = 0;
            for (const key of sourceKeys) {
              const value = sourceData[key];
              if (typeof value === "string") sourceWordCount += value.trim().split(/\s+/).length;
            }
            fileStats[filePath].wordCount = sourceWordCount;

            // Per-target locale processing
            for (const _targetLocale of targetLocales) {
              const targetLocale = resolveOverriddenLocale(_targetLocale, bucketPath.delimiter);
              bucketOra.start(`[${sourceLocale} -> ${targetLocale}] Analyzing translation status...`);

              let targetData = {};
              let fileExists = true;

              try {
                targetData = await bucketLoader.pull(targetLocale);
              } catch (err) {
                fileExists = false;
                bucketOra.info(`[${sourceLocale} -> ${targetLocale}] Target file not found, assuming all keys need translation.`);
              }

              if (!fileExists) {
                // Everything missing
                fileStats[filePath].languageStats[_targetLocale].missing = sourceKeys.length;
                fileStats[filePath].languageStats[_targetLocale].words = sourceWordCount;

                languageStats[_targetLocale].missing += sourceKeys.length;
                languageStats[_targetLocale].words += sourceWordCount;
                totalWordCount.set(_targetLocale, (totalWordCount.get(_targetLocale) || 0) + sourceWordCount);

                bucketOra.succeed(`[${sourceLocale} -> ${targetLocale}] ${chalk.red(`0% complete`)} (0/${sourceKeys.length} keys) - file not found`);
                continue;
              }

              // Delta calculation
              const deltaProcessor = createDeltaProcessor(bucketPath.pathPattern);
              const checksums = await deltaProcessor.loadChecksums();
              const delta = await deltaProcessor.calculateDelta({ sourceData, targetData, checksums });

              const missingKeys = delta.added;
              const updatedKeys = delta.updated;
              const completeKeys = sourceKeys.filter((k) => !missingKeys.includes(k) && !updatedKeys.includes(k));

              // Words to translate
              let wordsToTranslate = 0;
              const keysToProcess = flags.force ? sourceKeys : [...missingKeys, ...updatedKeys];
              for (const key of keysToProcess) {
                const v = sourceData[String(key)];
                if (typeof v === "string") wordsToTranslate += v.trim().split(/\s+/).length;
              }

              // Update stats
              const fLangStats = fileStats[filePath].languageStats[_targetLocale];
              fLangStats.missing = missingKeys.length;
              fLangStats.updated = updatedKeys.length;
              fLangStats.complete = completeKeys.length;
              fLangStats.words = wordsToTranslate;

              languageStats[_targetLocale].missing += missingKeys.length;
              languageStats[_targetLocale].updated += updatedKeys.length;
              languageStats[_targetLocale].complete += completeKeys.length;
              languageStats[_targetLocale].words += wordsToTranslate;

              totalWordCount.set(_targetLocale, (totalWordCount.get(_targetLocale) || 0) + wordsToTranslate);

              // Print file-level progress
              const totalKeysInFile = sourceKeys.length;
              const completionPercent = formatPercent(completeKeys.length, totalKeysInFile);

              if (missingKeys.length === 0 && updatedKeys.length === 0) {
                bucketOra.succeed(`[${sourceLocale} -> ${targetLocale}] ${chalk.green(`100% complete`)} (${completeKeys.length}/${totalKeysInFile} keys)`);
              } else {
                const message = `[${sourceLocale} -> ${targetLocale}] ${parseFloat(completionPercent) > 50 ? chalk.yellow(`${completionPercent}% complete`) : chalk.red(`${completionPercent}% complete`)} (${completeKeys.length}/${totalKeysInFile} keys)`;
                bucketOra.succeed(message);

                if (flags.verbose) {
                  if (missingKeys.length > 0) {
                    console.log(`    ${chalk.red(`Missing:`)} ${missingKeys.length} keys, ~${wordsToTranslate} words`);
                    console.log(`    ${chalk.dim(`Example missing: ${missingKeys.slice(0, 2).join(", ")}${missingKeys.length > 2 ? "..." : ""}`)}`);
                  }
                  if (updatedKeys.length > 0) {
                    console.log(`    ${chalk.yellow(`Updated:`)} ${updatedKeys.length} keys that changed in source`);
                  }
                }
              }
            }
          }
        } catch (error: any) {
          ora.fail(`Failed to analyze bucket ${bucket.type}: ${error.message}`);
        }
      }

      // Post-processing summary
      const totalKeysNeedingTranslation = Object.values(languageStats).reduce((s, st) => s + st.missing + st.updated, 0);
      const totalCompletedKeys = totalSourceKeyCount - totalKeysNeedingTranslation / targetLocales.length;

      console.log();
      ora.succeed(chalk.green(`Localization status completed.`));

      // Header
      console.log(chalk.bold.cyan(`\n╔════════════════════════════════════╗`));
      console.log(chalk.bold.cyan(`║   LOCALIZATION STATUS REPORT       ║`));
      console.log(chalk.bold.cyan(`╚════════════════════════════════════╝`));

      // Source overview
      console.log(chalk.bold(`\n📝 SOURCE CONTENT:`));
      console.log(`• Source language: ${chalk.green(i18nConfig!.locale.source)}`);
      console.log(`• Source keys: ${chalk.yellow(totalSourceKeyCount.toString())} keys across all files`);

      // Language table
      console.log(chalk.bold(`\n🌐 LANGUAGE BY LANGUAGE BREAKDOWN:`));
      const table = buildTable(["Language", "Status", "Complete", "Missing", "Updated", "Total Keys", "Words to Translate"], [12, 20, 18, 12, 12, 12, 15]);

      let totalWordsToTranslate = 0;
      for (const locale of targetLocales) {
        const stats = languageStats[locale];
        const percentComplete = formatPercent(stats.complete, totalSourceKeyCount);
        const totalNeeded = stats.missing + stats.updated;

        let statusText = "🔴 Not started";
        let statusColor = chalk.red;
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
        }

        const words = totalWordCount.get(locale) || 0;
        totalWordsToTranslate += words;

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

      console.log(table.toString());

      // Usage estimate
      console.log(chalk.bold(`\n📊 USAGE ESTIMATE:`));
      console.log(`• WORDS TO BE CONSUMED: ~${chalk.yellow.bold(totalWordsToTranslate.toLocaleString())} words across all languages`);
      console.log(`  (Words are counted from source language for keys that need translation in target languages)`);

      // Per-language breakdown (guard against division by zero)
      if (targetLocales.length > 1) {
        console.log(`• Per-language breakdown:`);
        for (const locale of targetLocales) {
          const words = totalWordCount.get(locale) || 0;
          const percent = formatPercent(words, totalWordsToTranslate);
          console.log(`  - ${locale}: ~${words.toLocaleString()} words (${percent}% of total)`);
        }
      }

      // Detailed file breakdown when requested
      if (flags.confirm && Object.keys(fileStats).length > 0) {
        console.log(chalk.bold(`\n📑 BREAKDOWN BY FILE:`));
        Object.entries(fileStats)
          .sort((a, b) => b[1].wordCount - a[1].wordCount)
          .forEach(([p, stats]) => {
            if (stats.sourceKeys === 0) return;
            console.log(chalk.bold(`\n• ${p}:`));
            console.log(`  ${stats.sourceKeys} source keys, ~${stats.wordCount.toLocaleString()} source words`);

            const fileTable = buildTable(["Language", "Status", "Details"], [12, 20, 50]);

            for (const locale of targetLocales) {
              const langStats = stats.languageStats[locale];
              const complete = langStats.complete;
              const total = stats.sourceKeys;
              const completion = formatPercent(complete, total);

              let status = "✅ Complete";
              let statusColor = chalk.green;

              if (langStats.missing === total) {
                status = "❌ Not started";
                statusColor = chalk.red;
              } else if (langStats.missing > 0 || langStats.updated > 0) {
                status = `⚠️ ${completion}% complete`;
                statusColor = chalk.yellow;
              }

              let details = "All keys translated";
              if (langStats.missing > 0 || langStats.updated > 0) {
                const parts: string[] = [];
                if (langStats.missing > 0) parts.push(`${langStats.missing} missing`);
                if (langStats.updated > 0) parts.push(`${langStats.updated} changed`);
                details = `${parts.join(", ")}, ~${langStats.words} words`;
              }

              fileTable.push([locale, statusColor(status), details]);
            }

            console.log(fileTable.toString());
          });
      }

      // Final tips & tracking
      const completeLanguages = targetLocales.filter((l) => languageStats[l].missing === 0 && languageStats[l].updated === 0);
      const missingLanguages = targetLocales.filter((l) => languageStats[l].complete === 0);

      console.log(chalk.bold.green(`\n💡 OPTIMIZATION TIPS:`));

      if (missingLanguages.length > 0) {
        console.log(`• ${chalk.yellow(missingLanguages.join(", "))} ${missingLanguages.length === 1 ? "has" : "have"} no translations yet`);
      }

      if (completeLanguages.length > 0) {
        console.log(`• ${chalk.green(completeLanguages.join(", "))} ${completeLanguages.length === 1 ? "is" : "are"} completely translated`);
      }

      if (targetLocales.length > 1) {
        console.log(`• Translating one language at a time reduces complexity`);
        console.log(`• Try 'lingo.dev@latest i18n --locale ${targetLocales[0]}' to process just one language`);
      }

      trackEvent(authId || "status", "cmd.status.success", { i18nConfig, flags, totalSourceKeyCount, languageStats, totalWordsToTranslate, authenticated: !!authId });
      exitGracefully();
    } catch (error: any) {
      ora.fail(error.message);
      trackEvent(authId || "status", "cmd.status.error", { flags, error: error.message, authenticated: !!authId });
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
  if (!settings.auth.apiKey) return null;
  try {
    const authenticator = createAuthenticator({ apiKey: settings.auth.apiKey, apiUrl: settings.auth.apiUrl });
    const user = await authenticator.whoami();
    return user;
  } catch (error) {
    return null;
  }
}

function validateParams(i18nConfig: I18nConfig | null, flags: ReturnType<typeof parseFlags>) {
  if (!i18nConfig) {
    throw new CLIError({ message: "i18n.json not found. Please run `lingo.dev init` to initialize the project.", docUrl: "i18nNotFound", });
  } else if (!i18nConfig.buckets || !Object.keys(i18nConfig.buckets).length) {
    throw new CLIError({ message: "No buckets found in i18n.json. Please add at least one bucket containing i18n content.", docUrl: "bucketNotFound", });
  } else if (flags.locale?.some((locale) => !i18nConfig.locale.targets.includes(locale))) {
    throw new CLIError({ message: `One or more specified locales do not exist in i18n.json locale.targets. Please add them to the list and try again.`, docUrl: "localeTargetNotFound", });
  } else if (flags.bucket?.some((bucket) => !i18nConfig.buckets[bucket as keyof typeof i18nConfig.buckets])) {
    throw new CLIError({ message: `One or more specified buckets do not exist in i18n.json. Please add them to the list and try again.`, docUrl: "bucketNotFound", });
  }
}

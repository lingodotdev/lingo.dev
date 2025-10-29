import { Command } from "interactive-commander";
import _ from "lodash";
import Ora from "ora";
import { minimatch } from "minimatch";
import { getConfig } from "../../utils/config";
import { CLIError } from "../../utils/errors";
import { getBuckets } from "../../utils/buckets";
import { resolveOverriddenLocale } from "@lingo.dev/_spec";

export default new Command()
  .command("files")
  .description(
    "Expand each bucket's path pattern into concrete source and target file paths",
  )
  .option(
    "--source",
    "Only list the source locale variant for each path pattern",
  )
  .option(
    "--target",
    "Only list the target locale variants for each configured locale",
  )
  .option(
    "--bucket <bucket>",
    "Limit processing to specific bucket types defined in i18n.json (e.g., json, yaml, android). Repeat the flag to include multiple bucket types. Defaults to all configured buckets",
    (val: string, prev: string[]) => (prev ? [...prev, val] : [val]),
  )
  .option(
    "--target-locale <target-locale>",
    "Limit processing to the listed target locale codes from i18n.json. Repeat the flag to include multiple locales. Defaults to all configured target locales",
    (val: string, prev: string[]) => (prev ? [...prev, val] : [val]),
  )
  .option(
    "--file <file>",
    "Filter bucket path pattern values by substring match. Examples: messages.json or locale/. Repeat to add multiple filters",
    (val: string, prev: string[]) => (prev ? [...prev, val] : [val]),
  )
  .helpOption("-h, --help", "Show help")
  .action(async (type) => {
    const ora = Ora();
    try {
      try {
        const i18nConfig = await getConfig();

        if (!i18nConfig) {
          throw new CLIError({
            message:
              "i18n.json not found. Please run `lingo.dev init` to initialize the project.",
            docUrl: "i18nNotFound",
          });
        }

        // Get all buckets and apply bucket filter if specified
        let buckets = getBuckets(i18nConfig);
        if (type.bucket) {
          buckets = buckets.filter((b) => type.bucket.includes(b.type));
        }

        // Apply target-locale filter if specified
        const targetLocales = type.targetLocale || i18nConfig.locale.targets;

        for (const bucket of buckets) {
          for (const bucketConfig of bucket.paths) {
            // Apply file filter if specified
            if (type.file) {
              const matchesFilter = type.file.some(
                (f: string) =>
                  bucketConfig.pathPattern.includes(f) ||
                  minimatch(bucketConfig.pathPattern, f),
              );
              if (!matchesFilter) {
                continue;
              }
            }

            const sourceLocale = resolveOverriddenLocale(
              i18nConfig.locale.source,
              bucketConfig.delimiter,
            );
            const sourcePath = bucketConfig.pathPattern.replace(
              /\[locale\]/g,
              sourceLocale,
            );
            const targetPaths = targetLocales.map(
              (_targetLocale: string) => {
                const targetLocale = resolveOverriddenLocale(
                  _targetLocale,
                  bucketConfig.delimiter,
                );
                return bucketConfig.pathPattern.replace(
                  /\[locale\]/g,
                  targetLocale,
                );
              },
            );

            const result: string[] = [];
            if (!type.source && !type.target) {
              result.push(sourcePath, ...targetPaths);
            } else if (type.source) {
              result.push(sourcePath);
            } else if (type.target) {
              result.push(...targetPaths);
            }

            result.forEach((path) => {
              console.log(path);
            });
          }
        }
      } catch (error: any) {
        throw new CLIError({
          message: `Failed to expand placeholdered globs: ${error.message}`,
          docUrl: "placeHolderFailed",
        });
      }
    } catch (error: any) {
      ora.fail(error.message);
      process.exit(1);
    }
  });

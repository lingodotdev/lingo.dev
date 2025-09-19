import { Command } from "interactive-commander";
import _ from "lodash";
import Ora from "ora";
import { getConfig } from "../../utils/config";
import { CLIError } from "../../utils/errors";
import { getBuckets } from "../../utils/buckets";
import { resolveOverriddenLocale } from "@lingo.dev/_spec";

export default new Command()
  .command("files")
  .description(
    "Expand each bucket's pathPattern into concrete source and target file paths",
  )
  .option(
    "--source",
    "Only list the source locale variant for each pathPattern.",
  )
  .option(
    "--target",
    "Only list the target locale variants for each configured locale.",
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

        const buckets = getBuckets(i18nConfig);
        for (const bucket of buckets) {
          for (const bucketConfig of bucket.paths) {
            const sourceLocale = resolveOverriddenLocale(
              i18nConfig.locale.source,
              bucketConfig.delimiter,
            );
            const sourcePath = bucketConfig.pathPattern.replace(
              /\[locale\]/g,
              sourceLocale,
            );
            const targetPaths = i18nConfig.locale.targets.map(
              (_targetLocale) => {
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

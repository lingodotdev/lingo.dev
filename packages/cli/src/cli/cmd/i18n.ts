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
import { createTwoFilesPatch } from "diff";
import inquirer from "inquirer";
import externalEditor from "external-editor";
import updateGitignore from "../utils/update-gitignore";
import createProcessor from "../processor";
import { withExponentialBackoff } from "../utils/exp-backoff";
import trackEvent from "../utils/observability";
import { createDeltaProcessor } from "../utils/delta";

export default new Command()
  .command("i18n")
  .description("Run Localization engine")
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
    "--key <key>",
    "Key to process. Process only a specific translation key, useful for debugging or updating a single entry",
  )
  .option(
    "--file [files...]",
    "File to process. Process only a specific path, may contain asterisk * to match multiple files. Useful if you have a lot of files and want to focus on a specific one. Specify more files separated by commas or spaces.",
  )
  .option(
    "--frozen",
    `Run in read-only mode - fails if any translations need updating, useful for CI/CD pipelines to detect missing translations`,
  )
  .option(
    "--force",
    "Ignore lockfile and process all keys, useful for full re-translation",
  )
  .option(
    "--verbose",
    "Show detailed output including intermediate processing data and API communication details",
  )
  .option(
    "--interactive",
    "Enable interactive mode for reviewing and editing translations before they are applied",
  )
  .option(
    "--api-key <api-key>",
    "Explicitly set the API key to use, override the default API key from settings",
  )
  .option(
    "--debug",
    "Pause execution at start for debugging purposes, waits for user confirmation before proceeding",
  )
  .option(
    "--strict",
    "Stop processing on first error instead of continuing with other locales/buckets",
  )
  .action(async function (options) {
    updateGitignore();

    const ora = Ora();
    const flags = parseFlags(options);

    if (flags.debug) {
      // wait for user input, use inquirer
      const { debug } = await inquirer.prompt([
        {
          type: "confirm",
          name: "debug",
          message: "Debug mode. Wait for user input before continuing.",
        },
      ]);
    }

    let hasErrors = false;
    let authId: string | null = null;
    try {
      ora.start("Loading configuration...");
      const i18nConfig = getConfig();
      const settings = getSettings(flags.apiKey);
      ora.succeed("Configuration loaded");

      ora.start("Validating localization configuration...");
      validateParams(i18nConfig, flags);
      ora.succeed("Localization configuration is valid");

      ora.start("Connecting to Lingo.dev Localization Engine...");
      const isByokMode = !!i18nConfig?.provider;

      if (isByokMode) {
        authId = null;
        ora.succeed("Using external provider (BYOK mode)");
      } else {
        const auth = await validateAuth(settings);
        authId = auth.id;
        ora.succeed(`Authenticated as ${auth.email}`);
      }

      await trackEvent(authId, "cmd.i18n.start", {
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
              flags.file!.find((file) => path.pathPattern?.includes(file)),
            );
            return { ...bucket, paths };
          })
          .filter((bucket: any) => bucket.paths.length > 0);
        if (buckets.length === 0) {
          ora.fail(
            "No buckets found. All buckets were filtered out by --file option.",
          );
          throw new Error(
            "No buckets found. All buckets were filtered out by --file option.",
          );
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

      // Ensure the lockfile exists
      ora.start("Setting up localization cache...");
      const checkLockfileProcessor = createDeltaProcessor("");
      const lockfileExists = await checkLockfileProcessor.checkIfLockExists();
      if (!lockfileExists) {
        ora.start("Creating i18n.lock...");
        for (const bucket of buckets) {
          for (const bucketPath of bucket.paths) {
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
              bucket.lockedPatterns,
              bucket.ignoredKeys,
            );
            bucketLoader.setDefaultLocale(sourceLocale);
            await bucketLoader.init();

            const sourceData = await bucketLoader.pull(
              i18nConfig!.locale.source,
            );

            const deltaProcessor = createDeltaProcessor(bucketPath.pathPattern);
            const checksums = await deltaProcessor.createChecksums(sourceData);
            await deltaProcessor.saveChecksums(checksums);
          }
        }
        ora.succeed("Localization cache initialized");
      } else {
        ora.succeed("Localization cache loaded");
      }

      if (flags.frozen) {
        ora.start("Checking for lockfile updates...");
        let requiresUpdate: string | null = null;
        bucketLoop: for (const bucket of buckets) {
          for (const bucketPath of bucket.paths) {
            const sourceLocale = resolveOverriddenLocale(
              i18nConfig!.locale.source,
              bucketPath.delimiter,
            );

            const bucketLoader = createBucketLoader(
              bucket.type,
              bucketPath.pathPattern,
              {
                defaultLocale: sourceLocale,
                returnUnlocalizedKeys: true,
                injectLocale: bucket.injectLocale,
              },
              bucket.lockedKeys,
            );
            bucketLoader.setDefaultLocale(sourceLocale);
            await bucketLoader.init();

            const { unlocalizable: sourceUnlocalizable, ...sourceData } =
              await bucketLoader.pull(i18nConfig!.locale.source);
            const deltaProcessor = createDeltaProcessor(bucketPath.pathPattern);
            const sourceChecksums =
              await deltaProcessor.createChecksums(sourceData);
            const savedChecksums = await deltaProcessor.loadChecksums();

            // Get updated data by comparing current checksums with saved checksums
            const updatedSourceData = _.pickBy(
              sourceData,
              (value, key) => sourceChecksums[key] !== savedChecksums[key],
            );

            // translation was updated in the source file
            if (Object.keys(updatedSourceData).length > 0) {
              requiresUpdate = "updated";
              break bucketLoop;
            }

            for (const _targetLocale of targetLocales) {
              const targetLocale = resolveOverriddenLocale(
                _targetLocale,
                bucketPath.delimiter,
              );
              const { unlocalizable: targetUnlocalizable, ...targetData } =
                await bucketLoader.pull(targetLocale);

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

              // translation is missing in the target file
              if (missingKeys.length > 0) {
                requiresUpdate = "missing";
                break bucketLoop;
              }

              // target file has extra translations
              if (extraKeys.length > 0) {
                requiresUpdate = "extra";
                break bucketLoop;
              }

              // unlocalizable keys do not match
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
          ora.fail(
            `Localization data has changed; please update i18n.lock or run without --frozen.`,
          );
          ora.fail(`  Details: ${message}`);
          throw new Error(
            `Localization data has changed; please update i18n.lock or run without --frozen. Details: ${message}`,
          );
        } else {
          ora.succeed("No lockfile updates required.");
        }
      }

      // Process each bucket
      for (const bucket of buckets) {
        try {
          console.log();
          ora.info(`Processing bucket: ${bucket.type}`);
          for (const bucketPath of bucket.paths) {
            const bucketOra = Ora({ indent: 2 }).info(
              `Processing path: ${bucketPath.pathPattern}`,
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
              bucket.lockedPatterns,
              bucket.ignoredKeys,
            );
            bucketLoader.setDefaultLocale(sourceLocale);
            await bucketLoader.init();
            let sourceData = await bucketLoader.pull(sourceLocale);

            for (const _targetLocale of targetLocales) {
              const targetLocale = resolveOverriddenLocale(
                _targetLocale,
                bucketPath.delimiter,
              );
              try {
                bucketOra.start(
                  `[${sourceLocale} -> ${targetLocale}] (0%) Localization in progress...`,
                );

                sourceData = await bucketLoader.pull(sourceLocale);

                const targetData = await bucketLoader.pull(targetLocale);
                const deltaProcessor = createDeltaProcessor(
                  bucketPath.pathPattern,
                );
                const checksums = await deltaProcessor.loadChecksums();
                const delta = await deltaProcessor.calculateDelta({
                  sourceData,
                  targetData,
                  checksums,
                });
                let processableData = _.chain(sourceData)
                  .entries()
                  .filter(
                    ([key, value]) =>
                      delta.added.includes(key) ||
                      delta.updated.includes(key) ||
                      !!flags.force,
                  )
                  .fromPairs()
                  .value();

                if (flags.key) {
                  processableData = _.pickBy(
                    processableData,
                    (_, key) => key === flags.key,
                  );
                }
                if (flags.verbose) {
                  bucketOra.info(JSON.stringify(processableData, null, 2));
                }

                bucketOra.start(
                  `[${sourceLocale} -> ${targetLocale}] [${
                    Object.keys(processableData).length
                  } entries] (0%) AI localization in progress...`,
                );
                let processPayload = createProcessor(i18nConfig!.provider, {
                  apiKey: settings.auth.apiKey,
                  apiUrl: settings.auth.apiUrl,
                });
                processPayload = withExponentialBackoff(
                  processPayload,
                  3,
                  1000,
                );

                const processedTargetData = await processPayload(
                  {
                    sourceLocale,
                    sourceData,
                    processableData,
                    targetLocale,
                    targetData,
                  },
                  (progress, sourceChunk, processedChunk) => {
                    bucketOra.text = `[${sourceLocale} -> ${targetLocale}] [${
                      Object.keys(processableData).length
                    } entries] (${progress}%) AI localization in progress...`;
                  },
                );

                if (flags.verbose) {
                  bucketOra.info(JSON.stringify(processedTargetData, null, 2));
                }

                let finalTargetData = _.merge(
                  {},
                  sourceData,
                  targetData,
                  processedTargetData,
                );

                // rename keys
                finalTargetData = _.chain(finalTargetData)
                  .entries()
                  .map(([key, value]) => {
                    const renaming = delta.renamed.find(
                      ([oldKey, newKey]) => oldKey === key,
                    );
                    if (!renaming) {
                      return [key, value];
                    }
                    return [renaming[1], value];
                  })
                  .fromPairs()
                  .value();

                if (flags.interactive) {
                  bucketOra.stop();
                  const reviewedData = await reviewChanges({
                    pathPattern: bucketPath.pathPattern,
                    targetLocale,
                    currentData: targetData,
                    proposedData: finalTargetData,
                    sourceData,
                    force: flags.force!,
                  });

                  finalTargetData = reviewedData;
                  bucketOra.start(
                    `Applying changes to ${bucketPath} (${targetLocale})`,
                  );
                }

                const finalDiffSize = _.chain(finalTargetData)
                  .omitBy((value, key) => value === targetData[key])
                  .size()
                  .value();

                // Push to bucket all the time as there might be changes to unlocalizable keys
                await bucketLoader.push(targetLocale, finalTargetData);

                if (finalDiffSize > 0 || flags.force) {
                  bucketOra.succeed(
                    `[${sourceLocale} -> ${targetLocale}] Localization completed`,
                  );
                } else {
                  bucketOra.succeed(
                    `[${sourceLocale} -> ${targetLocale}] Localization completed (no changes).`,
                  );
                }
              } catch (_error: any) {
                const error = new Error(
                  `[${sourceLocale} -> ${targetLocale}] Localization failed: ${_error.message}`,
                );
                if (flags.strict) {
                  throw error;
                } else {
                  bucketOra.fail(error.message);
                  hasErrors = true;
                }
              }
            }

            const deltaProcessor = createDeltaProcessor(bucketPath.pathPattern);
            const checksums = await deltaProcessor.createChecksums(sourceData);
            if (!flags.locale?.length) {
              await deltaProcessor.saveChecksums(checksums);
            }
          }
        } catch (_error: any) {
          const error = new Error(
            `Failed to process bucket ${bucket.type}: ${_error.message}`,
          );
          if (flags.strict) {
            throw error;
          } else {
            ora.fail(error.message);
            hasErrors = true;
          }
        }
      }
      console.log();
      if (!hasErrors) {
        ora.succeed("Localization completed.");
        await trackEvent(authId, "cmd.i18n.success", {
          i18nConfig,
          flags,
        });
      } else {
        ora.warn("Localization completed with errors.");
        await trackEvent(authId || "unknown", "cmd.i18n.error", {
          flags,
        });
      }
    } catch (error: any) {
      ora.fail(error.message);

      await trackEvent(authId || "unknown", "cmd.i18n.error", {
        flags,
        error,
      });
    }
  });

function parseFlags(options: any) {
  return Z.object({
    apiKey: Z.string().optional(),
    locale: Z.array(localeCodeSchema).optional(),
    bucket: Z.array(bucketTypeSchema).optional(),
    force: Z.boolean().optional(),
    frozen: Z.boolean().optional(),
    verbose: Z.boolean().optional(),
    strict: Z.boolean().optional(),
    key: Z.string().optional(),
    file: Z.array(Z.string()).optional(),
    interactive: Z.boolean().default(false),
    debug: Z.boolean().default(false),
  }).parse(options);
}

// Export validateAuth for use in other commands
export async function validateAuth(settings: ReturnType<typeof getSettings>) {
  if (!settings.auth.apiKey) {
    throw new CLIError({
      message:
        "Not authenticated. Please run `lingo.dev login` to authenticate.",
      docUrl: "authError",
    });
  }

  const authenticator = createAuthenticator({
    apiKey: settings.auth.apiKey,
    apiUrl: settings.auth.apiUrl,
  });
  const user = await authenticator.whoami();
  if (!user) {
    throw new CLIError({
      message: "Invalid API key. Please run `lingo.dev login` to authenticate.",
      docUrl: "authError",
    });
  }

  return user;
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

async function reviewChanges(args: {
  pathPattern: string;
  targetLocale: string;
  currentData: Record<string, any>;
  proposedData: Record<string, any>;
  sourceData: Record<string, any>;
  force: boolean;
}): Promise<Record<string, any>> {
  const currentStr = JSON.stringify(args.currentData, null, 2);
  const proposedStr = JSON.stringify(args.proposedData, null, 2);

  // Early return if no changes
  if (currentStr === proposedStr && !args.force) {
    console.log(
      `\n${chalk.blue(args.pathPattern)} (${chalk.yellow(
        args.targetLocale,
      )}): ${chalk.gray("No changes to review")}`,
    );
    return args.proposedData;
  }

  const patch = createTwoFilesPatch(
    `${args.pathPattern} (current)`,
    `${args.pathPattern} (proposed)`,
    currentStr,
    proposedStr,
    undefined,
    undefined,
    { context: 3 },
  );

  // Color the diff output
  const coloredDiff = patch
    .split("\n")
    .map((line) => {
      if (line.startsWith("+")) return chalk.green(line);
      if (line.startsWith("-")) return chalk.red(line);
      if (line.startsWith("@")) return chalk.cyan(line);
      return line;
    })
    .join("\n");

  console.log(
    `\nReviewing changes for ${chalk.blue(args.pathPattern)} (${chalk.yellow(
      args.targetLocale,
    )}):`,
  );
  console.log(coloredDiff);

  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "Choose action:",
      choices: [
        { name: "Approve changes", value: "approve" },
        { name: "Skip changes", value: "skip" },
        { name: "Edit individually", value: "edit" },
      ],
      default: "approve",
    },
  ]);

  if (action === "approve") {
    return args.proposedData;
  }

  if (action === "skip") {
    return args.currentData;
  }

  // If edit was chosen, prompt for each changed value
  const customData = { ...args.currentData };
  const changes = _.reduce(
    args.proposedData,
    (result: string[], value: string, key: string) => {
      if (args.currentData[key] !== value) {
        result.push(key);
      }
      return result;
    },
    [],
  );

  for (const key of changes) {
    console.log(`\nEditing value for: ${chalk.cyan(key)}`);
    console.log(chalk.gray("Source text:"), chalk.blue(args.sourceData[key]));
    console.log(
      chalk.gray("Current value:"),
      chalk.red(args.currentData[key] || "(empty)"),
    );
    console.log(
      chalk.gray("Suggested value:"),
      chalk.green(args.proposedData[key]),
    );
    console.log(
      chalk.gray(
        "\nYour editor will open. Edit the text and save to continue.",
      ),
    );
    console.log(chalk.gray("------------"));

    try {
      // Prepare the editor content with a header comment and the suggested value
      const editorContent = [
        "# Edit the translation below.",
        "# Lines starting with # will be ignored.",
        "# Save and exit the editor to continue.",
        "#",
        `# Source text (${chalk.blue("English")}):`,
        `# ${args.sourceData[key]}`,
        "#",
        `# Current value (${chalk.red(args.targetLocale)}):`,
        `# ${args.currentData[key] || "(empty)"}`,
        "#",
        args.proposedData[key],
      ].join("\n");

      const result = externalEditor.edit(editorContent);

      // Clean up the result by removing comments and trimming
      const customValue = result
        .split("\n")
        .filter((line) => !line.startsWith("#"))
        .join("\n")
        .trim();

      if (customValue) {
        customData[key] = customValue;
      } else {
        console.log(
          chalk.yellow("Empty value provided, keeping the current value."),
        );
        customData[key] = args.currentData[key] || args.proposedData[key];
      }
    } catch (error) {
      console.log(
        chalk.red("Error while editing, keeping the suggested value."),
      );
      customData[key] = args.proposedData[key];
    }
  }

  return customData;
}

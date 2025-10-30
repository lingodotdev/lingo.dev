import {
  bucketTypeSchema,
  I18nConfig,
  localeCodeSchema,
  resolveOverriddenLocale,
} from "@lingo.dev/_spec";
import { Command } from "interactive-commander";
import Z from "zod";
import * as fs from "fs";
import * as path from "path";
import { getConfig } from "../utils/config";
import { getSettings } from "../utils/settings";
import { CLIError } from "../utils/errors";
import createBucketLoader from "../loaders";
import { createAuthenticator } from "../utils/auth";
import { getBuckets } from "../utils/buckets";
import chalk from "chalk";
import { checkIfFileExists } from "../utils/fs";
import trackEvent from "../utils/observability";
import { exitGracefully } from "../utils/exit-gracefully";

export default new Command()
  .command("validate")
  .description("Validate lingo.dev configuration and file accessibility")
  .helpOption("-h, --help", "Show help")
  .option(
    "--strict",
    "Strict mode: missing target files are treated as errors instead of warnings",
  )
  .option(
    "--api-key <api-key>",
    "Override the API key from settings or environment variables for this run",
  )
  .action(async function (options) {
    const flags = parseFlags(options);
    let authId: string | null = null;
    let errorCount = 0;
    let warningCount = 0;
    let checksPassedCount = 0;

    try {
      // Track validation start
      trackEvent("validate", "cmd.validate.start", { flags });

      // 1. Validate configuration file
      const i18nConfig = getConfig();

      if (!i18nConfig) {
        console.log(
          chalk.red("✗") + " Configuration file (i18n.json) not found",
        );
        errorCount++;
        process.exit(1);
      }

      console.log(
        chalk.green("✓") + " Configuration file (i18n.json) exists",
      );
      checksPassedCount++;

      // 2. Check authentication if API key is provided
      if (flags.apiKey || process.env.LINGO_API_KEY) {
        const settings = getSettings(flags.apiKey);

        if (settings.auth.apiKey) {
          try {
            const authenticator = createAuthenticator({
              apiKey: settings.auth.apiKey,
              apiUrl: settings.auth.apiUrl,
            });
            const user = await authenticator.whoami();
            if (user) {
              authId = user.id;
              console.log(
                chalk.green("✓") + ` Authenticated as ${user.email}`,
              );
              checksPassedCount++;
            } else {
              console.log(
                chalk.red("✗") + " Authentication failed: Invalid API key",
              );
              errorCount++;
            }
          } catch (error: any) {
            console.log(
              chalk.red("✗") + ` Authentication failed: ${error.message}`,
            );
            errorCount++;
          }
        }
      }

      // 3. Validate source locale
      try {
        localeCodeSchema.parse(i18nConfig.locale.source);
        console.log(
          chalk.green("✓") + ` Source locale '${i18nConfig.locale.source}' is valid`,
        );
        checksPassedCount++;
      } catch (error) {
        console.log(
          chalk.red("✗") +
            ` Source locale '${i18nConfig.locale.source}' is invalid`,
        );
        errorCount++;
      }

      // 4. Validate target locales
      if (!i18nConfig.locale.targets || i18nConfig.locale.targets.length === 0) {
        console.log(
          chalk.yellow("⚠") + " No target locales defined in i18n.json",
        );
        warningCount++;
      } else {
        let allTargetsValid = true;
        for (const targetLocale of i18nConfig.locale.targets) {
          try {
            localeCodeSchema.parse(targetLocale);
          } catch (error) {
            allTargetsValid = false;
            console.log(
              chalk.red("✗") + ` Target locale '${targetLocale}' is invalid`,
            );
            errorCount++;
          }
        }

        if (allTargetsValid) {
          const localeList = i18nConfig.locale.targets
            .map((l) => `'${l}'`)
            .join(", ");
          console.log(
            chalk.green("✓") + ` Target locales [${localeList}] are valid`,
          );
          checksPassedCount++;
        }
      }

      // 5. Validate buckets
      if (!i18nConfig.buckets || Object.keys(i18nConfig.buckets).length === 0) {
        console.log(chalk.red("✗") + " No buckets defined in i18n.json");
        errorCount++;
        trackEvent(authId || "validate", "cmd.validate.error", {
          flags,
          error: "No buckets defined",
          authenticated: !!authId,
        });
        process.exit(1);
      }

      const buckets = getBuckets(i18nConfig);

      // Check each bucket type is supported
      for (const bucket of buckets) {
        try {
          bucketTypeSchema.parse(bucket.type);
          console.log(
            chalk.green("✓") + ` Bucket type '${bucket.type}' is supported`,
          );
          checksPassedCount++;
        } catch (error) {
          console.log(
            chalk.red("✗") + ` Bucket type '${bucket.type}' is not supported`,
          );
          errorCount++;
        }
      }

      // 6. Validate file paths and accessibility
      let allSourceFilesReadable = true;
      let allTargetDirsWritable = true;

      for (const bucket of buckets) {
        for (const bucketPath of bucket.paths) {
          const sourceLocale = resolveOverriddenLocale(
            i18nConfig.locale.source,
            bucketPath.delimiter,
          );

          try {
            const bucketLoader = createBucketLoader(
              bucket.type,
              bucketPath.pathPattern,
              {
                defaultLocale: sourceLocale,
                injectLocale: bucket.injectLocale,
                formatter: i18nConfig.formatter,
              },
              bucket.lockedKeys,
              bucket.lockedPatterns,
              bucket.ignoredKeys,
            );

            bucketLoader.setDefaultLocale(sourceLocale);
            await bucketLoader.init();

            // Check source file
            const sourceFilePath = path.resolve(
              bucketPath.pathPattern.replaceAll("[locale]", sourceLocale),
            );

            if (checkIfFileExists(sourceFilePath)) {
              try {
                await bucketLoader.pull(sourceLocale);
                fs.accessSync(sourceFilePath, fs.constants.R_OK);
                console.log(
                  chalk.green("✓") + ` Source file exists: ${sourceFilePath}`,
                );
                checksPassedCount++;
              } catch (error) {
                console.log(
                  chalk.red("✗") +
                    ` Source file exists but is not readable: ${sourceFilePath}`,
                );
                errorCount++;
                allSourceFilesReadable = false;
              }
            } else {
              console.log(
                chalk.red("✗") + ` Source file not found: ${sourceFilePath}`,
              );
              errorCount++;
            }

            // Check target files
            const targetLocales = i18nConfig.locale.targets || [];
            for (const _targetLocale of targetLocales) {
              const targetLocale = resolveOverriddenLocale(
                _targetLocale,
                bucketPath.delimiter,
              );
              const targetFilePath = path.resolve(
                bucketPath.pathPattern.replaceAll("[locale]", targetLocale),
              );

              if (checkIfFileExists(targetFilePath)) {
                try {
                  // Check read access
                  fs.accessSync(targetFilePath, fs.constants.R_OK);

                  // Check write access
                  try {
                    fs.accessSync(targetFilePath, fs.constants.W_OK);
                    console.log(
                      chalk.green("✓") +
                        ` Target file exists: ${targetFilePath}`,
                    );
                    checksPassedCount++;
                  } catch (error) {
                    console.log(
                      chalk.red("✗") +
                        ` Target file exists but is not writable: ${targetFilePath}`,
                    );
                    errorCount++;
                    allTargetDirsWritable = false;
                  }
                } catch (error) {
                  console.log(
                    chalk.red("✗") +
                      ` Target file exists but is not readable: ${targetFilePath}`,
                  );
                  errorCount++;
                }
              } else {
                // File doesn't exist - check if directory is writable
                const dir = path.dirname(targetFilePath);

                try {
                  if (checkIfFileExists(dir)) {
                    fs.accessSync(dir, fs.constants.W_OK);

                    if (flags.strict) {
                      console.log(
                        chalk.red("✗") +
                          ` Target file missing: ${targetFilePath} (strict mode)`,
                      );
                      errorCount++;
                    } else {
                      console.log(
                        chalk.yellow("⚠") +
                          ` Target file missing: ${targetFilePath} (will be created)`,
                      );
                      warningCount++;
                    }
                  } else {
                    console.log(
                      chalk.red("✗") +
                        ` Target directory does not exist: ${dir}`,
                    );
                    errorCount++;
                    allTargetDirsWritable = false;
                  }
                } catch (error) {
                  console.log(
                    chalk.red("✗") + ` Target directory is not writable: ${dir}`,
                  );
                  errorCount++;
                  allTargetDirsWritable = false;
                }
              }
            }
          } catch (error: any) {
            console.log(
              chalk.red("✗") +
                ` Failed to initialize bucket loader for '${bucketPath.pathPattern}': ${error.message}`,
            );
            errorCount++;
          }
        }
      }

      // Summary checks
      if (allSourceFilesReadable) {
        console.log(chalk.green("✓") + " All source files are readable");
        checksPassedCount++;
      }

      if (allTargetDirsWritable) {
        console.log(chalk.green("✓") + " Target directories are writable");
        checksPassedCount++;
      }

      // Final summary
      console.log();
      if (errorCount === 0 && warningCount === 0) {
        console.log(
          chalk.green(
            `Validation complete: ${checksPassedCount} checks passed`,
          ),
        );
      } else if (errorCount === 0) {
        console.log(
          chalk.yellow(
            `Validation complete: ${checksPassedCount} checks passed, ${warningCount} warning${warningCount !== 1 ? "s" : ""}`,
          ),
        );
      } else {
        console.log(
          chalk.red(
            `Validation failed: ${checksPassedCount} checks passed, ${warningCount} warning${warningCount !== 1 ? "s" : ""}, ${errorCount} error${errorCount !== 1 ? "s" : ""}`,
          ),
        );
      }

      // Track validation completion
      trackEvent(authId || "validate", "cmd.validate.success", {
        flags,
        errorCount,
        warningCount,
        checksPassedCount,
        authenticated: !!authId,
      });

      // Exit with appropriate code
      if (errorCount > 0) {
        process.exit(1);
      } else {
        exitGracefully();
      }
    } catch (error: any) {
      console.log(chalk.red(`✗ Validation failed: ${error.message}`));
      trackEvent(authId || "validate", "cmd.validate.error", {
        flags,
        error: error.message,
        authenticated: !!authId,
      });
      process.exit(1);
    }
  });

function parseFlags(options: any) {
  return Z.object({
    strict: Z.boolean().optional(),
    apiKey: Z.string().optional(),
  }).parse(options);
}
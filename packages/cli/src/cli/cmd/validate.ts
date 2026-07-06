import { Command } from "interactive-commander";
import Z from "zod";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import { glob } from "glob";
import {
  bucketTypeSchema,
  resolveOverriddenLocale,
  localeCodeSchema,
  parseI18nConfig,
} from "@lingo.dev/_spec";
import { getSettings } from "../utils/settings";
import { getBuckets } from "../utils/buckets";
import { createAuthenticator } from "../utils/auth";

export default new Command()
  .command("validate")
  .description("Validate lingo.dev configuration and file structure")
  .helpOption("-h, --help", "Show help")
  .option(
    "--strict",
    "Strict mode: treat missing target files as errors instead of warnings",
  )
  .option(
    "--api-key <api-key>",
    "Verify authentication status using the provided API key",
  )
  .action(async (options) => {
    const flags = flagsSchema.parse(options);
    
    let checksPassed = 0;
    let warningsCount = 0;
    let failuresCount = 0;

    const pass = (message: string) => {
      checksPassed++;
      console.log(chalk.green(`✓ ${message}`));
    };

    const warn = (message: string) => {
      warningsCount++;
      console.log(chalk.yellow(`⚠ ${message}`));
    };

    const fail = (message: string) => {
      failuresCount++;
      console.log(chalk.red(`✗ ${message}`));
    };

    const formatPath = (p: string) => p.replaceAll(path.sep, "/");

    // 1. Check if Configuration file (i18n.json) exists
    const configFilePath = path.join(process.cwd(), "i18n.json");
    if (!fs.existsSync(configFilePath)) {
      fail("Configuration file (i18n.json) does not exist in the current directory.");
      console.log(
        chalk.red(
          `\nValidation failed: ${checksPassed} checks passed, ${failuresCount} failures, ${warningsCount} warnings`
        )
      );
      process.exit(1);
    }
    pass("Configuration file (i18n.json) exists");

    // 2. Read and parse configuration file
    let rawConfig: any;
    try {
      const fileContents = fs.readFileSync(configFilePath, "utf8");
      rawConfig = JSON.parse(fileContents);
    } catch (e: any) {
      fail(`Failed to parse i18n.json as valid JSON: ${e.message}`);
      console.log(
        chalk.red(
          `\nValidation failed: ${checksPassed} checks passed, ${failuresCount} failures, ${warningsCount} warnings`
        )
      );
      process.exit(1);
    }

    let i18nConfig: any;
    try {
      i18nConfig = parseI18nConfig(rawConfig);
    } catch (e: any) {
      fail(`Configuration schema validation failed: ${e.message}`);
      console.log(
        chalk.red(
          `\nValidation failed: ${checksPassed} checks passed, ${failuresCount} failures, ${warningsCount} warnings`
        )
      );
      process.exit(1);
    }

    // 3. Validate source locale
    const sourceLocale = i18nConfig.locale.source;
    const sourceLocaleValidation = localeCodeSchema.safeParse(sourceLocale);
    if (sourceLocaleValidation.success) {
      pass(`Source locale '${sourceLocale}' is valid`);
    } else {
      fail(`Source locale '${sourceLocale}' is invalid`);
    }

    // 4. Validate target locales
    const targetLocales = i18nConfig.locale.targets;
    if (!targetLocales || targetLocales.length === 0) {
      fail("No target locales configured.");
    } else {
      let allTargetsValid = true;
      for (const target of targetLocales) {
        const targetValidation = localeCodeSchema.safeParse(target);
        if (!targetValidation.success) {
          fail(`Target locale '${target}' is invalid`);
          allTargetsValid = false;
        }
      }
      if (allTargetsValid) {
        pass(`Target locales [${targetLocales.map((t: string) => `'${t}'`).join(", ")}] are valid`);
      }
    }

    // 5. Validate bucket types are supported
    let allBucketsSupported = true;
    const bucketEntries = Object.entries(i18nConfig.buckets || {});
    if (bucketEntries.length === 0) {
      warn("No translation buckets defined in configuration");
    } else {
      for (const [bucketType] of bucketEntries) {
        const bucketTypeValidation = bucketTypeSchema.safeParse(bucketType);
        if (!bucketTypeValidation.success) {
          fail(`Bucket type '${bucketType}' is unsupported`);
          allBucketsSupported = false;
        }
      }
      if (allBucketsSupported) {
        const bucketNames = bucketEntries.map(([name]) => name);
        pass(`Bucket type${bucketNames.length > 1 ? "s" : ""} [${bucketNames.map((b: string) => `'${b}'`).join(", ")}] ${bucketNames.length > 1 ? "are" : "is"} supported`);
      }
    }

    // 6. Check configured source and target files/directories
    const checkedSourceFiles = new Set<string>();
    const targetDirs = new Set<string>();
    let allSourceFilesReadable = true;

    // Helper to check target directory write access
    const checkDirWritable = (dirPath: string): boolean => {
      let currentPath = path.resolve(dirPath);
      while (true) {
        try {
          fs.accessSync(currentPath, fs.constants.W_OK);
          return true;
        } catch {
          const parent = path.dirname(currentPath);
          if (parent === currentPath) {
            return false;
          }
          currentPath = parent;
        }
      }
    };

    if (bucketEntries.length > 0) {
      // Use getBuckets to find resolved paths of existing files
      const buckets = getBuckets(i18nConfig);
      
      // Let's also check for literal include files from i18nConfig that might be missing entirely
      for (const [bucketType, bucketEntry] of bucketEntries) {
        const include = (bucketEntry as any).include || [];
        for (const item of include) {
          const itemPath = typeof item === "string" ? item : item.path;
          const itemDelimiter = typeof item === "string" ? null : item.delimiter || null;

          const resolvedSourceLocale = resolveOverriddenLocale(sourceLocale, itemDelimiter);
          const sourcePathPattern = itemPath.replaceAll(/\[locale\]/g, resolvedSourceLocale);
          const isGlob = sourcePathPattern.includes("*") || sourcePathPattern.includes("?");

          if (!isGlob) {
            const absolutePath = path.resolve(sourcePathPattern);
            const relativePath = path.relative(process.cwd(), absolutePath);
            if (!fs.existsSync(absolutePath)) {
              fail(`Source file missing: ${formatPath(relativePath)}`);
              allSourceFilesReadable = false;
            } else {
              checkedSourceFiles.add(relativePath);
              try {
                fs.accessSync(absolutePath, fs.constants.R_OK);
                pass(`Source file exists: ${formatPath(relativePath)}`);
              } catch {
                fail(`Source file exists but is not readable: ${formatPath(relativePath)}`);
                allSourceFilesReadable = false;
              }

              // Check target files for this specific literal source file
              for (const targetLocale of targetLocales) {
                const resolvedTargetLocale = resolveOverriddenLocale(targetLocale, itemDelimiter);
                const targetPath = itemPath.replaceAll(/\[locale\]/g, resolvedTargetLocale);
                const absoluteTargetPath = path.resolve(targetPath);
                const relativeTargetPath = path.relative(process.cwd(), absoluteTargetPath);
                targetDirs.add(path.dirname(absoluteTargetPath));

                if (fs.existsSync(absoluteTargetPath)) {
                  try {
                    fs.accessSync(absoluteTargetPath, fs.constants.R_OK);
                  } catch {
                    fail(`Target file exists but is not readable: ${formatPath(relativeTargetPath)}`);
                  }
                } else {
                  if (flags.strict) {
                    fail(`Target file missing: ${formatPath(relativeTargetPath)}`);
                  } else {
                    warn(`Target file missing: ${formatPath(relativeTargetPath)} (will be created)`);
                  }
                }
              }
            }
          }
        }
      }

      // Check remaining source files returned by getBuckets (which handles globs)
      for (const bucket of buckets) {
        for (const bucketPath of bucket.paths) {
          const resolvedSourceLocale = resolveOverriddenLocale(sourceLocale, bucketPath.delimiter);
          const sourcePath = bucketPath.pathPattern.replaceAll("[locale]", resolvedSourceLocale);
          const absoluteSourcePath = path.resolve(sourcePath);
          const relativeSourcePath = path.relative(process.cwd(), absoluteSourcePath);

          if (!checkedSourceFiles.has(relativeSourcePath)) {
            checkedSourceFiles.add(relativeSourcePath);
            try {
              fs.accessSync(absoluteSourcePath, fs.constants.R_OK);
              pass(`Source file exists: ${formatPath(relativeSourcePath)}`);
            } catch {
              fail(`Source file exists but is not readable: ${formatPath(relativeSourcePath)}`);
              allSourceFilesReadable = false;
            }
          }

          // Check target files
          for (const targetLocale of targetLocales) {
            const resolvedTargetLocale = resolveOverriddenLocale(targetLocale, bucketPath.delimiter);
            const targetPath = bucketPath.pathPattern.replaceAll("[locale]", resolvedTargetLocale);
            const absoluteTargetPath = path.resolve(targetPath);
            const relativeTargetPath = path.relative(process.cwd(), absoluteTargetPath);
            targetDirs.add(path.dirname(absoluteTargetPath));

            if (!fs.existsSync(absoluteTargetPath)) {
              if (flags.strict) {
                fail(`Target file missing: ${formatPath(relativeTargetPath)}`);
              } else {
                warn(`Target file missing: ${formatPath(relativeTargetPath)} (will be created)`);
              }
            } else {
              try {
                fs.accessSync(absoluteTargetPath, fs.constants.R_OK);
              } catch {
                fail(`Target file exists but is not readable: ${formatPath(relativeTargetPath)}`);
              }
            }
          }
        }
      }
    }

    if (allSourceFilesReadable && checkedSourceFiles.size > 0) {
      pass("All source files are readable");
    }

    // Check writability of target directories
    let allTargetDirsWritable = true;
    for (const dir of targetDirs) {
      if (!checkDirWritable(dir)) {
        const relativeDir = path.relative(process.cwd(), dir) || ".";
        fail(`Target directory is not writable: ${formatPath(relativeDir)}`);
        allTargetDirsWritable = false;
      }
    }
    if (allTargetDirsWritable && targetDirs.size > 0) {
      pass("Target directories are writable");
    }

    // 7. Optional Authentication Check
    const settings = getSettings(flags.apiKey);
    if (settings.auth.apiKey) {
      try {
        const authenticator = createAuthenticator({
          apiUrl: settings.auth.apiUrl,
          apiKey: settings.auth.apiKey,
        });
        const auth = await authenticator.whoami();
        if (auth) {
          pass(`Authenticated as ${auth.email}`);
        } else {
          fail("Authentication check failed: invalid API key.");
        }
      } catch (error: any) {
        fail(`Authentication check failed: ${error.message}`);
      }
    } else if (flags.apiKey) {
      fail("Authentication check failed: no API key provided.");
    }

    // Summary
    if (failuresCount > 0) {
      console.log(
        chalk.red(
          `\nValidation failed: ${checksPassed} check${checksPassed !== 1 ? "s" : ""} passed, ${failuresCount} failure${failuresCount !== 1 ? "s" : ""}, ${warningsCount} warning${warningsCount !== 1 ? "s" : ""}`
        )
      );
      process.exit(1);
    } else {
      console.log(
        chalk.green(
          `\nValidation complete: ${checksPassed} check${checksPassed !== 1 ? "s" : ""} passed, ${warningsCount} warning${warningsCount !== 1 ? "s" : ""}`
        )
      );
      process.exit(0);
    }
  });

const flagsSchema = Z.object({
  strict: Z.boolean().default(false),
  apiKey: Z.string().optional(),
});

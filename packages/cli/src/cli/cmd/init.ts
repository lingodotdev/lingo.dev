import { InteractiveCommand, InteractiveOption } from "interactive-commander";
import Ora from "ora";
import { getConfig, saveConfig } from "../utils/config";
import {
  defaultConfig,
  LocaleCode,
  resolveLocaleCode,
  bucketTypes,
} from "@lingo.dev/_spec";
import fs from "fs";
import path from "path";
import _ from "lodash";
import { checkbox, confirm, input } from "@inquirer/prompts";
import { login } from "./login";
import { getSettings, saveSettings } from "../utils/settings";
import { createAuthenticator } from "../utils/auth";
import findLocaleFiles from "../utils/find-locale-paths";
import { ensurePatterns } from "../utils/ensure-patterns";
import updateGitignore from "../utils/update-gitignore";
import initCICD from "../utils/init-ci-cd";
import open from "open";

const openUrl = (path: string) => {
  const settings = getSettings(undefined);
  open(`${settings.auth.webUrl}${path}`, { wait: false });
};

const throwHelpError = (option: string, value: string) => {
  if (value === "help") {
    openUrl("/go/call");
  }
  throw new Error(
    `Invalid ${option}: ${value}\n\nDo you need support for ${value} ${option}? Type "help" and we will.`,
  );
};

export default new InteractiveCommand()
  .command("init")
  .description(
    "Bootstrap i18n.json from scratch: pick source and target locales, detect existing translation files, wire up CI helpers, and optionally sign in",
  )
  .helpOption("-h, --help", "Show help")
  .addOption(
    new InteractiveOption(
      "-f --force",
      "Replace an existing i18n.json when one is discovered instead of exiting early",
    )
      .prompt(undefined)
      .default(false),
  )
  .addOption(
    new InteractiveOption(
      "-s --source <locale>",
      "Source locale code to save in the config. Validated against supported locale formats and defaults to en",
    )
      .argParser((value) => {
        try {
          resolveLocaleCode(value as LocaleCode);
        } catch (e) {
          throwHelpError("locale", value);
        }
        return value;
      })
      .default("en"),
  )
  .addOption(
    new InteractiveOption(
      "-t --targets <locale...>",
      "Comma or space separated list of target locale codes. Each entry is validated and the set defaults to es",
    )
      .argParser((value) => {
        const values = (
          value.includes(",") ? value.split(",") : value.split(" ")
        ) as LocaleCode[];
        values.forEach((value) => {
          try {
            resolveLocaleCode(value);
          } catch (e) {
            throwHelpError("locale", value);
          }
        });
        return values;
      })
      .default("es"),
  )
  .addOption(
    new InteractiveOption(
      "-b, --bucket <type>",
      "Bucket type whose include patterns will be configured. Must match a supported loader identifier such as json or yaml",
    )
      .argParser((value) => {
        if (!bucketTypes.includes(value as (typeof bucketTypes)[number])) {
          throwHelpError("bucket format", value);
        }
        return value;
      })
      .default("json"),
  )
  .addOption(
    new InteractiveOption(
      "-p, --paths [path...]",
      "Explicit `[locale]` include patterns for the chosen bucket when `--no-interactive` is used. Parents must already exist and values can be comma or space separated",
    )
      .argParser((value) => {
        if (!value || value.length === 0) return [];
        const values = value.includes(",")
          ? value.split(",")
          : value.split(" ");

        for (const p of values) {
          try {
            const dirPath = path.dirname(p);
            const stats = fs.statSync(dirPath);
            if (!stats.isDirectory()) {
              throw new Error(`${dirPath} is not a directory`);
            }
          } catch (err) {
            throw new Error(`Invalid path: ${p}`);
          }
        }

        return values;
      })
      .prompt(undefined) // make non-interactive
      .default([]),
  )
  .action(async (options) => {
    const settings = getSettings(undefined);
    const isInteractive = options.interactive;

    const spinner = Ora().start("Initializing Lingo.dev project");

    let existingConfig = await getConfig(false);
    if (existingConfig && !options.force) {
      spinner.fail("Lingo.dev project already initialized");
      return process.exit(1);
    }

    const newConfig = _.cloneDeep(defaultConfig);

    newConfig.locale.source = options.source;
    newConfig.locale.targets = options.targets;

    if (!isInteractive) {
      newConfig.buckets = {
        [options.bucket]: {
          include: options.paths || [],
        },
      };
    } else {
      let selectedPatterns: string[] = [];
      const localeFiles = findLocaleFiles(options.bucket);

      if (!localeFiles) {
        spinner.warn(
          `Bucket type "${options.bucket}" does not supported automatic initialization. Add paths to "i18n.json" manually.`,
        );
        newConfig.buckets = {
          [options.bucket]: {
            include: options.paths || [],
          },
        };
      } else {
        const { patterns, defaultPatterns } = localeFiles;

        if (patterns.length > 0) {
          spinner.succeed("Found existing locale files:");

          selectedPatterns = await checkbox({
            message: "Select the paths to use",
            choices: patterns.map((value) => ({
              value,
            })),
          });
        } else {
          spinner.succeed("No existing locale files found.");
        }

        if (selectedPatterns.length === 0) {
          const useDefault = await confirm({
            message: `Use (and create) default path ${defaultPatterns.join(
              ", ",
            )}?`,
          });
          if (useDefault) {
            ensurePatterns(defaultPatterns, options.source);
            selectedPatterns = defaultPatterns;
          }
        }

        if (selectedPatterns.length === 0) {
          const customPaths = await input({
            message: "Enter paths to use",
          });
          selectedPatterns = customPaths.includes(",")
            ? customPaths.split(",")
            : customPaths.split(" ");
        }

        newConfig.buckets = {
          [options.bucket]: {
            include: selectedPatterns || [],
          },
        };
      }
    }

    await saveConfig(newConfig);

    spinner.succeed("Lingo.dev project initialized");

    if (isInteractive) {
      await initCICD(spinner);

      const openDocs = await confirm({
        message: "Would you like to see our docs?",
      });
      if (openDocs) {
        openUrl("/go/docs");
      }
    }

    const authenticator = createAuthenticator({
      apiKey: settings.auth.apiKey,
      apiUrl: settings.auth.apiUrl,
    });
    const auth = await authenticator.whoami();
    if (!auth) {
      if (isInteractive) {
        const doAuth = await confirm({
          message: "It looks like you are not logged into the CLI. Login now?",
        });
        if (doAuth) {
          const apiKey = await login(settings.auth.webUrl);
          settings.auth.apiKey = apiKey;
          await saveSettings(settings);

          const newAuthenticator = createAuthenticator({
            apiKey: settings.auth.apiKey,
            apiUrl: settings.auth.apiUrl,
          });
          const auth = await newAuthenticator.whoami();
          if (auth) {
            Ora().succeed(`Authenticated as ${auth?.email}`);
          } else {
            Ora().fail("Authentication failed.");
          }
        }
      } else {
        Ora().warn(
          "You are not logged in. Run `npx lingo.dev@latest login` to login.",
        );
      }
    } else {
      Ora().succeed(`Authenticated as ${auth.email}`);
    }

    updateGitignore();

    if (!isInteractive) {
      Ora().info("Please see https://lingo.dev/cli");
    }
  });

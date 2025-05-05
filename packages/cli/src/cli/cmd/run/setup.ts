import chalk from "chalk";
import { Listr, ListrDefaultRendererLogLevels } from "listr2";

import { colors } from "../../constants";
import { SetupState } from "./_types";
import { getSettings } from "../../utils/settings";
import { getConfig } from "../../utils/config";
import { CLIError } from "../../utils/errors";
import { validateAuth } from "../i18n";
import createProcessor from "../../processor";

export async function setup(): Promise<SetupState> {
  console.log(chalk.hex(colors.orange)("[Setup]"));

  const setupTasks = new Listr<SetupState>(
    [
      {
        title: "Loading i18n configuration",
        task: async (ctx, task) => {
          const i18nConfig = getConfig();
          if (!i18nConfig) {
            throw new CLIError({
              message:
                "Couldn't load i18n configuration: i18n.json not found in the current directory. Please run `lingo.dev init` to initialize the project.",
              docUrl: "i18nNotFound",
            });
          }
          ctx.i18nConfig = i18nConfig;
          task.title = `Loaded i18n configuration`;
        },
      },
      {
        title: "Selecting translation provider",
        task: async (ctx, task) => {
          const provider = ctx.i18nConfig.provider;
          const providerName = provider?.id ?? "lingo.dev";
          task.output = `Initializing ${chalk.hex(colors.yellow)(providerName)} processor...`;

          const processor = createProcessor(provider, {
            apiKey: "",
            apiUrl: "",
          });
          ctx.localizer = {
            type: providerName,
            processor: processor,
          };

          if (providerName === "lingo.dev") {
            task.title = `Using ${chalk.hex(colors.green)("Lingo.dev")} provider`;
          } else {
            task.title = `Using raw ${chalk.hex(colors.yellow)(`${providerName} (${provider?.model})`)} instead of ${chalk.hex(colors.green)("Lingo.dev")} Engine`;
          }

          const isLingoDev = providerName === "lingo.dev";

          if (!isLingoDev) {
            const skippedFeatureTitles = [
              "Lingo.dev authentication skipped",
              "Skipping brand voice",
              "Skipping glossary",
              "Skipping translation memory",
              "Skipping quality assurance",
            ];

            return task.newListr(
              skippedFeatureTitles.map((title) => ({
                title: chalk.dim(title),
                task: () => {},
                skip: true,
              })),
              {
                concurrent: true,
                rendererOptions: { collapseSubtasks: false },
              },
            );
          }

          // Lingo.dev provider: perform authentication and show enabled features
          task.output = "Authenticating with Lingo.dev...";
          const settings = getSettings(undefined);
          const auth = await validateAuth(settings);
          ctx.auth = auth;

          // Update the parent task title to reflect successful authentication
          task.title = `Authenticated as ${chalk.hex(colors.yellow)(auth.email)}`;

          return task.newListr(
            [
              "Brand voice enabled",
              "Translation memory connected",
              "Glossary enabled",
              "Quality assurance enabled",
            ].map((item) => ({ title: item, task: () => {} })),
            {
              concurrent: true,
              rendererOptions: { collapseSubtasks: false },
            },
          );
        },
      },
    ],
    {
      exitOnError: true,
      rendererOptions: {
        color: {
          [ListrDefaultRendererLogLevels.COMPLETED]: (msg?: string) =>
            msg ? chalk.hex(colors.green)(msg) : chalk.hex(colors.green)(""),
        },
        icon: {
          [ListrDefaultRendererLogLevels.COMPLETED]: chalk.hex(colors.green)(
            "✓",
          ),
        },
      },
    },
  );

  const result = await setupTasks.run();
  return result;
}

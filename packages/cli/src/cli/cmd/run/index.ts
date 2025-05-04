import { Command } from "interactive-commander";
import chalk from "chalk";
import figlet from "figlet";
import {
  Listr,
  ListrTaskWrapper,
  ListrDefaultRendererLogLevels,
  LoggerFormat,
} from "listr2";
import pLimit from "p-limit";
import { z } from "zod";
import {
  processPayload,
  findBuckets,
  findBucketPatterns,
  findBucketFiles,
  getSourceLocale,
  getTargetLocales,
} from "./_mocks";
import { vice } from "gradient-string";

const colors = {
  organge: "#ff6600",
  green: "#6ae300",
  blue: "#0090ff",
  yellow: "#ffcc00",
  grey: "#808080",
  red: "#ff0000",
};

type PayloadProcessingTask = {
  bucketType: string;
  bucketPattern: string;
  filePath: string;
  sourceLocale: string;
  targetLocale: string;
  sourcePayload: any;
  targetPayload: any;
  processablePayload: any;
};

export default new Command()
  .command("run")
  .description("Run Lingo.dev localization engine")
  .helpOption("-h, --help", "Show help")
  .option(
    "-c, --concurrency <number>",
    "Max parallel translation processes (default: unlimited)",
    "0",
  )
  .action(async (args) => {
    await renderClear();
    await renderSpacer();
    await renderBanner();
    await renderHero();
    await renderSpacer();
    const setupState = await setup();
    await renderSpacer();
    const planState = await plan(setupState.i18nConfig);
    await renderSpacer();
    const processState = await process(setupState.auth, planState.tasks);
    await renderSpacer();
    await summarize(processState);
    await renderSpacer();

    // ---
    return;
    // ---

    async function renderClear() {
      console.log("\x1Bc");
    }

    async function renderSpacer() {
      console.log(" ");
    }

    async function renderBanner() {
      console.log(
        vice(
          figlet.textSync("LINGO.DEV", {
            font: "ANSI Shadow",
            horizontalLayout: "default",
            verticalLayout: "default",
          }),
        ),
      );
    }

    async function renderHero() {
      console.log(
        `⚡️ ${chalk.hex(colors.green)("Lingo.dev")} - open-source, AI-powered i18n CLI for web & mobile localization.`,
      );
      console.log(" ");
      console.log(
        chalk.hex(colors.blue)("⭐ GitHub Repo: https://lingo.dev/go/gh"),
      );
      console.log(chalk.hex(colors.blue)("💬 24/7 Support: hi@lingo.dev"));
    }

    async function setup() {
      console.log(chalk.hex(colors.organge)("[Setup]"));

      const setupTasks = new Listr<{ i18nConfig: any; auth: any }>(
        [
          {
            title: "Loading i18n configuration",
            task: async (ctx, task) => {
              await new Promise((res) => setTimeout(res, 500));
              ctx.i18nConfig = {};
              task.title = `Loaded i18n configuration`;
            },
          },
          {
            title: "Authenticating with Lingo.dev",
            task: async (ctx, task) => {
              await new Promise((res) => setTimeout(res, 750));
              const email = "user@example.com";
              ctx.auth = { email };
              task.title = `Authenticated as ${chalk.hex(colors.yellow)(email)}`;
            },
          },
          {
            title: "Choosing localization provider",
            task: async (ctx, task) => {
              await new Promise((res) => setTimeout(res, 750));
              task.title = `Using ${chalk.hex(colors.green)("Lingo.dev")} instead of raw LLM API`;
            },
          },
        ],
        {
          rendererOptions: {
            color: {
              [ListrDefaultRendererLogLevels.COMPLETED]: (msg?: string) =>
                msg
                  ? chalk.hex(colors.green)(msg)
                  : chalk.hex(colors.green)(""),
            },
            icon: {
              [ListrDefaultRendererLogLevels.COMPLETED]: chalk.hex(
                colors.green,
              )("✓"),
            },
          },
        },
      );

      const result = await setupTasks.run({
        i18nConfig: {},
        auth: {},
      });

      return result;
    }

    async function plan(i18nConfig: any) {
      console.log(chalk.hex(colors.organge)("[Planning]"));

      const planTasks = new Listr(
        [
          {
            title: "Analyzing project structure",
            task: async (ctx, task) => {
              await new Promise((res) => setTimeout(res, 300));
              const buckets = ["json", "mdx"];
              const files = 24;
              task.title = `Found ${chalk.hex(colors.yellow)(buckets.length.toString())} buckets (${chalk.dim(buckets.join(", "))})`;
            },
          },
          {
            title: "Scanning files",
            task: async (ctx, task) => {
              await new Promise((res) => setTimeout(res, 500));
              const files = 24;
              task.title = `Found ${chalk.hex(colors.yellow)(files.toString())} files to localize`;
            },
          },
          {
            title: "Identifying locales",
            task: async (ctx, task) => {
              await new Promise((res) => setTimeout(res, 400));
              const sourceLocale = "en";
              const targetLocales = ["es", "fr"];
              task.title = `Using ${chalk.hex(colors.yellow)(sourceLocale)} as source, targeting ${chalk.hex(colors.yellow)(targetLocales.length.toString())} locales (${chalk.dim(targetLocales.join(", "))})`;
            },
          },
          {
            title: "Preparing translation tasks",
            task: async (ctx, task) => {
              await new Promise((res) => setTimeout(res, 350));
              const translationTasks = 48; // 24 files * 2 target locales
              task.title = `Prepared ${chalk.hex(colors.yellow)(translationTasks.toString())} translation tasks`;
            },
          },
        ],
        {
          rendererOptions: {
            color: {
              [ListrDefaultRendererLogLevels.COMPLETED]: (msg?: string) =>
                msg
                  ? chalk.hex(colors.green)(msg)
                  : chalk.hex(colors.green)(""),
            },
            icon: {
              [ListrDefaultRendererLogLevels.COMPLETED]: chalk.hex(
                colors.green,
              )("✓"),
            },
          },
        },
      );

      await planTasks.run();

      return {
        tasks: [],
      };
    }

    async function process(auth: any, tasks: any) {
      console.log(chalk.hex(colors.organge)("[Localization]"));

      const errors: Error[] = [];

      const processTasks = new Listr(
        [
          {
            title: "Initializing translation engine",
            task: async (ctx, task) => {
              await new Promise((res) => setTimeout(res, 300));
              task.title = `Translation engine ${chalk.hex(colors.green)("ready")}`;
            },
          },
          {
            title: "Processing translation tasks",
            task: async (ctx, task) => {
              // Create subtasks for each bucket type
              const bucketTypes = ["json", "yaml", "xml"];
              const targetLocales = ["es", "fr"];

              return new Listr(
                bucketTypes.map((bucketType) => ({
                  title: `[${chalk.hex(colors.yellow)(bucketType)}]`,
                  task: () => {
                    // Create subtasks for each target locale
                    return task.newListr(
                      targetLocales.map((locale) => ({
                        title: `[${chalk.hex(colors.yellow)(`en → ${locale}`)}]`,
                        task: (ctx, t) => {
                          // Generate pseudo file paths to simulate workload
                          const filePaths = Array.from(
                            { length: 10 },
                            (_, i) => `file_${i}.${bucketType}`,
                          );
                          const limit1 = pLimit(1);
                          return limit1(async () => {
                            for (const filePath of filePaths) {
                              t.title = `[${chalk.hex(colors.yellow)("en")} → ${chalk.hex(colors.yellow)(locale)}] ${chalk.dim(filePath)}`;
                              await new Promise((res) => setTimeout(res, 1000));
                              // Randomly throw an error with 10% chance
                              if (Math.random() < 0.1) {
                                const error = new Error(
                                  `Failed to translate ${filePath} to ${locale}`,
                                );
                                errors.push(error);
                                throw error;
                              }
                            }
                          });
                        },
                      })),
                      {
                        // Process locales concurrently
                        concurrent: true,
                        exitOnError: false,
                      },
                    );
                  },
                })),
                {
                  // Run bucket-type tasks concurrently, capped at 10 in parallel
                  concurrent: 10,
                  exitOnError: false,
                },
              );
            },
          },
          {
            title: "Finalizing translations",
            task: async (ctx, task) => {
              await new Promise((res) => setTimeout(res, 250));
              const totalTranslated = 1248; // Example number
              task.title = `Finalized ${chalk.hex(colors.yellow)(totalTranslated.toString())} translations`;
            },
          },
        ],
        {
          rendererOptions: {
            color: {
              [ListrDefaultRendererLogLevels.COMPLETED]: (msg?: string) =>
                msg
                  ? chalk.hex(colors.green)(msg)
                  : chalk.hex(colors.green)(""),
            },
            icon: {
              [ListrDefaultRendererLogLevels.COMPLETED]: chalk.hex(
                colors.green,
              )("✓"),
            },
          },
        },
      );

      await processTasks.run();

      // Print errors after the run
      if (errors.length > 0) {
        console.log(" ");
        console.log(chalk.hex(colors.red)("[Errors]"));
        errors.forEach((error, index) => {
          console.log(`${chalk.hex(colors.red)(`✗`)} ${error.message}`);
        });
      }

      return {
        results: [],
      };
    }

    async function summarize(results: any) {
      return {
        summary: [],
      };
    }
  });

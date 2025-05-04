import { Command } from "interactive-commander";
import chalk from "chalk";
import figlet from "figlet";
import { Listr, ListrDefaultRendererLogLevels } from "listr2";
import pLimit from "p-limit";
import { vice } from "gradient-string";

const colors = {
  organge: "#ff6600",
  green: "#6ae300",
  blue: "#0090ff",
  yellow: "#ffcc00",
  grey: "#808080",
  red: "#ff0000",
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
              const allTasks = Array.from({ length: 100 }, (_, i) => ({
                id: i,
                bucketType: bucketTypes[i % bucketTypes.length],
                sourceLocale: "en",
                targetLocale: targetLocales[i % targetLocales.length],
                filePath: `file_${i}.${bucketTypes[i % bucketTypes.length]}`,
              }));
              const concurrency = parseInt(args.concurrency) || 10;
              const limit = pLimit(concurrency); // Use p-limit for concurrency control if needed elsewhere
              let completedTasks = 0;
              const totalTasks = allTasks.length;

              // Create 10 threads (subtasks)
              const threads = Array.from({ length: 10 }, (_, threadIndex) => ({
                title: "Initializing...", // Initial title
                task: async (subCtx: any, subTask: any) => {
                  const tasksForThread = allTasks.filter(
                    (_, taskIndex) => taskIndex % 10 === threadIndex,
                  );
                  let threadCompleted = 0;

                  for (const taskToProcess of tasksForThread) {
                    // Simulate processing
                    try {
                      // Update subtask title with current task info
                      subTask.title = `Processing: ${chalk.dim(taskToProcess.filePath)} (${chalk.yellow(taskToProcess.sourceLocale)} -> ${chalk.yellow(taskToProcess.targetLocale)})`;
                      await new Promise((res, rej) =>
                        setTimeout(
                          () => {
                            // Simulate a potential error
                            if (Math.random() < 0.05) {
                              // 5% chance of error
                              rej(
                                new Error(
                                  `Failed processing ${taskToProcess.filePath}`,
                                ),
                              );
                            }
                            res(undefined);
                          },
                          500 + Math.random() * 1000,
                        ),
                      );
                      completedTasks++;
                      threadCompleted++;
                      // Update main task title with detailed status
                      const processedCount = completedTasks;
                      const failedCount = errors.length;
                      const status = `Processed ${chalk.green(processedCount)}/${totalTasks}, Failed ${chalk.red(failedCount)}/${totalTasks}`;
                      task.title = `Processing translation tasks: ${chalk.dim(status)}`;
                    } catch (error: any) {
                      // Record the error
                      errors.push(error);

                      // Update main task title with detailed status after error
                      const processedCountAfterError = completedTasks; // completedTasks hasn't incremented here
                      const failedCountAfterError = errors.length;
                      const statusAfterError = `Processed ${chalk.green(processedCountAfterError)}/${totalTasks}, Failed ${chalk.red(failedCountAfterError)}/${totalTasks}`;
                      task.title = `Processing translation tasks: ${chalk.dim(statusAfterError)}`;

                      // Continue to the next task
                    }
                  }
                  subTask.title = "Done"; // Final title
                },
              }));

              // Run the subtasks concurrently
              return task.newListr(threads, {
                concurrent: true,
                exitOnError: false,
                rendererOptions: {
                  collapseSubtasks: true,
                  collapseErrors: false,
                  color: {
                    [ListrDefaultRendererLogLevels.COMPLETED]: (
                      msg?: string,
                    ) =>
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
              });

              // Set the final title after all subtasks complete
              const finalCompletedCount = completedTasks;
              const finalFailedCount = errors.length;
              task.title = `Processing translation tasks: Completed ${chalk.green(finalCompletedCount)}/${totalTasks}, Failed ${chalk.red(finalFailedCount)}/${totalTasks}`;
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
          exitOnError: false,
          rendererOptions: {
            collapseSubtasks: true,
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

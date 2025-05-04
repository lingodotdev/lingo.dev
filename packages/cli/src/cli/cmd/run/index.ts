import { Command } from "interactive-commander";
import chalk from "chalk";
import figlet from "figlet";
import { Listr, ListrTaskWrapper } from "listr2";
import pLimit from "p-limit";
import {
  processPayload,
  findBuckets,
  findBucketPatterns,
  findBucketFiles,
  getSourceLocale,
  getTargetLocales,
} from "./_mocks";

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
    // 1. Beautiful banner
    console.log(
      chalk.cyan(
        figlet.textSync("Lingo.dev", {
          horizontalLayout: "default",
          verticalLayout: "default",
        }),
      ),
    );

    // 2. Define our tasks using Listr2
    interface Ctx {
      buckets: Awaited<ReturnType<typeof findBuckets>>;
      processingTasks: PayloadProcessingTask[];
    }

    const tasksRunner = new Listr<Ctx>([
      {
        title: "Loading i18n configuration",
        task: async () => {
          // Simulate loading configuration
          await new Promise((res) => setTimeout(res, 250));
        },
      },
      {
        title: "Authenticating translation service",
        task: async (ctx: Ctx, task: ListrTaskWrapper<Ctx, any, any>) => {
          await new Promise((res) => setTimeout(res, 250));
          task.title = `Authenticated as ${chalk.green("<email>")}`;
        },
      },
      {
        title: "Loading localization buckets",
        task: async (ctx: Ctx) => {
          const start = Date.now();
          ctx.buckets = await findBuckets();
          const duration = Date.now() - start;
          ctx.buckets.forEach((bucket) => {
            // you can attach additional info to ctx if needed
          });
          // Provide some feedback after completion
          console.log(
            chalk.dim(
              `  → Loaded ${ctx.buckets.length} localization buckets in ${duration}ms`,
            ),
          );
        },
      },
      {
        title: "Preparing translation tasks",
        task: async (ctx: Ctx) => {
          const processingTasks: PayloadProcessingTask[] = [];

          await Promise.all(
            ctx.buckets.map(async (bucket: any) => {
              const patterns = await findBucketPatterns(bucket);

              await Promise.all(
                patterns.map(async (pattern: any) => {
                  const files = await findBucketFiles(pattern);

                  await Promise.all(
                    files.map(async (file: any) => {
                      const targetLocales = getTargetLocales();

                      await Promise.all(
                        targetLocales.map(async (targetLocale: string) => {
                          const sourceLocale = getSourceLocale();
                          const sourcePayload = {};
                          const targetPayload = {};
                          const processablePayload = {};

                          processingTasks.push({
                            bucketType: bucket.type,
                            bucketPattern: pattern.pattern,
                            filePath: file.path,
                            sourceLocale,
                            targetLocale,
                            sourcePayload,
                            targetPayload,
                            processablePayload,
                          });
                        }),
                      );
                    }),
                  );
                }),
              );
            }),
          );

          ctx.processingTasks = processingTasks;
          console.log(
            chalk.dim(
              `  → Created ${processingTasks.length} translation tasks`,
            ),
          );
        },
      },
      {
        title: "Translating content (0/0)",
        task: async (ctx: Ctx, task: ListrTaskWrapper<Ctx, any, any>) => {
          const { processingTasks } = ctx;

          const total = processingTasks.length;
          let completed = 0;

          const active = new Map<string, number>();

          const refresh = () => {
            // Update title with progress count
            task.title = `Translating content (${completed}/${total})`;

            // Render active payload list in task output with progress
            if (active.size > 0) {
              const barWidth = 20;
              task.output = [...active.entries()]
                .map(([lbl, prog]) => {
                  const filled = Math.round((prog / 100) * barWidth);
                  const bar =
                    chalk.green("█".repeat(filled)) +
                    chalk.dim("░".repeat(barWidth - filled));

                  const pctStr = `${Math.round(prog)
                    .toString()
                    .padStart(3, " ")}%`;

                  return `${bar} ${chalk.yellow(pctStr)} ${chalk.gray(lbl)}`;
                })
                .join("\n");
            } else {
              task.output = chalk.dim("No active translations (waiting)...");
            }
          };

          const concurrencyLevel = Number(args.concurrency);
          const limiter = pLimit(
            concurrencyLevel === 0 ? Infinity : concurrencyLevel,
          );

          await Promise.all(
            processingTasks.map((p) =>
              limiter(async () => {
                const label = `(${p.sourceLocale} → ${p.targetLocale}) ${p.filePath}`;

                active.set(label, 0);
                refresh();

                await processPayload(
                  {
                    content: p.filePath,
                    sourceLocale: p.sourceLocale,
                    targetLocale: p.targetLocale,
                  },
                  (progressPercentage: number) => {
                    active.set(label, progressPercentage);
                    refresh();
                  },
                );

                active.delete(label);
                completed += 1;
                refresh();
              }),
            ),
          );

          // Final state
          task.output = chalk.green(`Localized ${total} files successfully`);
        },
      },
    ]);

    await tasksRunner.run();
  });

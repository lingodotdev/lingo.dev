import { Command } from "interactive-commander";
import chalk from "chalk";
import figlet from "figlet";
import { vice } from "gradient-string";
import readline from "readline";
// Local modules
import { colors } from "../../constants";
import { setup } from "./setup";
import { plan } from "./plan";
import { process as runProcess, ProcessState } from "./process";

export default new Command()
  .command("run")
  .description("Run Lingo.dev localization engine")
  .helpOption("-h, --help", "Show help")
  .option(
    "-c, --concurrency <number>",
    "Max parallel translation processes (default: unlimited)",
    "0",
  )
  .option("--debug", "Run in debug mode with user prompts between steps", false)
  .action(async (args) => {
    try {
      if (args.debug) {
        await waitForUserPrompt(
          "Debug mode enabled. Press Enter to continue to planning...",
        );
      }

      await renderClear();
      await renderSpacer();
      await renderBanner();
      await renderHero();
      await renderSpacer();

      const setupState = await setup();
      await renderSpacer();

      const planState = await plan(setupState.i18nConfig);
      await renderSpacer();
      await exitIfNoTasks(planState.tasks);

      const concurrency = parseInt(args.concurrency, 10) || 0;
      const processState: ProcessState = await runProcess(
        setupState,
        planState.tasks,
        concurrency,
      );
      await renderSpacer();

      await renderSummary(processState);
      await renderSpacer();
    } catch (error: any) {
      process.exit(1);
    }
  });

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

async function exitIfNoTasks(tasks: unknown[]): Promise<void> {
  if (!tasks.length) {
    console.log(
      chalk.yellow(
        `Notice: Nothing to translate. Please check your i18n configuration file for proper bucket and locale settings.`,
      ),
    );
    await renderSpacer();
    console.log(
      chalk.dim(
        `Hint: Ensure your i18n.json has valid source and target locales, and that your bucket paths match existing files.`,
      ),
    );
    await renderSpacer(); // Add spacer for better visual separation before exit
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Render helpers (kept in this file for quick reference & CLI UX tweaks)
// ---------------------------------------------------------------------------

export async function renderClear() {
  console.log("\x1Bc");
}

export async function renderSpacer() {
  console.log(" ");
}

export async function renderBanner() {
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

export async function renderHero() {
  console.log(
    `⚡️ ${chalk.hex(colors.green)("Lingo.dev")} - open-source, AI-powered i18n CLI for web & mobile localization.`,
  );
  console.log("");

  const label1 = "⭐ GitHub Repo:";
  const label2 = "📚 Docs:";
  const label3 = "💬 24/7 Support:";
  const maxLabelWidth = 17; // Approximate visual width accounting for emoji

  console.log(
    `${chalk.hex(colors.blue)(label1.padEnd(maxLabelWidth))} ${chalk.hex(colors.blue)("https://lingo.dev/go/gh")}`,
  );
  console.log(
    `${chalk.hex(colors.blue)(label2.padEnd(maxLabelWidth + 1))} ${chalk.hex(colors.blue)("https://lingo.dev/go/docs")}`,
  ); // Docs emoji seems narrower
  console.log(
    `${chalk.hex(colors.blue)(label3.padEnd(maxLabelWidth + 1))} ${chalk.hex(colors.blue)("hi@lingo.dev")}`,
  );
}

async function waitForUserPrompt(message: string): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(chalk.dim(`[${message}]\n`), () => {
      rl.close();
      resolve();
    });
  });
}

export async function renderSummary(_processState: ProcessState) {
  // Placeholder for a more detailed summary implementation
  console.log(chalk.hex(colors.green)("All translation tasks completed!"));
}

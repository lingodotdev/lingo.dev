import { Command } from "interactive-commander";
import chalk from "chalk";
import figlet from "figlet";
import { vice } from "gradient-string";
import Table from "cli-table3";
// Local modules
import { colors } from "./constants";
import { setup } from "./setup";
import { plan, PlanState } from "./plan";
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
  .action(async (args) => {
    try {
      await renderClear();
      await renderSpacer();
      await renderBanner();
      await renderHero();
      await renderSpacer();

      const setupState = await setup();
      await renderSpacer();

      const planState: PlanState = await plan(setupState.i18nConfig);
      await renderSpacer();

      const concurrency = parseInt(args.concurrency, 10) || 0;
      const processState: ProcessState = await runProcess(
        setupState.auth,
        planState.tasks,
        concurrency,
      );
      await renderSpacer();
      await renderSummary(processState);
      await renderSpacer();
    } catch (error: any) {
      console.error(`${chalk.red("✗")} ${error.message}`);
      process.exit(1);
    }
  });

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

export async function renderSummary(_processState: ProcessState) {
  // Placeholder for a more detailed summary implementation
  console.log(chalk.hex(colors.green)("All translation tasks completed!"));
}

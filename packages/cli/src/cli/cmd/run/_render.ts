import chalk from "chalk";
import figlet from "figlet";
import { vice } from "gradient-string";
import readline from "readline";
import { colors } from "../../constants";
import { CmdRunContext } from "./_types";

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

export async function pauseIfDebug(debug: boolean) {
  if (debug) {
    await waitForUserPrompt("Press Enter to continue...");
  }
}

export async function waitForUserPrompt(message: string): Promise<void> {
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

export async function renderSummary(ctx: CmdRunContext) {
  console.log(chalk.hex(colors.green)("[Done]"));

  const skippedTasksCount = ctx.results
    .values()
    .filter((r) => r.status === "skipped")
    .toArray().length;
  console.log(`• ${chalk.hex(colors.yellow)(skippedTasksCount)} from cache`);

  const succeededTasksCount = ctx.results
    .values()
    .filter((r) => r.status === "success")
    .toArray().length;
  console.log(`• ${chalk.hex(colors.yellow)(succeededTasksCount)} processed`);

  const failedTasksCount = ctx.results
    .values()
    .filter((r) => r.status === "error")
    .toArray().length;
  console.log(`• ${chalk.hex(colors.yellow)(failedTasksCount)} failed`);
}

import chalk from "chalk";
import figlet from "figlet";
import { vice } from "gradient-string";
import readline from "readline";
import { colors } from "../constants";

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
    `⚡️ ${chalk.hex(colors.green)(
      "Lingo.dev",
    )} - open-source, AI-powered i18n CLI for web & mobile localization.`,
  );
  console.log("");

  const label1 = "📚 Docs:";
  const label2 = "⭐ Star the repo:";
  const label3 = "🎮 Join Discord:";
  const maxLabelWidth = 17; // Approximate visual width accounting for emoji

  console.log(
    `${chalk.hex(colors.blue)(label1.padEnd(maxLabelWidth + 1))} ${chalk.hex(
      colors.blue,
    )("https://lingo.dev/go/docs")}`,
  ); // Docs emoji seems narrower
  console.log(
    `${chalk.hex(colors.blue)(label2.padEnd(maxLabelWidth))} ${chalk.hex(
      colors.blue,
    )("https://lingo.dev/go/gh")}`,
  );
  console.log(
    `${chalk.hex(colors.blue)(label3.padEnd(maxLabelWidth + 1))} ${chalk.hex(
      colors.blue,
    )("https://lingo.dev/go/discord")}`,
  );
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

export async function pauseIfDebug(debug: boolean) {
  if (debug) {
    await waitForUserPrompt("Press Enter to continue...");
  }
}

export async function renderSummary(results: Map<any, any>) {
  console.log(chalk.hex(colors.green)("[Done]"));

  const skippedResults = Array.from(results.values()).filter(
    (r) => r.status === "skipped",
  );
  const succeededResults = Array.from(results.values()).filter(
    (r) => r.status === "success",
  );
  const failedResults = Array.from(results.values()).filter(
    (r) => r.status === "error",
  );

  console.log(`• ${chalk.hex(colors.yellow)(skippedResults.length)} from cache`);
  console.log(`• ${chalk.hex(colors.yellow)(succeededResults.length)} processed`);
  console.log(`• ${chalk.hex(colors.yellow)(failedResults.length)} failed`);

  // Show processed files
  if (succeededResults.length > 0) {
    console.log(chalk.hex(colors.green)("\n[Processed Files]"));
    for (const result of succeededResults) {
      const displayPath = result.pathPattern?.replace("[locale]", result.targetLocale) || "unknown";
      console.log(
        `  ✓ ${chalk.dim(displayPath)} ${chalk.hex(colors.yellow)(`(${result.sourceLocale} → ${result.targetLocale})`)}`,
      );
    }
  }

  // Show cached files
  if (skippedResults.length > 0) {
    console.log(chalk.hex(colors.blue)("\n[Cached Files]"));
    for (const result of skippedResults) {
      const displayPath = result.pathPattern?.replace("[locale]", result.targetLocale) || "unknown";
      console.log(
        `  ⚡ ${chalk.dim(displayPath)} ${chalk.hex(colors.yellow)(`(${result.sourceLocale} → ${result.targetLocale})`)}`,
      );
    }
  }

  // Show failed files
  if (failedResults.length > 0) {
    console.log(chalk.hex(colors.orange)("\n[Failed Files]"));
    for (const result of failedResults) {
      const displayPath = result.pathPattern?.replace("[locale]", result.targetLocale) || "unknown";
      console.log(
        `  ❌ ${chalk.dim(displayPath)} ${chalk.hex(colors.yellow)(`(${result.sourceLocale} → ${result.targetLocale})`)}`,
      );
      console.log(
        `     ${chalk.hex(colors.white)(String(result.error?.message || "Unknown error"))}`,
      );
    }
  }
}

import { Command } from "interactive-commander";
import * as cp from "node:child_process";
import figlet from "figlet";
import chalk from "chalk";
import { vice } from "gradient-string";
import { setTimeout } from "node:timers/promises";

export const colors = {
  orange: "#ff6600",
  green: "#6ae300",
  blue: "#0090ff",
  yellow: "#ffcc00",
  grey: "#808080",
  red: "#ff0000",
};

export default new Command()
  .command("may-the-fourth")
  .description("May the Fourth be with you")
  .helpOption("-h, --help", "Show help")
  .action(async () => {
    await renderClear();
    await renderBanner();
    await renderSpacer();

    console.log(chalk.hex(colors.yellow)("Loading the Star Wars movie..."));
    await renderSpacer();

    await new Promise<void>((resolve, reject) => {
      const ssh = cp.spawn("ssh", ["starwarstel.net"], {
        stdio: "inherit",
      });

      ssh.on("close", (code) => {
        if (code !== 0) {
          console.error(`SSH process exited with code ${code}`);
          // Optionally reject the promise if the exit code is non-zero
          // reject(new Error(`SSH process exited with code ${code}`));
        }
        resolve(); // Resolve the promise when SSH closes
      });

      ssh.on("error", (err) => {
        console.error("Failed to start SSH process:", err);
        reject(err); // Reject the promise on error
      });
    });

    // This code now runs after the SSH process has finished
    await renderSpacer();
    console.log(
      `${chalk.hex(colors.green)("We hope you enjoyed it! :)")} ${chalk.hex(colors.blue)("May the Fourth be with you! 🚀")}`,
    );
    await renderSpacer();
    console.log(chalk.dim(`---`));
    await renderSpacer();
    await renderHero();
  });

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

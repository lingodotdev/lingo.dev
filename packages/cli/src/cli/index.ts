import dotenv from "dotenv";
dotenv.config();

import { InteractiveCommand } from "interactive-commander";
import figlet from "figlet";
import { vice } from "gradient-string";
import chalk from "chalk";

import authCmd from "./cmd/auth";
import initCmd from "./cmd/init";
import configCmd from "./cmd/show";
import i18nCmd from "./cmd/i18n";
import lockfileCmd from "./cmd/lockfile";
import cleanupCmd from "./cmd/cleanup";
import mcpCmd from "./cmd/mcp";
import ciCmd from "./cmd/ci";
import statusCmd from "./cmd/status";
import mayTheFourthCmd from "./cmd/may-the-fourth";

import packageJson from "../../package.json";
import run from "./cmd/run";

export default new InteractiveCommand()
  .name("lingo.dev")
  .description("Lingo.dev CLI")
  .helpOption("-h, --help", "Show help")
  .addHelpText(
    "beforeAll",
    `
${vice(
  figlet.textSync("LINGO.DEV", {
    font: "ANSI Shadow",
    horizontalLayout: "default",
    verticalLayout: "default",
  }),
)}

⚡️ AI-powered open-source CLI for web & mobile localization.

Star the the repo :) https://github.com/LingoDotDev/lingo.dev
`,
  )
  .version(`v${packageJson.version}`, "-v, --version", "Show version")
  .addCommand(initCmd)
  .interactive("-y, --no-interactive", "Disable interactive mode") // all interactive commands above
  .addCommand(i18nCmd)
  .addCommand(authCmd)
  .addCommand(configCmd)
  .addCommand(lockfileCmd)
  .addCommand(cleanupCmd)
  .addCommand(mcpCmd)
  .addCommand(ciCmd)
  .addCommand(statusCmd)
  .addCommand(mayTheFourthCmd, { hidden: true })
  .addCommand(run, { hidden: true })
  .exitOverride((err) => {
    // Exit with code 0 when help or version is displayed
    if (
      err.code === "commander.helpDisplayed" ||
      err.code === "commander.version" ||
      err.code === "commander.help"
    ) {
      process.exit(0);
    }
    process.exit(1);
  });

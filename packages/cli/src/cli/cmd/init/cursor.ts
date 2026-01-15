import { InteractiveCommand, InteractiveOption } from "interactive-commander";
import Ora from "ora";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { confirm } from "@inquirer/prompts";

// Get the directory of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Access agents.md from package root (works in both dev and production)
// Resolve from current file location: try both paths to handle dev and bundled environments
const AGENTS_MD = fs.existsSync(path.resolve(__dirname, "../agents.md"))
  ? path.resolve(__dirname, "../agents.md")
  : path.resolve(__dirname, "../../../../agents.md");
// Create .cursorrules in user's current working directory
const CURSORRULES = path.resolve(process.cwd(), ".cursorrules");

export default new InteractiveCommand()
  .command("cursor")
  .description("Initialize .cursorrules with i18n-specific instructions for Cursor AI.")
  .addOption(
    new InteractiveOption("-f, --force", "Overwrite .cursorrules without prompt.")
      .default(false)
  )
  .action(async (options) => {
    const spinner = Ora();
    // Read agents.md
    let template: string;
    try {
      template = fs.readFileSync(AGENTS_MD, "utf-8");
    } catch (err) {
      spinner.fail("Template file agents.md not found. Please reinstall the package.");
      return process.exit(1);
    }
    // Check for existing .cursorrules
    const exists = fs.existsSync(CURSORRULES);
    let shouldWrite;
    if (exists && !options.force) {
      shouldWrite = await confirm({
        message: ".cursorrules already exists. Overwrite?",
      });
      if (!shouldWrite) {
        spinner.info("Skipped: .cursorrules left unchanged.");
        return;
      }
    }
    try {
      fs.writeFileSync(CURSORRULES, template);
      spinner.succeed("Created .cursorrules");
      spinner.info(
        ".cursorrules has been created with i18n-specific instructions for Cursor AI.",
      );
    } catch (err) {
      spinner.fail(`Failed to write .cursorrules: ${err}`);
      process.exit(1);
    }
  });

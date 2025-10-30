import { InteractiveCommand, InteractiveOption } from "interactive-commander";
import Ora from "ora";
import fs from "fs";
import path from "path";
import { confirm } from "@inquirer/prompts";

const AGENTS_MD = path.resolve(process.cwd(), "packages/cli/agents.md");
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
      spinner.fail(`Template not found: ${AGENTS_MD}`);
      return process.exit(1);
    }
    // Check for existing .cursorrules
    const exists = fs.existsSync(CURSORRULES);
    let shouldWrite = true;
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
      spinner.succeed("✓ Created .cursorrules");
      spinner.info(".cursorrules has been created with i18n-specific instructions for Cursor AI.");
      if (!fs.existsSync(CURSORRULES)) {
        spinner.fail(".cursorrules not found after write");
      }
    } catch (err) {
      spinner.fail(`Failed to write .cursorrules: ${err}`);
      process.exit(1);
    }
  });
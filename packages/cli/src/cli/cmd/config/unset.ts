import { Command } from "interactive-commander";
import chalk from "chalk";
import dedent from "dedent";
import _ from "lodash";
import {
  SETTINGS_KEYS,
  loadSystemSettings,
  saveSettings,
} from "../../utils/settings";

export default new Command()
  .name("unset")
  .description("Remove a configuration key")
  .addHelpText("afterAll", `\nAvailable keys:\n  ${SETTINGS_KEYS.join("\n  ")}`)
  .argument("<key>", "Configuration key to remove")
  .helpOption("-h, --help", "Show help")
  .action(async (key: string) => {
    // Validate key first (defensive; choices() should already restrict but keep for safety).
    if (!SETTINGS_KEYS.includes(key)) {
      console.error(
        dedent`
          ${chalk.red("✖")} Unknown configuration key: ${chalk.bold(key)}
          Run ${chalk.dim("lingo.dev config unset --help")} to see available keys.
        `,
      );
      process.exitCode = 1;
      return;
    }

    // Load existing settings.
    const settings = loadSystemSettings();
    const currentValue = _.get(settings, key);

    if (!_.trim(String(currentValue || ""))) {
      console.log(`${chalk.cyan("ℹ")} ${chalk.bold(key)} is not set.`);
      return;
    } else {
      const updated: any = _.cloneDeep(settings);
      _.unset(updated, key);
      try {
        saveSettings(updated as any);
        console.log(
          `${chalk.green("✔")} Removed configuration key ${chalk.bold(key)}`,
        );
      } catch (err) {
        console.error(
          chalk.red(
            `✖ Failed to save configuration: ${chalk.dim(
              err instanceof Error ? err.message : String(err),
            )}`,
          ),
        );
        process.exitCode = 1;
      }
    }
  });

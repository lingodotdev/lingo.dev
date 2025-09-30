import { Command } from "interactive-commander";
import chalk from "chalk";
import dedent from "dedent";
import _ from "lodash";
import {
  SETTINGS_KEYS,
  loadSystemSettings,
  saveSettings,
  getSettingsDisplayPath,
} from "../../utils/settings";

export default new Command()
  .name("set")
  .description(`Set or update a CLI setting in ${getSettingsDisplayPath()}`)
  .addHelpText("afterAll", `\nAvailable keys:\n  ${SETTINGS_KEYS.join("\n  ")}`)
  .argument(
    "<key>",
    "Configuration key to set (dot notation, e.g., auth.apiKey)",
  )
  .argument("<value>", "The configuration value to set")
  .helpOption("-h, --help", "Show help")
  .action(async (key: string, value: string) => {
    if (!SETTINGS_KEYS.includes(key)) {
      console.error(
        dedent`
          ${chalk.red("✖")} Unknown configuration key: ${chalk.bold(key)}
          Run ${chalk.dim("lingo.dev config set --help")} to see available keys.
        `,
      );
      process.exitCode = 1;
      return;
    }

    const current = loadSystemSettings();
    const updated: any = _.cloneDeep(current);
    _.set(updated, key, value);

    try {
      saveSettings(updated as any);
      console.log(`${chalk.green("✔")} Set ${chalk.bold(key)}`);
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
  });

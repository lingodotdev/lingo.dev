import { Command } from "interactive-commander";
import chalk from "chalk";
import _ from "lodash";
import { SETTINGS_KEYS, loadSystemSettings } from "../../utils/settings";
import dedent from "dedent";

export default new Command()
  .name("get")
  .description(
    "Print the value currently stored for a CLI setting in ~/.lingodotdevrc",
  )
  .addHelpText("afterAll", `\nAvailable keys:\n  ${SETTINGS_KEYS.join("\n  ")}`)
  .argument(
    "<key>",
    "Setting key to read (must match one of the listed dot-paths)",
  )
  .helpOption("-h, --help", "Show help")
  .action(async (key: string) => {
    // Validate that the provided key is one of the recognised configuration keys.
    if (!SETTINGS_KEYS.includes(key)) {
      console.error(
        dedent`
          ${chalk.red("✖")} Unknown configuration key: ${chalk.bold(key)}
          Run ${chalk.dim("lingo.dev config get --help")} to see available keys.
        `,
      );
      process.exitCode = 1;
      return;
    }

    const settings = loadSystemSettings();
    const value = _.get(settings, key);

    if (!value) {
      // Key is valid but not set in the configuration file.
      console.log(`${chalk.cyan("ℹ")} ${chalk.bold(key)} is not set.`);
      return;
    }

    if (typeof value === "object") {
      console.log(JSON.stringify(value, null, 2));
    } else {
      console.log(value);
    }
  });

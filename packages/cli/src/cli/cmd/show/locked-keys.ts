import { Command } from "interactive-commander";
import Ora from "ora";
import { getConfig } from "../../utils/config";
import { CLIError } from "../../utils/errors";
import { getBuckets } from "../../utils/buckets";
import { executeKeyCommand } from "./_shared-key-command";

export default new Command()
  .command("locked-keys")
  .description(
    "Show which key-value pairs in source files match lockedKeys patterns",
  )
  .option("--bucket <name>", "Only show locked keys for a specific bucket")
  .helpOption("-h, --help", "Show help")
  .action(async (options) => {
    const ora = Ora();
    try {
      const i18nConfig = await getConfig();

      if (!i18nConfig) {
        throw new CLIError({
          message:
            "i18n.json not found. Please run `lingo.dev init` to initialize the project.",
          docUrl: "i18nNotFound",
        });
      }

      const buckets = getBuckets(i18nConfig);

      await executeKeyCommand(i18nConfig, buckets, options, {
        filterType: "lockedKeys",
        displayName: "locked",
      });
    } catch (error: any) {
      ora.fail(error.message);
      process.exit(1);
    }
  });

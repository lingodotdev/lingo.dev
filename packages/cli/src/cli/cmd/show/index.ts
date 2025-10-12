import { Command } from "interactive-commander";
import _ from "lodash";
import configCmd from "./config";
import localeCmd from "./locale";
import filesCmd from "./files";
import lockedKeysCmd from "./locked-keys";
import ignoredKeysCmd from "./ignored-keys";

export default new Command()
  .command("show")
  .description("Display configuration, locales, and file paths")
  .helpOption("-h, --help", "Show help")
  .addCommand(configCmd)
  .addCommand(localeCmd)
  .addCommand(filesCmd)
  .addCommand(lockedKeysCmd)
  .addCommand(ignoredKeysCmd);

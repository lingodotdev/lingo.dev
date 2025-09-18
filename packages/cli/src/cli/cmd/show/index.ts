import { Command } from "interactive-commander";
import _ from "lodash";
import configCmd from "./config";
import localeCmd from "./locale";
import filesCmd from "./files";

export default new Command()
  .command("show")
  .description(
    "Display project information including configuration settings, supported locales, and file paths",
  )
  .helpOption("-h, --help", "Show help")
  .addCommand(configCmd)
  .addCommand(localeCmd)
  .addCommand(filesCmd);

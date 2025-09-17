import { Command } from "interactive-commander";
import _ from "lodash";
import configCmd from "./config";
import localeCmd from "./locale";
import filesCmd from "./files";

export default new Command()
  .command("show")
  .description(
    "Inspect project metadata such as the merged config, supported locales, and tracked files",
  )
  .helpOption("-h, --help", "Show help")
  .addCommand(configCmd)
  .addCommand(localeCmd)
  .addCommand(filesCmd);

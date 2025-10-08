import { Command } from "interactive-commander";
import { getSettingsDisplayPath } from "../../utils/settings";

import setCmd from "./set";
import unsetCmd from "./unset";
import getCmd from "./get";

export default new Command()
  .command("config")
  .description(
    `Manage CLI settings (authentication, API keys) stored in ${getSettingsDisplayPath()}`,
  )
  .helpOption("-h, --help", "Show help")
  .addCommand(setCmd)
  .addCommand(unsetCmd)
  .addCommand(getCmd);

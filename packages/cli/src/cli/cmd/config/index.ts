import { Command } from "interactive-commander";

import setCmd from "./set";
import unsetCmd from "./unset";
import getCmd from "./get";

export default new Command()
  .command("config")
  .description(
    "Manage CLI settings (authentication, API keys) stored in ~/.lingodotdevrc",
  )
  .helpOption("-h, --help", "Show help")
  .addCommand(setCmd)
  .addCommand(unsetCmd)
  .addCommand(getCmd);

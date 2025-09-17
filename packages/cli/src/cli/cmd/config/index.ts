import { Command } from "interactive-commander";

import setCmd from "./set";
import unsetCmd from "./unset";
import getCmd from "./get";

export default new Command()
  .command("config")
  .description(
    "Inspect and modify the CLI settings saved in ~/.lingodotdevrc",
  )
  .helpOption("-h, --help", "Show help")
  .addCommand(setCmd)
  .addCommand(unsetCmd)
  .addCommand(getCmd);

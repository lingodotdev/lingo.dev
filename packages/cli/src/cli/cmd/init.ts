import { InteractiveCommand } from "interactive-commander";
import projectInitCmd from "./init/project";
import cursorInitCmd from "./init/cursor";

export default new InteractiveCommand()
  .command("init")
  .description("Project initializer commands")
  .addCommand(projectInitCmd) // main project initializer
  .addCommand(cursorInitCmd) // new cursor subcommand
  .helpOption("-h, --help", "Show help");

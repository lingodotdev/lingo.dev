import { Command } from "interactive-commander";

import captureCmd from "./capture";

export default new Command()
  .command("review")
  .description(
    "Context snapshot utilities for building the translator review portal.",
  )
  .helpOption("-h, --help", "Show help")
  .addCommand(captureCmd);

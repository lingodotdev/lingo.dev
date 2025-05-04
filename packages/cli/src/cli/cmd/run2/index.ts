import { Command } from "interactive-commander";
import React from "react";
import { render } from "ink";
import Run2UI from "./ui";

export default new Command()
  .command("run2")
  .description("Demo Ink UI for Lingo.dev")
  .helpOption("-h, --help", "Show help")
  .action(async () => {
    const { waitUntilExit } = render(React.createElement(Run2UI));
    await waitUntilExit();
  });

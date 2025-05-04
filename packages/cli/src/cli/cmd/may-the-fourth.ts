import { Command } from "interactive-commander";
import * as cp from "node:child_process";

export default new Command()
  .command("may-the-fourth")
  .description("May the Fourth be with you")
  .helpOption("-h, --help", "Show help")
  .action(async () => {
    console.log("May the Fourth be with you! Streaming Star Wars ASCII art...");
    
    const ssh = cp.spawn("ssh", ["starwarstel.net"], {
      stdio: "inherit", // Inherit stdio to show the ASCII art in the terminal
    });

    ssh.on("close", (code) => {
      if (code !== 0) {
        console.error(`SSH process exited with code ${code}`);
      }
    });
  });

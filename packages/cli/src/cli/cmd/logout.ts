import { Command } from "interactive-commander";
import Ora from "ora";
import { getSettings, saveSettings } from "../utils/settings";

export default new Command()
  .command("logout")
  .description("Sign out from Lingo.dev API")
  .helpOption("-h, --help", "Show help")
  .action(async () => {
    try {
      const settings = await getSettings(undefined);
      settings.auth.apiKey = "";
      await saveSettings(settings);
      Ora().succeed("Successfully logged out");
    } catch (error: any) {
      Ora().fail(error.message);
      process.exit(1);
    }
  });

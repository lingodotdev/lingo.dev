import { Command } from "interactive-commander";
import Ora from "ora";
import { getSettings, saveSettings } from "../utils/settings";
import { createAuthenticator } from "../utils/auth";
import { exitGracefully } from "../utils/exit-gracefully";

export default new Command()
  .command("auth")
  .description("Show current authentication status and user email")
  .helpOption("-h, --help", "Show help")
  .action(async () => {
    try {
      const settings = await getSettings(undefined);
      const authenticator = createAuthenticator({
        apiUrl: settings.auth.apiUrl,
        apiKey: settings.auth.apiKey!,
      });
      const auth = await authenticator.whoami();
      if (!auth) {
        Ora().warn("Not authenticated");
      } else {
        Ora().succeed(`Authenticated as ${auth.email}`);
      }
    } catch (error: any) {
      Ora().fail(error.message);
      exitGracefully(1);
    }
  });

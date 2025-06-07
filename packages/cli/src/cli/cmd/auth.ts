import { Command } from "interactive-commander";
import Ora from "ora";
import { getSettings, saveSettings } from "../utils/settings";
import { createAuthenticator } from "../utils/auth";

export default new Command()
  .command("auth")
  .description("Show current authentication status")
  .helpOption("-h, --help", "Show help")
  // Deprecated options, safe to remove after September 2025
  .option(
    "--login",
    "Login to your account (deprecated: use 'lingo.dev login' instead)",
  )
  .option(
    "--logout",
    "Logout from your account (deprecated: use 'lingo.dev logout' instead)",
  )
  .action(async (options) => {
    try {
      // Handle deprecated login option
      if (options.login) {
        Ora().warn(
          "⚠️  DEPRECATED: '--login' is deprecated. Please use 'lingo.dev login' instead.",
        );
        process.exit(1);
      }

      // Handle deprecated logout option
      if (options.logout) {
        Ora().warn(
          "⚠️  DEPRECATED: '--logout' is deprecated. Please use 'lingo.dev logout' instead.",
        );
        process.exit(1);
      }

      // Default behavior: show authentication status
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
      process.exit(1);
    }
  });

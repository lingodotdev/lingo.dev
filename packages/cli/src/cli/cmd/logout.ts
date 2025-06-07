import { Command } from "interactive-commander";
import Ora from "ora";
import { getSettings, saveSettings } from "../utils/settings";
import {
  renderClear,
  renderSpacer,
  renderBanner,
  renderHero,
} from "../utils/ui";

export default new Command()
  .command("logout")
  .description("Sign out from Lingo.dev API")
  .helpOption("-h, --help", "Show help")
  .action(async () => {
    try {
      await renderClear();
      await renderSpacer();
      await renderBanner();
      await renderHero();
      await renderSpacer();

      const settings = await getSettings(undefined);
      settings.auth.apiKey = "";
      await saveSettings(settings);
      Ora().succeed("Successfully logged out");
    } catch (error: any) {
      Ora().fail(error.message);
      process.exit(1);
    }
  });

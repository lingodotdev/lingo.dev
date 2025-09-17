import { Command } from "interactive-commander";
import Ora from "ora";
import express from "express";
import cors from "cors";
import open from "open";
import readline from "readline/promises";
import { getSettings, saveSettings } from "../utils/settings";
import {
  renderClear,
  renderSpacer,
  renderBanner,
  renderHero,
} from "../utils/ui";

export default new Command()
  .command("login")
  .description(
    "Launch the browser-based login flow and save the issued API key to ~/.lingodotdevrc",
  )
  .helpOption("-h, --help", "Show help")
  .action(async () => {
    try {
      await renderClear();
      await renderSpacer();
      await renderBanner();
      await renderHero();
      await renderSpacer();

      const settings = await getSettings(undefined);
      const apiKey = await login(settings.auth.webUrl);
      settings.auth.apiKey = apiKey;
      await saveSettings(settings);
      Ora().succeed("Successfully logged in");
    } catch (error: any) {
      Ora().fail(error.message);
      process.exit(1);
    }
  });

export async function login(webAppUrl: string) {
  await readline
    .createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    .question(
      `
Press Enter to open the browser for authentication.

---

Having issues? Put LINGODOTDEV_API_KEY in your .env file instead.
    `.trim() + "\n",
    );

  const spinner = Ora().start("Waiting for the API key");
  const apiKey = await waitForApiKey(async (port) => {
    await open(`${webAppUrl}/app/cli?port=${port}`, { wait: false });
  });
  spinner.succeed("API key received");

  return apiKey;
}

async function waitForApiKey(cb: (port: string) => void): Promise<string> {
  const app = express();
  app.use(express.json());
  app.use(cors());

  return new Promise((resolve) => {
    const server = app.listen(0, async () => {
      const port = (server.address() as any).port;
      cb(port.toString());
    });

    app.post("/", (req, res) => {
      const apiKey = req.body.apiKey;
      res.end();
      server.close(() => {
        resolve(apiKey);
      });
    });
  });
}

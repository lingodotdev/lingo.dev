import { Command } from "interactive-commander";
import Ora from "ora";
import express from "express";
import cors from "cors";
import open from "open";
import readline from "readline/promises";
import { getSettings, saveSettings } from "../utils/settings";
import { createAuthenticator } from "../utils/auth";

export default new Command()
  .command("auth")
  .description("Show current authentication status")
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
      process.exit(1);
    }
  });

async function waitForApiKey(cb: (port: string) => void): Promise<string> {
  // start a sever on an ephemeral port and return the port number
  // from the function
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

import { Command } from "interactive-commander";
import Ora from "ora";
import open from "open";
import readline from "readline/promises";
import { randomBytes } from "crypto";
import { getSettings, saveSettings } from "../utils/settings";
import {
  renderClear,
  renderSpacer,
  renderBanner,
  renderHero,
} from "../utils/ui";

const POLL_INTERVAL_MS = 2_000;
const POLL_TIMEOUT_MS = 15 * 60 * 1_000;

export default new Command()
  .command("login")
  .description(
    "Open browser to authenticate with lingo.dev and save your API key",
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
      const apiKey = await login(settings.auth.apiUrl);
      settings.auth.apiKey = apiKey;
      await saveSettings(settings);
      Ora().succeed("Successfully logged in");
    } catch (error: any) {
      Ora().fail(error.message);
      process.exit(1);
    }
  });

export async function login(apiUrl: string) {
  await readline
    .createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    .question(
      `
Press Enter to open the browser for authentication.

---

Having issues? Put LINGO_API_KEY in your .env file instead.
    `.trim() + "\n",
    );

  const verifier = randomBytes(32).toString("base64url");

  const createSpinner = Ora().start("Starting authentication session");
  const session = await createCliSession(apiUrl, verifier);
  createSpinner.succeed("Authentication session started");

  await open(session.verifyUrl, { wait: false });

  const pollSpinner = Ora().start("Waiting for browser confirmation");
  try {
    const apiKey = await pollForApiKey(apiUrl, session.id, verifier);
    pollSpinner.succeed("API key received");
    return apiKey;
  } catch (error) {
    pollSpinner.fail();
    throw error;
  }
}

type CreateSessionResponse = {
  id: string;
  expiresAt: string;
  verifyUrl: string;
};

async function createCliSession(apiUrl: string, verifier: string): Promise<CreateSessionResponse> {
  const res = await fetch(`${apiUrl}/cli-sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ verifier }),
  });
  if (!res.ok) {
    throw new Error(`Failed to start CLI session (HTTP ${res.status})`);
  }
  return (await res.json()) as CreateSessionResponse;
}

async function pollForApiKey(apiUrl: string, sessionId: string, verifier: string): Promise<string> {
  const deadline = Date.now() + POLL_TIMEOUT_MS;

  while (Date.now() < deadline) {
    const res = await fetch(`${apiUrl}/cli-sessions/${sessionId}`, {
      method: "GET",
      headers: { "X-Cli-Verifier": verifier },
    });

    if (res.ok) {
      const body = (await res.json()) as
        | { status: "pending" }
        | { status: "completed"; apiKey: string };
      if (body.status === "completed") return body.apiKey;
    } else if (res.status === 404) {
      throw new Error("CLI session not found. Please rerun the command.");
    } else if (res.status >= 400 && res.status < 500) {
      const body = await res.text();
      throw new Error(`CLI authentication failed: ${body || `HTTP ${res.status}`}`);
    }
    // 5xx: transient — keep polling.

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  throw new Error("Timed out waiting for browser confirmation");
}

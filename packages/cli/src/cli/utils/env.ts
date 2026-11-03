import dotenv from "dotenv";

const PROCESS_ONLY_KEYS = new Set(["EDITOR", "VISUAL"]);

/**
 * Loads `.env` from the current directory into `process.env` without
 * overriding existing values. Editor selection is taken from the user's
 * environment only.
 */
export function loadDotenv(): void {
  const parsed: Record<string, string> = {};
  dotenv.config({ processEnv: parsed });

  for (const [key, value] of Object.entries(parsed)) {
    if (PROCESS_ONLY_KEYS.has(key)) {
      continue;
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

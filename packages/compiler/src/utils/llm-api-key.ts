import { getRc } from "./rc";
import _ from "lodash";
import * as dotenv from "dotenv";

// Generic function to retrieve key from process.env, with .env file as fallback
function getKeyFromEnv(envVarName: string): string | undefined {
  const ephemeralEnv = {} as Record<string, string>;
  dotenv.config({ processEnv: ephemeralEnv });
  return ephemeralEnv[envVarName];
}

// Generic function to retrieve key from .lingodotdevrc file
function getKeyFromRc(rcPath: string): string | undefined {
  const rc = getRc();
  const result = _.get(rc, rcPath);
  return typeof result === "string" ? result : undefined;
}

export function getGroqKey() {
  return getGroqKeyFromEnv() || getGroqKeyFromRc();
}

export function getGroqKeyFromRc() {
  return getKeyFromRc("llm.groqApiKey");
}

export function getGroqKeyFromEnv() {
  return getKeyFromEnv("GROQ_API_KEY");
}

export function getGoogleKey() {
  return getGoogleKeyFromEnv() || getGoogleKeyFromRc();
}

export function getGoogleKeyFromRc() {
  return getKeyFromRc("llm.googleApiKey");
}

export function getGoogleKeyFromEnv() {
  return getKeyFromEnv("GOOGLE_API_KEY");
}

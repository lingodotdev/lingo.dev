import { getRc } from "./rc";
import _ from "lodash";
import * as dotenv from "dotenv";
import path from "path";

// Generic function to retrieve key from process.env, with .env file as fallback
export function getKeyFromEnv(envVarName: string): string | undefined {
  if (process.env[envVarName]) {
    return process.env[envVarName];
  }
  const result = dotenv.config({
    path: [
      path.resolve(process.cwd(), ".env"),
      path.resolve(process.cwd(), ".env.local"),
      path.resolve(process.cwd(), ".env.development"),
    ],
  });
  return result?.parsed?.[envVarName];
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

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

export function getLingoDotDevKeyFromEnv() {
  return getKeyFromEnv("LINGODOTDEV_API_KEY");
}

export function getLingoDotDevKeyFromRc() {
  return getKeyFromRc("auth.apiKey");
}

export function getLingoDotDevKey() {
  return getLingoDotDevKeyFromEnv() || getLingoDotDevKeyFromRc();
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

export function getOpenRouterKey() {
  return getOpenRouterKeyFromEnv() || getOpenRouterKeyFromRc();
}
export function getOpenRouterKeyFromRc() {
  return getKeyFromRc("llm.openrouterApiKey");
}
export function getOpenRouterKeyFromEnv() {
  return getKeyFromEnv("OPENROUTER_API_KEY");
}

export function getAimlApiKey() {
  return getAimlApiKeyFromEnv() || getAimlApiKeyFromRc();
}

export function getAimlApiKeyFromRc() {
  return getKeyFromRc("llm.aimlApiKey");
}

export function getAimlApiKeyFromEnv() {
  return getKeyFromEnv("AIMLAPI_API_KEY");
}

export function getMistralKey() {
  return getMistralKeyFromEnv() || getMistralKeyFromRc();
}

export function getMistralKeyFromRc() {
  return getKeyFromRc("llm.mistralApiKey");
}

export function getMistralKeyFromEnv() {
  return getKeyFromEnv("MISTRAL_API_KEY");
}

import { getRc } from "./rc";
import _ from "lodash";
import * as dotenv from "dotenv";

export function getGroqKey() {
  return getGroqKeyFromEnv() || getGroqKeyFromRc();
}

export function getGroqKeyFromRc() {
  const rc = getRc();
  const result = _.get(rc, "llm.groqApiKey");
  return result;
}

// retrieve key from process.env, with .env file as fallback
export function getGroqKeyFromEnv() {
  // First check if it's already in process.env
  if (process.env.GROQ_API_KEY) {
    return process.env.GROQ_API_KEY;
  }

  // If not found in process.env, try to load from .env file
  try {
    const result = dotenv.config();
    if (result.parsed && result.parsed.GROQ_API_KEY) {
      return result.parsed.GROQ_API_KEY;
    }
  } catch (error) {
    // Silently ignore dotenv errors (file not found, etc.)
  }

  return undefined;
}

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
  const ephemeralEnv = {
    GROQ_API_KEY: process.env.GROQ_API_KEY,
  } as {
    GROQ_API_KEY?: string;
  };
  dotenv.config({ processEnv: ephemeralEnv });
  return ephemeralEnv.GROQ_API_KEY;
}

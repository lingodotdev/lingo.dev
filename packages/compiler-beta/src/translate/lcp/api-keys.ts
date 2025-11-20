import * as dotenv from "dotenv";
import * as path from "path";

/**
 * Get API key from environment variables
 * Checks process.env first, then .env files
 */
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

export function getGroqKey() {
  return getKeyFromEnv("GROQ_API_KEY");
}

export function getGoogleKey() {
  return getKeyFromEnv("GOOGLE_API_KEY");
}

export function getOpenRouterKey() {
  return getKeyFromEnv("OPENROUTER_API_KEY");
}

export function getMistralKey() {
  return getKeyFromEnv("MISTRAL_API_KEY");
}

export function getLingoDotDevKey() {
  return getKeyFromEnv("LINGODOTDEV_API_KEY");
}

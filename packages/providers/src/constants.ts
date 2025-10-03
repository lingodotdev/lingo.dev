export const SUPPORTED_PROVIDERS = [
  "groq",
  "openai",
  "anthropic",
  "google",
  "openrouter",
  "ollama",
  "mistral",
] as const;

export type ProviderId = (typeof SUPPORTED_PROVIDERS)[number];

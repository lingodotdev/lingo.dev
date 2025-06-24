import { openrouter } from "@openrouter/ai-sdk-provider";

export const providerDetails: Record<
  string,
  {
    name: string; // Display name (e.g., "Groq", "Google")
    apiKeyEnvVar?: string; // Environment variable name (e.g., "GROQ_API_KEY")
    apiKeyConfigKey?: string; // Config key if applicable (e.g., "llm.groqApiKey")
    getKeyLink: string; // Link to get API key
    docsLink: string; // Link to API docs for troubleshooting
  }
> = {
  groq: {
    name: "Groq",
    apiKeyEnvVar: "GROQ_API_KEY",
    apiKeyConfigKey: "llm.groqApiKey",
    getKeyLink: "https://groq.com",
    docsLink: "https://console.groq.com/docs/errors",
  },
  google: {
    name: "Google",
    apiKeyEnvVar: "GOOGLE_API_KEY",
    apiKeyConfigKey: "llm.googleApiKey",
    getKeyLink: "https://ai.google.dev/",
    docsLink: "https://ai.google.dev/gemini-api/docs/troubleshooting",
  },
  openrouter: {
    name: "OpenRouter",
    apiKeyEnvVar: "OPENROUTER_API_KEY",
    apiKeyConfigKey: "llm.openrouterApiKey",
    getKeyLink: "https://openrouter.ai",
    docsLink: "https://openrouter.ai/docs",
  },
  ollama: {
    name: "Ollama",
    apiKeyEnvVar: undefined, // Ollama doesn't require an API key
    apiKeyConfigKey: undefined, // Ollama doesn't require an API key
    getKeyLink: "https://ollama.com/download",
    docsLink: "https://github.com/ollama/ollama/tree/main/docs",
  },
  mistral: {
    name: "Mistral",
    apiKeyEnvVar: "MISTRAL_API_KEY",
    apiKeyConfigKey: "llm.mistralApiKey",
    getKeyLink: "https://console.mistral.ai",
    docsLink: "https://docs.mistral.ai",
  },
};

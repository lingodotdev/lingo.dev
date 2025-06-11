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
  ollama: {
    name: "Ollama",
    apiKeyEnvVar: undefined, // Ollama doesn't use env vars for keys
    apiKeyConfigKey: undefined, // Ollama doesn't use config keys for keys
    getKeyLink: "https://ollama.com/download",
    docsLink: "https://github.com/ollama/ollama/tree/main/docs",
  },
};

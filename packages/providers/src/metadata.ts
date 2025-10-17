export interface ProviderMetadata {
  name: string;
  apiKeyEnvVar?: string;
  apiKeyConfigKey?: string;
  getKeyLink: string;
  docsLink: string;
}

export const PROVIDER_METADATA = {
  groq: {
    name: "Groq",
    apiKeyEnvVar: "GROQ_API_KEY",
    apiKeyConfigKey: "llm.groqApiKey",
    getKeyLink: "https://groq.com",
    docsLink: "https://console.groq.com/docs/errors",
  },
  openai: {
    name: "OpenAI",
    apiKeyEnvVar: "OPENAI_API_KEY",
    apiKeyConfigKey: "llm.openaiApiKey",
    getKeyLink: "https://platform.openai.com",
    docsLink: "https://platform.openai.com/docs",
  },
  anthropic: {
    name: "Anthropic",
    apiKeyEnvVar: "ANTHROPIC_API_KEY",
    apiKeyConfigKey: "llm.anthropicApiKey",
    getKeyLink: "https://console.anthropic.com",
    docsLink: "https://docs.anthropic.com",
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
    apiKeyEnvVar: undefined,
    apiKeyConfigKey: undefined,
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
} as const satisfies Record<string, ProviderMetadata>;

export type ProviderId = keyof typeof PROVIDER_METADATA;

// Derive supported providers from metadata keys to prevent drift
export const SUPPORTED_PROVIDERS = Object.freeze(
  Object.keys(PROVIDER_METADATA),
) as readonly string[] as readonly ProviderId[];

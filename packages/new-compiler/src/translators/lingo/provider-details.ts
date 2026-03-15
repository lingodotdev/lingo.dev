/**
 * Provider details for error messages and documentation links
 */

export interface ProviderDetails {
  name: string; // Display name (e.g., "Groq", "Google")
  apiKeyEnvVar?: string; // Environment variable name (e.g., "GROQ_API_KEY")
  apiKeyConfigKey?: string; // Config key if applicable (e.g., "llm.groqApiKey")
  getKeyLink: string; // Link to get API key
  docsLink: string; // Link to API docs for troubleshooting
}

export const providerDetails: Record<string, ProviderDetails> = {
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
  "lingo.dev": {
    name: "Lingo.dev",
    apiKeyEnvVar: "LINGODOTDEV_API_KEY",
    apiKeyConfigKey: "auth.apiKey",
    getKeyLink: "https://lingo.dev",
    docsLink: "https://lingo.dev/docs",
  },
};

/**
 * Format error message when API keys are missing for configured providers
 * @param missingProviders List of providers that are missing API keys
 * @param allProviders Optional: list of all configured providers for context
 */
export function formatNoApiKeysError(
  missingProviders: string[],
  allProviders?: string[],
): string {
  const lines: string[] = [];

  if (missingProviders.length === 0) {
    // No missing providers (shouldn't happen, but handle it)
    return "Translation API keys validated successfully.";
  }

  // Header
  if (allProviders && allProviders.length > missingProviders.length) {
    lines.push(
      `Missing API keys for ${missingProviders.length} of ${allProviders.length} configured providers.`,
    );
  } else {
    lines.push(`Missing API keys for configured translation providers.`);
  }

  // List missing providers with their environment variables and links
  lines.push(`Missing API keys for:`);
  for (const providerId of missingProviders) {
    const details = providerDetails[providerId];
    if (details) {
      if (details.apiKeyEnvVar) {
        lines.push(
          `   • ${details.name}: ${details.apiKeyEnvVar}  →  ${details.getKeyLink}`,
        );
      } else {
        lines.push(`   • ${details.name}: ${details.getKeyLink}`);
      }
    } else {
      lines.push(`   • ${providerId}: (unknown provider)`);
    }
  }

  lines.push(
    ``,
    `👉 Set the required API keys:`,
    `   1. Add to .env file (recommended)`,
    `   2. Or export in terminal: export API_KEY_NAME=<your-key>`,
    ``,
  );

  return lines.join("\n");
}

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
 * Get provider details by ID
 */
export function getProviderDetails(providerId: string): ProviderDetails | null {
  return providerDetails[providerId] || null;
}

/**
 * Get all providers that require API keys
 */
export function getProvidersRequiringKeys(): string[] {
  return Object.keys(providerDetails).filter(
    (id) => providerDetails[id].apiKeyEnvVar !== undefined,
  );
}

/**
 * Format a helpful error message when API key is missing
 */
export function formatMissingApiKeyError(providerId: string): string {
  const details = providerDetails[providerId];

  if (!details) {
    return `Unknown provider: ${providerId}`;
  }

  if (!details.apiKeyEnvVar) {
    // Provider doesn't need API key (like Ollama)
    return `Provider ${details.name} doesn't require an API key. Check connection at ${details.getKeyLink}`;
  }

  return [
    `⚠️  ${details.name} API key not found.`,
    ``,
    `To use ${details.name} for translations, you need to set ${details.apiKeyEnvVar}.`,
    ``,
    `👉 Set the API key:`,
    `   1. Add to .env file: ${details.apiKeyEnvVar}=<your-api-key>`,
    `   2. Or export in terminal: export ${details.apiKeyEnvVar}=<your-api-key>`,
    ``,
    `⭐️ Get your API key:`,
    `   ${details.getKeyLink}`,
    ``,
    `📚 Documentation:`,
    `   ${details.docsLink}`,
  ].join("\n");
}

/**
 * Format a helpful error message when API call fails
 */
export function formatApiCallError(
  providerId: string,
  targetLocale: string,
  errorMessage: string,
): string {
  const details = providerDetails[providerId];

  if (!details) {
    return `Translation failed with unknown provider "${providerId}": ${errorMessage}`;
  }

  // Check for common error patterns
  const isInvalidApiKey =
    errorMessage.toLowerCase().includes("invalid api key") ||
    errorMessage.toLowerCase().includes("unauthorized") ||
    errorMessage.toLowerCase().includes("authentication failed");

  if (isInvalidApiKey) {
    return [
      `⚠️  ${details.name} API key is invalid.`,
      ``,
      `Error details: ${errorMessage}`,
      ``,
      `👉 Please check your API key:`,
      details.apiKeyEnvVar
        ? `   Environment variable: ${details.apiKeyEnvVar}`
        : "",
      ``,
      `⭐️ Get a new API key:`,
      `   ${details.getKeyLink}`,
      ``,
      `📚 Troubleshooting:`,
      `   ${details.docsLink}`,
    ]
      .filter(Boolean)
      .join("\n");
  }

  // Generic API error
  return [
    `⚠️  Translation to "${targetLocale}" failed via ${details.name}.`,
    ``,
    `Error details: ${errorMessage}`,
    ``,
    `📚 Check ${details.name} documentation for more details:`,
    `   ${details.docsLink}`,
    ``,
    `💡 Tips:`,
    `   - Check your API quota/credits`,
    `   - Verify the model is available for your account`,
    `   - Check ${details.name} status page for outages`,
  ].join("\n");
}

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
      `⚠️  Missing API keys for ${missingProviders.length} of ${allProviders.length} configured providers.`,
    );
  } else {
    lines.push(`⚠️  Missing API keys for configured translation providers.`);
  }

  lines.push(``);

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
    `💡 In development mode, the app will auto-fallback to pseudotranslator.`,
    `   In production, all configured providers must have valid API keys.`,
  );

  return lines.join("\n");
}

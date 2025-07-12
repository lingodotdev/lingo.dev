#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { providerDetails } from "../src/lib/lcp/api/provider-details.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Types for models.dev API response
interface ModelsDevModelInfo {
  id: string;
  name: string;
  attachment: boolean;
  reasoning: boolean;
  temperature: boolean;
  tool_call: boolean;
  knowledge: string;
  release_date: string;
  last_updated: string;
  modalities: {
    input: string[];
    output: string[];
  };
  open_weights: boolean;
  cost: {
    input: number;
    output: number;
    cache_read?: number;
    cache_write?: number;
  };
  limit: {
    context: number;
    output: number;
  };
}

interface ModelsDevProvider {
  id: string;
  env: string[];
  npm?: string;
  api?: string;
  name: string;
  doc: string;
  models: {
    [modelName: string]: ModelsDevModelInfo;
  };
}

interface ModelsDevResponse {
  [providerName: string]: ModelsDevProvider;
}

// Simplified model interface for our processing
interface ProcessedModel {
  id: string;
  provider: string;
  name: string;
}

// Get supported providers from the actual provider-details.ts file
const SUPPORTED_PROVIDERS = Object.keys(providerDetails);
console.log(
  "📋 Supported providers from provider-details.ts:",
  SUPPORTED_PROVIDERS,
);

// Provider name mapping for models.dev vs our internal names
const PROVIDER_NAME_MAPPING: Record<string, string> = {
  mistralai: "mistral", // models.dev uses "mistralai", we use "mistral"
  google: "google",
  groq: "groq",
  openrouter: "openrouter",
  ollama: "ollama",
};

/**
 * Fetch model data from models.dev API
 */
async function fetchModels(): Promise<ProcessedModel[]> {
  try {
    console.log("🌐 Fetching model data from models.dev...");

    const response = await fetch("https://models.dev/api.json");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: ModelsDevResponse = await response.json();

    // Convert the nested structure to a flat array of processed models
    const processedModels: ProcessedModel[] = [];

    for (const [providerName, providerInfo] of Object.entries(data)) {
      for (const [modelKey, modelInfo] of Object.entries(providerInfo.models)) {
        processedModels.push({
          id: `${providerName}/${modelKey}`,
          provider: providerName,
          name: modelInfo.name || modelKey,
        });
      }
    }

    console.log(`📦 Fetched ${processedModels.length} models from models.dev`);

    return processedModels;
  } catch (error) {
    console.error("❌ Failed to fetch from models.dev API:", error);
    throw error;
  }
}

/**
 * Group models by provider and extract model names
 */
function groupModelsByProvider(
  models: ProcessedModel[],
): Record<string, Set<string>> {
  const grouped: Record<string, Set<string>> = {};

  for (const model of models) {
    // Extract provider and model name from ID (format: provider/model-name)
    const [providerFromId, ...modelParts] = model.id.split("/");
    const modelName = modelParts.join("/"); // In case model name contains slashes

    // Use provider from ID, fallback to provider field
    let provider = providerFromId || model.provider;

    // Apply provider name mapping
    if (PROVIDER_NAME_MAPPING[provider]) {
      provider = PROVIDER_NAME_MAPPING[provider];
    }

    // Only include supported providers
    if (!SUPPORTED_PROVIDERS.includes(provider)) {
      continue;
    }

    if (!grouped[provider]) {
      grouped[provider] = new Set();
    }

    // Use model name from ID if available, otherwise use name field
    const finalModelName = modelName || model.name || model.id;
    grouped[provider].add(finalModelName);
  }

  return grouped;
}

/**
 * Generate TypeScript type definitions
 */
function generateTypeDefinitions(
  groupedModels: Record<string, Set<string>>,
): string {
  const timestamp = new Date().toISOString();
  const modelCount = Object.values(groupedModels).reduce(
    (sum, models) => sum + models.size,
    0,
  );

  let content = `/**
 * Auto-generated model identifiers from models.dev
 * Last updated: ${timestamp}
 * Total models: ${modelCount}
 * 
 * @see https://models.dev for latest model information
 */

`;

  // Generate provider-specific model types
  for (const [provider, models] of Object.entries(groupedModels)) {
    const { name } = providerDetails[provider];
    const modelList = Array.from(models).sort();

    // Get provider documentation link from provider-details.ts
    const { docsLink } = providerDetails[provider];

    content += `/**
 * ${name} models available via ${name} API
 * @see ${docsLink} for API documentation
 */
export type ${name}Models = 
`;

    // Add each model as a literal type
    modelList.forEach((model, index) => {
      const isLast = index === modelList.length - 1;
      content += `  | "${model}"${isLast ? ";" : ""}\n`;
    });

    content += "\n";
  }

  // Generate the main union type
  const providerTypes = Object.keys(groupedModels)
    .map((provider) => {
      const { name } = providerDetails[provider];
      return `  | \`${provider}:\${${name}Models}\``;
    })
    .join("\n");

  content += `/**
 * All known model identifiers from supported providers
 */
export type KnownModelIdentifiers = 
${providerTypes};

/**
 * Enhanced ModelIdentifier type with auto-completion for known models
 * while maintaining backward compatibility with arbitrary strings
 */
export type ModelIdentifier = KnownModelIdentifiers | \`\${string}:\${string}\`;

/**
 * Type guard to check if a string is a valid model identifier format
 */
export function isValidModelIdentifier(model: string): model is ModelIdentifier {
  return /^[^:]+:[^:]+$/.test(model);
}

/**
 * Type guard to check if a model identifier is a known model
 */
export function isKnownModelIdentifier(model: string): model is KnownModelIdentifiers {
  // This would need runtime validation against the known models
  // For now, just validate format
  return isValidModelIdentifier(model);
}
`;

  return content;
}

/**
 * Write generated types to file
 */
function writeGeneratedTypes(content: string): void {
  const outputDir = path.join(__dirname, "..", "src", "types", "generated");
  const outputFile = path.join(outputDir, "model-identifiers.ts");

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputFile, content);
  console.log(`✅ Generated types written to: ${outputFile}`);
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
  try {
    console.log("🚀 Starting model type generation...");

    // Get model data from API
    const models = await fetchModels();

    // Group models by provider
    const groupedModels = groupModelsByProvider(models);

    console.log("📊 Grouped models by provider:");
    for (const [provider, models] of Object.entries(groupedModels)) {
      console.log(`  ${provider}: ${models.size} models`);
    }

    // Generate TypeScript definitions
    const typeDefinitions = generateTypeDefinitions(groupedModels);

    // Write to file
    writeGeneratedTypes(typeDefinitions);

    console.log("✅ Model type generation completed successfully!");
  } catch (error) {
    console.error("❌ Model type generation failed:", error);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

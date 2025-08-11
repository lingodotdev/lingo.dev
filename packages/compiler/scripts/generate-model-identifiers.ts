#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";
import { providerDetails } from "../src/lib/lcp/api/provider-details.js";

/**
 * This script generates the `packages/compiler/src/model-identifiers.ts` file.
 *
 * Usage:
 *
 * cd packages/compiler
 * pnpm run generate-model-identifiers
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Map models.dev provider keys to our internal keys
const PROVIDER_NAME_MAP: Record<string, string> = {
  mistralai: "mistral",
  google: "google",
  groq: "groq",
  openrouter: "openrouter",
  ollama: "ollama",
};
const SUPPORTED = new Set(Object.keys(providerDetails));

const EXCLUDED_MODEL_IDS: Set<string> = new Set([
  "llama-guard-3-8b",
  "meta-llama/llama-guard-4-12b",
  "deepseek/deepseek-v3-base:free",
]);

type ApiResponse = Record<
  string,
  { models: Record<string, { name?: string }>; [k: string]: unknown }
>;

async function fetchModels(): Promise<ApiResponse> {
  const res = await fetch("https://models.dev/api.json");
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return (await res.json()) as ApiResponse;
}

function groupModelsByProvider(api: ApiResponse): Record<string, Set<string>> {
  const grouped: Record<string, Set<string>> = {};
  for (const [rawProvider, info] of Object.entries(api)) {
    const provider = PROVIDER_NAME_MAP[rawProvider] ?? rawProvider;
    if (!SUPPORTED.has(provider)) continue;
    for (const modelKey of Object.keys(info.models)) {
      if (EXCLUDED_MODEL_IDS.has(modelKey)) continue;
      (grouped[provider] ??= new Set()).add(modelKey);
    }
  }
  return grouped;
}

function buildTypes(grouped: Record<string, Set<string>>) {
  const providers = Object.keys(grouped).sort();

  let out = `/**
 * THIS FILE IS AUTO-GENERATED. DO NOT EDIT IT MANUALLY.
 */`;

  const knownUnion = providers
    .map((p) => {
      const { name } = providerDetails[p];
      return `  | \`${p}:\${${name}Model}\``;
    })
    .join("\n");

  out += `

/**
 * The AI model to use for localization.
 */
export type ModelIdentifier = KnownModelIdentifier | UnknownModelIdentifier;

/**
 * An AI model that Lingo.dev Compiler is known to support.
 */
export type KnownModelIdentifier =
${knownUnion};

/**
 * An AI model that Lingo.dev Compiler is not known to support.
 * 
 * @remarks
 * Even if support is unknown, model identifiers from any of the supported
 * providers should still work. Whether or not a model identifier is listed as
 * known depends on how recently these types were regenerated.
 */
export type UnknownModelIdentifier = \`\${string}:\${string}\` & {};
`;

  for (const p of providers) {
    const { name, docsLink } = providerDetails[p];
    const models = [...grouped[p]].sort();
    out += `
  
/**
 * A model identifier from ${name}.
 * 
 * @see ${docsLink}
 */
export type ${name}Model =
${models.map((m, i) => `  | "${m}"${i === models.length - 1 ? ";" : ""}`).join("\n")}
`;
  }

  return out;
}

async function writeFile(content: string) {
  const outDir = path.join(__dirname, "..", "src");
  const outFile = path.join(outDir, "model-identifiers.ts");
  fs.mkdirSync(outDir, { recursive: true });

  try {
    const cfg = await prettier.resolveConfig(outFile).catch(() => null);
    const formatted = await prettier.format(content, {
      ...cfg,
      filepath: outFile,
    });
    fs.writeFileSync(outFile, formatted);
  } catch {
    fs.writeFileSync(outFile, content);
  }

  console.log(`✅ Wrote ${outFile}`);
}

/** Main */
async function main() {
  console.log("Generating model identifier types...");
  const api = await fetchModels();
  const grouped = groupModelsByProvider(api);
  const types = buildTypes(grouped);
  await writeFile(types);
  console.log("Done.");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error("❌ Failed:", err);
    process.exit(1);
  });
}

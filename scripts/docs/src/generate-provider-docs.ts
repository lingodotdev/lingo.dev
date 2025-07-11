#!/usr/bin/env node

import { mkdir, writeFile } from "fs/promises";
import type { Root } from "mdast";
import { resolve, dirname } from "path";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { createOrUpdateGitHubComment } from "./utils";

import { providerDetails } from "@lingo.dev/_compiler";
import { defaultConfig as specDefaultConfig } from "@lingo.dev/_spec";

type ProviderDetails = {
  name: string;
  apiKeyEnvVar?: string;
  apiKeyConfigKey?: string;
  getKeyLink: string;
  docsLink: string;
};

type ModelInfo = {
  id: string;
  name: string;
  attachment?: boolean;
  reasoning?: boolean;
  temperature?: boolean;
  tool_call?: boolean;
  knowledge?: string;
  release_date?: string;
  modalities?: {
    input?: string[];
    output?: string[];
  };
  cost?: {
    input?: number;
    output?: number;
    cache_read?: number;
  };
  limit?: {
    context?: number;
    output?: number;
  };
};

type ApiProvider = {
  id: string;
  env?: string[];
  npm?: string;
  name: string;
  doc?: string;
  models?: Record<string, ModelInfo>;
};

async function fetchModelsData(): Promise<Record<string, ApiProvider>> {
  try {
    const response = await fetch("https://models.dev/api.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn("Failed to fetch models data:", error);
    return {};
  }
}

function mapProviderIdToApiId(providerId: string): string {
  // Map provider IDs from provider-details.ts to API provider IDs
  const mapping: Record<string, string> = {
    google: "google",
    openrouter: "openrouter",
    groq: "groq",
    ollama: "ollama",
    mistral: "mistral",
    "lingo.dev": "lingo",
  };

  return mapping[providerId] || providerId;
}

function mapProviderIdToConfigId(providerId: string): string | null {
  // Map provider IDs from provider-details.ts to config schema IDs
  const mapping: Record<string, string> = {
    google: "google",
    openrouter: "openrouter",
    groq: "anthropic", // Map groq to anthropic as there's no groq in config
    ollama: "ollama",
    mistral: "mistral",
    "lingo.dev": "openai", // Map lingo.dev to openai as fallback
  };

  return mapping[providerId] || null;
}

// Removed getDefaultModelForProvider – we now use only real model data from the API (no fallbacks).

function createSampleConfig(
  providerId: string,
  configId: string,
  model: string,
  defaultConfig: any,
): any {
  const sampleConfig = {
    ...defaultConfig,
    provider: {
      id: configId,
      model: model,
      prompt:
        "You are a helpful assistant specialized in software localization. Please translate the following text while maintaining its technical context and meaning.",
    },
  };

  return sampleConfig;
}

function createCompilerParamsExample(
  providerId: string,
  configId: string,
  model: string,
): string {
  // Special case for Lingo.dev
  if (providerId === "lingo.dev") {
    return `import { CompilerParams } from "@lingo.dev/compiler";

const compilerParams: CompilerParams = {
  sourceRoot: "src",
  lingoDir: "lingo", 
  sourceLocale: "en",
  targetLocales: ["es", "fr", "de"],
  rsc: false,
  useDirective: false,
  debug: false,
  // Use Lingo.dev Engine (recommended)
  models: "lingo.dev",
  // Custom prompt is not supported with Lingo.dev Engine
  prompt: null,
};`;
  }

  const modelIdentifier = `${configId}:${model}`;

  return `import { CompilerParams } from "@lingo.dev/compiler";

const compilerParams: CompilerParams = {
  sourceRoot: "src",
  lingoDir: "lingo", 
  sourceLocale: "en",
  targetLocales: ["es", "fr", "de"],
  rsc: false,
  useDirective: false,
  debug: false,
  models: {
    // Translate from English to any target locale using ${providerId}
    "en:*": "${modelIdentifier}",
    // You can also specify specific locale pairs:
    // "en:es": "${modelIdentifier}",
    // "en:fr": "${modelIdentifier}",
  },
  prompt: "You are a helpful assistant specialized in software localization. Please translate the following text while maintaining its technical context and meaning.",
};`;
}

function buildMarkdown(
  providers: Record<string, ProviderDetails>,
  modelsData: Record<string, ApiProvider>,
  defaultConfig: any,
): string {
  const mdast: Root = {
    type: "root",
    children: [
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value:
              "This page contains the complete list of AI providers supported by ",
          },
          {
            type: "strong",
            children: [{ type: "text", value: "Lingo.dev" }],
          },
          {
            type: "text",
            value:
              ". Each provider has specific configuration requirements and links to help you get started.",
          },
        ],
      },
    ],
  };

  // Add detailed sections for each provider
  mdast.children.push({
    type: "heading",
    depth: 2,
    children: [{ type: "text", value: "Supported Providers" }],
  });

  // Sort providers alphabetically but keep Lingo.dev at the top
  const sortedProviders = Object.entries(providers).sort(
    ([idA, detailsA], [idB, detailsB]) => {
      // Always put Lingo.dev first
      if (idA === "lingo.dev") return -1;
      if (idB === "lingo.dev") return 1;

      // Sort others alphabetically by name
      return detailsA.name.localeCompare(detailsB.name);
    },
  );

  sortedProviders.forEach(([id, details]) => {
    mdast.children.push({
      type: "heading",
      depth: 3,
      children: [{ type: "text", value: details.name }],
    });

    if (details.apiKeyEnvVar) {
      mdast.children.push({
        type: "paragraph",
        children: [
          {
            type: "strong",
            children: [{ type: "text", value: "Environment Variable:" }],
          },
        ],
      });

      mdast.children.push({
        type: "code",
        lang: "bash",
        value: `export ${details.apiKeyEnvVar}="<your-api-key>"`,
      });
    }

    if (details.apiKeyConfigKey) {
      mdast.children.push({
        type: "paragraph",
        children: [
          {
            type: "strong",
            children: [{ type: "text", value: "Config Key:" }],
          },
          {
            type: "text",
            value: " ",
          },
          {
            type: "inlineCode",
            value: details.apiKeyConfigKey,
          },
        ],
      });
    }

    mdast.children.push({
      type: "paragraph",
      children: [
        {
          type: "strong",
          children: [{ type: "text", value: "Get API Key:" }],
        },
        {
          type: "text",
          value: " ",
        },
        {
          type: "link",
          url: details.getKeyLink,
          children: [{ type: "text", value: details.getKeyLink }],
        },
      ],
    });

    mdast.children.push({
      type: "paragraph",
      children: [
        {
          type: "strong",
          children: [{ type: "text", value: "Documentation:" }],
        },
        {
          type: "text",
          value: " ",
        },
        {
          type: "link",
          url: details.docsLink,
          children: [{ type: "text", value: details.docsLink }],
        },
      ],
    });

    // Add available models
    const apiId = mapProviderIdToApiId(id);
    const apiProvider = modelsData[apiId];

    if (apiProvider && apiProvider.models) {
      mdast.children.push({
        type: "paragraph",
        children: [
          {
            type: "strong",
            children: [{ type: "text", value: "Available Models:" }],
          },
        ],
      });

      const modelsList = Object.entries(apiProvider.models).map(
        ([modelId, model]) => {
          const features = [];
          if (model.attachment) features.push("📎 File attachments");
          if (model.reasoning) features.push("🧠 Reasoning");
          if (model.tool_call) features.push("🛠️ Tool calling");

          let description = model.name;
          if (features.length > 0) {
            description += ` (${features.join(", ")})`;
          }

          return {
            type: "listItem" as const,
            children: [
              {
                type: "paragraph" as const,
                children: [
                  {
                    type: "inlineCode" as const,
                    value: modelId,
                  },
                  {
                    type: "text" as const,
                    value: ` - ${description}`,
                  },
                ],
              },
            ],
          };
        },
      );

      mdast.children.push({
        type: "list",
        ordered: false,
        children: modelsList,
      });
    }

    // Add sample configuration
    const configId = mapProviderIdToConfigId(id);
    const apiIdForSample = mapProviderIdToApiId(id);
    const sampleModel = modelsData[apiIdForSample]?.models
      ? Object.keys(modelsData[apiIdForSample].models)[0]
      : undefined;

    if (configId && sampleModel) {
      mdast.children.push({
        type: "paragraph",
        children: [
          {
            type: "strong",
            children: [{ type: "text", value: "Sample Configuration:" }],
          },
        ],
      });

      const sampleConfig = createSampleConfig(
        id,
        configId,
        sampleModel,
        defaultConfig,
      );

      mdast.children.push({
        type: "code",
        lang: "json",
        value: JSON.stringify(sampleConfig, null, 2),
      });
    }

    // Add CompilerParams example for all providers
    mdast.children.push({
      type: "paragraph",
      children: [
        {
          type: "strong",
          children: [{ type: "text", value: "Compiler Configuration:" }],
        },
      ],
    });

    // Use configId if available, otherwise use the provider id directly
    const effectiveConfigId = configId || id;
    if (id === "lingo.dev" || sampleModel) {
      const compilerExample = createCompilerParamsExample(
        id,
        effectiveConfigId,
        sampleModel ?? "",
      );
      mdast.children.push({
        type: "code",
        lang: "typescript",
        value: compilerExample,
      });
    }
  });

  return unified().use(remarkStringify).stringify(mdast);
}

async function main(): Promise<void> {
  const commentMarker = "<!-- generate-provider-docs -->";

  console.log("🔄 Generating provider docs...");
  const providers = providerDetails;
  const modelsData = await fetchModelsData();
  const defaultConfig = specDefaultConfig;
  const markdown = buildMarkdown(providers, modelsData, defaultConfig);

  const isGitHubAction = Boolean(process.env.GITHUB_ACTIONS);

  if (isGitHubAction) {
    console.log("💬 Commenting on GitHub PR...");

    const mdast: Root = {
      type: "root",
      children: [
        { type: "html", value: commentMarker },
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              value:
                "Your PR affects Lingo.dev provider configuration and, as a result, may affect the auto-generated provider documentation that will be published to the documentation website. Please review the output below to ensure that the changes are correct.",
            },
          ],
        },
        { type: "html", value: "<details>" },
        {
          type: "html",
          value: "<summary>Lingo.dev Provider Details</summary>",
        },
        { type: "code", lang: "markdown", value: markdown },
        { type: "html", value: "</details>" },
      ],
    };

    const body = unified()
      .use([[remarkStringify, { fence: "~" }]])
      .stringify(mdast)
      .toString();

    await createOrUpdateGitHubComment({
      commentMarker,
      body,
    });

    return;
  }

  const outputArg = process.argv[2];

  if (!outputArg) {
    throw new Error(
      "Output file path is required. Usage: generate-provider-docs <output-path>",
    );
  }

  const outputFilePath = resolve(process.cwd(), outputArg);

  console.log(`💾 Saving to ${outputFilePath}...`);
  await mkdir(dirname(outputFilePath), { recursive: true });
  await writeFile(outputFilePath, markdown, "utf8");
  console.log(`✅ Saved to ${outputFilePath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

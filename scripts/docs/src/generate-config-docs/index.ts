import { LATEST_CONFIG_DEFINITION } from "@lingo.dev/_spec/src/config";
import type { Root } from "mdast";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { zodToJsonSchema } from "zod-to-json-schema";
import { parseSchema } from "../json-schema-parser";
import { renderMarkdown } from "../json-schema-markdown-renderer";
import { createOrUpdateGitHubComment, formatMarkdown } from "../utils";
import type { JSONSchemaObject } from "../types";

const ROOT_PROPERTY_ORDER = ["$schema", "version", "locale", "buckets"];

function generateMarkdown(schema: unknown): string {
  if (!schema || typeof schema !== "object") {
    throw new Error("Invalid schema provided");
  }

  // Ensure the `version` property reflects the latest schema version in docs
  const schemaObj = schema as JSONSchemaObject;
  const rootRef = schemaObj.$ref as string | undefined;
  const rootName: string = rootRef
    ? (rootRef.split("/").pop() ?? "I18nConfig")
    : "I18nConfig";

  let rootSchema: unknown;
  if (
    rootRef &&
    schemaObj.definitions &&
    typeof schemaObj.definitions === "object"
  ) {
    const definitions = schemaObj.definitions as Record<string, unknown>;
    rootSchema = definitions[rootName];
  } else {
    rootSchema = schema;
  }

  if (rootSchema && typeof rootSchema === "object") {
    const rootSchemaObj = rootSchema as JSONSchemaObject;
    if (
      rootSchemaObj.properties &&
      typeof rootSchemaObj.properties === "object"
    ) {
      const properties = rootSchemaObj.properties as Record<string, unknown>;
      if (properties.version && typeof properties.version === "object") {
        (properties.version as Record<string, unknown>).default =
          LATEST_CONFIG_DEFINITION.defaultValue.version;
      }
    }
  }

  console.log("🔍 Parsing schema into property structure...");
  const properties = parseSchema(schema, { customOrder: ROOT_PROPERTY_ORDER });
  
  console.log("📝 Rendering properties to Markdown...");
  return renderMarkdown(properties);
}

async function main() {
  const commentMarker = "<!-- generate-config-docs -->";
  const isGitHubAction = Boolean(process.env.GITHUB_ACTIONS);

  const outputArg = process.argv[2];

  const schema = zodToJsonSchema(LATEST_CONFIG_DEFINITION.schema, {
    name: "I18nConfig",
    markdownDescription: true,
  });

  console.log("🔄 Generating i18n.json reference docs...");
  const markdown = generateMarkdown(schema);
  const formattedMarkdown = await formatMarkdown(markdown);

  if (isGitHubAction) {
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
                "Your PR affects the Lingo.dev i18n.json configuration schema and may affect the auto-generated reference documentation. Please review the output below to ensure that the changes are correct.",
            },
          ],
        },
        { type: "html", value: "<details>" },
        {
          type: "html",
          value: "<summary>i18n.json reference docs</summary>",
        },
        { type: "code", lang: "markdown", value: formattedMarkdown },
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

  if (!outputArg) {
    throw new Error(
      "Output file path is required. Usage: generate-config-docs <output-path>",
    );
  }

  const outputFilePath = resolve(process.cwd(), outputArg);
  console.log(`💾 Saving to ${outputFilePath}...`);
  mkdirSync(dirname(outputFilePath), { recursive: true });
  writeFileSync(outputFilePath, formattedMarkdown);
  console.log(`✅ Saved to ${outputFilePath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
import { LATEST_CONFIG_DEFINITION } from "@lingo.dev/_spec";
import { zodToJsonSchema } from "zod-to-json-schema";
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { unified } from "unified";
import remarkStringify from "remark-stringify";

// Resolve a JSON pointer (e.g. "#/definitions/Foo/properties/bar") into the referenced schema node
function resolveRef(ref: string, root: any): any | undefined {
  if (!ref.startsWith("#/")) return undefined;
  const pathSegments = ref
    .slice(2) // remove "#/"
    .split("/")
    .map((seg) => decodeURIComponent(seg));

  let current: any = root;
  for (const segment of pathSegments) {
    if (current && typeof current === "object" && segment in current) {
      current = current[segment];
    } else {
      return undefined;
    }
  }
  return current;
}

function getType(schema: any, root: any): string {
  if (schema.type) {
    if (Array.isArray(schema.type)) {
      return schema.type.join(" | ");
    }

    if (schema.type === "array") {
      if (schema.items) {
        if (schema.items.$ref) {
          const resolved = resolveRef(schema.items.$ref, root);
          const itemType = resolved
            ? getType(resolved, root)
            : schema.items.$ref.split("/").pop();
          return `array of ${itemType}`;
        }
        if (schema.items.type) {
          return `array of ${Array.isArray(schema.items.type) ? schema.items.type.join(" | ") : schema.items.type}`;
        }
      }
      return "array";
    }

    return schema.type;
  }

  if (schema.$ref) {
    const resolved = resolveRef(schema.$ref, root);
    if (resolved) {
      return getType(resolved, root);
    }
    return schema.$ref.split("/").pop();
  }

  return "unknown";
}

function appendPropertyDocsNodes(
  nodes: any[],
  name: string,
  schema: any,
  required: boolean,
  parentPath = "",
  root: any,
) {
  const fullName = parentPath ? `${parentPath}.${name}` : name;

  // Heading for the property.
  // Use a dynamic depth to visually convey the nesting level in the generated docs.
  // Root-level properties keep depth 2 (##), each nested path segment adds +1 depth
  // but we cap at 6 to stay within valid Markdown heading levels.
  const headingDepth = Math.min(6, 2 + (fullName.split(".").length - 1));

  nodes.push({
    type: "heading",
    depth: headingDepth,
    children: [{ type: "inlineCode", value: fullName }],
  });

  const bulletItems: any[] = [];

  // Type
  bulletItems.push({
    type: "listItem",
    children: [
      {
        type: "paragraph",
        children: [
          { type: "text", value: "Type: " },
          { type: "inlineCode", value: getType(schema, root) },
        ],
      },
    ],
  });

  // Required
  bulletItems.push({
    type: "listItem",
    children: [
      {
        type: "paragraph",
        children: [
          { type: "text", value: "Required: " },
          { type: "inlineCode", value: required ? "yes" : "no" },
        ],
      },
    ],
  });

  // Default
  if (schema.default !== undefined) {
    bulletItems.push({
      type: "listItem",
      children: [
        {
          type: "paragraph",
          children: [
            { type: "text", value: "Default: " },
            { type: "inlineCode", value: JSON.stringify(schema.default) },
          ],
        },
      ],
    });
  }

  // Enum
  if (schema.enum) {
    bulletItems.push({
      type: "listItem",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", value: "Allowed values:" }],
        },
        {
          type: "list",
          ordered: false,
          spread: false,
          children: Array.from(new Set(schema.enum))
            .sort((a: any, b: any) => String(a).localeCompare(String(b)))
            .map((v: any) => ({
              type: "listItem",
              children: [
                {
                  type: "paragraph",
                  children: [{ type: "inlineCode", value: String(v) }],
                },
              ],
            })),
        },
      ],
    });
  }
  // Allowed keys (for objects constrained by `propertyNames`)
  if (
    schema.propertyNames &&
    Array.isArray(schema.propertyNames.enum) &&
    schema.propertyNames.enum.length > 0
  ) {
    bulletItems.push({
      type: "listItem",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", value: "Allowed keys:" }],
        },
        {
          type: "list",
          ordered: false,
          spread: false,
          children: Array.from(new Set(schema.propertyNames.enum))
            .sort((a: any, b: any) => String(a).localeCompare(String(b)))
            .map((v: any) => ({
              type: "listItem",
              children: [
                {
                  type: "paragraph",
                  children: [{ type: "inlineCode", value: String(v) }],
                },
              ],
            })),
        },
      ],
    });
  }

  // Description
  if (schema.description) {
    bulletItems.push({
      type: "listItem",
      children: [
        {
          type: "paragraph",
          children: [
            { type: "text", value: "Description: " },
            { type: "text", value: schema.description },
          ],
        },
      ],
    });
  }

  // Add bullet list to parent
  nodes.push({
    type: "list",
    ordered: false,
    spread: false,
    children: bulletItems,
  });

  // Recurse into nested properties for objects
  if (schema.type === "object") {
    if (schema.properties) {
      const nestedRequired: string[] = schema.required || [];
      for (const key of Object.keys(schema.properties)) {
        appendPropertyDocsNodes(
          nodes,
          key,
          schema.properties[key],
          nestedRequired.includes(key),
          fullName,
          root,
        );
      }
    }

    // Handle schemas that use `additionalProperties`
    if (
      schema.additionalProperties &&
      typeof schema.additionalProperties === "object"
    ) {
      const addSchema = schema.additionalProperties;
      let names: string[];
      if (fullName === "buckets") {
        // All bucket keys share the same value schema, so document a single
        // placeholder key instead of repeating the same docs for each bucket
        // type.
        names = ["*"];
      } else if (
        schema.propertyNames &&
        Array.isArray(schema.propertyNames.enum)
      ) {
        names = [...schema.propertyNames.enum].sort((a: any, b: any) =>
          String(a).localeCompare(String(b)),
        );
      } else {
        names = ["*"];
      }

      for (const propName of names) {
        appendPropertyDocsNodes(
          nodes,
          propName,
          addSchema,
          false,
          fullName,
          root,
        );
      }
    }
  }

  // Recurse into items for arrays of objects
  if (schema.type === "array" && schema.items) {
    const itemSchema = schema.items.$ref
      ? resolveRef(schema.items.$ref, root) || schema.items
      : schema.items;

    if (itemSchema && (itemSchema.type === "object" || itemSchema.properties)) {
      const nestedRequired: string[] = itemSchema.required || [];
      for (const key of Object.keys(itemSchema.properties || {})) {
        appendPropertyDocsNodes(
          nodes,
          key,
          itemSchema.properties[key],
          nestedRequired.includes(key),
          `${fullName}.*`,
          root,
        );
      }

      // Handle additionalProperties inside array items if present
      if (
        itemSchema.additionalProperties &&
        typeof itemSchema.additionalProperties === "object"
      ) {
        const addSchema = itemSchema.additionalProperties;
        const names = ["*"];
        for (const propName of names) {
          appendPropertyDocsNodes(
            nodes,
            propName,
            addSchema,
            false,
            `${fullName}.*`,
            root,
          );
        }
      }
    }
  }
}

function generateMarkdown(schema: any): string {
  const rootRef = schema.$ref as string | undefined;
  const rootName: string = rootRef
    ? (rootRef.split("/").pop() ?? "I18nConfig")
    : "I18nConfig";
  const rootSchema = rootRef ? (schema.definitions as any)[rootName] : schema;

  // Ensure the `version` property reflects the latest schema version in docs
  if (rootSchema?.properties?.version) {
    rootSchema.properties.version = {
      ...rootSchema.properties.version,
      default: LATEST_CONFIG_DEFINITION.defaultValue.version,
    };
  }

  const children: any[] = [
    {
      type: "heading",
      depth: 1,
      children: [{ type: "text", value: rootName }],
    },
  ];

  if (rootSchema.description) {
    children.push({
      type: "paragraph",
      children: [{ type: "text", value: rootSchema.description }],
    });
  }

  children.push({
    type: "paragraph",
    children: [
      {
        type: "text",
        value:
          "This document describes the configuration options available for ",
      },
      { type: "strong", children: [{ type: "text", value: "i18n-docs" }] },
      { type: "text", value: "." },
    ],
  });

  // Add a brief overview
  children.push({
    type: "paragraph",
    children: [
      {
        type: "text",
        value:
          "The configuration file supports JSON schema validation and provides type safety for all options. Each property below includes its type, requirement status, default value (if any), and description.",
      },
    ],
  });

  const required: string[] = rootSchema.required || [];
  for (const key of Object.keys(rootSchema.properties || {})) {
    appendPropertyDocsNodes(
      children,
      key,
      rootSchema.properties[key],
      required.includes(key),
      "",
      schema,
    );

    // Add spacing between top-level sections
    children.push({
      type: "paragraph",
      children: [{ type: "text", value: "" }],
    });
  }

  const root: any = { type: "root", children };
  return unified()
    .use(remarkStringify, { fences: true, listItemIndent: "one" })
    .stringify(root);
}

// Modify generateSchema to also output markdown
function generateSchemaAndDocs() {
  const schema = zodToJsonSchema(LATEST_CONFIG_DEFINITION.schema, {
    name: "I18nConfig",
  } as any);

  const __filename = fileURLToPath(import.meta.url);
  const outDir = resolve(dirname(__filename), "../../../docs");
  mkdirSync(outDir, { recursive: true });

  const schemaPath = resolve(outDir, "i18n.schema.json");
  writeFileSync(schemaPath, JSON.stringify(schema, null, 2));
  console.log(`Generated config JSON schema at ${schemaPath}`);

  // Generate markdown docs
  const markdown = generateMarkdown(schema);
  const mdPath = resolve(outDir, "i18n.md");
  writeFileSync(mdPath, markdown);
  console.log(`Generated config documentation at ${mdPath}`);
}

// Run
generateSchemaAndDocs();

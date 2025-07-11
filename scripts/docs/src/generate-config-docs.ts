// Import the spec directly from source so that `.describe()` texts are still
// present when we convert it to JSON-Schema. (The compiled build that gets
// published strips the runtime `description` data.)
import { LATEST_CONFIG_DEFINITION } from "@lingo.dev/_spec/src/config";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { zodToJsonSchema } from "zod-to-json-schema";
import { formatMarkdown } from "./utils";
import type { Root, RootContent } from "mdast";

interface ConfigDefaultValue {
  $schema?: string;
  version?: number;
  [key: string]: unknown;
}

const ROOT_PROPERTY_ORDER = ["$schema", "version", "locale", "buckets"];

function resolveRef(ref: string, root: unknown): unknown {
  if (!ref.startsWith("#/")) return undefined;
  const pathSegments = ref
    .slice(2) // remove "#/"
    .split("/")
    .map((seg) => decodeURIComponent(seg));

  let current = root;
  for (const segment of pathSegments) {
    if (current && typeof current === "object" && segment in current) {
      current = (current as Record<string, unknown>)[segment];
    } else {
      return undefined;
    }
  }
  return current;
}

/**
 * Sort property keys for consistent documentation ordering.
 * Always prioritizes required properties over optional ones and sorts alphabetically within each group.
 *
 * @param keys - All property keys to sort
 * @param requiredKeys - Keys that are marked as required
 * @param customOrder - Optional array of keys that should appear first
 * @returns Sorted array of keys
 */
function sortPropertyKeys(
  keys: string[],
  requiredKeys: string[] = [],
  customOrder: string[] = [],
): string[] {
  const keySet = new Set(keys);
  const requiredSet = new Set(requiredKeys);

  // Start with custom ordered keys that exist in the properties
  const orderedKeys: string[] = [];
  for (const key of customOrder) {
    if (keySet.has(key)) {
      orderedKeys.push(key);
      keySet.delete(key);
    }
  }

  // Handle remaining keys - separate into required and optional
  const remainingKeys = Array.from(keySet);
  const remainingRequired: string[] = [];
  const remainingOptional: string[] = [];

  for (const key of remainingKeys) {
    if (requiredSet.has(key)) {
      remainingRequired.push(key);
    } else {
      remainingOptional.push(key);
    }
  }

  // Sort alphabetically within each group
  remainingRequired.sort((a, b) => a.localeCompare(b));
  remainingOptional.sort((a, b) => a.localeCompare(b));

  return [...orderedKeys, ...remainingRequired, ...remainingOptional];
}

function getType(schema: unknown, root: unknown): string {
  if (!schema || typeof schema !== "object") return "unknown";

  const schemaObj = schema as Record<string, unknown>;

  if (schemaObj.type) {
    if (Array.isArray(schemaObj.type)) {
      return schemaObj.type.join(" | ");
    }

    if (schemaObj.type === "array") {
      const items = schemaObj.items;
      if (items && typeof items === "object") {
        const itemsObj = items as Record<string, unknown>;
        if (itemsObj.$ref) {
          const resolved = resolveRef(itemsObj.$ref as string, root);
          const itemType = resolved
            ? getType(resolved, root)
            : String(itemsObj.$ref).split("/").pop() || "unknown";
          return `array of ${itemType}`;
        }

        // Handle arrays with union types (anyOf/oneOf)
        if (Array.isArray(itemsObj.anyOf)) {
          const types = itemsObj.anyOf.map((item: unknown) => {
            if (item && typeof item === "object") {
              const itemObj = item as Record<string, unknown>;
              if (itemObj.$ref) {
                const resolved = resolveRef(itemObj.$ref as string, root);
                return resolved
                  ? getType(resolved, root)
                  : String(itemObj.$ref).split("/").pop() || "unknown";
              }
            }
            return getType(item, root);
          });
          return `array of ${types.join(" | ")}`;
        }

        if (Array.isArray(itemsObj.oneOf)) {
          const types = itemsObj.oneOf.map((item: unknown) => {
            if (item && typeof item === "object") {
              const itemObj = item as Record<string, unknown>;
              if (itemObj.$ref) {
                const resolved = resolveRef(itemObj.$ref as string, root);
                return resolved
                  ? getType(resolved, root)
                  : String(itemObj.$ref).split("/").pop() || "unknown";
              }
            }
            return getType(item, root);
          });
          return `array of ${types.join(" | ")}`;
        }

        if (itemsObj.type) {
          return `array of ${Array.isArray(itemsObj.type) ? itemsObj.type.join(" | ") : itemsObj.type}`;
        }
      }
      return "array";
    }

    return String(schemaObj.type);
  }

  // Handle union types at the top level (anyOf/oneOf)
  if (Array.isArray(schemaObj.anyOf)) {
    const types = schemaObj.anyOf.map((item: unknown) => {
      if (item && typeof item === "object") {
        const itemObj = item as Record<string, unknown>;
        if (itemObj.$ref) {
          const resolved = resolveRef(itemObj.$ref as string, root);
          return resolved
            ? getType(resolved, root)
            : String(itemObj.$ref).split("/").pop() || "unknown";
        }
      }
      return getType(item, root);
    });
    return types.join(" | ");
  }

  if (Array.isArray(schemaObj.oneOf)) {
    const types = schemaObj.oneOf.map((item: unknown) => {
      if (item && typeof item === "object") {
        const itemObj = item as Record<string, unknown>;
        if (itemObj.$ref) {
          const resolved = resolveRef(itemObj.$ref as string, root);
          return resolved
            ? getType(resolved, root)
            : String(itemObj.$ref).split("/").pop() || "unknown";
        }
      }
      return getType(item, root);
    });
    return types.join(" | ");
  }

  if (schemaObj.$ref) {
    const resolved = resolveRef(schemaObj.$ref as string, root);
    if (resolved) {
      return getType(resolved, root);
    }
    return String(schemaObj.$ref).split("/").pop() || "unknown";
  }

  return "unknown";
}

function appendPropertyDocsNodes(
  nodes: RootContent[],
  name: string,
  schema: unknown,
  required: boolean,
  parentPath = "",
  root: unknown,
) {
  if (!schema || typeof schema !== "object") return;

  const schemaObj = schema as Record<string, unknown>;
  const fullName = parentPath ? `${parentPath}.${name}` : name;

  const headingDepth = Math.min(6, 2 + (fullName.split(".").length - 1));

  nodes.push({
    type: "heading",
    depth: headingDepth as 1 | 2 | 3 | 4 | 5 | 6,
    children: [{ type: "inlineCode", value: fullName }],
  });

  // NEW: Place description directly after the heading as a paragraph
  const description =
    (schemaObj as Record<string, unknown>).description ??
    (schemaObj as Record<string, unknown>).markdownDescription;

  if (description) {
    nodes.push({
      type: "paragraph",
      children: [{ type: "text", value: String(description) }],
    });
  }

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
  if (schemaObj.default !== undefined) {
    bulletItems.push({
      type: "listItem",
      children: [
        {
          type: "paragraph",
          children: [
            { type: "text", value: "Default: " },
            { type: "inlineCode", value: JSON.stringify(schemaObj.default) },
          ],
        },
      ],
    });
  }

  // Enum
  if (Array.isArray(schemaObj.enum)) {
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
          children: Array.from(new Set(schemaObj.enum))
            .sort((a: unknown, b: unknown) =>
              String(a).localeCompare(String(b)),
            )
            .map((v: unknown) => ({
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
    schemaObj.propertyNames &&
    typeof schemaObj.propertyNames === "object" &&
    Array.isArray((schemaObj.propertyNames as Record<string, unknown>).enum)
  ) {
    const allowedKeys = (schemaObj.propertyNames as Record<string, unknown>)
      .enum as string[];
    if (allowedKeys.length > 0) {
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
            children: Array.from(new Set(allowedKeys))
              .sort((a: string, b: string) => a.localeCompare(b))
              .map((v: string) => ({
                type: "listItem",
                children: [
                  {
                    type: "paragraph",
                    children: [{ type: "inlineCode", value: v }],
                  },
                ],
              })),
          },
        ],
      });
    }
  }

  // Description bullet removed – handled above as paragraph.

  // Add bullet list to parent
  nodes.push({
    type: "list",
    ordered: false,
    spread: false,
    children: bulletItems,
  });

  // Recurse into nested properties for objects
  if (schemaObj.type === "object") {
    if (schemaObj.properties && typeof schemaObj.properties === "object") {
      const properties = schemaObj.properties as Record<string, unknown>;
      const nestedRequired = Array.isArray(schemaObj.required)
        ? (schemaObj.required as string[])
        : [];
      const sortedKeys = sortPropertyKeys(
        Object.keys(properties),
        nestedRequired,
      );
      for (const key of sortedKeys) {
        appendPropertyDocsNodes(
          nodes,
          key,
          properties[key],
          nestedRequired.includes(key),
          fullName,
          root,
        );
      }
    }

    // Handle schemas that use `additionalProperties`
    if (
      schemaObj.additionalProperties &&
      typeof schemaObj.additionalProperties === "object"
    ) {
      const addSchema = schemaObj.additionalProperties;
      let names: string[];
      if (fullName === "buckets") {
        // All bucket keys share the same value schema, so document a single
        // placeholder key instead of repeating the same docs for each bucket
        // type.
        names = ["*"];
      } else if (
        schemaObj.propertyNames &&
        typeof schemaObj.propertyNames === "object" &&
        Array.isArray((schemaObj.propertyNames as Record<string, unknown>).enum)
      ) {
        const enumValues = (schemaObj.propertyNames as Record<string, unknown>)
          .enum as string[];
        names = enumValues.sort((a: string, b: string) => a.localeCompare(b));
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
  if (schemaObj.type === "array" && schemaObj.items) {
    const items = schemaObj.items as Record<string, unknown>;
    const itemSchema = items.$ref
      ? resolveRef(items.$ref as string, root) || items
      : items;

    // Handle union types in array items (anyOf/oneOf)
    if (Array.isArray(items.anyOf)) {
      items.anyOf.forEach((unionItem: unknown) => {
        let resolvedItem = unionItem;
        if (unionItem && typeof unionItem === "object") {
          const unionItemObj = unionItem as Record<string, unknown>;
          if (unionItemObj.$ref) {
            resolvedItem =
              resolveRef(unionItemObj.$ref as string, root) || unionItem;
          }
        }

        if (
          resolvedItem &&
          typeof resolvedItem === "object" &&
          ((resolvedItem as Record<string, unknown>).type === "object" ||
            (resolvedItem as Record<string, unknown>).properties)
        ) {
          const resolvedItemObj = resolvedItem as Record<string, unknown>;
          const nestedRequired = Array.isArray(resolvedItemObj.required)
            ? (resolvedItemObj.required as string[])
            : [];
          const properties =
            (resolvedItemObj.properties as Record<string, unknown>) || {};
          const sortedKeys = sortPropertyKeys(
            Object.keys(properties),
            nestedRequired,
          );
          for (const key of sortedKeys) {
            appendPropertyDocsNodes(
              nodes,
              key,
              properties[key],
              nestedRequired.includes(key),
              `${fullName}.*`,
              root,
            );
          }

          // Handle additionalProperties inside union item if present
          if (
            resolvedItemObj.additionalProperties &&
            typeof resolvedItemObj.additionalProperties === "object"
          ) {
            const addSchema = resolvedItemObj.additionalProperties;
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
      });
    } else if (Array.isArray(items.oneOf)) {
      items.oneOf.forEach((unionItem: unknown) => {
        let resolvedItem = unionItem;
        if (unionItem && typeof unionItem === "object") {
          const unionItemObj = unionItem as Record<string, unknown>;
          if (unionItemObj.$ref) {
            resolvedItem =
              resolveRef(unionItemObj.$ref as string, root) || unionItem;
          }
        }

        if (
          resolvedItem &&
          typeof resolvedItem === "object" &&
          ((resolvedItem as Record<string, unknown>).type === "object" ||
            (resolvedItem as Record<string, unknown>).properties)
        ) {
          const resolvedItemObj = resolvedItem as Record<string, unknown>;
          const nestedRequired = Array.isArray(resolvedItemObj.required)
            ? (resolvedItemObj.required as string[])
            : [];
          const properties =
            (resolvedItemObj.properties as Record<string, unknown>) || {};
          const sortedKeys = sortPropertyKeys(
            Object.keys(properties),
            nestedRequired,
          );
          for (const key of sortedKeys) {
            appendPropertyDocsNodes(
              nodes,
              key,
              properties[key],
              nestedRequired.includes(key),
              `${fullName}.*`,
              root,
            );
          }

          // Handle additionalProperties inside union item if present
          if (
            resolvedItemObj.additionalProperties &&
            typeof resolvedItemObj.additionalProperties === "object"
          ) {
            const addSchema = resolvedItemObj.additionalProperties;
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
      });
    } else if (
      itemSchema &&
      typeof itemSchema === "object" &&
      ((itemSchema as Record<string, unknown>).type === "object" ||
        (itemSchema as Record<string, unknown>).properties)
    ) {
      // Handle regular object items (non-union)
      const itemSchemaObj = itemSchema as Record<string, unknown>;
      const nestedRequired = Array.isArray(itemSchemaObj.required)
        ? (itemSchemaObj.required as string[])
        : [];
      const properties =
        (itemSchemaObj.properties as Record<string, unknown>) || {};
      const sortedKeys = sortPropertyKeys(
        Object.keys(properties),
        nestedRequired,
      );
      for (const key of sortedKeys) {
        appendPropertyDocsNodes(
          nodes,
          key,
          properties[key],
          nestedRequired.includes(key),
          `${fullName}.*`,
          root,
        );
      }

      // Handle additionalProperties inside array items if present
      if (
        itemSchemaObj.additionalProperties &&
        typeof itemSchemaObj.additionalProperties === "object"
      ) {
        const addSchema = itemSchemaObj.additionalProperties;
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

function generateMarkdown(schema: unknown): string {
  if (!schema || typeof schema !== "object") {
    throw new Error("Invalid schema provided");
  }

  const schemaObj = schema as Record<string, unknown>;
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

  if (!rootSchema || typeof rootSchema !== "object") {
    throw new Error(`Could not find root schema: ${rootName}`);
  }

  const rootSchemaObj = rootSchema as Record<string, unknown>;

  // Ensure the `version` property reflects the latest schema version in docs
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

  const children: RootContent[] = [
    {
      type: "heading",
      depth: 1,
      children: [{ type: "text", value: "i18n.json properties" }],
    },
    {
      type: "paragraph",
      children: [
        {
          type: "text",
          value:
            "This page describes the complete list of properties that are available within the ",
        },
        { type: "inlineCode", value: "i18n.json" },
        {
          type: "text",
          value: " configuration file. This file is used by ",
        },
        {
          type: "strong",
          children: [{ type: "text", value: "Lingo.dev CLI" }],
        },
        {
          type: "text",
          value: " to configure the behavior of the translation pipeline.",
        },
      ],
    },
  ];

  const rootDesc =
    (rootSchemaObj as Record<string, unknown>).description ??
    (rootSchemaObj as Record<string, unknown>).markdownDescription;
  if (rootDesc) {
    children.push({
      type: "paragraph",
      children: [{ type: "text", value: String(rootDesc) }],
    });
  }

  const required = Array.isArray(rootSchemaObj.required)
    ? (rootSchemaObj.required as string[])
    : [];

  if (
    rootSchemaObj.properties &&
    typeof rootSchemaObj.properties === "object"
  ) {
    const properties = rootSchemaObj.properties as Record<string, unknown>;
    const sortedKeys = sortPropertyKeys(
      Object.keys(properties),
      required,
      ROOT_PROPERTY_ORDER,
    );
    for (const key of sortedKeys) {
      appendPropertyDocsNodes(
        children,
        key,
        properties[key],
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
  }

  const root: Root = { type: "root", children };
  return unified()
    .use(remarkStringify, { fences: true, listItemIndent: "one" })
    .stringify(root);
}

// Modify generateSchema to also output markdown
async function generateSchemaAndDocs() {
  const outputArg = process.argv[2];

  if (!outputArg) {
    throw new Error(
      "Output file path is required. Usage: generate-config-docs <output-path>",
    );
  }

  const outputFilePath = resolve(process.cwd(), outputArg);

  const schema = zodToJsonSchema(LATEST_CONFIG_DEFINITION.schema, {
    name: "I18nConfig",
    markdownDescription: true,
  });

  // ------------------------------------------------------------------
  // Ensure the JSON schema written to disk contains the latest defaults
  // for critical root-level properties (currently `version` and `$schema`).
  // This keeps the machine-readable schema in sync with the source
  // Zod definition and the human-readable markdown docs.
  // ------------------------------------------------------------------
  if (schema && typeof schema === "object") {
    const schemaObj = schema as Record<string, unknown>;
    const rootRef = schemaObj.$ref as string | undefined;
    const rootName = rootRef
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
      const rootSchemaObj = rootSchema as Record<string, unknown>;

      if (
        rootSchemaObj.properties &&
        typeof rootSchemaObj.properties === "object"
      ) {
        const properties = rootSchemaObj.properties as Record<string, unknown>;

        if (properties.version && typeof properties.version === "object") {
          (properties.version as Record<string, unknown>).default =
            LATEST_CONFIG_DEFINITION.defaultValue.version;
        }

        if (
          properties.$schema &&
          typeof properties.$schema === "object" &&
          (LATEST_CONFIG_DEFINITION.defaultValue as ConfigDefaultValue).$schema
        ) {
          (properties.$schema as Record<string, unknown>).default = (
            LATEST_CONFIG_DEFINITION.defaultValue as ConfigDefaultValue
          ).$schema;
        }
      }
    }
  }

  // Ensure output directory exists
  mkdirSync(dirname(outputFilePath), { recursive: true });

  // Generate markdown docs
  const markdown = generateMarkdown(schema);

  // Format with Prettier using repo config
  const formattedMarkdown = await formatMarkdown(markdown);

  writeFileSync(outputFilePath, formattedMarkdown);
  console.log(`Generated config documentation at ${outputFilePath}`);
}

// Run
await generateSchemaAndDocs();

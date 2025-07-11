import { LATEST_CONFIG_DEFINITION } from "@lingo.dev/_spec/src/config";
import type { ListItem, Root, RootContent } from "mdast";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { zodToJsonSchema } from "zod-to-json-schema";
import { createOrUpdateGitHubComment, formatMarkdown } from "./utils";

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

  // Handle $ref at the root level
  if (schemaObj.$ref) {
    return getTypeFromRef(schemaObj.$ref as string, root);
  }

  // Handle type property
  if (schemaObj.type) {
    return getTypeFromType(schemaObj, root);
  }

  // Handle union types (anyOf) at the top level
  if (Array.isArray(schemaObj.anyOf)) {
    return getTypeFromAnyOf(schemaObj.anyOf, root);
  }

  return "unknown";
}

// Helper to handle $ref
function getTypeFromRef(ref: string, root: unknown): string {
  const resolved = resolveRef(ref, root);
  if (resolved) {
    return getType(resolved, root);
  }
  return String(ref).split("/").pop() || "unknown";
}

// Helper to handle 'type' property
function getTypeFromType(
  schemaObj: Record<string, unknown>,
  root: unknown,
): string {
  // Handle array of types
  if (Array.isArray(schemaObj.type)) {
    return schemaObj.type.join(" | ");
  }

  if (schemaObj.type === "array") {
    return getTypeFromArray(schemaObj, root);
  }

  return String(schemaObj.type);
}

// Helper to handle arrays
function getTypeFromArray(
  schemaObj: Record<string, unknown>,
  root: unknown,
): string {
  const items = schemaObj.items;
  if (!items || typeof items !== "object") {
    return "array";
  }

  const itemsObj = items as Record<string, unknown>;

  // Array with $ref items
  if (itemsObj.$ref) {
    return `array of ${getTypeFromRef(itemsObj.$ref as string, root)}`;
  }

  // Array with anyOf union types
  if (Array.isArray(itemsObj.anyOf)) {
    const types = itemsObj.anyOf.map((item) => getType(item, root));
    return `array of ${types.join(" | ")}`;
  }

  // Array with direct type(s)
  if (itemsObj.type) {
    if (Array.isArray(itemsObj.type)) {
      return `array of ${itemsObj.type.join(" | ")}`;
    }
    return `array of ${itemsObj.type}`;
  }

  // Array of object or unknown
  return `array of ${getType(items, root)}`;
}

// Helper to handle anyOf (union types)
function getTypeFromAnyOf(anyOfArr: unknown[], root: unknown): string {
  const types = anyOfArr.map((item) => getType(item, root));
  return types.join(" | ");
}

function makeHeadingNode(fullName: string): RootContent {
  const headingDepth = Math.min(6, 2 + (fullName.split(".").length - 1));
  return {
    type: "heading",
    depth: headingDepth as 1 | 2 | 3 | 4 | 5 | 6,
    children: [{ type: "inlineCode", value: fullName }],
  };
}

function makeDescriptionNode(description: unknown): RootContent | null {
  if (!description) return null;
  return {
    type: "paragraph",
    children: [{ type: "text", value: String(description) }],
  };
}

function makeTypeBulletNode(schema: unknown, root: unknown): ListItem {
  return {
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
  };
}

function makeRequiredBulletNode(required: boolean): ListItem {
  return {
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
  };
}

function makeDefaultBulletNode(
  schemaObj: Record<string, unknown>,
): ListItem | null {
  if (schemaObj.default === undefined) return null;
  return {
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
  };
}

function makeEnumBulletNode(
  schemaObj: Record<string, unknown>,
): ListItem | null {
  if (!Array.isArray(schemaObj.enum)) return null;
  return {
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
          .sort((a, b) => String(a).localeCompare(String(b)))
          .map((v) => ({
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
  };
}

function makeAllowedKeysBulletNode(
  schemaObj: Record<string, unknown>,
): ListItem | null {
  if (
    !schemaObj.propertyNames ||
    typeof schemaObj.propertyNames !== "object" ||
    !Array.isArray((schemaObj.propertyNames as Record<string, unknown>).enum)
  ) {
    return null;
  }
  const allowedKeys = (schemaObj.propertyNames as Record<string, unknown>)
    .enum as string[];
  if (allowedKeys.length === 0) return null;
  return {
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
          .sort((a, b) => a.localeCompare(b))
          .map((v) => ({
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
  };
}

function makeBullets(
  schema: unknown,
  required: boolean,
  root: unknown,
): ListItem[] {
  const schemaObj = (schema as Record<string, unknown>) || {};
  const bullets: ListItem[] = [
    makeTypeBulletNode(schema, root),
    makeRequiredBulletNode(required),
  ];

  const defaultNode = makeDefaultBulletNode(schemaObj);
  if (defaultNode) bullets.push(defaultNode);

  const enumNode = makeEnumBulletNode(schemaObj);
  if (enumNode) bullets.push(enumNode);

  const allowedKeysNode = makeAllowedKeysBulletNode(schemaObj);
  if (allowedKeysNode) bullets.push(allowedKeysNode);

  return bullets;
}

// Recursively collect doc nodes for nested properties (object, array, etc)
function collectNestedPropertyDocsNodes(
  schema: unknown,
  fullName: string,
  root: unknown,
): RootContent[] {
  if (!schema || typeof schema !== "object") return [];

  const schemaObj = schema as Record<string, unknown>;
  const nodes: RootContent[] = [];

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
        nodes.push(
          ...appendPropertyDocsNodes(
            key,
            properties[key],
            nestedRequired.includes(key),
            fullName,
            root,
          ),
        );
      }
    }

    // Handle schemas that use `additionalProperties`
    if (
      schemaObj.additionalProperties &&
      typeof schemaObj.additionalProperties === "object"
    ) {
      const addSchema = schemaObj.additionalProperties;
      const names = ["*"];
      for (const propName of names) {
        nodes.push(
          ...appendPropertyDocsNodes(
            propName,
            addSchema,
            false,
            fullName,
            root,
          ),
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

    // Handle union types in array items (anyOf)
    if (Array.isArray(items.anyOf)) {
      items.anyOf.forEach((unionItem) => {
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
            nodes.push(
              ...appendPropertyDocsNodes(
                key,
                properties[key],
                nestedRequired.includes(key),
                `${fullName}.*`,
                root,
              ),
            );
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
        nodes.push(
          ...appendPropertyDocsNodes(
            key,
            properties[key],
            nestedRequired.includes(key),
            `${fullName}.*`,
            root,
          ),
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
          nodes.push(
            ...appendPropertyDocsNodes(
              propName,
              addSchema,
              false,
              `${fullName}.*`,
              root,
            ),
          );
        }
      }
    }
  }

  return nodes;
}

function appendPropertyDocsNodes(
  name: string,
  schema: unknown,
  required: boolean,
  parentPath = "",
  root: unknown,
): RootContent[] {
  if (!schema || typeof schema !== "object") return [];

  const schemaObj = schema as Record<string, unknown>;
  const fullName = parentPath ? `${parentPath}.${name}` : name;

  // Heading node
  const nodes: RootContent[] = [makeHeadingNode(fullName)];

  // Description node
  const description = schemaObj.description ?? schemaObj.markdownDescription;
  const descNode = makeDescriptionNode(description);
  if (descNode) nodes.push(descNode);

  // Bullet list node (with all bullets)
  const bulletItems = makeBullets(schema, required, root);
  nodes.push({
    type: "list",
    ordered: false,
    spread: false,
    children: bulletItems,
  });

  // Recurse for nested properties
  nodes.push(...collectNestedPropertyDocsNodes(schema, fullName, root));

  return nodes;
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
      children.push(
        ...appendPropertyDocsNodes(
          key,
          properties[key],
          required.includes(key),
          "",
          schema,
        ),
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

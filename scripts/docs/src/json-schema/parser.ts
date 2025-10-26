import type {
  JSONSchemaObject,
  PropertyInfo,
  SchemaParsingOptions,
} from "./types";

export function resolveRef(ref: string, root: unknown): unknown {
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

export function sortPropertyKeys(
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

export function inferType(schema: unknown, root: unknown): string {
  if (!schema || typeof schema !== "object") return "unknown";

  const schemaObj = schema as JSONSchemaObject;

  // Handle $ref at the root level
  if (schemaObj.$ref) {
    return inferTypeFromRef(schemaObj.$ref, root);
  }

  // Handle type property
  if (schemaObj.type) {
    return inferTypeFromType(schemaObj, root);
  }

  // Handle union types (anyOf) at the top level
  if (Array.isArray(schemaObj.anyOf)) {
    return inferTypeFromAnyOf(schemaObj.anyOf, root);
  }

  return "unknown";
}

function inferTypeFromRef(ref: string, root: unknown): string {
  const resolved = resolveRef(ref, root);
  if (resolved) {
    return inferType(resolved, root);
  }
  return String(ref).split("/").pop() || "unknown";
}

function inferTypeFromType(schemaObj: JSONSchemaObject, root: unknown): string {
  // Handle array of types
  if (Array.isArray(schemaObj.type)) {
    return schemaObj.type.join(" | ");
  }

  if (schemaObj.type === "array") {
    return inferTypeFromArray(schemaObj, root);
  }

  return String(schemaObj.type);
}

function inferTypeFromArray(
  schemaObj: JSONSchemaObject,
  root: unknown,
): string {
  const items = schemaObj.items;
  if (!items || typeof items !== "object") {
    return "array";
  }

  const itemsObj = items as JSONSchemaObject;

  // Array with $ref items
  if (itemsObj.$ref) {
    return `array of ${inferTypeFromRef(itemsObj.$ref, root)}`;
  }

  // Array with anyOf union types
  if (Array.isArray(itemsObj.anyOf)) {
    const types = itemsObj.anyOf.map((item) => inferType(item, root));
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
  return `array of ${inferType(items, root)}`;
}

function inferTypeFromAnyOf(anyOfArr: unknown[], root: unknown): string {
  const types = anyOfArr.map((item) => inferType(item, root));
  return types.join(" | ");
}

function extractAllowedValues(schema: JSONSchemaObject): unknown[] | undefined {
  if (!Array.isArray(schema.enum)) return undefined;
  return Array.from(new Set(schema.enum)).sort((a, b) =>
    String(a).localeCompare(String(b)),
  );
}

function extractAllowedKeys(schema: JSONSchemaObject): string[] | undefined {
  if (
    !schema.propertyNames ||
    typeof schema.propertyNames !== "object" ||
    !Array.isArray(schema.propertyNames.enum)
  ) {
    return undefined;
  }
  const allowedKeys = schema.propertyNames.enum as string[];
  if (allowedKeys.length === 0) return undefined;
  return Array.from(new Set(allowedKeys)).sort((a, b) => a.localeCompare(b));
}

export function parseProperty(
  name: string,
  schema: unknown,
  required: boolean,
  options: SchemaParsingOptions = {},
): PropertyInfo[] {
  if (!schema || typeof schema !== "object") return [];

  const { parentPath = "", rootSchema = schema } = options;
  const schemaObj = schema as JSONSchemaObject;
  const fullPath = parentPath ? `${parentPath}.${name}` : name;

  const description = schemaObj.markdownDescription ?? schemaObj.description;

  const property: PropertyInfo = {
    name,
    fullPath,
    type: inferType(schema, rootSchema),
    required,
    description,
    defaultValue: schemaObj.default,
    allowedValues: extractAllowedValues(schemaObj),
    allowedKeys: extractAllowedKeys(schemaObj),
  };

  const result: PropertyInfo[] = [property];

  // Add children for nested properties
  const children = parseNestedProperties(schema, fullPath, rootSchema);
  if (children.length > 0) {
    property.children = children;
  }

  return result;
}

function parseNestedProperties(
  schema: unknown,
  fullPath: string,
  rootSchema: unknown,
): PropertyInfo[] {
  if (!schema || typeof schema !== "object") return [];

  const schemaObj = schema as JSONSchemaObject;
  const children: PropertyInfo[] = [];

  // Recurse into nested properties for objects
  if (schemaObj.type === "object") {
    if (schemaObj.properties && typeof schemaObj.properties === "object") {
      const properties = schemaObj.properties;
      const nestedRequired = Array.isArray(schemaObj.required)
        ? schemaObj.required
        : [];
      const sortedKeys = sortPropertyKeys(
        Object.keys(properties),
        nestedRequired,
      );
      for (const key of sortedKeys) {
        children.push(
          ...parseProperty(key, properties[key], nestedRequired.includes(key), {
            parentPath: fullPath,
            rootSchema,
          }),
        );
      }
    }

    // Handle schemas that use `additionalProperties`
    if (
      schemaObj.additionalProperties &&
      typeof schemaObj.additionalProperties === "object"
    ) {
      children.push(
        ...parseProperty("*", schemaObj.additionalProperties, false, {
          parentPath: fullPath,
          rootSchema,
        }),
      );
    }
  }

  // Recurse into items for arrays of objects
  if (schemaObj.type === "array" && schemaObj.items) {
    const items = schemaObj.items as JSONSchemaObject;
    const itemSchema = items.$ref
      ? resolveRef(items.$ref, rootSchema) || items
      : items;

    // Handle union types in array items (anyOf)
    if (Array.isArray(items.anyOf)) {
      items.anyOf.forEach((unionItem) => {
        let resolvedItem = unionItem;
        if (unionItem && typeof unionItem === "object") {
          const unionItemObj = unionItem as JSONSchemaObject;
          if (unionItemObj.$ref) {
            resolvedItem =
              resolveRef(unionItemObj.$ref, rootSchema) || unionItem;
          }
        }

        if (
          resolvedItem &&
          typeof resolvedItem === "object" &&
          ((resolvedItem as JSONSchemaObject).type === "object" ||
            (resolvedItem as JSONSchemaObject).properties)
        ) {
          const resolvedItemObj = resolvedItem as JSONSchemaObject;
          const nestedRequired = Array.isArray(resolvedItemObj.required)
            ? resolvedItemObj.required
            : [];
          const properties = resolvedItemObj.properties || {};
          const sortedKeys = sortPropertyKeys(
            Object.keys(properties),
            nestedRequired,
          );
          for (const key of sortedKeys) {
            children.push(
              ...parseProperty(
                key,
                properties[key],
                nestedRequired.includes(key),
                {
                  parentPath: `${fullPath}.*`,
                  rootSchema,
                },
              ),
            );
          }
        }
      });
    } else if (
      itemSchema &&
      typeof itemSchema === "object" &&
      ((itemSchema as JSONSchemaObject).type === "object" ||
        (itemSchema as JSONSchemaObject).properties)
    ) {
      // Handle regular object items (non-union)
      const itemSchemaObj = itemSchema as JSONSchemaObject;
      const nestedRequired = Array.isArray(itemSchemaObj.required)
        ? itemSchemaObj.required
        : [];
      const properties = itemSchemaObj.properties || {};
      const sortedKeys = sortPropertyKeys(
        Object.keys(properties),
        nestedRequired,
      );
      for (const key of sortedKeys) {
        children.push(
          ...parseProperty(key, properties[key], nestedRequired.includes(key), {
            parentPath: `${fullPath}.*`,
            rootSchema,
          }),
        );
      }

      // Handle additionalProperties inside array items if present
      if (
        itemSchemaObj.additionalProperties &&
        typeof itemSchemaObj.additionalProperties === "object"
      ) {
        children.push(
          ...parseProperty("*", itemSchemaObj.additionalProperties, false, {
            parentPath: `${fullPath}.*`,
            rootSchema,
          }),
        );
      }
    }
  }

  return children;
}

export function parseSchema(
  schema: unknown,
  options: SchemaParsingOptions = {},
): PropertyInfo[] {
  if (!schema || typeof schema !== "object") {
    return [];
  }

  const schemaObj = schema as JSONSchemaObject;
  const { customOrder = [] } = options;
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
    console.log(`Could not find root schema: ${rootName}`);
    return [];
  }

  const rootSchemaObj = rootSchema as JSONSchemaObject;
  const required = Array.isArray(rootSchemaObj.required)
    ? rootSchemaObj.required
    : [];

  if (
    !rootSchemaObj.properties ||
    typeof rootSchemaObj.properties !== "object"
  ) {
    return [];
  }

  const properties = rootSchemaObj.properties;
  const sortedKeys = sortPropertyKeys(
    Object.keys(properties),
    required,
    customOrder,
  );
  const result: PropertyInfo[] = [];

  for (const key of sortedKeys) {
    result.push(
      ...parseProperty(key, properties[key], required.includes(key), {
        rootSchema: schema,
      }),
    );
  }

  return result;
}

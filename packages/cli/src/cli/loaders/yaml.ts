import YAML, { ToStringOptions } from "yaml";
import { ILoader } from "./_types";
import { createLoader } from "./_utils";

export default function createYamlLoader(): ILoader<
  string,
  Record<string, any>
> {
  return createLoader({
    async pull(locale, input) {
      return YAML.parse(input) || {};
    },
    async push(locale, payload, originalInput) {
      // If no original input, use simple stringify
      if (!originalInput || !originalInput.trim()) {
        return YAML.stringify(payload, {
          lineWidth: -1,
          defaultKeyType: "PLAIN",
          defaultStringType: "PLAIN",
        });
      }

      try {
        // Parse source and extract quoting metadata
        const sourceDoc = YAML.parseDocument(originalInput);
        const quotingMap = extractQuotingMetadata(sourceDoc);

        // Create output document and apply source quoting
        const outputDoc = YAML.parseDocument(
          YAML.stringify(payload, {
            lineWidth: -1,
            defaultKeyType: getKeyType(originalInput),
          }),
        );
        applyQuotingMetadata(outputDoc, quotingMap);

        return outputDoc.toString({ lineWidth: -1 });
      } catch (error) {
        console.warn("Failed to preserve YAML formatting:", error);
        // Fallback to current behavior
        return YAML.stringify(payload, {
          lineWidth: -1,
          defaultKeyType: getKeyType(originalInput),
          defaultStringType: getStringType(originalInput),
        });
      }
    },
  });
}

// Extract quoting metadata from source document
function extractQuotingMetadata(doc: YAML.Document): Map<string, string> {
  const quotingMap = new Map<string, string>();
  const root = doc.contents;
  if (!root) return quotingMap;

  // Detect yaml-root-key pattern (single root key like "en:" or "es:")
  let startNode: any = root;
  if (isYAMLMap(root)) {
    const rootMap = root as any;
    if (rootMap.items && rootMap.items.length === 1) {
      const firstPair = rootMap.items[0];
      if (firstPair && firstPair.value) {
        startNode = firstPair.value;
      }
    }
  }

  walkAndExtract(startNode, [], quotingMap);
  return quotingMap;
}

// Walk AST and extract quoting information
function walkAndExtract(
  node: any,
  path: string[],
  quotingMap: Map<string, string>,
): void {
  if (isScalar(node)) {
    // Store non-PLAIN quoting types
    if (node.type && node.type !== "PLAIN") {
      quotingMap.set(path.join("."), node.type);
    }
  } else if (isYAMLMap(node)) {
    if (node.items && Array.isArray(node.items)) {
      for (const pair of node.items) {
        if (pair && pair.key) {
          const key = getKeyValue(pair.key);
          if (key !== null && key !== undefined && pair.value) {
            walkAndExtract(pair.value, [...path, String(key)], quotingMap);
          }
        }
      }
    }
  } else if (isYAMLSeq(node)) {
    if (node.items && Array.isArray(node.items)) {
      for (let i = 0; i < node.items.length; i++) {
        if (node.items[i]) {
          walkAndExtract(node.items[i], [...path, String(i)], quotingMap);
        }
      }
    }
  }
}

// Apply quoting metadata to output document
function applyQuotingMetadata(
  doc: YAML.Document,
  quotingMap: Map<string, string>,
): void {
  const root = doc.contents;
  if (!root) return;

  // Detect yaml-root-key pattern
  let startNode: any = root;
  if (isYAMLMap(root)) {
    const rootMap = root as any;
    if (rootMap.items && rootMap.items.length === 1) {
      const firstPair = rootMap.items[0];
      if (firstPair && firstPair.value) {
        startNode = firstPair.value;
      }
    }
  }

  walkAndApply(startNode, [], quotingMap);
}

// Walk AST and apply quoting information
function walkAndApply(
  node: any,
  path: string[],
  quotingMap: Map<string, string>,
): void {
  if (isScalar(node)) {
    const pathKey = path.join(".");
    const quoteType = quotingMap.get(pathKey);
    if (quoteType) {
      node.type = quoteType;
    }
  } else if (isYAMLMap(node)) {
    if (node.items && Array.isArray(node.items)) {
      for (const pair of node.items) {
        if (pair && pair.key) {
          const key = getKeyValue(pair.key);
          if (key !== null && key !== undefined && pair.value) {
            walkAndApply(pair.value, [...path, String(key)], quotingMap);
          }
        }
      }
    }
  } else if (isYAMLSeq(node)) {
    if (node.items && Array.isArray(node.items)) {
      for (let i = 0; i < node.items.length; i++) {
        if (node.items[i]) {
          walkAndApply(node.items[i], [...path, String(i)], quotingMap);
        }
      }
    }
  }
}

// Type guards
function isScalar(node: any): boolean {
  if (node?.constructor?.name === "Scalar") {
    return true;
  }
  return (
    node &&
    typeof node === "object" &&
    "value" in node &&
    ("type" in node || "format" in node)
  );
}

function isYAMLMap(node: any): boolean {
  if (node?.constructor?.name === "YAMLMap") {
    return true;
  }
  return (
    node &&
    typeof node === "object" &&
    "items" in node &&
    Array.isArray(node.items) &&
    !("value" in node)
  );
}

function isYAMLSeq(node: any): boolean {
  if (node?.constructor?.name === "YAMLSeq") {
    return true;
  }
  return (
    node &&
    typeof node === "object" &&
    "items" in node &&
    Array.isArray(node.items) &&
    !("type" in node) &&
    !("value" in node)
  );
}

function getKeyValue(key: any): string | number | null {
  if (key === null || key === undefined) {
    return null;
  }
  // Scalar key
  if (typeof key === "object" && "value" in key) {
    return key.value;
  }
  // Already a primitive
  if (typeof key === "string" || typeof key === "number") {
    return key;
  }
  return null;
}

// check if the yaml keys are using double quotes or single quotes
function getKeyType(
  yamlString: string | null,
): ToStringOptions["defaultKeyType"] {
  if (yamlString) {
    const lines = yamlString.split("\n");
    const hasDoubleQuotes = lines.find((line) => {
      return line.trim().startsWith('"') && line.trim().match('":');
    });
    if (hasDoubleQuotes) {
      return "QUOTE_DOUBLE";
    }
  }
  return "PLAIN";
}

// check if the yaml string values are using double quotes or single quotes
function getStringType(
  yamlString: string | null,
): ToStringOptions["defaultStringType"] {
  if (yamlString) {
    const lines = yamlString.split("\n");

    // Check if the file uses literal block scalars (|, |-, |+)
    const hasLiteralBlockScalar = lines.find((line) => {
      const trimmedLine = line.trim();
      return trimmedLine.match(/:\s*\|[-+]?\s*$/);
    });

    // If literal block scalars are used, always use PLAIN to preserve them
    if (hasLiteralBlockScalar) {
      return "PLAIN";
    }

    // Otherwise, check for double quotes on string values
    const hasDoubleQuotes = lines.find((line) => {
      const trimmedLine = line.trim();
      return (
        (trimmedLine.startsWith('"') || trimmedLine.match(/:\s*"/)) &&
        (trimmedLine.endsWith('"') || trimmedLine.endsWith('",'))
      );
    });
    if (hasDoubleQuotes) {
      return "QUOTE_DOUBLE";
    }
  }
  return "PLAIN";
}

import YAML, { ToStringOptions } from "yaml";
import { ILoader } from "./_types";
import { createLoader } from "./_utils";

interface QuotingMetadata {
  keys: Map<string, string>;
  values: Map<string, string>;
}

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

        // Create output document - let the library handle smart quoting
        const outputDoc = YAML.parseDocument(
          YAML.stringify(payload, {
            lineWidth: -1,
            defaultKeyType: "PLAIN",
          }),
        );

        // Detect if this is yaml-root-key format by comparing structures
        const isRootKeyFormat = detectRootKeyFormat(sourceDoc, outputDoc);

        // Extract and apply metadata with root-key awareness
        const metadata = extractQuotingMetadata(sourceDoc, isRootKeyFormat);
        applyQuotingMetadata(outputDoc, metadata, isRootKeyFormat);

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

// Detect if this is yaml-root-key format by comparing source and output structures
function detectRootKeyFormat(
  sourceDoc: YAML.Document,
  outputDoc: YAML.Document,
): boolean {
  const sourceRoot = sourceDoc.contents;
  const outputRoot = outputDoc.contents;

  // Both must be maps with single root key
  if (!isYAMLMap(sourceRoot) || !isYAMLMap(outputRoot)) {
    return false;
  }

  const sourceMap = sourceRoot as any;
  const outputMap = outputRoot as any;

  if (
    !sourceMap.items ||
    sourceMap.items.length !== 1 ||
    !outputMap.items ||
    outputMap.items.length !== 1
  ) {
    return false;
  }

  const sourceRootKey = getKeyValue(sourceMap.items[0].key);
  const outputRootKey = getKeyValue(outputMap.items[0].key);

  // If both have single root keys that are DIFFERENT strings, it's yaml-root-key format
  // (e.g., source has "en:", output has "es:")
  if (
    sourceRootKey !== outputRootKey &&
    typeof sourceRootKey === "string" &&
    typeof outputRootKey === "string"
  ) {
    return true;
  }

  return false;
}

// Extract quoting metadata from source document
function extractQuotingMetadata(
  doc: YAML.Document,
  skipRootKey: boolean,
): QuotingMetadata {
  const metadata: QuotingMetadata = {
    keys: new Map<string, string>(),
    values: new Map<string, string>(),
  };
  const root = doc.contents;
  if (!root) return metadata;

  let startNode: any = root;

  // If yaml-root-key format, skip the locale root key
  if (skipRootKey && isYAMLMap(root)) {
    const rootMap = root as any;
    if (rootMap.items && rootMap.items.length === 1) {
      startNode = rootMap.items[0].value;
    }
  }

  walkAndExtract(startNode, [], metadata);
  return metadata;
}

// Walk AST and extract quoting information
function walkAndExtract(
  node: any,
  path: string[],
  metadata: QuotingMetadata,
): void {
  if (isScalar(node)) {
    // Store non-PLAIN value quoting types
    if (node.type && node.type !== "PLAIN") {
      metadata.values.set(path.join("."), node.type);
    }
  } else if (isYAMLMap(node)) {
    if (node.items && Array.isArray(node.items)) {
      for (const pair of node.items) {
        if (pair && pair.key) {
          const key = getKeyValue(pair.key);
          if (key !== null && key !== undefined) {
            const keyPath = [...path, String(key)].join(".");

            // Store non-PLAIN key quoting types
            if (pair.key.type && pair.key.type !== "PLAIN") {
              metadata.keys.set(keyPath, pair.key.type);
            }

            // Continue walking values
            if (pair.value) {
              walkAndExtract(pair.value, [...path, String(key)], metadata);
            }
          }
        }
      }
    }
  } else if (isYAMLSeq(node)) {
    if (node.items && Array.isArray(node.items)) {
      for (let i = 0; i < node.items.length; i++) {
        if (node.items[i]) {
          walkAndExtract(node.items[i], [...path, String(i)], metadata);
        }
      }
    }
  }
}

// Apply quoting metadata to output document
function applyQuotingMetadata(
  doc: YAML.Document,
  metadata: QuotingMetadata,
  skipRootKey: boolean,
): void {
  const root = doc.contents;
  if (!root) return;

  let startNode: any = root;

  // If yaml-root-key format, skip the locale root key
  if (skipRootKey && isYAMLMap(root)) {
    const rootMap = root as any;
    if (rootMap.items && rootMap.items.length === 1) {
      startNode = rootMap.items[0].value;
    }
  }

  walkAndApply(startNode, [], metadata);
}

// Walk AST and apply quoting information
function walkAndApply(
  node: any,
  path: string[],
  metadata: QuotingMetadata,
): void {
  if (isScalar(node)) {
    // Apply value quoting
    const pathKey = path.join(".");
    const quoteType = metadata.values.get(pathKey);
    if (quoteType) {
      node.type = quoteType;
    }
  } else if (isYAMLMap(node)) {
    if (node.items && Array.isArray(node.items)) {
      for (const pair of node.items) {
        if (pair && pair.key) {
          const key = getKeyValue(pair.key);
          if (key !== null && key !== undefined) {
            const keyPath = [...path, String(key)].join(".");

            // Apply key quoting
            const keyQuoteType = metadata.keys.get(keyPath);
            if (keyQuoteType) {
              pair.key.type = keyQuoteType;
            }

            // Continue walking values
            if (pair.value) {
              walkAndApply(pair.value, [...path, String(key)], metadata);
            }
          }
        }
      }
    }
  } else if (isYAMLSeq(node)) {
    if (node.items && Array.isArray(node.items)) {
      for (let i = 0; i < node.items.length; i++) {
        if (node.items[i]) {
          walkAndApply(node.items[i], [...path, String(i)], metadata);
        }
      }
    }
  }
}

// Type guards using YAML library's built-in functions
function isScalar(node: any): boolean {
  return YAML.isScalar(node);
}

function isYAMLMap(node: any): boolean {
  return YAML.isMap(node);
}

function isYAMLSeq(node: any): boolean {
  return YAML.isSeq(node);
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

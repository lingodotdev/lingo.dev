import Markdoc from "@markdoc/markdoc";
import YAML from "yaml";
import { ILoader } from "./_types";
import { createLoader } from "./_utils";

type MarkdocNode = {
  $$mdtype?: string;
  type: string;
  tag?: string;
  attributes?: Record<string, any>;
  children?: MarkdocNode[];
  [key: string]: any;
};

type NodeCounter = {
  [nodeType: string]: number;
};

type NodePathMap = {
  [semanticKey: string]: string; // maps semantic key to AST path
};

const FM_ATTR_PREFIX = "fm-attr-";

export default function createMarkdocLoader(): ILoader<
  string,
  Record<string, string>
> {
  return createLoader({
    async pull(locale, input) {
      const ast = Markdoc.parse(input) as unknown as MarkdocNode;
      const result: Record<string, string> = {};
      const counters: NodeCounter = {};

      // Traverse the AST and extract text content with semantic keys
      traverseAndExtract(ast, "", result, counters);

      // Extract frontmatter if present
      if (ast.attributes?.frontmatter) {
        const frontmatter = YAML.parse(ast.attributes.frontmatter);
        Object.entries(frontmatter).forEach(([key, value]) => {
          if (typeof value === "string") {
            result[`${FM_ATTR_PREFIX}${key}`] = value;
          }
        });
      }

      return result;
    },

    async push(locale, data, originalInput) {
      if (!originalInput) {
        throw new Error("Original input is required for push");
      }

      const ast = Markdoc.parse(originalInput) as unknown as MarkdocNode;
      const counters: NodeCounter = {};
      const pathMap: NodePathMap = {};

      // Build path map from semantic keys to AST paths
      buildPathMap(ast, "", counters, pathMap);

      // Extract frontmatter from data
      const frontmatterEntries = Object.entries(data)
        .filter(([key]) => key.startsWith(FM_ATTR_PREFIX))
        .map(([key, value]) => [key.replace(FM_ATTR_PREFIX, ""), value]);

      // Update frontmatter in AST if present
      if (frontmatterEntries.length > 0 && ast.attributes) {
        const frontmatter = Object.fromEntries(frontmatterEntries);
        ast.attributes.frontmatter = YAML.stringify(frontmatter, {
          defaultStringType: "PLAIN",
        }).trim();
      }

      // Filter out frontmatter keys from translation data
      const contentData = Object.fromEntries(
        Object.entries(data).filter(([key]) => !key.startsWith(FM_ATTR_PREFIX)),
      );

      // Apply translations using the path map
      applyTranslations(ast, "", contentData, pathMap);

      // Format back to string
      return Markdoc.format(ast);
    },
  });
}

function getSemanticNodeType(node: MarkdocNode): string | null {
  // For custom tags, use the tag name instead of "tag"
  if (node.type === "tag") return node.tag || "tag";
  return node.type;
}

function traverseAndExtract(
  node: MarkdocNode,
  path: string,
  result: Record<string, string>,
  counters: NodeCounter,
  parentType?: string,
) {
  if (!node || typeof node !== "object") {
    return;
  }

  // Determine the semantic type for this node
  let semanticType = parentType;
  const nodeSemanticType = getSemanticNodeType(node);

  // Use node's own semantic type for structural elements
  if (
    nodeSemanticType &&
    !["text", "strong", "em", "inline", "link"].includes(nodeSemanticType)
  ) {
    semanticType = nodeSemanticType;
  }

  // If this is a text node, extract its content only if it's a string
  // Skip interpolation nodes (where content is a Variable or Function object)
  if (node.type === "text" && node.attributes?.content) {
    const content = node.attributes.content;

    // Only extract if content is a string (not interpolation)
    if (typeof content === "string" && content.trim()) {
      if (semanticType) {
        const index = counters[semanticType] || 0;
        counters[semanticType] = index + 1;
        const semanticKey = `${semanticType}-${index}`;
        result[semanticKey] = content;
      }
    }
  }

  // If the node has children, traverse them
  if (Array.isArray(node.children)) {
    node.children.forEach((child, index) => {
      const childPath = path
        ? `${path}/children/${index}`
        : `children/${index}`;
      traverseAndExtract(child, childPath, result, counters, semanticType);
    });
  }
}

function buildPathMap(
  node: MarkdocNode,
  path: string,
  counters: NodeCounter,
  pathMap: NodePathMap,
  parentType?: string,
) {
  if (!node || typeof node !== "object") {
    return;
  }

  // Determine the semantic type for this node
  let semanticType = parentType;
  const nodeSemanticType = getSemanticNodeType(node);

  // Use node's own semantic type for structural elements
  if (
    nodeSemanticType &&
    !["text", "strong", "em", "inline", "link"].includes(nodeSemanticType)
  ) {
    semanticType = nodeSemanticType;
  }

  // Build the map from semantic keys to AST paths
  if (node.type === "text" && node.attributes?.content) {
    const content = node.attributes.content;

    if (typeof content === "string" && content.trim()) {
      if (semanticType) {
        const index = counters[semanticType] || 0;
        counters[semanticType] = index + 1;
        const semanticKey = `${semanticType}-${index}`;
        const contentPath = path
          ? `${path}/attributes/content`
          : "attributes/content";
        pathMap[semanticKey] = contentPath;
      }
    }
  }

  // Recursively build map for children
  if (Array.isArray(node.children)) {
    node.children.forEach((child, index) => {
      const childPath = path
        ? `${path}/children/${index}`
        : `children/${index}`;
      buildPathMap(child, childPath, counters, pathMap, semanticType);
    });
  }
}

function applyTranslations(
  node: MarkdocNode,
  path: string,
  data: Record<string, string>,
  pathMap: NodePathMap,
) {
  if (!node || typeof node !== "object") {
    return;
  }

  // Check if we have a translation for this node's text content
  // Only apply translations to string content (not interpolation)
  if (node.type === "text" && node.attributes?.content) {
    const content = node.attributes.content;

    // Only apply translation if content is currently a string
    if (typeof content === "string") {
      const contentPath = path
        ? `${path}/attributes/content`
        : "attributes/content";

      // Find the semantic key for this path
      const semanticKey = Object.keys(pathMap).find(
        (key) => pathMap[key] === contentPath,
      );

      if (semanticKey && data[semanticKey] !== undefined) {
        node.attributes.content = data[semanticKey];
      }
    }
    // If content is an object (Variable/Function), leave it unchanged
  }

  // Recursively apply translations to children
  if (Array.isArray(node.children)) {
    node.children.forEach((child, index) => {
      const childPath = path
        ? `${path}/children/${index}`
        : `children/${index}`;
      applyTranslations(child, childPath, data, pathMap);
    });
  }
}

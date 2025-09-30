import Markdoc from "@markdoc/markdoc";
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

export default function createMarkdocLoader(): ILoader<
  string,
  Record<string, string>
> {
  return createLoader({
    async pull(locale, input) {
      const ast = Markdoc.parse(input) as unknown as MarkdocNode;
      const result: Record<string, string> = {};

      // Traverse the AST and extract text content
      traverseAndExtract(ast, "", result);

      return result;
    },

    async push(locale, data, originalInput) {
      if (!originalInput) {
        throw new Error("Original input is required for push");
      }

      const ast = Markdoc.parse(originalInput) as unknown as MarkdocNode;

      // Apply translations to the AST
      applyTranslations(ast, "", data);

      // Format back to string
      return Markdoc.format(ast);
    },
  });
}

function traverseAndExtract(
  node: MarkdocNode,
  path: string,
  result: Record<string, string>,
) {
  if (!node || typeof node !== "object") {
    return;
  }

  // If this is a text node, extract its content only if it's a string
  // Skip interpolation nodes (where content is a Variable or Function object)
  if (node.type === "text" && node.attributes?.content) {
    const content = node.attributes.content;

    // Only extract if content is a string (not interpolation)
    if (typeof content === "string") {
      const contentPath = path
        ? `${path}/attributes/content`
        : "attributes/content";
      result[contentPath] = content;
    }
  }

  // If the node has children, traverse them
  if (Array.isArray(node.children)) {
    node.children.forEach((child, index) => {
      const childPath = path
        ? `${path}/children/${index}`
        : `children/${index}`;
      traverseAndExtract(child, childPath, result);
    });
  }
}

function applyTranslations(
  node: MarkdocNode,
  path: string,
  data: Record<string, string>,
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
      if (data[contentPath] !== undefined) {
        node.attributes.content = data[contentPath];
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
      applyTranslations(child, childPath, data);
    });
  }
}

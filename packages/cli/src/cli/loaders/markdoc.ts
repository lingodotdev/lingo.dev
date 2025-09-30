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
  result: Record<string, string>
) {
  if (!node || typeof node !== "object") {
    return;
  }

  // If this is a text node, extract its content
  if (node.type === "text" && node.attributes?.content) {
    const contentPath = path ? `${path}/attributes/content` : "attributes/content";
    result[contentPath] = node.attributes.content;
  }

  // If the node has children, traverse them
  if (Array.isArray(node.children)) {
    node.children.forEach((child, index) => {
      const childPath = path ? `${path}/children/${index}` : `children/${index}`;
      traverseAndExtract(child, childPath, result);
    });
  }
}

function applyTranslations(
  node: MarkdocNode,
  path: string,
  data: Record<string, string>
) {
  if (!node || typeof node !== "object") {
    return;
  }

  // Check if we have a translation for this node's text content
  if (node.type === "text" && node.attributes?.content) {
    const contentPath = path ? `${path}/attributes/content` : "attributes/content";
    if (data[contentPath] !== undefined) {
      node.attributes.content = data[contentPath];
    }
  }

  // Recursively apply translations to children
  if (Array.isArray(node.children)) {
    node.children.forEach((child, index) => {
      const childPath = path ? `${path}/children/${index}` : `children/${index}`;
      applyTranslations(child, childPath, data);
    });
  }
}
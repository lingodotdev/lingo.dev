import { parseStringPromise, Builder } from "xml2js";
import { ILoader } from "./_types";
import { createLoader } from "./_utils";

// MJML components that contain localizable text content
const LOCALIZABLE_TEXT_COMPONENTS = [
  "mj-text",
  "mj-button",
  "mj-title",
  "mj-preview",
  "mj-navbar-link",
  "mj-accordion-title",
  "mj-accordion-text",
];

// HTML leaf block elements that should be extracted as complete units
// These are block-level elements that contain text + inline elements (like <strong>, <span>)
// but should not have their children extracted separately (to avoid duplication)
const HTML_LEAF_BLOCKS = [
  "p",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "li",
  // Note: td, th, div, span are NOT leaf blocks - they're containers
];

// MJML components with localizable attributes
const LOCALIZABLE_ATTRIBUTES: Record<string, string[]> = {
  "mj-image": ["alt", "title"],
  "mj-button": ["title", "aria-label"],
  "mj-social-element": ["title", "alt"],
  // HTML elements with localizable attributes
  "img": ["alt", "title"],
  "a": ["title", "aria-label"],
};

export default function createMjmlLoader(): ILoader<
  string,
  Record<string, any>
> {
  return createLoader({
    async pull(locale, input) {
      const result: Record<string, any> = {};

      try {
        // Parse with preserveChildrenOrder to capture inline HTML elements
        const parsed = await parseStringPromise(input, {
          explicitArray: true,
          explicitChildren: true,
          preserveChildrenOrder: true,
          charsAsChildren: true,
          includeWhiteChars: true,
          mergeAttrs: false,
          trim: false,
          attrkey: "$",
          charkey: "_",
          childkey: "$$",
        });

        // Handle root object structure { mjml: { ... } }
        if (!parsed || typeof parsed !== "object") {
          console.error("Failed to parse MJML: invalid parsed structure");
          return result;
        }

        const rootKey = Object.keys(parsed).find(key => !key.startsWith("_") && !key.startsWith("$"));
        const rootNode = rootKey ? parsed[rootKey] : parsed;
        const rootPath = rootNode["#name"] || rootKey || "";

        // Traverse using $$ children array
        traverseMjmlWithUpdate(rootNode, (node, path, componentName) => {
          // Extract localizable attributes first (always do this)
          const localizableAttrs = LOCALIZABLE_ATTRIBUTES[componentName];
          if (localizableAttrs && typeof node === "object" && node.$) {
            localizableAttrs.forEach((attr) => {
              const attrValue = node.$[attr];
              if (attrValue) {
                result[`${path}#${attr}`] = attrValue;
              }
            });
          }

          // Extract text content from localizable MJML components
          if (LOCALIZABLE_TEXT_COMPONENTS.includes(componentName)) {
            const textContent = extractTextContent(node);
            if (textContent) {
              result[path] = textContent;
              // Skip children - they're already included in the innerHTML
              return "SKIP_CHILDREN";
            }
          }

          // Extract text content from HTML leaf blocks (like <p>, <h1>, etc.)
          if (HTML_LEAF_BLOCKS.includes(componentName)) {
            const textContent = extractTextContent(node);
            if (textContent) {
              result[path] = textContent;
              // Skip children - they're already included in the innerHTML
              return "SKIP_CHILDREN";
            }
          }

          return undefined; // Continue traversing into children
        }, rootPath);
      } catch (error) {
        console.error("Failed to parse MJML:", error);
      }

      return result;
    },

    async push(locale, data, originalInput) {
      try {
        // Parse with preserveChildrenOrder to maintain element order
        const parsed = await parseStringPromise(originalInput || "", {
          explicitArray: true,
          explicitChildren: true,
          preserveChildrenOrder: true,
          charsAsChildren: true,
          includeWhiteChars: true,
          mergeAttrs: false,
          trim: false,
          attrkey: "$",
          charkey: "_",
          childkey: "$$",
        });

        // Update the tree with translated content
        // Handle root object structure { mjml: { ... } }
        if (!parsed || typeof parsed !== "object") {
          console.error("Failed to parse MJML for push: invalid parsed structure");
          return originalInput || "";
        }

        const rootKey = Object.keys(parsed).find(key => !key.startsWith("_") && !key.startsWith("$"));
        const rootNode = rootKey ? parsed[rootKey] : parsed;

        // Start path with the root element name (e.g., "mjml")
        const rootPath = rootNode["#name"] || rootKey || "";

        traverseMjmlWithUpdate(rootNode, (node, path, componentName) => {
          // Update attributes first (always do this)
          const localizableAttrs = LOCALIZABLE_ATTRIBUTES[componentName];
          if (localizableAttrs && typeof node === "object" && node.$) {
            localizableAttrs.forEach((attr) => {
              const attrKey = `${path}#${attr}`;
              if (data[attrKey] !== undefined) {
                node.$[attr] = data[attrKey];
              }
            });
          }

          // Update text content for MJML components
          if (LOCALIZABLE_TEXT_COMPONENTS.includes(componentName) && data[path]) {
            if (typeof node === "object") {
              const translatedContent = data[path];

              // If node has $$ children array (mixed content with inline HTML)
              if (node.$$ && Array.isArray(node.$$) && node.$$.length > 1) {
                // Parse the translated HTML and rebuild the $$ array
                rebuildChildrenFromHTML(node, translatedContent);
              } else {
                // Simple text node without inline HTML
                node._ = translatedContent;
                if (node.$$ && Array.isArray(node.$$)) {
                  const textChild = node.$$.find((child: any) => child["#name"] === "__text__");
                  if (textChild) {
                    textChild._ = translatedContent;
                  }
                }
              }
            }
            // Skip children - they've already been updated as part of innerHTML
            return "SKIP_CHILDREN";
          }

          // Update text content for HTML leaf blocks
          if (HTML_LEAF_BLOCKS.includes(componentName) && data[path]) {
            if (typeof node === "object") {
              const translatedContent = data[path];

              // If node has $$ children array (mixed content with inline HTML like <a>)
              if (node.$$ && Array.isArray(node.$$) && node.$$.length > 1) {
                // Parse the translated HTML and rebuild the $$ array
                rebuildChildrenFromHTML(node, translatedContent);
              } else {
                // Simple text node without inline HTML
                node._ = translatedContent;
                if (node.$$ && Array.isArray(node.$$)) {
                  const textChild = node.$$.find((child: any) => child["#name"] === "__text__");
                  if (textChild) {
                    textChild._ = translatedContent;
                  }
                }
              }
            }
            // Skip children - they've already been updated as part of innerHTML
            return "SKIP_CHILDREN";
          }

          return undefined; // Continue traversing
        }, rootPath);

        // Use custom serializer to preserve order
        return serializeMjml(parsed);
      } catch (error) {
        console.error("Failed to build MJML:", error);
        return "";
      }
    },
  });
}

// Traverse MJML tree and call visitor for each node
function traverseMjml(
  node: any,
  visitor: (node: any, path: string, componentName: string) => void,
  path: string = "",
) {
  if (!node || typeof node !== "object") {
    return;
  }

  Object.keys(node).forEach((key) => {
    // Skip special properties
    if (key === "$" || key === "_") {
      return;
    }

    const value = node[key];

    // If value is an array, iterate through it
    if (Array.isArray(value)) {
      value.forEach((child, index) => {
        const currentPath = path
          ? `${path}/${key}/${index}`
          : `${key}/${index}`;

        // Visit this node
        visitor(child, currentPath, key);

        // Recursively traverse children if it's an object
        if (typeof child === "object" && child !== null) {
          traverseMjml(child, visitor, currentPath);
        }
      });
    } else if (typeof value === "object" && value !== null) {
      // If value is an object (not an array), traverse it directly
      traverseMjml(value, visitor, path ? `${path}/${key}` : key);
    }
  });
}

// Traverse MJML tree with update capability using $$ children array
function traverseMjmlWithUpdate(
  node: any,
  visitor: (node: any, path: string, componentName: string) => string | undefined,
  path: string = "",
) {
  if (!node || typeof node !== "object") {
    return;
  }

  // Get children from $$ array if using preserveChildrenOrder
  const children = node.$$;
  if (Array.isArray(children)) {
    // Count element types at this level for proper indexing
    const elementCounts = new Map<string, number>();

    children.forEach((child: any) => {
      const elementName = child["#name"];

      // Skip text nodes, comments, etc.
      if (!elementName || elementName.startsWith("__")) {
        return;
      }

      // Track index for this element type
      const currentIndex = elementCounts.get(elementName) || 0;
      elementCounts.set(elementName, currentIndex + 1);

      const currentPath = path
        ? `${path}/${elementName}/${currentIndex}`
        : `${elementName}/${currentIndex}`;

      // Visit this node
      visitor(child, currentPath, elementName);

      // Recursively traverse children
      traverseMjmlWithUpdate(child, visitor, currentPath);
    });
    return;
  }

  // Fallback: traverse object keys (for nodes without $$)
  Object.keys(node).forEach((key) => {
    // Skip special properties
    if (key === "$" || key === "_" || key === "$$") {
      return;
    }

    const value = node[key];

    // If value is an array, iterate through it
    if (Array.isArray(value)) {
      value.forEach((child, index) => {
        const currentPath = path
          ? `${path}/${key}/${index}`
          : `${key}/${index}`;

        // Visit this node with update capability
        const newValue = visitor(child, currentPath, key);

        // If visitor returns a new value and child is a string, replace it
        if (newValue !== undefined && typeof child === "string") {
          value[index] = newValue;
        }

        // Recursively traverse children if it's an object
        if (typeof child === "object" && child !== null) {
          traverseMjmlWithUpdate(child, visitor, currentPath);
        }
      });
    } else if (typeof value === "object" && value !== null) {
      // If value is an object (not an array), traverse it directly
      traverseMjmlWithUpdate(value, visitor, path ? `${path}/${key}` : key);
    }
  });
}

// Extract text content from a node, including inline HTML tags
function extractTextContent(node: any): string | null {
  // If node is a string, return it directly
  if (typeof node === "string") {
    const trimmed = node.trim();
    return trimmed || null;
  }

  // If node is an array, get first string element
  if (Array.isArray(node)) {
    for (const item of node) {
      if (typeof item === "string") {
        const trimmed = item.trim();
        if (trimmed) return trimmed;
      }
    }
  }

  // If node is an object, we need to serialize the inner HTML content
  if (typeof node === "object" && node !== null) {
    const html = serializeInnerHTML(node);
    // Trim outer whitespace (newlines/indentation) from the final extracted HTML
    // This matches HTML loader behavior
    return html ? html.trim() : null;
  }

  return null;
}

// Rebuild the $$ children array from translated HTML string
function rebuildChildrenFromHTML(node: any, htmlContent: string): void {
  // Parse the HTML content to extract text and inline elements
  // This is a simplified parser that handles common inline elements like <a>, <span>, <strong>, etc.

  const newChildren: any[] = [];
  let currentText = "";
  let pos = 0;

  while (pos < htmlContent.length) {
    const tagStart = htmlContent.indexOf("<", pos);

    if (tagStart === -1) {
      // No more tags, rest is text
      currentText += htmlContent.substring(pos);
      break;
    }

    // Add text before the tag
    if (tagStart > pos) {
      currentText += htmlContent.substring(pos, tagStart);
    }

    // Check if it's a closing tag or self-closing
    if (htmlContent[tagStart + 1] === "/") {
      // Closing tag - this shouldn't happen at this level
      // Find the end of the closing tag
      const tagEnd = htmlContent.indexOf(">", tagStart);
      if (tagEnd !== -1) {
        pos = tagEnd + 1;
      } else {
        break;
      }
      continue;
    }

    // Parse opening tag
    const tagEnd = htmlContent.indexOf(">", tagStart);
    if (tagEnd === -1) {
      // Malformed HTML, treat rest as text
      currentText += htmlContent.substring(pos);
      break;
    }

    const tagContent = htmlContent.substring(tagStart + 1, tagEnd);
    const selfClosing = tagContent.endsWith("/");
    const tagParts = (selfClosing ? tagContent.slice(0, -1) : tagContent).trim().split(/\s+/);
    const tagName = tagParts[0];

    // Parse attributes
    const attrs: Record<string, string> = {};
    const attrRegex = /(\w+)=["']([^"']*)["']/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(tagContent)) !== null) {
      attrs[attrMatch[1]] = attrMatch[2];
    }

    if (currentText) {
      // Add accumulated text as a text node
      newChildren.push({
        "#name": "__text__",
        "_": currentText,
      });
      currentText = "";
    }

    if (selfClosing) {
      // Self-closing tag (like <img />)
      newChildren.push({
        "#name": tagName,
        "$": attrs,
        "$$": [],
      });
      pos = tagEnd + 1;
    } else {
      // Find the closing tag
      const closingTag = `</${tagName}>`;
      const closeStart = htmlContent.indexOf(closingTag, tagEnd + 1);

      if (closeStart === -1) {
        // No closing tag found, treat as self-closing
        newChildren.push({
          "#name": tagName,
          "$": attrs,
          "_": "",
          "$$": [{
            "#name": "__text__",
            "_": "",
          }],
        });
        pos = tagEnd + 1;
      } else {
        // Extract inner text
        const innerText = htmlContent.substring(tagEnd + 1, closeStart);

        newChildren.push({
          "#name": tagName,
          "$": attrs,
          "_": innerText,
          "$$": [{
            "#name": "__text__",
            "_": innerText,
          }],
        });
        pos = closeStart + closingTag.length;
      }
    }
  }

  // Add any remaining text
  if (currentText) {
    newChildren.push({
      "#name": "__text__",
      "_": currentText,
    });
  }

  // Replace the $$ array
  node.$$ = newChildren;

  // Also update node._ to match (for backward compatibility)
  node._ = htmlContent;
}

// Serialize inner HTML content of a node (used when extracting mixed content)
function serializeInnerHTML(node: any): string | null {
  if (!node || typeof node !== "object") {
    return null;
  }

  // If node has $$ children array (preserveChildrenOrder), serialize it
  if (Array.isArray(node.$$)) {
    let html = "";

    node.$$.forEach((child: any) => {
      const childName = child["#name"];

      if (childName === "__text__") {
        // Text node - preserve all whitespace
        html += child._ || "";
      } else if (childName && !childName.startsWith("__")) {
        // Element node (like <a>, <span>, <strong>, etc.)
        const attrs = child.$ || {};
        const attrString = Object.entries(attrs)
          .map(([key, value]) => ` ${key}="${escapeAttributeValue(String(value))}"`)
          .join("");

        // Self-closing tags for void elements
        const voidElements = ["img", "br", "hr", "input", "meta", "link"];
        if (voidElements.includes(childName)) {
          html += `<${childName}${attrString} />`;
        } else {
          // Recursively serialize inner content
          const innerContent = serializeInnerHTML(child) || "";
          html += `<${childName}${attrString}>${innerContent}</${childName}>`;
        }
      }
    });

    // Don't trim here - preserve all whitespace in HTML
    // Trimming happens at extraction time in extractTextContent if needed
    return html || null;
  }

  // Fallback for simple text node
  const textContent = node._ || "";
  return textContent || null;
}

// Serialize MJML preserving element order (similar to Android serializeElement)
function serializeMjml(parsed: any): string {
  const xmlDec = '<?xml version="1.0" encoding="UTF-8"?>\n';

  // Handle root object structure { mjml: { ... } }
  const rootKey = Object.keys(parsed).find(key => !key.startsWith("_") && !key.startsWith("$"));
  const rootNode = rootKey ? parsed[rootKey] : parsed;

  const body = serializeElement(rootNode);
  return xmlDec + body;
}

function serializeElement(node: any, indent: string = ""): string {
  if (!node) {
    return "";
  }

  const name = node["#name"] ?? "mjml";

  // Handle text nodes
  if (name === "__text__") {
    return node._ ?? "";
  }

  // Handle CDATA
  if (name === "__cdata") {
    return `<![CDATA[${node._ ?? ""}]]>`;
  }

  // Handle comments
  if (name === "__comment__") {
    return `<!--${node._ ?? ""}-->`;
  }

  // Build attributes string
  const attributes = node.$ ?? {};
  const attrString = Object.entries(attributes)
    .map(([key, value]) => ` ${key}="${escapeAttributeValue(String(value))}"`)
    .join("");

  // Get children from $$ array (preserves order)
  const children = Array.isArray(node.$$) ? node.$$ : [];

  // If no children, check for text content
  if (children.length === 0) {
    const textContent = node._ ?? "";
    if (textContent) {
      return `${indent}<${name}${attrString}>${textContent}</${name}>`;
    }
    return `${indent}<${name}${attrString} />`;
  }

  // Serialize children
  const childContent = children.map((child: any) => serializeElement(child, indent)).join("");
  return `${indent}<${name}${attrString}>${childContent}</${name}>`;
}

function escapeAttributeValue(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/'/g, "&apos;");
}

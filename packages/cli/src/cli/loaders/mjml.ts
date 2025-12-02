import { parseStringPromise, Builder } from "xml2js";
import { ILoader } from "./_types";
import { createLoader } from "./_utils";

const LOCALIZABLE_TEXT_COMPONENTS = [
  "mj-text",
  "mj-button",
  "mj-title",
  "mj-preview",
  "mj-navbar-link",
  "mj-accordion-title",
  "mj-accordion-text",
];

const HTML_LEAF_BLOCKS = [
  "p",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "li",
];

const LOCALIZABLE_ATTRIBUTES: Record<string, string[]> = {
  "mj-image": ["alt", "title"],
  "mj-button": ["title", "aria-label"],
  "mj-social-element": ["title", "alt"],
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

        if (!parsed || typeof parsed !== "object") {
          console.error("Failed to parse MJML: invalid parsed structure");
          return result;
        }

        const rootKey = Object.keys(parsed).find(key => !key.startsWith("_") && !key.startsWith("$"));
        const rootNode = rootKey ? parsed[rootKey] : parsed;
        const rootPath = rootNode["#name"] || rootKey || "";

        traverseMjmlWithUpdate(rootNode, (node, path, componentName) => {
          const localizableAttrs = LOCALIZABLE_ATTRIBUTES[componentName];
          if (localizableAttrs && typeof node === "object" && node.$) {
            localizableAttrs.forEach((attr) => {
              const attrValue = node.$[attr];
              if (attrValue) {
                result[`${path}#${attr}`] = attrValue;
              }
            });
          }

          if (LOCALIZABLE_TEXT_COMPONENTS.includes(componentName)) {
            const textContent = extractTextContent(node);
            if (textContent) {
              result[path] = textContent;
              return "SKIP_CHILDREN";
            }
          }

          if (HTML_LEAF_BLOCKS.includes(componentName)) {
            const textContent = extractTextContent(node);
            if (textContent) {
              result[path] = textContent;
              return "SKIP_CHILDREN";
            }
          }

          return undefined;
        }, rootPath);
      } catch (error) {
        console.error("Failed to parse MJML:", error);
      }

      return result;
    },

    async push(locale, data, originalInput) {
      try {
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

        if (!parsed || typeof parsed !== "object") {
          console.error("Failed to parse MJML for push: invalid parsed structure");
          return originalInput || "";
        }

        const rootKey = Object.keys(parsed).find(key => !key.startsWith("_") && !key.startsWith("$"));
        const rootNode = rootKey ? parsed[rootKey] : parsed;
        const rootPath = rootNode["#name"] || rootKey || "";

        traverseMjmlWithUpdate(rootNode, (node, path, componentName) => {
          const localizableAttrs = LOCALIZABLE_ATTRIBUTES[componentName];
          if (localizableAttrs && typeof node === "object" && node.$) {
            localizableAttrs.forEach((attr) => {
              const attrKey = `${path}#${attr}`;
              if (data[attrKey] !== undefined) {
                node.$[attr] = data[attrKey];
              }
            });
          }

          if (LOCALIZABLE_TEXT_COMPONENTS.includes(componentName) && data[path]) {
            if (typeof node === "object") {
              const translatedContent = data[path];

              if (node.$$ && Array.isArray(node.$$) && node.$$.length > 1) {
                rebuildChildrenFromHTML(node, translatedContent);
              } else {
                node._ = translatedContent;
                if (node.$$ && Array.isArray(node.$$)) {
                  const textChild = node.$$.find((child: any) => child["#name"] === "__text__");
                  if (textChild) {
                    textChild._ = translatedContent;
                  }
                }
              }
            }
            return "SKIP_CHILDREN";
          }

          if (HTML_LEAF_BLOCKS.includes(componentName) && data[path]) {
            if (typeof node === "object") {
              const translatedContent = data[path];

              if (node.$$ && Array.isArray(node.$$) && node.$$.length > 1) {
                rebuildChildrenFromHTML(node, translatedContent);
              } else {
                node._ = translatedContent;
                if (node.$$ && Array.isArray(node.$$)) {
                  const textChild = node.$$.find((child: any) => child["#name"] === "__text__");
                  if (textChild) {
                    textChild._ = translatedContent;
                  }
                }
              }
            }
            return "SKIP_CHILDREN";
          }

          return undefined;
        }, rootPath);

        return serializeMjml(parsed);
      } catch (error) {
        console.error("Failed to build MJML:", error);
        return "";
      }
    },
  });
}

function traverseMjml(
  node: any,
  visitor: (node: any, path: string, componentName: string) => void,
  path: string = "",
) {
  if (!node || typeof node !== "object") {
    return;
  }

  Object.keys(node).forEach((key) => {
    if (key === "$" || key === "_") {
      return;
    }

    const value = node[key];

    if (Array.isArray(value)) {
      value.forEach((child, index) => {
        const currentPath = path
          ? `${path}/${key}/${index}`
          : `${key}/${index}`;

        visitor(child, currentPath, key);

        if (typeof child === "object" && child !== null) {
          traverseMjml(child, visitor, currentPath);
        }
      });
    } else if (typeof value === "object" && value !== null) {
      traverseMjml(value, visitor, path ? `${path}/${key}` : key);
    }
  });
}

function traverseMjmlWithUpdate(
  node: any,
  visitor: (node: any, path: string, componentName: string) => string | undefined,
  path: string = "",
) {
  if (!node || typeof node !== "object") {
    return;
  }

  const children = node.$$;
  if (Array.isArray(children)) {
    const elementCounts = new Map<string, number>();

    children.forEach((child: any) => {
      const elementName = child["#name"];

      if (!elementName || elementName.startsWith("__")) {
        return;
      }

      const currentIndex = elementCounts.get(elementName) || 0;
      elementCounts.set(elementName, currentIndex + 1);

      const currentPath = path
        ? `${path}/${elementName}/${currentIndex}`
        : `${elementName}/${currentIndex}`;

      visitor(child, currentPath, elementName);

      traverseMjmlWithUpdate(child, visitor, currentPath);
    });
    return;
  }

  Object.keys(node).forEach((key) => {
    if (key === "$" || key === "_" || key === "$$") {
      return;
    }

    const value = node[key];

    if (Array.isArray(value)) {
      value.forEach((child, index) => {
        const currentPath = path
          ? `${path}/${key}/${index}`
          : `${key}/${index}`;

        const newValue = visitor(child, currentPath, key);

        if (newValue !== undefined && typeof child === "string") {
          value[index] = newValue;
        }

        if (typeof child === "object" && child !== null) {
          traverseMjmlWithUpdate(child, visitor, currentPath);
        }
      });
    } else if (typeof value === "object" && value !== null) {
      traverseMjmlWithUpdate(value, visitor, path ? `${path}/${key}` : key);
    }
  });
}

function extractTextContent(node: any): string | null {
  if (typeof node === "string") {
    const trimmed = node.trim();
    return trimmed || null;
  }

  if (Array.isArray(node)) {
    for (const item of node) {
      if (typeof item === "string") {
        const trimmed = item.trim();
        if (trimmed) return trimmed;
      }
    }
  }

  if (typeof node === "object" && node !== null) {
    const html = serializeInnerHTML(node);
    return html ? html.trim() : null;
  }

  return null;
}

function rebuildChildrenFromHTML(node: any, htmlContent: string): void {
  const newChildren: any[] = [];
  let currentText = "";
  let pos = 0;

  while (pos < htmlContent.length) {
    const tagStart = htmlContent.indexOf("<", pos);

    if (tagStart === -1) {
      currentText += htmlContent.substring(pos);
      break;
    }

    if (tagStart > pos) {
      currentText += htmlContent.substring(pos, tagStart);
    }

    if (htmlContent[tagStart + 1] === "/") {
      const tagEnd = htmlContent.indexOf(">", tagStart);
      if (tagEnd !== -1) {
        pos = tagEnd + 1;
      } else {
        break;
      }
      continue;
    }

    const tagEnd = htmlContent.indexOf(">", tagStart);
    if (tagEnd === -1) {
      currentText += htmlContent.substring(pos);
      break;
    }

    const tagContent = htmlContent.substring(tagStart + 1, tagEnd);
    const selfClosing = tagContent.endsWith("/");
    const tagParts = (selfClosing ? tagContent.slice(0, -1) : tagContent).trim().split(/\s+/);
    const tagName = tagParts[0];

    const attrs: Record<string, string> = {};
    const attrRegex = /(\w+)=["']([^"']*)["']/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(tagContent)) !== null) {
      attrs[attrMatch[1]] = attrMatch[2];
    }

    if (currentText) {
      newChildren.push({
        "#name": "__text__",
        "_": currentText,
      });
      currentText = "";
    }

    if (selfClosing) {
      newChildren.push({
        "#name": tagName,
        "$": attrs,
        "$$": [],
      });
      pos = tagEnd + 1;
    } else {
      const closingTag = `</${tagName}>`;
      const closeStart = htmlContent.indexOf(closingTag, tagEnd + 1);

      if (closeStart === -1) {
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

  if (currentText) {
    newChildren.push({
      "#name": "__text__",
      "_": currentText,
    });
  }

  node.$$ = newChildren;
  node._ = htmlContent;
}

function serializeInnerHTML(node: any): string | null {
  if (!node || typeof node !== "object") {
    return null;
  }

  if (Array.isArray(node.$$)) {
    let html = "";

    node.$$.forEach((child: any) => {
      const childName = child["#name"];

      if (childName === "__text__") {
        html += child._ || "";
      } else if (childName && !childName.startsWith("__")) {
        const attrs = child.$ || {};
        const attrString = Object.entries(attrs)
          .map(([key, value]) => ` ${key}="${escapeAttributeValue(String(value))}"`)
          .join("");

        const voidElements = ["img", "br", "hr", "input", "meta", "link"];
        if (voidElements.includes(childName)) {
          html += `<${childName}${attrString} />`;
        } else {
          const innerContent = serializeInnerHTML(child) || "";
          html += `<${childName}${attrString}>${innerContent}</${childName}>`;
        }
      }
    });

    return html || null;
  }

  const textContent = node._ || "";
  return textContent || null;
}

function serializeMjml(parsed: any): string {
  const xmlDec = '<?xml version="1.0" encoding="UTF-8"?>\n';

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

  if (name === "__text__") {
    return node._ ?? "";
  }

  if (name === "__cdata") {
    return `<![CDATA[${node._ ?? ""}]]>`;
  }

  if (name === "__comment__") {
    return `<!--${node._ ?? ""}-->`;
  }

  const attributes = node.$ ?? {};
  const attrString = Object.entries(attributes)
    .map(([key, value]) => ` ${key}="${escapeAttributeValue(String(value))}"`)
    .join("");

  const children = Array.isArray(node.$$) ? node.$$ : [];

  if (children.length === 0) {
    const textContent = node._ ?? "";
    if (textContent) {
      return `${indent}<${name}${attrString}>${textContent}</${name}>`;
    }
    return `${indent}<${name}${attrString} />`;
  }

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

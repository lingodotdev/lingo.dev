import { parseStringPromise, Builder } from "xml2js";
import * as htmlparser2 from "htmlparser2";
import { DomHandler } from "domhandler";
import * as DomSerializer from "dom-serializer";
import { ILoader } from "./_types";
import { createLoader } from "./_utils";

const LOCALIZABLE_COMPONENTS = [
  "mj-text",
  "mj-button",
  "mj-title",
  "mj-preview",
  "mj-navbar-link",
  "mj-accordion-title",
  "mj-accordion-text",
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

      // Handle empty input
      if (!input || input.trim() === "") {
        return result;
      }

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

        traverse(rootNode, (node, path, componentName) => {
          if (typeof node !== "object") return;

          const localizableAttrs = LOCALIZABLE_ATTRIBUTES[componentName];
          if (localizableAttrs && node.$) {
            localizableAttrs.forEach((attr) => {
              const attrValue = node.$[attr];
              if (attrValue) {
                result[`${path}#${attr}`] = attrValue;
              }
            });
          }

          if (LOCALIZABLE_COMPONENTS.includes(componentName)) {
            const innerHTML = getInnerHTML(node);
            if (innerHTML) {
              result[path] = innerHTML;
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
      // Handle empty input
      if (!originalInput || originalInput.trim() === "") {
        return originalInput || "";
      }

      try {
        const parsed = await parseStringPromise(originalInput, {
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

        traverse(rootNode, (node, path, componentName) => {
          if (typeof node !== "object") return;

          const localizableAttrs = LOCALIZABLE_ATTRIBUTES[componentName];
          if (localizableAttrs && node.$) {
            localizableAttrs.forEach((attr) => {
              const attrKey = `${path}#${attr}`;
              if (data[attrKey] !== undefined) {
                node.$[attr] = data[attrKey];
              }
            });
          }

          if (LOCALIZABLE_COMPONENTS.includes(componentName) && data[path]) {
            setInnerHTML(node, data[path]);
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

function traverse(
  node: any,
  visitor: (node: any, path: string, componentName: string) => string | undefined,
  path: string = "",
) {
  if (!node || typeof node !== "object") {
    return;
  }

  const children = node.$$;
  if (!Array.isArray(children)) {
    return;
  }

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

    const result = visitor(child, currentPath, elementName);

    if (result !== "SKIP_CHILDREN") {
      traverse(child, visitor, currentPath);
    }
  });
}

function getInnerHTML(node: any): string | null {
  if (!node.$$ || !Array.isArray(node.$$)) {
    return null;
  }

  let html = "";
  node.$$.forEach((child: any) => {
    html += serializeXmlNode(child);
  });

  return html.trim() || null;
}

function setInnerHTML(node: any, htmlContent: string): void {
  const handler = new DomHandler();
  const parser = new htmlparser2.Parser(handler);
  parser.write(htmlContent);
  parser.end();

  const newChildren: any[] = [];

  for (const domNode of handler.dom) {
    const xmlNode = convertDomToXmlNode(domNode);
    if (xmlNode) {
      newChildren.push(xmlNode);
    }
  }

  node.$$ = newChildren;
  node._ = htmlContent;
}

function serializeXmlNode(node: any): string {
  const name = node["#name"];

  if (name === "__text__") {
    return node._ || "";
  }

  if (name === "__cdata") {
    return `<![CDATA[${node._ || ""}]]>`;
  }

  if (!name || name.startsWith("__")) {
    return "";
  }

  const attrs = node.$ || {};
  const attrString = Object.entries(attrs)
    .map(([key, value]) => ` ${key}="${escapeAttributeValue(String(value))}"`)
    .join("");

  const children = node.$$ || [];
  if (children.length === 0) {
    const textContent = node._ || "";
    if (textContent) {
      return `<${name}${attrString}>${textContent}</${name}>`;
    }
    return `<${name}${attrString} />`;
  }

  const childContent = children.map(serializeXmlNode).join("");
  return `<${name}${attrString}>${childContent}</${name}>`;
}

function convertDomToXmlNode(domNode: any): any {
  if (domNode.type === "text") {
    return {
      "#name": "__text__",
      "_": domNode.data,
    };
  }

  if (domNode.type === "tag") {
    const xmlNode: any = {
      "#name": domNode.name,
      "$": domNode.attribs || {},
      "$$": [],
    };

    if (domNode.children && domNode.children.length > 0) {
      for (const child of domNode.children) {
        const xmlChild = convertDomToXmlNode(child);
        if (xmlChild) {
          xmlNode.$$.push(xmlChild);
        }
      }
    }

    return xmlNode;
  }

  return null;
}

function serializeMjml(parsed: any): string {
  const rootKey = Object.keys(parsed).find(key => !key.startsWith("_") && !key.startsWith("$"));
  const rootNode = rootKey ? parsed[rootKey] : parsed;

  const body = serializeElement(rootNode);

  // Don't add XML declaration - xml2js already preserves it in the parsed object
  // or it will be added by the consumer if needed
  return body;
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

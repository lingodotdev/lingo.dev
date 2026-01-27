import * as htmlparser2 from "htmlparser2";
import { DomHandler, Element } from "domhandler";
import * as domutils from "domutils";
import * as DomSerializer from "dom-serializer";
import { ILoader } from "./_types";
import { createLoader } from "./_utils";
import {
  createElementExtractor,
  BASE_LOCALIZABLE_ATTRIBUTES,
} from "../utils/element-extraction";

export default function createHtmlLoader(): ILoader<
  string,
  Record<string, string>
> {
  return createLoader({
    async pull(locale, input) {
      const result: Record<string, string> = {};

      // Parse HTML with htmlparser2 (preserves structure, no foster parenting)
      const handler = new DomHandler();
      const parser = new htmlparser2.Parser(handler, {
        lowerCaseTags: false,
        lowerCaseAttributeNames: false,
      });
      parser.write(input);
      parser.end();

      const dom = handler.dom;

      // Get innerHTML equivalent (serialize children)
      function getInnerHTML(element: Element): string {
        return element.children
          .map((child) =>
            DomSerializer.default(child, { encodeEntities: false }),
          )
          .join("");
      }

      // Extract localizable attributes from element
      function extractAttributes(element: Element, path: string): void {
        const tagName = element.name.toLowerCase();
        const attrs = BASE_LOCALIZABLE_ATTRIBUTES[tagName];
        if (!attrs) return;

        for (const attr of attrs) {
          const value = element.attribs?.[attr];
          if (value && value.trim()) {
            result[`${path}#${attr}`] = value.trim();
          }
        }
      }

      // Recursively extract translation units from element tree
      const extractFromElement = createElementExtractor(
        { getInnerHTML, extractAttributes },
        result,
      );

      // Find head and body elements
      const html = domutils.findOne(
        (elem) => elem.type === "tag" && elem.name.toLowerCase() === "html",
        dom,
        true,
      ) as Element | null;

      if (html) {
        const head = domutils.findOne(
          (elem) => elem.type === "tag" && elem.name.toLowerCase() === "head",
          html.children,
          true,
        ) as Element | null;

        const body = domutils.findOne(
          (elem) => elem.type === "tag" && elem.name.toLowerCase() === "body",
          html.children,
          true,
        ) as Element | null;

        // Process head children
        if (head) {
          let headIndex = 0;
          const headChildren = head.children.filter(
            (child): child is Element => child.type === "tag",
          );
          for (const child of headChildren) {
            extractFromElement(child, ["head", headIndex++]);
          }
        }

        // Process body children
        if (body) {
          let bodyIndex = 0;
          const bodyChildren = body.children.filter(
            (child): child is Element => child.type === "tag",
          );
          for (const child of bodyChildren) {
            extractFromElement(child, ["body", bodyIndex++]);
          }
        }
      } else {
        // Handle HTML fragments (no <html> element) - process root elements directly
        let rootIndex = 0;
        const rootElements = dom.filter(
          (child): child is Element => child.type === "tag",
        );
        for (const child of rootElements) {
          extractFromElement(child, [rootIndex++]);
        }
      }

      return result;
    },

    async push(locale, data, originalInput) {
      // Parse original HTML
      const handler = new DomHandler();
      const parser = new htmlparser2.Parser(handler, {
        lowerCaseTags: false,
        lowerCaseAttributeNames: false,
      });
      parser.write(
        originalInput ??
          "<!DOCTYPE html><html><head></head><body></body></html>",
      );
      parser.end();

      const dom = handler.dom;

      // Find HTML element and set lang attribute
      const html = domutils.findOne(
        (elem) => elem.type === "tag" && elem.name.toLowerCase() === "html",
        dom,
        true,
      ) as Element | null;

      if (html) {
        html.attribs = html.attribs || {};
        html.attribs.lang = locale;
      }

      // Helper to traverse child elements by numeric indices
      function traverseByIndices(
        element: Element | null,
        indices: string[],
      ): Element | null {
        let current = element;

        for (const indexStr of indices) {
          if (!current) return null;

          const index = parseInt(indexStr, 10);
          const children: Element[] = current.children.filter(
            (child): child is Element => child.type === "tag",
          );

          if (index >= children.length) {
            return null; // Path doesn't exist
          }

          current = children[index];
        }

        return current;
      }

      // Resolve path to element in the DOM
      function resolvePathToElement(path: string): Element | null {
        const parts = path.split("/");
        const [rootTag, ...indices] = parts;

        let current: Element | null = null;

        if (html) {
          // Full HTML document with <html>, <head>, <body>
          // Find head or body
          if (rootTag === "head") {
            current = domutils.findOne(
              (elem) =>
                elem.type === "tag" && elem.name.toLowerCase() === "head",
              html.children,
              true,
            ) as Element | null;
          } else if (rootTag === "body") {
            current = domutils.findOne(
              (elem) =>
                elem.type === "tag" && elem.name.toLowerCase() === "body",
              html.children,
              true,
            ) as Element | null;
          }

          if (!current) return null;

          // Traverse by indices
          return traverseByIndices(current, indices);
        } else {
          // HTML fragment - no <html> element
          // Path is just numeric indices from root
          const rootElements = dom.filter(
            (child): child is Element => child.type === "tag",
          );

          // First part is the root index
          const rootIndex = parseInt(rootTag, 10);
          if (rootIndex >= rootElements.length) {
            return null;
          }

          current = rootElements[rootIndex];

          // Traverse remaining indices
          return traverseByIndices(current, indices);
        }
      }

      // Apply translations
      for (const [path, value] of Object.entries(data)) {
        const [nodePath, attribute] = path.split("#");

        const element = resolvePathToElement(nodePath);
        if (!element) {
          console.warn(`Path not found in original HTML: ${nodePath}`);
          continue;
        }

        if (attribute) {
          // Set attribute
          element.attribs = element.attribs || {};
          element.attribs[attribute] = value;
        } else {
          // Set innerHTML (parse value as HTML and replace children)
          if (value) {
            const valueHandler = new DomHandler();
            const valueParser = new htmlparser2.Parser(valueHandler);
            valueParser.write(value);
            valueParser.end();

            element.children = valueHandler.dom;
          } else {
            // If value is empty/null, clear children
            element.children = [];
          }
        }
      }

      // Serialize back to HTML
      return DomSerializer.default(dom, { encodeEntities: false });
    },
  });
}

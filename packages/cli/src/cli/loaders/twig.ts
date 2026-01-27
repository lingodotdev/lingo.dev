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

export default function createTwigLoader(): ILoader<
  string,
  Record<string, string>
> {
  // Extend base attributes with aria-label for Twig templates
  const LOCALIZABLE_ATTRIBUTES: Record<string, string[]> = {
    ...BASE_LOCALIZABLE_ATTRIBUTES,
    input: ["placeholder", "title", "aria-label"],
    textarea: ["placeholder", "title", "aria-label"],
    button: ["title", "aria-label"],
    a: ["title", "aria-label"],
  };

  // Preprocess Twig: Replace Twig control blocks with placeholders
  function preprocessTwig(input: string): {
    processed: string;
    twigBlocks: string[];
  } {
    const twigBlocks: string[] = [];
    let counter = 0;

    // Replace {% ... %} blocks (but NOT {{ ... }})
    // {{ }} expressions are kept as-is - they're part of the translatable content
    const processed = input.replace(/\{%[\s\S]*?%\}/g, (match) => {
      twigBlocks.push(match);
      return `__TWIG_BLOCK_${counter++}__`;
    });

    // Also replace {# ... #} comments
    return {
      processed: processed.replace(/\{#[\s\S]*?#\}/g, (match) => {
        twigBlocks.push(match);
        return `__TWIG_BLOCK_${counter++}__`;
      }),
      twigBlocks,
    };
  }

  // Postprocess: Restore Twig blocks from placeholders
  function postprocessTwig(text: string, twigBlocks: string[]): string {
    return text.replace(/__TWIG_BLOCK_(\d+)__/g, (_, index) => {
      return twigBlocks[parseInt(index, 10)] || "";
    });
  }

  return createLoader({
    async pull(locale, input) {
      const result: Record<string, string> = {};

      // Preprocess Twig syntax
      const { processed, twigBlocks } = preprocessTwig(input);

      // Parse HTML with htmlparser2 (preserves structure, no foster parenting)
      const handler = new DomHandler();
      const parser = new htmlparser2.Parser(handler, {
        lowerCaseTags: false,
        lowerCaseAttributeNames: false,
      });
      parser.write(processed);
      parser.end();

      const dom = handler.dom;

      // Get innerHTML equivalent (serialize children) - with Twig restoration
      function getInnerHTML(element: Element): string {
        const html = element.children
          .map((child) =>
            DomSerializer.default(child, { encodeEntities: false }),
          )
          .join("");

        // Restore Twig blocks in the innerHTML
        return postprocessTwig(html, twigBlocks);
      }

      // Extract localizable attributes from element - with Twig restoration
      function extractAttributes(element: Element, path: string): void {
        const tagName = element.name.toLowerCase();
        const attrs = LOCALIZABLE_ATTRIBUTES[tagName];
        if (!attrs) return;

        for (const attr of attrs) {
          const value = element.attribs?.[attr];
          if (value && value.trim()) {
            // Restore Twig blocks in attribute values
            const restoredValue = postprocessTwig(value.trim(), twigBlocks);
            result[`${path}#${attr}`] = restoredValue;
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
      // Preprocess Twig syntax in original input
      const { processed, twigBlocks } = preprocessTwig(originalInput || "");

      // Parse original HTML
      const handler = new DomHandler();
      const parser = new htmlparser2.Parser(handler, {
        lowerCaseTags: false,
        lowerCaseAttributeNames: false,
      });
      parser.write(
        processed || "<!DOCTYPE html><html><head></head><body></body></html>",
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
          console.warn(`Path not found in original template: ${nodePath}`);
          continue;
        }

        if (attribute) {
          // Set attribute (value already contains Twig syntax if any)
          element.attribs = element.attribs || {};
          element.attribs[attribute] = value;
        } else {
          // Set innerHTML (parse value as HTML and replace children)
          // Value may contain Twig syntax ({{ }}) which we need to preserve
          if (value) {
            // Preprocess the translated value to handle any Twig blocks
            const { processed: processedValue, twigBlocks: valueTwigBlocks } =
              preprocessTwig(value);

            const valueHandler = new DomHandler();
            const valueParser = new htmlparser2.Parser(valueHandler);
            valueParser.write(processedValue);
            valueParser.end();

            element.children = valueHandler.dom;

            // Postprocess the children to restore Twig blocks
            element.children.forEach((child: any) => {
              if (child.type === "text" && child.data) {
                child.data = postprocessTwig(child.data, valueTwigBlocks);
              }
            });
          } else {
            // If value is empty/null, clear children
            element.children = [];
          }
        }
      }

      // Serialize back to HTML and restore Twig blocks
      const serialized = DomSerializer.default(dom, {
        encodeEntities: false,
      });
      return postprocessTwig(serialized, twigBlocks);
    },
  });
}

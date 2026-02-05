import { Element } from "domhandler";
import * as domutils from "domutils";

/**
 * SVG tags that contain translatable content.
 * All other SVG elements should be excluded from translation.
 *
 * @see https://www.w3.org/TR/SVG/text.html
 */
export const SVG_TRANSLATABLE_TAGS = new Set([
  "title",
  "text",
  "desc",
]) as ReadonlySet<string>;

/**
 * Based on WHATWG HTML spec: https://html.spec.whatwg.org/multipage/indices.html
 * Phrasing content = inline elements that should be preserved within text
 */
export const PHRASING_ELEMENTS = new Set([
  // Text-level semantics
  "a",
  "abbr",
  "b",
  "bdi",
  "bdo",
  "br",
  "cite",
  "code",
  "data",
  "dfn",
  "em",
  "i",
  "kbd",
  "mark",
  "q",
  "ruby",
  "s",
  "samp",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "time",
  "u",
  "var",
  "wbr",
  // Media
  "audio",
  "img",
  "video",
  "picture",
  // Interactive
  "button",
  "input",
  "label",
  "select",
  "textarea",
  // Embedded
  "canvas",
  "iframe",
  "object",
  "svg",
  "math",
  // Other
  "del",
  "ins",
  "map",
  "area",
]) as ReadonlySet<string>;

/**
 * Block elements create translation boundaries.
 */
export const BLOCK_ELEMENTS = new Set([
  "div",
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "dl",
  "dt",
  "dd",
  "blockquote",
  "pre",
  "article",
  "aside",
  "nav",
  "section",
  "header",
  "footer",
  "main",
  "figure",
  "figcaption",
  "table",
  "thead",
  "tbody",
  "tfoot",
  "tr",
  "td",
  "th",
  "caption",
  "form",
  "fieldset",
  "legend",
  "details",
  "summary",
  "address",
  "hr",
  "search",
  "dialog",
  "noscript",
  "title",
]) as ReadonlySet<string>;

/**
 * Tags whose content should never be translated.
 */
export const UNLOCALIZABLE_TAGS = new Set([
  "script",
  "style",
]) as ReadonlySet<string>;

/**
 * Base localizable attributes for HTML elements.
 * Loaders can extend this with additional attributes.
 */
export const BASE_LOCALIZABLE_ATTRIBUTES: Record<string, string[]> = {
  meta: ["content"],
  img: ["alt", "title"],
  input: ["placeholder", "title"],
  textarea: ["placeholder", "title"],
  a: ["title"],
  abbr: ["title"],
  button: ["title"],
  link: ["title"],
};

/**
 * Check if element is inside an unlocalizable tag.
 */
export function isInsideUnlocalizableTag(
  element: Element,
  unlocalizableTags: ReadonlySet<string> = UNLOCALIZABLE_TAGS,
): boolean {
  let current = element.parent;
  while (current && current.type === "tag") {
    if (unlocalizableTags.has((current as Element).name.toLowerCase())) {
      return true;
    }
    current = current.parent;
  }
  return false;
}

/**
 * Check if element contains any translatable text (not just whitespace).
 */
export function hasTranslatableContent(element: Element): boolean {
  const text = domutils.textContent(element);
  return text.trim().length > 0;
}

/**
 * Check if element is a "leaf" block (contains text with inline elements, not nested blocks).
 */
export function isLeafBlock(
  element: Element,
  blockElements: ReadonlySet<string> = BLOCK_ELEMENTS,
): boolean {
  const childElements = element.children.filter(
    (child): child is Element => child.type === "tag",
  );
  for (const child of childElements) {
    if (blockElements.has(child.name.toLowerCase())) {
      return false;
    }
  }
  return hasTranslatableContent(element);
}

/**
 * Strategy for handling SVG elements during extraction.
 */
export type SvgExtractionStrategy =
  | "extract" // Element is translatable - extract its content
  | "skip-recurse" // Element is not translatable - skip but recurse into children
  | "process-normal"; // Element is not in SVG context - use normal extraction

/**
 * Check if an element is nested inside an SVG element by traversing up the DOM tree.
 *
 * @param element - The DOM element to check
 * @returns True if any ancestor is an <svg> tag, false otherwise
 *
 * @example
 * // <svg><text>Hello</text></svg>
 * isInsideSvg(textElement) // returns true
 */
function isInsideSvg(element: Element): boolean {
  let current = element.parent;
  while (current && current.type === "tag") {
    if (current.name.toLowerCase() === "svg") {
      return true;
    }
    current = current.parent;
  }
  return false;
}

/**
 * Check if an element contains an SVG descendant (recursive).
 * Used to determine if we should recurse into an element rather than extracting it as a whole.
 *
 * @param element - The DOM element to check
 * @returns True if any descendant is an <svg> tag, false otherwise
 */
function containsSvgDescendant(element: Element): boolean {
  const childElements = element.children.filter(
    (child): child is Element => child.type === "tag",
  );
  for (const child of childElements) {
    if (child.name.toLowerCase() === "svg") {
      return true;
    }
    if (containsSvgDescendant(child)) {
      return true;
    }
  }
  return false;
}

/**
 * Determines the extraction strategy for an SVG element.
 * Consolidates all SVG-specific logic into a single decision function.
 *
 * @param element - The DOM element to evaluate
 * @returns The extraction strategy to apply:
 *   - "extract": Element is translatable (title/text/desc inside SVG) - extract content
 *   - "skip-recurse": Element is non-translatable SVG element - skip but recurse into children
 *   - "process-normal": Element is not in SVG context - use normal extraction logic
 *
 * @example
 * // <svg><title>Chart</title><rect/></svg>
 * getSvgExtractionStrategy(titleElement) // returns "extract"
 * getSvgExtractionStrategy(rectElement)  // returns "skip-recurse"
 * getSvgExtractionStrategy(svgElement)   // returns "skip-recurse"
 */
export function getSvgExtractionStrategy(
  element: Element,
): SvgExtractionStrategy {
  const tagName = element.name.toLowerCase();

  // SVG element itself should be skipped but children should be processed
  if (tagName === "svg") {
    return "skip-recurse";
  }

  // Check if element is inside an SVG context
  const inSvg = isInsideSvg(element);
  if (!inSvg) {
    return "process-normal";
  }

  // Inside SVG - only extract translatable tags, skip others
  return SVG_TRANSLATABLE_TAGS.has(tagName) ? "extract" : "skip-recurse";
}

/**
 * Context-specific functions for extraction.
 * Only includes functions that differ between loaders.
 */
export interface ExtractionContext {
  /**
   * Get the innerHTML of an element (serialized children).
   * This may include format-specific processing (e.g., Twig restoration).
   */
  getInnerHTML: (element: Element) => string;

  /**
   * Extract localizable attributes from element.
   * This may include format-specific processing (e.g., Twig restoration).
   */
  extractAttributes: (element: Element, path: string) => void;
}

/**
 * Creates a reusable extraction function that can be shared across loaders.
 * Uses the shared BLOCK_ELEMENTS, PHRASING_ELEMENTS, and UNLOCALIZABLE_TAGS constants.
 *
 * @param context - Loader-specific context functions (getInnerHTML, extractAttributes)
 * @param result - Output object to store extracted content
 * @returns A function that recursively extracts translatable content from the DOM
 *
 * @example
 * const extractFromElement = createElementExtractor(context, result);
 * extractFromElement(rootElement, ["body", 0]);
 */
export function createElementExtractor(
  context: ExtractionContext,
  result: Record<string, string>,
) {
  /**
   * Recursively extracts translation units from element tree.
   * Handles SVG filtering, block/phrasing elements, and attributes.
   */
  function extractFromElement(
    element: Element,
    pathParts: (string | number)[],
  ): void {
    const path = pathParts.join("/");
    const tagName = element.name.toLowerCase();

    // Skip if inside unlocalizable tag
    if (isInsideUnlocalizableTag(element)) {
      return;
    }

    // Extract localizable attributes
    context.extractAttributes(element, path);

    // Handle SVG elements using strategy pattern
    const svgStrategy = getSvgExtractionStrategy(element);

    if (svgStrategy === "extract") {
      // SVG translatable element (<title>, <text>, <desc>)
      const content = context.getInnerHTML(element).trim();
      if (content) {
        result[path] = content;
      }
      return;
    }

    if (svgStrategy === "skip-recurse") {
      // SVG non-translatable element - skip but recurse into children
      let childIndex = 0;
      const childElements = element.children.filter(
        (child): child is Element => child.type === "tag",
      );
      for (const child of childElements) {
        extractFromElement(child, [...pathParts, childIndex++]);
      }
      return;
    }

    // svgStrategy === "process-normal" - use normal extraction logic

    // If this is a leaf block element (contains text but no nested blocks), extract it
    // But NOT if it contains SVG - in that case, recurse to handle SVG separately
    if (
      BLOCK_ELEMENTS.has(tagName) &&
      isLeafBlock(element) &&
      !containsSvgDescendant(element)
    ) {
      const content = context.getInnerHTML(element).trim();
      if (content) {
        result[path] = content;
      }
      // Don't recurse into children - innerHTML captures everything
      return;
    }

    // If this is a standalone phrasing element with text content, extract it
    // But NOT if it contains SVG - in that case, recurse to handle SVG separately
    if (
      PHRASING_ELEMENTS.has(tagName) &&
      hasTranslatableContent(element) &&
      !containsSvgDescendant(element)
    ) {
      const content = context.getInnerHTML(element).trim();
      if (content) {
        result[path] = content;
      }
      // Don't recurse - innerHTML captures everything
      return;
    }

    // For structural/container elements, recurse into children
    let childIndex = 0;
    const childElements = element.children.filter(
      (child): child is Element => child.type === "tag",
    );
    for (const child of childElements) {
      extractFromElement(child, [...pathParts, childIndex++]);
    }
  }

  return extractFromElement;
}

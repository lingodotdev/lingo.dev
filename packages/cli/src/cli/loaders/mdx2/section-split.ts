/**
 * Optimized version of the section joining algorithm
 *
 * This implementation focuses on performance and maintainability:
 * 1. Uses a lookup table for faster section type determination
 * 2. Uses a matrix for faster spacing determination
 * 3. Reduces string concatenations by using an array and joining at the end
 * 4. Adds detailed comments for better maintainability
 */

import { unified } from "unified";
import _ from "lodash";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import { VFile } from "vfile";
import { Root, RootContent } from "mdast";
import { PlaceholderedMdx, SectionedMdx } from "./_types";
import { traverseMdast } from "./_utils";
import { createLoader } from "../_utils";
import { ILoader } from "../_types";

/**
 * MDX Section Splitter
 *
 * This module splits MDX content into logical sections, with special handling for JSX/HTML tags.
 *
 * Key features:
 * - Splits content at headings (h1-h6)
 * - Treats JSX/HTML opening tags as separate sections
 * - Treats JSX/HTML closing tags as separate sections
 * - Treats self-closing JSX/HTML tags as separate sections
 * - Handles nested components properly
 * - Preserves content between tags as separate sections
 * - Intelligently joins sections with appropriate spacing
 */

// Create a parser instance for GitHub-flavoured Markdown and MDX JSX
const parser = unified().use(remarkParse).use(remarkGfm).use(remarkMdx);

// Interface for section boundaries
interface Boundary {
  /** 0-based offset into content where the boundary begins */
  start: number;
  /** 0-based offset into content where the boundary ends */
  end: number;
  /** Whether the boundary node itself should be isolated as its own section */
  isolateSelf: boolean;
}

// Section types for intelligent joining
enum SectionType {
  HEADING = 0,
  JSX_OPENING_TAG = 1,
  JSX_CLOSING_TAG = 2,
  JSX_SELF_CLOSING_TAG = 3,
  CONTENT = 4,
  UNKNOWN = 5,
}

// Spacing matrix for fast lookup
// [prevType][currentType] = spacing
const SPACING_MATRIX = [
  // HEADING as previous type
  ["\n\n", "\n\n", "\n\n", "\n\n", "\n\n", "\n\n"],
  // JSX_OPENING_TAG as previous type
  ["\n\n", "\n", "\n", "\n", "\n", "\n\n"],
  // JSX_CLOSING_TAG as previous type
  ["\n\n", "\n", "\n", "\n", "\n\n", "\n\n"],
  // JSX_SELF_CLOSING_TAG as previous type
  ["\n\n", "\n", "\n", "\n", "\n", "\n\n"],
  // CONTENT as previous type
  ["\n\n", "\n\n", "\n", "\n\n", "\n\n", "\n\n"],
  // UNKNOWN as previous type
  ["\n\n", "\n\n", "\n\n", "\n\n", "\n\n", "\n\n"],
];

/**
 * Creates a loader that splits MDX content into logical sections.
 *
 * A new section starts at:
 *  • Any heading (level 1-6)
 *  • Any JSX/HTML opening tag (<Component> or <div> etc.)
 *  • Any JSX/HTML closing tag (</Component> or </div> etc.)
 *  • Any self-closing JSX/HTML tag (<Component /> or <br /> etc.)
 */
export default function createMdxSectionSplitLoader(): ILoader<
  PlaceholderedMdx,
  SectionedMdx
> {
  return createLoader({
    async pull(_locale, input) {
      // Extract input or use defaults
      const {
        frontmatter = {},
        content = "",
        codePlaceholders = {},
      } = input ||
      ({
        frontmatter: {},
        content: "",
        codePlaceholders: {},
      } as PlaceholderedMdx);

      // Skip processing for empty content
      if (!content.trim()) {
        return {
          frontmatter,
          sections: {},
        };
      }

      // Parse the content to get the AST
      const file = new VFile(content);
      const ast = parser.parse(file) as Root;

      // Process the AST to find section boundaries
      const boundaries = findSectionBoundaries(ast, content);

      // Build sections from boundaries
      const sections = createSectionsFromBoundaries(boundaries, content);

      return {
        frontmatter,
        sections,
      };
    },

    async push(_locale, data, originalInput, _originalLocale) {
      // Get sections as array
      const sectionsArray = Object.values(data.sections);

      // If no sections, return empty content
      if (sectionsArray.length === 0) {
        return {
          frontmatter: data.frontmatter,
          content: "",
          codePlaceholders: originalInput?.codePlaceholders ?? {},
        };
      }

      // Optimize by pre-allocating result array and determining section types once
      const resultParts: string[] = new Array(sectionsArray.length * 2 - 1);
      const sectionTypes: SectionType[] = new Array(sectionsArray.length);

      // Determine section types for all sections
      for (let i = 0; i < sectionsArray.length; i++) {
        sectionTypes[i] = determineJsxSectionType(sectionsArray[i]);
      }

      // Add first section without spacing
      resultParts[0] = sectionsArray[0];

      // Add remaining sections with appropriate spacing
      for (let i = 1, j = 1; i < sectionsArray.length; i++, j += 2) {
        const prevType = sectionTypes[i - 1];
        const currentType = sectionTypes[i];

        // Get spacing from matrix for better performance
        resultParts[j] = SPACING_MATRIX[prevType][currentType];
        resultParts[j + 1] = sectionsArray[i];
      }

      // Join all parts into final content
      const content = resultParts.join("");

      return {
        frontmatter: data.frontmatter,
        content,
        codePlaceholders: originalInput?.codePlaceholders ?? {},
      };
    },
  });
}

/**
 * Determines the type of a section based on its content.
 * Optimized with regex caching and early returns.
 */
function determineJsxSectionType(section: string): SectionType {
  section = section.trim();

  // Early returns for common cases
  if (!section) return SectionType.UNKNOWN;

  const firstChar = section.charAt(0);
  const lastChar = section.charAt(section.length - 1);

  // Check for headings (starts with #)
  if (firstChar === "#") {
    // Ensure it's a proper heading with space after #
    if (/^#{1,6}\s/.test(section)) {
      return SectionType.HEADING;
    }
  }

  // Check for JSX/HTML tags (starts with <)
  if (firstChar === "<") {
    // Self-closing tag (ends with />)
    if (section.endsWith("/>")) {
      return SectionType.JSX_SELF_CLOSING_TAG;
    }

    // Closing tag (starts with </)
    if (section.startsWith("</")) {
      return SectionType.JSX_CLOSING_TAG;
    }

    // Opening tag (ends with >)
    if (lastChar === ">") {
      return SectionType.JSX_OPENING_TAG;
    }
  }

  // Default to content
  return SectionType.CONTENT;
}

/**
 * Determines if a node is a JSX or HTML element.
 */
function isJsxOrHtml(node: Root | RootContent): boolean {
  return (
    node.type === "mdxJsxFlowElement" ||
    node.type === "mdxJsxTextElement" ||
    node.type === "html"
  );
}

/**
 * Finds the end position of an opening tag in a text string.
 * Optimized to handle nested angle brackets correctly.
 */
function findOpeningTagEnd(text: string): number {
  let depth = 0;
  let inQuotes = false;
  let quoteChar = "";

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    // Handle quotes (to avoid counting angle brackets inside attribute values)
    if ((char === '"' || char === "'") && (i === 0 || text[i - 1] !== "\\")) {
      if (!inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } else if (char === quoteChar) {
        inQuotes = false;
      }
    }

    // Only count angle brackets when not in quotes
    if (!inQuotes) {
      if (char === "<") depth++;
      if (char === ">") {
        depth--;
        if (depth === 0) return i + 1;
      }
    }
  }
  return -1;
}

/**
 * Finds the start position of a closing tag in a text string.
 * Optimized to handle nested components correctly.
 */
function findClosingTagStart(text: string): number {
  // Extract the tag name from the opening tag to match the correct closing tag
  const openTagMatch = /<([^\s/>]+)/.exec(text);
  if (!openTagMatch) return -1;

  const tagName = openTagMatch[1];
  const closingTagRegex = new RegExp(`</${tagName}\\s*>`, "g");

  // Find the last occurrence of the closing tag
  let lastMatch = null;
  let match;

  while ((match = closingTagRegex.exec(text)) !== null) {
    lastMatch = match;
  }

  return lastMatch ? lastMatch.index : -1;
}

/**
 * Processes a JSX/HTML node to extract opening and closing tags as separate boundaries.
 */
function processJsxNode(
  node: RootContent,
  content: string,
  boundaries: Boundary[],
): void {
  // Skip nodes without valid position information
  if (
    !node.position ||
    typeof node.position.start.offset !== "number" ||
    typeof node.position.end.offset !== "number"
  ) {
    return;
  }

  const nodeStart = node.position.start.offset;
  const nodeEnd = node.position.end.offset;
  const nodeContent = content.slice(nodeStart, nodeEnd);

  // Handle HTML nodes using regex
  if (node.type === "html") {
    extractHtmlTags(nodeStart, nodeContent, boundaries);
    return;
  }

  // Handle MDX JSX elements
  if (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") {
    const isSelfClosing = (node as any).selfClosing === true;

    if (isSelfClosing) {
      // Self-closing tag - treat as a single section
      boundaries.push({
        start: nodeStart,
        end: nodeEnd,
        isolateSelf: true,
      });
    } else {
      extractJsxTags(node, nodeContent, boundaries);

      // Process children recursively to handle nested components
      if ((node as any).children) {
        for (const child of (node as any).children) {
          if (isJsxOrHtml(child)) {
            processJsxNode(child, content, boundaries);
          }
        }
      }
    }
  }
}

/**
 * Extracts HTML tags using regex and adds them as boundaries.
 * Optimized with a more precise regex pattern.
 */
function extractHtmlTags(
  nodeStart: number,
  nodeContent: string,
  boundaries: Boundary[],
): void {
  // More precise regex for HTML tags that handles attributes better
  const tagRegex =
    /<\/?[a-zA-Z][a-zA-Z0-9:._-]*(?:\s+[a-zA-Z:_][a-zA-Z0-9:._-]*(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^'">\s]+))?)*\s*\/?>/g;
  let match;

  while ((match = tagRegex.exec(nodeContent)) !== null) {
    const tagStart = nodeStart + match.index;
    const tagEnd = tagStart + match[0].length;

    boundaries.push({
      start: tagStart,
      end: tagEnd,
      isolateSelf: true,
    });
  }
}

/**
 * Extracts opening and closing JSX tags and adds them as boundaries.
 */
function extractJsxTags(
  node: RootContent,
  nodeContent: string,
  boundaries: Boundary[],
): void {
  const nodeStart = node.position!.start.offset;
  const nodeEnd = node.position!.end.offset;

  if (!nodeStart || !nodeEnd) {
    return;
  }

  // Find the opening tag
  const openingTagEnd = findOpeningTagEnd(nodeContent);
  if (openingTagEnd > 0) {
    boundaries.push({
      start: nodeStart,
      end: nodeStart + openingTagEnd,
      isolateSelf: true,
    });
  }

  // Find the closing tag
  const closingTagStart = findClosingTagStart(nodeContent);
  if (closingTagStart > 0 && closingTagStart < nodeContent.length) {
    boundaries.push({
      start: nodeStart + closingTagStart,
      end: nodeEnd,
      isolateSelf: true,
    });
  }
}

/**
 * Finds all section boundaries in the AST.
 */
function findSectionBoundaries(ast: Root, content: string): Boundary[] {
  const boundaries: Boundary[] = [];

  // Use a Map to cache node positions for faster lookups
  const nodePositions = new Map<RootContent, { start: number; end: number }>();

  // Pre-process nodes to cache their positions
  traverseMdast(ast, (node: any) => {
    if (
      node.position &&
      typeof node.position.start.offset === "number" &&
      typeof node.position.end.offset === "number"
    ) {
      nodePositions.set(node, {
        start: node.position.start.offset,
        end: node.position.end.offset,
      });
    }
  });

  for (const child of ast.children) {
    const position = nodePositions.get(child);
    if (!position) continue;

    if (child.type === "heading") {
      // Heading marks the beginning of a new section including itself
      boundaries.push({
        start: position.start,
        end: position.end,
        isolateSelf: false,
      });
    } else if (isJsxOrHtml(child)) {
      // Process JSX/HTML nodes to extract tags as separate sections
      processJsxNode(child, content, boundaries);
    }
  }

  // Sort boundaries by start position
  return boundaries.sort((a, b) => a.start - b.start);
}

/**
 * Creates sections from the identified boundaries.
 * Optimized to reduce unnecessary string operations.
 */
function createSectionsFromBoundaries(
  boundaries: Boundary[],
  content: string,
): Record<string, string> {
  const sections: Record<string, string> = {};

  // Early return for empty content or no boundaries
  if (!content.trim() || boundaries.length === 0) {
    const trimmed = content.trim();
    if (trimmed) {
      sections["0"] = trimmed;
    }
    return sections;
  }

  let idx = 0;
  let lastEnd = 0;

  // Pre-allocate array with estimated capacity
  const sectionsArray: string[] = [];

  // Process each boundary and the content between boundaries
  for (let i = 0; i < boundaries.length; i++) {
    const { start, end, isolateSelf } = boundaries[i];

    // Capture content before this boundary if any
    if (start > lastEnd) {
      const segment = content.slice(lastEnd, start).trim();
      if (segment) {
        sectionsArray.push(segment);
      }
    }

    if (isolateSelf) {
      // Extract the boundary itself as a section
      const segment = content.slice(start, end).trim();
      if (segment) {
        sectionsArray.push(segment);
      }
      lastEnd = end;
    } else {
      // For non-isolated boundaries (like headings), include them with following content
      const nextStart =
        i + 1 < boundaries.length ? boundaries[i + 1].start : content.length;
      const segment = content.slice(start, nextStart).trim();
      if (segment) {
        sectionsArray.push(segment);
      }
      lastEnd = nextStart;
    }
  }

  // Capture any content after the last boundary
  if (lastEnd < content.length) {
    const segment = content.slice(lastEnd).trim();
    if (segment) {
      sectionsArray.push(segment);
    }
  }

  // Convert array to object with sequential keys
  sectionsArray.forEach((section, index) => {
    sections[index.toString()] = section;
  });

  return sections;
}

import { ILoader } from "../_types";
import { createLoader } from "../_utils";
import { md5 } from "../../utils/md5";
import _ from "lodash";

const fenceRegex = /([ \t]*)(^>\s*)?```([\s\S]*?)```/gm;
const inlineCodeRegex = /(?<!`)`([^`\r\n]+?)`(?!`)/g;

// Matches markdown image tags, with optional alt text & parenthesis URL, possibly inside blockquotes
// Captures patterns like ![](url) or ![alt](url), with optional leading '> ' for blockquotes
const imageRegex =
  /([ \t]*)(^>\s*)?!\[[^\]]*?\]\(([^()]*(\([^()]*\)[^()]*)*)\)/gm;

/**
 * Ensures that markdown image tags are surrounded by blank lines (\n\n) so that they are properly
 * treated as separate blocks during subsequent processing and serialization.
 *
 * Behaviour mirrors `ensureTrailingFenceNewline` logic for code fences:
 *   • If an image tag is already inside a blockquote (starts with `>` after trimming) we leave it untouched.
 *   • Otherwise we add two newlines before and after the image tag, then later collapse multiple
 *     consecutive blank lines back to exactly one separation using lodash chain logic.
 */
function ensureSurroundingImageNewlines(_content: string) {
  let found = false;
  let content = _content;
  let workingContent = content;

  do {
    found = false;
    const matches = workingContent.match(imageRegex);
    if (matches) {
      const match = matches[0];

      const replacement = match.trim().startsWith(">")
        ? match
        : `\n\n${match}\n\n`;

      content = content.replaceAll(match, replacement);
      workingContent = workingContent.replaceAll(match, "");
      found = true;
    }
  } while (found);

  content = _.chain(content)
    .split("\n\n")
    .map((section) => _.trim(section, "\n"))
    .filter(Boolean)
    .join("\n\n")
    .value();

  return content;
}

function ensureTrailingFenceNewline(_content: string) {
  let found = false;
  let content = _content;
  let workingContent = content;

  do {
    found = false;
    const matches = workingContent.match(fenceRegex);
    if (matches) {
      const match = matches[0];

      const replacement = match.trim().startsWith(">")
        ? match
        : `\n\n${match}\n\n`;
      content = content.replaceAll(match, replacement);
      workingContent = workingContent.replaceAll(match, "");
      found = true;
    }
  } while (found);

  content = _.chain(content)
    .split("\n\n")
    .map((section) => _.trim(section, "\n"))
    .filter(Boolean)
    .join("\n\n")
    .value();

  return content;
}

// Helper that replaces code (block & inline) with stable placeholders and returns
// both the transformed content and the placeholder → original mapping so it can
// later be restored. Extracted so that we can reuse the exact same logic in both
// `pull` and `push` phases (e.g. to recreate the mapping from `originalInput`).
function extractCodePlaceholders(content: string): {
  content: string;
  codePlaceholders: Record<string, string>;
} {
  let finalContent = content;
  finalContent = ensureTrailingFenceNewline(finalContent);
  finalContent = ensureSurroundingImageNewlines(finalContent);

  const codePlaceholders: Record<string, string> = {};

  const codeBlockMatches = finalContent.matchAll(fenceRegex);
  for (const match of codeBlockMatches) {
    const codeBlock = match[0];
    const codeBlockHash = md5(codeBlock);
    const placeholder = `---CODE-PLACEHOLDER-${codeBlockHash}---`;

    codePlaceholders[placeholder] = codeBlock;

    const replacement = codeBlock.trim().startsWith(">")
      ? `> ${placeholder}`
      : `${placeholder}`;
    finalContent = finalContent.replace(codeBlock, replacement);
  }

  const inlineCodeMatches = finalContent.matchAll(inlineCodeRegex);
  for (const match of inlineCodeMatches) {
    const inlineCode = match[0];
    const inlineCodeHash = md5(inlineCode);
    const placeholder = `---INLINE-CODE-PLACEHOLDER-${inlineCodeHash}---`;

    codePlaceholders[placeholder] = inlineCode;

    const replacement = placeholder;
    finalContent = finalContent.replace(inlineCode, replacement);
  }

  return {
    content: finalContent,
    codePlaceholders,
  };
}

export default function createMdxCodePlaceholderLoader(): ILoader<
  string,
  string
> {
  // Keep a global registry of all placeholders we've ever created
  // This solves the state synchronization issue
  const globalPlaceholderRegistry: Record<string, string> = {};

  return createLoader({
    async pull(locale, input) {
      const response = extractCodePlaceholders(input);

      // Register all placeholders we create so we can use them later
      Object.assign(globalPlaceholderRegistry, response.codePlaceholders);

      return response.content;
    },

    async push(locale, data, originalInput, originalLocale, pullInput) {
      const sourceInfo = extractCodePlaceholders(originalInput ?? "");
      const currentInfo = extractCodePlaceholders(pullInput ?? "");

      // Use the global registry to ensure all placeholders can be replaced,
      // including those from previous pulls that are no longer in current state
      const codePlaceholders = _.merge(
        sourceInfo.codePlaceholders,
        currentInfo.codePlaceholders,
        globalPlaceholderRegistry, // Include ALL placeholders ever created
      );

      let result = data;
      for (const [placeholder, original] of Object.entries(codePlaceholders)) {
        const replacement = original.startsWith(">")
          ? _.trimStart(original, "> ")
          : original;
        result = result.replaceAll(placeholder, replacement);
      }

      return result;
    },
  });
}

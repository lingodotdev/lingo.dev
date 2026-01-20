import { ILoader } from "./_types";
import { createLoader } from "./_utils";
import { md5 } from "../utils/md5";

/**
 * Extracts content matching regex patterns and replaces it with placeholders.
 * Returns the transformed content and a mapping of placeholders to original content.
 */
function extractLockedPatterns(
  content: string,
  patterns: string[] = [],
): {
  content: string;
  lockedPlaceholders: Record<string, string>;
} {
  let finalContent = content;
  const lockedPlaceholders: Record<string, string> = {};

  if (!patterns || patterns.length === 0) {
    return { content: finalContent, lockedPlaceholders };
  }

  for (const patternStr of patterns) {
    try {
      const pattern = new RegExp(patternStr, "gm");
      const matches = Array.from(finalContent.matchAll(pattern));

      for (const match of matches) {
        const matchedText = match[0];
        const matchHash = md5(matchedText);
        const placeholder = `{/* LOCKED_PATTERN_${matchHash} */}`;

        lockedPlaceholders[placeholder] = matchedText;
        finalContent = finalContent.replace(matchedText, placeholder);
      }
    } catch (error) {
      console.warn(`Invalid regex pattern: ${patternStr}`);
    }
  }

  return {
    content: finalContent,
    lockedPlaceholders,
  };
}

/**
 * Creates a loader that preserves content matching regex patterns during translation.
 *
 * This loader extracts content matching the provided regex patterns and replaces it
 * with placeholders before translation. After translation, the placeholders are
 * restored with the original content.
 *
 * This is useful for preserving technical terms, code snippets, URLs, template
 * variables, and other non-translatable content within translatable files.
 *
 * Works with any string-based format (JSON, YAML, XML, Markdown, HTML, etc.).
 * Note: For structured formats (JSON, XML, YAML), ensure patterns only match
 * content within values, not structural syntax, to avoid breaking parsing.
 *
 * @param defaultPatterns - Array of regex pattern strings to match and preserve
 * @returns A loader that handles pattern locking/unlocking
 */
export default function createLockedPatternsLoader(
  defaultPatterns?: string[],
): ILoader<string, string> {
  return createLoader({
    async pull(locale, input, initCtx, originalLocale) {
      const patterns = defaultPatterns || [];

      const { content } = extractLockedPatterns(input || "", patterns);

      return content;
    },

    async push(
      locale,
      data,
      originalInput,
      originalLocale,
      pullInput,
      pullOutput,
    ) {
      const patterns = defaultPatterns || [];

      if (!pullInput) {
        return data;
      }

      const { lockedPlaceholders } = extractLockedPatterns(
        pullInput as string,
        patterns,
      );

      let result = data;
      for (const [placeholder, original] of Object.entries(
        lockedPlaceholders,
      )) {
        result = result.replaceAll(placeholder, original);
      }

      return result;
    },
  });
}

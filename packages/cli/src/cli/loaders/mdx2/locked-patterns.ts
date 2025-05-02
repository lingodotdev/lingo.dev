import { ILoader } from "../_types";
import { createLoader } from "../_utils";
import { md5 } from "../../utils/md5";
import _ from "lodash";
import { I18nConfig } from "@lingo.dev/_spec";

/**
 * Extracts content matching regex patterns and replaces it with placeholders.
 * Returns the transformed content and a mapping of placeholders to original content.
 */
function extractLockedPatterns(
  content: string,
  patterns: string[] = []
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
        const placeholder = `---LOCKED-PATTERN-${matchHash}---`;
        
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

export interface MdxWithLockedPatterns {
  content: string;
  lockedPlaceholders: Record<string, string>;
}

export default function createMdxLockedPatternsLoader(defaultPatterns?: string[]): ILoader<
  string,
  MdxWithLockedPatterns
> {
  return createLoader({
    async pull(locale, input, initCtx, originalLocale) {
      const patterns = defaultPatterns || [];
      
      const { content, lockedPlaceholders } = extractLockedPatterns(input || "", patterns);
      
      return {
        content,
        lockedPlaceholders,
      };
    },

    async push(locale, data) {
      let result = data.content;
      for (const [placeholder, original] of Object.entries(data.lockedPlaceholders)) {
        result = result.replaceAll(placeholder, original);
      }
      
      return result;
    },
  });
}

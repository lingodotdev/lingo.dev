import { parse, ParseError } from "jsonc-parser";
import { ILoader } from "./_types";
import { createLoader } from "./_utils";

interface CommentInfo {
  hint?: string;
  [key: string]: any;
}

function extractCommentsFromJsonc(jsoncString: string): Record<string, any> {
  const lines = jsoncString.split("\n");
  const comments: Record<string, any> = {};

  // Parse to validate structure
  const errors: ParseError[] = [];
  const result = parse(jsoncString, errors, {
    allowTrailingComma: true,
    disallowComments: false,
    allowEmptyContent: true,
  });

  if (errors.length > 0) {
    return {};
  }

  // Track nesting context
  const contextStack: Array<{ key: string; isArray: boolean }> = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    if (!trimmedLine) continue;

    // Handle different comment types
    const commentData = extractCommentFromLine(line, lines, i);
    if (commentData.hint) {
      let keyInfo;

      if (commentData.isInline) {
        // For inline comments, extract key from the same line
        const keyMatch = line.match(/^\s*["']?([^"':,\s]+)["']?\s*:/);
        if (keyMatch) {
          const key = keyMatch[1];
          const path = contextStack.map((ctx) => ctx.key).filter(Boolean);
          keyInfo = { key, path };
        }
      } else {
        // For standalone comments, find the next key
        keyInfo = findAssociatedKey(lines, commentData.lineIndex, contextStack);
      }

      if (keyInfo && keyInfo.key) {
        setCommentAtPath(comments, keyInfo.path, keyInfo.key, commentData.hint);
      }

      // Skip processed lines for multi-line comments
      i = commentData.endIndex;
      continue;
    }

    // Update context for object/array nesting
    updateContext(contextStack, line, result);
  }

  return comments;
}

function extractCommentFromLine(
  line: string,
  lines: string[],
  lineIndex: number,
): {
  hint: string | null;
  lineIndex: number;
  endIndex: number;
  isInline: boolean;
} {
  const trimmed = line.trim();

  // Single-line comment (standalone)
  if (trimmed.startsWith("//")) {
    const hint = trimmed.replace(/^\/\/\s*/, "").trim();
    return { hint, lineIndex, endIndex: lineIndex, isInline: false };
  }

  // Block comment (standalone or multi-line)
  if (trimmed.startsWith("/*")) {
    const blockResult = extractBlockComment(lines, lineIndex);
    return { ...blockResult, isInline: false };
  }

  // Inline comments (after JSON content)
  // Handle single-line inline comments
  const singleInlineMatch = line.match(/^(.+?)\s*\/\/\s*(.+)$/);
  if (singleInlineMatch && singleInlineMatch[1].includes(":")) {
    const hint = singleInlineMatch[2].trim();
    return { hint, lineIndex, endIndex: lineIndex, isInline: true };
  }

  // Handle block inline comments
  const blockInlineMatch = line.match(/^(.+?)\s*\/\*\s*(.*?)\s*\*\/.*$/);
  if (blockInlineMatch && blockInlineMatch[1].includes(":")) {
    const hint = blockInlineMatch[2].trim();
    return { hint, lineIndex, endIndex: lineIndex, isInline: true };
  }

  return { hint: null, lineIndex, endIndex: lineIndex, isInline: false };
}

function extractBlockComment(
  lines: string[],
  startIndex: number,
): { hint: string | null; lineIndex: number; endIndex: number } {
  const startLine = lines[startIndex];

  // Single-line block comment
  const singleMatch = startLine.match(/\/\*\s*(.*?)\s*\*\//);
  if (singleMatch) {
    return {
      hint: singleMatch[1].trim(),
      lineIndex: startIndex,
      endIndex: startIndex,
    };
  }

  // Multi-line block comment
  const commentParts: string[] = [];
  let endIndex = startIndex;

  // Extract content from first line
  const firstContent = startLine.replace(/.*?\/\*\s*/, "").trim();
  if (firstContent && !firstContent.includes("*/")) {
    commentParts.push(firstContent);
  }

  // Process subsequent lines
  for (let i = startIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    endIndex = i;

    if (line.includes("*/")) {
      const lastContent = line
        .replace(/\*\/.*$/, "")
        .replace(/^\s*\*?\s*/, "")
        .trim();
      if (lastContent) {
        commentParts.push(lastContent);
      }
      break;
    } else {
      const content = line.replace(/^\s*\*?\s*/, "").trim();
      if (content) {
        commentParts.push(content);
      }
    }
  }

  return {
    hint: commentParts.join(" ").trim() || null,
    lineIndex: startIndex,
    endIndex,
  };
}

function findAssociatedKey(
  lines: string[],
  commentLineIndex: number,
  contextStack: Array<{ key: string; isArray: boolean }>,
): { key: string | null; path: string[] } {
  // Look for the next key after the comment
  for (let i = commentLineIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();

    if (
      !line ||
      line.startsWith("//") ||
      line.startsWith("/*") ||
      line === "{" ||
      line === "}"
    ) {
      continue;
    }

    // Extract key from line
    const keyMatch = line.match(/^\s*["']?([^"':,\s]+)["']?\s*:/);
    if (keyMatch) {
      const key = keyMatch[1];
      const path = contextStack.map((ctx) => ctx.key).filter(Boolean);
      return { key, path };
    }
  }

  return { key: null, path: [] };
}

function updateContext(
  contextStack: Array<{ key: string; isArray: boolean }>,
  line: string,
  parsedJson: any,
): void {
  // This is a simplified context tracking - in a full implementation,
  // you'd want more sophisticated AST-based tracking
  const openBraces = (line.match(/\{/g) || []).length;
  const closeBraces = (line.match(/\}/g) || []).length;

  if (openBraces > closeBraces) {
    // Extract the key that's opening this object
    const keyMatch = line.match(/^\s*["']?([^"':,\s]+)["']?\s*:\s*\{/);
    if (keyMatch) {
      contextStack.push({ key: keyMatch[1], isArray: false });
    }
  } else if (closeBraces > openBraces) {
    // Pop context when closing braces
    for (let i = 0; i < closeBraces - openBraces; i++) {
      contextStack.pop();
    }
  }
}

function setCommentAtPath(
  comments: Record<string, any>,
  path: string[],
  key: string,
  hint: string,
): void {
  let current = comments;

  // Navigate to the correct nested location
  for (const pathKey of path) {
    if (!current[pathKey]) {
      current[pathKey] = {};
    }
    current = current[pathKey];
  }

  // Set the hint for the key
  if (!current[key]) {
    current[key] = {};
  }

  if (typeof current[key] === "object" && current[key] !== null) {
    current[key].hint = hint;
  } else {
    current[key] = { hint };
  }
}

export default function createJsoncLoader(): ILoader<
  string,
  Record<string, any>
> {
  return createLoader({
    pull: async (locale, input) => {
      const jsoncString = input || "{}";
      const errors: ParseError[] = [];
      const result = parse(jsoncString, errors, {
        allowTrailingComma: true,
        disallowComments: false,
        allowEmptyContent: true,
      });

      if (errors.length > 0) {
        throw new Error(`Failed to parse JSONC: ${errors[0].error}`);
      }

      return result || {};
    },
    push: async (locale, data) => {
      // JSONC parser's stringify preserves formatting but doesn't add comments
      // We'll use standard JSON.stringify with pretty formatting for output
      const serializedData = JSON.stringify(data, null, 2);
      return serializedData;
    },
    pullHints: async (input) => {
      if (!input || typeof input !== "string") {
        return {};
      }

      try {
        return extractCommentsFromJsonc(input);
      } catch (error) {
        console.warn("Failed to extract comments from JSONC:", error);
        return {};
      }
    },
  });
}

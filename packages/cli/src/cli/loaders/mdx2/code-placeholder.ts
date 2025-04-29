import { ILoader } from "../_types";
import { createLoader } from "../_utils";
import { md5 } from "../../utils/md5";
import _ from "lodash";

const fenceRegex = /($>\s*)?```([\s\S]*?)```/g;

function ensureTrailingFenceNewline(_content: string) {
  let found = false;
  let content = _content;
  let workingContent = content;

  do {
    found = false;
    const matches = workingContent.match(fenceRegex);
    if (matches) {
      const match = matches[0];
      content = content.replace(match, `\n\n${match}\n\n`);
      workingContent = workingContent.replace(match, "");
      found = true;
    }
  } while (found);

  content = _.chain(content)
    .split("\n\n")
    .map((section) => section.trim())
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

  const codePlaceholders: Record<string, string> = {};

  const codeBlockMatches = finalContent.matchAll(fenceRegex);

  for (const match of codeBlockMatches) {
    const codeBlock = match[0];
    const codeBlockHash = md5(codeBlock);
    const placeholderId = `---CODE_PLACEHOLDER_${codeBlockHash}---`;

    codePlaceholders[placeholderId] = codeBlock;
    finalContent = finalContent.replace(codeBlock, placeholderId);
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
  return createLoader({
    async pull(locale, input) {
      const response = extractCodePlaceholders(input);
      return response.content;
    },

    async push(locale, data, originalInput) {
      const response = extractCodePlaceholders(originalInput ?? "");

      let result = data;
      for (const [placeholder, original] of Object.entries(
        response.codePlaceholders,
      )) {
        result = result.replaceAll(placeholder, original);
      }

      return result;
    },
  });
}

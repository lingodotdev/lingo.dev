import { ILoader } from "../_types";
import { createLoader } from "../_utils";
import { PlaceholderedMdx, RawMdx } from "./_types";
import { md5 } from "../../utils/md5";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { VFile } from "vfile";
import remarkMdx from "remark-mdx";

function parseMdast(content: string) {
  const file = new VFile(content);

  const parser = unified().use(remarkParse).use(remarkGfm).use(remarkMdx);

  const result = parser.parse(file);

  return result;
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
  const codePlaceholders: Record<string, string> = {};

  const codeBlockRegex = /^```.*\n([\s\S]*?)^```$/gm;
  const codeBlockMatches = finalContent.matchAll(codeBlockRegex);

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

import {
  Root,
  Paragraph,
  RootContent,
  RootContentMap,
  InlineCode,
  Code,
} from "mdast";
import { ILoader } from "../_types";
import { createLoader } from "../_utils";
import { PlaceholderedMdx, RawMdx } from "./_types";
import { traverseMdast } from "./_utils";
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
  const ast = parseMdast(content);
  const placeholderableElements: (keyof RootContentMap)[] = [
    "code",
    "inlineCode",
  ];
  let finalContent = content;
  const codePlaceholders: Record<string, string> = {};

  traverseMdast(ast, (_node) => {
    if (!placeholderableElements.includes(_node.type as any)) {
      return;
    }
    const node = _node as Code | InlineCode;
    const nodeContent = node.value;

    const nodeContentHash = md5(nodeContent);
    const placeholderId = `__PLACEHOLDER_${nodeContentHash}__`;

    const nodeContentStart = node.position?.start.offset;
    const nodeContentEnd = node.position?.end.offset;

    if (!nodeContentStart || !nodeContentEnd) {
      return;
    }

    codePlaceholders[placeholderId] = nodeContent;
    finalContent = finalContent.split(nodeContent).join(placeholderId);
  });

  return {
    content: finalContent,
    codePlaceholders,
  };
}

export default function createMdxCodePlaceholderLoader(): ILoader<
  RawMdx,
  PlaceholderedMdx
> {
  return createLoader({
    async pull(locale, input) {
      const { frontmatter = {}, content = "" } = input || {
        frontmatter: {},
        content: "",
      };

      const { content: resultContent, codePlaceholders } =
        extractCodePlaceholders(content);

      return {
        frontmatter,
        content: resultContent,
        codePlaceholders,
      };
    },

    async push(locale, data, originalInput) {
      // Re-create the placeholders map from the original (unmodified) input so we
      // can rely on a stable mapping even if `data.codePlaceholders` was lost or
      // tampered with by other loaders in the chain.
      const { codePlaceholders } = extractCodePlaceholders(
        originalInput?.content ?? "",
      );

      let finalContent = data.content;
      // Restore code from placeholders
      for (const [placeholder, original] of Object.entries(codePlaceholders)) {
        // Use String.replaceAll with a replacer function to restore the original code.
        // A replacer function is used to avoid any special replacement pattern
        // interpretation (e.g. "$&", "$$", etc.) that could occur if `original`
        // contains `$` characters.
        finalContent = finalContent.replaceAll(placeholder, () => original);
      }

      const result: RawMdx = {
        frontmatter: data.frontmatter,
        content: finalContent,
      };

      return result;
    },
  });
}

import { parseFrontmatter, stringifyFrontmatter } from "../_frontmatter";
import { ILoader } from "../_types";
import { createLoader } from "../_utils";
import { RawMdx } from "./_types";

export default function createMdxFrontmatterSplitLoader(): ILoader<string, RawMdx> {
  return createLoader({
    async pull(locale, input) {
      const source = input || "";
      const { data: frontmatter, content } = parseFrontmatter(source);

      return {
        frontmatter: frontmatter as Record<string, any>,
        content,
      };
    },

    async push(locale, data) {
      const { frontmatter = {}, content = "" } = data || ({} as RawMdx);

      const result = stringifyFrontmatter(content, frontmatter).trim();

      return result;
    },
  });
}

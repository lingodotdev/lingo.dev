import matter from "gray-matter";
import { ILoader } from "../_types";
import { createLoader } from "../_utils";
import { RawMdx } from "./_types";

export default function createMdxFrontmatterSplitLoader(): ILoader<string, RawMdx> {
  return createLoader({
    async pull(locale, input) {
      const source = input || "";
      const { data: frontmatter, content } = matter(source);

      return {
        frontmatter: frontmatter as Record<string, any>,
        content,
      };
    },

    async push(locale, data) {
      const { frontmatter = {}, content = "" } = data || ({} as RawMdx);

      const result = matter.stringify(content, frontmatter).trim();

      return result;
    },
  });
}

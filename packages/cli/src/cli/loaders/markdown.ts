import { parseFrontmatter, stringifyFrontmatter } from "./_frontmatter";
import { ILoader } from "./_types";
import { createLoader } from "./_utils";

const SECTION_REGEX = /^(#{1,6}\s.*$|[-=*]{3,}$|!\[.*\]\(.*\)$|\[.*\]\(.*\)$)/gm;
const MD_SECTION_PREFIX = "md-section-";
const FM_ATTR_PREFIX = "fm-attr-";

export default function createMarkdownLoader(): ILoader<string, Record<string, string>> {
  return createLoader({
    async pull(locale, input) {
      const { data: frontmatter, content } = parseFrontmatter(input);

      const sections = content
        .split(SECTION_REGEX)
        .map((section) => section?.trim() ?? "")
        .filter(Boolean);

      return {
        ...Object.fromEntries(
          sections
            .map((section, index) => [`${MD_SECTION_PREFIX}${index}`, section])
            .filter(([, section]) => Boolean(section)),
        ),
        ...Object.fromEntries(Object.entries(frontmatter).map(([key, value]) => [`${FM_ATTR_PREFIX}${key}`, value])),
      };
    },
    async push(locale, data: Record<string, string>) {
      const frontmatter = Object.fromEntries(
        Object.entries(data)
          .filter(([key]) => key.startsWith(FM_ATTR_PREFIX))
          .map(([key, value]) => [key.replace(FM_ATTR_PREFIX, ""), value]),
      );

      let content = Object.entries(data)
        .filter(([key]) => key.startsWith(MD_SECTION_PREFIX))
        .sort(([a], [b]) => Number(a.split("-").pop()) - Number(b.split("-").pop()))
        .map(([, value]) => value?.trim() ?? "")
        .filter(Boolean)
        .join("\n\n");

      if (Object.keys(frontmatter).length > 0) {
        content = `\n${content}`;
      }

      return stringifyFrontmatter(content, frontmatter);
    },
  });
}

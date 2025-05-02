import matter from "gray-matter";
import YAML from "yaml";
import { ILoader } from "../_types";
import { createLoader } from "../_utils";
import { RawMdx } from "./_types";

export default function createMdxFrontmatterSplitLoader(): ILoader<
  string,
  RawMdx
> {
  const fmEngine = createFmEngine();

  return createLoader({
    async pull(locale, input) {
      const source = input || "";
      const { data: frontmatter, content } = fmEngine.parse(source);

      return {
        frontmatter: frontmatter as Record<string, any>,
        content,
      };
    },

    async push(locale, data) {
      const { frontmatter = {}, content = "" } = data || ({} as RawMdx);

      const result = fmEngine.stringify(content, frontmatter).trim();

      return result;
    },
  });
}

function createFmEngine() {
  const yamlEngine = {
    parse: (str: string) => YAML.parse(str),
    stringify: (obj: any) =>
      YAML.stringify(obj, { defaultStringType: "PLAIN" }),
  };

  return {
    parse: (input: string) =>
      matter(input, {
        engines: {
          yaml: yamlEngine,
        },
      }),
    stringify: (content: string, frontmatter: Record<string, any>) =>
      matter.stringify(content, frontmatter, {
        engines: {
          yaml: yamlEngine,
        },
      }),
  };
}

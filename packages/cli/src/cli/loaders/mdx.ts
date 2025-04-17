import _ from "lodash";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkStringify from "remark-stringify";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { VFile } from "vfile";
import { Root } from "mdast";
import { ILoader } from "./_types";
import { composeLoaders, createLoader } from "./_utils";

// Define MDX node types
type MdxNode = {
  type: string;
  [key: string]: any;
};

type MdxTree = {
  type: "root";
  children: MdxNode[];
};

export function createMdxFormatLoader(): ILoader<string, Record<string, any>> {
  // Create a unified processor for MDX parsing with all required plugins
  const parser = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkFrontmatter, ["yaml"])
    .use(remarkMdxFrontmatter)
    .use(remarkGfm);

  // Create a unified processor for MDX serialization
  const serializer = unified()
    .use(remarkStringify)
    .use(remarkMdx)
    .use(remarkFrontmatter, ["yaml"])
    .use(remarkMdxFrontmatter)
    .use(remarkGfm);

  return createLoader({
    async pull(locale, input) {
      // Parse the MDX content into an AST
      const file = new VFile(input);
      const ast = parser.parse(file);

      // Instead of returning the AST directly, convert it to a plain object
      // This ensures compatibility with the ILoader interface
      return JSON.parse(JSON.stringify(ast));
    },

    async push(locale, data) {
      // Recreate an AST from the plain object
      const ast = data as unknown as Root;

      // Serialize the AST back to MDX content
      const file = serializer.stringify(ast);
      return String(file);
    },
  });
}

export function createMdxStructureLoader(): ILoader<Record<string, any>, Record<string, string>> {
  return createLoader({
    async pull(locale, input) {
      const result = _.chain(input)
        .pickBy((value, key) => key.endsWith("/value"))
        .value();

      return result;
    },
    async push(locale, data, originalInput) {
      const result = _.merge({}, originalInput, data);

      return result;
    },
  });
}

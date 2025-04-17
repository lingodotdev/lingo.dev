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
import { createLoader } from "./_utils";

const parser = unified()
  .use(remarkParse)
  .use(remarkMdx)
  .use(remarkFrontmatter, ["yaml"])
  .use(remarkMdxFrontmatter)
  .use(remarkGfm);

const serializer = unified()
  .use(remarkStringify)
  .use(remarkMdx)
  .use(remarkFrontmatter, ["yaml"])
  .use(remarkMdxFrontmatter)
  .use(remarkGfm);

export function createMdxFormatLoader(): ILoader<string, Record<string, any>> {
  return createLoader({
    async pull(locale, input) {
      const file = new VFile(input);
      const ast = parser.parse(file);
      return JSON.parse(JSON.stringify(ast));
    },

    async push(locale, data) {
      const ast = data as unknown as Root;
      const content = String(serializer.stringify(ast));
      return content;
    },
  });
}

export function createDoubleSerializationLoader(): ILoader<string, string> {
  return createLoader({
    async pull(locale, input) {
      return input;
    },

    async push(locale, data) {
      const file = new VFile(data);
      const ast = parser.parse(file);

      const finalContent = String(serializer.stringify(ast));
      return finalContent;
    },
  });
}

export function createMdxStructureLoader(): ILoader<
  Record<string, any>,
  Record<string, string>
> {
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

import _ from "lodash";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkStringify from "remark-stringify";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { VFile } from "vfile";
import { Root, RootContent, RootContentMap } from "mdast";
import { ILoader } from "./_types";
import { createLoader } from "./_utils";

const parser = unified()
  .use(remarkParse)
  .use(remarkFrontmatter, ["yaml"])
  .use(remarkGfm);
const serializer = unified()
  .use(remarkStringify)
  .use(remarkFrontmatter, ["yaml"])
  .use(remarkGfm);

export function createMdxFormatLoader(): ILoader<string, Record<string, any>> {
  const skippedTypes: (keyof RootContentMap | "root")[] = [
    "code",
    "inlineCode",
  ];
  return createLoader({
    async pull(locale, input) {
      const file = new VFile(input);
      const ast = parser.parse(file);

      const result = _.cloneDeep(ast);

      traverseMdast(result, (node) => {
        if (skippedTypes.includes(node.type)) {
          if ("value" in node) {
            node.value = "";
          }
        }
      });

      return result;
    },

    async push(
      locale,
      data,
      originalInput,
      originalLocale,
      pullInput,
      pullOutput,
    ) {
      const file = new VFile(originalInput);
      const ast = parser.parse(file);

      const result = _.cloneDeep(ast);

      traverseMdast(result, (node, indexPath) => {
        if ("value" in node) {
          const incomingValue = findNodeByIndexPath(data, indexPath);
          if (
            incomingValue &&
            "value" in incomingValue &&
            !_.isEmpty(incomingValue.value)
          ) {
            node.value = incomingValue.value;
          }
        }
      });

      return String(serializer.stringify(result));
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

function traverseMdast(
  ast: Root | RootContent,
  visitor: (node: Root | RootContent, path: number[]) => void,
  indexPath: number[] = [],
) {
  visitor(ast, indexPath);

  if ("children" in ast && Array.isArray(ast.children)) {
    for (let i = 0; i < ast.children.length; i++) {
      traverseMdast(ast.children[i], visitor, [...indexPath, i]);
    }
  }
}

function findNodeByIndexPath(
  ast: Root | RootContent,
  indexPath: number[],
): Root | RootContent | null {
  let result: Root | RootContent | null = null;

  const stringifiedIndexPath = indexPath.join(".");
  traverseMdast(ast, (node, path) => {
    if (result) {
      return;
    }

    const currentStringifiedPath = path.join(".");
    if (currentStringifiedPath === stringifiedIndexPath) {
      result = node;
    }
  });

  return result;
}

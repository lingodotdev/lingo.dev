import { Root, RootContent } from "mdast";
import { VFile } from "vfile";
import { visit } from "unist-util-visit";
import { fromMarkdown } from "mdast-util-from-markdown";
import { gfm } from "micromark-extension-gfm";
import { gfmFromMarkdown } from "mdast-util-gfm";

export function traverseMdast(
  ast: Root | RootContent,
  visitor: (node: Root | RootContent) => void,
) {
  visitor(ast);
  if ("children" in ast && Array.isArray(ast.children)) {
    for (const child of ast.children) {
      traverseMdast(child, visitor);
    }
  }
}

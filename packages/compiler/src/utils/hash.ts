import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { MD5 } from "object-hash";

export function getJsxElementHash(nodePath: NodePath<t.Node>) {
  if (!nodePath.node) {
    return "";
  }

  const content = (nodePath.node as any).children
    .map((child: any) => child.value)
    .join("");

  const result = MD5(content);
  return result;
}

export function getJsxAttributeValueHash(attributeValue: string) {
  if (!attributeValue) {
    return "";
  }
  const result = MD5(attributeValue);
  return result;
}

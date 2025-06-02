import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import traverse from "@babel/traverse";

export function getAstKey(nodePath: NodePath) {
  const keyChunks: any[] = [];

  let current: NodePath | null = nodePath;
  while (current) {
    keyChunks.push(current.key);
    current = current.parentPath;

    if (t.isProgram(current?.node)) {
      break;
    }
  }

  const result = keyChunks.reverse().join("/");
  return result;
}

export function getAstByKey(ast: t.File, key: string) {
  const programPath = _getProgramNodePath(ast);
  if (!programPath) {
    return null;
  }

  const keyParts = key.split("/").reverse();

  let result: NodePath = programPath;

  while (true) {
    let currentKeyPart = keyParts.pop();
    if (!currentKeyPart) {
      break;
    }
    const isIntegerPart = Number.isInteger(Number(currentKeyPart));
    if (isIntegerPart) {
      const maybeBodyItemsArray = result.get("body");
      const bodyItemsArray = Array.isArray(maybeBodyItemsArray)
        ? maybeBodyItemsArray
        : [maybeBodyItemsArray];
      const index = Number(currentKeyPart);
      const subResult = bodyItemsArray[index];
      result = subResult as NodePath;
    } else {
      const maybeSubResultArray = result.get(currentKeyPart);
      const subResultArray = Array.isArray(maybeSubResultArray)
        ? maybeSubResultArray
        : [maybeSubResultArray];
      const subResult = subResultArray[0];
      result = subResult;
    }
  }

  return result;
}

function _getProgramNodePath(ast: t.File): NodePath<t.Program> | null {
  let result: NodePath<t.Program> | null = null;

  traverse(ast, {
    Program(nodePath) {
      result = nodePath;
      nodePath.stop();
    },
  });

  return result;
}

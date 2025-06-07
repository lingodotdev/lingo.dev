import { it, describe, expect } from "vitest";
import { parse } from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import { getAstKey, getAstByKey } from "./ast-key";

describe("ast key", () => {
  it("getAstKey should calc nodePath key", () => {
    const mockData = createMockData();

    const key = getAstKey(mockData.testElementPath);

    expect(key).toBe(mockData.testElementKey);
  });
});

describe("getAstByKey", () => {
  it("should retrieve correct node by key", () => {
    const mockData = createMockData();

    const elementPath = getAstByKey(mockData.ast, mockData.testElementKey);

    expect(elementPath).toBe(mockData.testElementPath);
  });
});

// helpers

function createMockData() {
  const ast = parse(
    `
    export function MyComponent() {
      return <div>Hello world!</div>;
    }
`,
    { sourceType: "module", plugins: ["jsx"] },
  );

  let testElementPath: NodePath | null = null;
  traverse(ast, {
    JSXElement(nodePath) {
      testElementPath = nodePath;
    },
  });
  if (!testElementPath) {
    throw new Error(
      "testElementPath cannot be null - check test case definition",
    );
  }

  const testElementKey = `0/declaration/body/0/argument`;

  return {
    ast,
    testElementPath,
    testElementKey,
  };
}

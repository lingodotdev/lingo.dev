import { it, describe, expect } from "vitest";
import { parse } from "@babel/parser";
import * as t from "@babel/types";
import { findInvokations } from "./invokations";

describe("findInvokations", () => {
  it("should find named import invocation", () => {
    const ast = parseCode(`
      import { targetFunc } from 'target-module';
      
      function test() {
        targetFunc(1, 2);
        otherFunc();
      }
    `);

    const result = findInvokations(ast, {
      moduleName: "target-module",
      functionName: "targetFunc",
    });

    expect(result.length).toBe(1);
    expect(result[0].type).toBe("CallExpression");

    const callee = result[0].callee as t.Identifier;
    expect(callee.name).toBe("targetFunc");
  });

  it("should find default import invocation", () => {
    const ast = parseCode(`
      import defaultFunc from 'target-module';
      
      function test() {
        defaultFunc('test');
      }
    `);

    const result = findInvokations(ast, {
      moduleName: "target-module",
      functionName: "default",
    });

    expect(result.length).toBe(1);

    const callee = result[0].callee as t.Identifier;
    expect(callee.name).toBe("defaultFunc");
  });

  it("should find namespace import invocation", () => {
    const ast = parseCode(`
      import * as targetModule from 'target-module';
      
      function test() {
        targetModule.targetFunc();
        targetModule.otherFunc();
      }
    `);

    const result = findInvokations(ast, {
      moduleName: "target-module",
      functionName: "targetFunc",
    });

    expect(result.length).toBe(1);

    const callee = result[0].callee as t.MemberExpression;
    expect((callee.object as t.Identifier).name).toBe("targetModule");
    expect((callee.property as t.Identifier).name).toBe("targetFunc");
  });

  it("should find renamed import invocation", () => {
    const ast = parseCode(`
      import { targetFunc as renamedFunc } from 'target-module';
      
      function test() {
        renamedFunc();
      }
    `);

    const result = findInvokations(ast, {
      moduleName: "target-module",
      functionName: "targetFunc",
    });

    expect(result.length).toBe(1);

    const callee = result[0].callee as t.Identifier;
    expect(callee.name).toBe("renamedFunc");
  });

  it("should return empty array when no matching imports exist", () => {
    const ast = parseCode(`
      import { otherFunc } from 'other-module';
      
      function test() {
        otherFunc();
      }
    `);

    const result = findInvokations(ast, {
      moduleName: "target-module",
      functionName: "targetFunc",
    });

    expect(result.length).toBe(0);
  });

  it("should return empty array when import exists but not invoked", () => {
    const ast = parseCode(`
      import { targetFunc } from 'target-module';
      
      function test() {
        // No invocation here
      }
    `);

    const result = findInvokations(ast, {
      moduleName: "target-module",
      functionName: "targetFunc",
    });

    expect(result.length).toBe(0);
  });
});

function parseCode(code: string): t.File {
  return parse(code, {
    sourceType: "module",
    plugins: ["typescript"],
  });
}

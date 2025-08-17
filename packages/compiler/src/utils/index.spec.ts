import { describe, it, expect } from "vitest";
import { createPayload, createOutput } from "../_base";
import * as t from "@babel/types";
import {
  getJsxRoots,
  isGoodJsxText,
  getOrCreateImport,
  hasI18nDirective,
  hasClientDirective,
  hasServerDirective,
  getModuleExecutionMode,
} from "./index";

function parse(code: string) {
  return createPayload({ code, params: {} as any, relativeFilePath: "x.tsx" })
    .ast as unknown as t.Node;
}

describe("getOrCreateImport", () => {
  it("inserts import when missing and reuses existing import when present", () => {
    const ast = parse(`export const X = 1;`);
    const res1 = getOrCreateImport(ast, {
      exportedName: "Fragment",
      moduleName: ["react"],
    });
    expect(res1.importedName).toBe("Fragment");
    const code1 = createOutput({
      code: "",
      ast,
      params: {} as any,
      relativeFilePath: "x.tsx",
    }).code;
    expect(code1).toMatch(/import\s*\{\s*Fragment\s*\}\s*from\s*["']react["']/);

    // Call again should reuse the same import and not duplicate
    const res2 = getOrCreateImport(ast, {
      exportedName: "Fragment",
      moduleName: ["react"],
    });
    expect(res2.importedName).toBe("Fragment");
    const code2 = createOutput({
      code: "",
      ast,
      params: {} as any,
      relativeFilePath: "x.tsx",
    }).code;
    const matches =
      code2.match(/import\s*\{\s*Fragment\s*\}\s*from\s*["']react["']/g) || [];
    expect(matches.length).toBe(1);
  });
});

describe("getJsxRoots", () => {
  it("returns only top-level JSX roots", () => {
    const ast = parse(`const X = () => (<div><span>Hello</span></div>);`);
    const roots = getJsxRoots(ast);
    expect(roots.length).toBe(1);
  });
});

describe("isGoodJsxText", () => {
  it("detects non-empty JSXText", () => {
    const payload = createPayload({
      code: `const X = () => (<div> Hello </div>);`,
      params: {} as any,
      relativeFilePath: "x.tsx",
    });
    let textPath: any;
    // locate JSXText
    require("@babel/traverse").default(payload.ast, {
      JSXText(p: any) {
        if (!textPath) textPath = p;
      },
    });
    expect(isGoodJsxText(textPath)).toBe(true);
  });
});

describe("hasI18nDirective", () => {
  it("returns true when file has use i18n directive", () => {
    const ast = parse(`"use i18n"; export const X = 1;`);
    expect(hasI18nDirective(ast)).toBe(true);
  });

  it("returns false when file does not have use i18n directive", () => {
    const ast = parse(`export const X = 1;`);
    expect(hasI18nDirective(ast)).toBe(false);
  });
});

describe("hasClientDirective", () => {
  it("returns true when file has use client directive", () => {
    const ast = parse(`"use client"; export const X = 1;`);
    expect(hasClientDirective(ast)).toBe(true);
  });

  it("returns false when file does not have use client directive", () => {
    expect(hasClientDirective(parse(`const X = 1;`))).toBe(false);
    expect(hasClientDirective(parse(`"use server"; const X=1;`))).toBe(false);
  });
});

describe("hasServerDirective", () => {
  it("returns true when file has use server directive", () => {
    const ast = parse(`"use server"; export const X = 1;`);
    expect(hasServerDirective(ast)).toBe(true);
  });

  it("returns false when file does not have use server directive", () => {
    expect(hasServerDirective(parse(`const X = 1;`))).toBe(false);
    expect(hasServerDirective(parse(`"use client"; const X=1;`))).toBe(false);
  });
});

describe("getModuleExecutionMode", () => {
  it("returns server by default when RSC enabled and no client directive", () => {
    const ast = parse(`export const X = 1;`);
    expect(getModuleExecutionMode(ast, true)).toBe("server");
  });

  it("returns client when use client directive present", () => {
    const ast = parse(`"use client"; export const X = 1;`);
    expect(getModuleExecutionMode(ast, true)).toBe("client");
  });

  it("returns client when RSC disabled", () => {
    const ast = parse(`export const X = 1;`);
    expect(getModuleExecutionMode(ast, false)).toBe("client");
  });
});

import { describe, it, expect } from "vitest";
import { createPayload } from "../_base";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import { getJsxElementHash, getJsxAttributeValueHash } from "./hash";

function getFirstJsx(pathCode: string) {
  const payload = createPayload({
    code: pathCode,
    params: {} as any,
    relativeFilePath: "x.tsx",
  });
  let found: any;
  traverse(payload.ast, {
    JSXElement(p) {
      if (!found) found = p;
    },
  });
  return found as any;
}

describe("utils/hash", () => {
  describe("getJsxElementHash", () => {
    it("produces a consistent non-empty hash for same input", () => {
      const a = getFirstJsx(`const A = () => <div>hello world</div>`);
      const first = getJsxElementHash(a);
      const second = getJsxElementHash(a);
      expect(first).toBeTypeOf("string");
      expect(first.length).toBeGreaterThan(0);
      expect(second).toEqual(first);
    });
  });

  describe("getJsxAttributeValueHash", () => {
    it("attribute hash returns empty for empty string and stable otherwise", () => {
      expect(getJsxAttributeValueHash("")).toBe("");
      expect(getJsxAttributeValueHash("x")).toBe(getJsxAttributeValueHash("x"));
    });
  });
});

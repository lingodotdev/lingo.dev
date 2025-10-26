import { describe, it, expect } from "vitest";
import { createPayload, createOutput, defaultParams } from "./_base";
import { jsxHtmlLangMutation } from "./jsx-html-lang";

function run(code: string, rsc = true) {
  const input = createPayload({
    code,
    params: { ...defaultParams, rsc },
    relativeFilePath: "app/layout.tsx",
  } as any);
  const mutated = jsxHtmlLangMutation(input);
  return createOutput(mutated!).code.trim();
}

describe("jsxHtmlLangMutation", () => {
  it("replaces html tag with framework component in server mode", () => {
    const input = `
export default function Root() {
  return <html><body>Hi</body></html>
}`.trim();
    const out = run(input, true);
    expect(out).toMatch(/LingoHtmlComponent/);
  });

  it("replaces html tag with framework component in client mode", () => {
    const input = `
"use client";
export default function Root() {
  return <html><body>Hi</body></html>
}`.trim();
    const out = run(input, false);
    expect(out).toMatch(/LingoHtmlComponent/);
  });
});

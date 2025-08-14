import { describe, it, expect } from "vitest";
import { createPayload, createOutput, defaultParams } from "./_base";
import jsxProviderMutation from "./jsx-provider";

function run(code: string, rsc = true) {
  const input = createPayload({
    code,
    params: { ...defaultParams, rsc },
    relativeFilePath: "app/layout.tsx",
  } as any);
  const mutated = jsxProviderMutation(input);
  return createOutput(mutated!).code.trim();
}

describe("jsxProviderMutation", () => {
  it("wraps <html> with LingoProvider in server mode", () => {
    const input = `
export default function Root() {
  return <html><body>Hi</body></html>
}`.trim();
    const out = run(input, true);
    expect(out).toContain("LingoProvider");
    expect(out).toContain("loadDictionary");
  });

  it("does not modify in client mode", () => {
    const input = `
export default function Root() {
  return <html><body>Hi</body></html>
}`.trim();
    const out = run(input, false);
    expect(out).toContain("<html>");
    expect(out).not.toContain("LingoProvider");
  });
});

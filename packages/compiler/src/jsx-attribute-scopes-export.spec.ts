import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPayload, createOutput, defaultParams } from "./_base";
import { jsxAttributeScopesExportMutation } from "./jsx-attribute-scopes-export";

vi.mock("./lib/lcp", () => {
  const instance = {
    resetScope: vi.fn().mockReturnThis(),
    setScopeType: vi.fn().mockReturnThis(),
    setScopeHash: vi.fn().mockReturnThis(),
    setScopeContext: vi.fn().mockReturnThis(),
    setScopeSkip: vi.fn().mockReturnThis(),
    setScopeOverrides: vi.fn().mockReturnThis(),
    setScopeContent: vi.fn().mockReturnThis(),
    save: vi.fn(),
  };
  const getInstance = vi.fn(() => instance);
  return {
    LCP: {
      getInstance,
    },
    __test__: { instance, getInstance },
  };
});
describe("jsxAttributeScopesExportMutation", () => {
  beforeEach(() => {
    // dynamic import avoids ESM mock timing issues
    return import("./lib/lcp").then((lcpMod) => {
      (lcpMod.LCP.getInstance as any).mockClear();
    });
  });

  it("collects attribute scopes and saves to LCP", async () => {
    const code = `
export default function X() {
  return <div data-jsx-attribute-scope="title:scope-1" title="Hello"/>;
}`.trim();
    const input = createPayload({
      code,
      params: defaultParams,
      relativeFilePath: "src/App.tsx",
    } as any);
    const out = jsxAttributeScopesExportMutation(input);
    // Not asserting output code as mutation does not change AST; assert side effects
    const lcpMod: any = await import("./lib/lcp");
    const inst = lcpMod.__test__.instance;
    expect(lcpMod.LCP.getInstance).toHaveBeenCalled();
    expect(inst.setScopeType).toHaveBeenCalledWith(
      "src/App.tsx",
      "scope-1",
      "attribute",
    );
    expect(inst.setScopeContent).toHaveBeenCalledWith(
      "src/App.tsx",
      "scope-1",
      "Hello",
    );
    expect(inst.save).toHaveBeenCalled();
  });
});

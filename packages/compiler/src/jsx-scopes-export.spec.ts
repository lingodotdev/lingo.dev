import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPayload, defaultParams } from "./_base";
import { jsxScopesExportMutation } from "./jsx-scopes-export";

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

describe("jsxScopesExportMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports element scope with hash/content/flags", async () => {
    const code = `
export default function X(){
  return <div data-jsx-scope="scope-1">Foobar</div>
}`.trim();
    const input = createPayload({
      code,
      params: defaultParams,
      relativeFilePath: "src/App.tsx",
    } as any);
    jsxScopesExportMutation(input);
    const lcpMod: any = await import("./lib/lcp");
    const inst = lcpMod.__test__.instance;
    expect(lcpMod.LCP.getInstance).toHaveBeenCalled();
    expect(inst.setScopeType).toHaveBeenCalledWith(
      "src/App.tsx",
      "0/declaration/body/0/argument",
      "element",
    );
    expect(inst.setScopeContent).toHaveBeenCalledWith(
      "src/App.tsx",
      "0/declaration/body/0/argument",
      "Foobar",
    );
    expect(inst.save).toHaveBeenCalled();
  });
});

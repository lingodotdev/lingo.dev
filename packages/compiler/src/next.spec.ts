import { describe, it, expect } from "vitest";
import { lingo } from "./next";

describe("next lingo enhancer", () => {
  it("returns a function that augments Next.js config (webpack path)", () => {
    const enhance = lingo({ turbopack: { enabled: false } });
    const cfg: any = {};
    const nextCfg = enhance(cfg);
    expect(typeof nextCfg.webpack).toBe("function");
  });
});

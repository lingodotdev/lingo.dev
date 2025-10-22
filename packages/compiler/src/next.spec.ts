import { describe, it, expect, vi } from "vitest";
// Treat tests as running in CI to avoid unplugin validation exits
vi.mock("./utils/env", () => ({ isRunningInCIOrDocker: () => true }));
import { withLingo as lingo } from "./next";

describe("next lingo enhancer", () => {
  it("returns a function that augments Next.js config (webpack path)", () => {
    const enhance = lingo({ turbopack: { enabled: false } });
    const cfg: any = {};
    const nextCfg = enhance(cfg);
    expect(typeof nextCfg.webpack).toBe("function");
  });
});

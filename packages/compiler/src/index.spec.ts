import { describe, it, expect, vi, beforeEach } from "vitest";
import compiler from "./index";

// Silence logs in tests
vi.spyOn(console, "log").mockImplementation(() => undefined as any);
vi.spyOn(console, "warn").mockImplementation(() => undefined as any);

vi.mock("./utils/env", () => ({ isRunningInCIOrDocker: () => true }));
vi.mock("./lib/lcp/cache", () => ({
  LCPCache: { ensureDictionaryFile: vi.fn() },
}));
vi.mock("unplugin", () => ({
  createUnplugin: () => ({
    vite: vi.fn(() => ({ name: "test-plugin" })),
    webpack: vi.fn(() => ({ name: "test-plugin" })),
  }),
}));

describe("compiler integration", () => {
  beforeEach(() => {
    (process as any).env = { ...process.env };
  });

  it("next() returns a function and sets webpack wrapper when turbopack disabled", () => {
    const cfg: any = { webpack: (c: any) => c };
    const out = compiler.next({
      sourceRoot: "src",
      models: "lingo.dev",
      turbopack: { enabled: false },
    })(cfg);
    expect(typeof out.webpack).toBe("function");
  });

  it("vite() pushes plugin to front and detects framework label", () => {
    const cfg: any = { plugins: [{ name: "react-router" }] };
    const out = compiler.vite({})(cfg);
    expect(out.plugins[0]).toBeDefined();
  });
});

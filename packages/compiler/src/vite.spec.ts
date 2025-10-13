import { describe, it, expect } from "vitest";
import { lingo } from "./vite";

describe("vite lingo plugin", () => {
  it("returns a vite plugin with expected shape", () => {
    const plugin: any = lingo();
    expect(plugin).toBeTruthy();
    expect(typeof plugin.name).toBe("string");
    expect(plugin.enforce).toBe("pre");
    expect(plugin.transformInclude("file.tsx")).toBe(true);
    expect(plugin.transformInclude("file.jsx")).toBe(true);
    expect(plugin.transformInclude("file.ts")).toBe(false);
  });
});

import { describe, test, expect, vi } from "vitest";
import { ConfigCacheManager } from "../config-cache-manager";
import { LazyProviderConfigLoader } from "../lazy-provider-loader";
import { OptimizedConfigParser } from "../optimized-config-parser";
import { z } from "zod";
import fs from "fs";

describe("Performance Suite", () => {
  test("ConfigCacheManager - cache hit/miss", () => {
    const cache = new ConfigCacheManager();
    cache.set("test", { ok: true });
    expect(cache.get("test")).toEqual({ ok: true });
  });

  test("LazyProviderConfigLoader - concurrent protection", async () => {
  const loader = new LazyProviderConfigLoader();
  const fn = vi.fn(async () => "done");
    const result = await loader.load("a", fn);
    expect(result).toBe("done");
  });

  test("OptimizedConfigParser - validation caching", () => {
    const schema = z.object({ name: z.string() });
    const parser = new OptimizedConfigParser(schema);
    const tmpFile = "temp.json";
    fs.writeFileSync(tmpFile, JSON.stringify({ name: "Jay" }));
    const result = parser.parse(tmpFile);
    expect(result.name).toBe("Jay");
    fs.unlinkSync(tmpFile);
  });
});

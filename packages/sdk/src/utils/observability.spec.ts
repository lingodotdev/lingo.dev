import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { trackEvent, _resetIdentityCache } from "./observability";

const capture = vi.fn(async () => undefined);
const shutdown = vi.fn(async () => undefined);
const PostHogMock = vi.fn(function (_key: string, _cfg: any) {
  return { capture, shutdown };
});
vi.mock("posthog-node", () => ({ PostHog: PostHogMock }));

describe("trackEvent", () => {
  const originalEnv = { ...process.env };
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
    _resetIdentityCache();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    globalThis.fetch = originalFetch;
  });

  it("skips when DO_NOT_TRACK is set", () => {
    process.env.DO_NOT_TRACK = "1";
    trackEvent("test-key", "https://test.api", "test.event", { foo: "bar" });
    expect(PostHogMock).not.toHaveBeenCalled();
  });

  it("captures event with email identity when whoami succeeds", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ email: "user@test.com", id: "123" }),
    }) as any;

    trackEvent("test-key", "https://test.api", "sdk.localize.start", {
      method: "localizeText",
    });

    await new Promise((r) => setTimeout(r, 200));

    expect(capture).toHaveBeenCalledWith(
      expect.objectContaining({
        distinctId: "user@test.com",
        event: "sdk.localize.start",
        properties: expect.objectContaining({
          method: "localizeText",
          distinct_id_source: "email",
          tracking_version: "1.0",
          sdk_package: "@lingo.dev/_sdk",
        }),
      }),
    );
    expect(shutdown).toHaveBeenCalledTimes(1);
  });

  it("falls back to API key hash when whoami fails", async () => {
    globalThis.fetch = vi
      .fn()
      .mockRejectedValue(new Error("Network error")) as any;

    trackEvent("my-api-key", "https://test.api", "sdk.localize.start", {});

    await new Promise((r) => setTimeout(r, 200));

    expect(capture).toHaveBeenCalledWith(
      expect.objectContaining({
        distinctId: expect.stringMatching(/^apikey-[a-f0-9]{16}$/),
        properties: expect.objectContaining({
          distinct_id_source: "api_key_hash",
        }),
      }),
    );
  });

  it("falls back to API key hash when whoami returns no email", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    }) as any;

    trackEvent("my-api-key", "https://test.api", "sdk.localize.start", {});

    await new Promise((r) => setTimeout(r, 200));

    expect(capture).toHaveBeenCalledWith(
      expect.objectContaining({
        distinctId: expect.stringMatching(/^apikey-[a-f0-9]{16}$/),
        properties: expect.objectContaining({
          distinct_id_source: "api_key_hash",
        }),
      }),
    );
  });

  it("caches identity across multiple calls", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ email: "user@test.com", id: "123" }),
    });
    globalThis.fetch = mockFetch as any;

    trackEvent("test-key", "https://test.api", "event1", {});
    await new Promise((r) => setTimeout(r, 200));

    trackEvent("test-key", "https://test.api", "event2", {});
    await new Promise((r) => setTimeout(r, 200));

    // whoami fetch should only be called once due to caching
    const whoamiCalls = mockFetch.mock.calls.filter(
      (call) => typeof call[0] === "string" && call[0].includes("/whoami"),
    );
    expect(whoamiCalls).toHaveLength(1);
    expect(capture).toHaveBeenCalledTimes(2);
  });

  it("uses different cache entries for different API keys", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ email: "user@test.com", id: "123" }),
    });
    globalThis.fetch = mockFetch as any;

    trackEvent("key-1", "https://test.api", "event1", {});
    await new Promise((r) => setTimeout(r, 200));

    trackEvent("key-2", "https://test.api", "event2", {});
    await new Promise((r) => setTimeout(r, 200));

    const whoamiCalls = mockFetch.mock.calls.filter(
      (call) => typeof call[0] === "string" && call[0].includes("/whoami"),
    );
    expect(whoamiCalls).toHaveLength(2);
  });
});

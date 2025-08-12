import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import trackEvent from "./observability";

vi.mock("./rc", () => ({ getRc: () => ({ auth: {} }) }));
vi.mock("node-machine-id", () => ({ machineId: async () => "device-123" }));

// Mock PostHog client used by dynamic import inside trackEvent
const capture = vi.fn(async () => undefined);
const shutdown = vi.fn(async () => undefined);
const PostHogMock = vi.fn((_key: string, _cfg: any) => ({ capture, shutdown }));
vi.mock("posthog-node", () => ({ PostHog: PostHogMock }));

describe("trackEvent", () => {
  const originalEnv = { ...process.env };
  afterEach(() => {
    process.env = originalEnv;
  });

  it("captures the event with properties", async () => {
    await trackEvent("test.event", { foo: "bar" });
    expect(PostHogMock).toHaveBeenCalledTimes(1);
    expect(capture).toHaveBeenCalledWith(
      expect.objectContaining({
        event: "test.event",
        properties: expect.objectContaining({ foo: "bar" }),
      }),
    );
    expect(shutdown).toHaveBeenCalledTimes(1);
  });

  it("skips when DO_NOT_TRACK is set", async () => {
    process.env = { ...originalEnv, DO_NOT_TRACK: "1" };
    // Should not throw nor attempt network
    await expect(trackEvent("test.event", { a: 1 })).resolves.toBeUndefined();
  });
});

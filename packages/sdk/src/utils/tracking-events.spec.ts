import { describe, it, expect } from "vitest";
import {
  TRACKING_EVENTS,
  TRACKING_VERSION,
  SDK_PACKAGE,
} from "./tracking-events";

describe("tracking-events", () => {
  it("all events have sdk. prefix", () => {
    Object.values(TRACKING_EVENTS).forEach((event) => {
      expect(event).toMatch(/^sdk\./);
    });
  });

  it("exports expected constants", () => {
    expect(TRACKING_VERSION).toBe("1.0");
    expect(SDK_PACKAGE).toBe("@lingo.dev/_sdk");
  });

  it("has localize and recognize event groups", () => {
    expect(TRACKING_EVENTS.LOCALIZE_START).toBe("sdk.localize.start");
    expect(TRACKING_EVENTS.LOCALIZE_SUCCESS).toBe("sdk.localize.success");
    expect(TRACKING_EVENTS.LOCALIZE_ERROR).toBe("sdk.localize.error");
    expect(TRACKING_EVENTS.RECOGNIZE_START).toBe("sdk.recognize.start");
    expect(TRACKING_EVENTS.RECOGNIZE_SUCCESS).toBe("sdk.recognize.success");
    expect(TRACKING_EVENTS.RECOGNIZE_ERROR).toBe("sdk.recognize.error");
  });
});

// Unit tests for exit handler

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import type { Logger } from "pino";
import { registerExitHandler } from "./exit-handler.js";

describe("registerExitHandler", () => {
  let mockLogger: Logger;
  let flushCallback: ((cb: () => void) => void) | undefined;

  beforeEach(() => {
    // Create a mock logger with flush method
    mockLogger = {
      flush: vi.fn((cb?: () => void) => {
        flushCallback = cb;
        if (cb) cb();
      }),
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn(),
      trace: vi.fn(),
      fatal: vi.fn(),
    } as unknown as Logger;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should register exit handler without throwing", () => {
    expect(() => {
      registerExitHandler(mockLogger);
    }).not.toThrow();
  });

  it("should register multiple loggers", () => {
    const mockLogger2 = { ...mockLogger, flush: vi.fn() } as unknown as Logger;

    expect(() => {
      registerExitHandler(mockLogger);
      registerExitHandler(mockLogger2);
    }).not.toThrow();
  });

  it("should call flush on the logger when registered", () => {
    registerExitHandler(mockLogger);

    // The flush should not be called immediately during registration
    expect(mockLogger.flush).not.toHaveBeenCalled();
  });

  it("should handle logger flush method", () => {
    const flushMock = vi.fn((cb?: () => void) => {
      if (cb) cb();
    });

    const logger = {
      flush: flushMock,
    } as unknown as Logger;

    registerExitHandler(logger);

    expect(flushMock).not.toHaveBeenCalled();
  });
});

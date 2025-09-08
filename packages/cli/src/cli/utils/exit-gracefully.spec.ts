import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { exitGracefully } from "./exit-gracefully";

// Mock process.exit
const mockExit: any = vi.fn();
const originalProcess = global.process;

describe("exitGracefully", () => {
  beforeEach(() => {
    // Mock process.exit
    vi.spyOn(process, "exit").mockImplementation(mockExit);

    // Mock process._getActiveHandles and _getActiveRequests
    Object.defineProperty(process, "_getActiveHandles", {
      value: vi.fn(),
      writable: true,
    });
    Object.defineProperty(process, "_getActiveRequests", {
      value: vi.fn(),
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllTimers();
    mockExit.mockClear();
  });

  it("should exit immediately when no pending operations", () => {
    // Mock no pending operations
    (process as any)._getActiveHandles.mockReturnValue([]);
    (process as any)._getActiveRequests.mockReturnValue([]);

    exitGracefully();

    expect(mockExit).toHaveBeenCalledWith(0);
  });

  it("should wait and retry when there are pending operations", () => {
    vi.useFakeTimers();

    // Mock pending operations
    (process as any)._getActiveHandles.mockReturnValue([
      { hasRef: () => true, close: () => {} },
    ]);
    (process as any)._getActiveRequests.mockReturnValue([]);

    exitGracefully();

    // Should not exit immediately
    expect(mockExit).not.toHaveBeenCalled();

    // Fast-forward time to trigger retry
    vi.advanceTimersByTime(250);

    // Should still not exit if operations are pending
    expect(mockExit).not.toHaveBeenCalled();

    // Fast-forward to max wait time
    vi.advanceTimersByTime(1750);

    // Should exit after max wait time
    expect(mockExit).toHaveBeenCalledWith(0);
  });

  it("should exit after max wait interval even with pending operations", () => {
    vi.useFakeTimers();

    // Mock persistent pending operations
    (process as any)._getActiveHandles.mockReturnValue([
      { hasRef: () => true, close: () => {} },
    ]);
    (process as any)._getActiveRequests.mockReturnValue([]);

    exitGracefully();

    // Fast-forward to max wait time (2000ms)
    vi.advanceTimersByTime(2000);

    expect(mockExit).toHaveBeenCalledWith(0);
  });

  it("should handle standard process handles correctly", () => {
    // Mock only standard handles
    (process as any)._getActiveHandles.mockReturnValue([
      process.stdin,
      process.stdout,
      process.stderr,
    ]);
    (process as any)._getActiveRequests.mockReturnValue([]);

    exitGracefully();

    // Should exit immediately as standard handles are filtered out
    expect(mockExit).toHaveBeenCalledWith(0);
  });

  it("should handle timers without ref correctly", () => {
    // Mock timers without ref
    (process as any)._getActiveHandles.mockReturnValue([
      { hasRef: () => false },
    ]);
    (process as any)._getActiveRequests.mockReturnValue([]);

    exitGracefully();

    // Should exit immediately as timers without ref are filtered out
    expect(mockExit).toHaveBeenCalledWith(0);
  });

  it("should detect file watchers correctly", () => {
    // Mock file watcher handles
    (process as any)._getActiveHandles.mockReturnValue([{ close: () => {} }]);
    (process as any)._getActiveRequests.mockReturnValue([]);

    exitGracefully();

    // Should not exit immediately due to file watcher
    expect(mockExit).not.toHaveBeenCalled();
  });

  it("should detect pending requests correctly", () => {
    // Mock pending requests
    (process as any)._getActiveHandles.mockReturnValue([]);
    (process as any)._getActiveRequests.mockReturnValue([
      { someRequest: true },
    ]);

    exitGracefully();

    // Should not exit immediately due to pending requests
    expect(mockExit).not.toHaveBeenCalled();
  });

  it("should handle elapsed time parameter correctly", () => {
    vi.useFakeTimers();

    // Mock pending operations
    (process as any)._getActiveHandles.mockReturnValue([
      { hasRef: () => true, close: () => {} },
    ]);
    (process as any)._getActiveRequests.mockReturnValue([]);

    // Start with 1500ms already elapsed
    exitGracefully(1500);

    // Should exit after 500ms more (reaching 2000ms max)
    vi.advanceTimersByTime(500);

    expect(mockExit).toHaveBeenCalledWith(0);
  });

  it("should exit immediately when elapsed time exceeds max wait interval", () => {
    // Mock pending operations but start with elapsed time > 2000ms
    (process as any)._getActiveHandles.mockReturnValue([
      { hasRef: () => true, close: () => {} },
    ]);
    (process as any)._getActiveRequests.mockReturnValue([]);

    exitGracefully(2500);

    // Should exit immediately as elapsed time exceeds max wait interval
    expect(mockExit).toHaveBeenCalledWith(0);
  });

  it("should handle mixed types of pending operations", () => {
    vi.useFakeTimers();

    // Mock mixed pending operations
    (process as any)._getActiveHandles.mockReturnValue([
      { hasRef: () => true, close: () => {} },
      { hasRef: () => false }, // Timer without ref
      process.stdin, // Standard handle
    ]);
    (process as any)._getActiveRequests.mockReturnValue([
      { someRequest: true },
    ]);

    exitGracefully();

    // Should not exit immediately due to mixed pending operations
    expect(mockExit).not.toHaveBeenCalled();

    // Fast-forward to max wait time
    vi.advanceTimersByTime(2000);

    expect(mockExit).toHaveBeenCalledWith(0);
  });
});

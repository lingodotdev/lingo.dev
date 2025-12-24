/**
 * Timeout utilities for preventing operations from hanging indefinitely
 */

/**
 * Wrap a promise with a timeout
 * If the promise doesn't resolve/reject within the timeout, it will reject with a TimeoutError
 *
 * @param promise - The promise to wrap
 * @param timeoutMs - Timeout in milliseconds
 * @param operationName - Name of the operation for error messages
 * @returns Promise that resolves/rejects with timeout protection
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  operationName: string = "Operation",
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () =>
          reject(
            new TimeoutError(
              `${operationName} timed out after ${timeoutMs}ms`,
              timeoutMs,
            ),
          ),
        timeoutMs,
      ),
    ),
  ]);
}

/**
 * Custom error for timeout operations
 */
export class TimeoutError extends Error {
  constructor(
    message: string,
    public readonly timeoutMs: number,
  ) {
    super(message);
    this.name = "TimeoutError";
  }
}

/**
 * Default timeout values (in milliseconds)
 */
export const DEFAULT_TIMEOUTS = {
  /** File I/O operations (read/write) */
  FILE_IO: 10_000, // 10 seconds

  /** Metadata operations (loading/saving) */
  METADATA: 15_000, // 15 seconds

  /** AI API calls for translation */
  AI_API: 60_000, // 60 seconds

  /** HTTP requests to translation server */
  HTTP_REQUEST: 30_000, // 30 seconds

  /** Server initialization */
  SERVER_START: 30_000, // 30 seconds

  /** Translation service full operation */
  TRANSLATION: 120_000, // 2 minutes
} as const;

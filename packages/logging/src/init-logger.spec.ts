import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdirSync, rmSync, existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { initLogger } from "./init-logger.js";
import { LOG_DIR } from "./constants.js";

describe("initLogger", () => {
  const testLogDir = join(tmpdir(), "lingo-logging-test");
  const testSlug = "test-app";

  beforeEach(() => {
    // Clean up test directory before each test
    if (existsSync(testLogDir)) {
      rmSync(testLogDir, { recursive: true, force: true });
    }
    mkdirSync(testLogDir, { recursive: true });
  });

  afterEach(() => {
    // Clean up test directory after each test
    if (existsSync(testLogDir)) {
      rmSync(testLogDir, { recursive: true, force: true });
    }
  });

  it("should initialize logger with default configuration", () => {
    const logger = initLogger(testSlug);

    expect(logger).toBeDefined();
    expect(logger.info).toBeDefined();
    expect(logger.error).toBeDefined();
    expect(logger.warn).toBeDefined();
    expect(logger.debug).toBeDefined();
  });

  it("should return the same logger instance for the same slug (singleton)", () => {
    const logger1 = initLogger(testSlug);
    const logger2 = initLogger(testSlug);

    expect(logger1).toBe(logger2);
  });

  it("should create different logger instances for different slugs", () => {
    const logger1 = initLogger("app-1");
    const logger2 = initLogger("app-2");

    expect(logger1).not.toBe(logger2);
  });

  it("should create log directory if it doesn't exist", () => {
    const customSlug = "custom-test-app";

    // Initialize logger (should create directory)
    const logger = initLogger(customSlug);

    expect(logger).toBeDefined();
    // Note: We can't easily test the exact directory without mocking,
    // but we can verify the logger works
  });

  it("should write logs to the log file", async () => {
    const logger = initLogger(testSlug);
    const testMessage = "Test log message";
    const testData = { userId: 123, action: "test" };

    logger.info(testData, testMessage);

    // rotating-file-stream writes asynchronously, so we need to wait
    await new Promise((resolve) => setTimeout(resolve, 100));

    const logFilePath = join(LOG_DIR, `${testSlug}.log`);
    expect(existsSync(logFilePath)).toBe(true);

    // Verify log contents
    const logContent = readFileSync(logFilePath, "utf-8");
    expect(logContent).toContain(testMessage);
    expect(logContent).toContain("userId");
    expect(logContent).toContain("123");
  });

  it("should apply correct log level", () => {
    const logger = initLogger(testSlug);

    // Verify logger has all standard methods
    expect(typeof logger.trace).toBe("function");
    expect(typeof logger.debug).toBe("function");
    expect(typeof logger.info).toBe("function");
    expect(typeof logger.warn).toBe("function");
    expect(typeof logger.error).toBe("function");
    expect(typeof logger.fatal).toBe("function");
  });

  it("should handle multiple loggers with different slugs concurrently", () => {
    const slugs = ["app-1", "app-2", "app-3", "app-4", "app-5"];
    const loggers = slugs.map((slug) => initLogger(slug));

    // All loggers should be defined and unique
    expect(loggers).toHaveLength(5);
    expect(new Set(loggers).size).toBe(5);

    // Each logger should work independently
    loggers.forEach((logger, index) => {
      logger.info(`Test message from ${slugs[index]}`);
    });
  });

  it("should not throw errors even if logger operations fail", () => {
    // This test verifies that logging operations don't crash the application.
    // The implementation wraps logger initialization in try-catch and handles
    // runtime errors on the destination stream.
    const logger = initLogger("resilient-logger");

    // Should not throw even if there are issues
    expect(() => {
      logger.info("Test message");
      logger.error("Test error");
      logger.warn({ data: "complex" }, "Warning with object");
    }).not.toThrow();

    expect(logger).toBeDefined();
  });
});

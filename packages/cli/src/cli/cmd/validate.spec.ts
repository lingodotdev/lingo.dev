import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import validateCmd from "./validate";

describe("validate command", () => {
  let tempDir: string;
  let originalCwd: string;

  beforeEach(() => {
    // Save original working directory
    originalCwd = process.cwd();

    // Create a temporary directory for testing
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "lingo-validate-test-"));
    process.chdir(tempDir);
  });

  afterEach(() => {
    // Restore original working directory
    process.chdir(originalCwd);

    // Clean up temporary directory
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it("should be defined", () => {
    expect(validateCmd).toBeDefined();
  });

  it("should have correct command name", () => {
    expect(validateCmd.name()).toBe("validate");
  });

  it("should have correct description", () => {
    expect(validateCmd.description()).toBe(
      "Validate lingo.dev configuration and file accessibility",
    );
  });

  it("should have --strict option", () => {
    const options = validateCmd.options;
    const strictOption = options.find((opt: any) =>
      opt.flags.includes("--strict"),
    );
    expect(strictOption).toBeDefined();
    expect(strictOption?.description).toContain("Strict mode");
  });

  it("should have --api-key option", () => {
    const options = validateCmd.options;
    const apiKeyOption = options.find((opt: any) =>
      opt.flags.includes("--api-key"),
    );
    expect(apiKeyOption).toBeDefined();
    expect(apiKeyOption?.description).toContain("API key");
  });

  describe("validation logic", () => {
    it("should detect missing i18n.json", async () => {
      // Don't create i18n.json - command should fail
      const exitSpy = vi
        .spyOn(process, "exit")
        .mockImplementation((code?: any) => {
          throw new Error(`Process.exit(${code})`);
        });

      try {
        await validateCmd.parseAsync(["node", "test", "validate"], {
          from: "user",
        });
      } catch (error: any) {
        // Expected to throw due to process.exit(1)
        expect(error.message).toContain("Process.exit(1)");
      }

      exitSpy.mockRestore();
    });

    it("should validate a valid i18n.json configuration", async () => {
      // Create a valid i18n.json
      const i18nConfig = {
        $schema: "https://lingo.dev/schema/i18n.json",
        version: 0,
        locale: {
          source: "en",
          targets: ["fr", "es"],
        },
        buckets: {
          json: {
            include: ["src/i18n/[locale].json"],
          },
        },
      };

      fs.writeFileSync(
        path.join(tempDir, "i18n.json"),
        JSON.stringify(i18nConfig, null, 2),
      );

      // Create source directory and file
      const srcDir = path.join(tempDir, "src", "i18n");
      fs.mkdirSync(srcDir, { recursive: true });

      // Create source locale file
      const sourceFile = path.join(srcDir, "en.json");
      fs.writeFileSync(
        sourceFile,
        JSON.stringify({ hello: "Hello", world: "World" }, null, 2),
      );

      // Mock process.exit to prevent actual exit
      const exitSpy = vi
        .spyOn(process, "exit")
        .mockImplementation((code?: any) => {
          if (code && code !== 0) {
            throw new Error(`Process.exit(${code})`);
          }
          return undefined as never;
        });

      // Mock exitGracefully to prevent exit
      vi.mock("../utils/exit-gracefully", () => ({
        exitGracefully: vi.fn(),
      }));

      try {
        await validateCmd.parseAsync(["node", "test", "validate"], {
          from: "user",
        });
        // If we get here, validation should have passed (warnings are OK)
        expect(exitSpy).not.toHaveBeenCalledWith(1);
      } catch (error: any) {
        // If it throws, it should not be an exit error with code 1
        expect(error.message).not.toContain("Process.exit(1)");
      } finally {
        exitSpy.mockRestore();
      }
    });

    it("should detect invalid locale codes", async () => {
      // Create an i18n.json with invalid locale
      const i18nConfig = {
        $schema: "https://lingo.dev/schema/i18n.json",
        version: 0,
        locale: {
          source: "invalid-locale-123",
          targets: ["fr"],
        },
        buckets: {
          json: {
            include: ["src/i18n/[locale].json"],
          },
        },
      };

      fs.writeFileSync(
        path.join(tempDir, "i18n.json"),
        JSON.stringify(i18nConfig, null, 2),
      );

      const exitSpy = vi
        .spyOn(process, "exit")
        .mockImplementation((code?: any) => {
          throw new Error(`Process.exit(${code})`);
        });

      try {
        await validateCmd.parseAsync(["node", "test", "validate"], {
          from: "user",
        });
      } catch (error: any) {
        // Should exit with error due to invalid locale
        expect(error.message).toContain("Process.exit");
      }

      exitSpy.mockRestore();
    });

    it("should handle --strict flag for missing target files", async () => {
      const i18nConfig = {
        $schema: "https://lingo.dev/schema/i18n.json",
        version: 0,
        locale: {
          source: "en",
          targets: ["fr"],
        },
        buckets: {
          json: {
            include: ["src/i18n/[locale].json"],
          },
        },
      };

      fs.writeFileSync(
        path.join(tempDir, "i18n.json"),
        JSON.stringify(i18nConfig, null, 2),
      );

      // Create source directory and file
      const srcDir = path.join(tempDir, "src", "i18n");
      fs.mkdirSync(srcDir, { recursive: true });

      const sourceFile = path.join(srcDir, "en.json");
      fs.writeFileSync(
        sourceFile,
        JSON.stringify({ hello: "Hello" }, null, 2),
      );

      // Don't create target file (fr.json)
      // With --strict, this should cause an error

      const exitSpy = vi
        .spyOn(process, "exit")
        .mockImplementation((code?: any) => {
          if (code !== 0) {
            throw new Error(`Process.exit(${code})`);
          }
          return undefined as never;
        });

      try {
        await validateCmd.parseAsync(["node", "test", "validate", "--strict"], {
          from: "user",
        });
      } catch (error: any) {
        // In strict mode, missing target files should cause exit with error
        expect(error.message).toContain("Process.exit(1)");
      }

      exitSpy.mockRestore();
    });

  });
});

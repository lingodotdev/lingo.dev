import fs from "fs";
import path from "path";
import type { ZodTypeAny } from "zod";

/**
 * Minimal OptimizedConfigParser used by tests and config loader.
 * - Accepts a Zod schema in the constructor
 * - parse(input) accepts a file path (string pointing to an existing file) or
 *   raw JSON/string/object. If given a file path, it reads and JSON.parses it.
 * - Uses the provided schema to validate/parse the value if schema is provided.
 *
 * This implementation is intentionally small and dependency-free so it can
 * replace a previously non-module file and behave as an ES module.
 */
export class OptimizedConfigParser {
  private schema?: ZodTypeAny;

  constructor(schema?: ZodTypeAny) {
    this.schema = schema;
  }

  parse(input: unknown) {
    let value: any = input;

    if (typeof input === "string") {
      // treat as file path if file exists
      try {
        if (fs.existsSync(input)) {
          const raw = fs.readFileSync(input, { encoding: "utf8" });
          // try parse as JSON, fallback to raw string
          try {
            value = JSON.parse(raw);
          } catch (e) {
            value = raw;
          }
        } else {
          // if not a path, attempt to parse JSON string
          try {
            value = JSON.parse(input);
          } catch (e) {
            value = input;
          }
        }
      } catch (err) {
        // if any fs error, just pass the original input through
        value = input;
      }
    }

    if (this.schema) {
      // Use schema.parse to validate/transform. Let it throw on invalid input.
      return this.schema.parse(value);
    }

    return value;
  }
}

import { describe, expect, it } from "vitest";
import {
  parseProperty,
  parseSchema,
  resolveRef,
  sortPropertyKeys,
  inferType,
} from "./parser";
import type { JSONSchemaObject, PropertyInfo } from "./types";

describe("resolveRef", () => {
  it("should resolve simple reference", () => {
    const root = {
      definitions: {
        User: { type: "object", properties: { name: { type: "string" } } },
      },
    };
    const result = resolveRef("#/definitions/User", root);
    expect(result).toEqual({
      type: "object",
      properties: { name: { type: "string" } },
    });
  });

  it("should return undefined for invalid reference", () => {
    const root = { definitions: {} };
    const result = resolveRef("#/definitions/NonExistent", root);
    expect(result).toBeUndefined();
  });

  it("should handle deep nested references", () => {
    const root = {
      a: { b: { c: { value: "found" } } },
    };
    const result = resolveRef("#/a/b/c", root);
    expect(result).toEqual({ value: "found" });
  });

  it("should return undefined for non-hash references", () => {
    const root = {};
    const result = resolveRef("invalid", root);
    expect(result).toBeUndefined();
  });
});

describe("sortPropertyKeys", () => {
  it("should sort with custom order first", () => {
    const keys = ["gamma", "alpha", "beta"];
    const customOrder = ["beta", "alpha"];
    const result = sortPropertyKeys(keys, [], customOrder);
    expect(result).toEqual(["beta", "alpha", "gamma"]);
  });

  it("should prioritize required properties", () => {
    const keys = ["optional1", "required1", "optional2", "required2"];
    const required = ["required1", "required2"];
    const result = sortPropertyKeys(keys, required);
    expect(result).toEqual([
      "required1",
      "required2",
      "optional1",
      "optional2",
    ]);
  });

  it("should combine custom order with required sorting", () => {
    const keys = ["d", "c", "b", "a"];
    const required = ["c", "a"];
    const customOrder = ["b"];
    const result = sortPropertyKeys(keys, required, customOrder);
    expect(result).toEqual(["b", "a", "c", "d"]);
  });

  it("should handle empty arrays", () => {
    const result = sortPropertyKeys([]);
    expect(result).toEqual([]);
  });
});

describe("inferType", () => {
  const root = {};

  it("should handle primitive types", () => {
    expect(inferType({ type: "string" }, root)).toBe("string");
    expect(inferType({ type: "number" }, root)).toBe("number");
    expect(inferType({ type: "boolean" }, root)).toBe("boolean");
  });

  it("should handle array types", () => {
    expect(inferType({ type: "array" }, root)).toBe("array");
    expect(inferType({ type: "array", items: { type: "string" } }, root)).toBe(
      "array of string",
    );
  });

  it("should handle union types", () => {
    const schema = {
      type: ["string", "number"],
    };
    expect(inferType(schema, root)).toBe("string | number");
  });

  it("should handle anyOf unions", () => {
    const schema = {
      anyOf: [{ type: "string" }, { type: "number" }],
    };
    expect(inferType(schema, root)).toBe("string | number");
  });

  it("should handle $ref types", () => {
    const rootWithRef = {
      definitions: {
        User: { type: "object" },
      },
    };
    const schema = { $ref: "#/definitions/User" };
    expect(inferType(schema, rootWithRef)).toBe("object");
  });

  it("should handle complex array items with unions", () => {
    const schema = {
      type: "array",
      items: {
        anyOf: [{ type: "string" }, { type: "number" }],
      },
    };
    expect(inferType(schema, root)).toBe("array of string | number");
  });

  it("should return unknown for invalid schemas", () => {
    expect(inferType(null, root)).toBe("unknown");
    expect(inferType({}, root)).toBe("unknown");
    expect(inferType({ invalid: true }, root)).toBe("unknown");
  });
});

describe("parseProperty", () => {
  it("should parse simple property", () => {
    const schema = {
      type: "string",
      description: "A string property",
      default: "default value",
    };
    const result = parseProperty("name", schema, true);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      name: "name",
      fullPath: "name",
      type: "string",
      required: true,
      description: "A string property",
      defaultValue: "default value",
      allowedValues: undefined,
      allowedKeys: undefined,
    });
  });

  it("should parse property with enum values", () => {
    const schema = {
      type: "string",
      enum: ["red", "green", "blue"],
    };
    const result = parseProperty("color", schema, false);

    expect(result[0].allowedValues).toEqual(["blue", "green", "red"]);
  });

  it("should parse property with allowed keys", () => {
    const schema = {
      type: "object",
      propertyNames: {
        enum: ["key1", "key2", "key3"],
      },
    };
    const result = parseProperty("config", schema, false);

    expect(result[0].allowedKeys).toEqual(["key1", "key2", "key3"]);
  });

  it("should handle parent path correctly", () => {
    const schema = { type: "string" };
    const result = parseProperty("child", schema, false, {
      parentPath: "parent",
    });

    expect(result[0].fullPath).toBe("parent.child");
  });

  it("should parse nested object properties", () => {
    const schema = {
      type: "object",
      properties: {
        name: { type: "string" },
        age: { type: "number", description: "Person's age" },
      },
      required: ["name"],
    };
    const result = parseProperty("person", schema, true);

    expect(result).toHaveLength(1);
    expect(result[0].children).toHaveLength(2);
    expect(result[0].children?.[0]).toEqual({
      name: "name",
      fullPath: "person.name",
      type: "string",
      required: true,
      description: undefined,
      defaultValue: undefined,
      allowedValues: undefined,
      allowedKeys: undefined,
    });
    expect(result[0].children?.[1]).toEqual({
      name: "age",
      fullPath: "person.age",
      type: "number",
      required: false,
      description: "Person's age",
      defaultValue: undefined,
      allowedValues: undefined,
      allowedKeys: undefined,
    });
  });

  it("should parse array with object items", () => {
    const schema = {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          value: { type: "number" },
        },
        required: ["id"],
      },
    };
    const result = parseProperty("items", schema, false);

    expect(result[0].children).toHaveLength(2);
    expect(result[0].children?.[0].fullPath).toBe("items.*.id");
    expect(result[0].children?.[0].required).toBe(true);
    expect(result[0].children?.[1].fullPath).toBe("items.*.value");
    expect(result[0].children?.[1].required).toBe(false);
  });

  it("should handle additionalProperties", () => {
    const schema = {
      type: "object",
      additionalProperties: {
        type: "string",
        description: "Dynamic property",
      },
    };
    const result = parseProperty("config", schema, false);

    expect(result[0].children).toHaveLength(1);
    expect(result[0].children?.[0].name).toBe("*");
    expect(result[0].children?.[0].fullPath).toBe("config.*");
    expect(result[0].children?.[0].type).toBe("string");
  });

  it("should handle markdownDescription over description", () => {
    const schema = {
      type: "string",
      description: "Plain description",
      markdownDescription: "**Markdown** description",
    };
    const result = parseProperty("field", schema, false);

    expect(result[0].description).toBe("**Markdown** description");
  });

  it("should return empty array for invalid schema", () => {
    const result = parseProperty("invalid", null, false);
    expect(result).toEqual([]);
  });
});

describe("parseSchema", () => {
  it("should parse complete schema", () => {
    const schema = {
      type: "object",
      properties: {
        version: { type: "string", default: "1.0" },
        config: {
          type: "object",
          properties: {
            debug: { type: "boolean" },
          },
        },
      },
      required: ["version"],
    };

    const result = parseSchema(schema);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("version");
    expect(result[0].required).toBe(true);
    expect(result[1].name).toBe("config");
    expect(result[1].required).toBe(false);
  });

  it("should handle schema with $ref root", () => {
    const schema = {
      $ref: "#/definitions/Config",
      definitions: {
        Config: {
          type: "object",
          properties: {
            name: { type: "string" },
          },
          required: ["name"],
        },
      },
    };

    const result = parseSchema(schema);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("name");
    expect(result[0].required).toBe(true);
  });

  it("should apply custom ordering", () => {
    const schema = {
      type: "object",
      properties: {
        gamma: { type: "string" },
        alpha: { type: "string" },
        beta: { type: "string" },
      },
    };

    const result = parseSchema(schema, { customOrder: ["beta", "alpha"] });
    expect(result.map((p: PropertyInfo) => p.name)).toEqual([
      "beta",
      "alpha",
      "gamma",
    ]);
  });

  it("should return empty array for invalid schema", () => {
    expect(parseSchema(null)).toEqual([]);
    expect(parseSchema({})).toEqual([]);
    expect(parseSchema({ type: "string" })).toEqual([]);
  });

  it("should handle missing definitions gracefully", () => {
    const schema = {
      $ref: "#/definitions/NonExistent",
      definitions: {},
    };

    const result = parseSchema(schema);
    expect(result).toEqual([]);
  });
});

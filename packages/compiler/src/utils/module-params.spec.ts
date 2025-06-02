import { describe, it, expect } from "vitest";
import { parseParametrizedModuleId } from "./module-params";
import _ from "lodash";

describe("parseParametrizedModuleId", () => {
  it("should extract the module id without parameters", () => {
    const result = parseParametrizedModuleId("test-module");

    expect(result).toEqual({
      id: "test-module",
      params: {},
    });
  });

  it("should extract the module id with a single parameter", () => {
    const result = parseParametrizedModuleId("test-module?key=value");

    expect(result).toEqual({
      id: "test-module",
      params: { key: "value" },
    });
  });

  it("should extract the module id with multiple parameters", () => {
    const result = parseParametrizedModuleId(
      "test-module?key1=value1&key2=value2&key3=value3",
    );

    expect(result).toEqual({
      id: "test-module",
      params: {
        key1: "value1",
        key2: "value2",
        key3: "value3",
      },
    });
  });

  it("should handle parameters with special characters", () => {
    const result = parseParametrizedModuleId(
      "test-module?key=value%20with%20spaces&special=%21%40%23",
    );

    expect(result).toEqual({
      id: "test-module",
      params: {
        key: "value with spaces",
        special: "!@#",
      },
    });
  });

  it("should handle module ids with path-like structure", () => {
    const result = parseParametrizedModuleId(
      "parent/child/module?version=1.0.0",
    );

    expect(result).toEqual({
      id: "parent/child/module",
      params: { version: "1.0.0" },
    });
  });
});

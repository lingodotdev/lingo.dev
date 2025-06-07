import { describe, it, expect } from "vitest";
import i18nDirectiveMutation from "./i18n-directive";
import { createPayload, CompilerParams, defaultParams } from "./_base";

describe("i18nDirectiveMutation", () => {
  it("should return payload when 'use i18n' directive is present", () => {
    const input = `
"use i18n";
function Component() {
  return <div>Hello</div>;
}
`.trim();

    const result = createPayload({
      code: input,
      params: defaultParams,
      fileKey: "test",
    });
    const mutated = i18nDirectiveMutation(result);

    expect(mutated).not.toBeNull();
    expect(mutated).toEqual(result);
  });

  it("should return null when 'use i18n' directive is not present", () => {
    const input = `
function Component() {
  return <div>Hello</div>;
}
`.trim();

    const result = createPayload({
      code: input,
      params: { ...defaultParams, useDirective: true },
      fileKey: "test",
    });
    const mutated = i18nDirectiveMutation(result);

    expect(mutated).toBeNull();
  });

  it("should handle multiple directives correctly", () => {
    const input = `
"use strict";
"use i18n";
function Component() {
  return <div>Hello</div>;
}
`.trim();

    const result = createPayload({
      code: input,
      params: defaultParams,
      fileKey: "test",
    });
    const mutated = i18nDirectiveMutation(result);

    expect(mutated).not.toBeNull();
    expect(mutated).toEqual(result);
  });
});

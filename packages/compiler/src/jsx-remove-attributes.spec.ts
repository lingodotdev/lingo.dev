import { describe, it, expect } from "vitest";
import { jsxRemoveAttributesMutation } from "./jsx-remove-attributes";
import { createPayload, createOutput, defaultParams } from "./_base";

// Helper function to run mutation and get result
function runMutation(code: string) {
  const input = createPayload({ code, params: defaultParams, fileKey: "test" });
  const mutated = jsxRemoveAttributesMutation(input);
  if (!mutated) return code; // Return original code if no changes made
  return createOutput(mutated).code;
}

describe("jsxRemoveAttributesMutation", () => {
  it("should remove only attributes added by compiler", () => {
    const input = `
function Component() {
  return <div data-jsx-root>
    <p data-jsx-scope="foo" data-other="1">Hello world</p>
    <p data-jsx-attribute-scope="bar" className="text-success">Good night moon</p>
    <p data-jsx-scope="foobar" data-jsx-attribute-scope="barfoo" className="text-danger" data-other="2">Good morning sun</p>
  </div>;
}
`.trim();

    const expected = `
function Component() {
  return <div>
    <p data-other="1">Hello world</p>
    <p className="text-success">Good night moon</p>
    <p className="text-danger" data-other="2">Good morning sun</p>
  </div>;
}
`.trim();
    const result = runMutation(input);
    expect(result).toBe(expected);
  });
});

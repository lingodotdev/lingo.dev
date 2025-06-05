import { describe, it, expect } from "vitest";
import jsxRootFlagMutation from "./jsx-root-flag";
import { createPayload, createOutput, defaultParams } from "./_base";

// Helper function to run mutation and get result
function runMutation(code: string) {
  const input = createPayload({ code, params: defaultParams, fileKey: "test" });
  const mutated = jsxRootFlagMutation(input);
  if (!mutated) throw new Error("Mutation returned null");
  return createOutput(mutated).code;
}

describe("jsxRootFlagMutation", () => {
  it("should add data-jsx-root flag to a single root JSX element", () => {
    const input = `
function Component() {
  return <div>Hello</div>;
}
`.trim();

    const expected = `
function Component() {
  return <div data-jsx-root>Hello</div>;
}
`.trim();
    const result = runMutation(input);

    expect(result).toBe(expected.trim());
  });

  it("should add data-jsx-root flag to multiple root JSX elements", () => {
    const input = `
function Component() {
  if (condition) {
    return <div>True</div>;
  }
  return <span>False</span>;
}
`.trim();

    const expected = `
function Component() {
  if (condition) {
    return <div data-jsx-root>True</div>;
  }
  return <span data-jsx-root>False</span>;
}
`.trim();
    const result = runMutation(input);

    expect(result).toBe(expected.trim());
  });

  it("should not add data-jsx-root flag to nested JSX elements", () => {
    const input = `
function Component() {
  return <div>
      <span>Nested</span>
    </div>;
}
`.trim();

    const expected = `
function Component() {
  return <div data-jsx-root>
      <span>Nested</span>
    </div>;
}
`.trim();

    const result = runMutation(input);

    expect(result).toBe(expected.trim());
  });
});

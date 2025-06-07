import { describe, it, expect } from "vitest";
import jsxScopeFlagMutation from "./jsx-scope-flag";
import { createPayload, createOutput, defaultParams } from "./_base";

// Helper function to run mutation and get result
function runMutation(code: string) {
  const input = createPayload({ code, params: defaultParams, fileKey: "test" });
  const mutated = jsxScopeFlagMutation(input);
  if (!mutated) throw new Error("Mutation returned null");
  return createOutput(mutated).code;
}

describe("jsxScopeFlagMutation", () => {
  it("should add data-jsx-scope flag to element containing text without text siblings", () => {
    const input = `
function Component() {
  return <div>
      <span>Hello World</span>
    </div>;
}
`.trim();

    const expected = `
function Component() {
  return <div>
      <span data-jsx-scope="0/body/0/argument/1">Hello World</span>
    </div>;
}
`.trim();
    const result = runMutation(input);
    expect(result).toBe(expected);
  });

  it("should not add flag when element has text siblings", () => {
    const input = `
function Component() {
  return <div>
      Some text
      <span>Hello World</span>
      More text
    </div>;
}
`.trim();

    const expected = `
function Component() {
  return <div data-jsx-scope="0/body/0/argument">
      Some text
      <span>Hello World</span>
      More text
    </div>;
}
`.trim();
    const result = runMutation(input);
    expect(result).toBe(expected);
  });

  it("should handle multiple nested scopes correctly", () => {
    const input = `
function Component() {
  return <div>
      <section>
        <p>First text</p>
      </section>
      <section>
        Text here
        <div>More text</div>
      </section>
    </div>;
}
`.trim();

    const expected = `
function Component() {
  return <div>
      <section>
        <p data-jsx-scope="0/body/0/argument/1/1">First text</p>
      </section>
      <section data-jsx-scope="0/body/0/argument/3">
        Text here
        <div>More text</div>
      </section>
    </div>;
}
`.trim();
    const result = runMutation(input);
    expect(result).toBe(expected);
  });

  it("should not add flag to elements without text content", () => {
    const input = `
function Component() {
  return <div>
      <span></span>
      <p>{variable}</p>
    </div>;
}
`.trim();

    const expected = `
function Component() {
  return <div>
      <span></span>
      <p>{variable}</p>
    </div>;
}
`.trim();
    const result = runMutation(input);
    expect(result).toBe(expected);
  });

  it("should handle whitespace-only text nodes correctly", () => {
    const input = `
function Component() {
  return <div>
      <span>
        
        Hello
        
      </span>
    </div>;
}
`.trim();

    const expected = `
function Component() {
  return <div>
      <span data-jsx-scope="0/body/0/argument/1">
        
        Hello
        
      </span>
    </div>;
}
`.trim();
    const result = runMutation(input);
    expect(result).toBe(expected);
  });

  it("should handle JSX in props", () => {
    const input = `
function Component() {
  return <MyComponent label={<label>Hello</label>}>
      <p>Foobar</p>
    </MyComponent>;
}
`.trim();

    const expected = `
function Component() {
  return <MyComponent label={<label data-jsx-scope="0/body/0/argument/openingElement/0/value/expression">Hello</label>}>
      <p data-jsx-scope="0/body/0/argument/1">Foobar</p>
    </MyComponent>;
}
`.trim();
    const result = runMutation(input);
    expect(result).toBe(expected);
  });
});

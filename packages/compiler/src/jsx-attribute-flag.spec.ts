import { describe, it, expect } from "vitest";
import jsxAttributeFlagMutation from "./jsx-attribute-flag";
import { createPayload, createOutput, defaultParams } from "./_base";

// Helper function to run mutation and get result
function runMutation(code: string) {
  const input = createPayload({ code, params: defaultParams, fileKey: "test" });
  const mutated = jsxAttributeFlagMutation(input);
  if (!mutated) throw new Error("Mutation returned null");
  return createOutput(mutated).code;
}

describe("jsxAttributeFlagMutation", () => {
  it("should add data-jsx-attribute-scope to elements with title attribute", () => {
    const input = `
function Component() {
  return <div>
    <a href="https://example.com" title="Visit Example">Example link</a>
  </div>;
}
`.trim();

    const expected = `
function Component() {
  return <div>
    <a href="https://example.com" title="Visit Example" data-jsx-attribute-scope={["title:0/body/0/argument/1-title"]}>Example link</a>
  </div>;
}
`.trim();
    const result = runMutation(input);
    expect(result).toBe(expected);
  });

  it("should add data-jsx-attribute-scope to elements with aria-label attribute", () => {
    const input = `
function Component() {
  return <div>
    <button aria-label="Close dialog">×</button>
  </div>;
}
`.trim();

    const expected = `
function Component() {
  return <div>
    <button aria-label="Close dialog" data-jsx-attribute-scope={["aria-label:0/body/0/argument/1-aria-label"]}>×</button>
  </div>;
}
`.trim();
    const result = runMutation(input);
    expect(result).toBe(expected);
  });

  it("should handle multiple localizable attributes on the same element", () => {
    const input = `
function Component() {
  return <div>
    <input placeholder="Enter name" aria-label="Name field" title="Your full name" />
  </div>;
}
`.trim();

    const expected = `
function Component() {
  return <div>
    <input placeholder="Enter name" aria-label="Name field" title="Your full name" data-jsx-attribute-scope={["placeholder:0/body/0/argument/1-placeholder", "aria-label:0/body/0/argument/1-aria-label", "title:0/body/0/argument/1-title"]} />
  </div>;
}
`.trim();
    const result = runMutation(input);
    expect(result).toBe(expected);
  });

  it("should handle nested elements with localizable attributes", () => {
    const input = `
function Component() {
  return <div>
    <div>
      <a href="/" title="Home page">Home</a>
      <span aria-description="Navigation menu">Menu</span>
    </div>
    <img src="/logo.png" alt="Company logo" />
  </div>;
}
`.trim();

    const expected = `
function Component() {
  return <div>
    <div>
      <a href="/" title="Home page" data-jsx-attribute-scope={["title:0/body/0/argument/1/1-title"]}>Home</a>
      <span aria-description="Navigation menu" data-jsx-attribute-scope={["aria-description:0/body/0/argument/1/3-aria-description"]}>Menu</span>
    </div>
    <img src="/logo.png" alt="Company logo" data-jsx-attribute-scope={["alt:0/body/0/argument/3-alt"]} />
  </div>;
}
`.trim();
    const result = runMutation(input);
    expect(result).toBe(expected);
  });

  it("should ignore elements without localizable attributes", () => {
    const input = `
function Component() {
  return <div>
    <span className="regular">No attributes to localize</span>
    <button onClick={() => {}}>Click me</button>
  </div>;
}
`.trim();

    const expected = `
function Component() {
  return <div>
    <span className="regular">No attributes to localize</span>
    <button onClick={() => {}}>Click me</button>
  </div>;
}
`.trim();
    const result = runMutation(input);
    expect(result).toBe(expected);
  });

  it("should not ignore component elements (uppercase names)", () => {
    const input = `
function Component() {
  return <div>
    <CustomComponent title="This should be ignored" />
    <span title="This should be flagged">Text</span>
  </div>;
}
`.trim();

    const expected = `
function Component() {
  return <div>
    <CustomComponent title="This should be ignored" data-jsx-attribute-scope={["title:0/body/0/argument/1-title"]} />
    <span title="This should be flagged" data-jsx-attribute-scope={["title:0/body/0/argument/3-title"]}>Text</span>
  </div>;
}
`.trim();
    const result = runMutation(input);
    expect(result).toBe(expected);
  });
});

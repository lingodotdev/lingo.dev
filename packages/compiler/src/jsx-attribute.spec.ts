import { describe, it, expect } from "vitest";
import { jsxAttributeMutation } from "./jsx-attribute";
import { createPayload, createOutput, defaultParams } from "./_base";

function runMutation(code: string) {
  const input = createPayload({ code, params: defaultParams, fileKey: "test" });
  const mutated = jsxAttributeMutation(input);
  if (!mutated) return code;
  return createOutput(mutated).code;
}

describe("jsxAttributeMutation", () => {
  it("should replace html element with localizable attributes with LingoAttributeComponent", () => {
    const input = `
<p>
  Lorem ipsum <a href="https://example.com" title="Dolor link">dolor</a> sit amet.
</p>
    `;
    const expected = `
<p>
  Lorem ipsum
  <LingoAttributeComponent
    $as="a"
    $attributes={{
      title: "0/body/title",
      "aria-label": "0/body/aria-label"
    }}
    href="https://example.com"
  >
    dolor
  </LingoAttributeComponent>
  sit amet.
</p>
    `;
  });
});

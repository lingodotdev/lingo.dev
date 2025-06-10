import { describe, it, expect } from "vitest";
import { lingoJsxAttributeScopeInjectMutation } from "./jsx-attribute-scope-inject";
import { createPayload, createOutput, defaultParams } from "./_base";
import * as parser from "@babel/parser";
import generate from "@babel/generator";

// Helper function to run mutation and get result
function runMutation(code: string, rsc = false) {
  const params = { ...defaultParams, rsc };
  const input = createPayload({ code, params, relativeFilePath: "test" });
  const mutated = lingoJsxAttributeScopeInjectMutation(input);
  if (!mutated) throw new Error("Mutation returned null");
  return createOutput(mutated).code;
}

// Helper function to normalize code for comparison
function normalizeCode(code: string) {
  const ast = parser.parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });
  return generate(ast).code;
}

describe("lingoJsxAttributeScopeInjectMutation", () => {
  describe("attribute scopes", () => {
    it("should handle JSX elements with attribute scopes", () => {
      const input = `
    function Component() {
    return <div>
    <button data-jsx-attribute-scope={["aria-label:0/path/1", "title:0/path/2"]} className="btn">Click me</button>
    </div>;
    }
    `.trim();

      const expected = `
    import { LingoAttributeComponent } from "lingo.dev/react/client";
    function Component() {
    return <div>
    <LingoAttributeComponent 
      data-jsx-attribute-scope={["aria-label:0/path/1", "title:0/path/2"]} 
      className="btn" 
      $attrAs="button" 
      $fileKey="test" 
      $attributes={{
        "aria-label": "0/path/1",
        "title": "0/path/2"
      }}
    >Click me</LingoAttributeComponent>
    </div>;
    }
    `.trim();

      const result = runMutation(input);
      expect(normalizeCode(result)).toBe(normalizeCode(expected));
    });

    it("should handle JSX elements with attribute scopes in server components", () => {
      const input = `
    function Component() {
      return <div>
        <a data-jsx-attribute-scope={["title:0/path/1", "aria-label:0/path/2"]} className="link">Visit website</a>
      </div>;
    }
    `.trim();

      const expected = `
    import { LingoAttributeComponent, loadDictionary } from "lingo.dev/react/rsc";
    function Component() {
      return <div>
        <LingoAttributeComponent
          data-jsx-attribute-scope={["title:0/path/1", "aria-label:0/path/2"]}
          className="link"
          $attrAs="a"
          $fileKey="test"
          $attributes={{
            "title": "0/path/1",
            "aria-label": "0/path/2"
          }}
          $loadDictionary={locale => loadDictionary(locale)}
        >Visit website</LingoAttributeComponent>
      </div>;
    }
    `.trim();

      const result = runMutation(input, true);
      expect(normalizeCode(result)).toBe(normalizeCode(expected));
    });

    it("should handle JSX elements with both attribute scopes and JSX children", () => {
      const input = `
    function Component() {
      return <div>
        <a data-jsx-attribute-scope={["title:0/path/1", "aria-label:0/path/2"]} className="link">
          <span>Click here</span> to visit
        </a>
      </div>;
    }
    `.trim();

      const expected = `
    import { LingoAttributeComponent } from "lingo.dev/react/client";
    function Component() {
      return <div>
        <LingoAttributeComponent
          data-jsx-attribute-scope={["title:0/path/1", "aria-label:0/path/2"]}
          className="link"
          $attrAs="a"
          $fileKey="test"
          $attributes={{
            "title": "0/path/1",
            "aria-label": "0/path/2"
          }}
        >
          <span>Click here</span> to visit
        </LingoAttributeComponent>
      </div>;
    }
    `.trim();

      const result = runMutation(input);
      expect(normalizeCode(result)).toBe(normalizeCode(expected));
    });

    it("should handle JSX elements with attribute scopes and variables", () => {
      const input = `
    function Component({ url, accessibilityLabel }) {
      return <div>
        <a data-jsx-attribute-scope={["title:0/path/1", "aria-label:0/path/2"]} className="link">
          Visit {url}
        </a>
      </div>;
    }
    `.trim();

      const expected = `
    import { LingoAttributeComponent } from "lingo.dev/react/client";
    function Component({ url, accessibilityLabel }) {
      return <div>
        <LingoAttributeComponent
          data-jsx-attribute-scope={["title:0/path/1", "aria-label:0/path/2"]}
          className="link"
          $attrAs="a"
          $fileKey="test"
          $attributes={{
            "title": "0/path/1",
            "aria-label": "0/path/2"
          }}
        >
          Visit {url}
        </LingoAttributeComponent>
      </div>;
    }
    `.trim();

      const result = runMutation(input);
      expect(normalizeCode(result)).toBe(normalizeCode(expected));
    });
  });
});

/**
 * Tests for ICU MessageFormat escaping utility
 */
import { describe, expect, it } from "vitest";
import IntlMessageFormat from "intl-messageformat";
import { parse } from "@babel/parser";
import { traverse } from "./babel-compat";
import { escapeTextForICU, isReactComponent } from "./utils";

describe("escapeTextForICU", () => {
  it.each([
    // [input, expectedEscaped, expectedRendered]
    ["It's a test", "It''s a test", "It's a test"],
    [
      "Use {braces} in code",
      "Use '{'braces'}' in code",
      "Use {braces} in code",
    ],
    [
      "Use <>content</> for fragments",
      "Use '<'>content'<'/> for fragments",
      "Use <>content</> for fragments",
    ],
    ["Use #hashtags", "Use '#'hashtags", "Use '#'hashtags"], // ICU doesn't unescape #
    [
      "It's {test} with <tags> and #hash",
      "It''s '{'test'}' with '<'tags> and '#'hash",
      "It's {test} with <tags> and '#'hash",
    ],
    [
      "Use <Fragment>content</Fragment>",
      "Use '<'Fragment>content'<'/Fragment>",
      "Use <Fragment>content</Fragment>",
    ],
    ["Plain text", "Plain text", "Plain text"],
    [
      "Write <>text</> or <Fragment>text</Fragment>",
      "Write '<'>text'<'/> or '<'Fragment>text'<'/Fragment>",
      "Write <>text</> or <Fragment>text</Fragment>",
    ],
    ["<>", "'<'>", "<>"],
    ["</>", "'<'/>", "</>"],
  ])(
    "should escape %s correctly",
    (input, expectedEscaped, expectedRendered) => {
      const escaped = escapeTextForICU(input);
      expect(escaped).toBe(expectedEscaped);

      const formatter = new IntlMessageFormat(escaped, "en");
      const result = formatter.format();
      expect(result).toBe(expectedRendered);
    },
  );
});

describe("isReactComponent", () => {
  /**
   * Helper to parse code and test isReactComponent on the first function found
   */
  function testIsReactComponent(code: string): boolean {
    const ast = parse(code, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });

    let result = false;
    traverse(ast, {
      "FunctionDeclaration|FunctionExpression|ArrowFunctionExpression"(path) {
        if (
          path.isFunctionDeclaration() ||
          path.isFunctionExpression() ||
          path.isArrowFunctionExpression()
        ) {
          result = isReactComponent(path);
          path.stop(); // Stop after first function
        }
      },
    });

    return result;
  }

  describe("simple cases", () => {
    it("should detect arrow function returning JSX element", () => {
      const code = `const MyComponent = () => <div>Hello</div>;`;
      expect(testIsReactComponent(code)).toBe(true);
    });

    it("should detect arrow function returning JSX fragment", () => {
      const code = `const MyComponent = () => <>Hello</>;`;
      expect(testIsReactComponent(code)).toBe(true);
    });

    it("should detect function with explicit return of JSX element", () => {
      const code = `
        function MyComponent() {
          return <div>Hello</div>;
        }
      `;
      expect(testIsReactComponent(code)).toBe(true);
    });

    it("should detect function with explicit return of JSX fragment", () => {
      const code = `
        function MyComponent() {
          return <>Hello</>;
        }
      `;
      expect(testIsReactComponent(code)).toBe(true);
    });

    it("should return false for function returning non-JSX", () => {
      const code = `
        function notAComponent() {
          return "hello";
        }
      `;
      expect(testIsReactComponent(code)).toBe(false);
    });

    it("should return false for function with no return", () => {
      const code = `
        function notAComponent() {
          console.log("hello");
        }
      `;
      expect(testIsReactComponent(code)).toBe(false);
    });
  });

  describe("nested function cases", () => {
    it("should detect component with nested helper function that returns JSX", () => {
      const code = `
        function MyComponent() {
          const renderHelper = () => <span>Helper</span>;
          return <div>{renderHelper()}</div>;
        }
      `;
      expect(testIsReactComponent(code)).toBe(true);
    });

    it("should detect component with nested non-JSX helper function", () => {
      const code = `
        function MyComponent() {
          const helper = () => "string";
          return <div>{helper()}</div>;
        }
      `;
      expect(testIsReactComponent(code)).toBe(true);
    });

    // // Corner case
    // it("should return false when outer function doesn't return JSX but nested does", () => {
    //   const code = `
    //     function notAComponent() {
    //       function MyComponent() {
    //         const helper = () => "string";
    //         return <div>{helper()}</div>;
    //       }
    //       const Inner = () => <div>Hello</div>;
    //       return Inner;
    //     }
    //   `;
    //   // This tests the outer function, which returns a function, not JSX
    //   expect(testIsReactComponent(code)).toBe(false);
    // });
  });
});

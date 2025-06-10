import { describe, it, expect } from "vitest";
import { lingoJsxScopeInjectMutation } from "./jsx-scope-inject";
import { createPayload, createOutput, defaultParams } from "./_base";
import * as parser from "@babel/parser";
import generate from "@babel/generator";

// Helper function to run mutation and get result
function runMutation(code: string, rsc = false) {
  const params = { ...defaultParams, rsc };
  const input = createPayload({ code, params, relativeFilePath: "test" });
  const mutated = lingoJsxScopeInjectMutation(input);
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

describe("lingoJsxScopeInjectMutation", () => {
  describe("skip", () => {
    it("should skip if data-lingo-skip is truthy", () => {
      const input = `
function Component() {
  return <div data-jsx-scope data-lingo-skip>
    <p>Hello world!</p>
  </div>;
}
    `;

      const expected = `
function Component() {
  return <div data-jsx-scope data-lingo-skip>
    <p>Hello world!</p>
  </div>;
}
    `;

      const result = runMutation(input);
      expect(normalizeCode(result)).toBe(normalizeCode(expected));
    });
  });

  describe("transform", () => {
    it("should transform elements with data-jsx-scope into LingoComponent", () => {
      const input = `
function Component() {
  return <div>
    <p data-jsx-scope="0/my/custom/path/1" className="text-foreground">Hello world!</p>
  </div>;
}
`.trim();

      const expected = `
import { LingoComponent } from "lingo.dev/react/client";
function Component() {
  return <div>
    <LingoComponent data-jsx-scope="0/my/custom/path/1" className="text-foreground" $as="p" $fileKey="test" $entryKey="0/my/custom/path/1" />
  </div>;
}
`.trim();

      const result = runMutation(input);

      // We normalize both the expected and result to handle formatting differences
      expect(normalizeCode(result)).toBe(normalizeCode(expected));
    });

    it("should transform JSX elements differently for server components", () => {
      const input = `
function Component() {
  return <div>
    <p data-jsx-scope="0/body/0/argument/1" className="text-foreground">Hello world!</p>
  </div>;
}
`.trim();

      const expected = `
import { LingoComponent, loadDictionary } from "lingo.dev/react/rsc";
function Component() {
  return <div>
    <LingoComponent data-jsx-scope="0/body/0/argument/1" className="text-foreground" $as="p" $fileKey="test" $entryKey="0/body/0/argument/1" $loadDictionary={locale => loadDictionary(locale)} />
  </div>;
}
`.trim();

      const result = runMutation(input, true);

      expect(normalizeCode(result)).toBe(normalizeCode(expected));
    });

    it("should skip transformation if no JSX scopes are present", () => {
      const input = `
function Component() {
  return <div>
    <p className="text-foreground">Hello world!</p>
  </div>;
}
`.trim();

      // Input should match output exactly
      const result = runMutation(input);
      expect(normalizeCode(result)).toBe(normalizeCode(input));
    });

    it("should preserve JSX expression attributes", () => {
      const input = `
function Component({ dynamicClass }) {
  return <div>
    <p data-jsx-scope="0/body/0/argument/1" className={dynamicClass}>Hello world!</p>
  </div>;
}
`.trim();

      const expected = `
import { LingoComponent } from "lingo.dev/react/client";
function Component({
  dynamicClass
}) {
  return <div>
    <LingoComponent data-jsx-scope="0/body/0/argument/1" className={dynamicClass} $as="p" $fileKey="test" $entryKey="0/body/0/argument/1" />
  </div>;
}
`.trim();

      const result = runMutation(input);
      expect(normalizeCode(result)).toBe(normalizeCode(expected));
    });

    it("should handle boolean attributes correctly", () => {
      const input = `
function Component() {
  return <div>
    <button data-jsx-scope="0/body/0/argument/1" disabled>Click me</button>
  </div>;
}
`.trim();

      const expected = `
import { LingoComponent } from "lingo.dev/react/client";
function Component() {
  return <div>
    <LingoComponent data-jsx-scope="0/body/0/argument/1" disabled $as="button" $fileKey="test" $entryKey="0/body/0/argument/1" />
  </div>;
}
`.trim();

      const result = runMutation(input);
      expect(normalizeCode(result)).toBe(normalizeCode(expected));
    });
  });

  describe("variables", () => {
    it("should handle JSX variables in elements with data-jsx-scope", () => {
      const input = `
function Component({ count, category }) {
  return <div>
    <p data-jsx-scope="0/body/0/argument/1" className="text-foreground">You have {count} items in {category}.</p>
  </div>;
}
`.trim();

      const expected = `
import { LingoComponent } from "lingo.dev/react/client";
function Component({ count, category }) {
  return <div>
    <LingoComponent
      data-jsx-scope="0/body/0/argument/1"
      className="text-foreground"
      $as="p"
      $fileKey="test"
      $entryKey="0/body/0/argument/1"
      $variables={{ "count": count, "category": category }}
    />
  </div>;
}
`.trim();

      const result = runMutation(input);
      expect(normalizeCode(result)).toBe(normalizeCode(expected));
    });

    it("should handle JSX variables for server components", () => {
      const input = `
function Component({ count, category }) {
  return <div>
    <p data-jsx-scope="0/body/0/argument/1" className="text-foreground">You have {count} items in {category}.</p>
  </div>;
}
`.trim();

      const expected = `
import { LingoComponent, loadDictionary } from "lingo.dev/react/rsc";
function Component({ count, category }) {
  return <div>
    <LingoComponent
      data-jsx-scope="0/body/0/argument/1"
      className="text-foreground"
      $as="p"
      $fileKey="test"
      $entryKey="0/body/0/argument/1"
      $variables={{ "count": count, "category": category }}
      $loadDictionary={locale => loadDictionary(locale)}
    />
  </div>;
}
`.trim();

      const result = runMutation(input, true);
      expect(normalizeCode(result)).toBe(normalizeCode(expected));
    });

    it("should handle nested JSX elements with variables", () => {
      const input = `
function Component({ count, user }) {
  return <div>
    <div data-jsx-scope="0/body/0/argument/1">
      Welcome {user.name}, you have {count} notifications.
    </div>
  </div>;
}
`.trim();

      const expected = `
import { LingoComponent } from "lingo.dev/react/client";
function Component({ count, user }) {
  return <div>
    <LingoComponent
      data-jsx-scope="0/body/0/argument/1"
      $as="div"
      $fileKey="test"
      $entryKey="0/body/0/argument/1"
      $variables={{ "user.name": user.name, "count": count }}
    />
  </div>;
}
`.trim();

      const result = runMutation(input);
      expect(normalizeCode(result)).toBe(normalizeCode(expected));
    });
  });

  describe("elements", () => {
    it("should handle nested JSX elements", () => {
      const input = `
function Component() {
  return <div>
    <div data-jsx-scope="0/body/0/argument/1">
      <p>Hello</p>
      <span>World</span>
    </div>
  </div>;
}
`.trim();

      const expected = `
import { LingoComponent } from "lingo.dev/react/client";
function Component() {
  return <div>
    <LingoComponent
      data-jsx-scope="0/body/0/argument/1"
      $as="div"
      $fileKey="test"
      $entryKey="0/body/0/argument/1"
      $elements={[
        ({
  children
}) => <p>{children}</p>,
        ({
  children
}) => <span>{children}</span>
      ]}
    />
  </div>;
}
`.trim();

      const result = runMutation(input);
      expect(normalizeCode(result)).toBe(normalizeCode(expected));
    });

    it("should handle deeply nested JSX elements", () => {
      const input = `
function Component() {
  return <div>
    <div data-jsx-scope="0/body/0/argument/1">
      <p>
        <span>
          <strong>Deeply</strong>
        </span>
        nested
      </p>
    </div>
  </div>;
}
`.trim();

      const expected = `
import { LingoComponent } from "lingo.dev/react/client";
function Component() {
  return <div>
    <LingoComponent
      data-jsx-scope="0/body/0/argument/1"
      $as="div"
      $fileKey="test"
      $entryKey="0/body/0/argument/1"
      $elements={[
        ({
  children
}) => <p>{children}</p>,
        ({
  children
}) => <span>{children}</span>,
        ({
  children
}) => <strong>{children}</strong>
      ]}
    />
  </div>;
}
`.trim();

      const result = runMutation(input);
      expect(normalizeCode(result)).toBe(normalizeCode(expected));
    });

    it("should handle nested elements with variables", () => {
      const input = `
function Component({ name }) {
  return <div>
    <div data-jsx-scope="0/body/0/argument/1">
      <p>Hello {name}</p>
      <span>Welcome back!</span>
    </div>
  </div>;
}
`.trim();

      const expected = `
import { LingoComponent } from "lingo.dev/react/client";
function Component({ name }) {
  return <div>
    <LingoComponent
      data-jsx-scope="0/body/0/argument/1"
      $as="div"
      $fileKey="test"
      $entryKey="0/body/0/argument/1"
      $variables={{ "name": name }}
      $elements={[
        ({
  children
}) => <p>{children}</p>,
        ({
  children
}) => <span>{children}</span>
      ]}
    />
  </div>;
}
`.trim();

      const result = runMutation(input);
      expect(normalizeCode(result)).toBe(normalizeCode(expected));
    });
  });

  describe("functions", () => {
    it("should handle simple function calls", () => {
      const input = `
function Component() {
  return <div>
    <p data-jsx-scope="0/body/0/argument/1">Hello {getName(user)}, you have {getCount()} items</p>
  </div>;
}
`.trim();

      const expected = `
import { LingoComponent } from "lingo.dev/react/client";
function Component() {
  return <div>
    <LingoComponent
      data-jsx-scope="0/body/0/argument/1"
      $as="p"
      $fileKey="test"
      $entryKey="0/body/0/argument/1"
      $functions={{
        "getName": [getName(user)],
        "getCount": [getCount()]
      }}
    />
  </div>;
}
`.trim();

      const result = runMutation(input);
      expect(normalizeCode(result)).toBe(normalizeCode(expected));
    });

    it("should handle function calls with variables and nested elements", () => {
      const input = `
function Component({ user }) {
  return <div>
    <div data-jsx-scope="0/body/0/argument/1">
      <p>{formatName(getName(user))}</p> has <em>{count}</em>
      <span>Last seen: {formatDate(user.lastSeen)}</span>
    </div>
  </div>;
}
`.trim();

      const expected = `
import { LingoComponent } from "lingo.dev/react/client";
function Component({ user }) {
  return <div>
    <LingoComponent
      data-jsx-scope="0/body/0/argument/1"
      $as="div"
      $fileKey="test"
      $entryKey="0/body/0/argument/1"
      $variables={{ "count": count }}
      $elements={[
        ({ children }) => <p>{children}</p>,
        ({ children }) => <em>{children}</em>,
        ({ children }) => <span>{children}</span>
      ]}
      $functions={{
        "formatName": [formatName(getName(user))],
        "formatDate": [formatDate(user.lastSeen)]
      }}
    />
  </div>;
}
`.trim();

      const result = runMutation(input);
      expect(normalizeCode(result)).toBe(normalizeCode(expected));
    });
  });

  describe("expressions", () => {
    it("should extract simple expressions", () => {
      const input = `
function Component() {
  return <div>
    <p data-jsx-scope="0/body/0/argument/1">Result: {count + 1}</p>
  </div>;
}
`.trim();

      const expected = `
import { LingoComponent } from "lingo.dev/react/client";
function Component() {
  return <div>
    <LingoComponent
      data-jsx-scope="0/body/0/argument/1"
      $as="p"
      $fileKey="test"
      $entryKey="0/body/0/argument/1"
      $expressions={[
        count + 1
      ]}
    />
  </div>;
}
`.trim();

      const result = runMutation(input);
      expect(normalizeCode(result)).toBe(normalizeCode(expected));
    });

    it("should extract multiple expressions", () => {
      const input = `
function Component() {
  return <div>
    <p data-jsx-scope="0/body/0/argument/1">First: {count * 2}, Second: {value > 0}</p>
  </div>;
}
`.trim();

      const expected = `
import { LingoComponent } from "lingo.dev/react/client";
function Component() {
  return <div>
    <LingoComponent
      data-jsx-scope="0/body/0/argument/1"
      $as="p"
      $fileKey="test"
      $entryKey="0/body/0/argument/1"
      $expressions={[
        count * 2,
        value > 0
      ]}
    />
  </div>;
}
`.trim();

      const result = runMutation(input);
      expect(normalizeCode(result)).toBe(normalizeCode(expected));
    });

    it("should handle mixed variables, functions and expressions", () => {
      const input = `
function Component() {
  return <div>
    <p data-jsx-scope="0/body/0/argument/1">
      {count + 1} items by {user.name}, processed by {getName()}}
    </p>
  </div>;
}
`.trim();

      const expected = `
import { LingoComponent } from "lingo.dev/react/client";
function Component() {
  return <div>
    <LingoComponent
      data-jsx-scope="0/body/0/argument/1"
      $as="p"
      $fileKey="test"
      $entryKey="0/body/0/argument/1"
      $variables={{
        "user.name": user.name
      }}
      $functions={{
        "getName": [getName()],
      }}
      $expressions={[
        count + 1
      ]}
    />
  </div>;
}
`.trim();

      const result = runMutation(input);
      expect(normalizeCode(result)).toBe(normalizeCode(expected));
    });

    it("should handle expressions in nested elements", () => {
      const input = `
function Component() {
  return <div>
    <div data-jsx-scope="0/body/0/argument/1">
      <p>Count: {items.length + offset}</p>
      <span>Active: {items.filter(i => i.active).length > 0}</span>
    </div>
  </div>;
}
`.trim();

      const expected = `
import { LingoComponent } from "lingo.dev/react/client";
function Component() {
  return <div>
    <LingoComponent
      data-jsx-scope="0/body/0/argument/1"
      $as="div"
      $fileKey="test"
      $entryKey="0/body/0/argument/1"
      $elements={[
        ({ children }) => <p>{children}</p>,
        ({ children }) => <span>{children}</span>
      ]}
      $expressions={[
        items.length + offset,
        items.filter(i => i.active).length > 0
      ]}
    />
  </div>;
}
`.trim();

      const result = runMutation(input);
      expect(normalizeCode(result)).toBe(normalizeCode(expected));
    });
  });
});

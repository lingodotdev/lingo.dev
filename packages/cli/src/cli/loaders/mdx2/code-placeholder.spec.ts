import { describe, it, expect } from "vitest";
import createMdxCodePlaceholderLoader from "./code-placeholder";
import dedent from "dedent";
import { md5 } from "../../utils/md5";

const PLACEHOLDER_REGEX = /---CODE_PLACEHOLDER_[0-9a-f]+---/g;

const sampleContent = dedent`
Paragraph with some code:

\`\`\`js
console.log("foo");
\`\`\`
`;

describe("MDX Code Placeholder Loader", () => {
  const loader = createMdxCodePlaceholderLoader();
  loader.setDefaultLocale("en");

  it("should replace fenced code with placeholder on pull", async () => {
    const result = await loader.pull("en", sampleContent);
    const hash = md5('```js\nconsole.log("foo");\n```');
    const expected = `Paragraph with some code:\n\n---CODE_PLACEHOLDER_${hash}---`;
    expect(result.trim()).toBe(expected);
  });

  it("should restore fenced code from placeholder on push", async () => {
    const pulled = await loader.pull("en", sampleContent);
    const translated = pulled.replace("Paragraph", "Párrafo");
    const output = await loader.push("es", translated);
    const expected = dedent`
      Párrafo with some code:

      \`\`\`js
      console.log("foo");
      \`\`\`
    `;
    expect(output.trim()).toBe(expected.trim());
  });

  describe("round-trip scenarios", () => {
    it("round-trips a fenced block with language tag", async () => {
      const md = dedent`
        Example:

        \`\`\`js
        console.log()
        \`\`\`
      `;
      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(md);
    });

    it("round-trips a fenced block without language tag", async () => {
      const md = dedent`
        Intro:

        \`\`\`
        generic code
        \`\`\`
      `;
      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(md);
    });

    it("round-trips a meta-tagged fenced block", async () => {
      const md = dedent`
        Meta:

        \`\`\`js {1,2} title="Sample"
        line1
        line2
        \`\`\`
      `;
      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(md);
    });

    it("round-trips a fenced block inside a blockquote", async () => {
      const md = dedent`
        > Quote start
        > \`\`\`ts
        > let x = 42;
        > \`\`\`
        > Quote end
      `;
      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(md);
    });

    it("round-trips multiple separated fenced blocks", async () => {
      const md = dedent`
        A:

        \`\`\`js
        1
        \`\`\`

        B:

        \`\`\`js
        2
        \`\`\`
      `;
      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(md);
    });

    it("round-trips adjacent fenced blocks", async () => {
      const md = dedent`
        \`\`\`
        a()
        \`\`\`
        \`\`\`
        b()
        \`\`\`
      `;
      const expected = dedent`
        \`\`\`
        a()
        \`\`\`

        \`\`\`
        b()
        \`\`\`
      `;
      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(expected);
    });

    it("round-trips an indented fenced block", async () => {
      const md = dedent`
        Outer:

        \`\`\`py
        pass
        \`\`\`
      `;
      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(md);
    });

    it("round-trips a fenced block after a heading", async () => {
      const md = dedent`
        # Title

        \`\`\`bash
        echo hi
        \`\`\`
      `;
      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(md);
    });

    it("round-trips a fenced block inside a list item", async () => {
      const md = `
- item:

  \`\`\`js
  io()
  \`\`\`
      `.trim();
      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(md);
    });

    it("round-trips a fenced block inside JSX component", async () => {
      const md = dedent`
        <Component>

        \`\`\`js
        x
        \`\`\`

        </Component>
      `;
      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(md);
    });

    it("round-trips a fenced block inside JSX component - adds new lines", async () => {
      const md = dedent`
        <Component>
        \`\`\`js
        x
        \`\`\`
        </Component>
      `;
      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(
        dedent`
        <Component>

        \`\`\`js
        x
        \`\`\`
        
        </Component>
      `,
      );
    });

    it("round-trips a large JSON fenced block", async () => {
      const md = dedent`
        \`\`\`shell
        { "key": [1,2,3] }
        \`\`\`
      `;
      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(md);
    });

    it("handles identical code snippets correctly", async () => {
      const md = dedent`
        First paragraph:

        \`\`\`shell
        echo "hello world"
        \`\`\`

        Second paragraph:
        \`\`\`shell
        echo "hello world"
        \`\`\`
      `;
      const pulled = await loader.pull("en", md);
      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(
        dedent`
        First paragraph:

        \`\`\`shell
        echo "hello world"
        \`\`\`

        Second paragraph:

        \`\`\`shell
        echo "hello world"
        \`\`\`
      `,
      );
    });

    it("leaves incomplete fences untouched", async () => {
      const md = "```js\nno close";
      const pulled = await loader.pull("en", md);
      expect(pulled).toBe(md);

      const pushed = await loader.push("es", pulled);
      expect(pushed).toBe(md);
    });
  });
});

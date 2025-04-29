import { describe, it, expect } from "vitest";
import createMdxCodePlaceholderLoader from "./code-placeholder";
import dedent from "dedent";

// Helper regex to capture placeholder tokens
const PLACEHOLDER_REGEX = /---CODE_PLACEHOLDER_[0-9a-f]+---/g;

// Test scenarios covering the different combinations we want to validate
// Each scenario defines the test description, the MDX sample and how many
// distinct code-fences it contains.
const scenarios: { name: string; content: string; count: number }[] = [
  {
    name: "single fenced block with language tag",
    content: dedent`
      Paragraph with some code:

      \`\`\`js
      console.log("foo");
      \`\`\`
    `,
    count: 1,
  },
  {
    name: "single fenced block without language tag",
    content: dedent`
      Some introductory text.

      \`\`\`
      generic code
      \`\`\`
    `,
    count: 1,
  },
  {
    name: "block with language + meta parameters (highlight lines / title)",
    content: dedent`
      Demo with meta parameters:

      \`\`\`js {1,2} title="Sample"
      console.log("line 1");
      console.log("line 2");
      \`\`\`
    `,
    count: 1,
  },
  {
    name: "fence starting immediately after previous text (no preceding newline)",
    content: dedent`Paragraph immediately before.\`\`\`js
console.log("adjacent");
\`\`\`
Paragraph immediately after.`,
    count: 1,
  },
  {
    name: "fenced block inside a block-quote (> prefix on opening line)",
    content: dedent`
      > Quoted section starts
      >
      > \`\`\`ts
      let x = 42;
      \`\`\`
      > End quote
    `,
    count: 1,
  },
  {
    name: "multiple fenced blocks separated by blank lines",
    content: dedent`
      First example:

      \`\`\`js
      console.log("first");
      \`\`\`

      Second example:

      \`\`\`
      plain code fence
      \`\`\`
    `,
    count: 2,
  },
  {
    name: "multiple adjacent fenced blocks (no blank lines)",
    content: dedent`
      \`\`\`js
      console.log("block 1");
      \`\`\`\n\`\`\`js
      console.log("block 2");
      \`\`\`
    `,
    count: 2,
  },
  {
    name: "indented fenced block (leading spaces)",
    content: dedent`
      Example with indentation:

         \`\`\`js
         console.log("indented");
         \`\`\`
    `,
    count: 1,
  },
  {
    name: "code block immediately after heading (no blank line)",
    content: dedent`## Heading\n\n\`\`\`js\nconsole.log("heading");\n\`\`\``,
    count: 1,
  },
  {
    name: "code block inside a list item (indented under bullet)",
    content: dedent`
      - List item intro:

        \`\`\`python
        print("bullet")
        \`\`\`
    `,
    count: 1,
  },
  {
    name: "code block wrapped inside JSX component",
    content: dedent`
      <Wrapper>
      \n\n\`\`\`js
      console.log("inside component");
      \`\`\`
      </Wrapper>
    `,
    count: 1,
  },
  {
    name: "code block with jsx component wrapping the fence markers",
    content: dedent`
      <Component>

      \`\`\`js
      console.log("jsx wrapped fence");
      \`\`\`

      </Component>
    `,
    count: 1,
  },
];

describe("mdx code placeholder loader – extensive combinations", () => {
  scenarios.forEach(({ name, content, count }) => {
    it(`${name} – placeholder substitution round-trip`, async () => {
      const loader = createMdxCodePlaceholderLoader();
      loader.setDefaultLocale("en");

      // Pull phase: code blocks ⇒ placeholders
      const pulled = await loader.pull("en", content);

      const placeholders = pulled.match(PLACEHOLDER_REGEX) || [];
      expect(placeholders.length).toBe(count);
      // The pulled content should no longer contain any back-tick fences
      expect(pulled).not.toMatch(/```/);

      // Push phase: placeholders ⇒ original code blocks
      const pushed = await loader.push("es", pulled);

      // Result must contain the original fences back
      expect(pushed).toMatch(/```/);
      // And placeholders should have disappeared
      expect(pushed).not.toMatch(PLACEHOLDER_REGEX);
    });
  });
});

import { describe, it, expect } from "vitest";
import createMdxCodePlaceholderLoader from "./code-placeholder";
import dedent from "dedent";
import { md5 } from "../../utils/md5";

const sampleMdxContent = dedent`
Paragraph with some code:

\`\`\`js
console.log("foo");
\`\`\`
`;

describe("mdx code placeholder loader", () => {
  it("should replace code segments with placeholders on pull", async () => {
    const loader = createMdxCodePlaceholderLoader();
    loader.setDefaultLocale("en");

    const result = await loader.pull("en", sampleMdxContent);
    // expect two placeholders
    const placeholder = `---CODE_PLACEHOLDER_${md5('```js\nconsole.log("foo");\n```')}---`;

    expect(result).toEqual(
      dedent`
      Paragraph with some code:

      ${placeholder}
      `,
    );
  });

  it("should restore original code segments on push", async () => {
    const loader = createMdxCodePlaceholderLoader();
    loader.setDefaultLocale("en");

    const pulled = await loader.pull("en", sampleMdxContent);
    const modified = pulled.replace("Paragraph", "Párrafo");

    const output = await loader.push("es", modified);

    expect(output).toEqual(
      dedent`
      Párrafo with some code:

      \`\`\`js
      console.log("foo");
      \`\`\`
      `,
    );
  });
});

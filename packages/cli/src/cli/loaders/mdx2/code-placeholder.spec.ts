import { describe, it, expect } from "vitest";
import createMdxCodePlaceholderLoader from "./code-placeholder";
import dedent from "dedent";
import { md5 } from "../../utils/md5";

const sampleMdxContent = dedent`
Paragraph with some \`inline\` code.

\`\`\`js
console.log("foo");
\`\`\`
`;

describe("mdx code placeholder loader", () => {
  it("should replace code segments with placeholders on pull", async () => {
    const loader = createMdxCodePlaceholderLoader();
    loader.setDefaultLocale("en");

    const result = await loader.pull("en", {
      frontmatter: {},
      content: sampleMdxContent,
    });

    // expect two placeholders
    const placeholderKeys = Object.keys(result.codePlaceholders);
    const placeholder1 = `__PLACEHOLDER_${md5("inline")}__`;
    const placeholder2 = `__PLACEHOLDER_${md5('console.log("foo");')}__`;
    expect(placeholderKeys).toEqual([placeholder1, placeholder2]);

    // mapping values should equal original code snippets
    const expectedInline = "inline";
    const expectedBlock = 'console.log("foo");';
    expect(Object.values(result.codePlaceholders).sort()).toEqual(
      [expectedBlock, expectedInline].sort(),
    );

    // content should have placeholders substituted exactly
    const expectedContent = `Paragraph with some \`${placeholder1}\` code.\n\n\`\`\`js\n${placeholder2}\n\`\`\``;
    expect(result.content.trim()).toBe(expectedContent.trim());
  });

  it("should restore original code segments on push", async () => {
    const loader = createMdxCodePlaceholderLoader();
    loader.setDefaultLocale("en");

    const pulled = await loader.pull("en", {
      frontmatter: {},
      content: sampleMdxContent,
    });

    // modify pulled data
    pulled.content = pulled.content.replace("Paragraph", "Párrafo");

    const output = await loader.push("es", pulled);

    const expectedOutput = {
      frontmatter: {},
      content: dedent`
      Párrafo with some \`inline\` code.

      \`\`\`js
      console.log("foo");
      \`\`\`
      `,
    };

    expect(output).toEqual(expectedOutput);
  });
});

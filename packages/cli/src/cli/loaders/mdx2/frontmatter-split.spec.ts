import { describe, it, expect } from "vitest";
import createMdxFrontmatterSplitLoader from "./frontmatter-split";
import matter from "gray-matter";

const sampleMdx = `---
title: Hello
published: true
tags:
  - foo
  - bar
---

# Heading

This is some text.`;

// Helper to derive expected content string from the original sample – this mirrors what gray-matter returns
const { content: originalContent } = matter(sampleMdx);

describe("mdx frontmatter split loader", () => {
  it("should split frontmatter and content on pull", async () => {
    const loader = createMdxFrontmatterSplitLoader();
    loader.setDefaultLocale("en");

    const result = await loader.pull("en", sampleMdx);

    expect(result).toEqual({
      frontmatter: {
        title: "Hello",
        published: true,
        tags: ["foo", "bar"],
      },
      content: originalContent,
    });
  });

  it("should merge frontmatter and content on push", async () => {
    const loader = createMdxFrontmatterSplitLoader();
    loader.setDefaultLocale("en");

    const pulled = await loader.pull("en", sampleMdx);
    // modify the data
    pulled.frontmatter.title = "Hola";
    pulled.content = pulled.content.replace("# Heading", "# Título");

    const output = await loader.push("es", pulled);

    const expectedOutput = `
---
title: Hola
published: true
tags:
  - foo
  - bar
---

# Título

This is some text.
`.trim();

    expect(output).toBe(expectedOutput);
  });
});

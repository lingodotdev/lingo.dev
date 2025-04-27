import { describe, it, expect } from "vitest";
import createLocalizableMdxDocumentLoader from "./localizable-document";

describe("mdx localizable document loader", () => {
  it("should map to meta/content on pull and reconstruct on push", async () => {
    const loader = createLocalizableMdxDocumentLoader();
    loader.setDefaultLocale("en");

    const headingSection = "## Heading One\nSome paragraph.";
    const pulled = await loader.pull("en", {
      frontmatter: {
        title: "Sample",
      },
      sections: {
        "0": headingSection,
      },
    });

    // Validate structure
    expect(pulled).toHaveProperty("meta");
    expect(pulled).toHaveProperty("content");

    // Expect meta matches frontmatter
    expect(pulled.meta.title).toBe("Sample");

    // Modify
    pulled.meta.title = "Hola";

    // Try push
    const pushed = await loader.push("es", pulled);

    // After push we should get original MDX string reflect changes
    expect(pushed.frontmatter.title).toBe("Hola");
    // sections should persist
    expect(pushed.sections["0"]).toBe(headingSection);
  });
});

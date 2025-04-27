// #region Imports
import { describe, it, expect } from "vitest";
import createMdxSectionSplitLoader from "./section-split";
import dedent from "dedent";
// #endregion

describe("mdx section split loader", () => {
  const sampleMdxContent = dedent`
  ## Heading One
  Some paragraph text.
  
  <CustomComponent foo="bar" />

  <AnotherComponent className="some-class">
  <AnotherInnerComponent>
  Some content inside another component.
  </AnotherInnerComponent>
  </AnotherComponent>
  
  ### Sub Heading
  More text here.
  `;

  it("should split content into section map keyed by index", async () => {
    const loader = createMdxSectionSplitLoader();
    loader.setDefaultLocale("en");

    const result = await loader.pull("en", {
      frontmatter: {},
      codePlaceholders: {},
      content: sampleMdxContent,
    });

    // Build expected segments
    const seg0 = "## Heading One\nSome paragraph text.";
    const seg1 = '<CustomComponent foo="bar" />';
    const seg2 = '<AnotherComponent className="some-class">';
    const seg3 = "<AnotherInnerComponent>";
    const seg4 = "Some content inside another component.";
    const seg5 = "</AnotherInnerComponent>";
    const seg6 = "</AnotherComponent>";
    const seg7 = "### Sub Heading\nMore text here.";

    const expected = {
      "0": seg0,
      "1": seg1,
      "2": seg2,
      "3": seg3,
      "4": seg4,
      "5": seg5,
      "6": seg6,
      "7": seg7,
    };

    expect(result.sections).toEqual(expected);
  });

  it("should merge sections back into MDX content on push", async () => {
    const loader = createMdxSectionSplitLoader();
    loader.setDefaultLocale("en");

    // First pull to split the sample content into sections
    const pulled = await loader.pull("en", {
      frontmatter: {},
      codePlaceholders: {},
      content: sampleMdxContent,
    });

    // Push to merge the sections back into MDX
    const pushed = await loader.push("en", {
      ...pulled,
      sections: {
        ...pulled.sections,
        "4": "Hello world!",
      },
    });

    const expectedContent = dedent`
    ## Heading One
    Some paragraph text.

    <CustomComponent foo="bar" />
    <AnotherComponent className="some-class">
    <AnotherInnerComponent>
    Hello world!
    </AnotherInnerComponent>
    </AnotherComponent>

    ### Sub Heading
    More text here.
    `;

    expect(pushed.content).toBe(expectedContent);
  });
});

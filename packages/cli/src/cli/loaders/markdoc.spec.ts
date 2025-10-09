import { describe, it, expect } from "vitest";
import createMarkdocLoader from "./markdoc";

describe("markdoc loader", () => {
  describe("block-level tag", () => {
    it("should extract text content from block-level tag", async () => {
      const loader = createMarkdocLoader();
      loader.setDefaultLocale("en");

      const input = `{% foo %}
This is content inside of a block-level tag
{% /foo %}`;

      const output = await loader.pull("en", input);

      // Should extract the text content with semantic keys
      const contents = Object.values(output);

      expect(contents).toContain("This is content inside of a block-level tag");
    });

    it("should preserve tag structure on push", async () => {
      const loader = createMarkdocLoader();
      loader.setDefaultLocale("en");

      const input = `{% foo %}
This is content inside of a block-level tag
{% /foo %}`;

      const pulled = await loader.pull("en", input);
      const pushed = await loader.push("en", pulled);

      expect(pushed.trim()).toBe(input.trim());
    });

    it("should apply translations on push", async () => {
      const loader = createMarkdocLoader();
      loader.setDefaultLocale("en");

      const input = `{% example %}
This paragraph is nested within a Markdoc tag.
{% /example %}`;

      const pulled = await loader.pull("en", input);

      // Modify the content using semantic keys
      const translated = { ...pulled };
      const contentKey = Object.keys(translated).find(
        (k) =>
          translated[k] === "This paragraph is nested within a Markdoc tag.",
      );
      if (contentKey) {
        translated[contentKey] =
          "Este párrafo está anidado dentro de una etiqueta Markdoc.";
      }

      const pushed = await loader.push("es", translated);

      expect(pushed).toContain(
        "Este párrafo está anidado dentro de una etiqueta Markdoc.",
      );
      expect(pushed).toContain("{% example %}");
      expect(pushed).toContain("{% /example %}");
    });
  });

  describe("self-closing tag", () => {
    it("should handle self-closing tag with no content", async () => {
      const loader = createMarkdocLoader();
      loader.setDefaultLocale("en");

      const input = `{% example /%}`;

      const output = await loader.pull("en", input);

      // Should have the tag but no text content
      expect(output).toBeDefined();
    });

    it("should preserve self-closing tag on push", async () => {
      const loader = createMarkdocLoader();
      loader.setDefaultLocale("en");

      const input = `{% example /%}`;

      const pulled = await loader.pull("en", input);
      const pushed = await loader.push("en", pulled);

      expect(pushed.trim()).toBe(input.trim());
    });
  });

  describe("inline tag", () => {
    it("should extract text from inline tag", async () => {
      const loader = createMarkdocLoader();
      loader.setDefaultLocale("en");

      const input = `This is a paragraph {% foo %}that contains a tag{% /foo %}`;

      const output = await loader.pull("en", input);

      // Should extract both text segments
      const contents = Object.values(output);

      expect(contents).toContain("This is a paragraph ");
      expect(contents).toContain("that contains a tag");
    });

    it("should preserve inline tag structure on push", async () => {
      const loader = createMarkdocLoader();
      loader.setDefaultLocale("en");

      const input = `This is a paragraph {% foo %}that contains a tag{% /foo %}`;

      const pulled = await loader.pull("en", input);
      const pushed = await loader.push("en", pulled);

      expect(pushed.trim()).toBe(input.trim());
    });

    it("should apply translations to inline tag content", async () => {
      const loader = createMarkdocLoader();
      loader.setDefaultLocale("en");

      const input = `This is a paragraph {% foo %}that contains a tag{% /foo %}`;

      const pulled = await loader.pull("en", input);

      // Translate both text segments
      const translated = { ...pulled };
      Object.keys(translated).forEach((key) => {
        if (translated[key] === "This is a paragraph ") {
          translated[key] = "Este es un párrafo ";
        } else if (translated[key] === "that contains a tag") {
          translated[key] = "que contiene una etiqueta";
        }
      });

      const pushed = await loader.push("es", translated);

      expect(pushed).toContain("Este es un párrafo");
      expect(pushed).toContain("que contiene una etiqueta");
      expect(pushed).toContain("{% foo %}");
      expect(pushed).toContain("{% /foo %}");
    });
  });

  describe("inline tag only content", () => {
    it("should handle inline tag as sole paragraph content", async () => {
      const loader = createMarkdocLoader();
      loader.setDefaultLocale("en");

      const input = `{% foo %}This is content inside of an inline tag{% /foo %}`;

      const output = await loader.pull("en", input);

      const contents = Object.values(output);

      expect(contents).toContain("This is content inside of an inline tag");
    });

    it("should preserve inline-only tag structure on push", async () => {
      const loader = createMarkdocLoader();
      loader.setDefaultLocale("en");

      const input = `{% foo %}This is content inside of an inline tag{% /foo %}`;

      const pulled = await loader.pull("en", input);
      const pushed = await loader.push("en", pulled);

      expect(pushed.trim()).toBe(input.trim());
    });
  });

  describe("mixed content", () => {
    it("should handle document with multiple tags and text", async () => {
      const loader = createMarkdocLoader();
      loader.setDefaultLocale("en");

      const input = `# Heading

This is a paragraph.

{% note %}
Important information here.
{% /note %}

Another paragraph with {% inline %}inline content{% /inline %}.

{% self-closing /%}`;

      const output = await loader.pull("en", input);
      const pushed = await loader.push("en", output);

      // Verify structure is preserved
      expect(pushed).toContain("# Heading");
      expect(pushed).toContain("{% note %}");
      expect(pushed).toContain("{% /note %}");
      expect(pushed).toContain("{% inline %}");
      expect(pushed).toContain("{% /inline %}");
      expect(pushed).toContain("{% self-closing /%}");
    });
  });

  describe("nested tags", () => {
    it("should handle nested tags", async () => {
      const loader = createMarkdocLoader();
      loader.setDefaultLocale("en");

      const input = `{% outer %}
Outer content
{% inner %}
Inner content
{% /inner %}
More outer content
{% /outer %}`;

      const output = await loader.pull("en", input);
      const pushed = await loader.push("en", output);

      expect(pushed).toContain("{% outer %}");
      expect(pushed).toContain("{% inner %}");
      expect(pushed).toContain("{% /inner %}");
      expect(pushed).toContain("{% /outer %}");
    });
  });

  describe("interpolation", () => {
    it("should preserve variable interpolation", async () => {
      const loader = createMarkdocLoader();
      loader.setDefaultLocale("en");

      const input = `Hello {% $username %}`;

      const output = await loader.pull("en", input);
      const pushed = await loader.push("en", output);

      expect(pushed.trim()).toBe(input.trim());
    });

    it("should preserve function interpolation", async () => {
      const loader = createMarkdocLoader();
      loader.setDefaultLocale("en");

      const input = `Result: {% calculateValue() %}`;

      const output = await loader.pull("en", input);
      const pushed = await loader.push("en", output);

      expect(pushed.trim()).toBe(input.trim());
    });

    it("should preserve interpolation in middle of text", async () => {
      const loader = createMarkdocLoader();
      loader.setDefaultLocale("en");

      const input = `This is {% $var %} some text.`;

      const output = await loader.pull("en", input);
      const pushed = await loader.push("en", output);

      expect(pushed.trim()).toBe(input.trim());
    });

    it("should translate text around interpolation", async () => {
      const loader = createMarkdocLoader();
      loader.setDefaultLocale("en");

      const input = `Hello {% $username %}, welcome!`;

      const output = await loader.pull("en", input);

      // Should extract text segments but not interpolation
      const textContents = Object.values(output).filter(
        (v) => typeof v === "string",
      );

      expect(textContents).toContain("Hello ");
      expect(textContents).toContain(", welcome!");

      // Translate the text segments
      const translated = { ...output };
      Object.keys(translated).forEach((key) => {
        if (translated[key] === "Hello ") {
          translated[key] = "Hola ";
        } else if (translated[key] === ", welcome!") {
          translated[key] = ", ¡bienvenido!";
        }
      });

      const pushed = await loader.push("es", translated);

      expect(pushed).toContain("Hola");
      expect(pushed).toContain("¡bienvenido!");
      expect(pushed).toContain("{% $username %}");
    });

    it("should handle interpolation in tags", async () => {
      const loader = createMarkdocLoader();
      loader.setDefaultLocale("en");

      const input = `{% callout %}
The value is {% $value %} today.
{% /callout %}`;

      const output = await loader.pull("en", input);
      const pushed = await loader.push("en", output);

      expect(pushed).toContain("{% callout %}");
      expect(pushed).toContain("{% $value %}");
      expect(pushed).toContain("{% /callout %}");
    });
  });

  describe("annotations", () => {
    it("should preserve annotations with shorthand class attribute", async () => {
      const loader = createMarkdocLoader();
      loader.setDefaultLocale("en");

      const input = `# Heading {% .example %}`;

      const output = await loader.pull("en", input);
      const pushed = await loader.push("en", output);

      expect(pushed).toContain("# Heading");
      expect(pushed).toContain("{% .example %}");
    });

    it("should preserve annotations with shorthand id attribute", async () => {
      const loader = createMarkdocLoader();
      loader.setDefaultLocale("en");

      const input = `# Heading {% #main-title %}`;

      const output = await loader.pull("en", input);
      const pushed = await loader.push("en", output);

      expect(pushed).toContain("# Heading");
      expect(pushed).toContain("{% #main-title %}");
    });

    it("should preserve annotations with multiple shorthand attributes", async () => {
      const loader = createMarkdocLoader();
      loader.setDefaultLocale("en");

      const input = `# Heading {% #foo .bar .baz %}`;

      const output = await loader.pull("en", input);
      const pushed = await loader.push("en", output);

      expect(pushed).toContain("# Heading");
      expect(pushed).toContain("{% #foo .bar .baz %}");
    });

    it("should translate heading text with annotations", async () => {
      const loader = createMarkdocLoader();
      loader.setDefaultLocale("en");

      const input = `# Welcome {% .hero-title %}`;

      const output = await loader.pull("en", input);

      // Find and translate the heading text (note: has trailing space)
      const translated = { ...output };
      Object.keys(translated).forEach((key) => {
        if (translated[key] === "Welcome ") {
          translated[key] = "Bienvenido ";
        }
      });

      const pushed = await loader.push("es", translated);

      expect(pushed).toContain("Bienvenido");
      expect(pushed).toContain("{% .hero-title %}");
    });
  });

  describe("tag attributes", () => {
    it("should preserve tags with full attributes", async () => {
      const loader = createMarkdocLoader();
      loader.setDefaultLocale("en");

      const input = `{% callout type="note" %}
This is important information.
{% /callout %}`;

      const output = await loader.pull("en", input);
      const pushed = await loader.push("en", output);

      expect(pushed).toContain('{% callout type="note" %}');
      expect(pushed).toContain("{% /callout %}");
    });

    it("should preserve tags with multiple attributes", async () => {
      const loader = createMarkdocLoader();
      loader.setDefaultLocale("en");

      const input = `{% image src="logo.png" alt="Company Logo" width="200" /%}`;

      const output = await loader.pull("en", input);
      const pushed = await loader.push("en", output);

      expect(pushed.trim()).toBe(input.trim());
    });

    it("should preserve tags with array attributes", async () => {
      const loader = createMarkdocLoader();
      loader.setDefaultLocale("en");

      const input = `{% chart data=[1, 2, 3] /%}`;

      const output = await loader.pull("en", input);
      const pushed = await loader.push("en", output);

      expect(pushed.trim()).toBe(input.trim());
    });

    it("should translate content in tags with attributes", async () => {
      const loader = createMarkdocLoader();
      loader.setDefaultLocale("en");

      const input = `{% callout type="warning" %}
Please read carefully.
{% /callout %}`;

      const output = await loader.pull("en", input);

      // Translate the content
      const translated = { ...output };
      Object.keys(translated).forEach((key) => {
        if (translated[key] === "Please read carefully.") {
          translated[key] = "Por favor lea con atención.";
        }
      });

      const pushed = await loader.push("es", translated);

      expect(pushed).toContain("Por favor lea con atención.");
      expect(pushed).toContain('{% callout type="warning" %}');
      expect(pushed).toContain("{% /callout %}");
    });
  });

  describe("primary attributes", () => {
    it("should preserve tags with primary attribute", async () => {
      const loader = createMarkdocLoader();
      loader.setDefaultLocale("en");

      const input = `{% if $showContent %}
Content is visible.
{% /if %}`;

      const output = await loader.pull("en", input);
      const pushed = await loader.push("en", output);

      expect(pushed).toContain("{% if $showContent %}");
      expect(pushed).toContain("{% /if %}");
    });

    it("should translate content in tags with primary attribute", async () => {
      const loader = createMarkdocLoader();
      loader.setDefaultLocale("en");

      const input = `{% if $showContent %}
Content is visible.
{% /if %}`;

      const output = await loader.pull("en", input);

      // Translate the content
      const translated = { ...output };
      Object.keys(translated).forEach((key) => {
        if (translated[key] === "Content is visible.") {
          translated[key] = "El contenido es visible.";
        }
      });

      const pushed = await loader.push("es", translated);

      expect(pushed).toContain("El contenido es visible.");
      expect(pushed).toContain("{% if $showContent %}");
    });
  });

  describe("frontmatter", () => {
    it("should extract frontmatter attributes", async () => {
      const loader = createMarkdocLoader();
      loader.setDefaultLocale("en");

      const input = `---
title: My Document
description: A sample document
author: John Doe
---

# Heading

Content here.`;

      const output = await loader.pull("en", input);

      expect(output["fm-attr-title"]).toBe("My Document");
      expect(output["fm-attr-description"]).toBe("A sample document");
      expect(output["fm-attr-author"]).toBe("John Doe");
    });

    it("should preserve frontmatter on push", async () => {
      const loader = createMarkdocLoader();
      loader.setDefaultLocale("en");

      const input = `---
title: My Document
description: A sample document
---

# Heading

Content here.`;

      const pulled = await loader.pull("en", input);
      const pushed = await loader.push("en", pulled);

      expect(pushed).toContain("title: My Document");
      expect(pushed).toContain("description: A sample document");
      expect(pushed).toContain("# Heading");
      expect(pushed).toContain("Content here.");
    });

    it("should translate frontmatter attributes", async () => {
      const loader = createMarkdocLoader();
      loader.setDefaultLocale("en");

      const input = `---
title: Welcome
description: This is a guide
---

# Content

Some text.`;

      const pulled = await loader.pull("en", input);

      // Translate frontmatter
      const translated = { ...pulled };
      translated["fm-attr-title"] = "Bienvenido";
      translated["fm-attr-description"] = "Esta es una guía";

      const pushed = await loader.push("es", translated);

      expect(pushed).toContain("title: Bienvenido");
      expect(pushed).toContain("description: Esta es una guía");
    });

    it("should handle documents without frontmatter", async () => {
      const loader = createMarkdocLoader();
      loader.setDefaultLocale("en");

      const input = `# Heading

Content without frontmatter.`;

      const output = await loader.pull("en", input);
      const pushed = await loader.push("en", output);

      expect(pushed).not.toContain("---");
      expect(pushed).toContain("# Heading");
      expect(pushed).toContain("Content without frontmatter.");
    });
  });
});

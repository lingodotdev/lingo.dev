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

      // Should extract the text content
      const contentKeys = Object.keys(output).filter((k) =>
        k.includes("attributes/content")
      );
      const contents = contentKeys.map((k) => output[k]);

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

      // Modify the content
      const translated = { ...pulled };
      const contentKey = Object.keys(translated).find(
        (k) => k.includes("attributes/content")
      );
      if (contentKey) {
        translated[contentKey] = "Este párrafo está anidado dentro de una etiqueta Markdoc.";
      }

      const pushed = await loader.push("es", translated);

      expect(pushed).toContain("Este párrafo está anidado dentro de una etiqueta Markdoc.");
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
      const contentKeys = Object.keys(output).filter((k) =>
        k.includes("attributes/content")
      );
      const contents = contentKeys.map((k) => output[k]);

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
        if (key.includes("attributes/content")) {
          if (translated[key] === "This is a paragraph ") {
            translated[key] = "Este es un párrafo ";
          } else if (translated[key] === "that contains a tag") {
            translated[key] = "que contiene una etiqueta";
          }
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

      const contentKeys = Object.keys(output).filter((k) =>
        k.includes("attributes/content")
      );
      const contents = contentKeys.map((k) => output[k]);

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
      const contentKeys = Object.keys(output).filter((k) =>
        k.includes("attributes/content")
      );
      const textContents = contentKeys
        .map((k) => output[k])
        .filter((v) => typeof v === "string");

      expect(textContents).toContain("Hello ");
      expect(textContents).toContain(", welcome!");

      // Translate the text segments
      const translated = { ...output };
      Object.keys(translated).forEach((key) => {
        if (key.includes("attributes/content")) {
          if (translated[key] === "Hello ") {
            translated[key] = "Hola ";
          } else if (translated[key] === ", welcome!") {
            translated[key] = ", ¡bienvenido!";
          }
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
});
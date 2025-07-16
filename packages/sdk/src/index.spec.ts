import { describe, it, expect, vi } from "vitest";
import { LingoDotDevEngine } from "./index";

describe("ReplexicaEngine", () => {
  it("should pass", () => {
    expect(1).toBe(1);
  });

  describe("localizeHtml", () => {
    it("should correctly extract, localize, and reconstruct HTML content", async () => {
      // Setup test HTML with various edge cases
      const inputHtml = `
<!DOCTYPE html>
<html>
  <head>
    <title>Test Page</title>
    <meta name="description" content="Page description">
  </head>
  <body>
    standalone text
    <div>
      <h1>Hello World</h1>
      <p>
        This is a paragraph with
        <a href="/test" title="Link title">a link</a>
        and an
        <img src="/test.jpg" alt="Test image">
        and some <b>bold <i>and italic</i></b> text.
      </p>
      <script>
        const doNotTranslate = "this text should be ignored";
      </script>
      <input type="text" placeholder="Enter text">
    </div>
  </body>
</html>`.trim();

      // Mock the internal localization method
      const engine = new LingoDotDevEngine({ apiKey: "test" });
      const mockLocalizeRaw = vi.spyOn(engine as any, "_localizeRaw");
      mockLocalizeRaw.mockImplementation(async (content: any) => {
        // Simulate translation by adding 'ES:' prefix to all strings
        return Object.fromEntries(
          Object.entries(content).map(([key, value]) => [key, `ES:${value}`]),
        );
      });

      // Execute the localization
      const result = await engine.localizeHtml(inputHtml, {
        sourceLocale: "en",
        targetLocale: "es",
      });

      // Verify the extracted content passed to _localizeRaw
      expect(mockLocalizeRaw).toHaveBeenCalledWith(
        {
          "head/0/0": "Test Page",
          "head/1#content": "Page description",
          "body/0": "standalone text",
          "body/1/0/0": "Hello World",
          "body/1/1/0": "This is a paragraph with",
          "body/1/1/1#title": "Link title",
          "body/1/1/1/0": "a link",
          "body/1/1/2": "and an",
          "body/1/1/3#alt": "Test image",
          "body/1/1/4": "and some",
          "body/1/1/5/0": "bold",
          "body/1/1/5/1/0": "and italic",
          "body/1/1/6": "text.",
          "body/1/3#placeholder": "Enter text",
        },
        {
          sourceLocale: "en",
          targetLocale: "es",
        },
        undefined,
      );

      // Verify the final HTML structure
      expect(result).toContain('<html lang="es">');
      expect(result).toContain("<title>ES:Test Page</title>");
      expect(result).toContain('content="ES:Page description"');
      expect(result).toContain(">ES:standalone text<");
      expect(result).toContain("<h1>ES:Hello World</h1>");
      expect(result).toContain('title="ES:Link title"');
      expect(result).toContain('alt="ES:Test image"');
      expect(result).toContain('placeholder="ES:Enter text"');
      expect(result).toContain(
        'const doNotTranslate = "this text should be ignored"',
      );
    });
  });

  describe("localizeSimpleMap", () => {
    it("should localize a simple key-value map", async () => {
      const engine = new LingoDotDevEngine({ apiKey: "test" });
      const mockLocalizeObject = vi.spyOn(engine, "localizeObject");
      mockLocalizeObject.mockImplementation(async (obj: any) => {
        // Simulate translation by adding 'ES:' prefix to all string values
        return Object.fromEntries(
          Object.entries(obj).map(([key, value]) => [key, `ES:${value}`]),
        );
      });

      const inputMap = {
        greeting: "Hello",
        farewell: "Goodbye",
        question: "How are you?",
      };

      const result = await engine.localizeSimpleMap(inputMap, {
        sourceLocale: "en",
        targetLocale: "es",
      });

      expect(mockLocalizeObject).toHaveBeenCalledWith(inputMap, {
        sourceLocale: "en",
        targetLocale: "es",
      });

      expect(result).toEqual({
        greeting: "ES:Hello",
        farewell: "ES:Goodbye",
        question: "ES:How are you?",
      });
    });
  });

  describe("localizeStringArray", () => {
    it("should localize an array of strings and maintain order", async () => {
      const engine = new LingoDotDevEngine({ apiKey: "test" });
      const mockLocalizeObject = vi.spyOn(engine, "localizeObject");
      mockLocalizeObject.mockImplementation(async (obj: any) => {
        // Simulate translation by adding 'ES:' prefix to all string values
        return Object.fromEntries(
          Object.entries(obj).map(([key, value]) => [key, `ES:${value}`]),
        );
      });

      const inputArray = ["Hello", "Goodbye", "How are you?"];

      const result = await engine.localizeStringArray(inputArray, {
        sourceLocale: "en",
        targetLocale: "es",
      });

      // Verify the mapped object was passed to localizeObject
      expect(mockLocalizeObject).toHaveBeenCalledWith(
        {
          item_0: "Hello",
          item_1: "Goodbye",
          item_2: "How are you?",
        },
        {
          sourceLocale: "en",
          targetLocale: "es",
        },
      );

      // Verify the result maintains the original order
      expect(result).toEqual(["ES:Hello", "ES:Goodbye", "ES:How are you?"]);
      expect(result).toHaveLength(3);
    });

    it("should handle empty array", async () => {
      const engine = new LingoDotDevEngine({ apiKey: "test" });
      const mockLocalizeObject = vi.spyOn(engine, "localizeObject");
      mockLocalizeObject.mockImplementation(async () => ({}));

      const result = await engine.localizeStringArray([], {
        sourceLocale: "en",
        targetLocale: "es",
      });

      expect(mockLocalizeObject).toHaveBeenCalledWith(
        {},
        {
          sourceLocale: "en",
          targetLocale: "es",
        },
      );

      expect(result).toEqual([]);
    });
  });
});

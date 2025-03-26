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
        return Object.fromEntries(Object.entries(content).map(([key, value]) => [key, `ES:${value}`]));
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
      expect(result).toContain('const doNotTranslate = "this text should be ignored"');
    });
  });
});


describe("LingoDotDevEngine - countWordsInRecord", () => {
  const engine = new LingoDotDevEngine({ apiKey: "test" });

  it("should return 0 for falsy values and empty inputs", () => {
    expect((engine as any).countWordsInRecord(null)).toBe(0);
    expect((engine as any).countWordsInRecord(undefined)).toBe(0);
    expect((engine as any).countWordsInRecord("")).toBe(0);
    expect((engine as any).countWordsInRecord({})).toBe(0);
    expect((engine as any).countWordsInRecord([])).toBe(0);
  });

  it("should count words in a simple string", () => {
    expect((engine as any).countWordsInRecord("Hello world")).toBe(2);
    expect((engine as any).countWordsInRecord("   one two   three  ")).toBe(3);
    expect((engine as any).countWordsInRecord("\tNew\nlines  and\ttabs\r\n")).toBe(4);
  });

  it("should count words in an array of strings", () => {
    // "a" -> 1, "b c" -> 2, "d" -> 1
    expect((engine as any).countWordsInRecord(["a", "b c", "d"])).toBe(1 + 2 + 1);
  });

  it("should count words in a nested array", () => {
    // Here, the function is fully recursive:
    // "a" → 1, "b c" → 2, and nested ["d e"] → "d e" → 2 words.
    // Total = 1 + 2 + 2 = 5 words.
    expect((engine as any).countWordsInRecord(["a", "b c", ["d e"]])).toBe(5);
  });

  it("should count words in a nested object", () => {
    // Object { a: "hello", b: { c: "c d" } }:
    // "hello" → 1, and "c d" → 2 words.
    // Total = 1 + 2 = 3.
    expect((engine as any).countWordsInRecord({ a: "hello", b: { c: "c d" } })).toBe(3);
  });
  it("should perform efficiently on large payloads", () => {
    // Generate a large payload with many key-value pairs (in lakhs)
    const largePayload: Record<string, string> = {};
    const sampleText = "This is a sample text for benchmarking the countWordsInRecord function";
    // Count words in sampleText:
    // ["This", "is", "a", "sample", "text", "for", "benchmarking", "the", "countWordsInRecord", "function"]
    // That is 10 words.
    const repetitions = 100_000; // 1 lakh
    for (let i = 0; i < repetitions; i++) {
      largePayload[`key_${i}`] = sampleText;
    }
    const expectedTotalWords = repetitions * 10;

    const startTime = performance.now();
    const result = (engine as any).countWordsInRecord(largePayload);
    const endTime = performance.now();
    const elapsed = endTime - startTime;

    console.log(`Large payload processed in ${elapsed.toFixed(2)} ms`);

    expect(result).toBe(expectedTotalWords);
    // Optionally, assert that the function finishes within a reasonable time threshold:
    expect(elapsed).toBeLessThan(5000); // e.g., under 5 seconds for 1 lakh entries
});
});


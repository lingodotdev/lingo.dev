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



describe("LingoDotDevEngine Abort Handling", () => {
  describe("Abort Signal Propagation", () => {
    it("should throw an error when abort signal is triggered before localization starts", async () => {
      const engine = new LingoDotDevEngine({ apiKey: "test" });
      const abortController = new AbortController();

      // Abort immediately
      abortController.abort();

      await expect(
        engine.localizeText("Test text", {
          sourceLocale: "en",
          targetLocale: "es"
        }, undefined, abortController.signal)
      ).rejects.toThrow("Operation was aborted");
    });

    it("should throw an error when abort signal is triggered during HTML localization", async () => {
      const engine = new LingoDotDevEngine({ apiKey: "test" });
      const abortController = new AbortController();

      // Mock _localizeRaw to simulate a long-running operation
      const mockLocalizeRaw = vi.spyOn(engine as any, "_localizeRaw");
      mockLocalizeRaw.mockImplementation(async () => {
        // Simulate an asynchronous operation
        await new Promise(resolve => setTimeout(resolve, 100));
        // Abort during the operation
        abortController.abort();
        return {};
      });

      await expect(
        engine.localizeHtml("<html><body>Test</body></html>", {
          sourceLocale: "en",
          targetLocale: "es"
        }, undefined, abortController.signal)
      ).rejects.toThrow("Operation was aborted");
    });

    it("should propagate abort signal through nested method calls", async () => {
      const engine = new LingoDotDevEngine({ apiKey: "test" });
      const abortController = new AbortController();

      // Spy on internal methods to ensure abort signal is passed
      const spyLocalizeChunk = vi.spyOn(engine as any, "localizeChunk");
      const spyCheckAbortSignal = vi.spyOn(engine as any, "checkAbortSignal");

      // Abort during object localization
      abortController.abort();

      await expect(
        engine.localizeObject({ text: "Test" }, {
          sourceLocale: "en",
          targetLocale: "es"
        }, undefined, abortController.signal)
      ).rejects.toThrow("Operation was aborted");

      // Verify abort signal was checked in multiple places
      expect(spyCheckAbortSignal).toHaveBeenCalledWith(abortController.signal);
    });

    it("should handle multiple concurrent abort scenarios", async () => {
      const engine = new LingoDotDevEngine({ apiKey: "test" });

      const abortControllers = [
        new AbortController(),
        new AbortController(),
        new AbortController()
      ];

      const localizationPromises = abortControllers.map((controller, index) => {
        // Stagger abort times
        setTimeout(() => controller.abort(), index * 50);

        return engine.localizeText(`Test ${index}`, {
          sourceLocale: "en",
          targetLocale: "es"
        }, undefined, controller.signal).catch(err => err);
      });

      const results = await Promise.all(localizationPromises);

      // All promises should result in abort errors
      results.forEach(result => {
        expect(result.message).toBe("Operation was aborted");
      });
    });

    it("should allow localization when no abort signal is provided", async () => {
      const engine = new LingoDotDevEngine({ apiKey: "test" });

      // Mock _localizeRaw to return a predictable result
      const mockLocalizeRaw = vi.spyOn(engine as any, "_localizeRaw");
      mockLocalizeRaw.mockResolvedValue({ text: "Localized Text" });

      const result = await engine.localizeText("Test text", {
        sourceLocale: "en",
        targetLocale: "es"
      });

      expect(result).toBe("Localized Text");
    });
  });
});

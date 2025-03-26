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

  describe("AbortController support", () => {
    it("should abort localizeText when signal is triggered", async () => {
      const engine = new LingoDotDevEngine({ apiKey: "test" });
      const mockFetch = vi.spyOn(global, "fetch").mockImplementation(async (url, options) => {
        // Check if the request was aborted
        if (options?.signal?.aborted) {
          throw new DOMException("The operation was aborted.", "AbortError");
        }
        
        // Add a delay to simulate network request
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // After the delay, check again if aborted during the delay
        if (options?.signal?.aborted) {
          throw new DOMException("The operation was aborted.", "AbortError");
        }
        
        return new Response(JSON.stringify({ data: { text: "translated text" } }));
      });

      const controller = new AbortController();
      const signal = controller.signal;

      // Start the request first, then abort after a small delay
      const promise = engine.localizeText("Hello world", {
        sourceLocale: "en",
        targetLocale: "es"
      }, undefined, signal);
      
      // Small delay to make sure the request starts
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Now abort
      controller.abort();

      await expect(promise).rejects.toThrow("Localization was aborted");
      mockFetch.mockRestore();
    });

    it("should abort localizeHtml when signal is triggered", async () => {
      const engine = new LingoDotDevEngine({ apiKey: "test" });
      
      // Mock _localizeRaw to throw AbortError when signal is aborted
      vi.spyOn(engine as any, "_localizeRaw").mockImplementation(async (...args: any[]) => {
        const signal = args[3]; // signal is the 4th argument
        
        if (signal?.aborted) {
          const error = new DOMException("The operation was aborted.", "AbortError");
          throw error;
        }
        
        // Add a delay to simulate network request
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Check again if aborted during the delay
        if (signal?.aborted) {
          const error = new DOMException("The operation was aborted.", "AbortError");
          throw error;
        }
        
        return {};
      });

      const controller = new AbortController();
      const signal = controller.signal;

      const promise = engine.localizeHtml("<html><body>Test</body></html>", {
        sourceLocale: "en",
        targetLocale: "es"
      }, undefined, signal);

      // Small delay to ensure the request starts
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Abort after the delay
      controller.abort();

      await expect(promise).rejects.toThrow("Localization was aborted");
    });

    it("should abort batchLocalizeText and propagate to all child operations", async () => {
      const engine = new LingoDotDevEngine({ apiKey: "test" });
      
      // Track how many times localizeText is called
      let localizeTextCalls = 0;
      
      // Mock localizeText to simulate aborting
      vi.spyOn(engine, "localizeText").mockImplementation(async (text, params, callback, signal) => {
        localizeTextCalls++;
        
        if (signal?.aborted) {
          throw new Error("Localization was aborted");
        }
        
        // Simulate a longer delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Check again if aborted during the delay
        if (signal?.aborted) {
          throw new Error("Localization was aborted");
        }
        
        return "translated";
      });

      const controller = new AbortController();
      const signal = controller.signal;

      const promise = engine.batchLocalizeText("Hello world", {
        sourceLocale: "en",
        targetLocales: ["es", "fr", "de", "it"]
      }, signal);

      // Start the process
      await new Promise(resolve => setTimeout(resolve, 20));
      
      // Abort after the process has started
      controller.abort();

      await expect(promise).rejects.toThrow("Localization was aborted");
      
      // Verify that we attempted to start some localizeText calls
      expect(localizeTextCalls).toBeGreaterThan(0);
    });
    
    it("should abort recognizeLocale operation when signal is triggered", async () => {
      const engine = new LingoDotDevEngine({ apiKey: "test" });
      
      vi.spyOn(global, "fetch").mockImplementation(async (...args: any[]) => {
        const options = args[1] as RequestInit; // options is the 2nd argument
        
        // Check if already aborted
        if (options?.signal?.aborted) {
          throw new DOMException("The operation was aborted.", "AbortError");
        }
        
        // Check if the abort signal is passed to fetch
        expect(options?.signal).toBeDefined();
        
        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Check if aborted during the delay
        if (options?.signal?.aborted) {
          throw new DOMException("The operation was aborted.", "AbortError");
        }
        
        return new Response(JSON.stringify({ locale: "en" }));
      });

      const controller = new AbortController();
      const signal = controller.signal;

      const promise = engine.recognizeLocale("Hello world", signal);
      
      // Small delay to ensure the request starts
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Abort after the request has started
      controller.abort();

      await expect(promise).rejects.toThrow("Locale recognition was aborted");
    });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./utils/observability");

import { LingoDotDevEngine } from "./index";

describe("LingoDotDevEngine", () => {
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
      const engine = new LingoDotDevEngine({
        apiKey: "test",
        engineId: "eng_test",
      });
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
        undefined, // AbortSignal
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

  describe("localizeStringArray", () => {
    it("should localize an array of strings and maintain order", async () => {
      const engine = new LingoDotDevEngine({
        apiKey: "test",
        engineId: "eng_test",
      });
      const mockLocalizeRaw = vi.spyOn(engine as any, "_localizeRaw");
      mockLocalizeRaw.mockImplementation(async (obj: any) => {
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

      // Verify the mapped object was passed to _localizeRaw
      expect(mockLocalizeRaw).toHaveBeenCalledWith(
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
      const engine = new LingoDotDevEngine({
        apiKey: "test",
        engineId: "eng_test",
      });
      const mockLocalizeRaw = vi.spyOn(engine as any, "_localizeRaw");
      mockLocalizeRaw.mockImplementation(async () => ({}));

      const result = await engine.localizeStringArray([], {
        sourceLocale: "en",
        targetLocale: "es",
      });

      expect(mockLocalizeRaw).toHaveBeenCalledWith(
        {},
        {
          sourceLocale: "en",
          targetLocale: "es",
        },
      );

      expect(result).toEqual([]);
    });
  });

  describe("localizeChat", () => {
    it("should flatten chat texts and preserve speaker names", async () => {
      const engine = new LingoDotDevEngine({
        apiKey: "test",
        engineId: "eng_test",
      });
      const mockLocalizeRaw = vi.spyOn(engine as any, "_localizeRaw");
      mockLocalizeRaw.mockImplementation(async (obj: any) => {
        return Object.fromEntries(
          Object.entries(obj).map(([key, value]) => [key, `ES:${value}`]),
        );
      });

      const input = [
        { name: "Alice", text: "Hello! How are you?" },
        { name: "Bob", text: "I'm doing great, thanks!" },
      ];

      const result = await engine.localizeChat(input, {
        sourceLocale: "en",
        targetLocale: "es",
      });

      // Verify only texts are sent, keyed by index
      expect(mockLocalizeRaw).toHaveBeenCalledWith(
        {
          chat_0: "Hello! How are you?",
          chat_1: "I'm doing great, thanks!",
        },
        { sourceLocale: "en", targetLocale: "es" },
        undefined,
        undefined,
      );

      // Verify names are preserved and texts are translated
      expect(result).toEqual([
        { name: "Alice", text: "ES:Hello! How are you?" },
        { name: "Bob", text: "ES:I'm doing great, thanks!" },
      ]);
    });
  });

  describe("with engineId", () => {
    let mockFetch: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      mockFetch = vi.fn();
      global.fetch = mockFetch as any;
    });

    it("should include engineId in request body", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: { greeting: "Hola" } }),
      });

      const engine = new LingoDotDevEngine({
        apiKey: "test-key",
        engineId: "eng_123",
      });

      await engine.localizeObject(
        { greeting: "Hello" },
        { sourceLocale: "en", targetLocale: "es" },
      );

      const [url, options] = mockFetch.mock.calls[0];
      expect(url).toMatch(/\/process\/localize$/);
      expect(options.headers["X-API-Key"]).toBe("test-key");
      const body = JSON.parse(options.body);
      expect(body.engineId).toBe("eng_123");
    });

    it("should include sessionId and triggerType in request body", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: { greeting: "Hola" } }),
      });

      const engine = new LingoDotDevEngine({
        apiKey: "test-key",
        engineId: "eng_123",
      });

      await engine.localizeObject(
        { greeting: "Hello" },
        { sourceLocale: "en", targetLocale: "es", triggerType: "ci" },
      );

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.sessionId).toBeDefined();
      expect(body.triggerType).toBe("ci");
    });

    it("should generate a consistent sessionId across multiple requests", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: { a: "Hola", b: "Adios" } }),
      });

      const engine = new LingoDotDevEngine({
        apiKey: "test-key",
        engineId: "eng_123",
      });

      await engine.localizeObject(
        { a: "Hello" },
        { sourceLocale: "en", targetLocale: "es" },
      );
      await engine.localizeObject(
        { b: "Goodbye" },
        { sourceLocale: "en", targetLocale: "es" },
      );

      const sessionId1 = JSON.parse(mockFetch.mock.calls[0][1].body).sessionId;
      const sessionId2 = JSON.parse(mockFetch.mock.calls[1][1].body).sessionId;
      expect(sessionId1).toBe(sessionId2);
    });

    it("should include filePath in metadata when provided", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: { greeting: "Hola" } }),
      });

      const engine = new LingoDotDevEngine({
        apiKey: "test-key",
        engineId: "eng_123",
      });

      await engine.localizeObject(
        { greeting: "Hello" },
        {
          sourceLocale: "en",
          targetLocale: "es",
          filePath: "src/messages.json",
        },
      );

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.metadata).toEqual({ filePath: "src/messages.json" });
    });
  });

  describe("without engineId", () => {
    let mockFetch: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      mockFetch = vi.fn();
      global.fetch = mockFetch as any;
    });

    it("should use /process/localize endpoint", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: { greeting: "Hola" } }),
      });

      const engine = new LingoDotDevEngine({
        apiKey: "test-key",
      });

      await engine.localizeObject(
        { greeting: "Hello" },
        { sourceLocale: "en", targetLocale: "es" },
      );

      const [url, options] = mockFetch.mock.calls[0];
      expect(url).toBe("https://api.lingo.dev/process/localize");
      expect(options.headers["X-API-Key"]).toBe("test-key");
    });

    it("should use /process/recognize endpoint", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ locale: "fr" }),
      });

      const engine = new LingoDotDevEngine({
        apiKey: "test-key",
      });

      const result = await engine.recognizeLocale("Bonjour le monde");

      const [url, options] = mockFetch.mock.calls[0];
      expect(url).toBe("https://api.lingo.dev/process/recognize");
      expect(options.headers["X-API-Key"]).toBe("test-key");
      expect(result).toBe("fr");
    });

    it("should use /users/me with GET and X-API-Key header", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ id: "usr_abc", email: "user@example.com" }),
      });

      const engine = new LingoDotDevEngine({
        apiKey: "test-key",
      });

      const result = await engine.whoami();

      const [url, options] = mockFetch.mock.calls[0];
      expect(url).toBe("https://api.lingo.dev/users/me");
      expect(options.method).toBe("GET");
      expect(options.headers["X-API-Key"]).toBe("test-key");
      expect(result).toEqual({ id: "usr_abc", email: "user@example.com" });
    });

    it("should not include engineId in request body", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: { greeting: "Hola" } }),
      });

      const engine = new LingoDotDevEngine({
        apiKey: "test-key",
      });

      await engine.localizeObject(
        { greeting: "Hello" },
        { sourceLocale: "en", targetLocale: "es" },
      );

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.sourceLocale).toBe("en");
      expect(body.targetLocale).toBe("es");
      expect(body.sessionId).toBeDefined();
      expect(body.engineId).toBeUndefined();
    });
  });

  describe("hints support", () => {
    it("should send hints to the backend API", async () => {
      const mockFetch = vi.fn();
      global.fetch = mockFetch as any;

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          data: {
            "brand-name": "Optimum",
            "team-label": "Equipo de la NHL",
          },
        }),
      });

      const engine = new LingoDotDevEngine({
        apiKey: "test-api-key",
        apiUrl: "https://test.api.url",
        engineId: "eng_test",
      });

      const hints = {
        "brand-name": ["This is a brand name and should not be translated"],
        "team-label": ["NHL stands for National Hockey League"],
      };

      await engine.localizeObject(
        {
          "brand-name": "Optimum",
          "team-label": "NHL Team",
        },
        {
          sourceLocale: "en",
          targetLocale: "es",
          hints,
        },
      );

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const fetchCall = mockFetch.mock.calls[0];
      expect(fetchCall[0]).toBe("https://test.api.url/process/localize");

      const requestBody = JSON.parse(fetchCall[1].body);
      expect(requestBody.engineId).toBe("eng_test");
      expect(requestBody.hints).toEqual(hints);
      expect(requestBody.data).toEqual({
        "brand-name": "Optimum",
        "team-label": "NHL Team",
      });
      expect(requestBody.sourceLocale).toBe("en");
      expect(requestBody.targetLocale).toBe("es");
    });

    it("should handle localizeObject without hints", async () => {
      const mockFetch = vi.fn();
      global.fetch = mockFetch as any;

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          data: {
            greeting: "Hola",
          },
        }),
      });

      const engine = new LingoDotDevEngine({
        apiKey: "test-api-key",
        apiUrl: "https://test.api.url",
        engineId: "eng_test",
      });

      await engine.localizeObject(
        {
          greeting: "Hello",
        },
        {
          sourceLocale: "en",
          targetLocale: "es",
        },
      );

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const requestBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(requestBody.hints).toBeUndefined();
    });
  });

  describe("retry on 5xx errors", () => {
    let mockFetch: ReturnType<typeof vi.fn>;

    const okResponse = () => ({
      ok: true,
      status: 200,
      json: async () => ({ data: { greeting: "Hola" } }),
    });

    const serverErrorResponse = (status = 503) => ({
      ok: false,
      status,
      text: async () => JSON.stringify({ message: "service unavailable" }),
    });

    beforeEach(() => {
      mockFetch = vi.fn();
      global.fetch = mockFetch as any;
    });

    it("retries the request when the API responds with a 5xx and eventually succeeds", async () => {
      mockFetch
        .mockResolvedValueOnce(serverErrorResponse(500))
        .mockResolvedValueOnce(serverErrorResponse(503))
        .mockResolvedValueOnce(okResponse());

      const engine = new LingoDotDevEngine({
        apiKey: "test-key",
        retryDelayMs: 0,
      });

      const result = await engine.localizeObject(
        { greeting: "Hello" },
        { sourceLocale: "en", targetLocale: "es" },
      );

      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(result).toEqual({ greeting: "Hola" });
    });

    it("throws after exhausting all retries on persistent 5xx errors", async () => {
      mockFetch.mockResolvedValue(serverErrorResponse(500));

      const engine = new LingoDotDevEngine({
        apiKey: "test-key",
        maxRetries: 2,
        retryDelayMs: 0,
      });

      await expect(
        engine.localizeObject(
          { greeting: "Hello" },
          { sourceLocale: "en", targetLocale: "es" },
        ),
      ).rejects.toThrow(/Server error \(500\)/);

      // initial attempt + 2 retries
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it("does not retry on 4xx errors", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        text: async () => JSON.stringify({ message: "bad request" }),
      });

      const engine = new LingoDotDevEngine({
        apiKey: "test-key",
        retryDelayMs: 0,
      });

      await expect(
        engine.localizeObject(
          { greeting: "Hello" },
          { sourceLocale: "en", targetLocale: "es" },
        ),
      ).rejects.toThrow(/Invalid request/);

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("retries on transient network errors", async () => {
      mockFetch
        .mockRejectedValueOnce(new TypeError("network failure"))
        .mockResolvedValueOnce(okResponse());

      const engine = new LingoDotDevEngine({
        apiKey: "test-key",
        retryDelayMs: 0,
      });

      const result = await engine.localizeObject(
        { greeting: "Hello" },
        { sourceLocale: "en", targetLocale: "es" },
      );

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ greeting: "Hola" });
    });

    it("does not retry when maxRetries is 0", async () => {
      mockFetch.mockResolvedValue(serverErrorResponse(500));

      const engine = new LingoDotDevEngine({
        apiKey: "test-key",
        maxRetries: 0,
        retryDelayMs: 0,
      });

      await expect(
        engine.localizeObject(
          { greeting: "Hello" },
          { sourceLocale: "en", targetLocale: "es" },
        ),
      ).rejects.toThrow(/Server error \(500\)/);

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("does not retry an aborted request", async () => {
      const controller = new AbortController();
      controller.abort();

      const engine = new LingoDotDevEngine({
        apiKey: "test-key",
        retryDelayMs: 0,
      });

      await expect(
        engine.localizeObject(
          { greeting: "Hello" },
          { sourceLocale: "en", targetLocale: "es" },
          undefined,
          controller.signal,
        ),
      ).rejects.toThrow(/aborted/i);

      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe("locale normalization", () => {
    let mockFetch: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: { greeting: "Olá" } }),
      });
      global.fetch = mockFetch as any;
    });

    it("normalizes Android `-r` locales to BCP 47 in the request body", async () => {
      const engine = new LingoDotDevEngine({ apiKey: "test-key" });

      await engine.localizeObject(
        { greeting: "Hello" },
        { sourceLocale: "en", targetLocale: "pt-rPT" },
      );

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.targetLocale).toBe("pt-PT");
      expect(body.sourceLocale).toBe("en");
    });

    it("normalizes underscore locales to BCP 47 in the request body", async () => {
      const engine = new LingoDotDevEngine({ apiKey: "test-key" });

      await engine.localizeObject(
        { greeting: "Hello" },
        { sourceLocale: "en_US", targetLocale: "pt_PT" },
      );

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.sourceLocale).toBe("en-US");
      expect(body.targetLocale).toBe("pt-PT");
    });

    it("normalizes locale codes used as reference keys", async () => {
      const engine = new LingoDotDevEngine({ apiKey: "test-key" });

      await engine.localizeObject(
        { greeting: "Hello" },
        {
          sourceLocale: "en",
          targetLocale: "pt-rPT",
          reference: { "pt-rPT": { greeting: "Olá" } },
        },
      );

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(Object.keys(body.reference)).toEqual(["pt-PT"]);
    });

    it("leaves already-canonical locales unchanged", async () => {
      const engine = new LingoDotDevEngine({ apiKey: "test-key" });

      await engine.localizeObject(
        { greeting: "Hello" },
        { sourceLocale: "en", targetLocale: "pt-PT" },
      );

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.targetLocale).toBe("pt-PT");
    });
  });
});

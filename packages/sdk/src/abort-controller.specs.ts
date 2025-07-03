import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LingoDotDevEngine } from '../src/index.js';

// Mock fetch globally
global.fetch = vi.fn();

describe('AbortController Support', () => {
  let engine: LingoDotDevEngine;
  
  beforeEach(() => {
    engine = new LingoDotDevEngine({
      apiKey: 'test-key',
      apiUrl: 'https://test.api.com'
    });
    vi.clearAllMocks();
  });

  describe('localizeText', () => {
    it('should pass AbortSignal to fetch', async () => {
      const controller = new AbortController();
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ data: { text: 'Hola' } })
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      await engine.localizeText(
        'Hello',
        { sourceLocale: 'en', targetLocale: 'es' },
        undefined,
        controller.signal
      );

      expect(global.fetch).toHaveBeenCalledWith(
        'https://test.api.com/i18n',
        expect.objectContaining({
          signal: controller.signal
        })
      );
    });

    it('should throw error when operation is aborted', async () => {
      const controller = new AbortController();
      controller.abort();

      await expect(
        engine.localizeText(
          'Hello',
          { sourceLocale: 'en', targetLocale: 'es' },
          undefined,
          controller.signal
        )
      ).rejects.toThrow('Operation was aborted');
    });
  });

  describe('localizeObject', () => {
    it('should pass AbortSignal to internal method', async () => {
      const controller = new AbortController();
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ data: { key: 'valor' } })
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      await engine.localizeObject(
        { key: 'value' },
        { sourceLocale: 'en', targetLocale: 'es' },
        undefined,
        controller.signal
      );

      expect(global.fetch).toHaveBeenCalledWith(
        'https://test.api.com/i18n',
        expect.objectContaining({
          signal: controller.signal
        })
      );
    });
  });

  describe('localizeHtml', () => {
    it('should pass AbortSignal to internal method', async () => {
      const controller = new AbortController();
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ data: { 'body/0': 'Hola' } })
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      // Mock JSDOM
      const mockJSDOM = {
        JSDOM: vi.fn().mockImplementation(() => ({
          window: {
            document: {
              documentElement: {
                setAttribute: vi.fn()
              },
              head: {
                childNodes: []
              },
              body: {
                childNodes: [{
                  nodeType: 3,
                  textContent: 'Hello',
                  parentElement: null
                }]
              }
            }
          },
          serialize: vi.fn().mockReturnValue('<html><body>Hola</body></html>')
        }))
      };

      // Mock dynamic import
      vi.doMock('jsdom', () => mockJSDOM);

      await engine.localizeHtml(
        '<html><body>Hello</body></html>',
        { sourceLocale: 'en', targetLocale: 'es' },
        undefined,
        controller.signal
      );

      expect(global.fetch).toHaveBeenCalledWith(
        'https://test.api.com/i18n',
        expect.objectContaining({
          signal: controller.signal
        })
      );
    });
  });

  describe('localizeChat', () => {
    it('should pass AbortSignal to internal method', async () => {
      const controller = new AbortController();
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ data: { 'chat_0': 'Hola' } })
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      await engine.localizeChat(
        [{ name: 'User', text: 'Hello' }],
        { sourceLocale: 'en', targetLocale: 'es' },
        undefined,
        controller.signal
      );

      expect(global.fetch).toHaveBeenCalledWith(
        'https://test.api.com/i18n',
        expect.objectContaining({
          signal: controller.signal
        })
      );
    });
  });

  describe('batchLocalizeText', () => {
    it('should pass AbortSignal to individual localizeText calls', async () => {
      const controller = new AbortController();
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ data: { text: 'Hola' } })
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      await engine.batchLocalizeText(
        'Hello',
        {
          sourceLocale: 'en',
          targetLocales: ['es', 'fr']
        },
        controller.signal
      );

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://test.api.com/i18n',
        expect.objectContaining({
          signal: controller.signal
        })
      );
    });
  });

  describe('recognizeLocale', () => {
    it('should pass AbortSignal to fetch', async () => {
      const controller = new AbortController();
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ locale: 'en' })
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      await engine.recognizeLocale('Hello world', controller.signal);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://test.api.com/recognize',
        expect.objectContaining({
          signal: controller.signal
        })
      );
    });
  });

  describe('whoami', () => {
    it('should pass AbortSignal to fetch', async () => {
      const controller = new AbortController();
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ email: 'test@example.com', id: '123' })
      };
      (global.fetch as any).mockResolvedValue(mockResponse);

      await engine.whoami(controller.signal);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://test.api.com/whoami',
        expect.objectContaining({
          signal: controller.signal
        })
      );
    });
  });

  describe('Batch operations abortion', () => {
    it('should abort between chunks in _localizeRaw', async () => {
      const controller = new AbortController();
      
      // Create a large payload that will be split into multiple chunks
      const largePayload: Record<string, string> = {};
      for (let i = 0; i < 100; i++) {
        largePayload[`key${i}`] = `value${i}`.repeat(50); // Make values long enough
      }

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ data: { key0: 'processed' } })
      };

      // Mock fetch to abort the controller after the first call
      let callCount = 0;
      (global.fetch as any).mockImplementation(async () => {
        callCount++;
        if (callCount === 1) {
          // Abort immediately after first call starts
          controller.abort();
        }
        return mockResponse;
      });

      await expect(
        engine._localizeRaw(
          largePayload,
          { sourceLocale: 'en', targetLocale: 'es' },
          undefined,
          controller.signal
        )
      ).rejects.toThrow('Operation was aborted');

      // Should have made at least one call
      expect(callCount).toBeGreaterThan(0);
    });
  });
});

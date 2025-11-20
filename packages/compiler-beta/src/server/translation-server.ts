/**
 * Simple HTTP server for serving translations during development
 *
 * This server:
 * - Finds a free port automatically
 * - Serves translations via:
 *   - GET /translations/:locale - Full dictionary (cached)
 *   - GET /translations/:locale/:hash - Single hash translation
 *   - POST /translations/:locale (body: { hashes: string[] }) - Batch translation
 * - Uses the same translation logic as middleware
 * - Can be started/stopped programmatically
 */

import http from "http";
import { URL } from "url";
import {
  handleHashTranslationRequest,
  handleTranslationRequest,
  type TranslationMiddlewareConfig,
} from "../plugin/shared-middleware";

export interface TranslationServerOptions {
  /**
   * Starting port to try (will find next available if taken)
   * @default 3456
   */
  startPort?: number;

  /**
   * Configuration for translation generation
   */
  config: TranslationMiddlewareConfig;

  /**
   * Callback when server is ready
   */
  onReady?: (port: number) => void;

  /**
   * Callback on error
   */
  onError?: (error: Error) => void;
}

export class TranslationServer {
  private server: http.Server | null = null;
  private port: number | null = null;
  private config: TranslationMiddlewareConfig;
  private startPort: number;
  private onReadyCallback?: (port: number) => void;
  private onErrorCallback?: (error: Error) => void;

  constructor(options: TranslationServerOptions) {
    this.config = options.config;
    this.startPort = options.startPort || 3456;
    this.onReadyCallback = options.onReady;
    this.onErrorCallback = options.onError;
  }

  /**
   * Start the server and find an available port
   */
  async start(): Promise<number> {
    if (this.server) {
      throw new Error("Server is already running");
    }

    const port = await this.findAvailablePort(this.startPort);

    return new Promise((resolve, reject) => {
      this.server = http.createServer(async (req, res) => {
        await this.handleRequest(req, res);
      });

      this.server.on("error", (error: NodeJS.ErrnoException) => {
        if (error.code === "EADDRINUSE") {
          // Port is in use, try next one
          reject(new Error(`Port ${port} is already in use`));
        } else {
          this.onErrorCallback?.(error);
          reject(error);
        }
      });

      this.server.listen(port, "127.0.0.1", () => {
        this.port = port;
        console.log(
          `[lingo.dev] Translation server listening on http://127.0.0.1:${port}`,
        );
        this.onReadyCallback?.(port);
        resolve(port);
      });
    });
  }

  /**
   * Stop the server
   */
  async stop(): Promise<void> {
    if (!this.server) {
      return;
    }

    return new Promise((resolve, reject) => {
      this.server!.close((error) => {
        if (error) {
          reject(error);
        } else {
          console.log(`[lingo.dev] Translation server stopped`);
          this.server = null;
          this.port = null;
          resolve();
        }
      });
    });
  }

  /**
   * Get the current port (null if not running)
   */
  getPort(): number | null {
    return this.port;
  }

  /**
   * Check if server is running
   */
  isRunning(): boolean {
    return this.server !== null && this.port !== null;
  }

  /**
   * Find an available port starting from the given port
   */
  private async findAvailablePort(
    startPort: number,
    maxAttempts = 100,
  ): Promise<number> {
    for (let port = startPort; port < startPort + maxAttempts; port++) {
      if (await this.isPortAvailable(port)) {
        return port;
      }
    }
    throw new Error(
      `Could not find available port in range ${startPort}-${startPort + maxAttempts}`,
    );
  }

  /**
   * Check if a port is available
   */
  private async isPortAvailable(port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const testServer = http.createServer();

      testServer.once("error", (error: NodeJS.ErrnoException) => {
        if (error.code === "EADDRINUSE") {
          resolve(false);
        } else {
          resolve(false);
        }
      });

      testServer.once("listening", () => {
        testServer.close(() => {
          resolve(true);
        });
      });

      testServer.listen(port, "127.0.0.1");
    });
  }

  /**
   * Handle incoming HTTP request
   */
  private async handleRequest(
    req: http.IncomingMessage,
    res: http.ServerResponse,
  ): Promise<void> {
    try {
      const url = new URL(req.url || "", `http://${req.headers.host}`);

      // Log request
      console.log(`[lingo.dev] ${req.method} ${url.pathname}`);

      // Handle CORS for browser requests
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");

      if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
      }

      // Health check endpoint
      if (url.pathname === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok", port: this.port }));
        return;
      }

      // Batch translation endpoint: POST /translations/:locale
      const postMatch = url.pathname.match(/^\/translations\/([^/]+)$/);
      if (postMatch && req.method === "POST") {
        const [, locale] = postMatch;
        await this.handleBatchTranslationRequest(locale, req, res);
        return;
      }

      // Translation endpoint: GET /translations/:locale/:hash
      const hashMatch = url.pathname.match(
        /^\/translations\/([^/]+)\/([^/]+)$/,
      );
      if (hashMatch && req.method === "GET") {
        const [, locale, hash] = hashMatch;
        await this.handleSingleHashRequest(locale, hash, res);
        return;
      }

      // Translation dictionary endpoint: GET /translations/:locale
      const dictMatch = url.pathname.match(/^\/translations\/([^/]+)$/);
      if (dictMatch && req.method === "GET") {
        const [, locale] = dictMatch;
        await this.handleDictionaryRequest(locale, res);
        return;
      }

      // 404 for unknown routes
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          error: "Not Found",
          message: "Unknown endpoint",
          availableEndpoints: [
            "GET /health",
            "GET /translations/:locale",
            "GET /translations/:locale/:hash",
            "POST /translations/:locale (with body: { hashes: string[] })",
          ],
        }),
      );
    } catch (error) {
      console.error("[lingo.dev] Error handling request:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          error: "Internal Server Error",
          message: error instanceof Error ? error.message : "Unknown error",
        }),
      );
    }
  }

  /**
   * Handle translation request for a single hash
   */
  private async handleSingleHashRequest(
    locale: string,
    hash: string,
    res: http.ServerResponse,
  ): Promise<void> {
    try {
      // Use hash-based request for efficiency
      const response = await handleHashTranslationRequest(
        locale,
        [hash],
        this.config,
      );

      if (response.status !== 200) {
        res.writeHead(response.status, response.headers);
        res.end(response.body);
        return;
      }

      // Parse the result
      const translations = JSON.parse(response.body);
      const translation = translations[hash];

      if (!translation) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "Translation not found",
            hash,
            locale,
          }),
        );
        return;
      }

      res.writeHead(200, {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      });
      res.end(
        JSON.stringify({
          hash,
          locale,
          translation,
        }),
      );
    } catch (error) {
      console.error(
        `[lingo.dev] Error getting translation for ${locale}/${hash}:`,
        error,
      );
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          error: "Translation generation failed",
          message: error instanceof Error ? error.message : "Unknown error",
        }),
      );
    }
  }

  /**
   * Handle batch translation request
   */
  private async handleBatchTranslationRequest(
    locale: string,
    req: http.IncomingMessage,
    res: http.ServerResponse,
  ): Promise<void> {
    try {
      // Read request body
      let body = "";
      for await (const chunk of req) {
        body += chunk.toString();
      }

      // Parse body
      const { hashes } = JSON.parse(body);

      if (!Array.isArray(hashes)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "Bad Request",
            message: "Body must contain 'hashes' array",
          }),
        );
        return;
      }

      // Use hash-based request for efficiency
      const response = await handleHashTranslationRequest(
        locale,
        hashes,
        this.config,
      );

      // Set headers from shared middleware
      Object.entries(response.headers).forEach(([key, value]) => {
        res.setHeader(key, value);
      });

      res.writeHead(response.status);
      res.end(response.body);
    } catch (error) {
      console.error(
        `[lingo.dev] Error getting batch translations for ${locale}:`,
        error,
      );
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          error: "Translation generation failed",
          message: error instanceof Error ? error.message : "Unknown error",
        }),
      );
    }
  }

  /**
   * Handle request for full translation dictionary
   */
  private async handleDictionaryRequest(
    locale: string,
    res: http.ServerResponse,
  ): Promise<void> {
    try {
      const response = await handleTranslationRequest(locale, this.config);

      // Set headers from shared middleware
      Object.entries(response.headers).forEach(([key, value]) => {
        res.setHeader(key, value);
      });

      res.writeHead(response.status);
      res.end(response.body);
    } catch (error) {
      console.error(
        `[lingo.dev] Error getting dictionary for ${locale}:`,
        error,
      );
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          error: "Translation generation failed",
          message: error instanceof Error ? error.message : "Unknown error",
        }),
      );
    }
  }
}

/**
 * Create and start a translation server
 */
export async function startTranslationServer(
  options: TranslationServerOptions,
): Promise<TranslationServer> {
  const server = new TranslationServer(options);
  await server.start();
  return server;
}

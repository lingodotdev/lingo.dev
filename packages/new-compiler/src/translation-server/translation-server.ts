/**
 * Simple HTTP server for serving translations during development
 *
 * This server:
 * - Finds a free port automatically
 * - Serves translations via:
 *   - GET /translations/:locale - Full dictionary (cached)
 *   - POST /translations/:locale (body: { hashes: string[] }) - Batch translation
 * - Uses the same translation logic as middleware
 * - Can be started/stopped programmatically
 */

import http from "http";
import crypto from "crypto";
import type { Socket } from "net";
import { URL } from "url";
import { WebSocket, WebSocketServer } from "ws";
import type { MetadataSchema, TranslationMiddlewareConfig } from "../types";
import { getLogger } from "./logger";
import { TranslationService } from "../translators";
import {
  createEmptyMetadata,
  getMetadataPath,
  loadMetadata,
} from "../metadata/manager";
import type { TranslationServerEvent } from "./ws-events";
import { createEvent } from "./ws-events";
import type { LocaleCode } from "lingo.dev/spec";
import { parseLocaleOrThrow } from "../utils/is-valid-locale";

export interface TranslationServerOptions {
  config: TranslationMiddlewareConfig;
  translationService?: TranslationService;
  onReady?: (port: number) => void;
  onError?: (error: Error) => void;
}

export class TranslationServer {
  private server: http.Server | null = null;
  private url: string | undefined = undefined;
  private logger;
  private readonly config: TranslationMiddlewareConfig;
  private readonly configHash: string;
  private readonly startPort: number;
  private readonly onReadyCallback?: (port: number) => void;
  private readonly onErrorCallback?: (error: Error) => void;
  private metadata: MetadataSchema | null = null;
  private connections: Set<Socket> = new Set();
  private wss: WebSocketServer | null = null;
  private wsClients: Set<WebSocket> = new Set();

  // Translation activity tracking for "busy" notifications
  private activeTranslations = 0;
  private isBusy = false;
  private busyTimeout: NodeJS.Timeout | null = null;
  private readonly BUSY_DEBOUNCE_MS = 500; // Time after last translation to send "idle" event
  private readonly translationService: TranslationService;

  constructor(options: TranslationServerOptions) {
    this.config = options.config;
    this.configHash = hashConfig(options.config);
    this.translationService =
      options.translationService ??
      // Fallback is for CLI start only.
      new TranslationService(options.config, getLogger(options.config));
    this.startPort = options.config.dev.translationServerStartPort;
    this.onReadyCallback = options.onReady;
    this.onErrorCallback = options.onError;
    this.logger = getLogger(this.config);
  }

  /**
   * Start the server and find an available port
   */
  async start(): Promise<number> {
    if (this.server) {
      throw new Error("Server is already running");
    }

    this.logger.info(`🔧 Initializing translator...`);

    const port = await this.findAvailablePort(this.startPort);

    return new Promise((resolve, reject) => {
      this.server = http.createServer((req, res) => {
        // Log that we received a request (before async handling)
        this.logger.info(`📥 Received: ${req.method} ${req.url}`);

        // Wrap async handler and catch errors explicitly
        this.handleRequest(req, res).catch((error) => {
          this.logger.error(`Request handler error:`, error);
          this.logger.error(error.stack);

          // Send error response if headers not sent
          if (!res.headersSent) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Internal Server Error" }));
          }
        });
      });

      this.logger.debug(`Starting translation server on port ${port}`);

      // Track connections for graceful shutdown
      this.server.on("connection", (socket) => {
        this.connections.add(socket);
        socket.once("close", () => {
          this.connections.delete(socket);
        });
      });

      this.server.on("error", (error: NodeJS.ErrnoException) => {
        if (error.code === "EADDRINUSE") {
          // Port is in use, try next one
          reject(new Error(`Port ${port} is already in use`));
        } else {
          this.logger.error(`Translation server error: ${error.message}\n`);
          this.onErrorCallback?.(error);
          reject(error);
        }
      });

      this.server.listen(port, "127.0.0.1", () => {
        this.url = `http://127.0.0.1:${port}`;
        this.logger.info(`Translation server listening on ${this.url}`);

        // Initialize WebSocket server on the same port
        this.initializeWebSocket();

        this.onReadyCallback?.(port);
        resolve(port);
      });
    });
  }

  /**
   * Initialize WebSocket server for real-time dev widget updates
   */
  private initializeWebSocket(): void {
    if (!this.server) {
      throw new Error("HTTP server must be started before WebSocket");
    }

    this.wss = new WebSocketServer({ server: this.server });

    this.wss.on("connection", (ws: WebSocket) => {
      this.wsClients.add(ws);
      this.logger.debug(
        `WebSocket client connected. Total clients: ${this.wsClients.size}`,
      );

      // Send initial connected event
      this.sendToClient(ws, createEvent("connected", { serverUrl: this.url! }));

      ws.on("close", () => {
        this.wsClients.delete(ws);
        this.logger.debug(
          `WebSocket client disconnected. Total clients: ${this.wsClients.size}`,
        );
      });

      ws.on("error", (error) => {
        this.logger.error(`WebSocket client error:`, error);
        this.wsClients.delete(ws);
      });
    });

    this.wss.on("error", (error) => {
      this.logger.error(`WebSocket server error:`, error);
      this.onErrorCallback?.(error);
    });

    this.logger.info(`WebSocket server initialized`);
  }

  /**
   * Send event to a specific WebSocket client
   */
  private sendToClient(ws: WebSocket, event: TranslationServerEvent): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(event));
    }
  }

  /**
   * Broadcast event to all connected WebSocket clients
   */
  private broadcast(event: TranslationServerEvent): void {
    const message = JSON.stringify(event);
    for (const client of this.wsClients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }

  /**
   * Stop the server
   */
  async stop(): Promise<void> {
    if (!this.server) {
      this.logger.debug("Translation server is not running. Nothing to stop.");
      return;
    }

    // Clear any pending busy timeout
    if (this.busyTimeout) {
      clearTimeout(this.busyTimeout);
      this.busyTimeout = null;
    }

    // Close all WebSocket connections
    for (const client of this.wsClients) {
      client.close();
    }
    this.wsClients.clear();

    // Close WebSocket server
    if (this.wss) {
      this.wss.close();
      this.wss = null;
    }

    // Destroy all active HTTP connections to prevent hanging
    for (const socket of this.connections) {
      socket.destroy();
    }
    this.connections.clear();

    return new Promise((resolve, reject) => {
      this.server!.close((error) => {
        if (error) {
          reject(error);
        } else {
          this.logger.info(`Translation server stopped`);
          this.server = null;
          this.url = undefined;
          resolve();
        }
      });
    });
  }

  /**
   * Get the current port (null if not running)
   */
  getUrl(): string | undefined {
    return this.url;
  }

  /**
   * Start a new server or get the URL of an existing one on the preferred port.
   *
   * This method optimizes for the common case where a translation server is already
   * running on a preferred port. If that port is taken, it checks if it's our service
   * by calling the health check endpoint. If it is, we reuse it instead of starting
   * a new server on a different port.
   *
   * @returns URL of the running server (new or existing)
   */
  async startOrGetUrl(): Promise<string> {
    if (this.server && this.url) {
      this.logger.info(`Using existing server instance at ${this.url}`);
      return this.url;
    }

    const preferredPort = this.startPort;
    const preferredUrl = `http://127.0.0.1:${preferredPort}`;

    // Check if port is available
    const portAvailable = await this.isPortAvailable(preferredPort);

    if (portAvailable) {
      // Port is free, start a new server
      this.logger.info(
        `Port ${preferredPort} is available, starting new server...`,
      );
      await this.start();
      return this.url!;
    }

    // Port is taken, check if it's our translation server
    this.logger.info(
      `Port ${preferredPort} is in use, checking if it's a translation server...`,
    );
    const isOurServer = await this.checkIfTranslationServer(preferredUrl);

    if (isOurServer) {
      // It's our server, reuse it
      this.logger.info(
        `✅ Found existing translation server at ${preferredUrl}, reusing it`,
      );
      this.url = preferredUrl;
      return preferredUrl;
    }

    // Port is taken by something else, start a new server on a different port
    this.logger.info(
      `Port ${preferredPort} is in use by another service, finding alternative...`,
    );
    await this.start();
    return this.url!;
  }

  /**
   * Check if server is running
   */
  isRunning(): boolean {
    return this.server !== null && this.url !== null;
  }

  /**
   * Reload metadata from disk
   * Useful when metadata has been updated during runtime (e.g., new transformations)
   */
  async reloadMetadata(): Promise<void> {
    try {
      this.metadata = await loadMetadata(getMetadataPath(this.config));
      this.logger.debug(
        `Reloaded metadata: ${Object.keys(this.metadata.entries).length} entries`,
      );
    } catch (error) {
      this.logger.warn("Failed to reload metadata:", error);
      this.metadata = createEmptyMetadata();
    }
  }

  /**
   * Translate the entire dictionary for a given locale
   *
   * This method always reloads metadata from disk before translating to ensure
   * all entries added during build-time transformations are included.
   *
   * This is the recommended method for build-time translation generation.
   */
  async translateAll(locale: LocaleCode): Promise<{
    translations: Record<string, string>;
    errors: Array<{ hash: string; error: string }>;
  }> {
    if (!this.translationService) {
      throw new Error("Translation server not initialized");
    }

    // Always reload metadata to get the latest entries
    // This is critical for build-time translation where metadata is updated
    // continuously as files are transformed
    await this.reloadMetadata();

    if (!this.metadata) {
      throw new Error("Failed to load metadata");
    }

    const allHashes = Object.keys(this.metadata.entries);

    this.logger.info(
      `Translating all ${allHashes.length} entries to ${locale}`,
    );

    // Broadcast batch start event
    const startTime = Date.now();
    this.broadcast(
      createEvent("batch:start", {
        locale,
        total: allHashes.length,
        hashes: allHashes,
      }),
    );

    const result = await this.translationService.translate(
      locale,
      this.metadata,
      allHashes,
    );

    // Broadcast batch complete event
    const duration = Date.now() - startTime;
    this.broadcast(
      createEvent("batch:complete", {
        locale,
        total: allHashes.length,
        successful: Object.keys(result.translations).length,
        failed: result.errors.length,
        duration,
      }),
    );

    return result;
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
   * Mark translation activity start - emits busy event if not already busy
   */
  private startTranslationActivity(): void {
    this.activeTranslations++;

    // Clear any pending idle timeout
    if (this.busyTimeout) {
      clearTimeout(this.busyTimeout);
      this.busyTimeout = null;
    }

    // Emit busy event if this is the first active translation
    if (!this.isBusy && this.activeTranslations > 0) {
      this.isBusy = true;
      this.broadcast(
        createEvent("server:busy", {
          activeTranslations: this.activeTranslations,
        }),
      );
      this.logger.debug(
        `[BUSY] Server is now busy (${this.activeTranslations} active)`,
      );
    }
  }

  /**
   * Mark translation activity end - emits idle event after debounce period
   */
  private endTranslationActivity(): void {
    this.activeTranslations = Math.max(0, this.activeTranslations - 1);

    // If no more active translations, schedule idle notification
    if (this.activeTranslations === 0 && this.isBusy) {
      // Clear any existing timeout
      if (this.busyTimeout) {
        clearTimeout(this.busyTimeout);
      }

      // Wait for debounce period before sending idle event
      // This prevents rapid busy->idle->busy cycles when translations come in quick succession
      this.busyTimeout = setTimeout(() => {
        if (this.activeTranslations === 0) {
          this.isBusy = false;
          this.broadcast(createEvent("server:idle", {}));
          this.logger.debug("[IDLE] Server is now idle");
        }
      }, this.BUSY_DEBOUNCE_MS);
    }
  }

  /**
   * Check if a given URL is running our translation server by calling the health endpoint
   * Also verifies that the config hash matches to ensure compatible configuration
   */
  private async checkIfTranslationServer(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const healthUrl = `${url}/health`;

      const req = http.get(healthUrl, { timeout: 2000 }, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk.toString();
        });

        res.on("end", () => {
          try {
            if (res.statusCode === 200) {
              const json = JSON.parse(data);
              // Our translation server returns { status: "ok", port: ..., configHash: ... }
              // Check if config hash matches (if present)
              // If configHash is missing (old server), accept it for backward compatibility
              if (json.configHash && json.configHash !== this.configHash) {
                this.logger.warn(
                  `Existing server has different config (hash: ${json.configHash} vs ${this.configHash}), will start new server`,
                );
                resolve(false);
                return;
              }
              resolve(true);
              return;
            }
            resolve(false);
          } catch (error) {
            // Failed to parse JSON or invalid response
            resolve(false);
          }
        });
      });

      req.on("error", () => {
        // Connection failed, not our server
        resolve(false);
      });

      req.on("timeout", () => {
        req.destroy();
        resolve(false);
      });
    });
  }

  /**
   * Handle incoming HTTP request
   */
  private async handleRequest(
    req: http.IncomingMessage,
    res: http.ServerResponse,
  ): Promise<void> {
    this.logger.info(`🔄 Processing: ${req.method} ${req.url}`);

    try {
      const url = new URL(req.url || "", `http://${req.headers.host}`);

      // Log request
      this.logger.debug(`${req.method} ${url.pathname}`);

      // Handle CORS for browser requests
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.setHeader(
        "Access-Control-Expose-Headers",
        "Content-Type, Cache-Control",
      );

      if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
      }

      if (url.pathname === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            port: this.url,
            configHash: this.configHash,
          }),
        );
        return;
      }

      // Batch translation endpoint: POST /translations/:locale
      const postMatch = url.pathname.match(/^\/translations\/([^/]+)$/);
      if (postMatch && req.method === "POST") {
        const [, locale] = postMatch;

        await this.handleBatchTranslationRequest(locale, req, res);
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
            "POST /translations/:locale (with body: { hashes: string[] })",
          ],
        }),
      );
    } catch (error) {
      this.logger.error("Error handling request:", error);
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
   * Handle batch translation request
   */
  private async handleBatchTranslationRequest(
    locale: string,
    req: http.IncomingMessage,
    res: http.ServerResponse,
  ): Promise<void> {
    try {
      const parsedLocale = parseLocaleOrThrow(locale);

      // Read request body
      let body = "";
      this.logger.debug("Reading request body...");
      for await (const chunk of req) {
        body += chunk.toString();
        this.logger.debug(`Chunk read, body: ${body}`);
      }

      // Parse body
      const { hashes } = JSON.parse(body);

      this.logger.debug(`Parsed hashes: ${hashes.join(",")}`);

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
      // Reload metadata to ensure we have the latest entries
      // (new entries may have been added since server started)
      await this.reloadMetadata();

      if (!this.metadata) {
        throw new Error("Failed to load metadata");
      }

      this.logger.info(`🔄 Translating ${hashes.length} hashes to ${locale}`);
      this.logger.debug(`🔄 Hashes: ${hashes.join(", ")}`);

      // Mark translation activity start
      this.startTranslationActivity();

      try {
        const result = await this.translationService.translate(
          parsedLocale,
          this.metadata,
          hashes,
        );

        // Return successful response
        res.writeHead(200, {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        });
        res.end(
          JSON.stringify({
            locale,
            translations: result.translations,
            errors: result.errors,
          }),
        );
      } finally {
        // Mark translation activity end
        this.endTranslationActivity();
      }
    } catch (error) {
      this.logger.error(
        `Error getting batch translations for ${locale}:`,
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
      const parsedLocale = parseLocaleOrThrow(locale);

      // Reload metadata to ensure we have the latest entries
      // (new entries may have been added since server started)
      await this.reloadMetadata();

      if (!this.metadata) {
        throw new Error("Failed to load metadata");
      }

      this.logger.info(`🌐 Requesting full dictionary for ${locale}`);

      const allHashes = Object.keys(this.metadata.entries);

      // Translate all hashes
      const result = await this.translationService.translate(
        parsedLocale,
        this.metadata,
        allHashes,
      );

      // Return successful response
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      });
      res.end(
        JSON.stringify({
          locale,
          translations: result.translations,
          errors: result.errors,
        }),
      );
    } catch (error) {
      this.logger.error(`Error getting dictionary for ${locale}:`, error);
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

type SerializablePrimitive = string | number | boolean | null | undefined;

type SerializableObject = {
  [key: string]: SerializableValue;
};
export type SerializableValue =
  | SerializablePrimitive
  | SerializableValue[]
  | SerializableObject;

export function stableStringify(
  value: Record<string, SerializableValue>,
): string {
  const normalize = (v: any): any => {
    if (v === undefined) return undefined;
    if (typeof v === "function") return undefined;
    if (v === null) return null;

    if (Array.isArray(v)) {
      return v.map(normalize).filter((x) => x !== undefined);
    }

    if (typeof v === "object") {
      const out: Record<string, any> = {};
      for (const key of Object.keys(v).sort()) {
        const next = normalize(v[key]);
        if (next !== undefined) out[key] = next;
      }
      return out;
    }

    return v;
  };

  return JSON.stringify(normalize(value));
}

/**
 * Generate a stable hash of a config object
 * Filters out functions and non-serializable values
 * Sorts keys for stability
 */
export function hashConfig(config: Record<string, SerializableValue>): string {
  const serialized = stableStringify(config);
  return crypto.createHash("md5").update(serialized).digest("hex").slice(0, 12);
}

export async function startTranslationServer(
  options: TranslationServerOptions,
): Promise<TranslationServer> {
  const server = new TranslationServer(options);
  await server.start();
  return server;
}

/**
 * Create a translation server and start it or reuse an existing one on the preferred port
 *
 * Since we have little control over the dev server start in next, we can start the translation server only in the async config or in the loader,
 * they both could be run in different processes, and we need a way to avoid starting multiple servers.
 * This one will try to start a server on the preferred port (which seems to be an atomic operation), and if it fails,
 * it checks if the server that is already started is ours and returns its url.
 *
 * @returns Object containing the server instance and its URL
 */
export async function startOrGetTranslationServer(
  options: TranslationServerOptions,
): Promise<{ server: TranslationServer; url: string }> {
  const server = new TranslationServer(options);
  const url = await server.startOrGetUrl();
  return { server, url };
}

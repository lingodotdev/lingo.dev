import Z from "zod";
import {
  LocaleCode,
  localeCodeSchema,
  normalizeLocale,
} from "@lingo.dev/_spec";
import { createId } from "@paralleldrive/cuid2";
import { trackEvent } from "./utils/observability";
import { TRACKING_EVENTS } from "./utils/tracking-events";

const engineParamsSchema = Z.object({
  apiKey: Z.string(),
  apiUrl: Z.string().url().default("https://api.lingo.dev"),
  batchSize: Z.number().int().gt(0).lte(250).default(25),
  idealBatchItemSize: Z.number().int().gt(0).lte(2500).default(250),
  engineId: Z.string().optional(),
  // Number of times a localization request is retried after a transient
  // failure (5xx response or network error). `0` disables retries.
  maxRetries: Z.number().int().gte(0).default(3),
  // Base delay (ms) for the exponential backoff between retries. The actual
  // wait grows as `retryDelayMs * 2 ** attempt` plus a small random jitter.
  retryDelayMs: Z.number().int().gte(0).default(500),
}).passthrough();

// Locale codes are validated leniently (Android `pt-rPT`, underscore `pt_PT`,
// etc. all pass) but must reach the API in canonical BCP 47 form. Normalizing
// here keeps the CLI free to use the original code for file paths.
const normalizedLocaleCodeSchema = localeCodeSchema.transform(normalizeLocale);

const payloadSchema = Z.record(Z.string(), Z.any());
const referenceSchema = Z.record(normalizedLocaleCodeSchema, payloadSchema);
const hintsSchema = Z.record(Z.string(), Z.array(Z.string()));

const localizationParamsSchema = Z.object({
  sourceLocale: Z.union([normalizedLocaleCodeSchema, Z.null()]),
  targetLocale: normalizedLocaleCodeSchema,
  fast: Z.boolean().optional(),
  reference: referenceSchema.optional(),
  hints: hintsSchema.optional(),
  filePath: Z.string().optional(),
  triggerType: Z.enum(["cli", "ci"]).optional(),
});

const estimateItemsSchema = Z.array(
  Z.object({
    targetLocale: normalizedLocaleCodeSchema,
    sourceChars: Z.number().int().nonnegative(),
  }),
).min(1);

/**
 * Approximate localization cost returned by `/process/estimate`.
 * `approximate` is always true — the estimate is a chars→tokens heuristic,
 * not a quote. Actual cost may differ.
 */
export type CostEstimate = {
  approximate: boolean;
  totals: {
    sourceChars: number;
    estimatedOutputTokens: number;
    estimatedLlmCostUsd: number;
    estimatedLocalizationCostUsd: number;
    estimatedTotalCostUsd: number;
  };
  byLocale: {
    targetLocale: string;
    sourceChars: number;
    estimatedOutputTokens: number;
    estimatedCostUsd: number;
  }[];
};

/**
 * LingoDotDevEngine class for interacting with the LingoDotDev API
 * A powerful localization engine that supports various content types including
 * plain text, objects, chat sequences, and HTML documents.
 */
export class LingoDotDevEngine {
  protected config: Z.infer<typeof engineParamsSchema>;

  private readonly sessionId = createId();

  private get headers(): Record<string, string> {
    return {
      "Content-Type": "application/json; charset=utf-8",
      "X-API-Key": this.config.apiKey,
    };
  }

  private static async extractErrorMessage(res: Response): Promise<string> {
    try {
      const text = await res.text();
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed.message === "string") {
        return parsed.message;
      }
      if (parsed?._tag === "NotFoundError") {
        return `${parsed.entityType} not found: ${parsed.id}`;
      }
      return text;
    } catch {
      return `Unexpected error (${res.status})`;
    }
  }

  private static async throwOnHttpError(
    res: Response,
    context?: string,
  ): Promise<void> {
    if (res.ok) return;
    const msg = await LingoDotDevEngine.extractErrorMessage(res);
    if (res.status >= 500 && res.status < 600) {
      throw new Error(
        `Server error (${res.status}): ${msg}. This may be due to temporary service issues.`,
      );
    }
    if (res.status === 400) {
      throw new Error(`Invalid request: ${msg}`);
    }
    throw new Error(context ? `${context}: ${msg}` : msg);
  }

  /**
   * Sleep for `ms` milliseconds, rejecting early if the signal is aborted.
   */
  private static sleep(ms: number, signal?: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
      if (signal?.aborted) {
        reject(new Error("Operation was aborted"));
        return;
      }
      const onAbort = () => {
        clearTimeout(timer);
        reject(new Error("Operation was aborted"));
      };
      const timer = setTimeout(() => {
        signal?.removeEventListener("abort", onAbort);
        resolve();
      }, ms);
      signal?.addEventListener("abort", onAbort, { once: true });
    });
  }

  /**
   * Exponential backoff with full jitter: a random delay in
   * `[0, retryDelayMs * 2 ** attempt]`. Jitter spreads out retries from many
   * clients so a recovering server is not hit by a synchronized wave.
   */
  private backoffDelay(attempt: number): number {
    const ceiling = this.config.retryDelayMs * 2 ** attempt;
    return Math.round(Math.random() * ceiling);
  }

  /**
   * Perform a fetch, retrying on transient failures (5xx responses and
   * network errors) with exponential backoff. The retry decision is made on
   * the HTTP status code (>= 500), so non-retryable responses (e.g. 4xx) are
   * returned immediately for the caller to handle. Aborted requests are never
   * retried.
   * @param url - The request URL
   * @param init - Fetch init options (should include the AbortSignal)
   * @param signal - Optional AbortSignal used to short-circuit retries
   * @returns The fetch Response (which may still be a non-retryable error)
   */
  private async fetchWithRetry(
    url: string,
    init: RequestInit,
    signal?: AbortSignal,
  ): Promise<Response> {
    const { maxRetries } = this.config;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      if (signal?.aborted) {
        throw new Error("Operation was aborted");
      }

      try {
        const res = await fetch(url, init);

        const isServerError = res.status >= 500 && res.status < 600;
        if (isServerError && attempt < maxRetries) {
          // Drain the body we are about to discard so the underlying
          // connection is released back to the pool before we retry.
          await res.body?.cancel();
          await LingoDotDevEngine.sleep(this.backoffDelay(attempt), signal);
          continue;
        }

        return res;
      } catch (error) {
        // Aborts are intentional - never retry them.
        if (signal?.aborted) {
          throw error;
        }
        // Network/transport error: retry while attempts remain.
        if (attempt < maxRetries) {
          await LingoDotDevEngine.sleep(this.backoffDelay(attempt), signal);
          continue;
        }
        throw error;
      }
    }

    // The loop always returns or throws on the final attempt; this satisfies
    // the return type and guards against an unexpected fall-through.
    throw new Error("Localization request failed after exhausting retries");
  }

  /**
   * Create a new LingoDotDevEngine instance
   * @param config - Configuration options for the Engine
   */
  constructor(config: Partial<Z.infer<typeof engineParamsSchema>>) {
    this.config = engineParamsSchema.parse(config);
  }

  /**
   * Localize content using the Lingo.dev API
   * @param payload - The content to be localized
   * @param params - Localization parameters including source/target locales and fast mode option
   * @param progressCallback - Optional callback function to report progress (0-100)
   * @param signal - Optional AbortSignal to cancel the operation
   * @returns Localized content
   * @internal
   */
  async _localizeRaw(
    payload: Z.infer<typeof payloadSchema>,
    params: Z.infer<typeof localizationParamsSchema>,
    progressCallback?: (
      progress: number,
      sourceChunk: Record<string, string>,
      processedChunk: Record<string, string>,
    ) => void,
    signal?: AbortSignal,
  ): Promise<Record<string, string>> {
    const finalPayload = payloadSchema.parse(payload);
    const finalParams = localizationParamsSchema.parse(params);

    const chunkedPayload = this.extractPayloadChunks(finalPayload);
    const processedPayloadChunks: Record<string, string>[] = [];

    for (let i = 0; i < chunkedPayload.length; i++) {
      const chunk = chunkedPayload[i];
      const percentageCompleted = Math.round(
        ((i + 1) / chunkedPayload.length) * 100,
      );

      const processedPayloadChunk = await this.localizeChunk(
        finalParams.sourceLocale,
        finalParams.targetLocale,
        { data: chunk, reference: finalParams.reference, hints: params.hints },
        params.fast || false,
        params.filePath,
        params.triggerType,
        signal,
      );

      if (progressCallback) {
        progressCallback(percentageCompleted, chunk, processedPayloadChunk);
      }

      processedPayloadChunks.push(processedPayloadChunk);
    }

    return Object.assign({}, ...processedPayloadChunks);
  }

  /**
   * Localize a single chunk of content
   * @param sourceLocale - Source locale
   * @param targetLocale - Target locale
   * @param payload - Payload containing the chunk to be localized
   * @param fast - Whether to use fast mode
   * @param filePath - Optional file path for metadata
   * @param triggerType - Optional trigger type
   * @param signal - Optional AbortSignal to cancel the operation
   * @returns Localized chunk
   */
  private async localizeChunk(
    sourceLocale: string | null,
    targetLocale: string,
    payload: {
      data: Z.infer<typeof payloadSchema>;
      reference?: Z.infer<typeof referenceSchema>;
      hints?: Z.infer<typeof hintsSchema>;
    },
    fast: boolean,
    filePath?: string,
    triggerType?: "cli" | "ci",
    signal?: AbortSignal,
  ): Promise<Record<string, string>> {
    const url = `${this.config.apiUrl}/process/localize`;

    const body = {
      params: { fast },
      sourceLocale,
      targetLocale,
      data: payload.data,
      reference: payload.reference,
      hints: payload.hints,
      sessionId: this.sessionId,
      triggerType,
      metadata: filePath ? { filePath } : undefined,
      ...(this.config.engineId && { engineId: this.config.engineId }),
    };

    const res = await this.fetchWithRetry(
      url,
      {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(body, null, 2),
        signal,
      },
      signal,
    );

    await LingoDotDevEngine.throwOnHttpError(res);

    const jsonResponse = await res.json();

    // when streaming the error is returned in the response body
    if (!jsonResponse.data && jsonResponse.error) {
      throw new Error(jsonResponse.error);
    }

    return jsonResponse.data || {};
  }

  /**
   * Extract payload chunks based on the ideal chunk size
   * @param payload - The payload to be chunked
   * @returns An array of payload chunks
   */
  private extractPayloadChunks(
    payload: Record<string, string>,
  ): Record<string, string>[] {
    const result: Record<string, string>[] = [];
    let currentChunk: Record<string, string> = {};
    let currentChunkItemCount = 0;

    const payloadEntries = Object.entries(payload);
    for (let i = 0; i < payloadEntries.length; i++) {
      const [key, value] = payloadEntries[i];
      currentChunk[key] = value;
      currentChunkItemCount++;

      const currentChunkSize = this.countWordsInRecord(currentChunk);
      if (
        currentChunkSize > this.config.idealBatchItemSize ||
        currentChunkItemCount >= this.config.batchSize ||
        i === payloadEntries.length - 1
      ) {
        result.push(currentChunk);
        currentChunk = {};
        currentChunkItemCount = 0;
      }
    }

    return result;
  }

  /**
   * Count words in a record or array
   * @param payload - The payload to count words in
   * @returns The total number of words
   */
  private countWordsInRecord(
    payload: any | Record<string, any> | Array<any>,
  ): number {
    if (Array.isArray(payload)) {
      return payload.reduce(
        (acc, item) => acc + this.countWordsInRecord(item),
        0,
      );
    } else if (typeof payload === "object" && payload !== null) {
      return Object.values(payload).reduce(
        (acc: number, item) => acc + this.countWordsInRecord(item),
        0,
      );
    } else if (typeof payload === "string") {
      return payload.trim().split(/\s+/).filter(Boolean).length;
    } else {
      return 0;
    }
  }

  /**
   * Localize a typical JavaScript object
   * @param obj - The object to be localized (strings will be extracted and translated)
   * @param params - Localization parameters:
   *   - sourceLocale: The source language code (e.g., 'en')
   *   - targetLocale: The target language code (e.g., 'es')
   *   - fast: Optional boolean to enable fast mode (faster but potentially lower quality)
   * @param progressCallback - Optional callback function to report progress (0-100)
   * @param signal - Optional AbortSignal to cancel the operation
   * @returns A new object with the same structure but localized string values
   */
  async localizeObject(
    obj: Record<string, any>,
    params: Z.infer<typeof localizationParamsSchema>,
    progressCallback?: (
      progress: number,
      sourceChunk: Record<string, string>,
      processedChunk: Record<string, string>,
    ) => void,
    signal?: AbortSignal,
  ): Promise<Record<string, any>> {
    const trackProps = {
      method: "localizeObject",
      sourceLocale: params.sourceLocale,
      targetLocale: params.targetLocale,
    };
    trackEvent(
      this.config.apiKey,
      this.config.apiUrl,
      TRACKING_EVENTS.LOCALIZE_START,
      trackProps,
    );
    try {
      const result = await this._localizeRaw(
        obj,
        params,
        progressCallback,
        signal,
      );
      trackEvent(
        this.config.apiKey,
        this.config.apiUrl,
        TRACKING_EVENTS.LOCALIZE_SUCCESS,
        trackProps,
      );
      return result;
    } catch (error) {
      trackEvent(
        this.config.apiKey,
        this.config.apiUrl,
        TRACKING_EVENTS.LOCALIZE_ERROR,
        {
          ...trackProps,
          errorMessage: error instanceof Error ? error.message : String(error),
        },
      );
      throw error;
    }
  }

  /**
   * Localize a single text string
   * @param text - The text string to be localized
   * @param params - Localization parameters:
   *   - sourceLocale: The source language code (e.g., 'en')
   *   - targetLocale: The target language code (e.g., 'es')
   *   - fast: Optional boolean to enable fast mode (faster for bigger batches)
   * @param progressCallback - Optional callback function to report progress (0-100)
   * @param signal - Optional AbortSignal to cancel the operation
   * @returns The localized text string
   */
  async localizeText(
    text: string,
    params: Z.infer<typeof localizationParamsSchema>,
    progressCallback?: (progress: number) => void,
    signal?: AbortSignal,
  ): Promise<string> {
    const trackProps = {
      method: "localizeText",
      sourceLocale: params.sourceLocale,
      targetLocale: params.targetLocale,
    };
    trackEvent(
      this.config.apiKey,
      this.config.apiUrl,
      TRACKING_EVENTS.LOCALIZE_START,
      trackProps,
    );
    try {
      const response = await this._localizeRaw(
        { text },
        params,
        progressCallback,
        signal,
      );
      const result = response.text || "";
      trackEvent(
        this.config.apiKey,
        this.config.apiUrl,
        TRACKING_EVENTS.LOCALIZE_SUCCESS,
        trackProps,
      );
      return result;
    } catch (error) {
      trackEvent(
        this.config.apiKey,
        this.config.apiUrl,
        TRACKING_EVENTS.LOCALIZE_ERROR,
        {
          ...trackProps,
          errorMessage: error instanceof Error ? error.message : String(error),
        },
      );
      throw error;
    }
  }

  /**
   * Localize a text string to multiple target locales
   * @param text - The text string to be localized
   * @param params - Localization parameters:
   *   - sourceLocale: The source language code (e.g., 'en')
   *   - targetLocales: An array of target language codes (e.g., ['es', 'fr'])
   *   - fast: Optional boolean to enable fast mode (for bigger batches)
   * @param signal - Optional AbortSignal to cancel the operation
   * @returns An array of localized text strings
   */
  async batchLocalizeText(
    text: string,
    params: {
      sourceLocale: LocaleCode;
      targetLocales: LocaleCode[];
      fast?: boolean;
    },
    signal?: AbortSignal,
  ) {
    const responses = await Promise.all(
      params.targetLocales.map((targetLocale) =>
        this.localizeText(
          text,
          {
            sourceLocale: params.sourceLocale,
            targetLocale,
            fast: params.fast,
          },
          undefined,
          signal,
        ),
      ),
    );

    return responses;
  }

  /**
   * Localize an array of strings
   * @param strings - An array of strings to be localized
   * @param params - Localization parameters:
   *   - sourceLocale: The source language code (e.g., 'en')
   *   - targetLocale: The target language code (e.g., 'es')
   *   - fast: Optional boolean to enable fast mode (faster for bigger batches)
   * @returns An array of localized strings in the same order
   */
  async localizeStringArray(
    strings: string[],
    params: Z.infer<typeof localizationParamsSchema>,
  ): Promise<string[]> {
    const trackProps = {
      method: "localizeStringArray",
      sourceLocale: params.sourceLocale,
      targetLocale: params.targetLocale,
    };
    trackEvent(
      this.config.apiKey,
      this.config.apiUrl,
      TRACKING_EVENTS.LOCALIZE_START,
      trackProps,
    );
    try {
      const mapped = strings.reduce(
        (acc, str, i) => {
          acc[`item_${i}`] = str;
          return acc;
        },
        {} as Record<string, string>,
      );

      const result = await this._localizeRaw(mapped, params);
      trackEvent(
        this.config.apiKey,
        this.config.apiUrl,
        TRACKING_EVENTS.LOCALIZE_SUCCESS,
        trackProps,
      );
      return Object.values(result);
    } catch (error) {
      trackEvent(
        this.config.apiKey,
        this.config.apiUrl,
        TRACKING_EVENTS.LOCALIZE_ERROR,
        {
          ...trackProps,
          errorMessage: error instanceof Error ? error.message : String(error),
        },
      );
      throw error;
    }
  }

  /**
   * Localize a chat sequence while preserving speaker names
   * @param chat - Array of chat messages, each with 'name' and 'text' properties
   * @param params - Localization parameters:
   *   - sourceLocale: The source language code (e.g., 'en')
   *   - targetLocale: The target language code (e.g., 'es')
   *   - fast: Optional boolean to enable fast mode (faster but potentially lower quality)
   * @param progressCallback - Optional callback function to report progress (0-100)
   * @param signal - Optional AbortSignal to cancel the operation
   * @returns Array of localized chat messages with preserved structure
   */
  async localizeChat(
    chat: Array<{ name: string; text: string }>,
    params: Z.infer<typeof localizationParamsSchema>,
    progressCallback?: (progress: number) => void,
    signal?: AbortSignal,
  ): Promise<Array<{ name: string; text: string }>> {
    const trackProps = {
      method: "localizeChat",
      sourceLocale: params.sourceLocale,
      targetLocale: params.targetLocale,
    };
    trackEvent(
      this.config.apiKey,
      this.config.apiUrl,
      TRACKING_EVENTS.LOCALIZE_START,
      trackProps,
    );
    try {
      const mapped = chat.reduce(
        (acc, msg, i) => {
          acc[`chat_${i}`] = msg.text;
          return acc;
        },
        {} as Record<string, string>,
      );

      const localized = await this._localizeRaw(
        mapped,
        params,
        progressCallback,
        signal,
      );

      const result = Object.entries(localized).map(([key, value]) => ({
        name: chat[parseInt(key.split("_")[1])].name,
        text: value,
      }));
      trackEvent(
        this.config.apiKey,
        this.config.apiUrl,
        TRACKING_EVENTS.LOCALIZE_SUCCESS,
        trackProps,
      );
      return result;
    } catch (error) {
      trackEvent(
        this.config.apiKey,
        this.config.apiUrl,
        TRACKING_EVENTS.LOCALIZE_ERROR,
        {
          ...trackProps,
          errorMessage: error instanceof Error ? error.message : String(error),
        },
      );
      throw error;
    }
  }

  /**
   * Localize an HTML document while preserving structure and formatting
   * Handles both text content and localizable attributes (alt, title, placeholder, meta content)
   * @param html - The HTML document string to be localized
   * @param params - Localization parameters:
   *   - sourceLocale: The source language code (e.g., 'en')
   *   - targetLocale: The target language code (e.g., 'es')
   *   - fast: Optional boolean to enable fast mode (faster but potentially lower quality)
   * @param progressCallback - Optional callback function to report progress (0-100)
   * @param signal - Optional AbortSignal to cancel the operation
   * @returns The localized HTML document as a string, with updated lang attribute
   */
  async localizeHtml(
    html: string,
    params: Z.infer<typeof localizationParamsSchema>,
    progressCallback?: (progress: number) => void,
    signal?: AbortSignal,
  ): Promise<string> {
    const trackProps = {
      method: "localizeHtml",
      sourceLocale: params.sourceLocale,
      targetLocale: params.targetLocale,
    };
    trackEvent(
      this.config.apiKey,
      this.config.apiUrl,
      TRACKING_EVENTS.LOCALIZE_START,
      trackProps,
    );
    try {
      const jsdomPackage = await import("jsdom");
      const { JSDOM } = jsdomPackage;
      const dom = new JSDOM(html);
      const document = dom.window.document;

      const LOCALIZABLE_ATTRIBUTES: Record<string, string[]> = {
        meta: ["content"],
        img: ["alt"],
        input: ["placeholder"],
        a: ["title"],
      };
      const UNLOCALIZABLE_TAGS = ["script", "style"];

      const extractedContent: Record<string, string> = {};

      const getPath = (node: Node, attribute?: string): string => {
        const indices: number[] = [];
        let current = node as ChildNode;
        let rootParent = "";

        while (current) {
          const parent = current.parentElement as Element;
          if (!parent) break;

          if (parent === document.documentElement) {
            rootParent = current.nodeName.toLowerCase();
            break;
          }

          const siblings = Array.from(parent.childNodes).filter(
            (n) =>
              n.nodeType === 1 || (n.nodeType === 3 && n.textContent?.trim()),
          );
          const index = siblings.indexOf(current);
          if (index !== -1) {
            indices.unshift(index);
          }
          current = parent;
        }

        const basePath = rootParent
          ? `${rootParent}/${indices.join("/")}`
          : indices.join("/");
        return attribute ? `${basePath}#${attribute}` : basePath;
      };

      const processNode = (node: Node) => {
        let parent = node.parentElement;
        while (parent) {
          if (UNLOCALIZABLE_TAGS.includes(parent.tagName.toLowerCase())) {
            return;
          }
          parent = parent.parentElement;
        }

        if (node.nodeType === 3) {
          const text = node.textContent?.trim() || "";
          if (text) {
            extractedContent[getPath(node)] = text;
          }
        } else if (node.nodeType === 1) {
          const element = node as Element;
          const tagName = element.tagName.toLowerCase();

          const attributes = LOCALIZABLE_ATTRIBUTES[tagName] || [];
          attributes.forEach((attr) => {
            const value = element.getAttribute(attr);
            if (value) {
              extractedContent[getPath(element, attr)] = value;
            }
          });

          Array.from(element.childNodes)
            .filter(
              (n) =>
                n.nodeType === 1 || (n.nodeType === 3 && n.textContent?.trim()),
            )
            .forEach(processNode);
        }
      };

      Array.from(document.head.childNodes)
        .filter(
          (n) =>
            n.nodeType === 1 || (n.nodeType === 3 && n.textContent?.trim()),
        )
        .forEach(processNode);
      Array.from(document.body.childNodes)
        .filter(
          (n) =>
            n.nodeType === 1 || (n.nodeType === 3 && n.textContent?.trim()),
        )
        .forEach(processNode);

      const localizedContent = await this._localizeRaw(
        extractedContent,
        params,
        progressCallback,
        signal,
      );

      // Update the DOM with localized content
      document.documentElement.setAttribute("lang", params.targetLocale);

      Object.entries(localizedContent).forEach(([path, value]) => {
        const [nodePath, attribute] = path.split("#");
        const [rootTag, ...indices] = nodePath.split("/");

        let parent: Element =
          rootTag === "head" ? document.head : document.body;
        let current: Node | null = parent;

        for (const index of indices) {
          const siblings = Array.from(parent.childNodes).filter(
            (n) =>
              n.nodeType === 1 || (n.nodeType === 3 && n.textContent?.trim()),
          );
          current = siblings[parseInt(index)] || null;
          if (current?.nodeType === 1) {
            parent = current as Element;
          }
        }

        if (current) {
          if (attribute) {
            (current as Element).setAttribute(attribute, value);
          } else {
            current.textContent = value;
          }
        }
      });

      const result = dom.serialize();
      trackEvent(
        this.config.apiKey,
        this.config.apiUrl,
        TRACKING_EVENTS.LOCALIZE_SUCCESS,
        trackProps,
      );
      return result;
    } catch (error) {
      trackEvent(
        this.config.apiKey,
        this.config.apiUrl,
        TRACKING_EVENTS.LOCALIZE_ERROR,
        {
          ...trackProps,
          errorMessage: error instanceof Error ? error.message : String(error),
        },
      );
      throw error;
    }
  }

  /**
   * Detect the language of a given text
   * @param text - The text to analyze
   * @param signal - Optional AbortSignal to cancel the operation
   * @returns Promise resolving to a locale code (e.g., 'en', 'es', 'fr')
   */
  async recognizeLocale(
    text: string,
    signal?: AbortSignal,
  ): Promise<LocaleCode> {
    const trackProps = { method: "recognizeLocale" };
    trackEvent(
      this.config.apiKey,
      this.config.apiUrl,
      TRACKING_EVENTS.RECOGNIZE_START,
      trackProps,
    );
    try {
      const url = `${this.config.apiUrl}/process/recognize`;

      const response = await fetch(url, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({ text }),
        signal,
      });

      await LingoDotDevEngine.throwOnHttpError(
        response,
        "Error recognizing locale",
      );

      const jsonResponse = await response.json();
      trackEvent(
        this.config.apiKey,
        this.config.apiUrl,
        TRACKING_EVENTS.RECOGNIZE_SUCCESS,
        trackProps,
      );
      return jsonResponse.locale;
    } catch (error) {
      trackEvent(
        this.config.apiKey,
        this.config.apiUrl,
        TRACKING_EVENTS.RECOGNIZE_ERROR,
        {
          ...trackProps,
          errorMessage: error instanceof Error ? error.message : String(error),
        },
      );
      throw error;
    }
  }

  /**
   * Estimate the cost of localizing content BEFORE submitting it.
   * Pure computation server-side — nothing is translated, stored, or billed.
   * @param items - Per-target-locale character counts of translatable source
   * text (sum of source string lengths, excluding keys and markup). Duplicate
   * locales are summed by the server.
   * @param signal - Optional AbortSignal to cancel the operation
   * @returns Promise resolving to an approximate cost with per-locale breakdown
   */
  async estimate(
    items: { targetLocale: string; sourceChars: number }[],
    signal?: AbortSignal,
  ): Promise<CostEstimate> {
    const parsedItems = estimateItemsSchema.parse(items);
    const url = `${this.config.apiUrl}/process/estimate`;

    const res = await fetch(url, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({ items: parsedItems }),
      signal,
    });

    await LingoDotDevEngine.throwOnHttpError(res, "Error estimating cost");

    return res.json();
  }

  async whoami(
    signal?: AbortSignal,
  ): Promise<{ email: string; id: string } | null> {
    const url = `${this.config.apiUrl}/users/me`;

    const res = await fetch(url, {
      method: "GET",
      headers: this.headers,
      signal,
    });

    if (res.ok) {
      const payload = await res.json();
      if (!payload?.email) {
        return null;
      }

      return {
        email: payload.email,
        id: payload.id,
      };
    }

    if (res.status >= 500 && res.status < 600) {
      const msg = await LingoDotDevEngine.extractErrorMessage(res);
      throw new Error(
        `Server error (${res.status}): ${msg}. This may be due to temporary service issues.`,
      );
    }

    return null;
  }
}

/**
 * @deprecated Use LingoDotDevEngine instead. This class is maintained for backwards compatibility.
 */
export class ReplexicaEngine extends LingoDotDevEngine {
  private static hasWarnedDeprecation = false;

  constructor(config: Partial<Z.infer<typeof engineParamsSchema>>) {
    super(config);
    if (!ReplexicaEngine.hasWarnedDeprecation) {
      console.warn(
        "ReplexicaEngine is deprecated and will be removed in a future release. " +
          "Please use LingoDotDevEngine instead. " +
          "See https://lingo.dev/cli for more information.",
      );
      ReplexicaEngine.hasWarnedDeprecation = true;
    }
  }
}

/**
 * @deprecated Use LingoDotDevEngine instead. This class is maintained for backwards compatibility.
 */
export class LingoEngine extends LingoDotDevEngine {
  private static hasWarnedDeprecation = false;

  constructor(config: Partial<Z.infer<typeof engineParamsSchema>>) {
    super(config);
    if (!LingoEngine.hasWarnedDeprecation) {
      console.warn(
        "LingoEngine is deprecated and will be removed in a future release. " +
          "Please use LingoDotDevEngine instead. " +
          "See https://lingo.dev/cli for more information.",
      );
      LingoEngine.hasWarnedDeprecation = true;
    }
  }
}

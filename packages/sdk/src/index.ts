import Z from "zod";
import { LocaleCode, localeCodeSchema } from "@lingo.dev/_spec";
import { createId } from "@paralleldrive/cuid2";

const engineParamsSchema = Z.object({
  apiKey: Z.string(),
  apiUrl: Z.string().url().default("https://engine.lingo.dev"),
  batchSize: Z.number().int().gt(0).lte(250).default(25),
  idealBatchItemSize: Z.number().int().gt(0).lte(2500).default(250),
}).passthrough();

const payloadSchema = Z.record(Z.string(), Z.any());
const referenceSchema = Z.record(localeCodeSchema, payloadSchema);
const hintsSchema = Z.record(Z.string(), Z.array(Z.string()));

const localizationParamsSchema = Z.object({
  sourceLocale: Z.union([localeCodeSchema, Z.null()]),
  targetLocale: localeCodeSchema,
  fast: Z.boolean().optional(),
  reference: referenceSchema.optional(),
  hints: hintsSchema.optional(),
});

/**
 * LingoDotDevEngine class for interacting with the LingoDotDev API
 * A powerful localization engine that supports various content types including
 * plain text, objects, chat sequences, and HTML documents.
 */
export class LingoDotDevEngine {
  protected config: Z.infer<typeof engineParamsSchema>;

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

    const workflowId = createId();
    for (let i = 0; i < chunkedPayload.length; i++) {
      const chunk = chunkedPayload[i];
      const percentageCompleted = Math.round(
        ((i + 1) / chunkedPayload.length) * 100,
      );

      const processedPayloadChunk = await this.localizeChunk(
        finalParams.sourceLocale,
        finalParams.targetLocale,
        { data: chunk, reference: params.reference, hints: params.hints },
        workflowId,
        params.fast || false,
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
   * @param workflowId - Workflow ID for tracking
   * @param fast - Whether to use fast mode
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
    workflowId: string,
    fast: boolean,
    signal?: AbortSignal,
  ): Promise<Record<string, string>> {
    const res = await fetch(`${this.config.apiUrl}/i18n`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify(
        {
          params: { workflowId, fast },
          locale: {
            source: sourceLocale,
            target: targetLocale,
          },
          data: payload.data,
          reference: payload.reference,
          hints: payload.hints,
        },
        null,
        2,
      ),
      signal,
    });

    if (!res.ok) {
      if (res.status >= 500 && res.status < 600) {
        const errorText = await res.text();
        throw new Error(
          `Server error (${res.status}): ${res.statusText}. ${errorText}. This may be due to temporary service issues.`,
        );
      } else if (res.status === 400) {
        throw new Error(`Invalid request: ${res.statusText}`);
      } else {
        const errorText = await res.text();
        throw new Error(errorText);
      }
    }

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
    return this._localizeRaw(obj, params, progressCallback, signal);
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
    const response = await this._localizeRaw(
      { text },
      params,
      progressCallback,
      signal,
    );
    return response.text || "";
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
    const mapped = strings.reduce(
      (acc, str, i) => {
        acc[`item_${i}`] = str;
        return acc;
      },
      {} as Record<string, string>,
    );

    const result = await this.localizeObject(mapped, params);
    return Object.values(result);
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
    const localized = await this._localizeRaw(
      { chat },
      params,
      progressCallback,
      signal,
    );

    return Object.entries(localized).map(([key, value]) => ({
      name: chat[parseInt(key.split("_")[1])].name,
      text: value,
    }));
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
        (n) => n.nodeType === 1 || (n.nodeType === 3 && n.textContent?.trim()),
      )
      .forEach(processNode);
    Array.from(document.body.childNodes)
      .filter(
        (n) => n.nodeType === 1 || (n.nodeType === 3 && n.textContent?.trim()),
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

      let parent: Element = rootTag === "head" ? document.head : document.body;
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

    return dom.serialize();
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
    const response = await fetch(`${this.config.apiUrl}/recognize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({ text }),
      signal,
    });

    if (!response.ok) {
      if (response.status >= 500 && response.status < 600) {
        throw new Error(
          `Server error (${response.status}): ${response.statusText}. This may be due to temporary service issues.`,
        );
      }
      throw new Error(`Error recognizing locale: ${response.statusText}`);
    }

    const jsonResponse = await response.json();
    return jsonResponse.locale;
  }

  async whoami(
    signal?: AbortSignal,
  ): Promise<{ email: string; id: string } | null> {
    try {
      const res = await fetch(`${this.config.apiUrl}/whoami`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          ContentType: "application/json",
        },
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
        throw new Error(
          `Server error (${res.status}): ${res.statusText}. This may be due to temporary service issues.`,
        );
      }

      return null;
    } catch (error) {
      if (error instanceof Error && error.message.includes("Server error")) {
        throw error;
      }
      return null;
    }
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

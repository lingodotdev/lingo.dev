import dedent from "dedent";
import { ILocalizer, LocalizerData } from "./_types";
import chalk from "chalk";
import { colors } from "../constants";
import { getSettings } from "../utils/settings";
import { createId } from "@paralleldrive/cuid2";

/**
 * Creates a custom engine for Lingo.dev vNext that sends requests to:
 * https://api.lingo.dev/process/<processId>/localize
 */
function createVNextEngine(config: { apiKey: string; apiUrl: string; processId: string }) {
  const endpoint = `${config.apiUrl}/process/${config.processId}/localize`;

  return {
    async localizeChunk(
      sourceLocale: string | null,
      targetLocale: string,
      payload: {
        data: Record<string, any>;
        reference?: Record<string, Record<string, any>>;
        hints?: Record<string, string[]>;
      },
      workflowId: string,
      fast: boolean,
      signal?: AbortSignal,
    ): Promise<Record<string, string>> {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "X-API-Key": config.apiKey,
        },
        body: JSON.stringify(
          {
            params: { workflowId, fast },
            sourceLocale,
            targetLocale,
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

      if (!jsonResponse.data && jsonResponse.error) {
        throw new Error(jsonResponse.error);
      }

      return jsonResponse.data || {};
    },

    async whoami(signal?: AbortSignal): Promise<{ email: string; id: string } | null> {
      // vNext uses a simple response for whoami
      return { email: "vnext-user", id: config.processId };
    },

    async localizeObject(
      obj: Record<string, any>,
      params: {
        sourceLocale: string | null;
        targetLocale: string;
        fast?: boolean;
        reference?: Record<string, Record<string, any>>;
        hints?: Record<string, string[]>;
      },
      progressCallback?: (
        progress: number,
        sourceChunk: Record<string, string>,
        processedChunk: Record<string, string>,
      ) => void,
      signal?: AbortSignal,
    ): Promise<Record<string, string>> {
      const chunkedPayload = extractPayloadChunks(obj);
      const processedPayloadChunks: Record<string, string>[] = [];

      const workflowId = createId();
      for (let i = 0; i < chunkedPayload.length; i++) {
        const chunk = chunkedPayload[i];
        const percentageCompleted = Math.round(
          ((i + 1) / chunkedPayload.length) * 100,
        );

        const processedPayloadChunk = await this.localizeChunk(
          params.sourceLocale,
          params.targetLocale,
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
    },
  };
}

/**
 * Helper functions for chunking payloads
 */
function extractPayloadChunks(
  payload: Record<string, string>,
  batchSize: number = 25,
  idealBatchItemSize: number = 250,
): Record<string, string>[] {
  const result: Record<string, string>[] = [];
  let currentChunk: Record<string, string> = {};
  let currentChunkItemCount = 0;

  const payloadEntries = Object.entries(payload);
  for (let i = 0; i < payloadEntries.length; i++) {
    const [key, value] = payloadEntries[i];
    currentChunk[key] = value;
    currentChunkItemCount++;

    const currentChunkSize = countWordsInRecord(currentChunk);
    if (
      currentChunkSize > idealBatchItemSize ||
      currentChunkItemCount >= batchSize ||
      i === payloadEntries.length - 1
    ) {
      result.push(currentChunk);
      currentChunk = {};
      currentChunkItemCount = 0;
    }
  }

  return result;
}

function countWordsInRecord(
  payload: any | Record<string, any> | Array<any>,
): number {
  if (Array.isArray(payload)) {
    return payload.reduce(
      (acc, item) => acc + countWordsInRecord(item),
      0,
    );
  } else if (typeof payload === "object" && payload !== null) {
    return Object.values(payload).reduce(
      (acc: number, item) => acc + countWordsInRecord(item),
      0,
    );
  } else if (typeof payload === "string") {
    return payload.trim().split(/\s+/).filter(Boolean).length;
  } else {
    return 0;
  }
}

export default function createLingoDotDevVNextLocalizer(
  processId: string,
): ILocalizer {
  const settings = getSettings(undefined);

  // Use LINGO_API_KEY from environment or settings
  const apiKey = process.env.LINGO_API_KEY || settings.auth.vnext?.apiKey;

  if (!apiKey) {
    throw new Error(
      dedent`
        You're trying to use ${chalk.hex(colors.green)(
        "Lingo.dev vNext",
      )} provider, however, no API key is configured.

        To fix this issue:
        1. Set ${chalk.dim("LINGO_API_KEY")} environment variable, or
        2. Add the key to your ${chalk.dim("~/.lingodotdevrc")} file under ${chalk.dim("[auth.vnext]")} section.
      `,
    );
  }

  // Use LINGO_API_URL from environment or default to api.lingo.dev
  const apiUrl = process.env.LINGO_API_URL || "https://api.lingo.dev";

  const engine = createVNextEngine({
    apiKey,
    apiUrl,
    processId,
  });

  return {
    id: "Lingo.dev vNext",
    checkAuth: async () => {
      try {
        const response = await engine.whoami();
        return {
          authenticated: !!response,
          username: response?.email,
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        return { authenticated: false, error: errorMessage };
      }
    },
    localize: async (input: LocalizerData, onProgress) => {
      // Nothing to translate – return the input as-is.
      if (!Object.keys(input.processableData).length) {
        return input.processableData;
      }

      const processedData = await engine.localizeObject(
        input.processableData,
        {
          sourceLocale: input.sourceLocale,
          targetLocale: input.targetLocale,
          reference: {
            [input.sourceLocale]: input.sourceData,
            [input.targetLocale]: input.targetData,
          },
          hints: input.hints,
        },
        onProgress,
      );

      return processedData;
    },
  };
}

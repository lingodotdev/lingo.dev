/**
 * Extract payload chunks based on the ideal chunk size
 * @param payload - The payload to be chunked
 * @param batchSize - Max number of keys per chunk
 * @returns An array of payload chunks
 */
export function extractPayloadChunks(
  payload: Record<string, any>,
  batchSize?: number,
): Record<string, any>[] {
  const idealBatchItemSize = 250;
  const result: Record<string, any>[] = [];
  let currentChunk: Record<string, any> = {};
  let currentChunkItemCount = 0;

  const payloadEntries = Object.entries(payload);
  for (let i = 0; i < payloadEntries.length; i++) {
    const [key, value] = payloadEntries[i];
    currentChunk[key] = value;
    currentChunkItemCount++;

    const currentChunkSize = countWordsInRecord(currentChunk);
    const effectiveBatchSize = batchSize && batchSize > 0 ? batchSize : 25;
    if (
      currentChunkSize > idealBatchItemSize ||
      currentChunkItemCount >= effectiveBatchSize ||
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
export function countWordsInRecord(
  payload: any | Record<string, any> | Array<any>,
): number {
  if (Array.isArray(payload)) {
    return payload.reduce((acc, item) => acc + countWordsInRecord(item), 0);
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

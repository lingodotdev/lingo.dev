import crypto from "crypto";

/*
 * TODO
 *  If we find md5 too slow, we can use FNV-1a
 *  function generateHash(text: string): string {
 *    let hash = 2166136261;
 *    for (let i = 0; i < text.length; i++) {
 *      hash ^= text.charCodeAt(i);
 *      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 12);
 *    }
 *    return (hash >>> 0).toString(36).padStart(7, '0').slice(0, 12);
 *  }
 *
 */

/**
 * Generate a hash for a translation entry
 * Hash is based on: sourceText + componentName + filePath
 * This ensures that the same text in different components or files gets different hashes
 */
export function generateTranslationHash(
  sourceText: string,
  componentName: string,
  filePath: string,
): string {
  const input = `${sourceText}::${componentName}::${filePath}`;
  return crypto.createHash("md5").update(input).digest("hex").substring(0, 12); // Use first 12 chars for brevity
}

/**
 * Validate that a hash matches the expected format
 */
export function isValidHash(hash: string): boolean {
  return /^[a-f0-9]{12}$/.test(hash);
}

import crypto from "crypto";

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

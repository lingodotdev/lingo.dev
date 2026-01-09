/**
 * Pattern-based detection for plural candidates
 *
 * Uses heuristics to identify messages that might benefit from pluralization
 */

import type { PluralCandidate } from "./types";
import type { Logger } from "../../utils/logger";

// Anything that's not a variable name like is not expected.
const EXPRESSION_PATTERN = /\{(\w+)}/g;

/**
 * Detect plural candidates from a list of entries
 *
 * @param entries Map of hash -> source text
 * @returns Array of plural candidates
 */
export function detectPluralCandidates(
  entries: Record<string, string>,
  logger: Logger,
): PluralCandidate[] {
  const candidates: PluralCandidate[] = [];

  for (const [hash, sourceText] of Object.entries(entries)) {
    const match = sourceText.match(EXPRESSION_PATTERN);
    if (!match) {
      continue;
    }
    logger.debug(
      `Found ${match[1]} expression in: "${sourceText}. Text selected for pluralization."`,
    );
    candidates.push({
      hash,
      sourceText,
    });
  }

  return candidates;
}

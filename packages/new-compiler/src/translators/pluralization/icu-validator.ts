/**
 * ICU MessageFormat validator using FormatJS parser
 *
 * Uses the official ICU MessageFormat parser for validation instead of custom regex logic.
 * This ensures standards-compliant validation that matches runtime behavior.
 */
import { parse } from "@formatjs/icu-messageformat-parser";
import type { Logger } from "../../utils/logger";

/**
 * Validate and log result
 *
 * @param icuText ICU format text
 * @param originalText Original source text (for logging)
 * @param logger
 * @returns True if valid, false otherwise
 */
export function validateICU(
  icuText: string,
  originalText: string,
  logger: Logger,
): boolean {
  try {
    // I guess `new IntlMessageFormat(icuText, "locale")` could also be used, but it looks less obvious than using parser explicitly.
    parse(icuText, {
      ignoreTag: false, // Don't ignore HTML-like tags
      requiresOtherClause: true, // Require 'other' clause in plural/select
    });
    // LLM initially generated more validations. But validation for "other" clause is already done by the parser, and we care only about the validity of the message,
    // we do not require it to have the pluralization. We trust that LLM adds them where needed.
    logger.debug(`✓ ICU format valid for: "${originalText}"`);
    return true;
  } catch (error) {
    // Parser throws SyntaxError for invalid ICU syntax
    const errorMessage =
      error instanceof Error ? error.message : "Unknown parsing error";
    logger.warn(`✗ ICU format invalid for: "${originalText}"`);
    logger.warn(`  - ${errorMessage}`);
    return false;
  }
}

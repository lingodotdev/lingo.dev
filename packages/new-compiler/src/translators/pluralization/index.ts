/**
 * Pluralization service - Main entry point
 *
 * Detects messages that should be pluralized and converts them to ICU MessageFormat
 */

/**
 * Re-export types and utilities
 */
export type {
  PluralizationConfig,
  PluralizationStats,
  PluralCandidate,
  ICUGenerationResult,
} from "./types";
export { detectPluralCandidates } from "./pattern-detector";
export { PluralizationService } from "./service";
export { validateICU } from "./icu-validator";

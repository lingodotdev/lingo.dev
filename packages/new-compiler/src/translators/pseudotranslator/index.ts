/**
 * Pseudotranslator for testing without actual translation APIs
 */

import type { TranslatableEntry, Translator } from "../api";
import { Logger } from "../../utils/logger";
import type { LocaleCode } from "lingo.dev/spec";

export interface PseudoTranslatorConfig {
  delayMedian?: number;
}

/**
 * Pseudo-translator that uses pseudolocalization
 * Useful for testing i18n without actual translation APIs
 */
export class PseudoTranslator implements Translator<PseudoTranslatorConfig> {
  constructor(
    readonly config: PseudoTranslatorConfig,
    private readonly logger: Logger,
  ) {}

  translate(locale: LocaleCode, entries: Record<string, TranslatableEntry>) {
    this.logger.debug(
      `[TRACE-PSEUDO] translate() ENTERED for ${locale} with ${Object.keys(entries).length} entries`,
    );
    const delay = this.config?.delayMedian ?? 0;
    const actualDelay = this.getRandomDelay(delay);

    this.logger.debug(
      `[TRACE-PSEUDO] Config delay: ${delay}ms, actual delay: ${actualDelay}ms`,
    );

    return new Promise<Record<string, string>>((resolve) => {
      this.logger.debug(
        `[TRACE-PSEUDO] Promise created, scheduling setTimeout for ${actualDelay}ms`,
      );

      setTimeout(() => {
        this.logger.debug(
          `[TRACE-PSEUDO] setTimeout callback fired for ${locale}, processing entries`,
        );

        const result = Object.fromEntries(
          Object.entries(entries).map(([hash, entry]) => {
            return [hash, `${locale}/${pseudolocalize(entry.text)}`];
          }),
        );

        this.logger.debug(
          `[TRACE-PSEUDO] Pseudolocalization complete, resolving with ${Object.keys(result).length} translations`,
        );
        resolve(result);
        this.logger.debug(`[TRACE-PSEUDO] Promise resolved for ${locale}`);
      }, actualDelay);

      this.logger.debug(
        `[TRACE-PSEUDO] setTimeout scheduled, returning promise`,
      );
    });
  }

  private getRandomDelay(median: number): number {
    if (median === 0) return 0;
    // Generate random delay with distribution around median
    // Use a simple approach: median ± 50%
    const min = median * 0.5;
    const max = median * 1.5;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

/**
 * Character map for pseudolocalization
 */
const PSEUDO_MAP: Record<string, string> = {
  a: "á",
  b: "ḅ",
  c: "ç",
  d: "ḍ",
  e: "é",
  f: "ƒ",
  g: "ĝ",
  h: "ĥ",
  i: "í",
  j: "ĵ",
  k: "ḳ",
  l: "ĺ",
  m: "ṁ",
  n: "ñ",
  o: "ó",
  p: "ṗ",
  q: "ɋ",
  r: "ŕ",
  s: "ś",
  t: "ţ",
  u: "ú",
  v: "ṿ",
  w: "ŵ",
  x: "ẋ",
  y: "ý",
  z: "ẑ",
  A: "Á",
  B: "Ḅ",
  C: "Ç",
  D: "Ḍ",
  E: "É",
  F: "Ƒ",
  G: "Ĝ",
  H: "Ĥ",
  I: "Í",
  J: "Ĵ",
  K: "Ḳ",
  L: "Ĺ",
  M: "Ṁ",
  N: "Ñ",
  O: "Ó",
  P: "Ṗ",
  Q: "Ɋ",
  R: "Ŕ",
  S: "Ś",
  T: "Ţ",
  U: "Ú",
  V: "Ṿ",
  W: "Ŵ",
  X: "Ẋ",
  Y: "Ý",
  Z: "Ẑ",
};

/**
 * Pseudolocalize a string
 * Adds brackets, expands length by ~30%, and uses accented characters
 * Preserves variable placeholders {name} and component tags <a0>, </a0>
 */
export function pseudolocalize(text: string): string {
  // Don't pseudolocalize if it's just whitespace or a variable placeholder
  if (!text.trim() || text.match(/^{.*}$/)) {
    return text;
  }

  // Regular expression to match patterns we should NOT translate:
  // - Variable placeholders: {varName}
  // - Component tags: <tagName> or </tagName>
  const preserveRegex = /(\{\w+}|<\/?\w+\/?>)/g;

  // Split text into parts that should be preserved and parts that should be translated
  const parts: Array<{ text: string; preserve: boolean }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = preserveRegex.exec(text)) !== null) {
    // Add text before the match (to be translated)
    if (match.index > lastIndex) {
      parts.push({
        text: text.substring(lastIndex, match.index),
        preserve: false,
      });
    }

    // Add the matched pattern (to be preserved)
    parts.push({
      text: match[0],
      preserve: true,
    });

    lastIndex = preserveRegex.lastIndex;
  }

  // Add remaining text (to be translated)
  if (lastIndex < text.length) {
    parts.push({
      text: text.substring(lastIndex),
      preserve: false,
    });
  }

  // Convert characters in translatable parts only
  let result = "";
  for (const part of parts) {
    if (part.preserve) {
      // Keep placeholders and tags as-is
      result += part.text;
    } else {
      // Pseudolocalize the text
      for (const char of part.text) {
        result += PSEUDO_MAP[char] || char;
      }
    }
  }

  // Add padding to simulate longer translations (~30% longer)
  const padding = " ".repeat(Math.ceil(text.length * 0.3));

  // Wrap in brackets to identify translated strings
  return `${result}${padding}`;
}

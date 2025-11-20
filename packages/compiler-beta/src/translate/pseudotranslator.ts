/**
 * Pseudotranslator for testing without actual translation APIs
 */

import type { TranslatableEntry, Translator } from "./api";

/**
 * Pseudo-translator that uses pseudolocalization
 * Useful for testing i18n without actual translation APIs
 */
export class PseudoTranslator implements Translator<any> {
  constructor(readonly config: any) {}

  batchTranslate(locale: string, entries: Record<string, TranslatableEntry>) {
    return Promise.resolve(
      Object.fromEntries(
        Object.entries(entries).map(([hash, entry]) => {
          return [hash, `${locale}/${pseudolocalize(entry.text)}`];
        }),
      ),
    );
  }

  translate(locale: string, entry: TranslatableEntry): Promise<any> {
    return Promise.resolve(`${locale}/${pseudolocalize(entry.text)}`);
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
 */
export function pseudolocalize(text: string): string {
  // Don't pseudolocalize if it's just whitespace or a variable placeholder
  if (!text.trim() || text.match(/^{.*}$/)) {
    return text;
  }

  // Convert characters
  let result = "";
  for (const char of text) {
    result += PSEUDO_MAP[char] || char;
  }

  // Add padding to simulate longer translations (~30% longer)
  const padding = " ".repeat(Math.ceil(text.length * 0.3));

  // Wrap in brackets to identify translated strings
  return `[${result}${padding}]`;
}

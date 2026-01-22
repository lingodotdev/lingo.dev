
export interface SemanticPair {
  key: string;
  sourceText: string;
  targetText: string;
}

export function buildSemanticPairs(
  sourceTranslations: Record<string, string>,
  targetTranslations: Record<string, string>
): SemanticPair[] {
  const pairs: SemanticPair[] = [];

  if (!sourceTranslations || !targetTranslations) {
    return pairs;
  }

  for (const key of Object.keys(sourceTranslations)) {
    if (key in targetTranslations) {
      const sourceText = sourceTranslations[key];
      const targetText = targetTranslations[key];

      if (!sourceText || !targetText) continue;

      pairs.push({
        key,
        sourceText,
        targetText,
      });
    }
  }

  return pairs;
}

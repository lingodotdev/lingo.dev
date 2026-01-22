
interface MissingKey {
  key: string;
  sourceText: string;
}

export function findMissingKeys1(
  sourceTranslations: Record<string, string>,
  targetTranslations: Record<string, string>
): MissingKey[] {
  const missingKeys: MissingKey[] = [];

  if (!sourceTranslations || !targetTranslations) {
    return missingKeys;
  }

  for (const key of Object.keys(sourceTranslations)) {
    if (!(key in targetTranslations)) {
      missingKeys.push({
        key,
        sourceText: sourceTranslations[key],
      });
    }
  }

  return missingKeys;
}

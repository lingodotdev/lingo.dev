/**
 * Get provider and model for a specific locale pair
 */
export function getLocaleModel(
  localeModels: Record<string, string>,
  sourceLocale: string,
  targetLocale: string,
): { provider?: string; model?: string } {
  const localeKeys = [
    `${sourceLocale}:${targetLocale}`,
    `*:${targetLocale}`,
    `${sourceLocale}:*`,
    "*:*",
  ];

  const modelKey = localeKeys.find((key) => key in localeModels);
  if (!modelKey) {
    return { provider: undefined, model: undefined };
  }

  const value = localeModels[modelKey];
  if (!value) {
    return { provider: undefined, model: undefined };
  }

  // Split on first colon only
  const firstColonIndex = value.indexOf(":");
  if (firstColonIndex === -1) {
    return { provider: undefined, model: undefined };
  }

  const provider = value.substring(0, firstColonIndex);
  const model = value.substring(firstColonIndex + 1);

  if (!provider || !model) {
    return { provider: undefined, model: undefined };
  }

  return { provider, model };
}

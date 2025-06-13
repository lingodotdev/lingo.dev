export function getInvalidLocales(
  localeModels: Record<string, string>,
  sourceLocale: string,
  targetLocales: string[],
) {
  return targetLocales.filter((targetLocale) => {
    const { provider, model } = getLocaleModel(
      localeModels,
      sourceLocale,
      targetLocale,
    );

    return provider === undefined || model === undefined;
  });
}

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
  const modelKey = localeKeys.find((key) => localeModels.hasOwnProperty(key));
  if (modelKey) {
    const value = localeModels[modelKey];
    // Split only on the first colon
    const firstColonIndex = value?.indexOf(":");

    if (value && firstColonIndex !== -1 && firstColonIndex !== undefined) {
      const provider = value.substring(0, firstColonIndex);
      const model = value.substring(firstColonIndex + 1);

      if (provider && model) {
        return { provider, model };
      }
    }

    // Fallback for strings without a colon or other issues
    const [provider, model] = value?.split(":") || [];
    if (provider && model) {
      return { provider, model };
    }
  }
  return { provider: undefined, model: undefined };
}

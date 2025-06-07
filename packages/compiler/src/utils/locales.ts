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
    const [provider, model] = localeModels[modelKey]?.split(":");
    if (provider && model) {
      return { provider, model };
    }
  }
  return { provider: undefined, model: undefined };
}

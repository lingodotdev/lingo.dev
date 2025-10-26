/**
 * Loads a dictionary for the specified locale.
 *
 * This function attempts to load a dictionary using the provided loaders. If the specified
 * locale is not available, it falls back to the first available loader. The function
 * expects the loader to return a promise that resolves to an object with a `default` property
 * containing the dictionary data (the default export from dictionary file).
 *
 * @param locale - The locale to load the dictionary for. Can be null to use the first available loader.
 * @param loaders - A record of locale keys to loader functions. Each loader should return a Promise
 *                  that resolves to an object with a `default` property containing the dictionary.
 * @returns A Promise that resolves to the dictionary data (the `default` export from the loader).
 * @throws {Error} When no loaders are provided or available.
 *
 * @example
 * ```typescript
 * const loaders = {
 *   'en': () => import('./en.json'),
 *   'es': () => import('./es.json')
 * };
 *
 * const dictionary = await loadDictionary('en', loaders);
 * // Returns the default export from the English dictionary
 * ```
 */
export function getDictionary(
  locale: string | null,
  loaders: Record<string, () => Promise<any>> = {},
) {
  const loader = getDictionaryLoader(locale, loaders);
  if (!loader) {
    throw new Error("No available dictionary loaders found");
  }
  return loader().then((value) => value.default);
}

function getDictionaryLoader(
  locale: string | null,
  loaders: Record<string, () => Promise<any>> = {},
) {
  if (locale && loaders[locale]) {
    return loaders[locale];
  }
  return Object.values(loaders)[0];
}

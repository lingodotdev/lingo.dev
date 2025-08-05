/**
 * Data loader for locale names
 * Fetches CLDR data directly from GitHub raw URLs
 */

interface NameData {
  [key: string]: string;
}

// Cache for loaded data to avoid repeated fetches
const cache = new Map<string, NameData>();

/**
 * Loads country/territory names for a specific display language
 */
export async function loadTerritoryNames(
  displayLanguage: string,
): Promise<NameData> {
  const cacheKey = `territories-${displayLanguage}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  try {
    // Fetch from GitHub raw URL
    const response = await fetch(
      `https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-localenames-full/main/${displayLanguage}/territories.json`,
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const territories =
      data?.main?.[displayLanguage]?.localeDisplayNames?.territories || {};
    cache.set(cacheKey, territories);
    return territories;
  } catch (error) {
    // Fallback to English if the requested language is not available
    if (displayLanguage !== "en") {
      return loadTerritoryNames("en");
    }
    throw new Error(
      `Failed to load territory names for ${displayLanguage}: ${error}`,
    );
  }
}

/**
 * Loads language names for a specific display language
 */
export async function loadLanguageNames(
  displayLanguage: string,
): Promise<NameData> {
  const cacheKey = `languages-${displayLanguage}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  try {
    // Fetch from GitHub raw URL
    const response = await fetch(
      `https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-localenames-full/main/${displayLanguage}/languages.json`,
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const languages =
      data?.main?.[displayLanguage]?.localeDisplayNames?.languages || {};
    cache.set(cacheKey, languages);
    return languages;
  } catch (error) {
    // Fallback to English if the requested language is not available
    if (displayLanguage !== "en") {
      return loadLanguageNames("en");
    }
    throw new Error(
      `Failed to load language names for ${displayLanguage}: ${error}`,
    );
  }
}

/**
 * Loads script names for a specific display language
 */
export async function loadScriptNames(
  displayLanguage: string,
): Promise<NameData> {
  const cacheKey = `scripts-${displayLanguage}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  try {
    // Fetch from GitHub raw URL
    const response = await fetch(
      `https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-localenames-full/main/${displayLanguage}/scripts.json`,
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const scripts =
      data?.main?.[displayLanguage]?.localeDisplayNames?.scripts || {};
    cache.set(cacheKey, scripts);
    return scripts;
  } catch (error) {
    // Fallback to English if the requested language is not available
    if (displayLanguage !== "en") {
      return loadScriptNames("en");
    }
    throw new Error(
      `Failed to load script names for ${displayLanguage}: ${error}`,
    );
  }
}

/**
 * Data loader for locale names
 * Fetches CLDR data directly from GitHub raw URLs
 */

// Base URL for CLDR data from GitHub
const CLDR_BASE_URL =
  process.env.CLDR_BASE_URL ||
  "https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-localenames-full/main";

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
      `${CLDR_BASE_URL}/${displayLanguage}/territories.json`,
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
      console.warn(
        `Failed to load territory names for ${displayLanguage}, falling back to English`,
      );
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
      `${CLDR_BASE_URL}/${displayLanguage}/languages.json`,
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
      console.warn(
        `Failed to load language names for ${displayLanguage}, falling back to English`,
      );
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
      `${CLDR_BASE_URL}/${displayLanguage}/scripts.json`,
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const scripts =
      data?.main?.[displayLanguage]?.localeDisplayNames?.scripts || {};

    // Use longer form for Han scripts to match GitHub issue examples
    const enhancedScripts = { ...scripts };

    // Check for alternative Han script names
    if (scripts["Hans-alt-stand-alone"]) {
      enhancedScripts.Hans = scripts["Hans-alt-stand-alone"];
    }
    if (scripts["Hant-alt-stand-alone"]) {
      enhancedScripts.Hant = scripts["Hant-alt-stand-alone"];
    }

    cache.set(cacheKey, enhancedScripts);
    return enhancedScripts;
  } catch (error) {
    // Fallback to English if the requested language is not available
    if (displayLanguage !== "en") {
      console.warn(
        `Failed to load script names for ${displayLanguage}, falling back to English`,
      );
      return loadScriptNames("en");
    }
    throw new Error(
      `Failed to load script names for ${displayLanguage}: ${error}`,
    );
  }
}

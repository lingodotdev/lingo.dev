import { logger } from "../../utils/logger";

/**
 * Fetch translations from translation server
 * Times out after 30 seconds to prevent indefinite hangs
 */
export async function fetchTranslations(
  targetLocale: string,
  hashes: string[],
  serverUrl?: string,
): Promise<Record<string, string>> {
  if (!serverUrl) {
    return {};
  }
  if (!hashes || hashes.length === 0) {
    // This function is only called in dev mode and there is no need to fetch all the translations at once in dev mode
    return {};
  }
  const url = `${serverUrl}/translations/${targetLocale}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hashes }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.statusText}`);
    }

    // TODO (AleksandrSl 02/12/2025): Handle errors in the context.
    const result = await response.json();

    logger.debug(
      `Fetched translations for ${targetLocale}: ${JSON.stringify(result)}`,
    );

    // Server returns { locale, translations, errors }
    // Extract just the translations dictionary
    return result.translations || {};
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        `Translation request to ${targetLocale} timed out after 30 seconds`,
      );
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

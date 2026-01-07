import { expect, Page } from "@playwright/test";

export function getLocaleSwitcher(page: Page) {
  return page.getByTestId("lingo-locale-switcher").first();
}

/**
 * Framework-agnostic locale switching utility
 * Uses the LocaleSwitcher component (select element) to change locales
 */
export async function switchLocale(
  page: Page,
  targetLocale: string,
): Promise<void> {
  const select = getLocaleSwitcher(page);

  await select.selectOption(targetLocale);

  // Wait for the locale change to complete
  // This waits for any network requests to finish (e.g., translation file loading)
  await page.waitForLoadState("networkidle", { timeout: 10000 });
  expect(await getLanguageFromHtml(page)).toBe(targetLocale);
}

/**
 * Get the current locale from the page
 */
export async function getCurrentLocale(page: Page): Promise<string> {
  const select = getLocaleSwitcher(page);
  return await select.inputValue();
}

/**
 * Get the language from the HTML lang attribute
 */
export async function getLanguageFromHtml(page: Page): Promise<string | null> {
  const html = page.locator("html");
  return await html.getAttribute("lang");
}

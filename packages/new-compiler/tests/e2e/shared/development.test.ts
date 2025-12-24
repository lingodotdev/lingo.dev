import { expect, test } from "@playwright/test";
import {
  DevServer,
  findTranslationServerPort,
  setupFixture,
  type TestFixture,
} from "../../helpers/setup-fixture";
import {
  getCurrentLocale,
  switchLocale,
} from "../../helpers/locale-switcher"; /**
 * Development Mode Tests
 * These tests verify that the translation system works correctly in development mode
 */

/**
 * Development Mode Tests
 * These tests verify that the translation system works correctly in development mode
 */

test.describe.serial("Development Mode", () => {
  test.describe.serial("Next.js", () => {
    let fixture: TestFixture;
    let devServer: DevServer;

    test.beforeAll(async () => {
      fixture = await setupFixture({ framework: "next" });
      devServer = await fixture.startDev();
    });

    test.afterAll(async () => {
      // Stop dev server, then clean up
      if (devServer) {
        await devServer.stop();
        // Give Windows time to release file handles
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      await fixture?.clean();
    });

    test.beforeEach(async ({ page }) => {
      await page.goto(`http://localhost:${devServer.port}`);
    });

    test("should start translation server on dev", async ({}) => {
      const translationPort = await findTranslationServerPort();
      expect(translationPort).toBeGreaterThanOrEqual(60000);
      expect(translationPort).not.toBeNull();

      if (translationPort) {
        // Verify health endpoint
        const health = await fetch(
          `http://localhost:${translationPort}/health`,
        );
        expect(health.status).toBe(200);
      }
    });

    test("should generate translations on demand in dev", async ({ page }) => {
      // Navigate to app
      await page.goto(`http://localhost:${devServer.port}`);

      // Wait for page to load
      const initialHeading = page.getByRole("heading", { level: 1 });
      await expect(initialHeading).toBeVisible();
      const heading = await initialHeading.textContent();
      expect(heading).toBeTruthy();

      // Monitor translation requests
      const translationRequests: string[] = [];
      page.on("response", (response) => {
        const url = response.url();
        if (url.includes("/translations/") || url.includes(".json")) {
          translationRequests.push(url);
          console.log("Translation request:", url);
        }
      });

      console.log("Switching to German locale...");
      await switchLocale(page, "de");

      const germanHeading = await page
        .getByRole("heading", { level: 1 })
        .textContent();
      console.log("German heading:", germanHeading);
      expect(germanHeading).toBeTruthy();

      expect.soft(germanHeading).not.toEqual(heading);

      // Verify translation request was made (optional check)
      console.log("Translation requests:", translationRequests);
      expect(translationRequests).toHaveLength(1);
    });

    test("should handle hot reload with text changes", async ({ page }) => {
      await page.goto(`http://localhost:${devServer.port}`);

      const initialHeading = page.getByRole("heading", { level: 1 });
      await expect(initialHeading).toBeVisible();
      const initialText = await initialHeading.textContent();
      expect(initialText).toBeTruthy();

      // Modify the component (cleanup is automatic via fixture.updateFile)
      await fixture.updateFile("app/page.tsx", (content) => {
        // Add a new text element
        return content.replace(
          "</main>",
          '<p data-testid="hot-reload-test">Hot reload works!</p></main>',
        );
      });

      const newElement = await page
        .getByTestId("hot-reload-test")
        .textContent();
      expect(newElement).toBe("Hot reload works!");
    });
  });

  test.describe.serial("Vite", () => {
    let fixture: TestFixture;
    let devServer: DevServer;

    test.beforeAll(async () => {
      fixture = await setupFixture({ framework: "vite" });
      devServer = await fixture.startDev();
    });

    test.afterAll(async () => {
      if (devServer) {
        await devServer.stop();
        // Give Windows time to release file handles
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      await fixture?.clean();
    });

    test.beforeEach(async ({ page }) => {
      await page.goto(`http://localhost:${devServer.port}`);
    });

    test("should start vite dev server and render page", async ({ page }) => {
      // Navigate to app
      const initialHeading = page.getByRole("heading", { level: 1 });
      await expect(initialHeading).toBeVisible();

      const heading = await initialHeading.textContent();
      expect(heading).toContain("Welcome");
    });

    test("should switch locales and verify translation system", async ({
      page,
    }) => {
      const initialHeading = page.getByRole("heading", { level: 1 });
      console.log("Vite - Initial heading:", initialHeading);
      await expect(initialHeading).toBeVisible();
      const initialHeadingText = await initialHeading.textContent();

      // Switch to Spanish
      console.log("Vite - Switching to Spanish...");
      await switchLocale(page, "es");

      const spanishHeading = page.getByRole("heading", { level: 1 });
      console.log("Vite - Spanish heading:", spanishHeading);
      await expect(spanishHeading).toBeVisible();
      const spanishHeadingText = await spanishHeading.textContent();

      expect(spanishHeadingText).not.toEqual(initialHeadingText);
    });

    test("should navigate between pages and persist locale", async ({
      page,
    }) => {
      const initialHeading = page.getByRole("heading", { level: 1 });
      await expect(initialHeading).toBeVisible();
      const newLocale = "fr";

      // Switch to French
      console.log(`Vite - Switching to ${newLocale}...`);
      await switchLocale(page, newLocale);

      // Navigate to about page
      await page.getByTestId("about-link").click();
      const aboutHeading = page.getByRole("heading", { level: 1 });
      await expect(aboutHeading).toBeVisible();

      // Verify locale persisted
      const currentLocale = await getCurrentLocale(page);
      expect(currentLocale).toBe(newLocale);
    });
  });
});

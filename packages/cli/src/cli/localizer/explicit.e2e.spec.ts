import { describe, it, expect } from "vitest";
import createExplicitLocalizer from "./explicit";
import type { I18nConfig } from "@lingo.dev/_spec";

describe("Gemini 2.5 Flash Lite - Real API Integration", () => {
  // Skip if no API key is configured
  const apiKey = process.env.GOOGLE_API_KEY;

  it.skipIf(!apiKey)(
    "should handle Gemini 2.5 Flash Lite chatty responses",
    async () => {
      const config: I18nConfig = {
        provider: {
          id: "google",
          model: "gemini-2.5-flash-lite",
          prompt: "Translate from {source} to {target}",
        },
        locale: {
          source: "en",
          targets: ["es"],
        },
        buckets: {
          test: {
            include: ["test.json"],
          },
        },
      };

      const localizer = createExplicitLocalizer(config.provider!);

      const result = await localizer.localize({
        sourceLocale: "en",
        targetLocale: "es",
        processableData: {
          greeting: "Hello, world!",
          farewell: "Goodbye, friend!",
        },
      });

      // Verify we got valid translations
      expect(result.greeting).toBeDefined();
      expect(result.farewell).toBeDefined();

      // Verify translations are in Spanish
      expect(result.greeting).toContain("Hola");
      expect(result.farewell).toMatch(/adi[óo]s|Adi[óo]s/); // "adiós" or "Adiós"

      console.log("✅ Gemini 2.5 Flash Lite test passed!");
      console.log("   greeting:", result.greeting);
      console.log("   farewell:", result.farewell);
    },
    120000,
  );
});

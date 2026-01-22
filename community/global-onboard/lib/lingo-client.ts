import type { Locale } from "./i18n";

type TranslationResponse = {
  translated?: string;
  error?: string;
};

export async function translateWelcomeNote(
  text: string,
  targetLocale: Locale,
): Promise<string> {
  if (!text.trim() || targetLocale === "en") {
    return text;
  }

  const response = await fetch("/api/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, targetLocale }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as TranslationResponse;
    throw new Error(payload.error || "Translation request failed");
  }

  const payload = (await response.json()) as TranslationResponse;
  if (!payload.translated) {
    throw new Error(payload.error || "Translation unavailable");
  }

  return payload.translated;
}

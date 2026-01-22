import { useState } from "react";

export type TranslationResult = Record<string, { top: string; bottom: string }>;

interface TranslateParams {
  topText: string;
  bottomText: string;
  targetLocales: string[];
  tone: 'normal' | 'genz' | 'formal' | 'pirate';
  pseudoLocalize: boolean;
}

export function useTranslation() {
  const [isTranslating, setIsTranslating] = useState(false);

  const translate = async ({ topText, bottomText, targetLocales, tone, pseudoLocalize }: TranslateParams): Promise<TranslationResult> => {
    setIsTranslating(true);
    const results: TranslationResult = {};

    try {
      // Parallelize translation requests
      const promises = targetLocales.map(async (locale) => {
        let translatedTop = topText;
        let translatedBottom = bottomText;

        if (pseudoLocalize) {
          translatedTop = pseudoLocalizeText(topText);
          translatedBottom = pseudoLocalizeText(bottomText);
        } else {
          try {
            // Call our BACKEND proxy to solve CORS
            const context = tone !== 'normal' ? `Translate this meme text with a ${tone} tone.` : undefined;

            const [resTop, resBottom] = await Promise.all([
              fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: topText, targetLocale: locale, context })
              }).then(r => r.json()),
              fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: bottomText, targetLocale: locale, context })
              }).then(r => r.json())
            ]);

            translatedTop = resTop.translatedText || topText;
            translatedBottom = resBottom.translatedText || bottomText;

            // If backend says not configured, fall back to mock
            if (!resTop.translatedText && !resBottom.translatedText) {
              throw new Error("Backend translation not available");
            }

          } catch (e) {
            console.error(`Backend translation failed for ${locale}, falling back to mock.`, e);
            translatedTop = mockTranslate(topText, locale, tone);
            translatedBottom = mockTranslate(bottomText, locale, tone);
          }
        }

        results[locale] = { top: translatedTop, bottom: translatedBottom };
      });

      await Promise.all(promises);
      return results;
    } finally {
      setIsTranslating(false);
    }
  };

  return { translate, isTranslating };
}

// Helpers
function pseudoLocalizeText(text: string): string {
  if (!text) return "";
  const extended = text + " " + text.substring(0, Math.ceil(text.length * 0.3));
  return `[!!! ${extended.replace(/[aeiou]/g, (m) => m + '\u0301')} !!!]`;
}

function mockTranslate(text: string, locale: string, tone: string): string {
  if (!text) return "";

  const prefixes: Record<string, string> = {
    es: "El ", fr: "Le ", de: "Das ", hi: "नमस्ते ", ja: "こんにちは ", ar: "مرحبا ", ko: "안녕 ", pt: "O "
  };

  const toneSuffixes: Record<string, string> = {
    normal: "", genz: " fr fr no cap", formal: ", esteemed sir", pirate: ", arrgh matey!"
  };

  return `${prefixes[locale] || ''}${text}${toneSuffixes[tone] || ''} [${locale}]`;
}

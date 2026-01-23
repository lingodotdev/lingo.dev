"use client";

import { createContext, useEffect, useRef, useState } from "react";

export type Language = "en" | "es" | "fr" | "de" | "hi";

export type LingoContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  translate: (text: string) => string;
  isTranslating: boolean;
};

export const LingoContext = createContext<LingoContextType | null>(null);

export function LingoProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [isTranslating, setIsTranslating] = useState(false);
  const [, forceRender] = useState(0);

  const cacheRef = useRef<Record<string, string>>({});
  const pendingRef = useRef<Set<string>>(new Set());

  const translate = (text: string) => {
    console.log("Translating text:", text, "to language:", language);

    if (language === "en") return text;

    const key = `${language}:${text}`;

    if (cacheRef.current[key]) {
      return cacheRef.current[key];
    }

    // 🔑 THIS WAS MISSING
    pendingRef.current.add(text);

    return text;
  };

  useEffect(() => {
    if (language === "en") return;
    if (pendingRef.current.size === 0) return;

    const texts = Array.from(pendingRef.current);
    pendingRef.current.clear();

    console.log("[flush] sending API request", texts);

    setIsTranslating(true);

    Promise.all(
      texts.map(async (text) => {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, targetLocale: language }),
        });

        const data = await res.json();
        cacheRef.current[`${language}:${text}`] = data.translation;
      })
    ).finally(() => {
      setIsTranslating(false);
      forceRender(v => v + 1);
    });
  }, [language]);

  return (
    <LingoContext.Provider value={{ language, setLanguage, translate, isTranslating }}>
      {children}
    </LingoContext.Provider>
  );
}

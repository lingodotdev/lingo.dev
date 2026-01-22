"use client";

import { useEffect, useState } from "react";
import { translateText } from "../src/lib/lingo";
import { useLanguage } from "../src/context/LanguageContext";
import LanguageSwitcher from "../src/components/LanguageSwitcher";

export default function Home() {
  const { lang, setLang } = useLanguage();
  const [text, setText] = useState("Welcome to Lingo.dev Starter");
  const [loading, setLoading] = useState(false);

  // 1️⃣ Detect browser language ONCE
  useEffect(() => {
    const browserLang = navigator.language.slice(0, 2);
    const supportedLangs = ["en", "hi", "fr"];

    if (supportedLangs.includes(browserLang)) {
      setLang(browserLang as "en" | "hi" | "fr");
    }
  }, [setLang]);

  // 2️⃣ Translate when language changes
  useEffect(() => {
    async function translate() {
      if (lang === "en") {
        setText("Welcome to Lingo.dev Starter");
        return;
      }

      try {
        setLoading(true);
        const translated = await translateText(
          "Welcome to Lingo.dev Starter",
          lang
        );
        setText(translated);
      } catch (error) {
        console.error("Translation failed:", error);
        setText("Translation failed");
      } finally {
        setLoading(false);
      }
    }

    translate();
  }, [lang]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
      {/* Language Buttons */}
      <LanguageSwitcher />

      {/* Main Text */}
      <h1 className="text-4xl font-bold text-center">
        {loading ? "Translating..." : text}
      </h1>

      {/* Loading hint */}
      {loading && (
        <p className="text-sm text-gray-500 animate-pulse">
          Please wait...
        </p>
      )}

      {/* Description */}
      <p className="text-gray-600 max-w-md text-center">
        This demo shows how to integrate Lingo.dev with Next.js for
        dynamic multilingual support.
      </p>
    </main>
  );
}

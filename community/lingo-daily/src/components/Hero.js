"use client";

import { useState, useEffect } from "react";
// import { useLingoContext } from "@lingo.dev/compiler/react";

// Mock Lingo context
function useLingoContext() {
  const [locale, setLocale] = useState("en");
  useEffect(() => {
    const saved = localStorage.getItem("locale");
    if (saved) setLocale(saved);

    const handleStorage = () => {
      const saved = localStorage.getItem("locale");
      if (saved) setLocale(saved);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);
  return { locale };
}

export default function Hero({ articleCount }) {
  const { locale } = useLingoContext();

  const localeNames = {
    en: "English",
    es: "Spanish",
    de: "German",
    fr: "French",
    ja: "Japanese",
  };

  return (
    <div className="border-b border-border bg-gradient-to-b from-muted/50 to-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Daily News, Globally
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay informed with the latest news, powered by Lingo.dev for
            seamless multilingual experiences
          </p>
          <div className="pt-4">
            <p className="text-sm text-muted-foreground">
              Viewing {articleCount} articles in {localeNames[locale] || locale}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

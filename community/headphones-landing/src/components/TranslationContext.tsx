"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { defaultContent, type Content } from "../content";
import { translateContent } from "../actions/translate";

interface TranslationContextType {
  locale: string;
  setLocale: (locale: string) => void;
  content: Content;
  isLoading: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState("en");
  const [content, setContent] = useState<Content>(defaultContent);
  const [isLoading, setIsLoading] = useState(false);

  const setLocale = async (newLocale: string) => {
    if (newLocale === locale) return;
    
    setLocaleState(newLocale);
    
    if (newLocale === "en") {
      setContent(defaultContent);
      return;
    }

    setIsLoading(true);
    try {
      const translated = await translateContent(newLocale);
      setContent(translated);
    } catch (error) {
      console.error("Failed to translate:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TranslationContext.Provider value={{ locale, setLocale, content, isLoading }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
}

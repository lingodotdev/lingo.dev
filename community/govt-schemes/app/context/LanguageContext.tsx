"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext<any>({});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState("en");

  // Load saved language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("selectedLanguage");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Simple mock translation function
  const t = (key: string, params?: any) => {
    // Return a placeholder or the key for now
    // In a real app this would look up from a dictionary
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

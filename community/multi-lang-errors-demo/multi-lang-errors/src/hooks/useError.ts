import { useEffect, useState, useMemo } from "react";
import { getErrorStore } from "./initError";

export function useError(selectedLanguage: string = "en") {
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [currentLang, setCurrentLang] = useState("en");

  // Load store once
  const store = useMemo(() => getErrorStore(), []);

  useEffect(() => {
    const availableLanguages = Object.keys(store);

    const lang = availableLanguages.includes(selectedLanguage)
      ? selectedLanguage
      : "en";

    setCurrentLang(lang);
    setTranslations(store[lang] || {});
  }, [selectedLanguage, store]);

  const getError = (key: string) => translations[key] || key;

  const getLanguages = () => Object.keys(store);

  return {
    getError,
    getLanguages,
    currentLanguage: currentLang,
  };
}

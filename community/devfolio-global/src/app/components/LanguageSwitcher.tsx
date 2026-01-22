"use client";

import { useLingoContext } from "@lingo.dev/compiler/react";
import { useRouter } from "next/navigation";
type LocaleCode = "en" | "es" | "fr" | "ja";
export default function LanguageSwitcher() {
  const { setLocale, locale } = useLingoContext();
  const router = useRouter();
  const handleLanguageChange = (newLocale: LocaleCode) => {
    setLocale(newLocale);
    router.refresh();
  };
  const languages = [
    { code: "en", label: "🇺🇸 English" },
    { code: "es", label: "🇪🇸 Español" },
    { code: "fr", label: "🇫🇷 Français" },
    { code: "ja", label: "🇯🇵 日本語" },
  ] as const;

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            locale === lang.code
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
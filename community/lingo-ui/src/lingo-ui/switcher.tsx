"use client";

import { useLingo } from "./hooks";
import { Language } from "./provider";

const LANGUAGES: Language[] = ["en", "es", "fr", "de", "hi"];

export function LanguageSwitcher() {
  const { language, setLanguage } = useLingo();

  return (
    <div className="relative inline-block text-left">
      <select
        value={language}
        onChange={(e) => {
          setLanguage(e.target.value as Language)
          console.log("Language changed to:", e.target.value);
        }}
        className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-100 transition-all cursor-pointer hover:border-gray-300"
      >
        {LANGUAGES.map((lang) => (
        <option key={lang} value={lang}>
          {lang.toUpperCase()}
        </option>
      ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
}
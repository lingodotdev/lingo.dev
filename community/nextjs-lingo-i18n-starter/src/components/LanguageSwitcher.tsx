"use client";

import { useLanguage } from "../context/LanguageContext";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex gap-2">
      {["en", "hi", "fr"].map((l) => (
        <button
          key={l}
          onClick={() => setLang(l as any)}
          className={`px-4 py-2 rounded-xl border ${
            lang === l
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

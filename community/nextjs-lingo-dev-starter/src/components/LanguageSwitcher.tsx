"use client";

const LANGS = ["en", "hi", "es"] as const;

export default function LanguageSwitcher({
  value,
  onChange,
}: {
  value: string;
  onChange: (lang: string) => void;
}) {
  return (
    <div className="flex gap-2">
      {LANGS.map((lang) => (
        <button
          key={lang}
          onClick={() => onChange(lang)}
          className={`px-3 py-1 rounded border ${
            value === lang ? "bg-black text-white" : ""
          }`}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

"use client";

import { LocaleSwitcher } from "@lingo.dev/compiler/react";

interface LanguageSelectorProps {
  isScrolled?: boolean;
}

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "bn", label: "বাংলা" },
  { code: "te", label: "తెলుగు" },
  { code: "mr", label: "मराठी" },
  { code: "ta", label: "தமிழ்" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "ur", label: "اردو" },

  { code: "pa", label: "ਪੰਜਾਬੀ" },

  { code: "as", label: "অসমীয়া" },
  { code: "ks", label: "کٲشُر" },
  { code: "mai", label: "मैथिली" },
];

export function LanguageSelector({
  isScrolled = false,
}: LanguageSelectorProps) {
  return (
    <div className="relative">
      <LocaleSwitcher
        locales={languages as any}
        className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-9 px-3 ${
          isScrolled
            ? "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground text-gray-900 dark:text-gray-100"
            : "border border-white/20 bg-white/10 hover:bg-white/20 text-white"
        }`}
      />
    </div>
  );
}

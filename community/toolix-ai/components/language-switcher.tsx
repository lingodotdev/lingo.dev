"use client";

import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { useLingoContext, LocaleSwitcher } from "@lingo.dev/compiler/react";
import { Button } from "@/components/ui/button";

const locales = [
  { code: "en" as const, label: "English", flag: "🇺🇸" },
  { code: "es" as const, label: "Español", flag: "🇪🇸" },
  { code: "fr" as const, label: "Français", flag: "🇫🇷" },
  { code: "de" as const, label: "Deutsch", flag: "🇩🇪" },
  { code: "ja" as const, label: "日本語", flag: "🇯🇵" },
  { code: "hi" as const, label: "हिन्दी", flag: "🇮🇳" },
  { code: "zh-Hans" as const, label: "简体中文", flag: "🇨🇳" },
];

export function LanguageSwitcher() {
  const { locale, setLocale, isLoading } = useLingoContext();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLocaleData = locales.find((l) => l.code === locale);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocaleSelect = (code: typeof locales[number]["code"]) => {
    setLocale(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 hover:bg-primary/10"
        disabled={isLoading}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Globe className="size-4" />
        <span className="text-sm">
          {currentLocaleData?.flag} {currentLocaleData?.label || "English"}
        </span>
      </Button>
      {isOpen && (
        <div className="absolute right-0 top-full pt-1 z-[100]">
          <div className="bg-card border rounded-lg shadow-lg min-w-40">
            {locales.map((loc) => (
              <button
                key={loc.code}
                onClick={() => handleLocaleSelect(loc.code)}
                disabled={isLoading}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-primary/10 transition-colors flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${
                  locale === loc.code
                    ? "bg-primary/5 text-primary font-medium"
                    : ""
                }`}
              >
                <span>{loc.flag}</span>
                <span>{loc.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

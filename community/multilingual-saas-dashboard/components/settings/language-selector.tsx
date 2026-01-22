"use client";

import { Globe, Loader2, Check } from "lucide-react";
import { useTranslation, locales, localeNames } from "@/i18n";
import type { Locale } from "@/types";

export function LanguageSelector() {
  const { t, locale, setLocale, isTranslating } = useTranslation();

  const handleLanguageChange = (newLocale: Locale) => {
    if (!isTranslating) {
      setLocale(newLocale);
    }
  };

  return (
    <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-subtle)] p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-[var(--accent-subtle)] rounded-xl">
          {isTranslating ? (
            <Loader2 className="w-5 h-5 text-[var(--accent-text)] animate-spin" />
          ) : (
            <Globe className="w-5 h-5 text-[var(--accent-text)]" />
          )}
        </div>
        <div>
          <h3 className="text-base font-semibold text-[var(--text-primary)]">
            {t("settings.language.title")}
            {isTranslating && (
              <span className="ml-2 text-sm font-normal text-[var(--accent-text)]">
                ({t("common.translating")})
              </span>
            )}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            {t("settings.language.description")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {locales.map((loc) => (
          <button
            key={loc}
            onClick={() => handleLanguageChange(loc)}
            disabled={isTranslating}
            className={`
              flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ease-gentle
              ${isTranslating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              ${
                locale === loc
                  ? "border-[var(--accent-primary)] bg-[var(--accent-subtle)]"
                  : "border-[var(--border-default)] hover:border-[var(--border-default)] hover:bg-[var(--bg-hover)]"
              }
            `}
          >
            <span className="text-2xl">{getLanguageFlag(loc)}</span>
            <div className="text-left flex-1">
              <p
                className={`text-sm font-medium ${
                  locale === loc ? "text-[var(--accent-text)]" : "text-[var(--text-primary)]"
                }`}
              >
                {t(`languages.${loc}`)}
              </p>
              <p className="text-xs text-[var(--text-muted)]">{localeNames[loc]}</p>
            </div>
            {locale === loc && (
              <div className="w-5 h-5 bg-[var(--accent-primary)] rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function getLanguageFlag(locale: Locale): string {
  const flags: Record<Locale, string> = {
    en: "🇺🇸",
    hi: "🇮🇳",
    fr: "🇫🇷",
    es: "🇪🇸",
  };
  return flags[locale];
}

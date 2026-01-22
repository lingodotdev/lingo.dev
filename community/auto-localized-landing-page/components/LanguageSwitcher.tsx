"use client";

import {
  LOCALE_NAMES,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from "@/lib/types";

interface LanguageSwitcherProps {
  selectedLocale: SupportedLocale;
  onLocaleChange: (locale: SupportedLocale) => void;
  hasTranslations: boolean;
}

export function LanguageSwitcher({
  selectedLocale,
  onLocaleChange,
  hasTranslations,
}: LanguageSwitcherProps) {
  return (
    <div className="flex items-center gap-1">
      {SUPPORTED_LOCALES.map((locale) => {
        const isSelected = locale === selectedLocale;
        const isDisabled = !hasTranslations && locale !== "en";

        return (
          <button
            key={locale}
            onClick={() => onLocaleChange(locale)}
            disabled={isDisabled}
            className={`
              px-2.5 py-1 rounded text-xs font-medium
              ${
                isSelected
                  ? "bg-blue-600 text-white"
                  : isDisabled
                    ? "text-neutral-300 cursor-not-allowed"
                    : "text-neutral-600 hover:bg-neutral-100"
              }
            `}
            title={LOCALE_NAMES[locale]}
          >
            {locale.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}

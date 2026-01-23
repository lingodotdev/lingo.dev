// components/LanguageSwitcher.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Globe, Check } from "lucide-react";
import { useKeyboardShortcut } from "../hooks/useKeyboardShortcut";

interface LanguageSwitcherProps {
  currentLocale: string;
}

const locales = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
];

export default function LanguageSwitcher({
  currentLocale,
}: LanguageSwitcherProps) {
  const t = useTranslations("LocaleSwitcher");
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter locales based on search
  const filteredLocales = locales.filter(
    (locale) =>
      locale.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      locale.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Get current locale info
  const currentLocaleInfo =
    locales.find((locale) => locale.code === currentLocale) || locales[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Add this inside the LanguageSwitcher component
  useKeyboardShortcut(
    "l",
    () => {
      setIsOpen(true);
    },
    [],
  );

  const handleLocaleChange = (localeCode: string) => {
    if (localeCode === currentLocale) {
      setIsOpen(false);
      setSearchQuery("");
      return;
    }

    // Extract the path without the locale prefix
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, "") || "/";
    const newPath = `/${localeCode}${pathWithoutLocale}`;

    setIsOpen(false);
    setSearchQuery("");

    // Animate before navigation
    setTimeout(() => {
      router.push(newPath);
    }, 150);
  };

  const handleKeyDown = (e: React.KeyboardEvent, localeCode?: string) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setSearchQuery("");
    }
    if (e.key === "Enter" && localeCode) {
      handleLocaleChange(localeCode);
    }
    if (e.key === "ArrowDown" && isOpen) {
      e.preventDefault();
      const firstLocale = filteredLocales[0];
      if (firstLocale) {
        const element = document.getElementById(`locale-${firstLocale.code}`);
        element?.focus();
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Desktop Version */}
      <div className="hidden md:block">
        <button
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className="group flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
          aria-label={t("label")}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
              <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-left">
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {t("label")}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">{currentLocaleInfo.flag}</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {currentLocaleInfo.name}
                </span>
              </div>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50"
            >
              {/* Search Bar */}
              <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t("search")}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Language List */}
              <div className="max-h-80 overflow-y-auto">
                <div className="p-2">
                  {filteredLocales.length > 0 ? (
                    filteredLocales.map((locale) => (
                      <button
                        key={locale.code}
                        id={`locale-${locale.code}`}
                        onClick={() => handleLocaleChange(locale.code)}
                        onKeyDown={(e) => handleKeyDown(e, locale.code)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-150 ${
                          locale.code === currentLocale
                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                            : "hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                        role="option"
                        aria-selected={locale.code === currentLocale}
                        tabIndex={0}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{locale.flag}</span>
                          <div className="text-left">
                            <div className="font-medium">{locale.name}</div>
                            <div className="text-sm opacity-75">
                              ({locale.code.toUpperCase()})
                            </div>
                          </div>
                        </div>
                        {locale.code === currentLocale && (
                          <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <div className="text-gray-400 dark:text-gray-500 mb-2">
                        <svg
                          className="w-12 h-12 mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 font-medium">
                        {t("noResults")}
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                        {t("tryDifferent")}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    {t("count", {
                      count: filteredLocales.length,
                      total: locales.length,
                    })}
                  </span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                  >
                    {t("close")}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Version */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          aria-label={t("label")}
        >
          <span className="text-xl">{currentLocaleInfo.flag}</span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/50 z-40"
              />

              {/* Mobile Menu */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl z-50 p-6 max-h-[80vh] overflow-hidden flex flex-col"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t("selectLanguage")}
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <svg
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Current Language Display */}
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                  <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
                    {t("currentLanguage")}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{currentLocaleInfo.flag}</span>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">
                        {currentLocaleInfo.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {currentLocaleInfo.code.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Language List */}
                <div className="flex-1 overflow-y-auto mb-4">
                  <div className="grid grid-cols-2 gap-2">
                    {locales.map((locale) => (
                      <button
                        key={locale.code}
                        onClick={() => handleLocaleChange(locale.code)}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                          locale.code === currentLocale
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                      >
                        <span className="text-2xl">{locale.flag}</span>
                        <div className="text-left">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {locale.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {locale.code.toUpperCase()}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                    {t("switchingInfo")}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Keyboard Shortcut Hint */}
      <div className="hidden lg:block absolute -bottom-6 left-0 right-0 text-center">
        <div className="inline-flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">
          <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
            Alt
          </kbd>
          <span>+</span>
          <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
            L
          </kbd>
          <span className="ml-1">{t("shortcut")}</span>
        </div>
      </div>
    </div>
  );
}

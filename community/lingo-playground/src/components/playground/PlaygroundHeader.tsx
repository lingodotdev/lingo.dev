"use client";

import { useI18n } from "@/lib/I18nContext";
import { locales, Locale } from "@/data/locales";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/ThemeContext";

export function PlaygroundHeader() {
  const { locale, setLocale, t } = useI18n();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between pb-8 border-b border-slate-200 dark:border-slate-800 mb-8 gap-4">
      <div className="text-left w-full md:w-auto">
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">
          {t.hero.title}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
          {t.hero.subtitle}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap gap-2 bg-white dark:bg-slate-900 p-1 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
            {(Object.keys(locales) as Locale[]).map((l) => (
            <button
                key={l}
                onClick={() => setLocale(l)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
                locale === l
                    ? "text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
            >
                {locale === l && (
                <motion.div
                    layoutId="activeLocale"
                    className="absolute inset-0 bg-indigo-600 rounded-lg"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
                )}
                <span className="relative z-10 font-sans">
                {l === 'ar-SA' ? 'العربية' : l.split('-')[1]}
                </span>
            </button>
            ))}
        </div>

        <button 
            onClick={toggleTheme}
            className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-sm"
            aria-label="Toggle Theme"
        >
            {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )}
        </button>
      </div>
    </div>
  );
}

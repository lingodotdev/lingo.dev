"use client";

import { useTranslationStore } from "@/store/useTranslationStore";
import { motion, AnimatePresence } from "framer-motion";

export function TranslationStats() {
  const { sourceText, translations, translationTime } = useTranslationStore();

  const wordCount = sourceText.trim() ? sourceText.trim().split(/\s+/).length : 0;
  const charCount = sourceText.length;
  const completedCount = translations.filter((t) => !t.isLoading && t.text).length;

  if (!sourceText && translations.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-muted)]"
      >
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span><strong className="text-[var(--text-secondary)]">{wordCount}</strong> words</span>
        </div>

        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          <span><strong className="text-[var(--text-secondary)]">{charCount}</strong> chars</span>
        </div>

        {translations.length > 0 && (
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span>
              <strong className="text-[var(--text-secondary)]">{completedCount}</strong>/{translations.length} languages
            </span>
          </div>
        )}

        {translationTime && translationTime > 0 && (
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span><strong className="text-[var(--accent-primary)]">{(translationTime / 1000).toFixed(2)}s</strong></span>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

"use client";

import { useTranslationStore } from "@/store/useTranslationStore";
import { motion } from "framer-motion";

export function TranslationInput() {
  const {
    sourceText,
    setSourceText,
    sourceLanguage,
    detectedLanguage,
    isDetecting,
    isTranslating,
  } = useTranslationStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-6 relative overflow-hidden"
    >
      {/* Decorative corner accent */}
      <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-[var(--accent-primary)] to-transparent opacity-10 rounded-br-full" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{sourceLanguage?.flag || "🌐"}</span>
          <div>
            <h3 className="text-sm font-medium text-[var(--text-secondary)]">
              Source Language
            </h3>
            <p className="font-semibold">
              {sourceLanguage?.name || "Auto-detect"}
            </p>
          </div>
        </div>

        {isDetecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-sm text-[var(--accent-primary)]"
          >
            <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
            Detecting language...
          </motion.div>
        )}

        {detectedLanguage && !isDetecting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20"
          >
            <span className="text-sm">{detectedLanguage.flag}</span>
            <span className="text-sm text-[var(--accent-primary)]">
              Detected: {detectedLanguage.name}
            </span>
          </motion.div>
        )}
      </div>

      <div className="relative">
        <textarea
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          placeholder="Enter text to translate across the globe..."
          disabled={isTranslating}
          className="w-full h-40 bg-[var(--bg-primary)] rounded-xl p-4 text-lg resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/50 transition-all placeholder:text-[var(--text-muted)] disabled:opacity-50"
        />

        {/* Character count */}
        <div className="absolute bottom-3 right-3 text-xs text-[var(--text-muted)] font-mono">
          {sourceText.length} characters
        </div>
      </div>

      {/* Word visualization */}
      {sourceText && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 pt-4 border-t border-[var(--border-subtle)]"
        >
          <p className="text-xs text-[var(--text-muted)] mb-2 font-mono">
            WORDS TO TRANSLATE
          </p>
          <div className="flex flex-wrap gap-2">
            {sourceText
              .split(/\s+/)
              .filter(Boolean)
              .slice(0, 20)
              .map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="px-2 py-1 rounded-md bg-[var(--bg-tertiary)] text-sm font-mono"
                >
                  {word}
                </motion.span>
              ))}
            {sourceText.split(/\s+/).filter(Boolean).length > 20 && (
              <span className="px-2 py-1 text-sm text-[var(--text-muted)]">
                +{sourceText.split(/\s+/).filter(Boolean).length - 20} more
              </span>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

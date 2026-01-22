"use client";

import { Translation } from "@/store/useTranslationStore";
import { motion } from "framer-motion";
import { TextToSpeech } from "./TextToSpeech";

interface TranslationCardProps {
  translation: Translation;
  index: number;
}

export function TranslationCard({ translation, index }: TranslationCardProps) {
  const { language, text, isLoading, error } = translation;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="glass rounded-2xl p-5 relative overflow-hidden group hover:border-[var(--accent-primary)]/30 transition-all"
    >
      {/* Gradient accent on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative">
        <div className="flex items-center gap-3">
          <motion.span
            className="text-3xl"
            animate={isLoading ? { rotate: [0, 10, -10, 0] } : {}}
            transition={{ repeat: Infinity, duration: 0.5 }}
          >
            {language.flag}
          </motion.span>
          <div>
            <h3 className="font-semibold text-lg">{language.name}</h3>
            <p className="text-sm text-[var(--text-muted)]">
              {language.nativeName}
            </p>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2">
          {isLoading && (
            <motion.div
              className="flex gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-[var(--accent-primary)]"
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.6,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </motion.div>
          )}

          {!isLoading && text && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-6 h-6 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center"
            >
              <svg
                className="w-4 h-4 text-[var(--accent-primary)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        className={`relative min-h-[80px] ${language.fontClass || ""}`}
        dir={language.direction || "ltr"}
      >
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-4 bg-[var(--bg-tertiary)] rounded-lg animate-shimmer" />
            <div className="h-4 bg-[var(--bg-tertiary)] rounded-lg w-3/4 animate-shimmer" />
            <div className="h-4 bg-[var(--bg-tertiary)] rounded-lg w-1/2 animate-shimmer" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-[var(--accent-hot)]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        ) : text ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-lg leading-relaxed"
          >
            {text}
          </motion.p>
        ) : (
          <p className="text-[var(--text-muted)] italic">
            Translation will appear here...
          </p>
        )}
      </div>

      {/* Action buttons */}
      {text && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-4 right-4 flex items-center gap-2"
        >
          <TextToSpeech text={text} languageCode={language.code} />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigator.clipboard.writeText(text)}
            className="p-2 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--accent-primary)]/20 transition-colors group/btn"
          >
            <svg
              className="w-4 h-4 text-[var(--text-muted)] group-hover/btn:text-[var(--accent-primary)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </motion.button>
        </motion.div>
      )}

      {/* Language code badge */}
      <div className="absolute top-4 right-4 px-2 py-0.5 rounded text-xs font-mono text-[var(--text-muted)] bg-[var(--bg-primary)]/50">
        {language.code}
      </div>
    </motion.div>
  );
}

"use client";

import {
  useTranslationStore,
  LANGUAGES,
  Language,
} from "@/store/useTranslationStore";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function LanguageSelector() {
  const {
    sourceLanguage,
    setSourceLanguage,
    selectedTargetLanguages,
    toggleTargetLanguage,
  } = useTranslationStore();

  const [showSourcePicker, setShowSourcePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLanguages = LANGUAGES.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableTargetLanguages = LANGUAGES.filter(
    (lang) => lang.code !== sourceLanguage?.code
  );

  return (
    <div className="space-y-6">
      {/* Source Language Selector */}
      <div>
        <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-warm)]" />
          SOURCE LANGUAGE
        </h3>

        <div className="relative">
          <button
            onClick={() => setShowSourcePicker(!showSourcePicker)}
            className="w-full glass rounded-xl p-4 flex items-center justify-between hover:border-[var(--accent-primary)]/30 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{sourceLanguage?.flag || "🌐"}</span>
              <div className="text-left">
                <p className="font-medium">
                  {sourceLanguage?.name || "Auto-detect"}
                </p>
                <p className="text-sm text-[var(--text-muted)]">
                  {sourceLanguage?.nativeName || "Let AI detect the language"}
                </p>
              </div>
            </div>
            <motion.svg
              animate={{ rotate: showSourcePicker ? 180 : 0 }}
              className="w-5 h-5 text-[var(--text-muted)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </motion.svg>
          </button>

          <AnimatePresence>
            {showSourcePicker && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-50 top-full left-0 right-0 mt-2 glass rounded-xl overflow-hidden"
              >
                <div className="p-3 border-b border-[var(--border-subtle)]">
                  <input
                    type="text"
                    placeholder="Search languages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[var(--bg-primary)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/50"
                  />
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {/* Auto-detect option */}
                  <button
                    onClick={() => {
                      setSourceLanguage(null);
                      setShowSourcePicker(false);
                      setSearchQuery("");
                    }}
                    className="w-full p-3 flex items-center gap-3 hover:bg-[var(--bg-tertiary)] transition-colors"
                  >
                    <span className="text-xl">🌐</span>
                    <div className="text-left">
                      <p className="font-medium">Auto-detect</p>
                      <p className="text-xs text-[var(--text-muted)]">
                        Let AI detect the language
                      </p>
                    </div>
                  </button>

                  {filteredLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSourceLanguage(lang);
                        setShowSourcePicker(false);
                        setSearchQuery("");
                      }}
                      className={`w-full p-3 flex items-center gap-3 hover:bg-[var(--bg-tertiary)] transition-colors ${
                        sourceLanguage?.code === lang.code
                          ? "bg-[var(--accent-primary)]/10"
                          : ""
                      }`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <div className="text-left">
                        <p className="font-medium">{lang.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">
                          {lang.nativeName}
                        </p>
                      </div>
                      {sourceLanguage?.code === lang.code && (
                        <svg
                          className="w-5 h-5 text-[var(--accent-primary)] ml-auto"
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
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Target Languages */}
      <div>
        <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)]" />
          TARGET LANGUAGES
          <span className="ml-auto text-xs text-[var(--text-muted)]">
            {selectedTargetLanguages.length} selected
          </span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {availableTargetLanguages.map((lang) => {
            const isSelected = selectedTargetLanguages.some(
              (l) => l.code === lang.code
            );
            return (
              <motion.button
                key={lang.code}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleTargetLanguage(lang)}
                className={`p-3 rounded-xl text-left transition-all ${
                  isSelected
                    ? "bg-[var(--accent-primary)]/20 border border-[var(--accent-primary)]/40"
                    : "glass hover:border-[var(--accent-primary)]/20"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{lang.flag}</span>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{lang.name}</p>
                    <p className="text-xs text-[var(--text-muted)] truncate">
                      {lang.nativeName}
                    </p>
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto"
                    >
                      <svg
                        className="w-4 h-4 text-[var(--accent-primary)]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

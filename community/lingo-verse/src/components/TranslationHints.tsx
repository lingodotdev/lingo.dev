"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TranslationHintsProps {
  hints: string[];
  onHintsChange: (hints: string[]) => void;
  context: string;
  onContextChange: (context: string) => void;
}

export function TranslationHints({
  hints,
  onHintsChange,
  context,
  onContextChange,
}: TranslationHintsProps) {
  const [newHint, setNewHint] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const addHint = () => {
    if (newHint.trim() && !hints.includes(newHint.trim())) {
      onHintsChange([...hints, newHint.trim()]);
      setNewHint("");
    }
  };

  const removeHint = (hint: string) => {
    onHintsChange(hints.filter((h) => h !== hint));
  };

  const presetContexts = [
    { label: "Business", value: "professional business communication" },
    { label: "Casual", value: "friendly casual conversation" },
    { label: "Technical", value: "technical documentation for developers" },
    { label: "Marketing", value: "marketing copy for product promotion" },
    { label: "Legal", value: "formal legal document" },
    { label: "Medical", value: "medical and healthcare content" },
  ];

  return (
    <div className="space-y-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
      >
        <motion.svg
          animate={{ rotate: isExpanded ? 90 : 0 }}
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </motion.svg>
        <span className="font-medium">AI Context & Hints</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]">
          Pro Feature
        </span>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 overflow-hidden"
          >
            {/* Context selector */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-2">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Translation Context
              </label>
              <p className="text-xs text-[var(--text-muted)] mb-2">
                Help AI understand the context for more accurate translations
              </p>
              <div className="flex flex-wrap gap-2 mb-2">
                {presetContexts.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => onContextChange(preset.value)}
                    className={`px-2 py-1 text-xs rounded-md transition-all ${
                      context === preset.value
                        ? "bg-[var(--accent-primary)] text-[var(--bg-primary)]"
                        : "glass hover:border-[var(--accent-primary)]/30"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={context}
                onChange={(e) => onContextChange(e.target.value)}
                placeholder="Or describe the context manually..."
                className="w-full px-3 py-2 text-sm bg-[var(--bg-primary)] rounded-lg border border-[var(--border-subtle)] focus:outline-none focus:border-[var(--accent-primary)]/50"
              />
            </div>

            {/* Terminology hints */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-2">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Terminology Hints
              </label>
              <p className="text-xs text-[var(--text-muted)] mb-2">
                Add specific terms that should be preserved or translated in a specific way
              </p>
              
              {/* Existing hints */}
              {hints.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {hints.map((hint) => (
                    <motion.span
                      key={hint}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-[var(--bg-tertiary)]"
                    >
                      {hint}
                      <button
                        onClick={() => removeHint(hint)}
                        className="ml-1 text-[var(--text-muted)] hover:text-[var(--accent-hot)]"
                      >
                        ×
                      </button>
                    </motion.span>
                  ))}
                </div>
              )}

              {/* Add new hint */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newHint}
                  onChange={(e) => setNewHint(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addHint()}
                  placeholder="e.g., 'API' should remain 'API'"
                  className="flex-1 px-3 py-2 text-sm bg-[var(--bg-primary)] rounded-lg border border-[var(--border-subtle)] focus:outline-none focus:border-[var(--accent-primary)]/50"
                />
                <button
                  onClick={addHint}
                  className="px-3 py-2 text-sm rounded-lg bg-[var(--accent-primary)] text-[var(--bg-primary)] font-medium"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Info box */}
            <div className="p-3 rounded-lg bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20">
              <div className="flex gap-2 text-xs">
                <svg className="w-4 h-4 text-[var(--accent-primary)] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <div>
                  <p className="text-[var(--accent-primary)] font-medium mb-1">Why does this matter?</p>
                  <p className="text-[var(--text-muted)]">
                    Unlike basic translators, Lingo.dev's AI uses context to produce more accurate, 
                    natural-sounding translations. A "bank" in financial context is different from a river "bank"!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

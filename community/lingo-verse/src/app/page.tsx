"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslationStore } from "@/store/useTranslationStore";
import { TranslationInput } from "@/components/TranslationInput";
import { TranslationCard } from "@/components/TranslationCard";
import { LanguageSelector } from "@/components/LanguageSelector";
import { TranslateButton } from "@/components/TranslateButton";
import { ApiKeyModal } from "@/components/ApiKeyModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SamplePresets } from "@/components/SamplePresets";
import { TranslationStats } from "@/components/TranslationStats";
import { ExportButton } from "@/components/ExportButton";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { TranslationHints } from "@/components/TranslationHints";
import { ToneSelector } from "@/components/ToneSelector";
import { FeatureShowcase } from "@/components/FeatureShowcase";
import { GlobeModal } from "@/components/GlobeModal";

// Dynamic import for 3D Globe to avoid SSR issues
const Globe = dynamic(
  () => import("@/components/Globe").then((mod) => mod.Globe),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center">
        <div className="text-[var(--accent-primary)] animate-pulse">
          Loading Globe...
        </div>
      </div>
    ),
  }
);

export default function Home() {
  const { 
    translations, 
    setApiKey, 
    setShowApiKeyModal, 
    setSourceText, 
    clearTranslations,
    translationContext,
    setTranslationContext,
    translationHints,
    setTranslationHints,
    translationTone,
    setTranslationTone,
  } = useTranslationStore();

  // Keyboard shortcut handlers
  const handleTranslate = () => {
    const translateBtn = document.querySelector('[data-translate-btn]') as HTMLButtonElement;
    if (translateBtn && !translateBtn.disabled) {
      translateBtn.click();
    }
  };

  const handleClear = () => {
    setSourceText("");
    clearTranslations();
  };

  // Load API key from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedKey = localStorage.getItem("lingo-verse-api-key");
      if (savedKey) {
        setApiKey(savedKey);
      }
    }
  }, [setApiKey]);

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background gradient layers */}
      <div className="fixed inset-0 bg-[var(--bg-primary)]" />
      <div className="fixed inset-0 bg-gradient-to-br from-[var(--accent-primary)]/5 via-transparent to-[var(--accent-warm)]/5" />
      <div className="fixed inset-0 noise-overlay" />

      {/* Animated orbs */}
      <motion.div
        className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full bg-[var(--accent-primary)]/10 blur-[100px]"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="fixed bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[var(--accent-warm)]/10 blur-[100px]"
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 25,
          ease: "easeInOut",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-[var(--border-subtle)]">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
                <span className="text-xl">🌐</span>
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">Lingo Verse</h1>
                <p className="text-xs text-[var(--text-muted)]">
                  Global Translation Explorer
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <ThemeToggle />
              <button
                onClick={() => setShowApiKeyModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg glass hover:border-[var(--accent-primary)]/30 transition-all text-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
                API Key
              </button>
              <a
                href="https://lingo.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-[var(--bg-primary)] font-medium text-sm hover:opacity-90 transition-opacity"
              >
                Get Started
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </motion.div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Globe */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square max-h-[500px]"
            >
              <GlobeModal>
                <Globe />
              </GlobeModal>

              {/* Globe legend */}
              <div className="absolute bottom-4 left-4 glass rounded-lg p-3 text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-3 h-3 rounded-full bg-[var(--accent-warm)]" />
                  <span>Source</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[var(--accent-primary)]" />
                  <span>Target</span>
                </div>
              </div>
              
              {/* Click hint */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xs text-[var(--text-muted)] opacity-60">
                Click to expand
              </div>
            </motion.div>

            {/* Right: Content */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
                  Watch your words{" "}
                  <span className="gradient-text">travel the globe</span>
                </h2>
                <p className="text-lg text-[var(--text-secondary)]">
                  Experience real-time AI-powered translation with stunning
                  visuals. See how your message transforms across languages and
                  cultures.
                </p>
              </motion.div>

              {/* Language Selector */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <LanguageSelector />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Translation Section */}
        <section className="max-w-7xl mx-auto px-6 pb-12">
          {/* Keyboard shortcuts handler */}
          <KeyboardShortcuts onTranslate={handleTranslate} onClear={handleClear} />
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input */}
            <div className="space-y-6">
              <SamplePresets />
              <TranslationInput />
              <ToneSelector 
                selectedTone={translationTone} 
                onToneChange={setTranslationTone} 
              />
              <TranslationHints
                hints={translationHints}
                onHintsChange={setTranslationHints}
                context={translationContext}
                onContextChange={setTranslationContext}
              />
              <TranslationStats />
              <TranslateButton />
            </div>

            {/* Results */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)]" />
                  TRANSLATIONS
                  {translations.length > 0 && (
                    <span className="ml-2 text-xs text-[var(--text-muted)]">
                      {translations.filter((t) => !t.isLoading && t.text).length}{" "}
                      / {translations.length} complete
                    </span>
                  )}
                </h3>
                <ExportButton />
              </div>

              {translations.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass rounded-2xl p-12 text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-[var(--text-muted)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                      />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium mb-2">
                    Ready to translate
                  </h4>
                  <p className="text-sm text-[var(--text-muted)]">
                    Enter some text and select languages to see translations
                    appear here
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {translations.map((translation, index) => (
                    <TranslationCard
                      key={translation.language.code}
                      translation={translation}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Feature Showcase */}
        <section className="max-w-7xl mx-auto px-6 pb-12">
          <FeatureShowcase />
        </section>

        {/* Footer */}
        <footer className="border-t border-[var(--border-subtle)] mt-12">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <span>Built with</span>
                <a
                  href="https://lingo.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent-primary)] hover:underline font-medium"
                >
                  Lingo.dev SDK
                </a>
                <span>•</span>
                <span>Community Contribution</span>
              </div>

              <div className="flex items-center gap-4">
                <a
                  href="https://lingo.dev/go/discord"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </a>
                <a
                  href="https://github.com/lingodotdev/lingo.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* API Key Modal */}
      <ApiKeyModal />
    </main>
  );
}

'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TextInput from './components/TextInput';
import LanguageSelector from './components/LanguageSelector';
import ToneToggle from './components/ToneToggle';
import TranslationOutput from './components/TranslationOutput';

interface TranslationResult {
  literal: string;
  localized: string;
  highlights: Array<{
    original: string;
    literal: string;
    localized: string;
    reason: string;
  }>;
  explanation: string;
}

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [tone, setTone] = useState('genz');
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranslate = useCallback(async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          targetLanguage,
          tone,
        }),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Translation failed. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [inputText, targetLanguage, tone]);

  return (
    <div className="min-h-screen">
      {/* Background glow effects */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(circle at 20% 20%, rgba(0, 245, 212, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(155, 93, 229, 0.08) 0%, transparent 50%)',
        }}
      />

      {/* Hero Section */}
      <header className="relative pt-16 pb-8 px-6 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            className="inline-block mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="label label-accent">
              🚀 Built with lingo.dev
            </span>
          </motion.div>

          {/* Main headline - asymmetric typography */}
          <div className="mb-8">
            <h1 className="text-display-xl text-[var(--text-primary)] mb-2">
              Slang
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'var(--gradient-main)' }}
              >
                Shift
              </span>
            </h1>
            <motion.p
              className="text-display-md text-[var(--text-secondary)] max-w-2xl"
              style={{ marginLeft: 'clamp(0px, 5vw, 80px)' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Localization is not translation.
            </motion.p>
          </div>

          {/* Subheadline */}
          <motion.p
            className="text-body-lg text-[var(--text-secondary)] max-w-xl mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Transform internet slang into culturally-adapted translations.
            Because &quot;this slaps&quot; shouldn&apos;t translate to &quot;esto abofetea&quot;.
          </motion.p>

          {/* Floating slang examples */}
          <motion.div
            className="flex flex-wrap gap-3 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {['fr 💀', 'no cap', 'slay', 'hits different', 'lowkey fire 🔥'].map((slang, i) => (
              <motion.span
                key={slang}
                className="px-3 py-1.5 rounded-lg text-sm font-medium"
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                whileHover={{
                  y: -2,
                  borderColor: 'var(--accent-primary)',
                  color: 'var(--accent-primary)',
                }}
              >
                {slang}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </header>

      {/* Main Translator Section */}
      <main className="relative px-6 md:px-12 lg:px-24 pb-24">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="glass-card-accent p-6 md:p-8 lg:p-10"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {/* Input Section */}
            <div className="grid gap-8 lg:gap-10">
              {/* Text Input */}
              <TextInput
                value={inputText}
                onChange={setInputText}
                disabled={isLoading}
              />

              {/* Controls Row */}
              <div className="grid gap-6 md:grid-cols-2">
                <LanguageSelector
                  selected={targetLanguage}
                  onChange={setTargetLanguage}
                />
                <ToneToggle
                  selected={tone}
                  onChange={setTone}
                />
              </div>

              {/* Translate Button */}
              <div className="flex justify-center">
                <motion.button
                  className="btn-primary min-w-[200px]"
                  onClick={handleTranslate}
                  disabled={!inputText.trim() || isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    opacity: !inputText.trim() || isLoading ? 0.5 : 1,
                    cursor: !inputText.trim() || isLoading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isLoading ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        ⏳
                      </motion.span>
                      Translating...
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      Translate
                    </>
                  )}
                </motion.button>
              </div>

              {/* Error Display */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 rounded-lg bg-[rgba(255,107,107,0.1)] border border-[var(--accent-secondary)]"
                  >
                    <p className="text-[var(--accent-secondary)] text-sm">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Divider */}
              <div className="h-px bg-[var(--border-subtle)]" />

              {/* Output Section */}
              <TranslationOutput
                result={result}
                isLoading={isLoading}
                selectedTone={tone}
              />
            </div>
          </motion.div>
        </div>
      </main>

      {/* Manifesto Section */}
      <section className="relative px-6 md:px-12 lg:px-24 py-24 border-t border-[var(--border-subtle)]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-display-lg mb-8">
              Localization <span className="text-[var(--accent-secondary)]">≠</span> Translation
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-body-lg font-semibold text-[var(--text-primary)]">
                  What translation does:
                </h3>
                <ul className="space-y-2 text-[var(--text-secondary)]">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-secondary)]">✗</span>
                    Converts words one-by-one
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-secondary)]">✗</span>
                    Loses cultural context
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-secondary)]">✗</span>
                    &quot;This slaps&quot; → &quot;Esto abofetea&quot; 😬
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-body-lg font-semibold text-[var(--text-primary)]">
                  What localization does:
                </h3>
                <ul className="space-y-2 text-[var(--text-secondary)]">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">✓</span>
                    Adapts meaning and intent
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">✓</span>
                    Preserves cultural vibes
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-primary)]">✓</span>
                    &quot;This slaps&quot; → &quot;Esto está increíble&quot; ✨
                  </li>
                </ul>
              </div>
            </div>

            <motion.div
              className="mt-12 p-6 glass-card"
              whileHover={{ scale: 1.01 }}
            >
              <p className="text-body-lg text-[var(--text-secondary)] italic">
                &quot;lingo.dev understands that language is about <span className="text-[var(--accent-primary)]">culture</span>,
                not just <span className="text-[var(--text-muted)]">characters</span>.
                SlangShift exists to prove it.&quot;
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 md:px-12 lg:px-24 py-8 border-t border-[var(--border-subtle)]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-small text-[var(--text-muted)]">
            <a
              href="https://github.com/ayushpatil0810"
              target="_blank"
              rel="noopener noreferrer"
              className="text-small text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
            >
              Built By Ayush Patil
            </a>
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://lingo.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-small text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
            >
              Powered by lingo.dev
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

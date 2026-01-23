'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [emojis, setEmojis] = useState('');
  const [tone, setTone] = useState('comedy');
  const [length, setLength] = useState('short');
  const [locale, setLocale] = useState('te');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (text: string, type: 'story' | 'translation') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setError('Failed to copy. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emojis.trim()) {
      setError('Input required');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emojis, tone, length, locale }),
      });

      if (!res.ok) {
        let errorMessage = 'Failed to generate story';
        try {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await res.json();
            errorMessage = data.error || errorMessage;
          } else {
            errorMessage = await res.text();
          }
        } catch (e) {
          // Fallback if parsing fails
          errorMessage = `Server Error: ${res.status} ${res.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.03] pointer-events-none"></div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-3xl z-10 space-y-8"
      >
        {/* Header */}
        <motion.header variants={item} className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-sm text-[var(--secondary)] mb-2 uppercase tracking-wider font-bold">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)]"></span>
            <span>System Ready</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--primary)] flex items-center gap-3">
            Emoji_Story_Weaver<motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-4 h-8 bg-[var(--accent)] inline-block"
            />
          </h1>
          <p className="text-[var(--secondary)] text-lg max-w-md">
            Translate abstract emojis into coherent narratives using Lingo.dev
          </p>
        </motion.header>

        {/* Main Interface */}
        <motion.main variants={item} className="glass-panel rounded-xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Input Section */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-[var(--secondary)] uppercase tracking-wide flex justify-between">
                <span>[01] Input Sequence</span>
                <span className="text-[var(--accent)] opacity-80">Required *</span>
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={emojis}
                  onChange={(e) => setEmojis(e.target.value)}
                  placeholder="Paste emojis here... (e.g., 🚀🪐👽)"
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-5 py-4 text-xl outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all placeholder:text-[var(--border)] text-[var(--primary)] font-medium"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--border)] text-xs pointer-events-none group-focus-within:text-[var(--accent)] transition-colors">
                  ENTER_DATA
                </div>
              </div>
            </div>

            {/* Controls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: '[02] Tone', value: tone, setter: setTone, options: ['comedy', 'drama', 'epic', 'horror', 'romance'] },
                { label: '[03] Length', value: length, setter: setLength, options: ['short', 'medium', 'epic'] },
                {
                  label: ('[04] Language'), value: locale, setter: setLocale, options: [
                    { label: 'Spanish', value: 'es' },
                    { label: 'French', value: 'fr' },
                    { label: 'German', value: 'de' },
                    { label: 'Hindi', value: 'hi' },
                    { label: 'Telugu', value: 'te' },
                    { label: 'Tamil', value: 'ta' },
                    { label: 'Japanese', value: 'ja' },
                    { label: 'Korean', value: 'ko' },
                    { label: 'Chinese', value: 'zh' }
                  ]
                }
              ].map((field, i) => (
                <div key={i} className="space-y-3">
                  <label className="text-xs font-medium text-[var(--secondary)] uppercase tracking-wide">
                    {field.label}
                  </label>
                  <select
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm outline-none focus:border-[var(--accent)] transition-all cursor-pointer hover:bg-[var(--surface-hover)] appearance-none"
                  >
                    {field.options && typeof field.options[0] === 'object'
                      ? (field.options as { label: string, value: string }[]).map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))
                      : (field.options as string[]).map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))
                    }
                  </select>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--accent)] text-black font-bold py-4 rounded-lg uppercase tracking-widest text-sm hover:bg-[#ff8585] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_var(--accent-glow)] transform-gpu"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full" />
                  Processing...
                </span>
              ) : (
                'Initialize Sequence_ >'
              )}
            </motion.button>
          </form>

          {/* Feedback Area */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-4 bg-red-950/30 border border-red-900 rounded-lg text-red-400 text-sm font-medium flex items-center gap-3"
              >
                <span className="text-lg">!</span> {error}
              </motion.div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 space-y-6 pt-8 border-t border-[var(--border)]"
              >
                {/* Result Header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[var(--success)] uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
                    Generation Complete
                  </span>
                  <span className="text-xs text-[var(--border)]">{new Date().toLocaleTimeString()}</span>
                </div>


                {/* Story Card */}
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] uppercase text-[var(--secondary)]">Output.Story_File</span>
                    <button
                      onClick={() => handleCopy(result.story, 'story')}
                      className="text-[10px] uppercase text-[var(--accent)] hover:underline"
                    >
                      {copied === 'story' ? 'Copied!_' : 'Copy_'}
                    </button>
                  </div>
                  <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6 relative overflow-hidden group">
                    {/* Decorative corners */}
                    <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[var(--secondary)] opacity-50" />
                    <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[var(--secondary)] opacity-50" />

                    <p className="text-base leading-relaxed text-[var(--primary)]">
                      {result.story}
                    </p>
                  </div>
                </div>

                {/* Translation Card */}
                {result.translated && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] uppercase text-[var(--secondary)]">Output.Translation_File [{locale}]</span>
                      <button
                        onClick={() => handleCopy(
                          typeof result.translated === 'string' ? result.translated : result.translated[locale],
                          'translation'
                        )}
                        className="text-[10px] uppercase text-[var(--accent)] hover:underline"
                      >
                        {copied === 'translation' ? 'Copied!_' : 'Copy_'}
                      </button>
                    </div>
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6">
                      <p className="text-base leading-relaxed text-[var(--primary)] opacity-90">
                        {typeof result.translated === 'string' ? result.translated : result.translated[locale]}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>

        <motion.footer variants={item} className="text-center text-xs text-zinc-500 uppercase tracking-widest pt-8">
          System Operational • Powered by Lingo.dev
        </motion.footer>
      </motion.div>
    </div>
  );
}

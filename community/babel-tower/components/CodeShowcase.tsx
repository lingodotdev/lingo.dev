"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

export function CodeShowcase() {
  return (
    <section className="py-32 px-8 md:px-12 lg:px-16 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            See the <span className="gradient-text">Difference</span>
          </h2>
          <p className="text-xl text-gray-400">
            This page has zero translation functions. Look at the source code.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="flex items-center gap-2 mb-4">
              <X className="w-5 h-5 text-red-500" />
              <span className="text-red-400 font-semibold">Traditional i18n</span>
            </div>
            <div className="glass rounded-2xl p-6 font-mono text-sm overflow-x-auto border border-red-500/20">
              <pre className="text-gray-300">
                <code>{`import { useTranslation } from 'react-i18next';

function Hero() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.description')}</p>
      <button>
        {t('hero.cta')}
      </button>
    </div>
  );
}`}</code>
              </pre>
              <div className="mt-4 pt-4 border-t border-white/10 text-red-400 text-xs">
                + Requires translation keys in JSON files
                <br />
                + Must wrap every string manually
                <br />
                + Runtime overhead
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="flex items-center gap-2 mb-4">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-green-400 font-semibold">Lingo.dev Compiler</span>
            </div>
            <div className="glass rounded-2xl p-6 font-mono text-sm overflow-x-auto border border-green-500/20 glow-cyan">
              <pre className="text-gray-300">
                <code>{`function Hero() {
  return (
    <div>
      <h1>One Codebase, Every Language</h1>
      <p>
        Watch this page transform into
        10+ languages instantly.
      </p>
      <button>
        Try the Compiler
      </button>
    </div>
  );
}`}</code>
              </pre>
              <div className="mt-4 pt-4 border-t border-white/10 text-green-400 text-xs">
                ✓ Just write normal JSX
                <br />
                ✓ Compiler handles everything
                <br />
                ✓ Zero runtime cost
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400">
            This entire page was built with the code on the right.
            <span className="text-purple-400"> No translation functions anywhere.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

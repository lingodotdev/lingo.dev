"use client";

import { motion } from "framer-motion";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Tower } from "./Tower";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-8 md:px-12 lg:px-16 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
      </div>

      <LanguageSwitcher />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center z-10 mt-8"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm uppercase tracking-[0.3em] text-purple-400 mb-4"
        >
          Powered by Lingo.dev Compiler
        </motion.p>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
          <span className="gradient-text">One Codebase</span>
          <br />
          <span className="text-white">Every Language</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8">
          Watch this entire page transform into 10+ languages without a single translation function.
          No i18n keys. No manual setup. Pure magic.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <a
            href="https://lingo.dev/compiler"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full font-semibold text-white hover:opacity-90 transition-opacity glow-purple"
          >
            Try the Compiler
          </a>
          <a
            href="https://github.com/lingodotdev/lingo.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 glass rounded-full font-semibold text-white hover:bg-white/10 transition-colors"
          >
            View on GitHub
          </a>
        </motion.div>
      </motion.div>

      <Tower />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-gray-500 text-sm flex flex-col items-center gap-2"
        >
          <span>Scroll to explore</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}

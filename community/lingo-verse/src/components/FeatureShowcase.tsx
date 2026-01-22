"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const FEATURES = [
  {
    icon: "🧠",
    title: "AI-Powered Context",
    description: "Unlike word-for-word translators, Lingo.dev understands context. 'I'm feeling blue' translates to sadness, not color.",
    comparison: {
      basic: "'Estoy sintiendo azul' ❌",
      lingoDev: "'Estoy triste' ✅",
    },
  },
  {
    icon: "🎯",
    title: "Tone Adaptation",
    description: "Same message, different tones. Perfect for brand voice consistency across languages.",
    comparison: {
      formal: "'Le agradecería que...'",
      casual: "'¿Te importaría...?'",
    },
  },
  {
    icon: "⚡",
    title: "Developer-First",
    description: "Translate JSON objects, arrays, and structured data. Not just plain text.",
    code: `{ greeting: "Hello" } → { greeting: "Hola" }`,
  },
  {
    icon: "🔄",
    title: "Batch Translation",
    description: "Translate to 10+ languages simultaneously in a single API call.",
    stat: "16+ languages supported",
  },
  {
    icon: "🎨",
    title: "Preserve Formatting",
    description: "HTML, Markdown, and code stay intact. Only the text gets translated.",
    example: "<b>Hello</b> → <b>Hola</b>",
  },
  {
    icon: "📝",
    title: "Terminology Control",
    description: "Keep brand names, technical terms, and specific words untranslated.",
    example: "'Lingo.dev API' stays 'Lingo.dev API'",
  },
];

export function FeatureShowcase() {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <div className="glass rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <span className="text-2xl">✨</span>
          Why Lingo.dev?
        </h3>
        <a
          href="https://lingo.dev/sdk"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[var(--accent-primary)] hover:underline"
        >
          Learn more →
        </a>
      </div>

      {/* Feature tabs */}
      <div className="flex flex-wrap gap-2">
        {FEATURES.map((feature, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveFeature(index)}
            className={`
              px-3 py-1.5 rounded-lg text-sm transition-all
              ${
                activeFeature === index
                  ? "bg-[var(--accent-primary)] text-[var(--bg-primary)]"
                  : "bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)]"
              }
            `}
          >
            <span className="mr-1">{feature.icon}</span>
            {feature.title}
          </motion.button>
        ))}
      </div>

      {/* Active feature details */}
      <motion.div
        key={activeFeature}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl bg-[var(--bg-primary)] space-y-3"
      >
        <div className="flex items-start gap-3">
          <span className="text-3xl">{FEATURES[activeFeature].icon}</span>
          <div>
            <h4 className="font-semibold text-lg">{FEATURES[activeFeature].title}</h4>
            <p className="text-sm text-[var(--text-secondary)]">
              {FEATURES[activeFeature].description}
            </p>
          </div>
        </div>

        {/* Comparison example */}
        {FEATURES[activeFeature].comparison && (
          <div className="grid grid-cols-2 gap-3 mt-3">
            {Object.entries(FEATURES[activeFeature].comparison).map(([key, value]) => (
              <div
                key={key}
                className={`p-3 rounded-lg text-sm ${
                  key === "basic" || key === "lingoDev"
                    ? key === "lingoDev"
                      ? "bg-[var(--accent-primary)]/20 border border-[var(--accent-primary)]/30"
                      : "bg-[var(--bg-tertiary)]"
                    : "bg-[var(--bg-tertiary)]"
                }`}
              >
                <div className="text-xs text-[var(--text-muted)] mb-1 capitalize">
                  {key === "lingoDev" ? "Lingo.dev" : key}
                </div>
                <div className="font-mono">{value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Code example */}
        {FEATURES[activeFeature].code && (
          <div className="p-3 rounded-lg bg-[var(--bg-tertiary)] font-mono text-sm">
            {FEATURES[activeFeature].code}
          </div>
        )}

        {/* Stat */}
        {FEATURES[activeFeature].stat && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {FEATURES[activeFeature].stat}
          </div>
        )}

        {/* Example */}
        {FEATURES[activeFeature].example && (
          <div className="p-3 rounded-lg bg-[var(--bg-tertiary)] font-mono text-sm">
            {FEATURES[activeFeature].example}
          </div>
        )}
      </motion.div>

      {/* CTA */}
      <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
        <p className="text-xs text-[var(--text-muted)]">
          Experience the difference with your own text above
        </p>
        <div className="flex items-center gap-1 text-xs text-[var(--accent-primary)]">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
          Powered by AI
        </div>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";

export type TranslationTone = "default" | "formal" | "casual" | "technical" | "creative";

interface ToneSelectorProps {
  selectedTone: TranslationTone;
  onToneChange: (tone: TranslationTone) => void;
}

const TONES: { id: TranslationTone; label: string; icon: string; description: string }[] = [
  {
    id: "default",
    label: "Balanced",
    icon: "⚖️",
    description: "Natural, balanced translation",
  },
  {
    id: "formal",
    label: "Formal",
    icon: "👔",
    description: "Professional and polished",
  },
  {
    id: "casual",
    label: "Casual",
    icon: "😊",
    description: "Friendly and conversational",
  },
  {
    id: "technical",
    label: "Technical",
    icon: "⚙️",
    description: "Precise and technical",
  },
  {
    id: "creative",
    label: "Creative",
    icon: "🎨",
    description: "Expressive and artistic",
  },
];

export function ToneSelector({ selectedTone, onToneChange }: ToneSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-2">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
        Translation Tone
        <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent-warm)]/20 text-[var(--accent-warm)]">
          AI-Powered
        </span>
      </label>
      
      <div className="flex flex-wrap gap-2">
        {TONES.map((tone) => (
          <motion.button
            key={tone.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onToneChange(tone.id)}
            className={`
              relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all
              ${
                selectedTone === tone.id
                  ? "bg-[var(--accent-primary)] text-[var(--bg-primary)]"
                  : "glass hover:border-[var(--accent-primary)]/30"
              }
            `}
            title={tone.description}
          >
            <span>{tone.icon}</span>
            <span>{tone.label}</span>
            {selectedTone === tone.id && (
              <motion.div
                layoutId="tone-indicator"
                className="absolute inset-0 bg-[var(--accent-primary)] rounded-lg -z-10"
              />
            )}
          </motion.button>
        ))}
      </div>
      
      <p className="text-xs text-[var(--text-muted)]">
        {TONES.find((t) => t.id === selectedTone)?.description}
      </p>
    </div>
  );
}

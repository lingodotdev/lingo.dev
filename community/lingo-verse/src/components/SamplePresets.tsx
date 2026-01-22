"use client";

import { useTranslationStore } from "@/store/useTranslationStore";
import { motion } from "framer-motion";

const PRESETS = [
  {
    id: "business",
    label: "Business",
    icon: "💼",
    text: "We are pleased to announce our new partnership that will drive innovation and create value for our customers worldwide.",
  },
  {
    id: "casual",
    label: "Casual",
    icon: "👋",
    text: "Hey! How's it going? I was thinking we could grab some coffee this weekend if you're free.",
  },
  {
    id: "technical",
    label: "Technical",
    icon: "⚙️",
    text: "The API endpoint accepts POST requests with JSON payloads. Authentication is handled via Bearer tokens in the Authorization header.",
  },
  {
    id: "marketing",
    label: "Marketing",
    icon: "📢",
    text: "Unlock your potential with our revolutionary platform. Join millions of satisfied users and transform the way you work today!",
  },
  {
    id: "legal",
    label: "Legal",
    icon: "⚖️",
    text: "The parties hereby agree to the terms and conditions set forth in this agreement, which shall be binding upon execution.",
  },
  {
    id: "creative",
    label: "Creative",
    icon: "🎨",
    text: "The sunset painted the sky in hues of gold and crimson, as waves whispered secrets to the ancient shore.",
  },
];

export function SamplePresets() {
  const { setSourceText, sourceText } = useTranslationStore();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
          Quick Samples
        </h4>
        {sourceText && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setSourceText("")}
            className="text-xs text-[var(--accent-hot)] hover:underline"
          >
            Clear
          </motion.button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset, index) => (
          <motion.button
            key={preset.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSourceText(preset.text)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm
              transition-all duration-200
              ${
                sourceText === preset.text
                  ? "bg-[var(--accent-primary)] text-[var(--bg-primary)]"
                  : "glass hover:border-[var(--accent-primary)]/30"
              }
            `}
          >
            <span>{preset.icon}</span>
            <span>{preset.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

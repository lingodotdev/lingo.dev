'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const PLACEHOLDER_EXAMPLES = [
  "bro fr this app slaps 💀",
  "ngl that's lowkey fire 🔥",
  "no cap this hits different",
  "bestie ate and left no crumbs ✨",
  "it's giving main character energy",
  "slay queen periodt 💅",
  "that's so sus ngl",
  "touch grass my dude 🌱",
];

export default function TextInput({ value, onChange, disabled }: TextInputProps) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  // Cycle through placeholder examples
  useEffect(() => {
    if (value) return; // Don't cycle if there's content
    
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_EXAMPLES.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [value]);

  const characterCount = value.length;
  const maxChars = 500;

  return (
    <div className="relative">
      {/* Label */}
      <div className="flex items-center justify-between mb-3">
        <label className="text-small font-medium text-[var(--text-secondary)]">
          Enter your slang-heavy text
        </label>
        <span className={`text-small ${characterCount > maxChars * 0.9 ? 'text-[var(--accent-secondary)]' : 'text-[var(--text-muted)]'}`}>
          {characterCount}/{maxChars}
        </span>
      </div>

      {/* Textarea with animated border */}
      <motion.div
        className="relative"
        animate={{
          boxShadow: isFocused 
            ? '0 0 0 3px rgba(0, 245, 212, 0.15)' 
            : '0 0 0 0px rgba(0, 245, 212, 0)',
        }}
        transition={{ duration: 0.2 }}
        style={{ borderRadius: '12px' }}
      >
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxChars))}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          placeholder={PLACEHOLDER_EXAMPLES[placeholderIndex]}
          className="input-textarea w-full"
          style={{
            fontFamily: 'var(--font-body)',
          }}
        />
      </motion.div>

      {/* Hint text */}
      <motion.p 
        className="mt-2 text-small text-[var(--text-muted)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        💡 Try internet slang, abbreviations, emojis, and casual expressions
      </motion.p>
    </div>
  );
}

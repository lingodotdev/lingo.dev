"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface KeyboardShortcutsProps {
  onTranslate: () => void;
  onClear: () => void;
}

export function KeyboardShortcuts({ onTranslate, onClear }: KeyboardShortcutsProps) {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to translate
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        onTranslate();
      }
      // Escape to clear
      if (e.key === "Escape") {
        e.preventDefault();
        onClear();
      }
      // ? to show help
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
          e.preventDefault();
          setShowHelp(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onTranslate, onClear]);

  return (
    <>
      {/* Keyboard hint */}
      <div className="hidden md:flex items-center gap-2 text-xs text-[var(--text-muted)]">
        <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] font-mono">Ctrl</kbd>
        <span>+</span>
        <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] font-mono">Enter</kbd>
        <span>to translate</span>
        <span className="mx-2">•</span>
        <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] font-mono">?</kbd>
        <span>for shortcuts</span>
      </div>

      {/* Help modal */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowHelp(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md glass rounded-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>⌨️</span> Keyboard Shortcuts
              </h3>
              <div className="space-y-3">
                <ShortcutRow keys={["Ctrl", "Enter"]} description="Translate text" />
                <ShortcutRow keys={["Esc"]} description="Clear input" />
                <ShortcutRow keys={["?"]} description="Show this help" />
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="mt-6 w-full py-2 rounded-lg bg-[var(--accent-primary)] text-[var(--bg-primary)] font-medium"
              >
                Got it!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ShortcutRow({ keys, description }: { keys: string[]; description: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[var(--border-subtle)]">
      <span className="text-[var(--text-secondary)]">{description}</span>
      <div className="flex items-center gap-1">
        {keys.map((key, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <span className="text-[var(--text-muted)]">+</span>}
            <kbd className="px-2 py-1 rounded bg-[var(--bg-tertiary)] font-mono text-sm">
              {key}
            </kbd>
          </span>
        ))}
      </div>
    </div>
  );
}

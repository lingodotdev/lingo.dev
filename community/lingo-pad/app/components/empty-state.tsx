"use client";

import { Languages, Command, CornerDownLeft } from "lucide-react";

interface EmptyStateProps {
  isTranslating?: boolean;
}

export function EmptyState({ isTranslating }: EmptyStateProps) {
  if (isTranslating) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center gap-4 text-gray-500">
        {/* Animated typing indicator */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span
              className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
        <div className="text-sm text-gray-400 animate-pulse">
          Translating your content...
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full flex flex-col items-center justify-center gap-6 text-gray-500 px-8">
      {/* Icon */}
      <div className="relative">
        <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full scale-150" />
        <div className="relative p-4 bg-gray-900/50 rounded-2xl border border-gray-800/50">
          <Languages className="w-8 h-8 text-emerald-500/70" />
        </div>
      </div>

      {/* Text */}
      <div className="text-center space-y-2 max-w-xs">
        <p className="text-sm text-gray-400">
          Your translated content will appear here
        </p>
        <p className="text-xs text-gray-600">
          Edit the input on the left, then click Translate
        </p>
      </div>

      {/* Keyboard shortcut hint */}
      <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-900/30 px-3 py-2 rounded-lg border border-gray-800/30">
        <span>Quick translate:</span>
        <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 bg-gray-800 rounded text-gray-400 font-mono text-[10px]">
          <Command className="w-2.5 h-2.5" />
          <span>+</span>
          <CornerDownLeft className="w-2.5 h-2.5" />
        </kbd>
      </div>
    </div>
  );
}

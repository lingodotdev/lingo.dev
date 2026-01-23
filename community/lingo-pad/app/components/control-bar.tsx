"use client";

import {
  ArrowRight,
  RotateCw,
  Zap,
  Sparkles,
  GitCompare,
  ChevronDown,
} from "lucide-react";
import { clsx } from "clsx";

interface ControlBarProps {
  inputType: "text" | "json" | "html";
  onInputTypeChange: (type: "text" | "json" | "html") => void;
  targetLanguage: string;
  onTargetLanguageChange: (lang: string) => void;
  isFastMode: boolean;
  onFastModeChange: (fast: boolean) => void;
  onTranslate: () => void;
  isTranslating: boolean;
  diffMode: boolean;
  onDiffModeChange: (diff: boolean) => void;
}

const LANGUAGES = [
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
];

export function ControlBar({
  inputType,
  onInputTypeChange,
  targetLanguage,
  onTargetLanguageChange,
  isFastMode,
  onFastModeChange,
  onTranslate,
  isTranslating,
  diffMode,
  onDiffModeChange,
}: ControlBarProps) {
  const selectedLang =
    LANGUAGES.find((l) => l.code === targetLanguage) || LANGUAGES[0];

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between py-4 px-1">
      {/* Left Section: Input Type + Language */}
      <div className="flex items-center gap-6">
        {/* Input Type Selector - Clean Underline Tabs */}
        <div className="flex items-center gap-1">
          {(["text", "json", "html"] as const).map((type) => (
            <button
              key={type}
              onClick={() => onInputTypeChange(type)}
              className={clsx(
                "px-3 py-1.5 text-sm font-medium transition-all duration-200 uppercase tracking-wide rounded-md",
                inputType === type
                  ? "text-white bg-gray-800"
                  : "text-gray-500 hover:text-gray-300",
              )}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Subtle Divider */}
        <div className="h-5 w-px bg-gray-800" />

        {/* Language Selector - Clean Inline Style */}
        <div className="relative">
          <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group">
            <span className="text-lg">{selectedLang.flag}</span>
            <span className="text-sm font-medium">{selectedLang.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-300 transition-colors" />
          </button>
          <select
            value={targetLanguage}
            onChange={(e) => onTargetLanguageChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Section: Mode Toggles + Action */}
      <div className="flex items-center gap-3">
        {/* Mode Toggle - Pill Toggle */}
        <div className="relative group/tooltip">
          <button
            onClick={() => onFastModeChange(!isFastMode)}
            className={clsx(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border",
              isFastMode
                ? "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                : "bg-purple-500/10 text-purple-400 border-purple-500/30 hover:bg-purple-500/20",
            )}
          >
            {isFastMode ? (
              <>
                <Zap className="w-4 h-4" />
                <span>Fast</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Quality</span>
              </>
            )}
          </button>
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-gray-900 border border-gray-800 rounded-lg shadow-xl text-xs text-gray-400 hidden group-hover/tooltip:block z-50 pointer-events-none">
            <div className="font-medium text-gray-200 mb-1">
              {isFastMode ? "Fast Mode" : "Quality Mode"}
            </div>
            {isFastMode
              ? "Prioritizes speed over nuance. Ideal for drafts."
              : "Prioritizes nuance and context. Best for production."}
          </div>
        </div>

        {/* Diff Toggle */}
        <button
          onClick={() => onDiffModeChange(!diffMode)}
          className={clsx(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border",
            diffMode
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
              : "bg-gray-900/80 text-gray-500 border-gray-800/50 hover:text-gray-300 hover:border-gray-700",
          )}
        >
          <GitCompare className="w-4 h-4" />
          <span>Diff</span>
        </button>

        {/* Translate Button - Primary CTA */}
        <button
          onClick={onTranslate}
          disabled={isTranslating}
          className={clsx(
            "flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200",
            "bg-gradient-to-r from-emerald-500 to-teal-500 text-white",
            "hover:from-emerald-400 hover:to-teal-400 hover:shadow-lg hover:shadow-emerald-500/25",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none",
          )}
        >
          {isTranslating ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin" />
              <span>Translating...</span>
            </>
          ) : (
            <>
              <span>Translate</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

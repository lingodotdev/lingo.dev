"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "./components/header";
import { ControlBar } from "./components/control-bar";
import { EditorPanel } from "./components/editor-panel";
import { EmptyState } from "./components/empty-state";
import { Toast, ToastType } from "./components/toast";
import { FileText, Code, FileCode, ExternalLink } from "lucide-react";

import { computeDecorations, DecorationRange } from "./utils/diff-utils";
import { DEFAULT_PRESET, PRESETS } from "./utils/presets";

// Toast state type
type ToastState = {
  message: string;
  type: ToastType;
} | null;

export default function Home() {
  const [input, setInput] = useState(DEFAULT_PRESET.content);
  const [output, setOutput] = useState("");

  const [inputType, setInputType] = useState<"text" | "json" | "html">("json");
  const [targetLanguage, setTargetLanguage] = useState("es");
  const [isFastMode, setIsFastMode] = useState(true);
  const [diffMode, setDiffMode] = useState(false);

  const [isTranslating, setIsTranslating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  // Compute decorations if in Diff Mode
  let inputDecorations: DecorationRange[] = [];
  let outputDecorations: DecorationRange[] = [];

  if (diffMode && output) {
    inputDecorations = computeDecorations(input, output, "original");
    outputDecorations = computeDecorations(output, input, "modified");
  }

  // Character count for input
  const charCount = input.length;
  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;

  const handleInputTypeChange = (type: "text" | "json" | "html") => {
    setInputType(type);
    const defaultPreset =
      PRESETS.find((p) => p.type === type) || DEFAULT_PRESET;
    setInput(defaultPreset.type === type ? defaultPreset.content : "");
    setOutput("");
  };

  const handleTranslate = useCallback(async () => {
    if (!input.trim()) {
      setToast({
        message: "Please enter some content to translate",
        type: "warning",
      });
      return;
    }

    setIsTranslating(true);
    setOutput("");

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: input,
          type: inputType,
          targetLanguage,
          fast: isFastMode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({
          message: data.error || "Translation failed",
          type: "error",
        });
        return;
      }

      let resultText = data.result;
      if (typeof resultText === "object") {
        resultText = JSON.stringify(resultText, null, 2);
      }
      setOutput(resultText);
      setToast({ message: "Translation complete!", type: "success" });
    } catch (err) {
      console.error(err);
      setToast({ message: "An unexpected error occurred", type: "error" });
    } finally {
      setIsTranslating(false);
    }
  }, [input, inputType, targetLanguage, isFastMode]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleTranslate();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleTranslate]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setIsCopied(true);
    setToast({ message: "Copied to clipboard!", type: "success" });
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Get icon for input type
  const getInputTypeIcon = () => {
    switch (inputType) {
      case "json":
        return <Code className="w-3 h-3" />;
      case "html":
        return <FileCode className="w-3 h-3" />;
      default:
        return <FileText className="w-3 h-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-emerald-500/30">
      <Header />

      <main className="flex-1 flex flex-col max-w-[1400px] mx-auto w-full px-6 pb-6 gap-0 h-[calc(100vh-4rem)]">
        <ControlBar
          inputType={inputType}
          onInputTypeChange={handleInputTypeChange}
          targetLanguage={targetLanguage}
          onTargetLanguageChange={setTargetLanguage}
          isFastMode={isFastMode}
          onFastModeChange={setIsFastMode}
          onTranslate={handleTranslate}
          isTranslating={isTranslating}
          diffMode={diffMode}
          onDiffModeChange={setDiffMode}
        />

        {/* Unified Layout */}
        <div className="flex-1 flex flex-col gap-2 min-h-0">
          {/* Value Proposition Callout - Enhanced */}
          <div className="flex items-center justify-center gap-8 py-2 px-4 bg-gray-900/30 rounded-lg border border-gray-800/30">
            <span className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <span>Keys unchanged</span>
            </span>
            <span className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <span>HTML intact</span>
            </span>
            <span className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <span>Values translated</span>
            </span>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-1 bg-gray-900/50 border border-gray-800/50 rounded-xl overflow-hidden">
            {/* Input Panel */}
            <div className="flex flex-col min-h-0 bg-[#1e1e1e] relative group">
              {/* Panel Header */}
              <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2.5 bg-gradient-to-b from-[#1e1e1e] via-[#1e1e1e] to-transparent pointer-events-none">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {getInputTypeIcon()}
                  <span className="font-medium uppercase tracking-wide">
                    Input
                  </span>
                  <span className="text-gray-600">·</span>
                  <span className="text-gray-600 font-mono text-[10px]">
                    {charCount.toLocaleString()} chars ·{" "}
                    {wordCount.toLocaleString()} words
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <EditorPanel
                  value={input}
                  onChange={(val) => setInput(val || "")}
                  language={inputType === "text" ? "plaintext" : inputType}
                  readOnly={diffMode}
                  decorations={inputDecorations}
                  onTranslate={handleTranslate}
                />
              </div>
            </div>

            {/* Output Panel */}
            <div className="flex flex-col min-h-0 bg-[#1e1e1e] relative border-l border-gray-800/30">
              {/* Panel Header */}
              <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2.5 bg-gradient-to-b from-[#1e1e1e] via-[#1e1e1e] to-transparent">
                <div className="flex items-center gap-2 text-xs text-gray-500 pointer-events-none">
                  {getInputTypeIcon()}
                  <span className="font-medium uppercase tracking-wide">
                    Output
                  </span>
                  {output && (
                    <>
                      <span className="text-gray-600">·</span>
                      <span className="text-emerald-500/70 font-mono text-[10px]">
                        {targetLanguage.toUpperCase()}
                      </span>
                    </>
                  )}
                </div>
                {output && !diffMode && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-emerald-400 transition-colors pointer-events-auto px-2 py-1 rounded hover:bg-gray-800/50"
                  >
                    {isCopied ? (
                      <>
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <span>Copy</span>
                        <ExternalLink className="w-3 h-3" />
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Content Area */}
              <div className="flex-1 flex flex-col min-h-0">
                {!output && !isTranslating ? (
                  <EmptyState />
                ) : isTranslating && !output ? (
                  <EmptyState isTranslating />
                ) : (
                  <EditorPanel
                    value={output}
                    language={inputType === "text" ? "plaintext" : inputType}
                    readOnly={true}
                    decorations={outputDecorations}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-center py-2 text-[10px] text-gray-600">
            <span>Powered by </span>
            <a
              href="https://lingo.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-500/70 hover:text-emerald-400 transition-colors ml-1"
            >
              Lingo.dev
            </a>
          </div>
        </div>
      </main>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

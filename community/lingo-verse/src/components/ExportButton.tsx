"use client";

import { useTranslationStore } from "@/store/useTranslationStore";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function ExportButton() {
  const { sourceText, sourceLanguage, translations } = useTranslationStore();
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const completedTranslations = translations.filter((t) => !t.isLoading && t.text);

  if (completedTranslations.length === 0) return null;

  const exportData = {
    source: {
      language: sourceLanguage?.code || "auto",
      languageName: sourceLanguage?.name || "Auto-detected",
      text: sourceText,
    },
    translations: completedTranslations.map((t) => ({
      language: t.language.code,
      languageName: t.language.name,
      nativeName: t.language.nativeName,
      text: t.text,
    })),
    exportedAt: new Date().toISOString(),
    poweredBy: "Lingo.dev SDK",
  };

  const handleCopyAll = async () => {
    const textContent = [
      `Source (${exportData.source.languageName}):`,
      exportData.source.text,
      "",
      ...completedTranslations.flatMap((t) => [
        `${t.language.name} (${t.language.nativeName}):`,
        t.text,
        "",
      ]),
      "---",
      "Powered by Lingo.dev SDK",
    ].join("\n");

    await navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setShowMenu(false);
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `translations-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  const handleExportCSV = () => {
    const rows = [
      ["Language", "Code", "Native Name", "Translation"],
      [sourceLanguage?.name || "Source", sourceLanguage?.code || "auto", "", sourceText],
      ...completedTranslations.map((t) => [
        t.language.name,
        t.language.code,
        t.language.nativeName,
        t.text,
      ]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `translations-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg glass hover:border-[var(--accent-primary)]/30 transition-all text-sm"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        Export
      </motion.button>

      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-48 glass rounded-xl overflow-hidden z-50"
            >
              <button
                onClick={handleCopyAll}
                className="w-full px-4 py-3 text-left text-sm hover:bg-[var(--bg-tertiary)] transition-colors flex items-center gap-3"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4 text-[var(--accent-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-[var(--accent-primary)]">Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy All
                  </>
                )}
              </button>
              <button
                onClick={handleExportJSON}
                className="w-full px-4 py-3 text-left text-sm hover:bg-[var(--bg-tertiary)] transition-colors flex items-center gap-3"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download JSON
              </button>
              <button
                onClick={handleExportCSV}
                className="w-full px-4 py-3 text-left text-sm hover:bg-[var(--bg-tertiary)] transition-colors flex items-center gap-3"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download CSV
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

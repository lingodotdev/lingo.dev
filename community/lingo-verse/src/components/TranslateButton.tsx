"use client";

import { useTranslationStore, Translation } from "@/store/useTranslationStore";
import { motion } from "framer-motion";

export function TranslateButton() {
  const {
    sourceText,
    sourceLanguage,
    selectedTargetLanguages,
    apiKey,
    isTranslating,
    setIsTranslating,
    setIsDetecting,
    setDetectedLanguage,
    setTranslations,
    updateTranslation,
    setShowApiKeyModal,
  } = useTranslationStore();

  const handleTranslate = async () => {
    if (!apiKey) {
      setShowApiKeyModal(true);
      return;
    }

    if (!sourceText.trim() || selectedTargetLanguages.length === 0) {
      return;
    }

    setIsTranslating(true);

    // Initialize translations as loading
    const initialTranslations: Translation[] = selectedTargetLanguages.map(
      (lang) => ({
        language: lang,
        text: "",
        isLoading: true,
      })
    );
    setTranslations(initialTranslations);

    try {
      // Detect language if not specified
      if (!sourceLanguage) {
        setIsDetecting(true);
        try {
          const response = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              apiKey,
              text: sourceText,
              action: "detect",
            }),
          });
          const data = await response.json();
          if (data.locale) {
            const { LANGUAGES } = await import("@/store/useTranslationStore");
            const detected = LANGUAGES.find((l) => l.code === data.locale);
            if (detected) {
              setDetectedLanguage(detected);
            }
          }
        } catch (error) {
          console.error("Language detection failed:", error);
        }
        setIsDetecting(false);
      }

      // Translate to each target language in parallel
      const translationPromises = selectedTargetLanguages.map(async (lang) => {
        try {
          const response = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              apiKey,
              text: sourceText,
              sourceLocale: sourceLanguage?.code,
              targetLocale: lang.code,
              action: "translate",
            }),
          });
          const data = await response.json();
          
          if (data.error) {
            updateTranslation(lang.code, {
              text: "",
              isLoading: false,
              error: data.error,
            });
          } else {
            updateTranslation(lang.code, {
              text: data.text,
              isLoading: false,
            });
          }
        } catch (error) {
          updateTranslation(lang.code, {
            text: "",
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Translation failed",
          });
        }
      });

      await Promise.all(translationPromises);
    } catch (error) {
      console.error("Translation error:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  const isDisabled =
    !sourceText.trim() || selectedTargetLanguages.length === 0 || isTranslating;

  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      onClick={handleTranslate}
      disabled={isDisabled}
      className={`
        relative w-full py-4 px-8 rounded-2xl font-semibold text-lg
        transition-all duration-300 overflow-hidden
        ${
          isDisabled
            ? "bg-[var(--bg-tertiary)] text-[var(--text-muted)] cursor-not-allowed"
            : "bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-[var(--bg-primary)] shadow-lg shadow-[var(--accent-primary)]/25"
        }
      `}
    >
      {/* Animated background */}
      {!isDisabled && !isTranslating && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[var(--accent-secondary)] to-[var(--accent-primary)]"
          initial={{ x: "-100%" }}
          whileHover={{ x: "0%" }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Content */}
      <span className="relative flex items-center justify-center gap-3">
        {isTranslating ? (
          <>
            <motion.div
              className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
            Translating across the globe...
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
              />
            </svg>
            Translate to {selectedTargetLanguages.length} language
            {selectedTargetLanguages.length !== 1 ? "s" : ""}
          </>
        )}
      </span>

      {/* Glow effect */}
      {!isDisabled && (
        <div className="absolute inset-0 -z-10 blur-xl bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] opacity-50" />
      )}
    </motion.button>
  );
}

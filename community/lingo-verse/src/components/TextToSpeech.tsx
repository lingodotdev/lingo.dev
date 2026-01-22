"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TextToSpeechProps {
  text: string;
  languageCode: string;
  className?: string;
}

export function TextToSpeech({ text, languageCode, className = "" }: TextToSpeechProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    setIsSupported("speechSynthesis" in window);
  }, []);

  const handleSpeak = () => {
    if (!isSupported || !text) return;

    // Stop any current speech
    window.speechSynthesis.cancel();

    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Map our locale codes to BCP 47 language tags
    const langMap: Record<string, string> = {
      "en": "en-US",
      "es": "es-ES",
      "fr": "fr-FR",
      "de": "de-DE",
      "it": "it-IT",
      "pt-BR": "pt-BR",
      "ru": "ru-RU",
      "ja": "ja-JP",
      "ko": "ko-KR",
      "zh-Hans": "zh-CN",
      "ar": "ar-SA",
      "hi": "hi-IN",
      "tr": "tr-TR",
      "nl": "nl-NL",
      "pl": "pl-PL",
      "sv": "sv-SE",
    };

    utterance.lang = langMap[languageCode] || languageCode;
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  if (!isSupported) return null;

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleSpeak}
      className={`p-2 rounded-lg transition-colors ${
        isPlaying
          ? "bg-[var(--accent-primary)] text-[var(--bg-primary)]"
          : "bg-[var(--bg-tertiary)] hover:bg-[var(--accent-primary)]/20 text-[var(--text-muted)] hover:text-[var(--accent-primary)]"
      } ${className}`}
      title={isPlaying ? "Stop" : "Listen"}
    >
      {isPlaying ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      )}
    </motion.button>
  );
}

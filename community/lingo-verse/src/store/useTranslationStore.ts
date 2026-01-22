import { create } from "zustand";

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  coordinates: { lat: number; lng: number };
  fontClass?: string;
  direction?: "ltr" | "rtl";
}

export const LANGUAGES: Language[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
    coordinates: { lat: 37.09, lng: -95.71 },
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
    coordinates: { lat: 40.46, lng: -3.75 },
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    coordinates: { lat: 46.23, lng: 2.21 },
  },
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    flag: "🇩🇪",
    coordinates: { lat: 51.17, lng: 10.45 },
  },
  {
    code: "it",
    name: "Italian",
    nativeName: "Italiano",
    flag: "🇮🇹",
    coordinates: { lat: 41.87, lng: 12.57 },
  },
  {
    code: "pt-BR",
    name: "Portuguese",
    nativeName: "Português",
    flag: "🇧🇷",
    coordinates: { lat: -14.24, lng: -51.93 },
  },
  {
    code: "ru",
    name: "Russian",
    nativeName: "Русский",
    flag: "🇷🇺",
    coordinates: { lat: 61.52, lng: 105.32 },
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    flag: "🇯🇵",
    coordinates: { lat: 36.2, lng: 138.25 },
    fontClass: "font-japanese",
  },
  {
    code: "ko",
    name: "Korean",
    nativeName: "한국어",
    flag: "🇰🇷",
    coordinates: { lat: 35.91, lng: 127.77 },
  },
  {
    code: "zh-Hans",
    name: "Chinese (Simplified)",
    nativeName: "简体中文",
    flag: "🇨🇳",
    coordinates: { lat: 35.86, lng: 104.2 },
    fontClass: "font-chinese",
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    flag: "🇸🇦",
    coordinates: { lat: 23.89, lng: 45.08 },
    fontClass: "font-arabic",
    direction: "rtl",
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    flag: "🇮🇳",
    coordinates: { lat: 20.59, lng: 78.96 },
  },
  {
    code: "tr",
    name: "Turkish",
    nativeName: "Türkçe",
    flag: "🇹🇷",
    coordinates: { lat: 38.96, lng: 35.24 },
  },
  {
    code: "nl",
    name: "Dutch",
    nativeName: "Nederlands",
    flag: "🇳🇱",
    coordinates: { lat: 52.13, lng: 5.29 },
  },
  {
    code: "pl",
    name: "Polish",
    nativeName: "Polski",
    flag: "🇵🇱",
    coordinates: { lat: 51.92, lng: 19.15 },
  },
  {
    code: "sv",
    name: "Swedish",
    nativeName: "Svenska",
    flag: "🇸🇪",
    coordinates: { lat: 60.13, lng: 18.64 },
  },
];

export interface Translation {
  language: Language;
  text: string;
  isLoading: boolean;
  error?: string;
}

export type TranslationTone = "default" | "formal" | "casual" | "technical" | "creative";

interface TranslationState {
  sourceText: string;
  sourceLanguage: Language | null;
  detectedLanguage: Language | null;
  selectedTargetLanguages: Language[];
  translations: Translation[];
  isTranslating: boolean;
  isDetecting: boolean;
  apiKey: string;
  showApiKeyModal: boolean;
  translationTime: number | null;
  translationStartTime: number | null;
  // AI-powered features
  translationContext: string;
  translationHints: string[];
  translationTone: TranslationTone;

  setSourceText: (text: string) => void;
  setSourceLanguage: (language: Language | null) => void;
  setDetectedLanguage: (language: Language | null) => void;
  toggleTargetLanguage: (language: Language) => void;
  setTranslations: (translations: Translation[]) => void;
  updateTranslation: (code: string, update: Partial<Translation>) => void;
  setIsTranslating: (isTranslating: boolean) => void;
  setIsDetecting: (isDetecting: boolean) => void;
  setApiKey: (key: string) => void;
  setShowApiKeyModal: (show: boolean) => void;
  clearTranslations: () => void;
  startTranslationTimer: () => void;
  stopTranslationTimer: () => void;
  // AI-powered features
  setTranslationContext: (context: string) => void;
  setTranslationHints: (hints: string[]) => void;
  setTranslationTone: (tone: TranslationTone) => void;
}

export const useTranslationStore = create<TranslationState>((set) => ({
  sourceText: "",
  sourceLanguage: LANGUAGES[0], // Default to English
  detectedLanguage: null,
  selectedTargetLanguages: [LANGUAGES[1], LANGUAGES[2], LANGUAGES[7]], // Spanish, French, Japanese
  translations: [],
  isTranslating: false,
  isDetecting: false,
  apiKey: "",
  showApiKeyModal: false,
  translationTime: null,
  translationStartTime: null,
  // AI-powered features
  translationContext: "",
  translationHints: [],
  translationTone: "default" as TranslationTone,

  setSourceText: (text) => set({ sourceText: text }),
  setSourceLanguage: (language) => set({ sourceLanguage: language }),
  setDetectedLanguage: (language) => set({ detectedLanguage: language }),
  toggleTargetLanguage: (language) =>
    set((state) => {
      const isSelected = state.selectedTargetLanguages.some(
        (l) => l.code === language.code
      );
      if (isSelected) {
        return {
          selectedTargetLanguages: state.selectedTargetLanguages.filter(
            (l) => l.code !== language.code
          ),
          translations: state.translations.filter(
            (t) => t.language.code !== language.code
          ),
        };
      } else {
        return {
          selectedTargetLanguages: [...state.selectedTargetLanguages, language],
        };
      }
    }),
  setTranslations: (translations) => set({ translations }),
  updateTranslation: (code, update) =>
    set((state) => ({
      translations: state.translations.map((t) =>
        t.language.code === code ? { ...t, ...update } : t
      ),
    })),
  setIsTranslating: (isTranslating) => set({ isTranslating }),
  setIsDetecting: (isDetecting) => set({ isDetecting }),
  setApiKey: (key) => set({ apiKey: key }),
  setShowApiKeyModal: (show) => set({ showApiKeyModal: show }),
  clearTranslations: () => set({ translations: [], translationTime: null }),
  startTranslationTimer: () => set({ translationStartTime: Date.now(), translationTime: null }),
  stopTranslationTimer: () =>
    set((state) => ({
      translationTime: state.translationStartTime
        ? Date.now() - state.translationStartTime
        : null,
      translationStartTime: null,
    })),
  // AI-powered features
  setTranslationContext: (context) => set({ translationContext: context }),
  setTranslationHints: (hints) => set({ translationHints: hints }),
  setTranslationTone: (tone) => set({ translationTone: tone }),
}));

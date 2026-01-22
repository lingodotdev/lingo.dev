import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LingoDotDevEngine } from 'lingo.dev/sdk';

export type Language = {
  code: string;
  name: string;
  flag: string;
};

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

interface TranslationContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  translate: (text: string | Record<string, any>) => Promise<any>;
  isTranslating: boolean;
  translationCache: Map<string, any>;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
  apiKey?: string;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children, apiKey }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(SUPPORTED_LANGUAGES[0]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationCache] = useState(new Map<string, any>());
  const [lingoDotDev] = useState(() => {
    if (!apiKey) return null;
    
    // Use local proxy to avoid CORS issues in development
    const apiUrl = import.meta.env.DEV 
      ? 'http://localhost:5173/engine/lingo'  // Development proxy
      : 'https://engine.lingo.dev';  // Production
    
    return new LingoDotDevEngine({ 
      apiKey,
      apiUrl
    });
  });

  const translate = async (text: string | Record<string, any>): Promise<any> => {
    // If English or no API key, return original
    if (currentLanguage.code === 'en' || !lingoDotDev) {
      return text;
    }

    // Check cache
    const cacheKey = `${currentLanguage.code}:${JSON.stringify(text)}`;
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey);
    }

    setIsTranslating(true);
    try {
      let translated;
      
      if (typeof text === 'string') {
        translated = await lingoDotDev.localizeText(text, {
          sourceLocale: 'en',
          targetLocale: currentLanguage.code,
        });
      } else {
        translated = await lingoDotDev.localizeObject(text, {
          sourceLocale: 'en',
          targetLocale: currentLanguage.code,
        });
      }

      // Cache the result
      translationCache.set(cacheKey, translated);
      return translated;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original on error
    } finally {
      setIsTranslating(false);
    }
  };

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
  };

  return (
    <TranslationContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        translate,
        isTranslating,
        translationCache,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

import { useState, useCallback, useRef } from 'react';
import { LingoDotDevEngine } from 'lingo.dev/sdk';

const LINGO_API_KEY = import.meta.env.VITE_LINGO_API_KEY;

export function useTranslation() {
  const [isTranslating, setIsTranslating] = useState(false);
  const [latency, setLatency] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const timeoutRef = useRef(null);
  const batchTimeoutRef = useRef(null);
  
  const lingoRef = useRef(null);

  if (!lingoRef.current && typeof window !== 'undefined' && LINGO_API_KEY) {
    lingoRef.current = new LingoDotDevEngine({
      apiKey: LINGO_API_KEY,
      apiUrl: `${window.location.origin}/api/lingo`,
    });
  }

  const translate = useCallback(async (text, targetLocale, onComplete, options = {}) => {
    const { sourceLocale = 'en', fast = false } = options;
    if (!text || text.trim() === '') return;

    // Check Cache
    const cacheKey = `lingo_${fast ? 'fast_' : ''}${sourceLocale}_${targetLocale}_${text}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      console.log('Cache hit:', cacheKey);
      onComplete(cached);
      setLatency(0); // Instant
      return;
    }

    setIsTranslating(true);
    setProgress(0);
    const startTime = performance.now();
    try {
        console.log('translate entry:', { textLength: text?.length, targetLocale, sourceLocale });
      const translatedText = await lingoRef.current.localizeText(
        text, 
        { sourceLocale, targetLocale, fast },
        (p) => setProgress(Math.round(p * 100))
      );
      
      // Update Cache
      try {
        // Simple heuristic: don't cache very short or very long texts if concerned about space, 
        // but for "default text" it's fine.
        localStorage.setItem(cacheKey, translatedText);
      } catch (e) {
        console.warn('LocalStorage full, cannot cache translation');
      }

      setLatency(Math.round(performance.now() - startTime));
      setIsTranslating(false);
      setProgress(100);
      onComplete(translatedText);
    } catch (err) {
      console.error('Translation error:', err);
      setIsTranslating(false);
    }
  }, []);

  const batchTranslate = useCallback(async (text, targetLocales, onComplete, options = {}) => {
    const { sourceLocale = 'en', fast = false } = options;
    if (!text || text.trim() === '' || !targetLocales.length) return;
    
    setIsTranslating(true);
    setProgress(0);
    const startTime = performance.now();

    try {
      console.log('Calling batchLocalizeText with:', { textLength: text.length, sourceLocale, targetLocales, fast });
      
      // Use the SDK's batchLocalizeText directly
      const results = await lingoRef.current.batchLocalizeText(
        text,
        {
            sourceLocale,
            targetLocales,
            fast
        }
      );

      // Map array results back to a locale object
      const resultMap = {};
      targetLocales.forEach((locale, index) => {
        resultMap[locale] = results[index];
      });

      setLatency(Math.round(performance.now() - startTime));
      setIsTranslating(false);
      setProgress(100);
      onComplete(resultMap);
    } catch (err) {
      console.error('Batch translation error:', err);
      setIsTranslating(false);
    }
  }, []);

  const debouncedTranslate = useCallback((text, targetLocale, onComplete, options) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      translate(text, targetLocale, onComplete, options);
    }, 500);
  }, [translate]);

  const debouncedBatchTranslate = useCallback((text, targetLocales, onComplete, options) => {
    if (batchTimeoutRef.current) clearTimeout(batchTimeoutRef.current);
    batchTimeoutRef.current = setTimeout(() => {
      batchTranslate(text, targetLocales, onComplete, options);
    }, 500);
  }, [batchTranslate]);

  return {
    isTranslating,
    latency,
    progress,
    error,
    translate,
    batchTranslate,
    debouncedTranslate,
    debouncedBatchTranslate
  };
}

// Mock translation service for development
// Replace this with actual Lingo.dev SDK integration once available

const API_KEY = import.meta.env.VITE_LINGO_API_KEY || process.env.REACT_APP_LINGO_API_KEY;

// Mock translations for development
const mockTranslations = {
  "Hello, welcome to Lingo.dev!": {
    hi: "नमस्ते, Lingo.dev में आपका स्वागत है!",
    es: "¡Hola, bienvenido a Lingo.dev!",
    fr: "Bonjour, bienvenue sur Lingo.dev !",
    de: "Hallo, willkommen bei Lingo.dev!",
    ja: "こんにちは、Lingo.devへようこそ！",
    ko: "안녕하세요, Lingo.dev에 오신 것을 환영합니다!"
  }
};

export async function translateText(text, targetLang) {
  if (!API_KEY) {
    throw new Error("Missing Lingo.dev API key. Please check your environment variables.");
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

  // For development, use mock translations
  if (mockTranslations[text] && mockTranslations[text][targetLang]) {
    return mockTranslations[text][targetLang];
  }

  // If no mock translation available, return a placeholder
  return `[${targetLang.toUpperCase()}] ${text}`;
}

// TODO: Replace with actual Lingo.dev SDK integration
// Example of how it should work with the SDK:
/*
import { LingoDotDevEngine } from "lingo.dev/sdk";

const lingoDotDev = new LingoDotDevEngine({
  apiKey: API_KEY,
});

export async function translateText(text, targetLang) {
  if (!API_KEY) {
    throw new Error("Missing Lingo.dev API key. Please check your environment variables.");
  }

  try {
    const result = await lingoDotDev.localizeText(text, {
      sourceLocale: "en",
      targetLocale: targetLang,
    });
    return result;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error("Network error. Please check your internet connection.");
    }
    throw error;
  }
}
*/

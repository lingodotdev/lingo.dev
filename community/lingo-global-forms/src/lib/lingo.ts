import { LingoDotDevEngine } from '@lingo.dev/_sdk';

const apiKey = import.meta.env.VITE_LINGO_API_KEY?.trim();
if (!apiKey) {
  console.warn(
    '⚠️ VITE_LINGO_API_KEY is not set. Translations will not work.\n' +
    'Create a .env file with your API key. See .env.example for reference.'
  );
}

/**
 * Lingo.dev engine instance for translations.
 * Null if API key is not configured.
 */
export const lingoEngine: LingoDotDevEngine | null = apiKey
  ? new LingoDotDevEngine({
      apiKey,
      apiUrl: typeof window !== 'undefined'
        ? `${window.location.origin}/api/lingo`
        : 'https://engine.lingo.dev',
    })
  : null;
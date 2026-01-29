import { LingoDotDevEngine } from '@lingo.dev/_sdk';

const apiKey = import.meta.env.VITE_LINGO_API_KEY;

if (!apiKey) {
  console.warn(
    '⚠️ VITE_LINGO_API_KEY is not set. Translations will not work.\n' +
    'Create a .env file with your API key. See .env.example for reference.'
  );
}

export const lingoEngine = new LingoDotDevEngine({
  apiKey: apiKey || '',
  apiUrl: typeof window !== 'undefined' 
    ? `${window.location.origin}/api/lingo`
    : 'https://engine.lingo.dev',
});

export const isLingoConfigured = (): boolean => {
  return Boolean(apiKey);
};

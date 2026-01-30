import { LocaleOption } from './types';

/**
 * Default locale mappings with common language names and emoji flags
 */
export const DEFAULT_LOCALE_MAP: Record<string, LocaleOption> = {
  en: { code: 'en', label: 'English', flag: '🇬🇧' },
  'en-US': { code: 'en-US', label: 'English (US)', flag: '🇺🇸' },
  'en-GB': { code: 'en-GB', label: 'English (UK)', flag: '🇬🇧' },
  es: { code: 'es', label: 'Español', flag: '🇪🇸' },
  fr: { code: 'fr', label: 'Français', flag: '🇫🇷' },
  de: { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  it: { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  pt: { code: 'pt', label: 'Português', flag: '🇵🇹' },
  'pt-BR': { code: 'pt-BR', label: 'Português (BR)', flag: '🇧🇷' },
  ru: { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  ja: { code: 'ja', label: '日本語', flag: '🇯🇵' },
  ko: { code: 'ko', label: '한국어', flag: '🇰🇷' },
  'zh-Hans': { code: 'zh-Hans', label: '简体中文', flag: '🇨🇳' },
  'zh-Hant': { code: 'zh-Hant', label: '繁體中文', flag: '🇹🇼' },
  ar: { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  hi: { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  tr: { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  pl: { code: 'pl', label: 'Polski', flag: '🇵🇱' },
  nl: { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  sv: { code: 'sv', label: 'Svenska', flag: '🇸🇪' },
  da: { code: 'da', label: 'Dansk', flag: '🇩🇰' },
  fi: { code: 'fi', label: 'Suomi', flag: '🇫🇮' },
  no: { code: 'no', label: 'Norsk', flag: '🇳🇴' },
  cs: { code: 'cs', label: 'Čeština', flag: '🇨🇿' },
  hu: { code: 'hu', label: 'Magyar', flag: '🇭🇺' },
  ro: { code: 'ro', label: 'Română', flag: '🇷🇴' },
  el: { code: 'el', label: 'Ελληνικά', flag: '🇬🇷' },
  th: { code: 'th', label: 'ไทย', flag: '🇹🇭' },
  vi: { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  id: { code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
  he: { code: 'he', label: 'עברית', flag: '🇮🇱' },
  uk: { code: 'uk', label: 'Українська', flag: '🇺🇦' },
};

/**
 * Get locale option from code, with fallback to default
 */
export function getLocaleOption(code: string): LocaleOption {
  return DEFAULT_LOCALE_MAP[code] || { code, label: code, flag: '🌐' };
}

/**
 * Build locale options from locale codes
 */
export function buildLocaleOptions(codes: string[]): LocaleOption[] {
  return codes.map(getLocaleOption);
}

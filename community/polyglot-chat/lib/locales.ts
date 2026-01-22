/**
 * Supported locales configuration
 */

export interface Locale {
    code: string;
    name: string;
    nativeName: string;
    flag: string;
    rtl?: boolean;
}

export const SUPPORTED_LOCALES: Locale[] = [
    { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
    { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
    { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
    { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
    { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
    { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
    { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
    { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇧🇷" },
    { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", rtl: true },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
    { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
];

export const DEFAULT_LOCALE = "en";

export function getLocaleByCode(code: string): Locale | undefined {
    return SUPPORTED_LOCALES.find((l) => l.code === code);
}

export function getLocaleFlag(code: string): string {
    return getLocaleByCode(code)?.flag || "🌐";
}

export function getLocaleName(code: string): string {
    return getLocaleByCode(code)?.name || code;
}

export function isRTL(code: string): boolean {
    return getLocaleByCode(code)?.rtl || false;
}

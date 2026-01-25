export type Language = Readonly<{
    code: string;
    name: string;
    nativeName: string;
}>;

export const LANGUAGES = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
    { code: "es", name: "Spanish", nativeName: "Español" },
    { code: "fr", name: "French", nativeName: "Français" },
    { code: "de", name: "German", nativeName: "Deutsch" },
    { code: "zh", name: "Chinese (Simplified)", nativeName: "中文" },
    { code: "ja", name: "Japanese", nativeName: "日本語" },
    { code: "ko", name: "Korean", nativeName: "한국어" },
    { code: "pt", name: "Portuguese", nativeName: "Português" },
    { code: "ru", name: "Russian", nativeName: "Русский" },
    { code: "ar", name: "Arabic", nativeName: "العربية" },
    { code: "bn", name: "Bengali", nativeName: "বাংলা" },
    { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
    { code: "it", name: "Italian", nativeName: "Italiano" },
    { code: "nl", name: "Dutch", nativeName: "Nederlands" },
    { code: "tr", name: "Turkish", nativeName: "Türkçe" },
    { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt" },
    { code: "th", name: "Thai", nativeName: "ไทย" },
    { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia" },
    { code: "pl", name: "Polish", nativeName: "Polski" },
] as const;

export const LANGUAGE_MAP = Object.fromEntries(
    LANGUAGES.map(l => [l.code, l])
) as Record<Language["code"], Language>;


/**
 * List of supported languages for translation
 * These are commonly used languages that Lingo.dev supports
 * 
 * This file is separated from the SDK integration to allow
 * importing in client components without bringing in server-side dependencies.
 */

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "es", name: "Spanish", nativeName: "Espanol" },
  { code: "fr", name: "French", nativeName: "Francais" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "it", name: "Italian", nativeName: "Italiano" },
  { code: "pt-BR", name: "Portuguese (Brazil)", nativeName: "Portugues (Brasil)" },
  { code: "ru", name: "Russian", nativeName: "Russkiy" },
  { code: "ja", name: "Japanese", nativeName: "Nihongo" },
  { code: "ko", name: "Korean", nativeName: "Hangugeo" },
  { code: "zh-Hans", name: "Chinese (Simplified)", nativeName: "Zhongwen (Jiantizi)" },
  { code: "zh-Hant", name: "Chinese (Traditional)", nativeName: "Zhongwen (Fantizi)" },
  { code: "ar", name: "Arabic", nativeName: "al-'Arabiyyah" },
  { code: "hi", name: "Hindi", nativeName: "Hindi" },
  { code: "bn", name: "Bengali", nativeName: "Bangla" },
  { code: "ta", name: "Tamil", nativeName: "Tamil" },
  { code: "te", name: "Telugu", nativeName: "Telugu" },
  { code: "mr", name: "Marathi", nativeName: "Marathi" },
  { code: "gu", name: "Gujarati", nativeName: "Gujarati" },
  { code: "kn", name: "Kannada", nativeName: "Kannada" },
  { code: "ml", name: "Malayalam", nativeName: "Malayalam" },
  { code: "pa", name: "Punjabi", nativeName: "Punjabi" },
  { code: "th", name: "Thai", nativeName: "Phasa Thai" },
  { code: "vi", name: "Vietnamese", nativeName: "Tieng Viet" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu" },
  { code: "tr", name: "Turkish", nativeName: "Turkce" },
  { code: "pl", name: "Polish", nativeName: "Polski" },
  { code: "uk", name: "Ukrainian", nativeName: "Ukrayinska" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands" },
  { code: "sv", name: "Swedish", nativeName: "Svenska" },
  { code: "da", name: "Danish", nativeName: "Dansk" },
  { code: "no", name: "Norwegian", nativeName: "Norsk" },
  { code: "fi", name: "Finnish", nativeName: "Suomi" },
  { code: "he", name: "Hebrew", nativeName: "'Ivrit" },
  { code: "el", name: "Greek", nativeName: "Ellinika" },
  { code: "cs", name: "Czech", nativeName: "Cestina" },
  { code: "ro", name: "Romanian", nativeName: "Romana" },
  { code: "hu", name: "Hungarian", nativeName: "Magyar" },
  { code: "sk", name: "Slovak", nativeName: "Slovencina" },
  { code: "bg", name: "Bulgarian", nativeName: "Balgarski" },
];

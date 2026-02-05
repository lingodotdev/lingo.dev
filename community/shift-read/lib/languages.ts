export interface Language {
  code: string
  name: string
  nativeName: string
  region?: string
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'es', name: 'Spanish', nativeName: 'Español', region: 'Europe' },
  { code: 'fr', name: 'French', nativeName: 'Français', region: 'Europe' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', region: 'Europe' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', region: 'Europe' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', region: 'Europe' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', region: 'Europe' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', region: 'Europe' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', region: 'Europe' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', region: 'Europe' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', region: 'Europe' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', region: 'Europe' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', region: 'Europe' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', region: 'Europe' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', region: 'Europe' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', region: 'Europe' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', region: 'Europe' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', region: 'Europe' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', region: 'Europe' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', region: 'Middle East' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', region: 'Middle East' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', region: 'Middle East' },

  { code: 'zh', name: 'Chinese', nativeName: '中文', region: 'Asia' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', region: 'Asia' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', region: 'Asia' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', region: 'Asia' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', region: 'Asia' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', region: 'Asia' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', region: 'Asia' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', region: 'Asia' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', region: 'Asia' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', region: 'Asia' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', region: 'Asia' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', region: 'Asia' },
  { code: 'fil', name: 'Filipino', nativeName: 'Filipino', region: 'Asia' },

  { code: 'en-GB', name: 'English (UK)', nativeName: 'English (UK)', region: 'Europe' },
  { code: 'en-AU', name: 'English (Australia)', nativeName: 'English (Australia)', region: 'Oceania' },
  { code: 'en-CA', name: 'English (Canada)', nativeName: 'English (Canada)', region: 'Americas' },
  { code: 'en-IN', name: 'English (India)', nativeName: 'English (India)', region: 'Asia' },
  { code: 'es-419', name: 'Spanish (Latin America)', nativeName: 'Español (Latinoamérica)', region: 'Americas' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)', region: 'Americas' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '中文 (简体)', region: 'Asia' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '中文 (繁體)', region: 'Asia' },
  { code: 'fr-CA', name: 'French (Canada)', nativeName: 'Français (Canada)', region: 'Americas' },
  { code: 'de-AT', name: 'German (Austria)', nativeName: 'Deutsch (Österreich)', region: 'Europe' },
  { code: 'de-CH', name: 'German (Swiss)', nativeName: 'Deutsch (Schweiz)', region: 'Europe' },
  { code: 'it-CH', name: 'Italian (Swiss)', nativeName: 'Italiano (Svizzera)', region: 'Europe' },
  { code: 'nl-BE', name: 'Dutch (Belgium)', nativeName: 'Nederlands (België)', region: 'Europe' },
  { code: 'fr-BE', name: 'French (Belgium)', nativeName: 'Français (Belgique)', region: 'Europe' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', region: 'Africa' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', region: 'Africa' },
  { code: 'zu', name: 'Zulu', nativeName: 'IsiZulu', region: 'Africa' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', region: 'Africa' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', region: 'Africa' },
  { code: 'sr-Cyrl', name: 'Serbian (Cyrillic)', nativeName: 'Српски', region: 'Europe' },
  { code: 'sr-Latn', name: 'Serbian (Latin)', nativeName: 'Srpski', region: 'Europe' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', region: 'Europe' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', region: 'Europe' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', region: 'Europe' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', region: 'Europe' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti', region: 'Europe' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', region: 'Europe' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', region: 'Europe' },
  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska', region: 'Europe' },
  { code: 'ga', name: 'Irish', nativeName: 'Gaeilge', region: 'Europe' },
  { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg', region: 'Europe' },
  { code: 'sq', name: 'Albanian', nativeName: 'Shqip', region: 'Europe' },
  { code: 'mk', name: 'Macedonian', nativeName: 'Македонски', region: 'Europe' },
  { code: 'bs', name: 'Bosnian', nativeName: 'Bosanski', region: 'Europe' },
  { code: 'cnr', name: 'Montenegrin', nativeName: 'Crnogorski', region: 'Europe' },
  { code: 'ka', name: 'Georgian', nativeName: 'ქართული', region: 'Asia' },
  { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն', region: 'Asia' },
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan', region: 'Asia' },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақ', region: 'Asia' },
  { code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргыз', region: 'Asia' },
  { code: 'uz', name: 'Uzbek', nativeName: 'Oʻzbek', region: 'Asia' },
  { code: 'mn', name: 'Mongolian', nativeName: 'Монгол', region: 'Asia' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', region: 'Asia' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', region: 'Asia' },
  { code: 'my', name: 'Burmese', nativeName: 'မြန်မာ', region: 'Asia' },
  { code: 'km', name: 'Khmer', nativeName: 'ខ្មែរ', region: 'Asia' },
  { code: 'lo', name: 'Lao', nativeName: 'ລາວ', region: 'Asia' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', region: 'Africa' },
  { code: 'so', name: 'Somali', nativeName: 'Soomaali', region: 'Africa' },
]

export function getLanguageByCode(code: string): Language | undefined {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code)
}

export function getLanguagesByRegion(region: string): Language[] {
  return SUPPORTED_LANGUAGES.filter(lang => lang.region === region)
}

export const REGIONS = Array.from(
  new Set(SUPPORTED_LANGUAGES.map(lang => lang.region).filter(Boolean))
) as string[]

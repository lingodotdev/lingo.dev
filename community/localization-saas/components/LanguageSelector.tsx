const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
];

interface LanguageSelectorProps {
  sourceLocale: string;
  targetLocales: string[];
  onSourceChange: (locale: string) => void;
  onTargetChange: (locales: string[]) => void;
}

export default function LanguageSelector({
  sourceLocale,
  targetLocales,
  onSourceChange,
  onTargetChange,
}: LanguageSelectorProps) {
  const toggleTargetLocale = (code: string) => {
    if (targetLocales.includes(code)) {
      onTargetChange(targetLocales.filter((l) => l !== code));
    } else {
      onTargetChange([...targetLocales, code]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Source Language
        </label>
        <select
          value={sourceLocale}
          onChange={(e) => onSourceChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target Languages
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {LANGUAGES.filter((l) => l.code !== sourceLocale).map((lang) => (
            <button
              key={lang.code}
              onClick={() => toggleTargetLocale(lang.code)}
              className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                targetLocales.includes(lang.code)
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function LanguageSwitcher({ language, setLanguage }) {
  const languages = [
    { code: 'en', flag: '🇬🇧', name: 'English' },
    { code: 'es', flag: '🇪🇸', name: 'Español' },
    { code: 'fr', flag: '🇫🇷', name: 'Français' }
  ];

  return (
    <div className="flex gap-2">
      {languages.map(lang => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`px-3 py-1 rounded-lg transition-all ${
            language === lang.code
              ? 'bg-white text-purple-600 font-semibold'
              : 'bg-purple-500 text-white hover:bg-purple-400'
          }`}
          title={lang.name}
        >
          {lang.flag}
        </button>
      ))}
    </div>
  );
}

export default LanguageSwitcher;
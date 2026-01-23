import { useState, useMemo, useEffect } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { X, Link2, Search, Globe2, CheckCircle2 } from 'lucide-react';

interface InputPanelProps {
  onGenerate: (url: string, primaryKeyword?: string, lingoApiKey?: string, geminiApiKey?: string) => Promise<void>;
  isGenerating: boolean;
  processingStep: string;
  selectedLanguages: string[];
  setSelectedLanguages: (languages: string[]) => void;
  onApiKeyChange?: () => void;
  apiKeysConfigured?: { gemini: boolean; lingo: boolean };
}

// Language categories for better organization
const languageCategories = {
  'Popular': ['English', 'Spanish', 'French', 'German', 'Japanese', 'Chinese', 'Portuguese', 'Italian', 'Russian', 'Arabic', 'Hindi', 'Korean'],
  'European': ['Dutch', 'Polish', 'Swedish', 'Danish', 'Norwegian', 'Finnish', 'Czech', 'Romanian', 'Greek', 'Hungarian', 'Bulgarian', 'Croatian', 'Serbian', 'Ukrainian', 'Belarusian', 'Slovak', 'Slovenian', 'Estonian', 'Latvian', 'Lithuanian', 'Icelandic', 'Irish', 'Welsh', 'Basque', 'Catalan', 'Galician', 'Maltese', 'Albanian', 'Macedonian'],
  'Asian': ['Vietnamese', 'Turkish', 'Thai', 'Indonesian', 'Malay', 'Urdu', 'Bengali', 'Punjabi', 'Tamil', 'Telugu', 'Malayalam', 'Khmer', 'Tagalog', 'Georgian', 'Armenian', 'Azerbaijani', 'Kazakh', 'Uzbek', 'Persian'],
  'African': ['Swahili', 'Afrikaans', 'Somali', 'Tigrinya', 'Kinyarwanda'],
};

export function InputPanel({ onGenerate, isGenerating, processingStep, selectedLanguages, setSelectedLanguages, onApiKeyChange, apiKeysConfigured }: InputPanelProps) {
  const [url, setUrl] = useState('');
  const [primaryKeyword, setPrimaryKeyword] = useState('');
  const [lingoApiKey, setLingoApiKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('globseo-lingo-api-key') || '';
    }
    return '';
  });
  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('globseo-gemini-api-key') || '';
    }
    return '';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllLanguages, setShowAllLanguages] = useState(false);

  // Persist API keys to sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('globseo-lingo-api-key', lingoApiKey);
    }
  }, [lingoApiKey]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('globseo-gemini-api-key', geminiApiKey);
    }
  }, [geminiApiKey]);
  
  // Get all available languages from categories
  const availableLanguages = useMemo(() => {
    const allLangs = new Set<string>();
    Object.values(languageCategories).forEach(langs => {
      langs.forEach(lang => allLangs.add(lang));
    });
    return Array.from(allLangs).sort();
  }, []);

  const toggleLanguage = (lang: string) => {
    if (selectedLanguages.includes(lang)) {
      setSelectedLanguages(selectedLanguages.filter(l => l !== lang));
    } else {
      setSelectedLanguages([...selectedLanguages, lang]);
    }
  };
  
  const selectAllInCategory = (category: string) => {
    const categoryLangs = languageCategories[category as keyof typeof languageCategories];
    const allSelected = categoryLangs.every(lang => selectedLanguages.includes(lang));
    
    if (allSelected) {
      // Deselect all in category
      setSelectedLanguages(selectedLanguages.filter(lang => !categoryLangs.includes(lang)));
    } else {
      // Select all in category
      const newSelected = new Set([...selectedLanguages, ...categoryLangs]);
      setSelectedLanguages(Array.from(newSelected));
    }
  };
  
  const clearAll = () => {
    setSelectedLanguages([]);
  };
  
  // Filter languages based on search
  const filteredLanguages = useMemo(() => {
    if (!searchQuery) return availableLanguages;
    return availableLanguages.filter(lang => 
      lang.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, availableLanguages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      await onGenerate(
        url.trim(), 
        primaryKeyword.trim() || undefined,
        lingoApiKey.trim() || undefined,
        geminiApiKey.trim() || undefined
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-white/10 rounded-xl p-7 transition-all duration-300 hover:border-white/20 shadow-xl">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-[#a3ff12]/10 flex items-center justify-center">
          <Link2 className="w-4 h-4 text-[#a3ff12]" />
        </div>
        <h2 className="text-white/90 tracking-tight text-xl">
          Input Content
        </h2>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-base text-white/50 mb-2.5">
            Webpage URL *
          </label>
          <Input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="bg-[#0a0a0a] border-white/10 focus:border-[#a3ff12]/50 focus:ring-[#a3ff12]/20 text-white placeholder:text-white/30 h-11 transition-all text-sm"
          />
        </div>

        <div>
          <label className="block text-white/50 mb-2.5 text-base">
            Primary Keyword (Optional)
          </label>
          <Input
            type="text"
            placeholder="e.g., SEO optimization, web development"
            value={primaryKeyword}
            onChange={(e) => setPrimaryKeyword(e.target.value)}
            className="bg-[#0a0a0a] border-white/10 focus:border-[#a3ff12]/50 focus:ring-[#a3ff12]/20 text-white placeholder:text-white/30 h-11 transition-all text-sm"
          />
        </div>

        {/* API Keys Section - Only show if not configured */}
        {(!apiKeysConfigured?.lingo || !apiKeysConfigured?.gemini) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!apiKeysConfigured?.lingo && (
              <div>
                <label className="block text-white/50 mb-2.5 text-base">
                  Lingo.dev API Key
                </label>
                <Input
                  type="password"
                  placeholder="Your Lingo.dev API key"
                  value={lingoApiKey}
                  onChange={(e) => {
                    setLingoApiKey(e.target.value);
                    onApiKeyChange?.();
                  }}
                  className="bg-[#0a0a0a] border-white/10 focus:border-[#a3ff12]/50 focus:ring-[#a3ff12]/20 text-white placeholder:text-white/30 h-11 transition-all text-sm"
                />
              </div>
            )}

            {!apiKeysConfigured?.gemini && (
              <div>
                <label className="block text-white/50 mb-2.5 text-base">
                  Gemini API Key
                </label>
                <Input
                  type="password"
                  placeholder="Your Gemini API key"
                  value={geminiApiKey}
                  onChange={(e) => {
                    setGeminiApiKey(e.target.value);
                    onApiKeyChange?.();
                  }}
                  className="bg-[#0a0a0a] border-white/10 focus:border-[#a3ff12]/50 focus:ring-[#a3ff12]/20 text-white placeholder:text-white/30 h-11 transition-all text-sm"
                />
              </div>
            )}
          </div>
        )}

        {/* Show configured keys status */}
        {(apiKeysConfigured?.lingo || apiKeysConfigured?.gemini) && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {apiKeysConfigured?.lingo && apiKeysConfigured?.gemini 
                  ? "Both API keys are configured in the backend"
                  : apiKeysConfigured?.lingo 
                    ? "Lingo.dev API key is configured in the backend"
                    : "Gemini API key is configured in the backend"
                }
              </span>
            </div>
          </div>
        )}

        {/* Target Languages Section - Improved */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-base text-white flex items-center gap-2">
              <Globe2 className="w-5 h-5" style={{color: "#A3FF12"}} />
              Target Languages
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40">
                {selectedLanguages.length} selected
              </span>
              {selectedLanguages.length > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-sm text-[#a3ff12] hover:text-[#92e610] transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{left: "10px"
            }}>
              <Search className="w-4 h-4 text-white/30" />
            </div>
            <Input
              type="text"
              placeholder="Search languages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#0a0a0a] border-white/10 focus:border-[#a3ff12]/50 focus:ring-[#a3ff12]/20 text-white placeholder:text-white/30 h-10 pl-10 text-sm"
              style={{padding: "0 30px"}}
            />
          </div>

          {/* Selected Languages - Show at top if any selected */}
          {selectedLanguages.length > 0 && !searchQuery && (
            <div className="mb-3 p-3 bg-[#a3ff12]/5 border border-[#a3ff12]/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#a3ff12]" />
                <span className="text-sm text-white/60 font-medium">Selected Languages</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedLanguages.map(lang => (
                  <Badge
                    key={lang}
                    className="bg-[#a3ff12] text-black hover:bg-[#92e610] cursor-pointer transition-all text-xs px-2 py-1"
                    onClick={() => toggleLanguage(lang)}
                  >
                    {lang}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Language Categories or Search Results */}
          <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-2">
            {searchQuery ? (
              // Search Results
              <div className="space-y-2">
                {filteredLanguages.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {filteredLanguages.map(lang => (
                      <Badge
                        key={lang}
                        variant={selectedLanguages.includes(lang) ? "default" : "outline"}
                        className={`cursor-pointer transition-all text-xs ${
                          selectedLanguages.includes(lang)
                            ? 'bg-[#a3ff12] text-black hover:bg-[#92e610]'
                            : 'bg-transparent border-white/20 text-white/60 hover:border-white/40 hover:text-white/80'
                        }`}
                        onClick={() => toggleLanguage(lang)}
                      >
                        {lang}
                        {selectedLanguages.includes(lang) && (
                          <X className="w-3 h-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-white/40 text-sm">No languages found</p>
                  </div>
                )}
              </div>
            ) : (
              // Categories View
              <div className="space-y-4">
                {Object.entries(languageCategories).map(([category, languages]) => {
                  const categorySelected = languages.filter(lang => selectedLanguages.includes(lang)).length;
                  const allSelected = categorySelected === languages.length;
                  
                  return (
                    <div key={category} className="border border-white/10 rounded-lg p-3 bg-white/[0.02] hover:border-white/20 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium text-white/80">{category}</h4>
                          <span className="text-xs text-white/40">({languages.length})</span>
                          {categorySelected > 0 && (
                            <span className="text-xs text-[#a3ff12]">
                              {categorySelected} selected
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => selectAllInCategory(category)}
                          className={`text-xs transition-colors ${
                            allSelected 
                              ? 'text-[#a3ff12] hover:text-[#92e610]' 
                              : 'text-white/40 hover:text-white/60'
                          }`}
                        >
                          {allSelected ? 'Deselect all' : 'Select all'}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {languages.map(lang => (
                          <Badge
                            key={lang}
                            variant={selectedLanguages.includes(lang) ? "default" : "outline"}
                            className={`cursor-pointer transition-all text-xs ${
                              selectedLanguages.includes(lang)
                                ? 'bg-[#a3ff12] text-black hover:bg-[#92e610]'
                                : 'bg-transparent border-white/20 text-white/60 hover:border-white/40 hover:text-white/80'
                            }`}
                            onClick={() => toggleLanguage(lang)}
                          >
                            {lang}
                            {selectedLanguages.includes(lang) && (
                              <X className="w-3 h-3 ml-1" />
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isGenerating || !url.trim()}
          className="w-full bg-[#a3ff12] hover:bg-[#92e610] text-black h-12 rounded-lg transition-all duration-300 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin font-bold"></div>
              {processingStep || 'Analyzing...'}
            </div>
          ) : (
            <span className='font-bold'>Analyze & Generate SEO</span>
          )}
        </Button>
      </div>
    </form>
  );
}
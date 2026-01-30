import { useCallback, useEffect, useState } from 'react';
import { FormBuilder } from './components/FormBuilder';
import { FormPreview } from './components/FormPreview';
import './index.css';
import { lingoEngine } from './lib/lingo';
import { clearTranslationCache, translateFormContent } from './lib/translateForm';
import type { FormContent, SupportedLocale } from './types/form';
import { DEFAULT_FORM_CONTENT } from './types/form';

function App() {
  const [formContent, setFormContent] = useState<FormContent>(DEFAULT_FORM_CONTENT);
  const [translatedContent, setTranslatedContent] = useState<FormContent | null>(null);
  const [currentLocale, setCurrentLocale] = useState<SupportedLocale>('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);
  const [translationError, setTranslationError] = useState<string | null>(null);

  const translateContent = useCallback(async (content: FormContent, locale: SupportedLocale) => {
    if (locale === 'en') {
      setTranslatedContent(null);
      return;
    }

    if (!lingoEngine) {
      setTranslationError('API key not configured. Add VITE_LINGO_API_KEY to your .env file.');
      return;
    }

    setIsTranslating(true);
    setTranslationProgress(0);
    setTranslationError(null);

    try {
      const translated = await translateFormContent(content, locale, (progress) => {
        setTranslationProgress(progress);
      });
      setTranslatedContent(translated);
    } catch (error) {
      console.error('Translation error:', error);
      setTranslationError(
        error instanceof Error ? error.message : 'Translation failed. Please try again.'
      );
      setTranslatedContent(null);
    } finally {
      setIsTranslating(false);
    }
  }, []);

  // Translate when locale changes
  useEffect(() => {
    translateContent(formContent, currentLocale);
  }, [currentLocale, translateContent, formContent]);

  const handleFormChange = (newContent: FormContent) => {
    setFormContent(newContent);

    clearTranslationCache();
    if (currentLocale !== 'en') {
      setTranslatedContent(null);
    }
  };

  const handleLocaleChange = (locale: SupportedLocale) => {
    setCurrentLocale(locale);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold bg-gradient-to-r from-green-600 to-green-600 bg-clip-text text-transparent">
              Global Form Localizer
            </h1>
          </div>
          <p className="text-sm text-slate-500 font-medium">
            Powered by <a href="https://lingo.dev" target="_blank" rel="noopener noreferrer" className="text-green-900 hover:text-green-500    transition-colors">Lingo.dev</a>
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-[450px_1fr] gap-6 h-[calc(100vh-7rem)] min-h-[600px]">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <FormBuilder
              formContent={formContent}
              onFormChange={handleFormChange}
            />
          </div>

          {/* Preview Panel */}
          <div className="bg-slate-100/50 rounded-xl border border-slate-200/60 flex flex-col h-full overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,white,transparent)] opacity-40 pointer-events-none"></div>
            <FormPreview
              formContent={formContent}
              translatedContent={translatedContent}
              currentLocale={currentLocale}
              onLocaleChange={handleLocaleChange}
              isTranslating={isTranslating}
              translationProgress={translationProgress}
              translationError={translationError}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

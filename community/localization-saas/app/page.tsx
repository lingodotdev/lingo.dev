'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import LanguageSelector from '@/components/LanguageSelector';
import TranslationPreview from '@/components/TranslationPreview';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [sourceLocale, setSourceLocale] = useState('en');
  const [targetLocales, setTargetLocales] = useState<string[]>([]);
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    if (!file || targetLocales.length === 0) return;

    setIsTranslating(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('sourceLocale', sourceLocale);
      formData.append('targetLocales', JSON.stringify(targetLocales));

      const response = await fetch('/api/translate', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setTranslations(data.translations);
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            AI Website Localization
          </h1>
          <p className="text-xl text-gray-600">
            Translate your website content instantly with Lingo.dev
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-8">
            <FileUpload file={file} onFileChange={setFile} />
            
            <LanguageSelector
              sourceLocale={sourceLocale}
              targetLocales={targetLocales}
              onSourceChange={setSourceLocale}
              onTargetChange={setTargetLocales}
            />

            <button
              onClick={handleTranslate}
              disabled={!file || targetLocales.length === 0 || isTranslating}
              className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isTranslating ? 'Translating...' : 'Translate Now'}
            </button>

            {Object.keys(translations).length > 0 && (
              <TranslationPreview translations={translations} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

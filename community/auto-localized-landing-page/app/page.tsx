"use client";

import { useState } from "react";
import { EditorForm } from "@/components/EditorForm";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Preview } from "@/components/Preview";
import type {
  LandingPageContent,
  TranslatedContent,
  SupportedLocale,
  TranslationResponse,
} from "@/lib/types";

export default function Home() {
  const [translations, setTranslations] = useState<TranslatedContent | null>(
    null,
  );
  const [selectedLocale, setSelectedLocale] = useState<SupportedLocale>("en");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (content: LandingPageContent) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const data: TranslationResponse = await response.json();

      if (data.error) {
        setError(data.error);
        setTranslations({
          en: content,
          fr: content,
          de: content,
          es: content,
          ja: content,
        });
      } else {
        setTranslations(data.translations);
        setSelectedLocale("en");
      }
    } catch (err) {
      console.error("Translation failed:", err);
      setError("Translation failed. Showing English content only.");
      setTranslations({
        en: content,
        fr: content,
        de: content,
        es: content,
        ja: content,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentContent = translations ? translations[selectedLocale] : null;
  const hasTranslations = translations !== null;

  return (
    <main className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
              L
            </div>
            <div>
              <h1 className="text-neutral-900 font-medium text-sm">
                Landing Page Generator
              </h1>
              <p className="text-xs text-neutral-500">Powered by Lingo.dev</p>
            </div>
          </div>

          <a
            href="https://lingo.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-neutral-600 hover:text-neutral-900"
          >
            Learn more →
          </a>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Split Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Editor */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <EditorForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>

          {/* Right: Preview */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            {/* Preview Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-200">
              <div>
                <h2 className="text-sm font-medium text-neutral-900">
                  Preview
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {hasTranslations
                    ? `Viewing: ${selectedLocale.toUpperCase()}`
                    : "Fill the form and generate"}
                </p>
              </div>

              <LanguageSwitcher
                selectedLocale={selectedLocale}
                onLocaleChange={setSelectedLocale}
                hasTranslations={hasTranslations}
              />
            </div>

            {/* Preview Content */}
            <Preview content={currentContent} />
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-6 h-6 border-2 border-neutral-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-neutral-600">Translating...</p>
          </div>
        </div>
      )}
    </main>
  );
}

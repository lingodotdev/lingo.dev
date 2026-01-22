"use client";

import { useState } from 'react';

export default function Home() {
  const [targetLocale, setTargetLocale] = useState('hi');
  const [flashcards, setFlashcards] = useState([
    { front: "Hello", back: "A common greeting" },
    { front: "Thank you", back: "Expression of gratitude" },
    { front: "How are you?", back: "A way to ask about someone's well-being" },
    { front: "Goodbye", back: "A farewell" },
    { front: "I love coding", back: "Expressing passion for programming" },
  ]);
  const [customInput, setCustomInput] = useState('');
  const [customTranslated, setCustomTranslated] = useState('');
  const [loading, setLoading] = useState(false);

  const translateDeck = async () => {
    setLoading(true);
    try {
      const promises = flashcards.map(async (card) => {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: card,
            sourceLocale: 'en',
            targetLocale,
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'API error');
        }

        const data = await res.json();
        return data.translated;
      });

      const translated = await Promise.all(promises);
      setFlashcards(translated);
    } catch (err) {
      console.error(err);
      alert(`Translation failed: ${(err as Error).message}`);
    }
    setLoading(false);
  };

  const translateCustom = async () => {
    if (!customInput.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: customInput,
          sourceLocale: 'en',
          targetLocale,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'API error');
      }

      const data = await res.json();
      setCustomTranslated(data.translated);
    } catch (err) {
      console.error(err);
      alert(`Custom translation failed: ${(err as Error).message}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            AI Flashcard Learner
          </h1>
          <p className="text-sm text-gray-600">Powered by Lingo.dev SDK</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-12 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <label className="text-lg font-semibold text-gray-800">Target Language:</label>
            <select
              value={targetLocale}
              onChange={(e) => setTargetLocale(e.target.value)}
              className="px-4 py-3 bg-white border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-800 font-medium"
            >
              <option value="hi">Hindi (हिंदी)</option>
              <option value="fr">French (Français)</option>
              <option value="es">Spanish (Español)</option>
              <option value="de">German (Deutsch)</option>
              <option value="ja">Japanese (日本語)</option>
            </select>
          </div>
          <button
            onClick={translateDeck}
            disabled={loading}
            className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                </svg>
                Translating...
              </span>
            ) : (
              'Translate All Cards'
            )}
          </button>
        </div>

        {/* Flashcards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
          {flashcards.map((card, index) => (
            <div
              key={index}
              className="group perspective-1000"
            >
              <div className="relative preserve-3d transition-transform duration-700 group-hover:rotate-y-180 h-64">
                {/* Front */}
                <div className="absolute inset-0 backface-hidden bg-white rounded-2xl shadow-xl p-8 flex flex-col justify-center items-center border border-gray-200">
                  <h3 className="text-2xl font-bold text-indigo-800 text-center">{card.front}</h3>
                  <p className="mt-4 text-gray-500 text-sm">Click / Hover to flip</p>
                </div>
                {/* Back */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-2xl p-8 flex flex-col justify-center items-center text-white">
                  <h3 className="text-2xl font-bold text-center">{card.front}</h3>
                  <p className="mt-6 text-lg text-center">{card.back}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Practice Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Practice Your Own Phrase
          </h2>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Type an English sentence to translate..."
              className="flex-1 px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm text-lg"
            />
            <button
              onClick={translateCustom}
              disabled={loading || !customInput.trim()}
              className="px-8 py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
            >
              {loading ? 'Translating...' : 'Translate'}
            </button>
          </div>
          {customTranslated && (
            <div className="mt-8 p-6 bg-purple-50 rounded-xl border border-purple-200">
              <p className="text-center text-xl font-medium text-purple-800">
                Translated to {targetLocale.toUpperCase()}: <span className="font-bold">{customTranslated}</span>
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md py-6 mt-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-600 text-sm">
          Built with ❤️ in Jodhpur • Powered by Lingo.dev • Community Demo for swag campaign 🚀
        </div>
      </footer>
    </div>
  );
}
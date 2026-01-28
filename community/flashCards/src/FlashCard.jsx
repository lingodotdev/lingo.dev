import React, { useState, useEffect } from 'react';

const languages = [
    { code: 'hi', name: 'Hindi' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'ja', name: 'Japanese' },
    { code: 'de', name: 'German' }
];

export default function FlashCard() {
    const [word, setWord] = useState('Enter here');
    const [targetLang, setTargetLang] = useState('hi');
    const [translatedWord, setTranslatedWord] = useState('');
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
  setLoading(true);
  try {
    const response = await fetch('http://localhost:5000/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        word: word, 
        targetLocale: targetLang 
      }),
    });
    
    const data = await response.json();
    setTranslatedWord(data.translation);
  } catch (err) {
    setTranslatedWord("Error connecting to proxy");
  } finally {
    setLoading(false);
  }
};

    // Translate whenever word or language changes
    useEffect(() => {
        handleTranslate();
        setIsFlipped(false);
    }, [word, targetLang]);

    const toggleChallenge = () => {
        const randomLang = languages[Math.floor(Math.random() * languages.length)];
        setTargetLang(randomLang.code);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
            <h1 className="text-3xl font-bold mb-8 text-blue-600">Lingo Flashcards</h1>

            {/* Controls */}
            <div className="flex flex-wrap gap-4 mb-10 bg-white p-6 rounded-xl shadow-md">
                <input
                    type="text"
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    placeholder="Enter English word..."
                    className="border p-2 rounded w-48 focus:outline-blue-400"
                />

                <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="border p-2 rounded bg-white"
                >
                    {languages.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                </select>

                <button
                    onClick={toggleChallenge}
                    className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
                >
                    🎲 Challenge Mode
                </button>
            </div>

            {/* 3D Flashcard */}
            <div
                className="group perspective w-80 h-48 cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <div className={`relative w-full h-full duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>

                    {/* Front Side */}
                    <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center border-2 border-blue-100">
                        <span className="text-xs text-gray-400 uppercase tracking-widest mb-2">English</span>
                        <h2 className="text-2xl font-semibold">{word}</h2>
                        <p className="mt-4 text-sm text-blue-400 font-medium">Click to flip</p>
                    </div>

                    {/* Back Side */}
                    <div className="absolute inset-0 w-full h-full backface-hidden bg-blue-600 text-white rounded-2xl shadow-xl flex flex-col items-center justify-center rotate-y-180">
                        <span className="text-xs opacity-75 uppercase tracking-widest mb-2">
                            {languages.find(l => l.code === targetLang)?.name}
                        </span>
                        <h2 className="text-2xl font-semibold">
                            {loading ? "..." : translatedWord}
                        </h2>
                    </div>

                </div>
            </div>
        </div>
    );
}
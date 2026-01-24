import { useState } from "react";
import { translateText } from "./lingo";

function App() {
  const [output, setOutput] = useState("Hello, welcome to Lingo.dev!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleTranslate(lang, langName) {
    setLoading(true);
    setError("");

    try {
      const translated = await translateText(
        "Hello, welcome to Lingo.dev!",
        lang
      );
      setOutput(translated);
    } catch (err) {
      setError(`Failed to translate to ${langName}: ${err.message}`);
    }

    setLoading(false);
  }

  const languages = [
    { code: "hi", name: "Hindi", flag: "🇮🇳" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "de", name: "German", flag: "🇩🇪" },
    { code: "ja", name: "Japanese", flag: "🇯🇵" },
    { code: "ko", name: "Korean", flag: "🇰🇷" }
  ];

  return (
    <div className="app-container">
      <h1 className="app-title">Lingo.dev</h1>
      
      <div className="dev-notice">
        <small>🚧 Currently using mock translations for development</small>
      </div>
      
      <div className="translation-section">
        <div className="section-label">Translated Text</div>
        <div className={`translation-output ${loading ? 'loading' : ''}`}>
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Translating...
            </>
          ) : (
            output
          )}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="button-group">
        {languages.map((lang) => (
          <button
            key={lang.code}
            className="translate-btn"
            onClick={() => handleTranslate(lang.code, lang.name)}
            disabled={loading}
          >
            {lang.flag} {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;

import { useState } from "react";
import './App.css';

const languages = [
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "hi", name: "Hindi" },
  { code: "ja", name: "Japanese" },
  { code: "zh", name: "Chinese" },
];

export default function App() {
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [targetLang, setTargetLang] = useState("es");

  const translate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          sourceLocale: "en",
          targetLocale: targetLang,
        }),
      });
      const data = await res.json();
      setOutput(data.result);
    } catch (err) {
      setOutput("Error translating text");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <div className="badge">
        🚀 BUILT WITH LINGO.DEV
      </div>

      <div className="header">
        <h1>
          SayIt<span className="gradient-text">SlayIt</span>
        </h1>
        <p className="subtitle">
          Translate the vibe, not the words.
        </p>
        <p className="desc">
          We turn internet slang into translations that actually make sense—because ‘this slaps’ shouldn’t leave your audience wondering why you’re talking about hitting someone..
        </p>
      </div>

      <div className="card">
        <textarea
          rows="5"
          placeholder="Enter your slang-heavy text..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="options">
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>

          <button onClick={translate} disabled={loading || !text.trim()}>
            {loading ? "Translating..." : "Translate"}
          </button>
        </div>

        <div className="output">
          {output || "Your translation will appear here."}
        </div>
      </div>
    </div>
  );
}


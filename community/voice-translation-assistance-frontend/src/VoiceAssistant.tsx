import { useState } from "react";
import useSpeechRecognition from "./speech/useSpeechRecognition";
import useSpeechSynthesis from "./speech/useSpeechSynthesis";

const LANGUAGES = [
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "ja", name: "Japanese" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
   { code: "en", name: "English" },
];

export default function VoiceAssistant() {
  const [translatedText, setTranslatedText] = useState("");
  const [targetLocale, setTargetLocale] = useState("es");
  const [loading, setLoading] = useState(false);

  const { startListening, listening, transcript, stopListening } = useSpeechRecognition();
  const { speak } = useSpeechSynthesis();

  let translateTimeout: any = null;
let isTranslating = false;

async function translate() {
  if (isTranslating) return;         // 🔒 prevents double calls
  if (!transcript) return;

  clearTimeout(translateTimeout);

  translateTimeout = setTimeout(async () => {
    isTranslating = true;
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: transcript,
          targetLocale,
        }),
      });

      const data = await res.json();

      if (data.error) {
        console.error("Backend error:", data.error);
        alert("Backend error: " + data.error);
      }

      if (data.translated) {
        setTranslatedText(data.translated);
        speak(data.translated, targetLocale);
      }
    } catch (err) {
      console.error("Frontend fetch error:", err);
      alert("Connection error — is the backend running on port 3001?");
    }

    setLoading(false);
    isTranslating = false;
  }, 300); 
}


  return (
    <div className="container">
      <h2>🎧 Speak to Translate</h2>

      <div className="controls">
  {!listening ? (
    <button onClick={startListening} className="record-btn">
      🎙️ Start Recording
    </button>
  ) : (
    <button onClick={stopListening} className="record-btn stop">
      ⏹️ Stop Recording
    </button>
  )}

  <select
    value={targetLocale}
    onChange={(e) => setTargetLocale(e.target.value)}
  >
    {LANGUAGES.map((l) => (
      <option key={l.code} value={l.code}>
        {l.name}
      </option>
    ))}
  </select>

  <button onClick={translate} disabled={!transcript || loading}>
    {loading ? "Translating..." : "🌐 Translate"}
  </button>
</div>

      <div className="output">
        <h3>Original:</h3>
        <p>{transcript || "Say something..."}</p>

        <h3>Translated:</h3>
        <p>{translatedText || "Translation will appear here"}</p>

        {translatedText && (
          <button onClick={() => speak(translatedText, targetLocale)}>
            🔊 Play Translation
          </button>
        )}
      </div>
    </div>
  );
}
import { useState, useRef } from "react";

export default function useSpeechRecognition() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  const recognitionRef = useRef<any>(null);

  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  function startListening() {
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition. Use Chrome desktop.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false; // final results only
    recognition.continuous = false;     // stops only when user stops manually

    recognition.onstart = () => {
      setListening(true);
      setTranscript("");
    };

    recognition.onresult = (e: any) => {
      const finalText = e.results[0][0].transcript;
      setTranscript(finalText);
    };

    recognition.onerror = (e: any) => {
      console.error("SpeechRecognition error:", e);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }

  function stopListening() {
    if (recognitionRef.current) {
      recognitionRef.current.stop(); // Manual stop
    }
  }

  return { startListening, stopListening, listening, transcript };
}
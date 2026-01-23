# 🎧 Voice Translation Assistant — Frontend
React + Vite + Web Speech API + Lingo.dev

Users can record speech, view transcripts, translate text to 30+ languages, and hear spoken translations.

## ✨ Features
- Manual Start/Stop recording
- Final transcript after stopping
- Translation via backend API
- Text-to-speech playback
- Debounced translation requests
- Clean UI workflow

## 📂 Project Structure
```
frontend/
  src/
    VoiceAssistant.tsx
    speech/
      useSpeechRecognition.ts
      useSpeechSynthesis.ts
  vite.config.ts
  package.json
  README.md
```

## 🔧 Requirements
- Node.js 18+
- Chrome recommended

## 📦 Installation
```
npm install
```

## ▶️ Start Development Server
```
npm run dev
```

Runs at `http://localhost:5173`.

## 🧠 How It Works
1. User records speech → Web Speech API returns transcript.  
2. Transcript is sent to backend `/translate`.  
3. Backend returns translated text.  
4. Browser speaks the translated text.

## ScreenShot

![alt text](<Screenshot 2026-01-23 185408.png>) 
![alt text](<Screenshot 2026-01-23 184635.png>) 
![alt text](<Screenshot 2026-01-23 184733.png>)

<video controls src="final.mp4" title="Title"></video>
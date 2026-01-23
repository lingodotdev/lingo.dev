# 🎤 Voice Translation Assistant — Backend
Express + Node.js + Lingo.dev SDK

This is the **backend API** for the Voice Translation Assistant.  
It receives text from the frontend, sends it to the **Lingo.dev SDK** for translation, retries on failure, and returns the translated result.

## 🚀 Features
- AI Translation via Lingo.dev SDK
- Automatic retry (3 attempts)
- Increased timeout (20s)
- Stable translation API
- Support for 30+ languages
- Fully CORS enabled for development

## 📂 Project Structure
```
backend/
  index.js
  package.json
  .env
  README.md
```

## 🔧 Requirements
- Node.js 18+
- Lingo.dev API Key

## 📦 Installation
```
npm install
```

## 🔐 Environment Variables
Create `.env`:
```
LINGO_API_KEY=your_lingodotdev_api_key_here
PORT=3001 
```
Noted: use only 3001 port, otherwise in frontend.

## ▶️ Run the Server
```
npm start
```

Runs at `http://localhost:3001`.

## 🔥 API Endpoint
POST `/translate`
```json
{
  "text": "Hello world",
  "targetLocale": "fr"
}
```

Response:
```json
{
  "translated": "Bonjour le monde"
}
```

## 📜 License
Same license as main Lingo.dev repo.

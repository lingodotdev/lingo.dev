# 🚀 Lingo.dev Translation Playground

A full-stack application demonstrating **real AI-powered translation** using the **official Lingo.dev JavaScript SDK**. Built for the Lingo.dev Community Directory Giveaway.

![Lingo.dev Localization Playground Dashboard](client/public/Screenshot%202026-01-22%20160515.png)

## ✨ What's New
*   **✅ Official SDK Integration**: Now using the actual `lingo.dev/sdk` package instead of direct API calls
*   **✅ Production-Ready**: Proper SDK initialization, error handling, and configuration
*   **✅ Multiple SDK Methods**: Demonstrates `localizeText()`, `localizeObject()`, and `batchLocalizeText()`

## 🚀 Features

### Frontend (React)
- **📝 Dual Input Modes**: Translate plain text or JSON objects
- **🎨 Clean UI**: Modern interface with language flags and badges
- **💡 Quick Examples**: Pre-loaded examples for testing
- **📋 Copy Functionality**: One-click copy of all translations
- **📱 Responsive Design**: Works on desktop and mobile

### Backend (Node.js/Express + Lingo.dev SDK)
- **🎯 Official SDK**: Uses `lingo.dev/sdk` package for authentic integration
- **🔄 Smart Fallback**: Automatically uses mock translations if SDK unavailable
- **⚡ Multiple Methods**: Demonstrates `localizeText()`, `localizeObject()`, `batchLocalizeText()`
- **🔧 Configurable**: SDK options like `batchSize` and `idealBatchItemSize`
- **📊 Debug Tools**: Endpoints to test SDK connectivity and functionality

## 🛠️ Tech Stack

- **Frontend**: React, Axios, CSS3
- **Backend**: Node.js, Express, **Lingo.dev SDK**
- **Styling**: Custom CSS with modern design

## 📦 Installation

### Prerequisites
- Node.js 14+ 
- npm or yarn
- Lingo.dev API key (optional - mock mode available)

### Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies (includes lingo.dev SDK)
npm install

# Create .env file
cp .env.example .env

# Edit .env with your Lingo.dev API key
# Get your API key from: https://lingo.dev
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd ../client

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔧 Configuration

### Environment Variables (.env)

**Backend (.env)**
```env
PORT=5000
FRONTEND_URL=http://localhost:5173
LINGO_DEV_API_KEY=your_lingo_dev_api_key_here  # Get from lingo.dev
```

### Available Modes
*   **SDK Mode (Recommended):** Set `LINGO_DEV_API_KEY` to your actual key from Lingo.dev
*   **Mock Mode:** Keep as `your_lingo_dev_api_key_here` for demonstration without API key

### Supported Languages
*   🇮🇳 Hindi (hi)
*   🇪🇸 Spanish (es)
*   🇫🇷 French (fr)

## 🚦 Running the Application

### Start Backend Server (with SDK)
```bash
cd server
npm start
# or for development with auto-restart
npm run dev
```

### Start Frontend Development Server
```bash
cd client
npm run dev
```

The application will be available at:
*   **Frontend:** http://localhost:5173
*   **Backend API:** http://localhost:5000

## 📖 Usage

1.  **Input Text**
    *   **Plain Text Mode:** Enter any text to translate
    *   **JSON Mode:** Paste JSON objects with string values for UI localization
2.  **Select Input Type**
    *   Toggle between 📝 Plain Text and 🗂️ JSON Object modes
3.  **Translate**
    *   Click "🚀 Translate with Lingo.dev"
    *   View translations in Hindi, Spanish, and French
4.  **Copy Results**
    *   Use "📋 Copy All Translations" to copy JSON output

## 🔍 API Endpoints

**Backend API (http://localhost:5000)**

| Endpoint | Method | Description | SDK Method Used |
| :--- | :--- | :--- | :--- |
| `/` | GET | API documentation | - |
| `/health` | GET | Service health check | - |
| `/translate` | POST | Main translation endpoint | `localizeText()` / `localizeObject()` |
| `/translate/batch` | POST | Batch translation demo | `batchLocalizeText()` |
| `/sdk-demo` | GET | SDK methods information | - |

### SDK Methods Demonstrated

```javascript
// 1. Initialize SDK
const { LingoDotDevEngine } = require("lingo.dev/sdk");
const lingoDotDev = new LingoDotDevEngine({
  apiKey: process.env.LINGO_DEV_API_KEY,
  batchSize: 50,
  idealBatchItemSize: 500
});

// 2. Text Translation
const result = await lingoDotDev.localizeText("Hello world", {
  sourceLocale: "en",
  targetLocale: "es",
  fast: true
});

// 3. Object Translation
const translated = await lingoDotDev.localizeObject({
  greeting: "Hello",
  farewell: "Goodbye"
}, {
  sourceLocale: "en",
  targetLocale: "es"
});

// 4. Batch Translation
const batchResults = await lingoDotDev.batchLocalizeText("Hello world", {
  sourceLocale: "en",
  targetLocales: ["hi", "es", "fr"]
});
```

## 🎯 Lingo.dev SDK Features Implemented

### ✅ Core SDK Components
*   **LingoDotDevEngine** - SDK initialization and configuration
*   **localizeText()** - Text string translation with locale options
*   **localizeObject()** - Nested object translation preserving structure
*   **batchLocalizeText()** - Multiple language translation in one call

### ✅ Production Features
*   SDK error handling and graceful degradation
*   Configuration options (`batchSize`, `idealBatchItemSize`)
*   Automatic retry and fallback mechanisms
*   Environment-based API key management

### ✅ Ready for Expansion
*   Framework ready for `localizeChat()` and `localizeHtml()` methods
*   Progress tracking callback implementation pattern
*   Batch processing optimization

## 🏗️ Project Structure

```text
lingo-localization-playground/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   ├── App.css        # Styles
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Backend with Lingo.dev SDK
│   ├── server.js          # Express server with SDK integration
│   ├── package.json       # Includes "lingo.dev": "latest"
│   └── .env.example       # Environment template
│
└── README.md              # This documentation
```

## 🤝 Contributing
1.  Fork the repository
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit changes (`git commit -m 'Add AmazingFeature'`)
4.  Push to branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📝 Submission Details

**For Lingo.dev Community Directory**
*   **Directory:** /community
*   **Event:** Lingo.dev Community Giveaway
*   **Timeframe:** Built within 24-hour sprint
*   **Status:** Ready for Review ✅

### What This Demo Shows
*   **Authentic SDK Usage:** Implements official `lingo.dev/sdk` patterns
*   **Real-World Application:** Full-stack React + Node.js implementation
*   **Production Readiness:** Error handling, configuration, logging
*   **Multiple Use Cases:** Text, JSON objects, and batch translation

### Learning Journey
*   Started with direct API integration attempts
*   Engaged with Lingo.dev community for guidance
*   Successfully implemented official SDK based on documentation
*   Built a functional, user-friendly translation interface

## 🚨 Troubleshooting

### Common Issues

**SDK Initialization Errors**
```bash
# Ensure lingo.dev package is installed
cd server
npm install lingo.dev

# Check API key format in .env
LINGO_DEV_API_KEY=your_actual_key_here
```

**CORS Errors**
*   Ensure frontend URL matches `FRONTEND_URL` in `.env`
*   Default: `http://localhost:5173` (Vite default)

**Mock Mode Activation**
*   If no valid API key is found, app automatically uses mock translations
*   Mock mode provides sample translations for demonstration

## 📄 License
This project is open source and available for the Lingo.dev Community Giveaway.

## 🙏 Acknowledgments
*   Built for Lingo.dev Community Directory
*   Uses official Lingo.dev JavaScript SDK
*   Special thanks to the Lingo.dev team for guidance
*   Inspired by real-world localization challenges
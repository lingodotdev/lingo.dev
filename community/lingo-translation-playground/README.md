# 🌐 Lingo.dev Localization Playground

A full-stack application demonstrating real-time AI-powered translation using Lingo.dev JavaScript SDK patterns. Built for the Lingo.dev Community Directory Giveaway.

![Lingo.dev Localization Playground Dashboard](client/public/Screenshot%202026-01-22%20160515.png)

## 🚀 Features

### Frontend (React)
*   **📝 Dual Input Modes:** Translate plain text or JSON objects
*   **🎨 Clean UI:** Modern interface with language flags and badges
*   **💡 Quick Examples:** Pre-loaded examples for testing
*   **📋 Copy Functionality:** One-click copy of all translations
*   **📱 Responsive Design:** Works on desktop and mobile

### Backend (Node.js/Express)
*   **🔄 Real API Integration:** Connects to Lingo.dev translation API
*   **🛡️ Fallback System:** Automatically uses mock translations if API fails
*   **📊 Debug Endpoint:** Test API connectivity and endpoints
*   **🔐 Secure:** API key management with environment variables
*   **⚡ Fast:** Optimized with batch processing

## 🛠️ Tech Stack

*   **Frontend:** React, Axios, CSS3
*   **Backend:** Node.js, Express, Axios, CORS
*   **API:** Lingo.dev Translation API
*   **Styling:** Custom CSS with modern design

## 📦 Installation

### Prerequisites
*   Node.js 14+
*   npm or yarn
*   Lingo.dev API key (optional - mock mode available)

### Backend Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd lingo-localization-playground/server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# Add your Lingo.dev API key if available
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
LINGO_DEV_API_KEY=your_lingo_dev_api_key_here
```

### Available Modes
*   **API Mode:** Set `LINGO_DEV_API_KEY` to your actual key.
*   **Mock Mode:** Keep as `your_lingo_dev_api_key_here` for mock translations.

### Supported Languages
*   🇮🇳 Hindi (hi)
*   🇪🇸 Spanish (es)
*   🇫🇷 French (fr)

## 🚦 Running the Application

### Start Backend Server
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

### Access Points
The application will be available at:
*   **Frontend:** http://localhost:5173
*   **Backend API:** http://localhost:5000

## 📖 Usage

1.  **Input Text**
    *   **Plain Text Mode:** Enter any text to translate.
    *   **JSON Mode:** Paste JSON objects with string values for UI localization.
2.  **Select Input Type**
    *   Toggle between 📝 Plain Text and 🗂️ JSON Object modes.
3.  **Translate**
    *   Click "🚀 Translate with Lingo.dev".
    *   View translations in Hindi, Spanish, and French.
4.  **Copy Results**
    *   Use "📋 Copy All Translations" to copy JSON output.

## 🔍 API Endpoints

### Backend API (http://localhost:5000)

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/` | GET | API documentation |
| `/health` | GET | Health check |
| `/translate` | POST | Main translation endpoint |
| `/debug` | GET | Debug API connectivity |

### Translation Request Format
```json
{
  "text": "Hello world or JSON object",
  "inputType": "text"  // or "json"
}
```

### Translation Response
```json
{
  "success": true,
  "translations": {
    "hi": "नमस्ते दुनिया",
    "es": "Hola Mundo",
    "fr": "Bonjour le monde"
  },
  "inputType": "text",
  "languages": [...],
  "mode": "API Mode"
}
```

## 🎯 Features in Detail

### 🔄 Smart Fallback System
*   Attempts real Lingo.dev API first.
*   Falls back to mock translations if API fails.
*   Multiple endpoint patterns for better compatibility.

### 📊 Debug Tools
*   `/debug` endpoint shows API connectivity status.
*   Console logs for troubleshooting.
*   Detailed error messages.

### 🛡️ Error Handling
*   Input validation for empty text.
*   JSON parsing validation.
*   Network timeout handling.
*   Graceful degradation.

## 🏗️ Project Structure

```text
lingo-localization-playground/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   └── App.css        # Styles
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Backend Node.js app
│   ├── server.js          # Main Express server
│   ├── package.json
│   └── .env
│
└── README.md              # This file
```

## 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit changes (`git commit -m 'Add AmazingFeature'`).
4.  Push to branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📝 Notes for Lingo.dev Community

### Submission Details
*   **Directory:** `/community`
*   **Event:** Lingo.dev Community Giveaway
*   **Timeframe:** Built within 24-hour sprint
*   **Pattern:** Implements Lingo.dev JavaScript SDK patterns

### SDK Patterns Implemented
*   `localizeText()` - Text string translation
*   `localizeObject()` - JSON object translation
*   Batch translation ready structure
*   Error handling with retries
*   Progress tracking pattern

### Ready for Production
*   ✅ Production-ready error handling
*   ✅ Security with environment variables
*   ✅ CORS configuration
*   ✅ API key validation
*   ✅ Comprehensive logging

## 🚨 Troubleshooting

### Common Issues

**CORS Errors**
*   Ensure frontend URL matches `FRONTEND_URL` in `.env`.
*   Check if ports are correct.

**API 404 Errors**
*   Check `/debug` endpoint for connectivity.
*   Verify Lingo.dev API key is valid.
*   Use mock mode for testing.

**JSON Parsing Errors**
*   Ensure valid JSON format in JSON mode.
*   Use examples for reference.

**Server Not Starting**
*   Check if port is already in use.
*   Verify Node.js version (14+ required).
*   Run `npm install` to ensure dependencies.

## 📄 License
This project is open source and available for the Lingo.dev Community Giveaway.

## 🙏 Acknowledgments
*   Built for Lingo.dev Community Directory
*   Inspired by Lingo.dev JavaScript SDK documentation
*   Special thanks to the Lingo.dev team
*   Built with ❤️ for the Lingo.dev Community Giveaway
# Lingo Chatbot

A lightweight, multilingual chatbot demo built for the Lingo competition. Lingo Chatbot lets users send messages in English (or any supported language) and receive AI-generated responses that are translated on-the-fly into the selected language using Lingo.dev. The bot supports text input, image/file attachments, and emoji reactions for a modern, engaging chat experience.

- Author: Yuvraj Nayak (Class 10)  
- GitHub: https://github.com/YuvrajNayak19  
- Demo: (Add a link here if you host a live demo)

---

## Table of contents

- [Key features](#key-features)
- [How it works](#how-it-works)
- [Project structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & running](#installation--running)
- [Configuration](#configuration)
- [Dependencies](#dependencies)
- [Development notes](#development-notes)
- [Future improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Key features

- Real-time AI chat using Google Gemini for response generation
- Multilingual support via Lingo.dev translations (automatic translation to the selected language)
- File attachments — upload images to include in the conversation
- Emoji picker & reactions
- Responsive UI that works on desktop and mobile
- Lightweight — runs in the browser; minimal setup required

---

## How it works

1. A user sends a message through the chat input.
2. The message is forwarded to the AI backend (Google Gemini) which generates a response.
3. The generated response is translated using Lingo.dev to the language selected by the user.
4. The translated response is displayed in the chat UI. Attachments and emojis are handled alongside messages.

---

## Project structure

Root layout (example)
```
lingo-chatbot/
├── index.html         # Main HTML file (chat UI)
├── script.js          # Frontend logic, API calls and translation flow
├── style.css          # Chat UI styles
├── locales/           # Translation files / language resources
│   ├── en.json        # English translations
│   └── es.json        # Spanish translations (example)
├── assets/            # Images, icons, emojis, etc.
└── README.md          # This file
```

Adjust paths if your implementation differs.

---

## Prerequisites

- Modern web browser (Chrome/Edge/Firefox)
- Internet connection for API calls to Google Gemini and Lingo.dev
- API keys for:
  - Google Gemini (or your chosen AI backend)
  - Lingo.dev (for translation)

---

## Installation & running

1. Clone the repository:
   ```
   git clone https://github.com/YuvrajNayak19/lingo-chat-bot.git
   cd lingo-chat-bot
   ```

2. Open `index.html` in your browser (for a simple static demo), or serve the folder using a local static server:
   - Using Python 3:
     ```
     python -m http.server 8000
     ```
     Then open `http://localhost:8000`.

3. Configure API keys as described below, then start interacting with the chatbot.

---

## Configuration

This project expects API keys to be provided to the frontend (for demo purposes) or — preferably — to a backend service that proxies requests to the AI and translation APIs.

Example: store keys in `script.js` only for local testing (DO NOT commit keys):

```js
// script.js (example)
const GEMINI_API_KEY = "<YOUR_GOOGLE_GEMINI_API_KEY>";
const LINGO_API_KEY   = "<YOUR_LINGO_DEV_API_KEY>";
```

Recommended (secure) approach:
- Implement a small backend endpoint that stores the API keys in environment variables and proxies requests from the frontend.
- Frontend calls your backend which then calls Google Gemini and Lingo.dev. This keeps keys secret.

Environment example for a backend:
```
GEMINI_API_KEY=your_gemini_key_here
LINGO_API_KEY=your_lingo_key_here
PORT=3000
```

---

## Dependencies

- Lingo.dev SDK — used for translation (link: https://lingo.dev)
- Emoji Mart — emoji picker component (link: https://github.com/missive/emoji-mart)
- Google Gemini API — AI-generated responses (link: https://developers.google.com/)

Note: Replace links above with the exact SDK or package pages you use. If the project is pure frontend and uses CDN links, list the CDN resources here.

---

## Development notes

- Frontend entrypoint: `index.html`
- Main logic: `script.js`
- Styling: `style.css`
- Languages: `locales/*.json` — add new language JSON files to extend supported languages.
- Attachments: current demo supports single-image uploads. Add server-side handling for larger files or multiple types.

Testing & linting:
- Add your preferred test framework and linter if you expand the project (e.g., Jest, ESLint).

Security:
- Never commit API keys to source control.
- For production usage, always proxy requests through a backend to protect secrets.

---

## Future improvements

- Voice input/output (speech-to-text / text-to-speech)
- Persistent chat history via cloud storage or a lightweight DB
- Support for more file types and multiple attachments
- Better error handling and offline fallback
- Server-side implementation and authentication
- WebSocket-based real-time updates for multi-user scenarios

---

## Contributing

Contributions are welcome! Suggested workflow:

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add amazing feature"`
4. Push and open a pull request

Please include tests and update documentation when adding major features.

---

## License

Add a license for your project (e.g., MIT). If you want to use MIT, create a `LICENSE` file with the full text and add:

```
Licensed under the MIT License. See LICENSE file for details.
```

---

## Contact

Yuvraj Nayak  
GitHub: https://github.com/YuvrajNayak19  
Email: yuvrajnayak3011@gmail.com

---
# Word Flip Lingo

A language learning game that helps users practice vocabulary by shuffling words and having them arrange the characters in the correct order while translating between languages.


## What the App Does

Word Flip Lingo is an interactive vocabulary practice game where:

1. **Select Languages**: Choose a "Known" language (what you already know) and a "Practice" language (what you want to learn)
2. **Get a Word**: The app displays a word in your known language
3. **Play the Game**: The translated word gets shuffled into individual characters
4. **Arrange & Solve**: Select characters in the correct order to form the translated word
5. **Learn**: Get instant feedback on whether your answer is correct


## How to Run It Locally

### Prerequisites

- Node.js 18+
- pnpm or npm
- A Lingo.dev API key

### Setup

1. **Clone the repository and navigate to the project which is in community folder: word-flip-lingo
   ```bash
   cd word-flip-lingo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the backend:**
   - create `backend/.env` file
   - Add your Lingo.dev API key:
     ```
     LINGODOTDEV_API_KEY=your_api_key_here
     PORT=5000
     ```

4. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run at `http://localhost:5000`

5. **Start the frontend (in a new terminal):**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run at `http://localhost:5173`


## Lingo.dev Features Highlighted

I used SDK to this project.

### 1. Translation API 
The app uses Lingo.dev's translation engine to convert words between languages in real-time. When you click "Start the game," the API translates your word instantly. It works with 20+ languages and gives accurate translations every time.

### 2. Localization API
The `localizeObject` method handles the translation work:
```javascript
const translated = await lingoDotDev.localizeObject(content, {
  sourceLocale,
  targetLocale,
});
```

### 3. Multi-Language Support
The app works with a ton of languages - English, Hindi, Japanese, Spanish, French, German, Chinese, Korean, and many Indian languages.


## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, CSS Modules
- **Backend**: Node.js, Express,
- **Translation**: Lingo.dev SDK

## License

MIT

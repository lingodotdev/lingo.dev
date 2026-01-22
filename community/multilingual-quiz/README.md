# Trivia Quiz Game

A modern, interactive trivia quiz game built with React, TypeScript, Vite, and **Lingo.dev SDK** for multilingual support.

## Features

- 🎯 Multiple choice questions with 4 options each
- 🌍 **Multilingual support** - 11 languages with AI-powered translations
- 🎨 Beautiful gradient UI with smooth animations
- 📊 Real-time score tracking
- ✅ Visual feedback for correct/incorrect answers
- 📈 Progress bar showing quiz completion
- 🏆 Results screen with performance feedback
- 🔄 Restart functionality
- 📱 Fully responsive design

## Supported Languages

- 🇬🇧 English
- 🇪🇸 Español (Spanish)
- 🇫🇷 Français (French)
- 🇩🇪 Deutsch (German)
- 🇮🇹 Italiano (Italian)
- 🇵🇹 Português (Portuguese)
- 🇮🇳 हिन्दी (Hindi)
- 🇯🇵 日本語 (Japanese)
- 🇰🇷 한국어 (Korean)
- 🇨🇳 中文 (Chinese)
- 🇸🇦 العربية (Arabic)

## Why Lingo.dev?

This project demonstrates a real-world use case for **Lingo.dev SDK** - making applications globally accessible without managing translation files or hiring translators.

### The Use Case: Dynamic Content Translation

Traditional i18n solutions require:
- ❌ Manual translation of every string into JSON files
- ❌ Managing multiple locale files (en.json, es.json, fr.json, etc.)
- ❌ Hiring professional translators for each language
- ❌ Updating translations every time content changes
- ❌ Large bundle sizes with all translations loaded

**Lingo.dev solves this by:**
- ✅ **AI-powered real-time translation** - Content is translated on-demand using advanced language models
- ✅ **Zero translation files** - No need to maintain locale JSON files
- ✅ **Automatic content updates** - Add new questions, they're instantly translatable
- ✅ **Smart caching** - Translations are cached to minimize API calls and improve performance
- ✅ **Context-aware** - AI understands context for more accurate translations
- ✅ **Cost-effective** - 10,000 free words/month, then pay-as-you-go

## Getting Started

### Installation

```bash
npm install
```

### Setup Lingo.dev API Key

For multilingual support with real-time AI translations:

1. Get your free API key from [https://lingo.dev](https://lingo.dev)
2. Copy `.env.example` to `.env`
3. Add your API key to `.env`:

```env
VITE_LINGO_API_KEY=your-api-key-here
```

**Note:** Without an API key, the app will work in English only.

### Running the Application

```bash
npm run dev
```

The application will open at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Project Structure

```
multilingual-quiz/
├── src/
│   ├── components/
│   │   ├── Quiz.tsx              # Main quiz component with translations
│   │   ├── Quiz.css              # Quiz styling
│   │   ├── LanguageSelector.tsx  # Language switcher component
│   │   └── LanguageSelector.css  # Language selector styling
│   ├── context/
│   │   └── TranslationContext.tsx # Lingo.dev translation provider
│   ├── data/
│   │   └── questions.json        # Quiz questions data
│   ├── types/
│   │   └── quiz.ts               # TypeScript interfaces
│   ├── App.tsx                   # Root component
│   ├── App.css                   # Global styles
│   ├── main.tsx                  # Application entry point
│   └── vite-env.d.ts             # Vite type declarations
├── .env.example                  # Environment variables template
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## How to Play

1. Select your preferred language from the dropdown in the top-right corner
2. Read each question carefully (automatically translated to your language)
3. Click on one of the four answer options
4. The correct answer will be highlighted in green
5. If you selected the wrong answer, it will be highlighted in red
6. Click "Next Question" to continue
7. View your final score and performance feedback at the end
8. Click "Restart Quiz" to play again

## Adding More Questions

To add more questions, edit the `src/data/questions.json` file:

```json
{
  "id": 11,
  "question": "Your question here?",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correctAnswer": 0
}
```

The `correctAnswer` is the index (0-3) of the correct option in the options array.

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Lingo.dev SDK** - Multilingual AI translations
- **CSS3** - Animations and styling

## Lingo.dev Integration

The app uses the Lingo.dev SDK for translations:

```typescript
import { LingoDotDevEngine } from 'lingo.dev/sdk';

const lingoDotDev = new LingoDotDevEngine({ apiKey: 'your-api-key' });

// Translate text
const translated = await lingoDotDev.localizeText(text, {
  sourceLocale: 'en',
  targetLocale: 'es',
});

// Translate objects
const translatedObj = await lingoDotDev.localizeObject(obj, {
  sourceLocale: 'en',
  targetLocale: 'fr',
});
```

## License

MIT

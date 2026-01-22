# 🌐 Lingo Verse - Global Translation Explorer

<p align="center">
  <img src="https://img.shields.io/badge/Lingo.dev-SDK-00d4aa?style=for-the-badge" alt="Lingo.dev SDK"/>
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-18-61dafb?style=for-the-badge" alt="React"/>
  <img src="https://img.shields.io/badge/Three.js-3D-black?style=for-the-badge" alt="Three.js"/>
</p>

**Lingo Verse** is an immersive, visually stunning translation playground that showcases the power of [Lingo.dev SDK](https://lingo.dev). Watch your words travel across a 3D globe as they're translated into multiple languages in real-time.

## ✨ Features

### Core Translation
- **🌍 Interactive 3D Globe** - Visualize translation paths between source and target languages on a beautiful animated globe
- **⚡ Real-time Translation** - Translate text to multiple languages simultaneously using Lingo.dev's AI-powered engine
- **🔍 Language Detection** - Automatic source language detection when you're not sure what language your text is in
- **🌏 16+ Languages** - Support for English, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, Chinese, Arabic, Hindi, Turkish, Dutch, Polish, Swedish, and more

### User Experience
- **🎨 Dark/Light Theme** - Beautiful theme toggle with smooth transitions and theme-aware 3D globe
- **📝 Sample Text Presets** - Quick demo buttons for Business, Casual, Technical, Marketing, Legal, and Creative content
- **📊 Translation Stats** - Real-time word count, character count, and translation timing
- **🔊 Text-to-Speech** - Listen to translations in their native pronunciation
- **⌨️ Keyboard Shortcuts** - Power user features (Ctrl+Enter to translate, Escape to clear, ? for help)

### Export & Share
- **📥 Export Options** - Download translations as JSON or CSV
- **📋 Copy All** - Copy all translations to clipboard with one click
- **🎯 Individual Copy** - Copy individual translations easily

### Design
- **🎨 Stunning UI** - Unique cosmic teal & amber aesthetic with glass morphism effects
- **✨ Smooth Animations** - Framer Motion powered animations throughout
- **📱 Responsive Design** - Works beautifully on desktop and mobile devices
- **🌙 Theme Persistence** - Your theme preference is saved locally

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **pnpm**
- A **Lingo.dev API Key** - Get yours at [lingo.dev](https://lingo.dev)

### Installation

1. Navigate to the project directory:
   ```bash
   cd community/lingo-verse
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

5. Enter your Lingo.dev API key when prompted (it's stored locally in your browser)

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + Enter` | Translate text |
| `Escape` | Clear input |
| `?` | Show keyboard shortcuts help |

## 🛠️ Tech Stack

- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://react.dev/)** - UI library
- **[Lingo.dev SDK](https://lingo.dev/sdk)** - AI-powered translation engine
- **[Three.js](https://threejs.org/)** + **[@react-three/fiber](https://docs.pmnd.rs/react-three-fiber)** - 3D graphics
- **[Framer Motion](https://www.framer.com/motion/)** - Animations
- **[Zustand](https://zustand-demo.pmnd.rs/)** - State management
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety

## 📁 Project Structure

```
lingo-verse/
├── src/
│   ├── app/
│   │   ├── api/translate/     # Translation API route
│   │   ├── layout.tsx         # Root layout with fonts
│   │   ├── page.tsx           # Main page component
│   │   └── globals.css        # Global styles & themes
│   ├── components/
│   │   ├── Globe.tsx          # 3D globe visualization
│   │   ├── TranslationInput.tsx
│   │   ├── TranslationCard.tsx
│   │   ├── LanguageSelector.tsx
│   │   ├── TranslateButton.tsx
│   │   ├── ApiKeyModal.tsx
│   │   ├── ThemeToggle.tsx    # Dark/Light mode toggle
│   │   ├── SamplePresets.tsx  # Quick sample text buttons
│   │   ├── TranslationStats.tsx
│   │   ├── ExportButton.tsx   # Export translations
│   │   ├── TextToSpeech.tsx   # TTS functionality
│   │   └── KeyboardShortcuts.tsx
│   └── store/
│       ├── useTranslationStore.ts
│       └── useThemeStore.ts
├── package.json
├── tailwind.config.js
└── next.config.mjs
```

## 🎯 SDK Features Demonstrated

This demo showcases multiple Lingo.dev SDK capabilities:

1. **`localizeText()`** - Translate single text strings to target languages
2. **`recognizeLocale()`** - Automatic language detection
3. **Batch Translation** - Parallel translation to multiple languages
4. **Error Handling** - Graceful error handling with user feedback

## 🎨 Design Philosophy

Lingo Verse was designed with these principles:

- **Cosmic Aesthetic** - Unique teal & amber color palette (avoiding typical "AI purple")
- **Glass Morphism** - Subtle blur and transparency effects for depth
- **Meaningful Animation** - Every animation serves a purpose
- **Typography Matters** - Native fonts for different scripts (Noto Sans for CJK, Arabic, etc.)
- **Accessibility** - High contrast, clear hierarchy, keyboard navigation

## 🔑 API Key Security

Your Lingo.dev API key is:
- Stored locally in your browser's localStorage
- Sent only to the local Next.js API route, which then communicates with Lingo.dev
- Never exposed to the client-side code or third parties

## 🤝 Contributing

Found a bug or have an idea? Feel free to:
- Open an issue
- Submit a pull request
- Join the [Lingo.dev Discord](https://lingo.dev/go/discord)

## 📄 License

This project is part of the Lingo.dev community contributions and is licensed under the same terms as the repository (Apache 2.0).

---

<p align="center">
  Built with ❤️ using <a href="https://lingo.dev">Lingo.dev</a>
</p>

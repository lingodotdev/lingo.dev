# 🌐 Lingo Verse - Global Translation Explorer

<p align="center">
  <img src="https://img.shields.io/badge/Lingo.dev-SDK-00d4aa?style=for-the-badge" alt="Lingo.dev SDK"/>
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-19-61dafb?style=for-the-badge" alt="React"/>
  <img src="https://img.shields.io/badge/Three.js-3D-black?style=for-the-badge" alt="Three.js"/>
</p>

**Lingo Verse** is an immersive, visually stunning translation playground that showcases the power of [Lingo.dev SDK](https://lingo.dev). Watch your words travel across a 3D globe as they're translated into multiple languages in real-time.

## ✨ Features

- **🌍 Interactive 3D Globe** - Visualize translation paths between source and target languages on a beautiful animated globe
- **⚡ Real-time Translation** - Translate text to multiple languages simultaneously using Lingo.dev's AI-powered engine
- **🔍 Language Detection** - Automatic source language detection when you're not sure what language your text is in
- **🎨 Stunning UI** - A unique cosmic teal & amber aesthetic with glass morphism effects, smooth animations, and beautiful typography
- **📱 Responsive Design** - Works beautifully on desktop and mobile devices
- **🌏 16+ Languages** - Support for English, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, Chinese, Arabic, Hindi, Turkish, Dutch, Polish, Swedish, and more

## 🖼️ Preview

The app features:
- A mesmerizing 3D globe with orbiting language nodes
- Connection lines showing translation paths during active translations
- Glass-morphism UI elements with subtle animations
- Typewriter-style word visualization
- Beautiful translation cards with native script support

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **pnpm** (recommended) or npm
- A **Lingo.dev API Key** - Get yours at [lingo.dev](https://lingo.dev)

### Installation

1. Navigate to the project directory:
   ```bash
   cd community/lingo-verse
   ```

2. Install dependencies:
   ```bash
   pnpm install
   # or
   npm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

5. Enter your Lingo.dev API key when prompted (it's stored locally in your browser)

## 🛠️ Tech Stack

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[Lingo.dev SDK](https://lingo.dev/sdk)** - AI-powered translation engine
- **[Three.js](https://threejs.org/)** + **[@react-three/fiber](https://docs.pmnd.rs/react-three-fiber)** - 3D graphics
- **[Framer Motion](https://www.framer.com/motion/)** - Animations
- **[Zustand](https://zustand-demo.pmnd.rs/)** - State management
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety

## 📁 Project Structure

```
lingo-verse/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout with fonts
│   │   ├── page.tsx        # Main page component
│   │   └── globals.css     # Global styles & CSS variables
│   ├── components/
│   │   ├── Globe.tsx           # 3D globe visualization
│   │   ├── TranslationInput.tsx # Text input component
│   │   ├── TranslationCard.tsx  # Translation result card
│   │   ├── LanguageSelector.tsx # Language picker
│   │   ├── TranslateButton.tsx  # Translate action button
│   │   └── ApiKeyModal.tsx      # API key configuration
│   └── store/
│       └── useTranslationStore.ts # Zustand state management
├── package.json
├── tsconfig.json
└── next.config.ts
```

## 🎯 How It Works

1. **Select Languages** - Choose a source language (or let AI auto-detect) and pick target languages
2. **Enter Text** - Type or paste the text you want to translate
3. **Translate** - Click the translate button to send your text across the globe
4. **Watch the Magic** - See the 3D globe animate as translations flow to different regions
5. **View Results** - Beautiful translation cards appear with the translated text

## 🔑 API Key

Your Lingo.dev API key is:
- Stored locally in your browser's localStorage
- Never sent to any server other than Lingo.dev's official API
- Required for translation functionality

Get your API key at [lingo.dev](https://lingo.dev)

## 🎨 Design Philosophy

Lingo Verse was designed with these principles:

- **Cosmic Aesthetic** - A unique teal & amber color palette that avoids the typical "AI purple" cliché
- **Glass Morphism** - Subtle blur and transparency effects for depth
- **Meaningful Animation** - Every animation serves a purpose and enhances understanding
- **Typography Matters** - Native fonts for different scripts (Noto Sans for CJK, Arabic, etc.)
- **Accessibility** - High contrast, clear hierarchy, and keyboard navigation support

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

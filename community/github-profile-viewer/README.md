# GitHub Profile Viewer - Lingo.dev Demo

## 🎯 Description

A modern GitHub profile search application demonstrating **automatic AI-powered internationalization** using [Lingo.dev](https://lingo.dev). Search for any GitHub user and view their profile information in multiple languages with zero manual translation effort.

Built with **Next.js 16** and **Tailwind CSS 4**, this demo showcases how Lingo.dev automatically extracts, translates, and manages UI text without requiring code changes.

## ✨ Lingo.dev Features Highlighted

- 🤖 **Automatic Text Extraction**: No manual marking of translatable strings needed
- 🌍 **AI-Powered Translations**: Real-time translations using Lingo.dev Engine
- 🎛️ **Built-in LocaleSwitcher**: Pre-built language switcher component
- ⚡ **Zero-Config Integration**: Minimal setup with Next.js plugin
- 📦 **Type-Safe**: Full TypeScript support out of the box
- 🔄 **Hot Reload**: Instant translation updates during development

## 🚀 Technical Implementation

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Lingo Integration**: `@lingo.dev/compiler` with Next.js plugin
- **Translation Engine**: Lingo.dev AI Engine
- **Supported Languages**: English, Spanish, German, French, Hindi

## 📱 Features

- 🔍 **GitHub User Search**: Real-time profile fetching via GitHub API
- 🌐 **5 Languages**: English, Español, Deutsch, Français, हिन्दी
- 🎨 **Modern UI**: Glass-morphism design with dark mode support
- ⚡ **Instant Translation**: Switch languages without page reload
- 📊 **Profile Stats**: Repositories, followers, following counts
- 🔗 **Direct Links**: Quick access to GitHub profiles
- ♿ **Accessible**: Semantic HTML and keyboard navigation

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ installed
- Lingo.dev account (free tier available)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd community/github-profile-viewer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Authenticate with Lingo.dev**

   ```bash
   npx lingo.dev@latest login
   ```

   Or manually add your API key to `.env.local`:

   ```env
   LINGODOTDEV_API_KEY=your_api_key_here
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

The Lingo.dev compiler is configured in `next.config.ts`:

```typescript
await withLingo(nextConfig, {
  sourceRoot: "./app",
  sourceLocale: "en",
  targetLocales: ["es", "de", "fr", "hi"],
  models: "lingo.dev",
  dev: {
    usePseudotranslator: false, // Set to true for free fake translations
  },
});
```

### Adding More Languages

1. Update `next.config.ts` with new locale codes:

   ```typescript
   targetLocales: ["es", "de", "fr", "hi", "ja", "zh"],
   ```

2. Add language options to `LocaleSwitcher` in `app/page.tsx`:

   ```tsx
   <LocaleSwitcher
     locales={[
       { code: "en", label: "English" },
       { code: "ja", label: "日本語" },
       { code: "zh", label: "中文" },
     ]}
   />
   ```

3. Restart your dev server to generate translations.

## 📂 Project Structure

```
github-profile-viewer/
├── app/
│   ├── layout.tsx        # Root layout with LingoProvider
│   ├── page.tsx          # Main profile viewer page
│   └── globals.css       # Global styles
├── next.config.ts        # Next.js + Lingo.dev configuration
├── .env.local           # API keys (gitignored)
└── package.json
```

## 🌍 How It Works

1. **Development Mode**: Lingo.dev compiler runs as a Babel transform
2. **Text Detection**: Automatically detects translatable strings in JSX
3. **AI Translation**: Sends text to Lingo.dev Engine for translation
4. **Code Injection**: Injects translated strings at build time
5. **Runtime Switching**: LocaleSwitcher updates active locale instantly

No manual translation files, no string keys, no API calls from the frontend!

## 💡 Key Learnings

- **Zero Code Changes**: Existing JSX text is automatically translated
- **Developer Experience**: No learning curve - write normal React code
- **Cost Effective**: Pseudotranslator mode for free development
- **Production Ready**: Real translations only when you need them

## 📚 Resources

- [Lingo.dev Documentation](https://lingo.dev/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [GitHub API](https://docs.github.com/en/rest)

# Lingo.dev AI Interview App

A Next.js demo application showcasing the [Lingo.dev](https://lingo.dev) SDK for automated internationalization. This app demonstrates how to translate an interview preparation tool into multiple languages using Lingo.dev's compiler integration.

## Features

- **Automated Translation**: Text content is automatically extracted and translated at build/runtime.
- **Language Switcher**: Built-in `LocaleSwitcher` component to toggle between English, Spanish, French, German, Hindi, and Japanese.
- **Next.js App Router**: Built with the latest Next.js 15 features and TypeScript.

## How It Works

1. **Configuration**: The `next.config.ts` wraps the Next.js config with `withLingo`, specifying target locales.
2. **Implementation**: The `app/page.tsx` simply uses standard JSX. Lingo.dev intercepts text nodes and dynamic content for translation.
3. **Switching**: The `LocaleSwitcher` allows users to change the current locale, triggering instant translation updates.

## Getting Started

### Prerequisites
- Node.js 18+
- npm (or pnpm/yarn)

### Installation

1. Navigate to the project directory:
   ```bash
   cd community/lingo-ai-interview-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

> **Note**: This demo uses `usePseudotranslator: true` by default to demonstrate the translation pipeline without requiring a Lingo.dev API key. In a production environment, you would configure an API key to enable real AI-powered translations.

## Project Structure

- `app/page.tsx`: Main interview question UI.
- `next.config.ts`: Lingo.dev configuration.
- `lingo.config.json` (optional): localized text storage (managed by SDK).

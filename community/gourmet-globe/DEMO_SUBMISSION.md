# GourmetGlobe 🌍🍲

A premium, AI-localized recipe platform showcasing the power of **Lingo.dev**.

## 🚀 Key Features

- **Real-time AI Localization**: Effortlessly switching between English, Hindi, Japanese, French, Spanish, and Arabic.
- **Micro-animations**: Powered by MagicUI and Tailwind CSS.
- **Lingo.dev Integration**: Uses the Lingo Compiler for automatic localization and JSON buckets for content management.

## 🛠️ Built With

- **Lingo.dev** (Localization)
- **Next.js 15** (App Router)
- **Tailwind CSS** (Styling)
- **Lucide React** (Icons)

## 📖 How to run locally

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Authenticate with Lingo.dev**:

   ```bash
   npx lingo.dev@latest login
   ```

3. **Initialize & Sync translations**:

   ```bash
   npx lingo.dev@latest sync
   ```

   _This will generate the translated JSON files for all target languages in the `locales/` directory._

4. **Run the development server**:
   ```bash
   npm run dev
   ```

## 🌍 Supported Languages

- English (Source)
- Hindi (hi)
- Japanese (ja)
- French (fr)
- Spanish (es)
- Arabic (ar)

## 🏆 Project Submission

This project is built for the **Lingo.dev Demo App Contest**.

**Submitted by**: [Your Name/GitHub Handle]
**Context**: "Build amazing things, localize them instantly."

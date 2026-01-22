# 🗼 Babel Tower

> **One Codebase. Every Language.** — A stunning demo showcasing the magic of Lingo.dev Compiler's zero-config i18n.

![Babel Tower Demo](https://img.shields.io/badge/Demo-Lingo.dev%20Compiler-8b5cf6?style=for-the-badge)
![Languages](https://img.shields.io/badge/Languages-11-06b6d4?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge)

## ✨ What is this?

Babel Tower is an interactive landing page that demonstrates the **Lingo.dev Compiler** — a build-time i18n solution that makes React apps multilingual **without any code changes**.

The entire page transforms into 11 different languages with a single click:
- 🇺🇸 English
- 🇪🇸 Spanish
- 🇫🇷 French
- 🇩🇪 German
- 🇯🇵 Japanese
- 🇨🇳 Chinese
- 🇰🇷 Korean
- 🇸🇦 Arabic
- 🇮🇳 Hindi
- 🇧🇷 Portuguese
- 🇷🇺 Russian

**The magic?** There are **zero translation functions** in the code. No `t()` calls, no translation keys, no JSON files. Just normal React components.

## 🎯 Lingo.dev Features Highlighted

| Feature | How It's Showcased |
|---------|-------------------|
| **Zero-Config i18n** | The entire landing page works in 11 languages with just one config file |
| **Build-Time Translation** | All translations are generated at build time — zero runtime overhead |
| **No Code Changes** | Every component uses plain JSX strings, no translation wrappers |
| **AI-Powered** | Translations are automatically generated using advanced language models |
| **Next.js App Router** | Full support for React Server Components and the latest Next.js features |

## 🚀 Local Setup

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/lingodotdev/lingo.dev.git
cd lingo.dev/community/babel-tower

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the demo.

### Development Mode

In development, the compiler uses a **pseudotranslator** to simulate translations without API calls. This lets you test the i18n flow for free.

### Production Build

```bash
# Build for production (generates real translations)
pnpm build

# Start production server
pnpm start
```

## 🏗️ Project Structure

```
babel-tower/
├── app/
│   ├── globals.css          # Tailwind + custom styles
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page (English)
│   └── [locale]/
│       ├── layout.tsx       # Locale layout
│       └── page.tsx         # Localized pages
├── components/
│   ├── Hero.tsx             # Hero section with animated tower
│   ├── Tower.tsx            # Animated Babel Tower
│   ├── LanguageSwitcher.tsx # Language selection dropdown
│   ├── Features.tsx         # Features showcase
│   ├── CodeShowcase.tsx     # Code comparison
│   ├── LanguageGrid.tsx     # Interactive language grid
│   ├── CallToAction.tsx     # CTA section
│   └── Footer.tsx           # Footer
├── next.config.ts           # Lingo.dev Compiler configuration
├── package.json
└── README.md
```

## ⚙️ Compiler Configuration

The magic happens in `next.config.ts`:

```typescript
import withLingo from "@lingo.dev/compiler/next";

export default withLingo({
  sourceRoot: "./app",
  sourceLocale: "en",
  targetLocales: ["es", "fr", "de", "ja", "zh", "ko", "ar", "hi", "pt", "ru"],
  dev: {
    usePseudotranslator: true, // Free dev mode
  },
})({});
```

That's it. No translation files. No wrapper functions. Just config.

## 🎨 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **i18n**: Lingo.dev Compiler

## 🔗 Links

- [Lingo.dev Compiler Docs](https://lingo.dev/compiler)
- [Lingo.dev GitHub](https://github.com/lingodotdev/lingo.dev)
- [Community Campaign Issue #1761](https://github.com/lingodotdev/lingo.dev/issues/1761)
- [r/lingodotdev](https://reddit.com/r/lingodotdev)
- [Discord Community](https://lingo.dev/go/discord)

## 📝 License

This project is part of the [Lingo.dev](https://lingo.dev) community contributions and follows the repository's license terms.

---

<p align="center">
  Built with ❤️ for the <a href="https://github.com/lingodotdev/lingo.dev/issues/1761">Lingo.dev Community Campaign</a>
</p>

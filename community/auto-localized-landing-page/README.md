# Auto-Localized Landing Page Generator

A demo showcasing **Lingo.dev JavaScript SDK** for instant AI-powered translations.

## What It Does

This app lets you:

1. **Enter landing page content** - Product name, headline, features, and CTA in English
2. **Translate instantly** - Click one button to translate to French, German, Spanish, and Japanese
3. **Preview in any language** - Switch between languages to see your localized landing page

## Lingo.dev Features Used

This demo highlights the **[Lingo.dev JavaScript SDK](https://lingo.dev/en/sdk)**:

```javascript
import { LingoDotDevEngine } from "lingo.dev/sdk";

const engine = new LingoDotDevEngine({
  apiKey: process.env.LINGO_API_KEY,
});

// Translate nested objects while preserving structure
const translated = await engine.localizeObject(content, {
  sourceLocale: "en",
  targetLocale: "es",
});
```

**Key SDK methods demonstrated:**

- `LingoDotDevEngine` - Initialize the translation engine with API key
- `localizeObject()` - Translate nested JavaScript objects while preserving structure

## How to Run Locally

### Prerequisites

- Node.js 18+
- Lingo.dev API key ([get one here](https://lingo.dev))

### Steps

```bash
# Navigate to demo
cd community/auto-localized-landing-page

# Install dependencies
npm install

# Set API key
cp .env.example .env.local
# Edit .env.local and add your LINGO_API_KEY

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- lingo.dev (JavaScript SDK)

## Project Structure

```
auto-localized-landing-page/
├── app/
│   ├── api/translate/route.ts   # API endpoint calling Lingo.dev SDK
│   ├── page.tsx                 # Main page with split layout
│   └── layout.tsx               # Root layout
├── components/                  # UI components
├── lib/
│   ├── lingo.ts                 # SDK integration
│   └── types.ts                 # TypeScript types
└── README.md
```

---

Built for [Lingo.dev Community](https://github.com/lingodotdev/lingo.dev)

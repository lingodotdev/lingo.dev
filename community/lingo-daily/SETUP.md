# 🚀 Lingo Daily - Setup Instructions

## Current Status

✅ **Basic App Running** - The app is currently running in "demo mode" with mock i18n features  
⚠️ **Lingo Compiler Pending** - Full Lingo.dev integration requires the compiler to be built

## Quick Start (Demo Mode)

The app is ready to run right now with mock language switching:

```bash
cd community/lingo-daily
bun install
bun dev
```

Visit **http://localhost:3000**

## Enabling Full Lingo.dev Features

To enable the actual Lingo.dev compiler with real translations:

### Step 1: Build the Compiler

```bash
cd ../../packages/new-compiler
pnpm install  # Or use the root pnpm workspace
pnpm build
```

### Step 2: Update Configuration Files

#### `next.config.mjs`

Uncomment the Lingo integration:

```javascript
import { withLingo } from "@lingo.dev/compiler/next";

export default async function () {
  return await withLingo(nextConfig, {
    sourceRoot: "./src/app",
    lingoDir: ".lingo",
    sourceLocale: "en",
    targetLocales: ["es", "de", "fr", "ja"],
    useDirective: false,
    models: "lingo.dev",
    buildMode: "cache-only",
    dev: {
      usePseudotranslator: true,
    },
    pluralization: {
      enabled: true,
      model: "groq:llama-3.1-8b-instant",
    },
  });
}
```

#### `src/app/layout.js`

Uncomment LingoProvider:

```javascript
import { LingoProvider } from "@lingo.dev/compiler/react/next";

export default function RootLayout({ children }) {
  return (
    <LingoProvider>
      <html lang="en" suppressHydrationWarning>
        {/* ... */}
      </html>
    </LingoProvider>
  );
}
```

#### Component Files

Replace mock `useLingoContext` with real imports in:

- `src/components/Navbar.js`
- `src/components/Hero.js`
- `src/components/ArticleCard.js`

Change from:

```javascript
// Mock context
function useLingoContext() { ... }
```

To:

```javascript
import { useLingoContext } from "@lingo.dev/compiler/react";
```

### Step 3: Generate Translations

For development with pseudotranslations:

```bash
bun dev  # Automatic pseudotranslations
```

For real translations (requires API key):

```bash
# Add to .env.local
LINGODOTDEV_API_KEY=your_key
# or
OPENAI_API_KEY=your_key

bun build  # Generates real translations
```

## What Works Now (Demo Mode)

✅ Beautiful Linear-style UI  
✅ Dark/Light theme toggle  
✅ Language selector (localStorage-based)  
✅ News feed with 30 articles  
✅ Load More pagination  
✅ Date formatting per locale  
✅ Responsive design  
✅ All UI components

## What Requires Lingo Compiler

🔄 Automatic text extraction  
🔄 Real translations (currently hardcoded English)  
🔄 Pluralization detection  
🔄 ICU MessageFormat  
🔄 Translation cache (`.lingo/` directory)

## Architecture Overview

```
Demo Mode (Current):
  └─ Mock useLingoContext → localStorage locale switching
  └─ Intl.DateTimeFormat → Native date localization
  └─ Static English text → No translations yet

Full Mode (With Compiler):
  └─ Real LingoProvider → Full i18n state management
  └─ Compiler transforms → Automatic text extraction
  └─ AI translations → Generated at build time
  └─ ICU pluralization → Smart plural forms
```

## Troubleshooting

### "Cannot find module @lingo.dev/compiler"

The compiler package needs to be built:

```bash
cd ../../packages/new-compiler
pnpm install && pnpm build
```

### "pnpm: command not found"

Install pnpm globally:

```bash
npm install -g pnpm
# or
brew install pnpm  # macOS
```

Or use the workspace root:

```bash
cd ../..  # Go to Lingo root
pnpm install
```

### Dev server won't start

Check that you're in the correct directory:

```bash
cd community/lingo-daily
bun dev
```

### Images not loading (Unsplash 404s)

This is expected for some Unsplash URLs. The app still works perfectly. To use real images, either:

1. Replace URLs in `src/lib/news.js` with valid images
2. Integrate with real NewsAPI

## Next Steps

1. **Build the compiler** to enable full Lingo.dev features
2. **Generate translations** using the Lingo.dev Engine or your LLM API key
3. **Test language switching** with real translated content
4. **Deploy** to Vercel or your preferred platform

## Support

Questions? Issues?

- Check the main [README.md](./README.md)
- Visit [Lingo.dev Documentation](https://github.com/lingodotdev/lingo.dev)
- Open an issue on GitHub

---

**Note**: This setup document describes the current state where the app runs with mock i18n features. The full Lingo.dev experience requires building the compiler package first.

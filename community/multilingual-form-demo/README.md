# Multilingual Form Demo

A Next.js demo showcasing internationalized forms with [next-intl](https://next-intl-docs.vercel.app/) and [Lingo.dev](https://lingo.dev) for AI-powered translations.

## How It Works

This project demonstrates a multilingual newsletter signup form with:

- **Internationalization (i18n)** - Uses `next-intl` for locale routing and translations
- **Translations** - Uses Lingo.dev CLI to automatically translate content to multiple languages
- **Language Switcher** - Keyboard-accessible dropdown with flags (press `⌘L` / `Ctrl+L` to toggle)
- **Form Validation** - Translated error messages using `react-hook-form` + `zod`

### Project Structure

```
├── locales/              # Translation JSON files (en.json, es.json, fr.json, etc.)
├── i18n/
│   ├── routing.ts        # Locale routing configuration
│   └── request.ts        # Server-side i18n setup
├── i18n.json             # Lingo.dev configuration
└── app/
    └── components/
        └── LanguageSwitcher/
            └── types.ts  # Supported locales with flags
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment file (if needed)
cp .example.env .env
```

### Run Locally

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) - you'll be redirected to `/en` (default locale).

## Adding More Languages

Adding a new language requires 3 steps:

### 1. Update `i18n.json`

Add your language code to the targets array:

```json
{
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de", "ja", "zh", "ko", "ar", "pt"] // Added "pt" for Portuguese
  }
}
```

### 2. Generate Translations

Run the Lingo.dev CLI to auto-translate:

```bash
npx lingo.dev@latest run
```

This creates `locales/pt.json` with AI-translated content from `locales/en.json`.

### 3. Update Routing & UI

**a) Add to `i18n/routing.ts`:**

```typescript
export const routing = defineRouting({
  locales: ["en", "es", "fr", "de", "pt"], // Add new locale do add them in option dropdown also
  defaultLocale: "en",
  localePrefix: "always",
});
```

**b) Add to `app/components/LanguageSwitcher/types.ts`:**

```typescript
export const locales: LocaleInfo[] = [
  // ... existing locales
  { code: "pt", name: "Português", flag: "🇧🇷" },
];
```

### 4. Restart & Test

```bash
pnpm dev
```

Visit `http://localhost:3000/pt` to see your new language!

## Keyboard Shortcuts

| Shortcut        | Action                 |
| --------------- | ---------------------- |
| `⌘L` / `Ctrl+L` | Open language switcher |

## Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## Tech Stack

- [Next.js 16](https://nextjs.org/) - React framework
- [next-intl](https://next-intl-docs.vercel.app/) - Internationalization
- [Lingo.dev](https://lingo.dev) - AI-powered translations
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) - Form validation

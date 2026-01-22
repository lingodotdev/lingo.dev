# Multilingual SaaS Dashboard

A modern, production-ready SaaS admin dashboard that speaks multiple languages — built to showcase the power of real-time AI translation with Lingo.dev SDK.

## What's This About?

Ever wondered how companies like Stripe or Linear make their dashboards feel native to users across the globe? This project demonstrates exactly that.

I built this dashboard to explore how Lingo.dev SDK can transform a single-language app into a fully internationalized experience — without maintaining separate translation files for each language. When you switch languages in the settings, the entire UI translates on the fly using AI.

**Built by [Sanjug Sonowal](https://github.com/sanjugsonowal)** as a community contribution to the Lingo.dev ecosystem.

## Why Lingo.dev?

Traditional i18n approaches require you to manually translate every string into every language you support. That's tedious, expensive, and doesn't scale well.

Lingo.dev takes a different approach:

- Write your UI strings once (in English)
- Let the SDK translate everything else dynamically
- Translations are cached, so it's fast after the first load
- Support 80+ languages without maintaining 80+ translation files

This demo proves it works beautifully for real-world SaaS applications.

## What's Inside

**4 Fully Translated Languages**
- English (source)
- Hindi
- French
- Spanish

**A Complete Dashboard Experience**
- Clean login page with smooth animations
- Dashboard home with KPI metrics
- User management table with search
- Settings page with language selector
- Dark/Light mode toggle
- Mobile-responsive design

**Production-Quality Code**
- Next.js 14 with App Router
- TypeScript throughout
- Tailwind CSS for styling
- Clean component architecture
- No backend required — runs entirely in the browser

## Quick Start

Getting this running locally takes about 2 minutes:

```bash
cd community/multilingual-saas-dashboard
npm install
npm run dev
```

Open http://localhost:3000 and you're in. Use any email/password to log in — it's a demo, after all.

## How the Translation Magic Works

The core idea is simple. Instead of maintaining separate translation files:

```typescript
// Traditional approach (don't do this)
// en.json, hi.json, fr.json, es.json... 😩
```

We have one source file and let Lingo.dev translate on demand:

```typescript
import { LingoDotDevEngine } from "lingo.dev/sdk";

const lingo = new LingoDotDevEngine({
  apiKey: "your_api_key",
});

const translated = await lingo.localizeObject(englishStrings, {
  sourceLocale: "en",
  targetLocale: "hi",
});
```

The SDK preserves your object structure and translates every string value. It's that straightforward.

## Project Structure

```
multilingual-saas-dashboard/
├── app/                    # Next.js pages
│   ├── login/             # Login page
│   └── dashboard/         # Dashboard pages
├── components/
│   ├── ui/                # Buttons, cards, inputs
│   ├── layout/            # Sidebar, topbar
│   └── dashboard/         # Metrics, activity feed
├── i18n/
│   ├── provider.tsx       # Language context
│   ├── lingo-service.ts   # SDK integration
│   └── translations/
│       └── en.ts          # Source strings
├── mock-data/             # Realistic demo data
└── hooks/                 # Custom React hooks
```

## Want to Add a New Language?

It's surprisingly easy. Three quick steps:

**1. Add the locale type:**
```typescript
// types/index.ts
export type Locale = "en" | "hi" | "fr" | "es" | "de"; // Added German
```

**2. Register it:**
```typescript
// i18n/translations/index.ts
export const locales = ["en", "hi", "fr", "es", "de"];
export const localeNames = {
  // ...existing
  de: "Deutsch",
};
```

**3. Add a flag (optional):**
```typescript
// components/settings/language-selector.tsx
const flags = {
  // ...existing
  de: "🇩🇪",
};
```

That's it. Lingo.dev handles the actual translation.

## Design Philosophy

This isn't just a tech demo — it's designed to look and feel like a real product:

- **Minimal, not boring** — Clean surfaces, thoughtful spacing, subtle animations
- **Dark mode that works** — Not an afterthought; both themes feel intentional
- **Mobile-first** — Collapsible sidebar, touch-friendly targets, responsive tables
- **Calm, not flashy** — Inspired by Linear and Vercel's design language

## Architecture Notes

**Why SDK over static files?**

For this demo, the SDK approach makes sense because:
- We're showcasing Lingo.dev's capabilities
- Translation happens once, then caches
- Adding languages is trivial

For a production app with SEO requirements, you might pre-generate translations at build time. But for dashboards (which are usually behind auth anyway), runtime translation works great.

**Caching strategy:**
- Translations cache in memory for the session
- Switching between previously-loaded languages is instant
- No redundant API calls

## Contributing

Found a bug? Want to add a feature? PRs are welcome.

Some ideas:
- Add more languages
- Improve the mobile experience
- Add more dashboard widgets
- Write tests

## About the Author

**Sanjug Sonowal** — I'm passionate about building developer tools and exploring new ways to solve old problems. This project started as an experiment to see how far I could push AI-powered translation in a real app, and I'm happy with how it turned out.

Feel free to reach out if you have questions or just want to chat about the project.

## License

MIT — Part of the Lingo.dev community contributions.

---

*Built with Next.js, Tailwind CSS, and Lingo.dev SDK*

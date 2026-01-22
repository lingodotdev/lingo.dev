# 🌐 Lingo Daily

**A modern, multilingual news dashboard showcasing the power of [Lingo.dev](https://lingo.dev) for seamless internationalization.**

Lingo Daily is a production-ready, Linear-inspired news application built for the Lingo.dev community sprint. It demonstrates best-in-class localization practices with dynamic interpolation, intelligent pluralization, and locale-aware formatting—all powered by the Lingo.dev SDK.

![Lingo Daily](https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80)

## ✨ Features

- **🌍 5-Language Support**: Seamless switching between English, Spanish, German, French, and Japanese
- **🎨 Linear-Style Design**: Clean, minimalist UI with perfect dark/light mode implementation
- **📰 Dynamic News Feed**: Browse 30+ professionally curated articles with smooth infinite scrolling
- **🔄 Real-Time Translation**: Instant language switching without page reload
- **📊 Smart Pluralization**: Automatic handling of singular/plural forms across languages
- **📅 Date Localization**: Locale-aware date formatting using native Intl API
- **🎯 Type-Safe**: Built with modern JavaScript and Next.js 16 App Router
- **⚡ Optimized Performance**: Fast page loads with efficient code splitting

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ or **Bun** 1.0+
- **Git**

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/lingodotdev/lingo.dev.git
cd lingo.dev/community/lingo-daily
```

2. **Install dependencies**

Using Bun (recommended):

```bash
bun install
```

Or using npm:

```bash
npm install
```

3. **Link the Lingo compiler** (if not using workspace)

```bash
cd ../../packages/new-compiler
bun link
cd ../../community/lingo-daily
bun link @lingo.dev/compiler
```

4. **Run the development server**

```bash
bun dev
# or
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Switching Languages

Click the language dropdown in the navbar to switch between:

- 🇺🇸 **English**
- 🇪🇸 **Español** (Spanish)
- 🇩🇪 **Deutsch** (German)
- 🇫🇷 **Français** (French)
- 🇯🇵 **日本語** (Japanese)

All UI text, including dynamic counts and dates, updates instantly.

### Theme Toggle

Click the moon/sun icon to switch between dark and light modes. Your preference is saved automatically.

### Loading More Articles

Scroll to the bottom and click **"Load More Articles"** to fetch additional news (10 articles at a time).

## 🎯 Lingo.dev Features Highlighted

This demo showcases the most powerful features of the Lingo.dev SDK:

### 1. **Dynamic Interpolation**

Variables are seamlessly interpolated into translated strings while preserving context:

```jsx
// Hero component
<p className="text-sm text-muted-foreground">
  Viewing {articleCount} articles in {localeNames[locale]}
</p>
```

**How it works:**

- Lingo.dev compiler extracts text with `{variable}` patterns
- Generates placeholder tokens like `<0>{articleCount}</0>`
- Translations maintain variable positions: `"Viendo <0>{articleCount}</0> artículos"`
- Runtime replaces with actual values

**Example output:**

- **English**: "Viewing 10 articles in English"
- **Spanish**: "Viendo 10 artículos en Español"
- **German**: "10 Artikel auf Deutsch anzeigen"

### 2. **Intelligent Pluralization**

The SDK automatically detects plural patterns and generates ICU MessageFormat:

```jsx
// LoadMoreButton component
<p className="text-sm text-muted-foreground">
  Showing {shownCount} of {totalCount} articles
</p>
```

**How it works:**

- Pattern detector identifies `{count} + noun` combinations
- LLM analyzes context to determine if pluralization applies
- Generates proper ICU format: `{count, plural, =0 {no articles} one {# article} other {# articles}}`
- Each language gets grammatically correct plural forms

**Example transformations:**

- **English**: "Showing 1 article" → "Showing 10 articles"
- **Spanish**: "Mostrando 1 artículo" → "Mostrando 10 artículos"
- **French**: "Affichage de 1 article" → "Affichage de 10 articles"

### 3. **Date Localization**

Using JavaScript's native `Intl.DateTimeFormat` for locale-aware formatting:

```jsx
// ArticleCard component
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};
```

**Example output for January 22, 2026:**

- **English (en)**: "January 22, 2026"
- **Spanish (es)**: "22 de enero de 2026"
- **German (de)**: "22. Januar 2026"
- **French (fr)**: "22 janvier 2026"
- **Japanese (ja)**: "2026年1月22日"

### 4. **Automatic Text Extraction**

All JSX text is automatically extracted and translated without manual string wrapping:

```jsx
// Navbar component
<h1 className="text-lg font-semibold tracking-tight">
  Lingo Daily
</h1>
<p className="text-xs text-muted-foreground">
  News in Every Language
</p>
```

**No need for:**

- ❌ `t("navbar.title")`
- ❌ Manual key management
- ❌ Separate translation files

**Just write natural JSX** and Lingo.dev handles the rest!

### 5. **Context Preservation**

Rich text with nested elements maintains structure across translations:

```jsx
<p className="text-xs text-muted-foreground max-w-lg">
  This demo showcases Lingo.dev's <strong>powerful</strong> localization
  features including dynamic interpolation, pluralization, and seamless language
  switching.
</p>
```

The `<strong>` tags remain in the correct position in every language.

## 🏗️ Project Structure

```
lingo-daily/
├── src/
│   ├── app/
│   │   ├── globals.css       # Linear-style design system
│   │   ├── layout.js          # Root layout with providers
│   │   └── page.js            # Main news feed page
│   ├── components/
│   │   ├── Navbar.js          # Language switcher & theme toggle
│   │   ├── Hero.js            # Hero section with interpolation
│   │   ├── ArticleCard.js     # News card with date formatting
│   │   └── LoadMoreButton.js  # Pagination with pluralization
│   └── lib/
│       └── news.js            # Mock news service
├── next.config.mjs            # Lingo.dev compiler configuration
├── package.json
└── README.md
```

## ⚙️ Configuration

### Lingo.dev Compiler Setup

The `next.config.mjs` file configures the Lingo.dev compiler:

```javascript
import { withLingo } from "@lingo.dev/compiler/next";

export default async function () {
  return await withLingo(nextConfig, {
    sourceRoot: "./src/app", // Source files location
    lingoDir: ".lingo", // Translation cache directory
    sourceLocale: "en", // Source language
    targetLocales: ["es", "de", "fr", "ja"], // Target languages
    useDirective: false, // Auto-translate all JSX
    models: "lingo.dev", // Translation engine
    buildMode: "cache-only", // Use cached translations
    dev: {
      usePseudotranslator: true, // Mock translations in dev
    },
    pluralization: {
      enabled: true, // Enable auto-pluralization
      model: "groq:llama-3.1-8b-instant",
    },
  });
}
```

### Theme Configuration

Dark/light mode is handled by `next-themes`:

```jsx
// layout.js
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>
```

CSS variables adapt automatically via the `.dark` class.

## 🎨 Design System

Lingo Daily uses a comprehensive Linear-inspired design system with:

- **Color Palette**: Carefully crafted light/dark mode colors
- **Typography**: Geist Sans & Geist Mono fonts
- **Spacing**: Consistent 4px/8px grid system
- **Components**: Reusable, accessible UI primitives
- **Animations**: Smooth transitions and hover effects

All design tokens are defined as CSS variables in `globals.css`.

## 📦 Dependencies

### Core

- **Next.js 16.1.4** - React framework with App Router
- **React 19.2.3** - UI library
- **@lingo.dev/compiler** - Internationalization SDK

### UI

- **Tailwind CSS 4** - Utility-first CSS framework
- **lucide-react** - Icon library
- **next-themes** - Theme management

## 🔧 Development

### Build for Production

```bash
bun run build
bun start
```

### Lint Code

```bash
bun run lint
```

### Using Real News API (Optional)

To fetch live news instead of mock data:

1. Get a free API key from [NewsAPI.org](https://newsapi.org/)
2. Create `.env.local`:
   ```
   NEXT_PUBLIC_NEWS_API_KEY=your_api_key_here
   ```
3. Uncomment the `getNewsFromAPI` function in `src/lib/news.js`
4. Update `page.js` to use the API function

## 🌟 Why Lingo.dev?

Traditional i18n libraries require:

- ❌ Manual string extraction: `t("key")`
- ❌ Complex JSON files with nested keys
- ❌ Separate pluralization rules
- ❌ Manual context management

**Lingo.dev simplifies everything:**

- ✅ Write natural JSX—translations happen automatically
- ✅ AI-powered translation with context awareness
- ✅ Automatic pluralization detection
- ✅ Zero-config localization
- ✅ Type-safe with excellent DX

## 📝 License

MIT License - see the [LICENSE](../../LICENSE.md) file for details.

## 🤝 Contributing

This is a community demo project! Contributions are welcome:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🔗 Links

- **Lingo.dev**: [https://lingo.dev](https://lingo.dev)
- **Documentation**: [https://github.com/lingodotdev/lingo.dev](https://github.com/lingodotdev/lingo.dev)
- **Community**: [Join our Discord](https://discord.gg/lingo-dev)

## 💬 Support

Need help? Have questions?

- 📧 Email: [support@lingo.dev](mailto:support@lingo.dev)
- 💬 Discord: [Lingo.dev Community](https://discord.gg/lingo-dev)
- 🐛 Issues: [GitHub Issues](https://github.com/lingodotdev/lingo.dev/issues)

---

**Built with ❤️ for the Lingo.dev Community Sprint**

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

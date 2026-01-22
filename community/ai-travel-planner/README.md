# AI Travel Planner

A stunning, feature-rich multilingual travel planning application built with **React 19**, **TanStack Router**, **Framer Motion**, **Zustand**, and powered by **Lingo.dev** for seamless internationalization.

![AI Travel Planner Demo](https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80)

## Features

### Core Features

- **AI Itinerary Generator**: Generate smart day-by-day travel plans with activity suggestions based on your destination
- **Interactive World Map**: Explore destinations on a beautiful animated SVG world map with clickable markers
- **Trip Dashboard**: Manage all your trips with countdown timers, budget tracking, and packing lists
- **Budget Tracker**: Track expenses by category with visual progress bars and currency support
- **Packing Lists**: Create and manage packing lists with checkbox functionality
- **Destination Explorer**: Browse 10+ curated destinations with search, filtering, and detailed information

### Internationalization

- **6 Languages**: English, Spanish, French, German, Japanese, and Chinese
- **Zero-Config Translation**: Uses Lingo.dev's compiler for automatic JSX text extraction
- **Build-Time Translation**: No runtime overhead or flash of untranslated content

### UI/UX

- **Dark Glassmorphism Design**: Modern dark theme with glass-effect cards and gradient accents
- **Framer Motion Animations**: Smooth page transitions, hover effects, and micro-interactions
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Gradient Mesh Backgrounds**: Beautiful animated gradient backgrounds with floating particles
- **Interactive Components**: Animated buttons, cards, and form elements

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 19 | UI framework |
| TanStack Router | Type-safe file-based routing |
| Framer Motion | Animations and transitions |
| Zustand | State management with persistence |
| Tailwind CSS 4 | Utility-first styling |
| Lingo.dev Compiler | AI-powered internationalization |
| Vite 7 | Fast build tool |
| TypeScript | Type safety |
| Lucide React | Beautiful icons |

## Lingo.dev Features Highlighted

This demo showcases several key Lingo.dev features:

### 1. Zero-Config Compiler Integration

The Lingo.dev compiler automatically extracts and translates text from JSX:

```tsx
// Just wrap text in fragments - no special syntax needed!
<h1><>Plan Your Dream Journey</></h1>
<p><>Discover amazing destinations...</></p>
```

### 2. Build-Time Translation

Translations happen at build time, resulting in:
- Zero runtime overhead
- No flash of untranslated content
- Smaller bundle sizes

### 3. LocaleSwitcher Component

Built-in language switcher component for easy locale changing:

```tsx
import { LocaleSwitcher } from "@lingo.dev/compiler/react";

<LocaleSwitcher
  locales={[
    { code: "en", label: "English" },
    { code: "es", label: "Espanol" },
    // ...more locales
  ]}
/>
```

### 4. LingoProvider

Wraps your app to provide translation context:

```tsx
import { LingoProvider } from "@lingo.dev/compiler/react";

<LingoProvider>
  <App />
</LingoProvider>
```

### 5. Directive-Based Translation

Use `"use i18n"` directive at the top of files to enable translation:

```tsx
"use i18n";
// All JSX text in this file will be translated
```

## Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

## Getting Started

### 1. Install Dependencies

From the repository root:

```bash
pnpm install
```

Or from this directory:

```bash
cd community/ai-travel-planner
pnpm install
```

### 2. Set Up Lingo.dev API Key (Optional for Dev)

To enable real AI translations, get an API key from [lingo.dev](https://lingo.dev) and set it:

```bash
# Create a .env file
echo "LINGODOTDEV_API_KEY=your-api-key-here" > .env
```

In development mode, the app uses a pseudotranslator by default, so you can test without an API key.

### 3. Run Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:3001`

### 4. Build for Production

To generate real translations during build:

```bash
# Set your API key and build
LINGODOTDEV_API_KEY=your-key pnpm build
```

Or use cached translations (after they've been generated):

```bash
LINGO_BUILD_MODE=cache-only pnpm build
```

## Project Structure

```
ai-travel-planner/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header.tsx       # Navigation with LocaleSwitcher
│   │   ├── Footer.tsx       # Animated footer
│   │   ├── DestinationCard.tsx  # Animated destination cards
│   │   └── WorldMap.tsx     # Interactive SVG world map
│   ├── data/                # Static data
│   │   └── destinations.ts  # 10 destinations with activities
│   ├── routes/              # TanStack Router file-based routes
│   │   ├── __root.tsx       # Root layout with header/footer
│   │   ├── index.tsx        # Home page with hero & world map
│   │   ├── destinations.tsx # Destination browser
│   │   ├── destination.$destinationId.tsx  # Destination details
│   │   ├── planner.tsx      # AI trip planner
│   │   └── dashboard.tsx    # Trip management dashboard
│   ├── store/               # Zustand state management
│   │   └── tripStore.ts     # Trip, expense, packing list state
│   ├── types/               # TypeScript types
│   │   └── index.ts         # Destination, Trip, Itinerary types
│   ├── main.tsx             # App entry point
│   └── styles.css           # Global styles with glassmorphism
├── vite.config.ts           # Vite + Lingo.dev configuration
├── tsconfig.json            # TypeScript configuration
└── package.json
```

## Pages

### Home (`/`)
- Hero section with animated gradient background
- Interactive world map with destination markers
- Featured destinations carousel
- Feature highlights section
- Call-to-action for trip planning

### Destinations (`/destinations`)
- Search and filter destinations by tags
- Animated grid of destination cards
- Real-time filtering with smooth transitions

### Destination Details (`/destination/:id`)
- Full-page hero image with parallax effect
- Weather information by season
- Activity suggestions
- Quick info sidebar
- Direct link to trip planner

### Trip Planner (`/planner`)
- AI itinerary generator
- Manual activity addition
- Activity suggestions from destination data
- Day-by-day itinerary view
- Save to dashboard

### Dashboard (`/dashboard`)
- Trip list with countdown timers
- Budget tracker with visual progress
- Expense management
- Packing list with checkboxes
- Trip details view

## Configuration

### Lingo.dev Compiler Config (vite.config.ts)

```typescript
lingoCompilerPlugin({
  sourceRoot: "src",
  lingoDir: ".lingo",
  sourceLocale: "en",
  targetLocales: ["es", "fr", "de", "ja", "zh"],
  useDirective: true,
  models: "lingo.dev",
  buildMode: "cache-only",
  dev: {
    usePseudotranslator: true,
  },
})
```

### Key Configuration Options

| Option | Description |
|--------|-------------|
| `sourceLocale` | The language your source code is written in |
| `targetLocales` | Languages to translate into |
| `useDirective` | Require `"use i18n"` directive for translation |
| `buildMode` | `"translate"` for dev/CI, `"cache-only"` for production |
| `usePseudotranslator` | Use fake translations in development |

## Customization

### Adding New Languages

Update `vite.config.ts`:

```typescript
targetLocales: ["es", "fr", "de", "ja", "zh", "pt", "it"],
```

Update the LocaleSwitcher in `Header.tsx`:

```tsx
<LocaleSwitcher
  locales={[
    // ...existing locales
    { code: "pt", label: "Portugues" },
    { code: "it", label: "Italiano" },
  ]}
/>
```

### Adding New Destinations

Edit `src/data/destinations.ts` to add new travel destinations with:
- Basic info (name, country, description)
- Coordinates for world map
- Weather data by season
- Activity suggestions
- Highlights and tags

## State Persistence

The app uses Zustand with persist middleware to save:
- Created trips
- Expenses
- Packing lists
- Itinerary items

Data is stored in localStorage under the key `ai-travel-planner-trips`.

## Learn More

- [Lingo.dev Documentation](https://lingo.dev/docs)
- [TanStack Router Docs](https://tanstack.com/router)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Zustand Docs](https://zustand-demo.pmnd.rs/)

## License

This project is part of the Lingo.dev community contributions and is licensed under the same terms as the main repository.

---

Built with love for the Lingo.dev community

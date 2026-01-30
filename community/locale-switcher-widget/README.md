# @lingo-community/locale-switcher

A drop-in, customizable locale switcher component for [Lingo.dev Compiler](https://lingo.dev/compiler) projects.

## ⚡ Quick Start

This is a **community contribution** showcasing reusable UI components for Lingo.dev projects.

### What is this?

Every app using Lingo.dev Compiler needs a locale switcher UI. Instead of building from scratch each time, this library provides production-ready, accessible components in 3 variants:

- **Dropdown** - Traditional select-style switcher
- **Flags** - Visual grid of locale flags  
- **Minimal** - Compact toggle button

### Features

- 🎨 **3 Built-in Variants** - Ready to use
- 🌍 **30+ Locales Pre-configured** - With native names and emoji flags
- ⚡ **Lightweight** - Minimal dependencies
- 🎯 **TypeScript** - Full type safety
- 🌙 **Dark Mode** - Automatic support
- ♿ **Accessible** - ARIA-compliant
- 🎨 **Customizable** - Bring your own styles

## Installation

```bash
# Copy the src/ folder into your project
# Or install if published:
npm install @lingo-community/locale-switcher
```

## Usage

### With Lingo.dev Compiler

```tsx
import { useLocale } from '@lingo.dev/compiler/react';
import { LocaleSwitcher, buildLocaleOptions } from './locale-switcher';
import './locale-switcher/styles.css';

function App() {
  const { locale, setLocale, config } = useLocale();

  return (
    <LocaleSwitcher
      currentLocale={locale}
      locales={buildLocaleOptions(config.targetLocales)}
      onLocaleChange={setLocale}
      variant="dropdown"
    />
  );
}
```

## Variants

### Dropdown

```tsx
<LocaleSwitcher
  variant="dropdown"
  currentLocale={locale}
  locales={locales}
  onLocaleChange={setLocale}
  showLabels={true}
/>
```

### Flags Grid

```tsx
<LocaleSwitcher
  variant="flags"
  currentLocale={locale}
  locales={locales}
  onLocaleChange={setLocale}
/>
```

### Minimal

```tsx
<LocaleSwitcher
  variant="minimal"
  currentLocale={locale}
  locales={locales}
  onLocaleChange={setLocale}
/>
```

## API Reference

### Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `currentLocale` | `string` | **required** | Current active locale code |
| `locales` | `LocaleOption[]` | **required** | Array of available locales |
| `onLocaleChange` | `(locale: string) => void` | **required** | Callback fired on locale change |
| `variant` | `'dropdown' \| 'flags' \| 'minimal'` | `'dropdown'` | Display variant |
| `className` | `string` | - | Custom CSS class |
| `showLabels` | `boolean` | `true` | Show locale labels |
| `position` | `'top' \| 'bottom'` | `'bottom'` | Dropdown position |

### Utilities

#### `buildLocaleOptions(codes: string[])`

Builds locale options from locale codes using built-in mappings.

```tsx
const locales = buildLocaleOptions(['en', 'es', 'fr']);
// Returns: [
//   { code: 'en', label: 'English', flag: '🇬🇧' },
//   { code: 'es', label: 'Español', flag: '🇪🇸' },
//   { code: 'fr', label: 'Français', flag: '🇫🇷' }
// ]
```

#### `getLocaleOption(code: string)`

Gets a single locale option with fallback.

```tsx
const spanish = getLocaleOption('es');
// { code: 'es', label: 'Español', flag: '🇪🇸' }
```

## Built-in Locales

30+ pre-configured locales including:

English (US/GB), Spanish, French, German, Italian, Portuguese (BR), Russian, Japanese, Korean, Chinese (Simplified/Traditional), Arabic, Hindi, Turkish, Polish, Dutch, Swedish, Danish, Finnish, Norwegian, Czech, Hungarian, Romanian, Greek, Thai, Vietnamese, Indonesian, Hebrew, Ukrainian

See [src/utils.ts](src/utils.ts) for the complete list.

## Demo

The `demo/` folder contains a full working example built with Vite and Lingo.dev Compiler.

```bash
cd demo
npm install
npm run dev
```

## Customization

### Custom Locales

```tsx
const customLocales = [
  { code: 'en', label: 'English (US)', flag: '🇺🇸' },
  { code: 'custom', label: 'Custom Lang', flag: '🌐' }
];

<LocaleSwitcher locales={customLocales} ... />
```

### Custom Styling

Override CSS classes or variables:

```css
.lingo-switcher-dropdown {
  --lingo-bg: #ffffff;
  --lingo-border: #e5e7eb;
}
```

## Project Structure

```text
locale-switcher-widget/
├── src/
│   ├── components/
│   │   ├── LocaleSwitcher.tsx    # Main component
│   │   ├── DropdownSwitcher.tsx  # Dropdown variant
│   │   ├── FlagsSwitcher.tsx     # Flags variant
│   │   └── MinimalSwitcher.tsx   # Minimal variant
│   ├── types.ts                   # TypeScript types
│   ├── utils.ts                   # Locale mappings & helpers
│   ├── styles.css                 # Component styles
│   └── index.ts                   # Public exports
├── demo/                          # Working demo app
└── README.md                      # This file
```

## Contributing

This is a community project! Contributions welcome.

1. Fork the [Lingo.dev repository](https://github.com/lingodotdev/lingo.dev)
2. Make your changes in `community/locale-switcher-widget`
3. Test with the demo app
4. Submit a PR with tag `community-submission`

See the main [Contributing Guide](../../CONTRIBUTING.md).

## Why This Exists

Every developer building with Lingo.dev Compiler needs a locale switcher. This library:

- **Saves time** - No need to build from scratch
- **Best practices** - Accessibility, dark mode, TypeScript
- **Flexibility** - 3 variants + full customization
- **Zero config** - Works out of the box with Lingo.dev

## License

ISC

## Links

- [Lingo.dev](https://lingo.dev)
- [Lingo.dev Compiler Docs](https://lingo.dev/compiler)
- [GitHub](https://github.com/lingodotdev/lingo.dev)
- [Discord](https://lingo.dev/go/discord)


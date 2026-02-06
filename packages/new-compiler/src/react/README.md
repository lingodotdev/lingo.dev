# React Components for Lingo.dev Compiler Beta

This folder contains React components and hooks for the Lingo.dev translation runtime.

## Components

### `<LingoProvider>`

Context provider that manages translations and locale switching for your entire app.

**Props:**

- `initialLocale` (string, required): Initial locale to use (e.g., 'en', 'de', 'fr')
- `sourceLocale` (string, optional): Source language, default: 'en'
- `initialTranslations` (object, optional): Pre-loaded translations
- `fetchTranslations` (function, optional): Custom translation fetch function ms, default: 100

**Example:**

```tsx
// app/layout.tsx
import { LingoProvider } from "@lingo.dev/compiler/react";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <LingoProvider initialLocale="en">{children}</LingoProvider>
      </body>
    </html>
  );
}
```

### `<LocaleSwitcher>`

A dropdown component for switching between locales.

**Props:**

- `locales` (array, optional): Available locales, default: `[{ code: 'en', label: 'English' }]`
- `router` (object, optional): Next.js router for Server Component updates
- `cookieName` (string, optional): Cookie name, default: 'locale'
- `cookieMaxAge` (number, optional): Cookie max age in seconds, default: 31536000 (1 year)
- `style` (object, optional): Custom styles
- `className` (string, optional): Custom class name
- `showLoadingState` (boolean, optional): Show loading indicator, default: true

**Example:**

```tsx
// Client Component with Next.js integration
"use client";
import { useRouter } from "next/navigation";
import { LocaleSwitcher } from "@lingo.dev/compiler/react";

export function Header() {
  const router = useRouter();

  return (
    <header>
      <LocaleSwitcher
        router={router}
        locales={[
          { code: "en", label: "English" },
          { code: "de", label: "Deutsch" },
          { code: "fr", label: "Français" },
        ]}
      />
    </header>
  );
}
```

## Hooks

### `useTranslation()`

Returns a translation function `t(hash)` for translating text in Client Components.

**Note:** This hook is automatically injected by the Babel plugin. You typically don't need to call it manually.

**Example:**

```tsx
"use client";
import { useTranslation } from "@lingo.dev/compiler/react";

export function Welcome() {
  const t = useTranslation();

  return (
    <div>
      <h1>{t("hash_abc123")}</h1>
      <p>{t("hash_def456")}</p>
    </div>
  );
}
```

### `useLingoContext()`

Access the full translation context directly. Use this for custom locale-switching components.

**Returns:**

- `locale` (string): Current locale
- `setLocale` (function): Change locale
- `translations` (object): Translation dictionary
- `registerHashes` (function): Register translation hashes
- `isLoading` (boolean): Loading state

**Example:**

```tsx
"use client";
import { useLingoContext } from "@lingo.dev/compiler/react";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLingoContext();

  return (
    <select value={locale} onChange={(e) => setLocale(e.target.value)}>
      <option value="en">English</option>
      <option value="es">Español</option>
      <option value="de">Deutsch</option>
    </select>
  );
}
```

## How It Works

### Locale Switching Flow

1. User selects new locale in `<LocaleSwitcher>`
2. Cookie is updated (for Server Components to read)
3. Context is updated (for Client Components to re-render)
4. If router is provided, `router.refresh()` is called to re-execute Server Components
5. Client state is preserved throughout (forms, modals, scroll position)
6. Translations are loaded on-demand and cached

### Translation Loading

- Translations are **batched** with a 100ms debounce delay
- Missing translations are requested automatically
- Source locale text is shown as fallback while loading
- Translations are cached in context to avoid re-fetching

### Server Component Support

For Server Components, use the separate `getServerTranslations()` function (not part of this react module). The Babel plugin automatically detects Server Components (async functions) and injects the appropriate translation function.

## Architecture

```
┌─────────────────────────────────────┐
│       LingoProvider           │
│  (Context + State Management)       │
└────────────┬────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
┌─────────┐     ┌──────────────┐
│  Client │     │    Locale    │
│Components│     │   Switcher   │
└─────────┘     └──────┬───────┘
                       │
                       ▼
              ┌────────────────┐
              │  Cookie Update │
              │  + Context     │
              │  + router      │
              │    .refresh()  │
              └────────────────┘
```

## Best Practices

1. **Wrap your entire app** with `<LingoProvider>` in the root layout
2. **Pass the router** to `<LocaleSwitcher>` for seamless Server Component updates
3. **Pre-load common translations** using `initialTranslations` prop
4. **Use custom fetch function** if you have a custom translation API

## TypeScript Support

All components and hooks are fully typed with TypeScript. Import types as needed:

```tsx
import type {
  LingoProviderProps,
  LocaleSwitcherProps,
  LocaleConfig,
  TranslationFunction,
  TranslationContextType,
} from "@lingo.dev/compiler/react";
```

## Testing

When testing components that use translations:

```tsx
import { LingoProvider } from "@lingo.dev/compiler/react";

test("my component", () => {
  render(
    <LingoProvider
      initialLocale="en"
      fetchTranslations={async () => ({ hash_abc: "Hello" })}
    >
      <MyComponent />
    </LingoProvider>,
  );
});
```

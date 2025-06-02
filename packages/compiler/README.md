# Lingo.dev Compiler

Tired of copy-pasting translations? Lingo.dev automates localization so you can focus on building features, not managing language files.

TODO:

- if during prod build we see the LCP was updated, show warning
- update readme: instruct users to fully generate LCP context files by `pnpm build` or similar

## Features

- **Zero-effort localization for React/Next.js apps** — save hours and reach more users instantly.
- **Write your app in one language** — Lingo.dev handles the rest, so you can ship faster.
- **Automatic extraction and injection of translations** — no more manual updates or missed strings.
- **Supports server and client components, including RSC** — works everywhere you need it.
- **Locale switcher UI included** — let users change language instantly.
- **Supports any language** — not limited to the examples below; add your own locales as needed.

## Installation

1. Add the compiler and runtime packages to your app:

   ```sh
   pnpm add @lingo.dev/~compiler @lingo.dev/~react
   # or: yarn add @lingo.dev/~compiler @lingo.dev/~react
   # or: npm install @lingo.dev/~compiler @lingo.dev/~react
   ```

2. Set `GROQ_API_KEY` environmental variable. If you dont have one, create a free account at https://groq.com/.

## Usage with Next.js

### 1. Configure the compiler in `next.config.ts`

```ts
import type { NextConfig } from "next";
import lingoCompiler from "@lingo.dev/~compiler";

const nextConfig: NextConfig = {
  // ...your config
};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr", "ru", "de", "ja", "zh", "ar", "ko"],
})(nextConfig);
```

### 2. Wrap your app with the provider in `layout.tsx`

```tsx
import { LingoProvider, loadDictionary } from "@lingo.dev/~react/rsc";
import { LocaleSwitcher } from "@lingo.dev/~react/client";

export default function RootLayout(props) {
  return (
    <LingoProvider loadDictionary={(locale) => loadDictionary(locale)}>
      <html lang="en">
        <body>
          <LocaleSwitcher
            locales={["en", "es", "fr", "ru", "de", "ja", "zh", "ar", "ko"]}
          />
          {props.children}
        </body>
      </html>
    </LingoProvider>
  );
}
```

### 3. Write your app in your source language

```tsx
export default function Home() {
  return (
    <div>
      <h1>Welcome to Lingo.dev!</h1>
      <p>Build your app in one language only!</p>
      <p>Your app is translated on the fly! ✨</p>
    </div>
  );
}
```

### 4. Use the Locale Switcher

```tsx
import { LocaleSwitcher } from "@lingo.dev/~react/client";

<LocaleSwitcher
  locales={["en", "es", "fr", "ru", "de", "ja", "zh", "ar", "ko"]}
/>;
```

## Usage with React Router

### 1. Configure the compiler in `vite.config.ts`

```ts
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import lingoCompiler from "@lingo.dev/~compiler";

export default defineConfig(({ isSsrBuild }) =>
  lingoCompiler.vite({
    sourceRoot: "app",
    targetLocales: ["es", "fr", "ru", "de", "ja", "zh", "ar", "ko"],
    useDirective: false,
  })({
    // ...other vite config
    plugins: [reactRouter()],
  }),
);
```

### 2. Provide the dictionary and wrap your app with `LingoProvider`

```tsx
import { LingoProvider } from "@lingo.dev/~react/client";
import { loadDictionary } from "@lingo.dev/~react/react-router";

export default function AppRootShell() {
  // ...
  const loaderData = useLoaderData();
  return (
    <LingoProvider dictionary={loaderData.lingoDict}>
      <html lang={loaderData.locale}>{/* ... */}</html>
    </LingoProvider>
  );
}
```

### 3. Load the dictionary in your loader (optional)

If you handle the locale yourself, you can load the dictionary in `loader` method:

```ts
import { loadDictionary } from "@lingo.dev/~react/react-router";

export const loader = async (args) => {
  // ...
  return {
    // ...other data
    lingoDict: await loadDictionary(locale),
  };
};
```

### 4. Use translations in your components

Write your components in your source language. The compiler will extract and inject translations automatically at build time.

## How it works

- **Build time:**
  - The compiler scans your source files for text content.
  - It generates a locale dictionary (see `src/lingo/lcp-dictionary.js` in the demo app).
  - It injects translation loading logic into your app automatically.
- **Runtime:**
  - The `LingoProvider` loads the correct dictionary for the current locale.
  - All text in your app is replaced with the appropriate translation.
  - The `LocaleSwitcher` lets users change language instantly.

## Known limitations

1. Compiler is unable to translate hardcoded strings at the moment. It translates JSX content only (text in HTML elements, React components and fragments).
2. If you delete `lcp-dictinary.js` file, you might need to delete your application build directory (eg `.next` for NextJS) in order to properly rebuild the file.

## Example: Dictionary Structure

```js
// src/lingo/lcp-dictionary.js
export default {
  version: 0.1,
  files: {
    "app/page.tsx": {
      entries: {
        "8/declaration/body/2/argument/1": {
          content: {
            en: "Welcome to Lingo.dev!",
            es: "¡Bienvenido a Lingo.dev!",
            fr: "Bienvenue sur Lingo.dev!",
            // ...
          },
          hash: "58cc38fecf8ffb7b3e6ff4f7742005a5",
        },
      },
    },
  },
};
```

## Supported Frameworks

- Next.js (App Router)
- React Router

## License

MIT

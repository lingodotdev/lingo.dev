# Compiler demo: Vite + React + TypeScript

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

## Implementing Lingo.dev Compiler

1. Install dependencies

```sh
pnpm add lingo.dev
```

2. Import the compiler on top of the `vite.config.ts` file:

```ts
import lingoCompiler from "lingo.dev/compiler";
```

3. Configure the compiler

```ts
export default defineConfig(() =>
  // Compiler: add lingoCompiler.vite
  lingoCompiler.vite({
    sourceRoot: "src",
    targetLocales: ["es", "fr" "de"],
    models: {
      "*:*": "mistral-saba-24b",
    },
  })(viteConfig),
);
```

4. Import provider in `main.tsx` file:

```ts
import { LingoProviderWrapper, loadDictionary } from "lingo.dev/react/client";
```

5. Wrap your `<App>` with the provider:

```ts
<LingoProviderWrapper loadDictionary={(locale) => loadDictionary(locale)}>
  <App />
</LingoProvider>
```

6. Optionally import and render locale switcher anywhere in your app:

```ts
import { LocaleSwitcher } from "lingo.dev/react/client";

// ...

<LocaleSwitcher locales={["en", "es", "fr", "de"]} />
```

---

Built with 💚 using Vite, React and Lingo.dev.

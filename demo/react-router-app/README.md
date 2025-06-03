# Compiler demo: React Router / Remix

A modern, production-ready template for building full-stack React applications using React Router.

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)
- 💚 [Lingo.dev i18n](https://lingo.dev/compiler)

## Getting Started

### Installation

Install the dependencies:

```bash
pnpm install
```

### Development

Start the development server with HMR:

```bash
pnpm dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
pnpm build
```

## Implementing Lingo.dev Compiler

1. Install dependencies

```sh
pnpm add lingo.dev
```

2. Import the compiler in the `vite.config.ts` file:

```ts
import lingoCompiler from "lingo.dev/compiler";
```

3. Configure the compiler

```ts
export default defineConfig(() =>
  lingoCompiler.vite({
    sourceRoot: "src",
    targetLocales: ["es", "fr", "de"],
    models: {
      "*:*": "mistral-saba-24b",
    },
  })(viteConfig),
);
```

4. Import provider in `app/root.tsx` file:

```ts
import { LingoProvider } from "lingo.dev/react/client";
import { loadDictionary } from "lingo.dev/react/react-router";
```

5. Load correct locale dictionary server-side (for server-side rendering support:

```ts
export async function loader(args: LoaderFunctionArgs) {
  return { lingoDictionary: await loadDictionary(args.request) };
}
```

5. Wrap your `<html>` with the provider:

```ts
const loaderData = useLoaderData<typeof loader>();

return (
  <LingoProvider dictionary={loaderData.lingoDictionary}>
    <html>
      {/* ... */}
    </html>
  </LingoProvider>
);
```

6. Optionally import and render locale switcher anywhere in your app:

```ts
import { LocaleSwitcher } from "lingo.dev/react/client";

// ...

<LocaleSwitcher locales={["en", "es", "fr", "de"]} />
```

---

Built with 💚 using React Router and Lingo.dev.

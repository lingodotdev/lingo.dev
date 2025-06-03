# Compiler demo: Next.js with App Router

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) and [Lingo.dev Compiler](https://lingop.dev/compiler) implementation.

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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Implementing Lingo.dev Compiler

1. Install dependencies

```sh
pnpm add lingo.dev
```

2. Import the compiler on top of the `next.config.ts` file:

```ts
import lingoCompiler from "lingo.dev/compiler";
```

3. Configure the compiler

```ts
export default lingoCompiler.next({
  sourceLocale: "en", // current language of your app
  targetLocales: ["es", "fr", "de"],
  models: {
    "*:*": "mistral-saba-24b",
  },
})(nextConfig);
```

4. Import provider in `layout.tsx` file:

```ts
import { LingoProvider, loadDictionary } from "lingo.dev/react/rsc";
```

5. Wrap your `<html>` with the provider:

```ts
<LingoProvider loadDictionary={(locale) => loadDictionary(locale)}>
  <html>
    {/* ... */}
  </html>
</LingoProvider>
```

6. Optionally import and render locale switcher anywhere in your app:

```ts
import { LocaleSwitcher } from "lingo.dev/react/client";

// ...

<LocaleSwitcher locales={["en", "es", "fr", "de"]} />
```

---

Built with 💚 using Next.js and Lingo.dev.

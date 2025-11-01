### Next.js (App Router)
AI translation for Next.js with Lingo.dev CLI

---

### What is Next.js?

**Next.js** is a React-based framework for building modern web applications with features like server-side rendering (SSR), static site generation (SSG), and API routes.  
With the App Router, Next.js enables a flexible, file-based routing system and powerful layouts.

---

### What is Lingo.dev CLI?

**Lingo.dev** is an AI-powered translation platform.  
The **Lingo.dev CLI** reads your source files, sends translatable content to large language models, and writes translated files back to your project.

---

### About this guide

This guide explains how to set up **Lingo.dev CLI** in a **Next.js (App Router)** project.  
You’ll learn how to scaffold a project with Next.js, configure internationalization (i18n), integrate `react-intl`, and view the translated results.

---

### Step 1. Set up a Next.js project

Create a new Next.js application:

```bash
npx create-next-app@latest my-lingo-app
```

Navigate into the project directory:

```bash
cd my-lingo-app
```

---

### Step 2. Configure internationalization (i18n)

Next.js supports built-in i18n routing.  
In your `next.config.mjs`, add the `i18n` configuration:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
  },
};

export default nextConfig;
```

This tells Next.js that:
- English (`en`) is the default language
- Spanish (`es`) is an additional supported locale

Next.js will automatically handle locale-based routing like:
```
/en/about
/es/about
```

---

### Step 3. Install translation dependencies

Install **react-intl** for formatting and rendering translations:

```bash
npm install react-intl
```

---

### Step 4. Create source content

Create a directory for storing localizable content:

```bash
mkdir -p messages
```

Create a file with English strings (`messages/en.json`):

```json
{
  "home.title": "Welcome",
  "home.subtitle": "This text is translated by Lingo.dev",
  "cta": "Get started"
}
```

---

### Step 5. Configure the Lingo.dev CLI

In the root of your project, create an `i18n.json` configuration file:

```json
{
  "$schema": "https://lingo.dev/schema/i18n.json",
  "version": "1.10",
  "locale": {
    "source": "en",
    "targets": ["es"]
  },
  "buckets": {
    "json": {
      "include": ["messages/[locale].json"]
    }
  }
}
```

This file defines:
- The source and target languages  
- The files that **Lingo.dev CLI** should translate  

At runtime, `[locale]` acts as a placeholder that ensures translations are written to the correct paths (e.g., `messages/es.json`).

---

### Step 6. Translate the content

Sign up for a **Lingo.dev** account.

Log in via the CLI:

```bash
npx lingo.dev@latest login
```

Run the translation pipeline:

```bash
npx lingo.dev@latest run
```

The CLI will:
- Generate `messages/es.json` with translated content  
- Create an `i18n.lock` file to track translation progress  

---

### Step 7. Create a translation provider

Set up a provider that loads translations based on locale.

Create a file: `app/[locale]/providers.tsx`

```tsx
'use client';

import { IntlProvider } from 'react-intl';
import enMessages from '../../messages/en.json';
import esMessages from '../../messages/es.json';

const messages: Record<string, Record<string, string>> = {
  en: enMessages,
  es: esMessages,
};

export default function Providers({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      {children}
    </IntlProvider>
  );
}
```

---

### Step 8. Configure layout with i18n routing

Create a localized layout file: `app/[locale]/layout.tsx`

```tsx
import Providers from './providers';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!['en', 'es'].includes(locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        <Providers locale={locale}>{children}</Providers>
      </body>
    </html>
  );
}
```

---

### Step 9. Use the translations

Create your home page: `app/[locale]/page.tsx`

```tsx
'use client';

import { useIntl } from 'react-intl';

export default function HomePage() {
  const intl = useIntl();

  return (
    <main style={{ padding: '2rem' }}>
      <h1>{intl.formatMessage({ id: 'home.title' })}</h1>
      <p>{intl.formatMessage({ id: 'home.subtitle' })}</p>
      <button>{intl.formatMessage({ id: 'cta' })}</button>
    </main>
  );
}
```

---

### Step 10. Run the development server

Start your app:

```bash
npm run dev
```

Visit:
- [http://localhost:3000/en](http://localhost:3000/en)
- [http://localhost:3000/es](http://localhost:3000/es)

Toggle between locales in the URL to view translations.
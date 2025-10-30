### Next.js (App Router) + react-intl + Lingo.dev CLI

Build a multilingual Next.js app (App Router) using react-intl for rendering and Lingo.dev CLI to manage translations.

This guide mirrors the flow of other Lingo.dev integration guides: you’ll start from a fresh app, wire up Next.js i18n routing, add react-intl, then configure the Lingo.dev CLI to translate your messages and keep them synced.

---

## Prerequisites
- Node 18+
- A GitHub account (to open a PR per the contribution workflow)
- Basic familiarity with Next.js and React

## 1. Create a fresh Next.js (App Router) project
```bash
npx create-next-app@latest nextjs-lingo
cd nextjs-lingo
```

Verify you’re using the App Router (there should be an `app/` directory).

## 2. Configure Next.js i18n routing
Follow the official Next.js App Router internationalization guide.

1) Add locales to `next.config.ts`:
```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  i18n: {
    locales: ['en', 'es', 'fr'],
    defaultLocale: 'en',
  },
}

export default nextConfig
```

2) Create a locale segment and propagate the current locale (Server layout + Client provider):
```tsx
// app/[locale]/layout.tsx
import { ReactNode } from 'react'
import LocaleProvider from '../../src/i18n/LocaleProvider'

type Props = {
  children: ReactNode
  params: { locale: string }
}

async function loadMessages(locale: string) {
  // Keep translations in src/messages/<locale>.json
  const messages = await import(`../../src/messages/${locale}.json`).then(m => m.default)
  return messages
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = params
  const messages = await loadMessages(locale)

  return (
    <html lang={locale}>
      <body>
        <LocaleProvider locale={locale} messages={messages}>
          {children}
        </LocaleProvider>
      </body>
    </html>
  )
}
```

Add a client provider that wraps `react-intl`:
```tsx
// src/i18n/LocaleProvider.tsx
'use client'
import { ReactNode } from 'react'
import { IntlProvider } from 'react-intl'

type Props = {
  locale: string
  messages: Record<string, string>
  children: ReactNode
}

export default function LocaleProvider({ locale, messages, children }: Props) {
  return (
    <IntlProvider locale={locale} messages={messages} defaultLocale="en">
      {children}
    </IntlProvider>
  )
}
```

3) Route your homepage via the locale segment (Client component for hooks):
```tsx
// app/[locale]/page.tsx
'use client'
import { FormattedMessage, useIntl } from 'react-intl'

export default function Home() {
  const intl = useIntl()
  return (
    <main>
      <h1>
        <FormattedMessage id="home.title" defaultMessage="Welcome" />
      </h1>
      <p>
        {intl.formatMessage({ id: 'home.tagline', defaultMessage: 'Multilingual by default.' })}
      </p>
    </main>
  )
}
```

4) Redirect the root path `/` to the default locale:
```ts
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_FILE = /\.(.*)$
const locales = ['en', 'es', 'fr']
const defaultLocale = 'en'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/_next') ||
    pathname.includes('/api/') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return
  }

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  )

  if (pathnameIsMissingLocale) {
    const url = request.nextUrl.clone()
    url.pathname = `/${defaultLocale}${pathname}`
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
```

That’s the minimal App Router i18n shape: locale-prefixed routes and an `IntlProvider` per locale.

## 3. Add react-intl and messages
```bash
npm install react-intl
```

Create message files for each locale used above:
```bash
mkdir -p src/messages
```

```json
// src/messages/en.json
{
  "home.title": "Welcome",
  "home.tagline": "Multilingual by default."
}
```

```json
// src/messages/es.json
{
  "home.title": "Bienvenido",
  "home.tagline": "Multilingüe por defecto."
}
```

```json
// src/messages/fr.json
{
  "home.title": "Bienvenue",
  "home.tagline": "Multilingue par défaut."
}
```

Start the dev server and verify locale routing:
```bash
npm run dev
# open http://localhost:3000 -> redirects to /en
# visit /es and /fr to see translated UI
```

## 4. Initialize Lingo.dev CLI
Lingo.dev CLI translates and maintains your locale files. You’ll configure it to treat `src/messages/[locale].json` as the translatable bucket.

1) Initialize an `i18n.json` config (non-interactive example shown):
```bash
npx lingo.dev@latest init --source en --targets "es,fr" --bucket json --paths "src/messages/[locale].json"
```

This creates `i18n.json` in your project root. A typical config looks like:
```json
{
  "$schema": "https://lingo.dev/schema/i18n.json",
  "version": "1.10",
  "locale": {
    "source": "en",
    "targets": ["es", "fr"]
  },
  "buckets": {
    "json": {
      "include": ["src/messages/[locale].json"]
    }
  }
}
```

2) (Optional) Authenticate to use cloud providers easily:
```bash
npx lingo.dev@latest login
```

3) Run translations:
```bash
npx lingo.dev@latest run
```

The CLI fingerprints strings in `src/messages/en.json` and writes translations into the matching `src/messages/es.json` and `src/messages/fr.json` files. It maintains an `i18n.lock` to ensure stability and incremental updates.

4) Continuous mode during development:
```bash
npx lingo.dev@latest run --watch
```

Edit your English source file and watch target locales update automatically.

## 5. Using messages in components
react-intl supports rich rendering using `FormattedMessage` and programmatic access via `useIntl`.

- For simple text:
```tsx
<FormattedMessage id="home.title" defaultMessage="Welcome" />
```

- For programmatic formatting:
```tsx
const intl = useIntl()
intl.formatMessage({ id: 'home.tagline', defaultMessage: 'Multilingual by default.' })
```

Keep `defaultMessage` present during development; Lingo.dev uses your `en` JSON as the source of truth for translation.

## 6. Testing the complete flow
1) Boot the app:
```bash
npm run dev
```

2) Verify redirects and content:
- Visit `/` and confirm redirect to `/en`
- Visit `/es` and `/fr` to confirm translated UI

3) Change `src/messages/en.json`, re-run:
```bash
npx lingo.dev@latest run
```
Confirm updates are reflected in `es.json` and `fr.json`.

## 7. Commit and open a PR
- Add this guide as `docs/nextjs-app-router.md` to your repository
- Commit your sample app changes (if any) and open a PR
- We’ll review, help polish, and if published, we’ll include a byline linking your GitHub profile

## Troubleshooting
- If translations don’t appear, ensure the file path in `i18n.json` matches where your locale files live (must include `[locale]`).
- If you see config validation errors, run:
```bash
npx lingo.dev@latest show config
```
to print the effective merged config.
- For CI validation without mutation, use:
```bash
npx lingo.dev@latest run --frozen
```

## References
- Next.js Internationalization (App Router): `https://nextjs.org/docs/app/guides/internationalization`
- react-intl: `https://formatjs.io/docs/react-intl/`
- Lingo.dev CLI: `https://lingo.dev/cli`



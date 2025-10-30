# Tauri

AI translation for Tauri with Lingo.dev CLI

## What is Tauri?

Tauri is a framework for building tiny, fast binaries for all major desktop and mobile platforms.

## What is Lingo.dev CLI?

Lingo.dev is an AI-powered translation platform. The Lingo.dev CLI reads source files, sends translatable content to large language models, and writes translated files back to your project.

## About this Guide

This guide explains how to set up Lingo.dev CLI with the Tauri framework. You'll learn how to use `react-intl` to render translations.

## Step 1. Setup a Tauri Project

1. Install Rust :

- For Window
```bash
winget install --id Rustlang.Rustup
```
- For Linux and macOS
```bash 
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

2. Create a tauri Project
 ``` bash 
 npm create tauri-app@latest
 ```

2. Choose language for Frontend:

```
Typescript / Javascript - (pnpm, yarn, npm, deno, bun)
```

3. Choose UI template:

```
React - (https://react.dev/)
```

4. Navigate into your project directory and install dependencies:

```bash
cd your-project-name
npm install
```

## Step 2. Add Internationalization (i18n) with react-intl

1. Install the package:

```bash
npm install react-intl
```

2. Create your translation directory structure:

```bash
mkdir -p src/i18n
```

3. Create your source translation file `src/i18n/en.json`:

```json
{
  "welcome": "Welcome to Tauri with Lingo!",
  "cta": "Click the button below to switch languages."
}
```


## Step 3. Configure  CLI

1. In the root of your project, create an `i18n.json` configuration file:

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
      "include": ["src/i18n/[locale].json"]
    }
  }
}
```

This tells Lingo.dev to:
 Use English (`en`) as the source language
 Translate to Spanish (`es`)
 Look for translation files in `src/i18n/`

## Step 4. Translate the Content

1. Sign up for a [Lingo.dev account](https://lingo.dev).

2. Log in to Lingo.dev via the CLI:

```bash
npx lingo.dev@latest login
```

3. Run the translation pipeline:

```bash
npx lingo.dev@latest run
```

The CLI will create a `src/i18n/es.json` file for storing the translated content and an `i18n.lock` file for keeping track of what has been translated (to prevent unnecessary retranslations).

## Step 5. Use the Translations

1. In your `tsconfig.json` file, enable JSON imports by adding `resolveJsonModule` to `compilerOptions`:

```json
{
  "compilerOptions": {
    "resolveJsonModule": true,
  }
}
```

2. Update your `src/App.tsx` to load translations for specific locales:

```tsx
import React, { useState } from "react";
import { IntlProvider } from "react-intl";
import en from "./i18n/en.json";
import es from "./i18n/es.json";
import Welcome from "./components/Welcome";

const messages: Record<string, any> = { en, es };

export default function App() {
  const [locale, setLocale] = useState("en");

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <Welcome />
        <button onClick={() => setLocale(locale === "en" ? "es" : "en")}>
          {locale === "en" ? "Switch to Español" : "Cambiar a English"}
        </button>
      </div>
    </IntlProvider>
  );
}
```

3. Create the Welcome component at `src/components/Welcome.tsx`:

```tsx
import { useIntl } from "react-intl";

export default function Welcome() {
  const intl = useIntl();
  return (
    <>
      <h1>{intl.formatMessage({ id: "welcome" })}</h1>
      <p>{intl.formatMessage({ id: "cta" })}</p>
    </>
  );
}
```

4. Build and launch your app:

```bash
npm run tauri dev
```

5. Navigate to the app window that opens (typically at `http://localhost:1420/`).

6. Toggle between the available languages by clicking the button.


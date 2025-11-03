
---
title
---

## What is Svelte?

[Svelte](https://svelte.dev/) is a modern framework for building web applications.  
Unlike other frameworks, Svelte compiles your code to highly optimized JavaScript at build time, so your app runs faster in the browser.

---

## What is Lingo.dev?

[Lingo.dev](https://lingo.dev/) is an AI-powered translation platform.  
It allows you to automatically translate content in your project using a **CLI** for static translations.

---

## About this guide

This guide explains how to set up **Lingo.dev CLI** in a Svelte project.  
You will learn how to:

- Install Svelte or SvelteKit  
- Create static content  
- Configure and run Lingo.dev CLI  
- Use translated content in your Svelte components  

---

## Step 1. Install Svelte (If you have an existing Svelte project, please skip to **Step 2**)

### Using SvelteKit

1. Open a terminal of your choice.  
2. Create a new project:

```bash
npx sv create <Name-of-the-app>
````

3. Follow the prompts to choose options.
4. Navigate into the project directory:

```bash
cd <Name-of-the-app>
```

5. Start the development server:

```bash
npm run dev -- --open
```

6. This should open localhost with the built-in Svelte page.

### Using Vite + Svelte (Svelte compiler only)

1. Open a terminal of your choice.
2. Create a new project:

```bash
npm create vite@latest <Name-of-the-app> -- --template svelte
```

3. Navigate into the project directory:

```bash
cd <Name-of-the-app>
```

4. Install dependencies:

```bash
npm install
```

5. Start the development server:

```bash
npm run dev -- --open
```

---

## Step 2. Create a Lingo.dev account

1. Go to [lingo.dev](https://lingo.dev/).
2. Click **Get Started**.
3. Sign in using your preferred authorization method.
4. On the dashboard, click **Get API Key**.
5. Copy the key using the **Copy** button.

> The API key starts with `api_` followed by a 24-character alphanumeric string.

---

## Step 3. Install and Configure Lingo.dev CLI

### 1. Initialize Lingo.dev in the project

```bash
npx lingo.dev@latest init
```

### 2. Log in to Lingo.dev

```bash
npx lingo.dev@latest login
```

> ⚠ On Windows, `npx` may inject a shell script that cannot run without WSL or Git Bash.
> In that case, install globally:

```bash
npm i -g lingo.dev
lingo.dev login
```

### 3. Create a directory for localizable content

```bash
mkdir -p src/lib/i18n
```

### 4. Create an English content file

```bash
touch src/lib/i18n/en.json
```

### 5. Populate it with your content, for example:

```json
{
  "home": {
    "title": "Welcome",
    "subtitle": "This text is translated by Lingo.dev"
  },
  "cta": "Get started"
}
```

### 6. Create a root configuration file for the CLI

```bash
touch i18n.json
```

Add the following content:

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
      "include": ["src/lib/i18n/[locale].json"]
    }
  }
}
```

### 7. Run the CLI to generate target language content

```bash
npx lingo.dev@latest run
# or if globally installed
lingo.dev run
```

---

## Step 4. Create an i18n Consumer

Add the following Svelte store setup to manage translations:

```ts
// src/lib/i18n.ts
import { writable } from "svelte/store";
import en from "$lib/i18n/en.json";
import es from "$lib/i18n/es.json";

const translations = { en, es };

type Locale = keyof typeof translations;

// Narrow the browser language to a supported locale or fallback to 'en'
const detectedLang = (navigator.language.split("-")[0] || "en") as string;
const browserLang: Locale = (Object.keys(translations) as Locale[]).includes(
  detectedLang as Locale
)
  ? (detectedLang as Locale)
  : "en";

// Svelte stores
export const locale = writable<Locale>(browserLang);
export const t = writable(translations[browserLang]);

// Function to change the locale dynamically
export function setLocale(newLocale: Locale) {
  if (translations[newLocale]) {
    locale.set(newLocale);
    t.set(translations[newLocale]);
  }
}
```

---

## Step 5. Use Translations in a Svelte Component

```ts
<script lang="ts">
  import { t, locale, setLocale } from "$lib/i18n";
  import { onMount } from "svelte";

  let translation;

  // Subscribe to translation store
  const unsubscribe = t.subscribe(value => {
    translation = value;
  });

  // Cleanup on destroy
  onMount(() => {
    return () => unsubscribe();
  });

  // Toggle language
  function toggleLocale() {
    locale.update(current => {
      const next = current === "en" ? "es" : "en";
      setLocale(next);
      return next;
    });
  }
</script>

<h2>{translation.home.title}</h2>
<p>{translation.home.subtitle}</p>
<button on:click={toggleLocale}>
  { $locale === "en" ? "Switch to Español" : "Cambiar a English" }
</button>
```

---

## Step 6. Run and Test

Start your dev server again:

```bash
npm run dev
```

Visit your app in the browser and click the toggle button —
you should see your text switch between **English** and **Spanish**, powered by **Lingo.dev CLI** translations.

---

## Docs

* [Lingo.dev CLI Documentation](https://lingo.dev/cli)
* [Svelte Documentation](https://svelte.dev/docs)

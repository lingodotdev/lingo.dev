--- 
title: "Svelte" 
subtitle: "AI translation for Svelte  with Lingo.dev CLI and SDK" 
---

## What is Svelte?

[Svelte](https://svelte.dev/) is a modern framework for building web applications.  
Unlike other frameworks, Svelte compiles your code to highly optimized JavaScript at build time, so your app runs faster in the browser.

---

## What is Lingo.dev?

[Lingo.dev](https://lingo.dev/) is an AI-powered translation platform.  
It allows you to automatically translate content in your project using either a **CLI** for static content or an **SDK** for dynamic, real-time translations.

---

## About this guide

This guide explains how to set up Lingo.dev in a Svelte project.  
You will learn how to:

- Install Svelte or SvelteKit
- Create static and dynamic content
- Configure Lingo.dev CLI and SDK
- Use translated content in your Svelte components

---

## Step 1. Install Svelte (If you have an existing svelte project, please skip to **Step 2**)

### Using SvelteKit

1. Open a terminal of your choice.
2. Create a new project:

```bash
   npx sv create <Name-of-the-app>
```
- <img width="800" height="500" alt="C__Windows_system32_cmd exe  03-11-2025 13_13_47" src="https://github.com/user-attachments/assets/ed042e99-1299-4c3a-b847-90af28921dd8" />

3. Follow the prompts to choose options.

- <img width="800" height="500" alt="C__Windows_system32_cmd exe  03-11-2025 13_14_22" src="https://github.com/user-attachments/assets/ce6cbe26-7414-4d06-bbe8-37e4c2cd693d" />

4. Navigate into the project directory:

```bash
   cd <Name-of-the-app>
```
5. Start the development server:

```bash
   npm run dev -- --open
```

6. This should open localhost with the svelte built in page.

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

## Step 3. Install Lingo.dev in your project

### Using Lingo.dev CLI (for static content)

1. Initialize Lingo.dev in the project:

```bash
   npx lingo.dev@latest init
```
2. Log in to Lingo.dev:

```bash
   npx lingo.dev@latest login
```

3. ⚠ On Windows, `npx` may inject a shell script that cannot run without WSL or Git Bash.
   In that case, install globally:

- <img width="800" height="500" alt="C__Windows_system32_cmd exe  03-11-2025 13_48_58" src="https://github.com/user-attachments/assets/12ae0df7-a942-4e86-8cc6-1d88290ab947" />

```bash
   npm i -g lingo.dev
   lingo.dev login
```
4. Create a directory for localizable content:

```bash
   mkdir -p src/lib/i18n
```
5. Create an English (or any preferred language) content file:

```bash
   touch src/lib/i18n/en.json
```
6. Populate the file with your content, for example:

```json
{
	"home": {
		"title": "Welcome",
		"subtitle": "This text is translated by Lingo.dev"
	},
	"cta": "Get started"
}
```
7. Create an `i18n.json` file at the root of your project to configure the CLI.
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
8. Run the CLI to generate target language content:

```bash
   npx lingo.dev@latest run or lingo.dev run (for global installation)
```
- <img width="800" height="500" alt="MINGW64__c_Users_SOHAM_Desktop_web development_my-lingo-app 03-11-2025 13_57_40" src="https://github.com/user-attachments/assets/85654e36-37ed-4ed0-9770-dbeaddd7905a" />

9. Create an i18n consumer
```ts
// src/lib/i18n.ts
import { writable } from "svelte/store";
import en from "./i18n/en.json";
import es from "./i18n/es.json";

// All available translations
const translations = { en, es };

// Get the browser language or default to 'en'
const browserLang = navigator.language.split("-")[0] || "en";

// Svelte store for current locale
export const locale = writable(browserLang);

// Svelte store for the current translation
export const t = writable(translations[browserLang]);

// Function to change the locale dynamically
export function setLocale(newLocale: keyof typeof translations) {
  if (translations[newLocale]) {
    locale.set(newLocale);
    t.set(translations[newLocale]);
  }
}

```

10. Use this in svelte components
```ts
<script lang="ts">
  import { t, locale, setLocale } from "$lib/i18n";
  import { onMount } from "svelte";

  let translation;

  // Subscribe to store
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

<h2>{translation.greeting}</h2>
<p>{translation.farewell}</p>

<button on:click={toggleLocale}>
  { $locale === "en" ? "Switch to Español" : "Cambiar a English" }
</button>

```

---

### Using Lingo.dev SDK (for dynamic or real-time translations)

1. Install the SDK:

```bash
   npm install lingo.dev
```
2. Create a file to initialize the SDK:

```ts
   // src/lib/lingo.ts
   import { LingoDotDevEngine } from "lingo.dev/sdk";

   export const lingoDotDev = new LingoDotDevEngine({
     apiKey: "your-api-key-here"
   });
```
3. Import this instance in your Svelte components to use real-time translations:

```ts
   import { lingoDotDev } from '$lib/lingo';
```
4. Optional: To avoid CORS issues, you can create backend APIs that call Lingo.dev instead of calling it directly from the browser.

```ts
	// src/routes/api/translate/+server.ts
	import type { RequestHandler } from './$types';
	import { lingoDotDev } from '$lib/i18n/lingo';

	export const POST: RequestHandler = async ({ request }) => {
	const { content, targetLocale } = await request.json();

	const translated = await lingoDotDev.localizeObject(content, {
		sourceLocale: 'en',
		targetLocale
	});

	return new Response(JSON.stringify(translated), {
		headers: { 'Content-Type': 'application/json' }
	});
	};

```

and then use the endpoint in svelte

```ts
<script lang="ts">
  import { onMount } from 'svelte';

  type Translation = {
    greeting: string;
    farewell: string;
  };

  let translated: Translation;

  onMount(async () => {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: { greeting: "Hello", farewell: "Goodbye" }, targetLocale: "es" })
    });
    translated = await res.json();
  });
</script>

<h2>Translations</h2>
<p>{translated.greeting}</p>
<p>{translated.farewell}</p>

```

## Docs
- Check out [Lingo.dev sdk](https://lingo.dev/sdk) for sdk features
- Check out [Lingo.dev CLI tool](https://lingo.dev/cli) for more details on cli tool features.

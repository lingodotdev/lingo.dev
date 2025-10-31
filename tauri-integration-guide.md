---
title: Tauri
description: Learn how to use Lingo.dev CLI with Tauri to build multilingual desktop applications
---

# Tauri

[Tauri](https://tauri.app/) is a framework for building tiny, fast desktop applications with a web frontend. This guide will show you how to integrate Lingo.dev CLI into a Tauri application using React and react-intl.

## Prerequisites

Before you begin, make sure you have:

- [Node.js](https://nodejs.org/) installed (v18 or later)
- [Rust](https://www.rust-lang.org/tools/install) installed
- A [Lingo.dev account](https://lingo.dev/signup)
- [Lingo.dev CLI](https://lingo.dev/en/cli/getting-started) installed

## Step 1: Create a new Tauri project

First, create a new Tauri application with React:

```bash
npm create tauri-app@latest
```

When prompted, configure your project:
- Project name: `my-tauri-app`
- Choose which language to use for your frontend: `TypeScript / JavaScript`
- Choose your package manager: `npm`
- Choose your UI template: `React`
- Choose your UI flavor: `TypeScript`

Navigate into your project directory:

```bash
cd my-tauri-app
```

## Step 2: Install dependencies

Install react-intl and its dependencies:

```bash
npm install react-intl
```

## Step 3: Initialize Lingo.dev

Initialize Lingo.dev in your project:

```bash
lingo init
```

Follow the prompts:
- Select your project from the list or create a new one
- Choose your source language (e.g., `en` for English)
- Choose your target languages (e.g., `es` for Spanish, `fr` for French, `de` for German)

This will create a `lingo.config.json` file in your project root.

## Step 4: Configure Lingo.dev

Update your `lingo.config.json` to specify where translations should be stored:

```json
{
  "project": "your-project-id",
  "source": "en",
  "targets": ["es", "fr", "de"],
  "format": "react-intl",
  "output": "src/locales/{locale}.json"
}
```

## Step 5: Create the locales directory

Create a directory for your translation files:

```bash
mkdir -p src/locales
```

## Step 6: Set up the IntlProvider

Create a new file `src/i18n/IntlProvider.tsx`:

```tsx
import { useState, useEffect, ReactNode } from 'react';
import { IntlProvider as ReactIntlProvider } from 'react-intl';

interface Props {
  children: ReactNode;
}

const loadMessages = async (locale: string) => {
  try {
    const messages = await import(`../locales/${locale}.json`);
    return messages.default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    return {};
  }
};

export const IntlProvider = ({ children }: Props) => {
  const [locale, setLocale] = useState<string>('en');
  const [messages, setMessages] = useState<Record<string, string>>({});

  useEffect(() => {
    const initializeLocale = async () => {
      // Get the system locale from Tauri
      const systemLocale = navigator.language.split('-')[0];
      const supportedLocales = ['en', 'es', 'fr', 'de'];
      const selectedLocale = supportedLocales.includes(systemLocale) 
        ? systemLocale 
        : 'en';

      setLocale(selectedLocale);
      const loadedMessages = await loadMessages(selectedLocale);
      setMessages(loadedMessages);
    };

    initializeLocale();
  }, []);

  return (
    <ReactIntlProvider locale={locale} messages={messages}>
      {children}
    </ReactIntlProvider>
  );
};

export const useChangeLocale = () => {
  const [locale, setLocale] = useState<string>('en');

  const changeLocale = async (newLocale: string) => {
    const messages = await loadMessages(newLocale);
    setLocale(newLocale);
    return messages;
  };

  return { locale, changeLocale };
};
```

## Step 7: Wrap your app with IntlProvider

Update `src/main.tsx` to wrap your app with the IntlProvider:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { IntlProvider } from "./i18n/IntlProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <IntlProvider>
      <App />
    </IntlProvider>
  </React.StrictMode>,
);
```

## Step 8: Add translations to your components

Update `src/App.tsx` to use react-intl:

```tsx
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const intl = useIntl();

  async function greet() {
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <main className="container">
      <h1>
        <FormattedMessage
          id="app.welcome"
          defaultMessage="Welcome to Tauri + React"
        />
      </h1>

      <div className="row">
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder={intl.formatMessage({
            id: "app.input.placeholder",
            defaultMessage: "Enter a name...",
          })}
        />
        <button type="button" onClick={() => greet()}>
          <FormattedMessage id="app.greet.button" defaultMessage="Greet" />
        </button>
      </div>

      <p>{greetMsg}</p>

      <div className="info">
        <FormattedMessage
          id="app.info"
          defaultMessage="Click on the Tauri, Vite, and React logos to learn more."
        />
      </div>
    </main>
  );
}

export default App;
```

## Step 9: Extract translations

Extract translation strings from your components:

```bash
lingo extract
```

This command will scan your code for `FormattedMessage` components and `intl.formatMessage()` calls, creating or updating `src/locales/en.json` with the source messages.

## Step 10: Push to Lingo.dev

Upload your source messages to Lingo.dev:

```bash
lingo push
```

## Step 11: Translate in Lingo.dev

1. Open your project in [Lingo.dev](https://lingo.dev)
2. Navigate to the translations view
3. Add translations for your target languages (or use AI-powered auto-translation)
4. Review and approve the translations

## Step 12: Pull translations

Download the translated messages:

```bash
lingo pull
```

This will download translation files for all your target languages to `src/locales/`.

## Step 13: Add language switcher (optional)

Create a language switcher component `src/components/LanguageSwitcher.tsx`:

```tsx
import { useState } from 'react';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
];

export const LanguageSwitcher = () => {
  const [locale, setLocale] = useState('en');

  const handleChange = async (newLocale: string) => {
    setLocale(newLocale);
    // Reload the page to apply new locale
    window.location.reload();
    
    // Store preference for next session
    localStorage.setItem('locale', newLocale);
  };

  return (
    <select 
      value={locale} 
      onChange={(e) => handleChange(e.target.value)}
      style={{ position: 'absolute', top: 10, right: 10 }}
    >
      {LANGUAGES.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
};
```

Then add it to your `App.tsx`:

```tsx
import { LanguageSwitcher } from "./components/LanguageSwitcher";

function App() {
  // ...existing code...

  return (
    <main className="container">
      <LanguageSwitcher />
      {/* ...existing code... */}
    </main>
  );
}
```

Update `src/i18n/IntlProvider.tsx` to check localStorage:

```tsx
useEffect(() => {
  const initializeLocale = async () => {
    const savedLocale = localStorage.getItem('locale');
    const systemLocale = navigator.language.split('-')[0];
    const supportedLocales = ['en', 'es', 'fr', 'de'];
    
    const selectedLocale = savedLocale && supportedLocales.includes(savedLocale)
      ? savedLocale
      : supportedLocales.includes(systemLocale)
      ? systemLocale
      : 'en';

    setLocale(selectedLocale);
    const loadedMessages = await loadMessages(selectedLocale);
    setMessages(loadedMessages);
  };

  initializeLocale();
}, []);
```

## Step 14: Build and run your app

Run your application in development mode:

```bash
npm run tauri dev
```

Or build for production:

```bash
npm run tauri build
```

Your Tauri application will launch with translations based on the system locale, and users can switch languages using the language switcher.

## Continuous localization workflow

To keep your translations in sync as you develop:

1. **Extract** new translation strings:
   ```bash
   lingo extract
   ```

2. **Push** changes to Lingo.dev:
   ```bash
   lingo push
   ```

3. **Translate** in the Lingo.dev dashboard

4. **Pull** updated translations:
   ```bash
   lingo pull
   ```

5. **Test** your application with the new translations

## Advanced: Accessing system locale from Rust

For more advanced use cases, you can access the system locale from Tauri's Rust backend. Create a new command in `src-tauri/src/lib.rs`:

```rust
#[tauri::command]
fn get_system_locale() -> String {
    sys_locale::get_locale().unwrap_or_else(|| String::from("en"))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, get_system_locale])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

Add the `sys-locale` dependency to `src-tauri/Cargo.toml`:

```toml
[dependencies]
sys-locale = "0.3"
```

Then call this command from your React frontend:

```tsx
import { invoke } from "@tauri-apps/api/core";

const systemLocale = await invoke<string>('get_system_locale');
```

## Best practices

- **Namespace your translation IDs**: Use descriptive, hierarchical IDs like `app.welcome`, `settings.title`, etc.
- **Provide default messages**: Always include `defaultMessage` in your `FormattedMessage` components for better developer experience
- **Automate with CI/CD**: Integrate `lingo push` and `lingo pull` into your build pipeline
- **Use ICU Message Format**: Take advantage of pluralization, gender, and number formatting features
- **Test all languages**: Build and test your app in each target language before releasing

## Troubleshooting

### Translations not loading

Make sure your locale files are in the correct location (`src/locales/{locale}.json`) and that the dynamic import in `IntlProvider.tsx` can find them.

### Build errors

Ensure all locale JSON files are valid JSON and don't contain syntax errors. Run `lingo pull` again if needed.

### Missing translations

Check that you've run `lingo extract` after adding new `FormattedMessage` components, and that you've pushed and pulled translations from Lingo.dev.

## Next steps

- Explore [react-intl's documentation](https://formatjs.io/docs/react-intl/) for advanced formatting options
- Set up [automated workflows](https://lingo.dev/en/cli/automation) with GitHub Actions
- Learn about [translation memory](https://lingo.dev/en/features/translation-memory) and [glossaries](https://lingo.dev/en/features/glossary) in Lingo.dev

---

**Need help?** Join our [community Discord](https://lingo.dev/discord) or check out the [CLI documentation](https://lingo.dev/en/cli).
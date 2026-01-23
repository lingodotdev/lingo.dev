# Multi-Language Errors (`multi-lang-errors`)

**Easily manage and translate error messages across multiple languages in your React applications.**

`multi-lang-errors` allows you to define your app’s error messages in one place, generate translations automatically using **Lingo.dev**, and consume them seamlessly with a React hook.

---

## Features

- Define all error messages in a single config file.
- Generate translations for multiple languages automatically.
- Access translated error messages via a simple React hook (`useError`).
- Supports dynamic language switching in your UI.
- Fully customizable — you can edit translations manually if needed.

---

## Folder Structure

```
multi-lang-errors/
├─ src/
│  └─ (package code)
├─ cli/
│  ├─ init.ts
│  └─ generate.ts
├─ package.json
└─ README.md

```

---

## Getting Started

Follow these steps to integrate `multi-lang-errors` in your project (`test-app`).

### 1. Install the package

In your `test-app` project:

```bash
npm install ../multi-lang-errors

```

---

### 2. Initialize

Run the CLI **init command** to set up a demo React app and configuration:

```bash
npx multi-lang-errors init
```

This will:

- Create a `multi-lang-errors.config.json` file in your project root.
- Create a `src/errors/` folder where translations will be stored.
- Optionally create a demo `App.jsx` to showcase how errors work.

---

### 3. Configure Your Errors

Open `multi-lang-errors.config.json`:

```json
{
  "apiKey": "YOUR_LINGO_API_KEY",
  "languages": ["en", "es", "fr"],
  "baseErrors": {
    "REQUIRED_FIELD": "This field is required",
    "INVALID_EMAIL": "Invalid email address"
  }
}
```

- `apiKey`: Your **Lingo.dev** API key for translations.
- `languages`: List of target languages.
- `baseErrors`: All error messages in English (`en`).

> Add more error keys here as needed.

---

### 4. Generate Translations

After configuring your errors, run:

```bash
npx multi-lang-errors generate
```

This will:

- Generate translated error messages for all languages in `src/errors/errors.js`.
- Create an `index.js` bridge that automatically initializes the translations.

> ⚠️ If you don’t run this, your app will show a warning and no translations will be loaded.

---

### 5. Use `useError` Hook in React

Now you can use `useError` in your components:

```jsx
import React, { useState } from "react";
import "./errors"; // Loads generated translations
import { useError } from "multi-lang-errors";

export default function App() {
  const [lang, setLang] = useState("en");
  const { getError, getLanguages } = useError(lang);
  const languages = getLanguages();

  return (
    <div>
      <h1>Multi-language Errors Demo</h1>

      <select value={lang} onChange={(e) => setLang(e.target.value)}>
        {languages.map((l) => (
          <option key={l} value={l}>
            {l.toUpperCase()}
          </option>
        ))}
      </select>

      <p>{getError("REQUIRED_FIELD")}</p>
      <p>{getError("INVALID_EMAIL")}</p>
    </div>
  );
}
```

**Key functions:**

- `getError("ERROR_KEY")` → Returns the translated error message.
- `getLanguages()` → Returns all available languages.
- Switch the `lang` state to dynamically update messages.

---

### 6. Adding New Errors

1. Add new keys to `baseErrors` in `multi-lang-errors.config.json`.
2. Run:

```bash
npx multi-lang-errors generate
```

Your new error keys will be translated and available automatically.

---

### 7. Manual Editing (Optional)

- All translations are stored in `src/errors/errors.js`.
- You can manually edit translations if needed. Changes will persist unless you regenerate with `generate`.

---

### 8. Example Project

After running the above steps, your `test-app` structure will look like this:

```
test-app/
├─ src/
│  ├─ App.jsx
│  └─ errors/
│     ├─ errors.js      # Auto-generated translations
│     └─ index.js       # Auto-generated init file
├─ package.json
└─ multi-lang-errors.config.json
```

---

### 9. Support & Contribution

If you find bugs, want to request features, or contribute:

- Open an issue or pull request in this repository.
- Ensure all translations are tested.
- Follow coding conventions used in the package.

---

### 10. License

MIT License © 2026

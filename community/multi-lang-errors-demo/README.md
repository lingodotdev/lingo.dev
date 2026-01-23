# Multi-Language Errors Demo Repository

Welcome to the **Multi-Language Errors** demo repository! This repository contains:

1. **`multi-lang-errors/`** – The npm package for managing multi-language error messages in React applications.
2. **`test-app/`** – A sample React project demonstrating how to integrate and use `multi-lang-errors`.

---

## Repository Structure

```
.
├─ multi-lang-errors/   # The package source code
│  ├─ src/             # Package implementation
│  ├─ cli/             # CLI commands: init & generate
│  ├─ package.json
│  └─ README.md        # Detailed usage guide for the package
│
├─ test-app/           # Demo React app
│  ├─ src/
│  │  ├─ App.jsx
│  │  └─ errors/      # Generated translations folder
│  ├─ package.json
│  └─ ...
│
└─ README.md           # This file (overview & getting started)
```

---

## Purpose

The goal of this repository is to provide:

- A ready-to-use **React package** for handling multi-language error messages.
- A **demo app** showing real usage, including error generation, language switching, and integration with React components.
- A clear workflow for developers to **add new errors, generate translations, and consume them in React apps**.

---

## Getting Started

Follow these steps to explore and test the package:

### 1. Install Dependencies

```bash
# Navigate to the test-app folder
cd test-app
npm install
```

> Make sure the `multi-lang-errors` package is installed locally.  
> Use `npm install ../multi-lang-errors` in the `test-app` folder.

---

### 2. Initialize the Package

Inside `test-app`, run:

```bash
npx multi-lang-errors init
```

- Creates a `multi-lang-errors.config.json`.
- Sets up `src/errors/` for generated translations.
- Creates a demo `App.jsx` file to demonstrate usage.

---

### 3. Generate Translations

After configuring your errors, run:

```bash
npx multi-lang-errors generate
```

This will generate all translations in `src/errors/errors.js` and prepare the bridge file `index.js`.

---

### 4. Explore the Demo App

Open `test-app/src/App.jsx`:

- See **dynamic language switching**.
- Learn how to use the `useError` hook.
- Try adding new error keys in `multi-lang-errors.config.json` and regenerating.

---

### 5. Next Steps

- Check `multi-lang-errors/README.md` for **full package documentation**.
- Modify or extend the package if needed.
- Integrate `multi-lang-errors` in your own React projects.

---

### 6. License

MIT License © 2026

---

**Tip:** Start by reading `multi-lang-errors/README.md` for detailed instructions on using the package, CLI commands, and hook usage.

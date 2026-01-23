# Next.js + Lingo.dev i18n Starter

A minimal **Next.js App Router starter** demonstrating how to build
language-based routes like `/en`, `/hi`, `/es` and automatically generate
translations using **Lingo.dev CLI**.

This project is intended for learning and as a boilerplate for developers
who want to quickly add internationalization (i18n) to their apps using
Lingo.dev.

---

## ✨ Features

- 🌍 Language-based routing using App Router (`/en`, `/hi`, `/es`)
- 🔁 Language switcher component
- 📦 JSON-based translation dictionaries
- 🤖 Auto-translation using Lingo.dev CLI
- 🧩 Clean and minimal starter structure

---

## ✅ Prerequisites

- Node.js 18+ (recommended: Node.js 20+)
- npm or pnpm
- Lingo.dev account (for CLI login)

---

## 🚀 Run Locally

From the repository root:

```bash
cd community/nextjs-lingo-i18n-starter
npm install
npm run dev
```

## Translation Workflow (Lingo.dev)

This starter uses JSON translation buckets powered by Lingo.dev.

1) Login to Lingo.dev
npx lingo.dev@latest login

2) Generate translations
npx lingo.dev@latest run


This command translates src/locales/en.json into:
```bash
src/locales/hi.json
src/locales/es.json
```

## Adding a New Language

Add the language code to i18n.json

Create a new locale file:
```bash
touch src/locales/fr.json
```

Run translations again:

```bash
npx lingo.dev@latest run
```

---
Notes

src/locales/en.json is the source language file

UI text is accessed using t(lang, key) helper

This project is meant for educational/demo purposes

---
📜 License & Disclaimer

This project lives inside the community/ directory and is maintained
by the contributor. It is not part of the core Lingo.dev product codebase.



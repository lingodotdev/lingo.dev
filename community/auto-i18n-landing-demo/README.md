# AI Auto Localization Demo (Lingo.dev)

This is a simple demo application that showcases how **Lingo.dev** can be used to localize a product UI into multiple languages using a single source of truth.

The project demonstrates a real-world localization workflow for developers building global products.

---

## 🚀 What This App Does

- Displays a landing page UI
- Allows switching between multiple languages at runtime
- Uses one English source file (`en.json`)
- Shows dynamic placeholders like user name and trial duration
- Demonstrates brand-aware, context-friendly translations

---

## 🌍 Languages Supported

- English (source)
- Hindi
- French
- Spanish
- Japanese

---

## 🧠 Lingo.dev Features Highlighted

- **AI-powered localization**
- **Single source of truth (sourceLocale = en)**
- **Context-aware translations**
- **Dynamic placeholders (`{{name}}`, `{{days}}`)**
- **Brand tone & translation instructions**
- **Developer-friendly localization workflow**

> In a production setup, Lingo.dev would automatically generate and update locale files whenever the source language changes.

---

## ▶️ How to Run Locally

Since this is a static demo, no build step is required.

### Option 1: Using a local server (recommended)
```bash
npx serve

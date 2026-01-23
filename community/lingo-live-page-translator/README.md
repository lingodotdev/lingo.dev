# 🌐 Lingo Live Page Translator (Chrome Extension)

A Chrome Extension that translates any webpage **in-place** (directly on the page) using **Lingo.dev’s SDK**.  
It works on normal websites and modern dynamic apps (React / Vue / Angular), making it easy to browse content in your preferred language.

---

## ✨ What This App Does

This extension allows you to:

- 🌍 **Translate the entire webpage instantly** into a selected language
- 🧠 Use **AI-powered translations** via **Lingo.dev SDK**
- ⚡ Translate text in **batches** for faster performance
- ♻️ **Restore original content** anytime without refreshing the page
- 🔐 Keep your **API key secure** (translation runs in the background service worker)

---

## 🧩 How It Works (High-Level)

### Translation Flow
1. You click **Translate** from the extension popup
2. `content-script.js` extracts visible text from the page
3. It sends text batches to `background.js`
4. `background.js` uses **Lingo.dev SDK** to translate
5. Translated text is returned and applied back to the page

---

## 🚀 How to Run Locally

### ✅ Prerequisites
- Google Chrome (Manifest V3 supported)
- Node.js (v18+ recommended)
- A Lingo.dev API key  
  Get it from: https://lingo.dev

---

### 📦 1) Install Dependencies
```bash
npm install


🔑 2) Add Your Lingo.dev API Key

Open:

src/background.js


Find:

const LINGO_API_KEY = "YOUR_LINGO_API_KEY";


Replace it with your real key:

const LINGO_API_KEY = "lingo_xxxxxxxxxxxxxxxxxxxxx";



🏗️ 3) Build the Extension
npm run build


After building, a new folder will be created:

dist/


🧩 4) Load into Chrome

Open: chrome://extensions

Enable Developer Mode (top right)

Click Load unpacked

Select the dist/ folder

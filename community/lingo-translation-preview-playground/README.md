# 🌍 Lingo Translation Preview Playground

A lightweight web app to **preview how English text translates into multiple languages side-by-side**, powered by the **Lingo.dev Engine**.

Perfect for frontend engineers, designers, and localization teams who want to quickly see how copy behaves across languages.

---

## ✨ Why ?

Localization is more than just translation — it’s about **layout safety** and **UX resilience**.

This playground helps you:

- 🔍 **Visualize text expansion**  
  (e.g. German strings often grow ~30%)
- 🧪 **Test UI robustness** against long or short translations
- ⚡ **Preview translations instantly** without a full i18n pipeline

All using the fast and reliable **Lingo.dev Engine**.

---

## 🚀 Features

- 🌐 **Multi-language Preview**  
  Translate English text into multiple languages at once.

- 📏 **Character Count & Difference**  
  See exact character counts and percentage growth/shrink per language.

- 🧼 **Clean, Focused UI**  
  No clutter — built purely for comparison and inspection.

- 🌙 **Dark / Light Mode**  
  Toggle themes seamlessly.

---

## 🧑💻 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Translation Engine**: Lingo.dev sdk

---

## 🛠️ Running Locally

### 1️⃣ Clone the repository

```bash
git clone <repo-url>
```

### 2️⃣ Navigate to the project

```bash
cd community/lingo-translation-preview-playground
```

### 3️⃣ Install dependencies

```bash
pnpm install
```

### 4️⃣ Configure environment variables

Create a `.env.local` file in the project root:

```bash
LINGO_API_KEY=your_lingo_api_key_here
```

You can get an API key by signing up at
👉 https://lingo.dev

### 5️⃣ Start the development server

```bash
pnpm dev
```

### 6️⃣ Open the app

Visit 👉 http://localhost:3000

---

## 🧪 Example Use Cases

- Checking how text behaves in different languages
- Verifying UI spacing for different languages
- Previewing translations before committing to localization

---

## 📎 Powered By

- **Lingo.dev** — Modern translation infrastructure for developers.

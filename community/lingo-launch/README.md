# 🌍 LingoLaunch

**Build once. Launch everywhere.**

LingoLaunch is a multilingual page builder that allows users to create landing, pricing, and about pages in a single source language and automatically generate translations using **Lingo.dev**.

This project demonstrates how localization can be automated in modern web applications using Next.js and Lingo CLI.

---

## 🚀 Features

* 📝 Create page content in English
* ⚡ Automatically generate translations (FR, HI, etc.)
* 🌎 Switch languages instantly in preview
* 🔄 Automated translation pipeline via Lingo CLI
* 🧱 Built with Next.js App Router

---

## 🛠 Tech Stack

* **Next.js (App Router)**
* **TypeScript**
* **Lingo.dev CLI**
* **Tailwind CSS**
* Node.js File System API

---

## 📂 Project Structure

```
lingo-launch/
│
├── app/
│   ├── dashboard/              # Dashboard UI
│   ├── editor/[pageId]/        # Page editor
│   ├── preview/[pageId]/       # Localized preview
│   └── api/save-and-compile/   # Save + run Lingo
│
├── public/
│   └── locales/                # Generated translation files
│
├── lingo.config.ts             # Lingo configuration
└── README.md
```

---

## ⚙️ How It Works

### 1️⃣ User Writes Content

User creates or edits a page at:

```
/editor/{pageId}
```

Example:

```
/editor/landing
```

They write content in English only.

---

### 2️⃣ Save & Generate

When the user clicks **Save & Generate**:

* The app creates:

```
public/locales/{pageId}/en.json
```

* Then runs:

```
lingo compile
```

* Lingo automatically generates:

```
fr.json
hi.json
```

---

### 3️⃣ Preview

The localized page can be viewed at:

```
/preview/{pageId}
```

Users can switch languages instantly.

---

## 🧠 Why This Project Matters

Traditional localization requires:

* Manual translation
* Large JSON management
* Developer overhead

LingoLaunch automates the entire pipeline.

This demonstrates:

* Automated i18n workflows
* Dynamic content localization
* CLI-based translation integration
* Clean separation between content and presentation

---

## 🏃 Running the Project

### 1. Install dependencies

```bash
pnpm install
```

or

```bash
npm install
```

---

### 2. Install Lingo CLI (if not already)

```bash
pnpm dlx lingo compile
```

or

```bash
npx lingo compile
```

---

### 3. Start development server

```bash
pnpm dev
```

---

### 4. Test Flow

1. Go to `/dashboard`
2. Open `/editor/landing`
3. Enter title + description
4. Click **Save & Generate**
5. Open `/preview/landing`
6. Switch languages

---

## 🌟 Demo Flow for Judges

> “We allow users to create content in one language and automatically generate localized versions using Lingo.dev. This eliminates manual translation overhead and makes global launch instant.”

---

## 📌 Future Improvements

* 🔐 Authentication
* 🗄 Database integration (Supabase)
* 📦 Page templates
* 🧩 Component-based page builder
* 🌍 Auto language detection
* ☁️ Cloud-based compile pipeline

---

## 🏆 Hackathon Focus

This MVP focuses on:

* Working automation
* Clean architecture
* Clear user flow
* Practical use of Lingo CLI
* Real-world localization pipeline

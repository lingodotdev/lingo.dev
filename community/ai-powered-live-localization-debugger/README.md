# 🧠 AI-Powered Live Localization Debugger  
### Powered by **Lingo.dev**

An interactive **developer-focused dashboard** that analyzes source code and translation files to detect common localization and internationalization issues — with **AI-generated suggestions powered by Lingo.dev**.

This project demonstrates how **Lingo.dev’s JavaScript SDK** can be used for **real-time, on-demand localization intelligence**, instead of traditional static file translation.

---

## ✨ What This Project Does

This tool helps developers answer a very common question:

> **“Is my app properly localized — and how can AI help me fix it?”**

The dashboard provides a simple but powerful workflow for auditing localization quality during development.

---

## 🖥️ How the Dashboard Works

Users can:

- 📄 Paste **source code** (e.g. React / JSX)
- 🌐 Paste **source language translations** (JSON)
- 🌍 Paste **target language translations** (JSON)
- ▶️ Click **Analyze with AI**

---

## 🔍 What the System Analyzes

Once the analysis is triggered, the system automatically:

- ❌ Detects **missing translation keys**
- 🧹 Detects **unused translation keys**
- 🚨 Detects **hardcoded UI strings** in source code
- 🧠 Flags **potential semantic inconsistencies** between languages
- 🤖 Uses **Lingo.dev SDK** to generate:
  - Missing translations
  - AI-assisted semantic improvement suggestions

All results are displayed instantly in a **clean, professional, dark-mode UI** designed for developers.

---

## 🚀 Why This Project Uses Lingo.dev SDK (Not CLI)

| Tool | Best Use Case |
|----|----|
| **Lingo.dev CLI** | Static file localization |
| **Lingo.dev SDK** | Dynamic, runtime analysis |

This project specifically showcases:

- ⚡ On-demand AI translation
- 🧠 Runtime semantic checks
- 🛠️ Developer-facing localization tooling

👉 Because this tool analyzes **user-pasted, changing content at runtime**, the **SDK is the correct and intentional choice**.

---

## 🧩 Key Features

- 🔍 **Missing Translation Detection**
- 🧹 **Unused Key Detection**
- 🚨 **Hardcoded String Detection**
- 🧠 **Semantic Consistency Analysis**
- 🤖 **AI-Generated Translation Suggestions**
- 🛡️ **Graceful fallback if AI service is unavailable**
- 🌙 **Professional dark-mode UI**
- 📱 **Fully responsive layout**

---

## 📸 Screenshots

### Main Dashboard
![Main Dashboard](./public/dashboard.png)


## 🛠️ Prerequisites

Before running this project locally, make sure you have the following installed and configured:

### ✅ 1️⃣ Node.js
- **Node.js v18 or later** is recommended
- Verify your Node.js version by running:
  ```bash
  node -v

2️⃣ npm

npm comes bundled with Node.js

Verify npm installation:
```bash
npm -v

3️⃣ Lingo.dev API Key

An API key is required to enable AI-powered translations

Get your API key from:
👉 https://lingo.dev

```
## 🔐 Environment Variables

To securely configure your API key:

Create a file named:
.env.local

Place it at the project root

Add the following line:

LINGODOTDEV_API_KEY=your_lingo_dev_api_key_here

## Important Notes

❌ Do not commit .env.local to version control

🔁 Restart the development server after adding or updating this file


## ▶️ How to Run Locally (Step-by-Step)

Follow these steps to run the project on your machine:

1️⃣ Clone the Repository

git clone https://github.com/lingo-dev/lingo.dev.git

2️⃣ Navigate to the Community Project

cd lingo.dev/community/ai-powered-live-localization-debugger

3️⃣ Install Dependencies

npm install

4️⃣ Start the Development Server

npm run dev

5️⃣ Open the Application

Open your browser and visit:

http://localhost:3000

You should now see the AI Localization Debugger dashboard

## 🧪 How to Test the App (Example)

Use the following example inputs to verify functionality:
📄 Source Code

<button>Test</button>

🌐 Source Language (EN)

{
  "login.title": "Login",
  "login.button": "Sign In"
}

🌍 Target Language (FR)

{
  "login.title": "Connexion"
}

## ✅ Expected Results

🔍 Missing translation detected: login.button

🚨 Hardcoded UI string detected: "Test"

🤖 AI-generated translation suggestion for login.button

🧠 Semantic consistency feedback for login.title

## 🧠 How Semantic Checks Work (Important Note)

Semantic consistency is evaluated using an AI-assisted heuristic:

🔁 The target translation is back-translated

🔍 Meaning is compared with the source text

⚠️ Potential mismatches are flagged for human review

This process is advisory, not absolute — which is intentional and ideal for developer tooling.

## 🛡️ Error Handling & Fallbacks

The application is designed to be stable and reviewer-friendly:

✅ If the Lingo.dev API is unavailable:

The app does not crash

A safe fallback message is displayed

❌ Invalid JSON input is detected and reported clearly

⚠️ Empty input is validated before analysis begins

## 🏗️ Project Structure (High Level)

app/
 ├─ api/analyze/route.ts   → Orchestrates analysis and AI calls
 ├─ page.tsx               → Main dashboard UI
 └─ layout.tsx             → App shell and layout

lib/
 ├─ analyzer/              → Pure localization analysis logic
 └─ lingo/                 → Lingo.dev SDK integration layer

components/
 ├─ InputPanel             → User input area
 ├─ IssuesPanel            → Detected localization issues
 ├─ SuggestionsPanel       → AI-generated suggestions
 └─ LoadingState           → Analysis loading indicator

## 🎯 Why This Demo Is Useful

This project demonstrates how Lingo.dev can be used for:

🛠️ Developer-facing tooling

🔍 Localization quality assurance (QA)

⚡ Runtime translation analysis

🤖 AI-assisted internationalization (i18n) workflows

This is a realistic production-inspired use case, not a toy example.

## 🏁 Final Notes

📌 Built as a community demo for Lingo.dev

🧩 Clean architecture with strong separation of concerns

🎨 UI and logic are intentionally simple, readable, and extensible

## 👤 Author

Made by: Krishna Sahu
📧 Email: krishna.sahu.work@gmail.com
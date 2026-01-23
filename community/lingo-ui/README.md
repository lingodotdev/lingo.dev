# LingoUI Demo — React Wrapper on top of Lingo.dev

This project is a **demo application** that showcases how a simple React wrapper can be built on top of the **Lingo.dev JavaScript SDK** to localize UI text without managing JSON files or translation keys.

Instead of traditional i18n setups, text is translated dynamically by wrapping UI content in a `<Translate>` component and controlling the language via a global provider.

This repository is intended as a **community contribution and educational example**, not a published library.

---

## 🎯 What This Demo Shows

- How to build a React Context wrapper around the Lingo.dev JS SDK
- How UI text can be localized by wrapping components
- How language switching can be handled globally
- How to safely handle API limits and fallback behavior
- A realistic integration pattern for Next.js (App Router)

---

## 🛠 Tech Stack

- React
- Next.js (App Router)
- Lingo.dev JavaScript SDK
- TypeScript
- React Context API

---

## 🚀 Getting Started (Run Locally)

### 1. Clone the repository
```bash
git clone <repo-url>
cd <project-folder>
```

### 2. Install dependencies
```bash
bun install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:
```env
LINGODOTDEV_API_KEY=your_lingo_dev_api_key
```

The API key is only used on the server via a Next.js API route.

### 4. Start the development server
```bash
npm run dev
```

Then open:
```
http://localhost:3000
```

---

## 🧪 How to Test the Demo

1. Open the app in the browser
2. Use the language switcher in the UI (e.g. EN → ES)
3. Wrapped text components will attempt to translate automatically
4. Switching languages re-renders the UI dynamically

All translatable UI text is wrapped using the `<Translate>` component.

---

## 🔄 API Limits & Demo Behavior

This demo uses the Lingo.dev free plan.

Once the free translation quota is exhausted:

- The backend safely falls back to the original text
- The UI continues to function without errors or crashes
- Language switching still works logically

This behavior is intentional and demonstrates how applications can gracefully handle real-world API limits.

---

## 📁 Project Structure (Simplified)
```
src/
├── app/
│   ├── api/translate/route.ts   # Server-side Lingo.dev integration
│   └── page.tsx                 # Demo UI
├── lingo-ui/
│   ├── provider.tsx             # Lingo context & state
│   ├── Translate.tsx            # Translate wrapper component
│   ├── LanguageSwitcher.tsx     # Language selector
│   └── hooks.ts                 # Context hook
```

---

## ⚠️ Disclaimer

- This project is a demo / example, not a production-ready library
- The code is meant for learning and experimentation
- API limits depend on your Lingo.dev plan

---

## 📄 License

This project is contributed under the same license as the main Lingo.dev repository.

---

## 🙌 Acknowledgements

Built as a community contribution to demonstrate how developers can create higher-level abstractions on top of the Lingo.dev JavaScript SDK for improved developer experience.
# Lingo.dev Todo App - Multilingual Demo

A simple, beautiful todo app that's **fully multilingual** thanks to Lingo.dev compiler!

## 🌍 Features

- ✅ Add, complete, and delete todos
- 🌐 Automatic multilingual support (5 languages)
- ⚡ Language switching in real-time
- 💅 Modern dark theme UI
- 📱 Fully responsive design

## 🎯 Supported Languages

- 🇺🇸 English
- 🇪🇸 Spanish (Español)
- 🇫🇷 French (Français)
- 🇩🇪 German (Deutsch)
- 🇯🇵 Japanese (日本語)

## 🚀 How to Run

1. **Install dependencies:**

   ```bash
   cd community/lingo-todo-app
   pnpm install
   ```

2. **Start development server:**

   ```bash
   pnpm dev
   ```

3. **Open in browser:**
   Navigate to http://localhost:3000

4. **Switch languages:**
   Click the language switcher in the header to see everything translate instantly!

## 🔧 How Lingo.dev Works Here

This app demonstrates **zero-code translations**:

- Write your app in English
- Lingo.dev compiler automatically translates everything
- Switch languages with `<LocaleSwitcher />` component
- **No translation files, no translation keys, no manual translations!**

The magic is in the `vite.config.ts`:

```typescript
lingoCompilerPlugin({
  sourceLocale: "en",
  targetLocales: ["es", "fr", "de", "ja"],
  models: "lingo.dev",
  dev: { usePseudotranslator: true },
});
```

## 📦 Technologies

- React 19
- TypeScript
- Vite
- Lingo.dev Compiler
- Lucide Icons
- CSS3

## 🎓 Learn More

- [Lingo.dev Documentation](https://lingo.dev)
- [Compiler Guide](https://lingo.dev/compiler)
- [Discord Community](https://lingo.dev/go/discord)

---

**Made for the Lingo.dev Community Swag Campaign** 🎉

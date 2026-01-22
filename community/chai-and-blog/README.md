# ☕ Chai & Blog

A multilingual blogging platform for cohort students, powered by Lingo.dev Compiler.

## 🌐 Live Demo

**[https://www.chaiand.blog](https://www.chaiand.blog)**

## 📦 GitHub Repository

**[https://github.com/YEDASAVG/chai_and_blog](https://github.com/YEDASAVG/chai_and_blog)**

## 🌍 Lingo.dev Integration

| Feature          | Implementation              |
| ---------------- | --------------------------- |
| **Languages**    | 21 (en + 20 target locales) |
| **Translations** | 162 entries auto-translated |
| **Package**      | `@lingo.dev/compiler/next`  |
| **Model**        | `lingo.dev` Engine          |

### How I Used Lingo.dev Compiler

1. **Wrapped Next.js config** with `withLingo()`
2. **Added `LingoProvider`** to root layout
3. **Built language switcher** using `useLingoContext()`
4. **Zero manual translations** - all auto-generated at build time!

```typescript
// next.config.ts
export default async function () {
  return await withLingo(baseConfig, {
    sourceLocale: "en",
    targetLocales: ["es", "fr", "de", "hi", "ja", "zh", "ko", "ar", ...],
    models: "lingo.dev",
  });
}
```

## 🔧 Lingo.dev Tools Used

### ✅ Lingo.dev Compiler (Primary)

Used `@lingo.dev/compiler/next` for automatic build-time translations.

| Component             | Usage                                |
| --------------------- | ------------------------------------ |
| `withLingo()`         | Next.js config wrapper               |
| `LingoProvider`       | React context provider               |
| `useLingoContext()`   | Language switching hook              |
| `data-lingo-skip`     | Skip non-translatable elements       |
| `models: "lingo.dev"` | Lingo.dev Engine for AI translations |

## ✨ Features

- 📝 Medium-like rich text editor (Tiptap)
- 🔐 GitHub & Google OAuth (Clerk)
- 🌍 21 language support with one-click switching
- 📱 Fully responsive design
- 🚀 Live on Vercel

## 🛠️ Tech Stack

- Next.js 16.1.3 (Turbopack)
- Lingo.dev Compiler
- MongoDB Atlas
- Clerk Authentication
- Tailwind CSS + shadcn/ui

## 👤 Author

**Abhiraj Damodare**

- GitHub: [@YEDASAVG](https://github.com/YEDASAVG)

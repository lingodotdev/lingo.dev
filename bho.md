# Lingo.dev

[English](../README.md) | [Español](./es.md) | [Français](./fr.md) | [Deutsch](./de.md) | **भोजपुरी**

---

## का बा Lingo.dev?

Lingo.dev एगो ओपन-सोर्स, AI-पावर्ड i18n CLI टूल बा जेवन वेब आ मोबाइल एप्लिकेशन के स्थानीयकरण खातिर बनावल गइल बा।

## विशेषता

- 🤖 **AI-संचालित अनुवाद**: उन्नत भाषा मॉडल के इस्तेमाल करत स्वचालित अनुवाद
- ⚡ **तेज़ आ कुशल**: कैश के साथ अनुकूलित प्रदर्शन
- 🌍 **कई भाषा समर्थन**: 100+ भाषा में अनुवाद करीं
- 🔧 **फ्रेमवर्क एकीकरण**: Next.js, Vite, React Router, आ अउरी के साथ सहज रूप से काम करेला
- 📦 **सरल सेटअप**: मिनट में शुरू हो जाईं

## इंस्टॉलेशन

```bash
npm install -g lingo.dev
```

## जल्दी शुरुआत

### 1. प्रमाणीकरण

```bash
npx lingo.dev login
```

### 2. परियोजना शुरू करीं

```bash
npx lingo.dev init
```

### 3. अनुवाद निकालीं

```bash
npx lingo.dev extract
```

### 4. अनुवाद अपलोड करीं

```bash
npx lingo.dev push
```

### 5. अनुवाद डाउनलोड करीं

```bash
npx lingo.dev pull
```

## कंपाइलर एकीकरण

### Next.js

```typescript
import lingoCompiler from "lingo.dev/compiler";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default lingoCompiler.next({
  sourceRoot: "app",
  models: "lingo.dev",
})(nextConfig);
```

### Vite

```typescript
import { defineConfig, type UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import lingoCompiler from "lingo.dev/compiler";

const viteConfig: UserConfig = {
  plugins: [react()],
};

export default defineConfig(() =>
  lingoCompiler.vite({
    models: "lingo.dev",
  })(viteConfig)
);
```

## दस्तावेज़

पूरा दस्तावेज़ खातिर जाईं: [https://lingo.dev/docs](https://lingo.dev/docs)

## समुदाय

- 📚 **दस्तावेज़**: [https://lingo.dev/go/docs](https://lingo.dev/go/docs)
- ⭐ **GitHub**: [https://lingo.dev/go/gh](https://lingo.dev/go/gh)
- 🎮 **Discord**: [https://lingo.dev/go/discord](https://lingo.dev/go/discord)

## योगदान

हमनी के योगदान के स्वागत बा! कृपया हमार [योगदान गाइड](../CONTRIBUTING.md) देखीं।

## लाइसेंस

MIT लाइसेंस के तहत लाइसेंस प्राप्त - विवरण खातिर [LICENSE](../LICENSE) फाइल देखीं।

## समर्थन

का सवाल बा? हमसे जुड़ीं:

- [Discord समुदाय](https://lingo.dev/go/discord)
- [GitHub Issues](https://github.com/lingodotdev/lingo.dev/issues)
- [दस्तावेज़](https://lingo.dev/docs)

---

**Lingo.dev** के साथ बनावल गइल ❤️

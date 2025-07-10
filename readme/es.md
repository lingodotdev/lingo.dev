<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png"
      width="100%"
      alt="Lingo.dev"
    />
  </a>
</p>

<p align="center">
  <strong>
    ⚡ Lingo.dev - kit de herramientas de i18n de código abierto, potenciado por
    IA para localización instantánea con LLMs.
  </strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">Lingo.dev Compiler</a> •
  <a href="https://lingo.dev/cli">Lingo.dev CLI</a> •
  <a href="https://lingo.dev/ci">Lingo.dev CI/CD</a> •
  <a href="https://lingo.dev/sdk">Lingo.dev SDK</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img
      src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg"
      alt="Lanzamiento"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="Licencia"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="Último commit"
    />
  </a>
</p>

---

## Conoce el Compiler 🆕

**Lingo.dev Compiler** es un middleware compilador gratuito y de código abierto, diseñado para hacer que cualquier aplicación React sea multilingüe durante el tiempo de compilación sin requerir cambios en los componentes React existentes.

Instalar una vez:

```bash
npm install lingo.dev
```

Habilitar en tu configuración de compilación:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

Ejecuta `next build` y observa cómo aparecen los paquetes en español y francés ✨

[Lee la documentación →](https://lingo.dev/compiler) para la guía completa, y [Únete a nuestro Discord](https://lingo.dev/go/discord) para obtener ayuda con tu configuración.

---

### ¿Qué hay dentro de este repositorio?

| Herramienta  | Resumen                                                                                      | Documentación                           |
| ------------ | -------------------------------------------------------------------------------------------- | --------------------------------------- |
| **Compiler** | Localización de React en tiempo de compilación                                               | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | Localización con un solo comando para aplicaciones web y móviles, JSON, YAML, markdown y más | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | Auto-commit de traducciones en cada push + creación de pull requests si es necesario         | [/ci](https://lingo.dev/ci)             |
| **SDK**      | Traducción en tiempo real para contenido generado por usuarios                               | [/sdk](https://lingo.dev/sdk)           |

A continuación, los aspectos más destacados de cada uno 👇

---

### ⚡️ Lingo.dev CLI

Traduce código y contenido directamente desde tu terminal.

```bash
npx lingo.dev@latest run
```

Genera huellas digitales de cada cadena, almacena resultados en caché y solo retraduce lo que ha cambiado.

[Sigue la documentación →](https://lingo.dev/cli) para aprender cómo configurarlo.

---

### 🔄 Lingo.dev CI/CD

Entrega traducciones perfectas automáticamente.

```yaml
# .github/workflows/i18n.yml
name: Lingo.dev i18n
on: [push]

jobs:
  i18n:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: lingodotdev/lingo.dev@main
        with:
          api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

Mantiene tu repositorio actualizado y tu producto multilingüe sin pasos manuales.

[Lee la documentación →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

Traducción instantánea por solicitud para contenido dinámico.

```ts
import { LingoDotDevEngine } from "lingo.dev/sdk";

const lingoDotDev = new LingoDotDevEngine({
  apiKey: "your-api-key-here",
});

const content = {
  greeting: "Hello",
  farewell: "Goodbye",
  message: "Welcome to our platform",
};

const translated = await lingoDotDev.localizeObject(content, {
  sourceLocale: "en",
  targetLocale: "es",
});
// Returns: { greeting: "Hola", farewell: "Adiós", message: "Bienvenido a nuestra plataforma" }
```

Perfecto para chat, comentarios de usuarios y otros flujos en tiempo real.

[Leer la documentación →](https://lingo.dev/sdk)

---

## 🤝 Comunidad

Somos impulsados por la comunidad y nos encantan las contribuciones!

- ¿Tienes una idea? [Abre un issue](https://github.com/lingodotdev/lingo.dev/issues)
- ¿Quieres arreglar algo? [Envía un PR](https://github.com/lingodotdev/lingo.dev/pulls)
- ¿Necesitas ayuda? [Únete a nuestro Discord](https://lingo.dev/go/discord)

## ⭐ Historial de estrellas

Si te gusta lo que estamos haciendo, danos una ⭐ y ayúdanos a alcanzar 3,000 estrellas! 🌟

[

![Gráfico de historial de estrellas](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 Readme en otros idiomas

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

¿No ves tu idioma? ¡Agrégalo a [`i18n.json`](./i18n.json) y abre un PR!

<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev"
    />
  </a>
</p>

<p align="center">
  <strong>
    Lingo.dev - Kit de herramientas i18n de código abierto para localización
    impulsada por LLM
  </strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-mcp">MCP</a> •<a href="#lingodev-cli">CLI</a> •
  <a href="#lingodev-cicd">CI/CD</a> •<a href="#lingodev-sdk">SDK</a> •
  <a href="#lingodev-compiler">Compilador</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img
      src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg"
      alt="Release"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="License"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="Last Commit"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 DevTool of the Month"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 DevTool of the Week"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #2 Product of the Day"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square"
      alt="Github trending"
    />
  </a>
</p>

---

## Inicio rápido

| Herramienta                        | Caso de uso                                                   | Comando rápido                     |
| ---------------------------------- | ------------------------------------------------------------- | ---------------------------------- |
| [**MCP**](#lingodev-mcp)           | Configuración i18n asistida por IA para apps React            | Prompt: `Set up i18n`              |
| [**CLI**](#lingodev-cli)           | Traducir archivos JSON, YAML, markdown, CSV, PO               | `npx lingo.dev@latest run`         |
| [**CI/CD**](#lingodev-cicd)        | Pipeline de traducción automatizado en GitHub Actions         | `uses: lingodotdev/lingo.dev@main` |
| [**SDK**](#lingodev-sdk)           | Traducción en tiempo de ejecución para contenido dinámico     | `npm install lingo.dev`            |
| [**Compiler**](#lingodev-compiler) | Localización React en tiempo de compilación sin wrappers i18n | Plugin `withLingo()`               |

---

### Lingo.dev MCP

Configurar i18n en aplicaciones React es notoriamente propenso a errores, incluso para desarrolladores experimentados. Los asistentes de codificación con IA lo empeoran: alucinan APIs inexistentes, olvidan configuraciones de middleware, rompen el enrutamiento o implementan media solución antes de perderse. El problema es que la configuración de i18n requiere una secuencia precisa de cambios coordinados en múltiples archivos (enrutamiento, middleware, componentes, configuración), y los LLM tienen dificultades para mantener ese contexto.

Lingo.dev MCP resuelve esto dando a los asistentes de IA acceso estructurado al conocimiento de i18n específico del framework. En lugar de adivinar, tu asistente sigue patrones de implementación verificados para Next.js, React Router y TanStack Start.

**IDEs compatibles:**

- Claude Code
- Cursor
- GitHub Copilot Agents
- Codex (OpenAI)

**Frameworks compatibles:**

- Next.js (App Router y Pages Router v13-16)
- TanStack Start (v1)
- React Router (v7)

**Uso:**

Después de configurar el servidor MCP en tu IDE ([ver guías de inicio rápido](https://lingo.dev/en/mcp)), solicita a tu asistente:

```
Set up i18n with the following locales: en, es, and pt-BR. The default locale is 'en'.
```

El asistente:

1. Configurará el enrutamiento basado en locale (ej., `/en`, `/es`, `/pt-BR`)
2. Configurará componentes de cambio de idioma
3. Implementará detección automática de locale
4. Generará los archivos de configuración necesarios

**Nota:** La generación de código asistida por IA es no determinista. Revisa el código generado antes de hacer commit.

[Leer la documentación →](https://lingo.dev/en/mcp)

---

### CLI de Lingo.dev

Mantener las traducciones sincronizadas es tedioso. Añades una nueva cadena, olvidas traducirla, envías una interfaz rota a usuarios internacionales. O envías archivos JSON a traductores, esperas días y luego fusionas manualmente su trabajo. Escalar a más de 10 idiomas significa gestionar cientos de archivos que constantemente se dessincronizan.

El CLI de Lingo.dev automatiza esto. Apúntalo a tus archivos de traducción, ejecuta un comando y cada locale se actualiza. Un archivo de bloqueo rastrea lo que ya está traducido, por lo que solo pagas por contenido nuevo o modificado. Compatible con archivos JSON, YAML, CSV, PO y markdown.

**Configuración:**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**Cómo funciona:**

1. Extrae el contenido traducible de los archivos configurados
2. Envía el contenido al proveedor de LLM para su traducción
3. Escribe el contenido traducido de vuelta al sistema de archivos
4. Crea el archivo `i18n.lock` para rastrear las traducciones completadas (evita el procesamiento redundante)

**Configuración:**

El comando `init` genera un archivo `i18n.json`. Configura los idiomas y buckets:

```json
{
  "$schema": "https://lingo.dev/schema/i18n.json",
  "version": "1.10",
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  },
  "buckets": {
    "json": {
      "include": ["locales/[locale].json"]
    }
  }
}
```

El campo `provider` es opcional (por defecto usa Lingo.dev Engine). Para proveedores de LLM personalizados:

```json
{
  "provider": {
    "id": "openai",
    "model": "gpt-4o-mini",
    "prompt": "Translate from {source} to {target}"
  }
}
```

**Proveedores de LLM compatibles:**

- Lingo.dev Engine (recomendado)
- OpenAI
- Anthropic
- Google
- Mistral
- OpenRouter
- Ollama

[Leer la documentación →](https://lingo.dev/en/cli)

---

### Lingo.dev CI/CD

Las traducciones son la funcionalidad que siempre está "casi lista". Los ingenieros fusionan código sin actualizar los idiomas. QA detecta traducciones faltantes en staging, o peor aún, los usuarios las detectan en producción. La causa raíz: la traducción es un paso manual que es fácil omitir bajo presión de plazos.

Lingo.dev CI/CD hace que las traducciones sean automáticas. Cada push activa la traducción. Las cadenas faltantes se completan antes de que el código llegue a producción. No se requiere disciplina: el pipeline se encarga de ello.

**Plataformas compatibles:**

- GitHub Actions
- GitLab CI/CD
- Bitbucket Pipelines

**Configuración de GitHub Actions:**

Crea `.github/workflows/translate.yml`:

```yaml
name: Translate
on:
  push:
    branches: [main]
permissions:
  contents: write
jobs:
  translate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Lingo.dev
        uses: lingodotdev/lingo.dev@main
        with:
          api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

**Requisitos de configuración:**

1. Añade `LINGODOTDEV_API_KEY` a los secretos del repositorio (Settings > Secrets and variables > Actions)
2. Para flujos de trabajo de PR: habilita "Allow GitHub Actions to create and approve pull requests" en Settings > Actions > General

**Opciones de flujo de trabajo:**

Confirmar traducciones directamente:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

Crea pull requests con traducciones:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
  pull-request: true
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Entradas disponibles:**

| Entrada              | Predeterminado                                 | Descripción                                 |
| -------------------- | ---------------------------------------------- | ------------------------------------------- |
| `api-key`            | (requerido)                                    | Clave API de Lingo.dev                      |
| `pull-request`       | `false`                                        | Crear PR en lugar de confirmar directamente |
| `commit-message`     | `"feat: update translations via @LingoDotDev"` | Mensaje de confirmación personalizado       |
| `pull-request-title` | `"feat: update translations via @LingoDotDev"` | Título de PR personalizado                  |
| `working-directory`  | `"."`                                          | Directorio en el que ejecutar               |
| `parallel`           | `false`                                        | Habilitar procesamiento paralelo            |

[Consulta la documentación →](https://lingo.dev/en/ci/github)

---

### SDK de Lingo.dev

Los archivos de traducción estáticos funcionan para etiquetas de interfaz, pero ¿qué pasa con el contenido generado por usuarios? Mensajes de chat, descripciones de productos, tickets de soporte: el contenido que no existe en tiempo de compilación no puede ser pretraducido. Te quedas mostrando texto sin traducir o construyendo un pipeline de traducción personalizado.

El SDK de Lingo.dev traduce contenido en tiempo de ejecución. Pasa cualquier texto, objeto o HTML y obtén una versión localizada. Funciona para chat en tiempo real, notificaciones dinámicas o cualquier contenido que llegue después del despliegue. Disponible para JavaScript, PHP, Python y Ruby.

**Instalación:**

```bash
npm install lingo.dev
```

**Uso:**

```ts
import { LingoDotDevEngine } from "lingo.dev/sdk";

const lingoDotDev = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY,
});

// Translate objects (preserves structure)
const translated = await lingoDotDev.localizeObject(
  { greeting: "Hello", farewell: "Goodbye" },
  { sourceLocale: "en", targetLocale: "es" },
);
// { greeting: "Hola", farewell: "Adiós" }

// Translate text
const text = await lingoDotDev.localizeText("Hello!", {
  sourceLocale: "en",
  targetLocale: "fr",
});

// Translate to multiple languages at once
const results = await lingoDotDev.batchLocalizeText("Hello!", {
  sourceLocale: "en",
  targetLocales: ["es", "fr", "de"],
});

// Translate chat (preserves speaker names)
const chat = await lingoDotDev.localizeChat(
  [{ name: "Alice", text: "Hello!" }],
  { sourceLocale: "en", targetLocale: "es" },
);

// Translate HTML (preserves markup)
const html = await lingoDotDev.localizeHtml("<h1>Welcome</h1>", {
  sourceLocale: "en",
  targetLocale: "de",
});

// Detect language
const locale = await lingoDotDev.recognizeLocale("Bonjour le monde");
// "fr"
```

**SDKs disponibles:**

- [SDK de JavaScript](https://lingo.dev/en/sdk/javascript) - Aplicaciones web, Node.js
- [SDK de PHP](https://lingo.dev/en/sdk/php) - PHP, Laravel
- [SDK de Python](https://lingo.dev/en/sdk/python) - Django, Flask
- [SDK de Ruby](https://lingo.dev/en/sdk/ruby) - Rails

[Consulta la documentación →](https://lingo.dev/en/sdk)

---

### Compilador de Lingo.dev

La i18n tradicional es invasiva. Envuelves cada cadena en funciones `t()`, inventas claves de traducción (`home.hero.title.v2`), mantienes archivos JSON paralelos y ves cómo tus componentes se inflan con código repetitivo de localización. Es tan tedioso que los equipos retrasan la internacionalización hasta que se convierte en una refactorización masiva.

Lingo.dev Compiler elimina la ceremonia. Escribe componentes de React con texto en inglés simple. El compilador detecta cadenas traducibles en tiempo de compilación y genera variantes localizadas automáticamente. Sin claves, sin archivos JSON, sin funciones envolventes, solo código React que funciona en múltiples idiomas.

**Instalación:**

```bash
pnpm install @lingo.dev/compiler
```

**Autenticación:**

```bash
# Recommended: Sign up at lingo.dev and login
npx lingo.dev@latest login

# Alternative: Add API key to .env
LINGODOTDEV_API_KEY=your_key_here

# Or use direct LLM providers (Groq, OpenAI, Anthropic, Google)
GROQ_API_KEY=your_key
```

**Configuración (Next.js):**

```ts
// next.config.ts
import type { NextConfig } from "next";
import { withLingo } from "@lingo.dev/compiler/next";

const nextConfig: NextConfig = {};

export default async function (): Promise<NextConfig> {
  return await withLingo(nextConfig, {
    sourceRoot: "./app",
    sourceLocale: "en",
    targetLocales: ["es", "fr", "de"],
    models: "lingo.dev",
    dev: { usePseudotranslator: true },
  });
}
```

**Configuración (Vite):**

```ts
// vite.config.ts
import { lingoCompilerPlugin } from "@lingo.dev/compiler/vite";

export default defineConfig({
  plugins: [
    lingoCompilerPlugin({
      sourceRoot: "src",
      sourceLocale: "en",
      targetLocales: ["es", "fr", "de"],
      models: "lingo.dev",
      dev: { usePseudotranslator: true },
    }),
    react(),
  ],
});
```

**Configuración del proveedor:**

```tsx
// app/layout.tsx (Next.js)
import { LingoProvider } from "@lingo.dev/compiler/react";

export default function RootLayout({ children }) {
  return (
    <LingoProvider>
      <html>
        <body>{children}</body>
      </html>
    </LingoProvider>
  );
}
```

**Selector de idioma:**

```tsx
import { useLocale, setLocale } from "@lingo.dev/compiler/react";

export function LanguageSwitcher() {
  const locale = useLocale();
  return (
    <select value={locale} onChange={(e) => setLocale(e.target.value)}>
      <option value="en">English</option>
      <option value="es">Español</option>
    </select>
  );
}
```

**Desarrollo:** `npm run dev` (usa pseudotraductor, sin llamadas a la API)

**Producción:** Establece `usePseudotranslator: false`, luego `next build`

Confirma el directorio `.lingo/` en el control de versiones.

**Características principales:**

- Cero costo de rendimiento en tiempo de ejecución
- Sin claves de traducción ni archivos JSON
- Sin funciones `t()` ni componentes envolventes `<T>`
- Detección automática de texto traducible en JSX
- Soporte para TypeScript
- ICU MessageFormat para plurales
- Anulaciones manuales mediante el atributo `data-lingo-override`
- Widget de editor de traducción integrado

**Modos de compilación:**

- `pseudotranslator`: Modo de desarrollo con traducciones de marcador de posición (sin costos de API)
- `real`: Genera traducciones reales usando LLMs
- `cache-only`: Modo de producción usando traducciones pregeneradas desde CI (sin llamadas a la API)

**Frameworks compatibles:**

- Next.js (App Router con React Server Components)
- Vite + React (SPA y SSR)

Soporte adicional de frameworks planificado.

[Leer la documentación →](https://lingo.dev/en/compiler)

---

## Contribuir

Las contribuciones son bienvenidas. Por favor, sigue estas directrices:

1. **Issues:** [Reporta errores o solicita funcionalidades](https://github.com/lingodotdev/lingo.dev/issues)
2. **Pull Requests:** [Envía cambios](https://github.com/lingodotdev/lingo.dev/pulls)
   - Cada PR requiere un changeset: `pnpm new` (o `pnpm new:empty` para cambios que no requieren release)
   - Asegúrate de que las pruebas pasen antes de enviar
3. **Desarrollo:** Este es un monorepo de pnpm + turborepo
   - Instala las dependencias: `pnpm install`
   - Ejecuta las pruebas: `pnpm test`
   - Compila: `pnpm build`

**Soporte:** [Comunidad de Discord](https://lingo.dev/go/discord)

## Historial de estrellas

Si encuentras útil Lingo.dev, danos una estrella y ayúdanos a alcanzar las 10 000 estrellas.

[

![Gráfico del historial de estrellas](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## Documentación localizada

**Traducciones disponibles:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**Añadir un nuevo idioma:**

1. Añade el código de locale a [`i18n.json`](./i18n.json) usando el [formato BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
2. Envía un pull request

**Formato de locale BCP-47:** `language[-Script][-REGION]`

- `language`: ISO 639-1/2/3 (minúsculas): `en`, `zh`, `bho`
- `Script`: ISO 15924 (mayúscula inicial): `Hans`, `Hant`, `Latn`
- `REGION`: ISO 3166-1 alpha-2 (mayúsculas): `US`, `CN`, `IN`
- Ejemplos: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`

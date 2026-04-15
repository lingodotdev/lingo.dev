<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – plataforma de ingeniería de localización"
    />
  </a>
</p>

<p align="center">
  <strong>
    Herramientas de ingeniería de localización de código abierto. Conéctese a la
    plataforma de ingeniería de localización Lingo.dev para traducciones
    consistentes y de calidad.
  </strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-api">API de Lingo</a> •
  <a href="#lingodev-mcp">Lingo React MCP</a> •
  <a href="#lingodev-cli">CLI de Lingo</a> •
  <a href="#lingodev-cicd">Acción de GitHub de Lingo</a> •
  <a href="#lingodev-compiler">
    Compilador de Lingo para React (Alfa temprana)
  </a>
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

| Herramienta                                              | Qué hace                                                         | Comando rápido                     |
| -------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------- |
| [**Lingo React MCP**](#lingodev-mcp)                     | Configuración de i18n asistida por IA para apps React            | Prompt: `Set up i18n`              |
| [**CLI de Lingo**](#lingodev-cli)                        | Localiza archivos JSON, YAML, markdown, CSV, PO                  | `npx lingo.dev@latest run`         |
| [**Acción de GitHub de Lingo**](#lingodev-cicd)          | Localización continua en GitHub Actions                          | `uses: lingodotdev/lingo.dev@main` |
| [**Compilador de Lingo para React**](#lingodev-compiler) | Localización de React en tiempo de compilación sin wrappers i18n | Plugin `withLingo()`               |

### Motores de localización

Estas herramientas se conectan a [motores de localización](https://lingo.dev) – APIs de traducción con estado que usted crea en la plataforma de ingeniería de localización Lingo.dev. Cada motor mantiene glosarios, voz de marca e instrucciones por locale en cada solicitud, [reduciendo errores de terminología en un 16,6–44,6%](https://lingo.dev/research/retrieval-augmented-localization). O [traiga su propio LLM](#lingodev-cli).

---

### Lingo.dev MCP

Configurar i18n en aplicaciones React es propenso a errores – incluso los asistentes de código con IA alucinan con APIs inexistentes y rompen el enrutamiento. Lingo.dev MCP proporciona a los asistentes de IA acceso estructurado al conocimiento de i18n específico del framework para Next.js, React Router y TanStack Start. Funciona con Claude Code, Cursor, GitHub Copilot Agents y Codex.

[Leer la documentación →](https://lingo.dev/en/mcp)

---

### CLI de Lingo.dev

Localice archivos JSON, YAML, markdown, CSV y PO en un solo comando. Un archivo de bloqueo rastrea lo que ya está localizado – solo el contenido nuevo o modificado se procesa. Por defecto usa su motor de localización en Lingo.dev, o traiga su propio LLM (OpenAI, Anthropic, Google, Mistral, OpenRouter, Ollama).

```bash
npx lingo.dev@latest init
npx lingo.dev@latest run
```

[Leer la documentación →](https://lingo.dev/en/docs/cli)

---

### Lingo.dev CI/CD

Localización continua en tu pipeline. Cada push activa la localización: las cadenas faltantes se completan antes de que el código llegue a producción. Compatible con GitHub Actions, GitLab CI/CD y Bitbucket Pipelines.

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

[Leer la documentación →](https://lingo.dev/en/docs/integrations)

---

### API de Lingo.dev

Invoca tu motor de localización directamente desde código backend. Localización síncrona y asíncrona con entrega mediante webhook, aislamiento de fallos por locale y progreso en tiempo real vía WebSocket.

[Leer la documentación →](https://lingo.dev/en/docs/api)

---

### Lingo Compiler para React (Alfa temprana)

Localización de React en tiempo de compilación sin wrappers i18n. Escribe componentes con texto en inglés simple: el compilador detecta cadenas traducibles y genera variantes localizadas en tiempo de compilación. Sin claves de traducción, sin archivos JSON, sin funciones `t()`. Compatible con Next.js (App Router) y Vite + React.

[Leer la documentación →](https://lingo.dev/en/docs/react/compiler)

---

## Contribuciones

Las contribuciones son bienvenidas. Por favor, sigue estas directrices:

1. **Issues:** [Reporta errores o solicita funcionalidades](https://github.com/lingodotdev/lingo.dev/issues)
2. **Pull Requests:** [Envía cambios](https://github.com/lingodotdev/lingo.dev/pulls)
   - Cada PR requiere un changeset: `pnpm new` (o `pnpm new:empty` para cambios que no requieren lanzamiento)
   - Asegúrate de que las pruebas pasen antes de enviar
3. **Desarrollo:** Este es un monorepo pnpm + turborepo
   - Instalar dependencias: `pnpm install`
   - Ejecutar pruebas: `pnpm test`
   - Compilar: `pnpm build`

**Soporte:** [Comunidad en Discord](https://lingo.dev/go/discord)

## Historial de Estrellas

Si encuentras útil Lingo.dev, danos una estrella y ayúdanos a alcanzar 10,000 estrellas!

[

![Gráfico del Historial de Estrellas](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## Documentación Localizada

**Traducciones disponibles:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**Añadir un nuevo idioma:**

1. Añada el código de idioma a [`i18n.json`](./i18n.json) usando el [formato BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
2. Envíe una solicitud de pull

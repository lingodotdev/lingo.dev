<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png" width="100%" alt="Lingo.dev – localization engineering platform" />
  </a>
</p>

<p align="center">
  <strong>Lingo.dev is the localization engineering platform: the best way to measure translation quality, translate with LLMs, and proofread with native speakers.</strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">Docs</a> •
  <a href="https://lingo.dev">Platform</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="Product Hunt #1 DevTool of the Month" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="License" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main"><img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="Last commit" /></a>
</p>

---

## Los equipos crean motores de localización con Lingo.dev

Un [motor de localización](https://lingo.dev/en/docs/platform/engines) es una API de traducción con estado que tu equipo configura y Lingo.dev ejecuta. Crea uno por producto, por tipo de contenido o por marca. Cada solicitud que pasa por un motor aplica todo lo que has configurado en él, en un orden de prioridad fijo:

| Capa | Lo que configuras | En la documentación |
| --- | --- | --- |
| [Modelos LLM](https://lingo.dev/en/docs/platform/llm-models) | Qué modelo gestiona cada par de idiomas, con alternativas de respaldo por orden de prioridad | Más de 400 modelos; la respuesta indica qué modelo se ha usado |
| [Voz de marca](https://lingo.dev/en/docs/platform/brand-voices) | Cómo habla tu producto en cada idioma, con un texto por idioma | Tono y nivel de formalidad según el mercado |
| [Reglas](https://lingo.dev/en/docs/platform/rules) | Las convenciones lingüísticas que a un modelo genérico se le escapan | La posición del adjetivo en español, un espacio antes del signo de porcentaje |
| [Glosario](https://lingo.dev/en/docs/platform/glossaries) | Correspondencias exactas de términos por idioma, según el significado | "911" pasa a ser "112" en los mercados europeos; los nombres de producto se mantienen |
| [Evaluadores de IA](https://lingo.dev/en/docs/platform/ai-reviewers) | Puntuación que se ejecuta después de cada traducción | Puntuaciones GEMBA, BERTScore y cumplimiento del glosario |

Los glosarios, los conjuntos de reglas y las voces de marca pertenecen a tu organización, y un motor los aplica al asociarlos. Un glosario puede gobernar cinco motores, y un solo cambio llega a los cinco. Prueba un cambio en el [Playground](https://lingo.dev/en/docs/platform/playground) antes de ponerlo en producción: compara un motor con un modelo sin configurar o dos motores en paralelo. Los motores se configuran en la plataforma, donde el equipo de localización gestiona toda la infraestructura de localización.

## Accede a tus motores desde el código

Traduce el contenido de un repositorio. `lingo push` envía los archivos al motor indicado en `.lingo/config.json`, y `lingo pull` vuelca las traducciones de vuelta desde cualquier máquina:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

O llama a un motor directamente indicando su ID:

```javascript
const res = await fetch("https://api.lingo.dev/process/localize", {
  method: "POST",
  headers: { "X-API-Key": process.env.LINGO_API_KEY, "Content-Type": "application/json" },
  body: JSON.stringify({
    engineId: "eng_abc123",
    sourceLocale: "en",
    targetLocale: "de",
    data: { greeting: "Hello, world!", cta: "Get started" },
  }),
});

const { data, model, usage } = await res.json();
// data:  { greeting: "Hallo, Welt!", cta: "Jetzt starten" }
// model: "anthropic/claude-sonnet-4.5"
// usage: { inputTokens: 2789, outputTokens: 861, cost: 0.023012 }
```

| | |
| --- | --- |
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | Tu agente de código crea un motor, añade términos al glosario, ajusta reglas y compara dos motores desde la misma conversación en la que surgió el problema |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | Sube archivos fuente y descarga traducciones desde una terminal o desde CI. Dieciocho formatos: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, cadenas de Android y Xcode, SubRip, PHP |
| [Lingo.dev en CI/CD](https://lingo.dev/en/docs/workflows) | Instala la CLI y ejecuta `lingo push` como un paso en GitHub Actions, GitLab CI/CD, Bitbucket Pipelines o cualquier runner con Node.js 22+ |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | Instálala una vez y cada push a la rama predeterminada abrirá o actualizará una pull request de traducción, o las traducciones llegarán como un commit en la pull request que cambió el original. Sin runner, sin secretos de clave de API y sin Lockfile que gestionar |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | Una llamada síncrona por cada par de idiomas, o una tarea asíncrona que distribuye una solicitud a muchos idiomas y entrega los resultados a medida que llegan |

[Crea tu primer motor de localización →](https://lingo.dev)

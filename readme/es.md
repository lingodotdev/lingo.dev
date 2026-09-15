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
    Lingo.dev es la plataforma de ingeniería de localización: la mejor forma de
    medir la calidad de traducción, traducir con LLMs y revisar con hablantes
    nativos.
  </strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">Documentación</a> •
  <a href="https://lingo.dev">Plataforma</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 DevTool del Mes"
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

## Los equipos construyen motores de localización en Lingo.dev

Un [motor de localización](https://lingo.dev/en/docs/platform/engines) es una API de traducción con estado que su equipo configura y Lingo.dev ejecuta. Construya uno por producto, por tipo de contenido o por marca. Cada solicitud que pasa por un motor aplica todo lo que usted configuró en él, en un orden de precedencia fijo:

| Capa                                                            | Qué configura                                                      | Desde la documentación                                                                |
| --------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| [Modelos LLM](https://lingo.dev/en/docs/platform/llm-models)    | Qué modelo gestiona cada par de idiomas, con respaldos en orden    | Más de 400 modelos; la respuesta nombra el modelo que se ejecutó                      |
| [Voz de marca](https://lingo.dev/en/docs/platform/brand-voices) | Cómo habla su producto en cada idioma, un texto por locale         | Tono y formalidad por mercado                                                         |
| [Reglas](https://lingo.dev/en/docs/platform/rules)              | Las convenciones lingüísticas que un modelo genérico omite         | Posición del adjetivo en español, un espacio antes de los signos de porcentaje        |
| [Glosario](https://lingo.dev/en/docs/platform/glossaries)       | Mapeos exactos de términos por locale, emparejados por significado | "911" se convierte en "112" para mercados europeos; nombres de productos se mantienen |
| [Revisores IA](https://lingo.dev/en/docs/platform/ai-reviewers) | Evaluación que se ejecuta después de cada traducción               | Puntuaciones GEMBA, BERTScore, cumplimiento del glosario                              |

Los glosarios, conjuntos de reglas y voces de marca pertenecen a su organización, y un motor los aplica mediante vinculación. Un glosario gobierna cinco motores, y una edición llega a los cinco. Pruebe un cambio en el [Playground](https://lingo.dev/en/docs/platform/playground) antes de que entre en producción: compare un motor contra un modelo sin configurar, o dos motores lado a lado. Los motores se configuran en la plataforma, donde el equipo de localización gestiona la infraestructura de localización.

## Acceda a sus motores desde código

Traduzca el contenido de un repositorio. `lingo push` envía los archivos al motor especificado en `.lingo/config.json`, y `lingo pull` escribe las traducciones de vuelta desde cualquier máquina:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

O llame a un motor directamente, especificándolo por ID:

```javascript
const res = await fetch("https://api.lingo.dev/process/localize", {
  method: "POST",
  headers: {
    "X-API-Key": process.env.LINGO_API_KEY,
    "Content-Type": "application/json",
  },
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

|                                                                        |                                                                                                                                                                                             |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp)                         | Su agente de código crea un motor, añade términos del glosario, ajusta reglas y compara dos motores, desde la conversación donde surgió el problema                                         |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli)                         | Envíe archivos fuente, descargue traducciones, desde un terminal o desde CI. Dieciocho formatos: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, cadenas de Android y Xcode, SubRip, PHP |
| [Lingo.dev en CI/CD](https://lingo.dev/en/docs/workflows)              | Instale el CLI y ejecute `lingo push` como paso en GitHub Actions, GitLab CI/CD, Bitbucket Pipelines, o cualquier runner con Node.js 22+                                                    |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | Instale una vez y cada push a la rama predeterminada abre o actualiza una pull request de traducción. Sin runner, sin secreto de clave API, sin lockfile que gestionar                      |
| [Lingo.dev API](https://lingo.dev/en/docs/api)                         | Una llamada síncrona por par de idiomas, o un trabajo asíncrono que distribuye una solicitud a muchas configuraciones regionales y entrega resultados a medida que llegan                   |

[Construya su primer motor de localización →](https://lingo.dev)

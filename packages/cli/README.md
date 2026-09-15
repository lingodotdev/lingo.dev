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

## Teams build localization engines on Lingo.dev

A [localization engine](https://lingo.dev/en/docs/platform/engines) is a stateful translation API your team configures and Lingo.dev runs. Build one per product, per content type, or per brand. Every request through an engine applies everything you configured in it, in a fixed order of precedence:

| Layer | What you configure | From the docs |
| --- | --- | --- |
| [LLM models](https://lingo.dev/en/docs/platform/llm-models) | Which model handles each language pair, with ranked fallbacks | 400+ models; the response names the model that ran |
| [Brand voice](https://lingo.dev/en/docs/platform/brand-voices) | How your product speaks in each language, one text per locale | Tone and formality per market |
| [Rules](https://lingo.dev/en/docs/platform/rules) | The linguistic conventions a generic model misses | Adjective position in Spanish, a space before percentage signs |
| [Glossary](https://lingo.dev/en/docs/platform/glossaries) | Exact term mappings per locale, matched by meaning | "911" becomes "112" for European markets; product names pass through |
| [AI reviewers](https://lingo.dev/en/docs/platform/ai-reviewers) | Scoring that runs after every translation | GEMBA scores, BERTScore, glossary compliance |

Glossaries, rulesets, and brand voices belong to your organization, and an engine applies them by attachment. One glossary governs five engines, and one edit reaches all five. Test a change in the [Playground](https://lingo.dev/en/docs/platform/playground) before it goes live: compare an engine against a raw model, or two engines side by side. The engines are configured on the platform, where the localization team runs the localization infrastructure.

## Reach your engines from code

Translate the content in a repository. `lingo push` sends the files to the engine named in `.lingo/config.json`, and `lingo pull` writes the translations back from any machine:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

Or call an engine directly, naming it by ID:

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
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | Your coding agent creates an engine, adds glossary terms, tunes rules, and compares two engines, from the conversation where the problem surfaced |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | Push source files, pull translations, from a terminal or from CI. Eighteen formats: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, Android and Xcode strings, SubRip, PHP |
| [Lingo.dev in CI/CD](https://lingo.dev/en/docs/workflows) | Install the CLI and run `lingo push` as a step in GitHub Actions, GitLab CI/CD, Bitbucket Pipelines, or any runner with Node.js 22+ |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | Install once and every push to the default branch opens or updates a translation pull request. No runner, no API key secret, no lockfile to manage |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | One synchronous call per language pair, or an async job that fans one request out to many locales and delivers results as they land |

[Build your first localization engine →](https://lingo.dev)

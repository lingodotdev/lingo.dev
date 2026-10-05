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

## ਟੀਮਾਂ Lingo.dev 'ਤੇ localization engine ਬਣਾਉਂਦੀਆਂ ਹਨ

ਇੱਕ [localization engine](https://lingo.dev/en/docs/platform/engines) ਇੱਕ stateful translation API ਹੁੰਦੀ ਹੈ, ਜਿਸ ਨੂੰ ਤੁਹਾਡੀ ਟੀਮ ਸੰਰਚਿਤ ਕਰਦੀ ਹੈ ਅਤੇ Lingo.dev ਚਲਾਉਂਦਾ ਹੈ। ਤੁਸੀਂ ਹਰ ਪ੍ਰੋਡਕਟ, ਹਰ ਸਮੱਗਰੀ ਕਿਸਮ ਜਾਂ ਹਰ ਬ੍ਰਾਂਡ ਲਈ ਵੱਖਰਾ engine ਬਣਾ ਸਕਦੇ ਹੋ। ਕਿਸੇ engine ਰਾਹੀਂ ਆਉਣ ਵਾਲੀ ਹਰ ਬੇਨਤੀ ਉਸ ਵਿੱਚ ਕੀਤੀ ਤੁਹਾਡੀ ਸਾਰੀ ਸੰਰਚਨਾ ਨੂੰ ਇੱਕ ਨਿਰਧਾਰਤ ਤਰਜੀਹੀ ਕ੍ਰਮ ਵਿੱਚ ਲਾਗੂ ਕਰਦੀ ਹੈ:

| ਪੜਾਅ | ਤੁਸੀਂ ਕੀ ਸੰਰਚਿਤ ਕਰਦੇ ਹੋ | ਦਸਤਾਵੇਜ਼ਾਂ ਤੋਂ |
| --- | --- | --- |
| [LLM ਮਾਡਲ](https://lingo.dev/en/docs/platform/llm-models) | ਹਰ ਭਾਸ਼ਾ ਜੋੜੇ ਲਈ ਕਿਹੜਾ ਮਾਡਲ ਵਰਤਿਆ ਜਾਵੇ, ਨਾਲ ਹੀ ਤਰਜੀਹ ਅਨੁਸਾਰ fallback | 400+ ਮਾਡਲ; ਜਵਾਬ ਵਿੱਚ ਚੱਲੇ ਮਾਡਲ ਦਾ ਨਾਮ ਵੀ ਹੁੰਦਾ ਹੈ |
| [ਬ੍ਰਾਂਡ ਦੀ ਆਵਾਜ਼](https://lingo.dev/en/docs/platform/brand-voices) | ਹਰ ਭਾਸ਼ਾ ਵਿੱਚ ਤੁਹਾਡਾ ਪ੍ਰੋਡਕਟ ਕਿਵੇਂ ਬੋਲਦਾ ਹੈ, ਹਰ locale ਲਈ ਇੱਕ ਵੱਖਰਾ ਲਿਖਤ | ਹਰ ਮਾਰਕੀਟ ਲਈ ਟੋਨ ਅਤੇ ਔਪਚਾਰਿਕਤਾ |
| [ਨਿਯਮ](https://lingo.dev/en/docs/platform/rules) | ਉਹ ਭਾਸ਼ਾਈ ਰਿਵਾਜ, ਜੋ ਇੱਕ ਆਮ ਮਾਡਲ ਅਕਸਰ ਛੱਡ ਜਾਂਦਾ ਹੈ | ਸਪੇਨੀ ਵਿੱਚ ਵਿਸ਼ੇਸ਼ਣ ਦੀ ਥਾਂ, ਪ੍ਰਤੀਸ਼ਤ ਚਿੰਨ੍ਹ ਤੋਂ ਪਹਿਲਾਂ ਖਾਲੀ ਥਾਂ |
| [ਸ਼ਬਦਾਵਲੀ](https://lingo.dev/en/docs/platform/glossaries) | ਹਰ locale ਲਈ ਅਰਥ ਦੇ ਆਧਾਰ 'ਤੇ ਮਿਲਾਈਆਂ ਗਈਆਂ ਸਟੀਕ ਸ਼ਬਦ ਮੈਪਿੰਗਾਂ | ਯੂਰਪੀ ਮਾਰਕੀਟਾਂ ਲਈ "911" "112" ਬਣ ਜਾਂਦਾ ਹੈ; ਪ੍ਰੋਡਕਟ ਦੇ ਨਾਮ ਜਿਵੇਂ ਦੇ ਤਿਵੇਂ ਰਹਿੰਦੇ ਹਨ |
| [AI ਸਮੀਖਿਆਕਾਰ](https://lingo.dev/en/docs/platform/ai-reviewers) | ਹਰ ਅਨੁਵਾਦ ਤੋਂ ਬਾਅਦ ਚੱਲਣ ਵਾਲੀ ਸਕੋਰਿੰਗ | GEMBA ਸਕੋਰ, BERTScore, ਸ਼ਬਦਾਵਲੀ ਅਨੁਸਾਰਤਾ |

ਸ਼ਬਦਾਵਲੀਆਂ, ਨਿਯਮ-ਸਮੂਹ ਅਤੇ ਬ੍ਰਾਂਡ ਦੀਆਂ ਆਵਾਜ਼ਾਂ ਤੁਹਾਡੇ ਸੰਗਠਨ ਦੀਆਂ ਸੰਪਤੀਆਂ ਹੁੰਦੀਆਂ ਹਨ, ਅਤੇ engine ਉਨ੍ਹਾਂ ਨੂੰ attachment ਰਾਹੀਂ ਲਾਗੂ ਕਰਦਾ ਹੈ। ਇੱਕ ਸ਼ਬਦਾਵਲੀ ਪੰਜ engines ਨੂੰ ਸੰਭਾਲ ਸਕਦੀ ਹੈ, ਅਤੇ ਇੱਕ ਸੋਧ ਸਾਰੇ ਪੰਜਾਂ ਤੱਕ ਪਹੁੰਚ ਜਾਂਦੀ ਹੈ। ਕੋਈ ਵੀ ਬਦਲਾਅ live ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ [Playground](https://lingo.dev/en/docs/platform/playground) ਵਿੱਚ ਟੈਸਟ ਕਰੋ: ਇੱਕ engine ਦੀ ਤੁਲਨਾ raw model ਨਾਲ ਕਰੋ, ਜਾਂ ਦੋ engines ਨੂੰ ਇਕੱਠੇ ਵੇਖੋ। Engines ਪਲੇਟਫਾਰਮ 'ਤੇ ਸੰਰਚਿਤ ਹੁੰਦੇ ਹਨ, ਜਿੱਥੇ localization ਟੀਮ localization infrastructure ਚਲਾਉਂਦੀ ਹੈ।

## ਕੋਡ ਤੋਂ ਆਪਣੇ engines ਤੱਕ ਪਹੁੰਚੋ

ਰਿਪੋਜ਼ਿਟਰੀ ਵਿੱਚ ਮੌਜੂਦ ਸਮੱਗਰੀ ਦਾ ਅਨੁਵਾਦ ਕਰੋ। `lingo push` ਫਾਈਲਾਂ ਨੂੰ `.lingo/config.json` ਵਿੱਚ ਦਰਜ engine ਤੱਕ ਭੇਜਦਾ ਹੈ, ਅਤੇ `lingo pull` ਕਿਸੇ ਵੀ ਮਸ਼ੀਨ ਤੋਂ ਅਨੁਵਾਦ ਵਾਪਸ ਲਿਖ ਦਿੰਦਾ ਹੈ:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

ਜਾਂ engine ਨੂੰ ਉਸਦੀ ID ਨਾਲ ਸਿੱਧਾ ਕਾਲ ਕਰੋ:

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
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | ਤੁਹਾਡਾ coding agent ਉਸੇ ਗੱਲਬਾਤ ਵਿੱਚ, ਜਿੱਥੇ ਸਮੱਸਿਆ ਸਾਹਮਣੇ ਆਈ ਸੀ, ਇੱਕ engine ਬਣਾਉਂਦਾ ਹੈ, glossary terms ਜੋੜਦਾ ਹੈ, rules ਨੂੰ fine-tune ਕਰਦਾ ਹੈ, ਅਤੇ ਦੋ engines ਦੀ ਤੁਲਨਾ ਕਰਦਾ ਹੈ |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | ਟਰਮਿਨਲ ਤੋਂ ਜਾਂ CI ਵਿੱਚ source files push ਕਰੋ ਅਤੇ translations pull ਕਰੋ। ਅਠਾਰਾਂ ਫਾਰਮੈਟ: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, Android ਅਤੇ Xcode strings, SubRip, PHP |
| [Lingo.dev in CI/CD](https://lingo.dev/en/docs/workflows) | CLI ਇੰਸਟਾਲ ਕਰੋ ਅਤੇ GitHub Actions, GitLab CI/CD, Bitbucket Pipelines ਜਾਂ Node.js 22+ ਵਾਲੇ ਕਿਸੇ ਵੀ runner ਵਿੱਚ `lingo push` ਨੂੰ ਇੱਕ step ਵਜੋਂ ਚਲਾਓ |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | ਇੱਕ ਵਾਰ ਇੰਸਟਾਲ ਕਰੋ, ਅਤੇ default branch 'ਤੇ ਹਰ push translation pull request ਖੋਲ੍ਹ ਦਿੰਦਾ ਹੈ ਜਾਂ ਅੱਪਡੇਟ ਕਰਦਾ ਹੈ; ਜਾਂ ਫਿਰ translations ਉਸ pull request ਵਿੱਚ commit ਵਜੋਂ ਆ ਜਾਂਦੀਆਂ ਹਨ ਜਿਸ ਨੇ source ਬਦਲਿਆ ਸੀ। ਨਾ runner ਦੀ ਲੋੜ, ਨਾ API key secret ਦੀ, ਨਾ ਹੀ ਸੰਭਾਲਣ ਲਈ Lockfile |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | ਹਰ ਭਾਸ਼ਾ ਜੋੜੇ ਲਈ ਇੱਕ synchronous ਕਾਲ, ਜਾਂ ਇੱਕ async job ਜੋ ਇੱਕ ਬੇਨਤੀ ਨੂੰ ਕਈ locales ਤੱਕ ਫੈਲਾ ਦਿੰਦੀ ਹੈ ਅਤੇ ਨਤੀਜੇ ਮਿਲਦੇ ਹੀ ਪਹੁੰਚਾ ਦਿੰਦੀ ਹੈ |

[ਆਪਣਾ ਪਹਿਲਾ localization engine ਬਣਾਓ →](https://lingo.dev)

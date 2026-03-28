<p align="center">
  <img src="https://raw.githubusercontent.com/bhavya031/ctx/master/demo.gif" width="100%" alt="ctx demo" />
</p>

<p align="center">
  <strong>ctx — AI context engine for lingo.dev</strong>
</p>

<p align="center">
  Your AI translator knows grammar. ctx teaches it your product.
</p>

<br />

<p align="center">
  <a href="#the-problem">Problem</a> •
  <a href="#what-ctx-actually-fixes">What It Fixes</a> •
  <a href="#how-it-works">How It Works</a> •
  <a href="#brand-voices">Brand Voices</a> •
  <a href="#agentic-pipeline">Agentic Pipeline</a> •
  <a href="#install">Install</a> •
  <a href="#usage">Usage</a> •
  <a href="#jsonc-translator-notes">JSONC Notes</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/built%20with-tsx%2FNode.js-339933?logo=nodedotjs&style=flat-square" alt="Built with tsx/Node.js" />
  <img src="https://img.shields.io/badge/powered%20by-Claude-blueviolet?logo=anthropic&style=flat-square" alt="Powered by Claude" />
  <img src="https://img.shields.io/badge/works%20with-lingo.dev-orange?style=flat-square" alt="Works with lingo.dev" />
</p>

---

## The Problem

lingo.dev is genuinely great — fast, cheap, AI-powered translation that plugs straight into your codebase. But out of the box, it has no idea who *you* are. It'll translate "ship it" differently every time. It'll switch between formal and informal mid-product. It'll call your core feature something different in every locale. The translations are correct — they're just not *yours*.

> "ship" → translated as "enviar" (to mail/send) instead of "lanzar" (to launch/deploy)
> "fly solo" → translated literally instead of "trabajar solo"
> tú vs vos inconsistency across files because no one wrote down the register rule

lingo.dev solves this with [`lingo-context.md`](https://lingo.dev/en/translator-context) — a global context file it injects into every translation prompt. But writing it by hand takes hours, and keeping it current as your codebase grows is easy to forget.

**ctx automates that entirely.** It reads your project, understands your product, and generates a precise, structured `lingo-context.md`. Then it keeps it in sync as your source files change — file by file, cheaply, only processing what actually changed.

---

## What ctx Actually Fixes

lingo handles the translation. ctx makes sure every translation sounds like it came from the same company, in the same voice, on the same product. It's the difference between *translated* and *localized*.

- **Pronoun consistency** — picks `tú` or `usted` once, enforces it everywhere. No more mixed register in the same product.
- **Grammar conventions** — locale-specific rules baked in. German compound nouns, French gender agreements, Japanese politeness levels — defined once, applied always.
- **Repeated terms** — your product's vocabulary is locked. "Workspace" is always "Workspace", not "Space", "Area", or "Room" depending on which string Claude saw first.
- **On-brand tone** — not just "be professional" (useless), but "use informal du, keep CTAs under 4 words, never use exclamation marks".

---

## How It Works

```
your lingo.dev project
├── i18n.json              ← ctx reads this: locales, bucket paths, provider config
├── lingo-context.md       ← ctx generates and maintains this
└── app/locales/
    ├── en.tsx             ← source locale files ctx reads and analyses
    ├── en.jsonc           ← ctx injects per-key translator notes here
    └── en/
        └── getting-started.md
```

ctx reads `i18n.json` to discover your bucket files, analyses only the source locale, and writes a context file that covers:

- **App** — what the product does, factual, no marketing copy
- **Tone & Voice** — explicit dos and don'ts the translator must follow
- **Audience** — who reads these strings and in what context
- **Languages** — per-language pitfalls: pronoun register, dialect, length warnings
- **Tricky Terms** — every ambiguous, idiomatic, or domain-specific term with exact guidance
- **Files** — per-file rules for files that need them

Once written, ctx injects the full context into `i18n.json` as the provider prompt so lingo.dev carries it into every translation automatically.

---

## UI

ctx has a minimal terminal UI designed to stay out of your way. Every stage is clearly labelled, tool calls are shown inline, and you always know where you are.

**Fresh scan — first run:**
```
  ctx  /your-project
  lingo-context.md  ·  claude-sonnet-4-6  ·  en → es  fr  de

  ◆  Research
     scanning project + searching web

     ↳  web_search     lingo crypto exchange localization
     ↳  read_file      en.jsonc
     ↳  list_files     app/locales
     ↳  read_file      package.json

  ◆  Context Generation
     writing lingo-context.md

     ↳  read_file      en.jsonc
     ↳  read_file      en/getting-started.md
     ↳  write_file     lingo-context.md

  ◆  JSONC Injection
     ↳  annotate       en.jsonc

  ┌─ Review: en.jsonc ──────────────────────────────────────┐

  {
    // Buy/sell action — use financial verb, not generic "send"
    "trade.submit": "Place order",

    // Shown on empty portfolio — encouraging, not alarming
    "portfolio.empty": "No assets yet"
  }

  └──────────────────────────────────────────────────────────┘

  ❯ Accept
    Request changes
    Skip

  ◆  Provider Sync

  ✓  Done
```

**Update run — after changing a file:**
```
  ctx  /your-project
  lingo-context.md  ·  claude-sonnet-4-6  ·  en → es  fr  de

  [1/2]  en.jsonc
     ↳  write_file     lingo-context.md

  [2/2]  en/getting-started.md
     ↳  write_file     lingo-context.md

  ~  Tricky Terms  (+2 terms)
  ~  Files  (getting-started.md updated)

  ◆  JSONC Injection
     ↳  annotate       en.jsonc

  ◆  Provider Sync

  ✓  Done
```

**No changes:**
```
  ✓  No new changes (uncommitted) — context is up to date.

  ❯ No, exit
    Yes, regenerate
```

**Brand voices (`--voices`):**
```
  ◆  Brand Voices
     generating voice for es

  ┌─ Review: voice · es ────────────────────────────────────┐

  Write in Spanish using informal tú throughout — never usted.
  Tone is direct and confident, like a senior dev talking to
  a peer. Avoid exclamation marks. Keep CTAs under 4 words.
  Financial terms use standard Latin American conventions.

  └──────────────────────────────────────────────────────────┘

  ❯ Accept
    Request changes
    Skip
```

---

## Brand Voices

Beyond the global context, ctx can generate a **brand voice** per locale — a concise prose brief that tells the translator exactly how your product sounds in that language.

```bash
ctx ./my-app --voices
```

A brand voice covers pronoun register (tú/usted, du/Sie, tu/vous), tone, audience context, and locale-specific conventions — all derived from your existing `lingo-context.md`. Voices are written into `i18n.json` under `provider.voices` and picked up by lingo.dev automatically.

Each voice goes through a review loop — accept, skip, or give feedback and the agent revises.

---

## Agentic Pipeline

ctx runs as a multi-step agentic pipeline. Each step is a separate Claude call with a focused job — not one big prompt trying to do everything.

```
ctx run
  │
  ├── Step 1: Research (first run only, optional)
  │     Claude searches the web + reads your project files
  │     Produces a product brief: market, audience, tone conventions
  │     Or: answer 4 quick questions yourself
  │
  ├── Step 2: Fresh scan (first run only)
  │     Claude agent explores the project using tools:
  │     list_files → read_file → write_file
  │     Reads: i18n.json + bucket files + package.json + README
  │     Writes: lingo-context.md
  │
  ├── Step 3: Per-file update (subsequent runs)
  │     For each changed source file — one Claude call per file:
  │     Reads: current lingo-context.md + one changed file
  │     Updates: only the sections affected by that file
  │     Records: file hash so it won't re-process unless content changes
  │
  ├── Step 4: JSONC comment injection (for .jsonc buckets)
  │     One Claude call per .jsonc source file:
  │     Reads: lingo-context.md + source file
  │     Writes: per-key // translator notes inline in the file
  │     lingo.dev reads these natively during translation
  │
  └── Step 5: Provider sync
        Writes the full lingo-context.md into i18n.json provider.prompt
        so lingo.dev uses it automatically — no manual step needed
```

**Why per-file?** Sending all changed files in one prompt crushes context and produces shallow analysis. Processing one file at a time keeps the window focused — Claude can deeply scan every string for tricky terms rather than skimming.

**Human in the loop:** Every write shows a preview and waits for approval. You can request changes and the agent revises with full context, or skip a step entirely.

---

## Install

**Requirements:** [Node.js](https://nodejs.org) (with `tsx`) and an Anthropic API key.

```bash
git clone https://github.com/bhavya031/ctx
cd ctx
bun install
bun link
```

```bash
export ANTHROPIC_API_KEY=your_key_here
```

---

## Usage

```bash
# Run in your lingo.dev project
ctx ./my-app

# With a focus prompt
ctx ./my-app -p "B2B SaaS, formal tone, legal/compliance domain"

# Preview what would run without writing anything
ctx ./my-app --dry-run

# Use files changed in last 3 commits
ctx ./my-app --commits 3

# Generate brand voices for all target locales
ctx ./my-app --voices
```

**Options:**

| Flag | Short | Default | Description |
|------|-------|---------|-------------|
| `--prompt` | `-p` | interactive | What the agent should focus on |
| `--out` | `-o` | `lingo-context.md` | Output file path |
| `--model` | `-m` | `claude-sonnet-4-6` | Claude model to use |
| `--commits` | `-c` | — | Use files changed in last N commits |
| `--dry-run` | `-d` | `false` | Preview what would run, write nothing |
| `--voices` | `-V` | `false` | Generate brand voices only |
| `--help` | `-h` | — | Show help |

---

## Modes

| Mode | Trigger | What runs |
|------|---------|-----------|
| **Fresh** | No `lingo-context.md` yet | Research → full agent scan → writes context from scratch |
| **Update** | Context exists, files changed | Per-file update — one agent call per changed bucket file |
| **Commits** | `--commits <n>` | Same as update but diffs against last N commits instead of uncommitted |

State is tracked via content hashes in `~/.ctx/state/` — only genuinely new or changed files are processed. Hashes are saved only after the full pipeline completes, so cancelling mid-run leaves state untouched and the same changes are detected next run.

---

## JSONC Translator Notes

For `.jsonc` bucket files, ctx injects per-key translator notes directly into the source:

```jsonc
{
  // Navigation item in the top header — keep under 12 characters
  "nav.dashboard": "Dashboard",

  // Button that triggers payment — not just "submit", implies money changing hands
  "checkout.pay": "Pay now",

  // Shown when session expires — urgent but not alarming, avoid exclamation marks
  "auth.session_expired": "Your session has ended"
}
```

lingo.dev reads these `//` comments natively and passes them to the LLM alongside the string. Notes are generated from `lingo-context.md` so they stay consistent with your global rules. Only changed `.jsonc` files get re-annotated on update runs.

---

## Review Before Writing

ctx never writes silently. Every write — context file, JSONC comments, or brand voices — shows a preview first:

```
  ┌─ Review: lingo-context.md ──────────────────────────────┐

  ## App
  A B2B SaaS tool for managing compliance workflows...

  ## Tone & Voice
  Formal, precise. Use "you" not "we"...
    … 42 more lines

  └──────────────────────────────────────────────────────────┘

  ❯ Accept
    Request changes
    Skip
```

Choose **Request changes**, describe what's wrong, and the agent revises with full context and shows you the result again.

---

## Tested On

- [lingo-crypto](https://github.com/Bhavya031/lingo-crypto) — crypto exchange UI
- [others](https://github.com/Bhavya031/others) — mixed project types

---

## Requirements

- [Node.js](https://nodejs.org) v18+ with [tsx](https://github.com/privatenumber/tsx)
- `ANTHROPIC_API_KEY`
- A lingo.dev project with `i18n.json`

---

*Built for the lingo.dev hackathon.*

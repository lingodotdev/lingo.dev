# Lingo CLI demo

A ready-to-run project that shows the [`@lingo.dev/cli`](https://www.npmjs.com/package/@lingo.dev/cli)
translating **every supported file format** end to end: JSON, JSONC, Markdown,
MDX, Markdoc, and OpenAPI YAML.

Drop in your own org and engine, run `push`, and watch every format get
translated into German, French, and Spanish.

## What's inside

```
.lingo/config.json     # one files[] entry per format, with format-specific options
content/en/
  app.json             # JSON    — injectLocale + lockedKeys
  settings.jsonc       # JSONC   — preservedKeys (comments survive)
  guide.md             # MD      — translateFrontmatterFields
  landing.mdx          # MDX     — translateComponentProps (Hero, Callout)
  changelog.mdoc       # Markdoc — frontmatter + tag attributes preserved
  api.yaml             # OpenAPI YAML — explicit "format": "yaml-openapi"
```

Source locale is `en`; targets are `de`, `fr`, `es`. The repo ships the
translated `content/de/`, `content/fr/`, and `content/es/` files as sample
output so you can see the result without running anything. Re-run the CLI
against your own engine to regenerate them (the CLI swaps the `en` path segment
for each target locale).

## Get the demo

```bash
npx degit lingodotdev/lingo.dev/demo/new-cli my-lingo-demo
cd my-lingo-demo
```

## Run it

You need a [Lingo.dev](https://lingo.dev) account. The commands below use `npx`,
so there's nothing to install globally.

```bash
# 1. Authenticate (once).
npx @lingo.dev/cli@latest login

# 2. Connect this project to your org and engine.
npx @lingo.dev/cli@latest link

# 3. (optional) Preview the cost before translating.
npx @lingo.dev/cli@latest push --backfill-missing --estimate

# 4. Translate every file into every target locale.
npx @lingo.dev/cli@latest push --backfill-missing

# 5. Pull the translated files back into content/<locale>/.
npx @lingo.dev/cli@latest pull
```

`push` needs a linked org and engine, so run `link` first. The `content/de`,
`content/fr`, and `content/es` files checked into the repo are sample output;
your own `push` / `pull` overwrites them with translations from your engine.

# GlobalOnboard · LingoHack25 ✨


 **One onboarding checklist. Any language. Fully Configurable**  
 HR writes once in English, and GlobalOnboard turns it into a polished, localized employee experience by combining **Lingo CLI**, **Lingo JavaScript SDK**, and **Lingo CI**.


## 🧠 The MAIN Pillars of GlobalOnboard

- **Real personas:** HR Workspace (authoring) + Employee Experience (preview) wired together in real time.
- **Full Lingo toolchain:** Static JSON via CLI, runtime personalization via SDK, and CI automation so translations stay fresh.
- **Enterprise-ready touches:** Translation QA mode, localization health warnings, onboarding pack export, and translation spinners that prove we’re production aware.

### 🏅 Lingo Product Scorecard

| Lingo product | How GlobalOnboard uses it | Why it matters |
 | --- | --- | --- |
 | **Lingo CLI** | Generates `data/ui.{locale}.json` and `data/onboarding_template.{locale}.json` from English sources via `npx lingo.dev@latest run`. | Demonstrates the official static localization workflow. |
 | **Lingo JavaScript SDK** | Translates the welcome note and every custom task at runtime with caching, spinners, and graceful fallbacks. | Shows dynamic personalization for each employee preview. |
 | **Lingo CI** | `.github/workflows/i18n.yml` runs `npx lingo.dev@latest ci --pull-request` whenever English JSON or `i18n.json` changes. | Proves translation automation and GitHub integration end-to-end. |

---

## 🔑 Feature Highlights

| Area | What it unlocks | Lingo capability |
| --- | --- | --- |
| HR Workspace | Edit company, role, welcome note, and a fully dynamic checklist (add/delete/modify tasks). | Authoring surface for English source |
| Employee Experience | Switch between `en`, `es`, `fr`, `hi` previews with live updates + translation loading overlay. | CLI JSON + SDK runtime translations |
| Preview Modes | `Employee view` or `Translation QA` (side-by-side EN vs target locale) with Machine → Edited → Approved overrides. | Human-in-the-loop QA |
| Localization Health | Warns when translated copy is >1.5× English length, per task + summary. | QA signal |
| Onboarding Pack Export | One click generates a `.doc` bundle for the current locale (company, role, tasks, welcome note). | HR enablement |
| Lingo CI Workflow | GitHub Action auto-runs `lingo.dev ci` whenever English JSON changes. | Translation automation |

---

## 🧩 Architecture At-a-Glance

```text
HR inputs ──▶ English JSON templates ──▶ Lingo CLI generates data/ui.{locale}.json
              │                               │
              │                               └─▶ Lingo CI keeps translations up to date
              │
              ├─▶ React state + localStorage overrides
              │
              └─▶ Lingo JS SDK
                     ├─ Welcome note runtime translation
                     └─ Custom task translations (per locale) + caching
```

---

## 🧪 Getting Started (Local Dev)

```bash
git clone https://github.com/lingodotdev/lingo.dev.git
cd lingo.dev/community/global-onboard
npm install

# Provide your API key so CLI + SDK can translate
export LINGO_DOT_DEV_API_KEY="your-key"
# Optional alias used by some shells/CLIs
export LINGODOTDEV_API_KEY="$LINGO_DOT_DEV_API_KEY"

npm run dev
```

Visit **<http://localhost:3000>** — left panel is HR Workspace, right panel is the localized Employee preview.

---

## 🌐 Localization Workflow Cheat Sheet

### 1. Static JSON (Lingo CLI)
- Source files: `data/ui.en.json`, `data/onboarding_template.en.json`
- Configure targets in `i18n.json`
- Generate translations:
  ```bash
  export LINGO_DOT_DEV_API_KEY="your-key"
  npx lingo.dev@latest run
  ```
- CI automation: `.github/workflows/i18n.yml` runs `npx lingo.dev@latest ci --pull-request` on every push to `main` touching English JSON or `i18n.json`.

### 2. Runtime Personalization (Lingo JS SDK)
- Welcome note + any **custom tasks** run through `lib/lingo-client.ts`.
- We cache translations per locale, show a loading spinner overlay, and gracefully fall back to English if the SDK errors.

### 3. Translation QA Mode
- Side-by-side English vs target locale.
- Inline editing with Machine → Edited → Approved chips.
- Reset/Unlock controls to manage overrides.
- Length-based warnings + summary so HR spots risky strings fast.
- Overrides feed every other view (single preview + export).

---

## 📦 Onboarding Pack Export

1. Choose a locale via the Employee panel dropdown.
2. Ensure QA overrides are final (Approved if needed).
3. Click **Download Onboarding Pack** → generates `onboarding-pack-<locale>.doc` with:
   - Locale code
   - Localized company + role
   - Welcome note (SDK translation if non-English)
   - Full task list using effective text (overrides or machine)

Perfect for HRIS uploads, emails, or sharing with managers.

---

## 🛠 Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS 4** (custom gradient + glassmorphism theme)
- **Lingo.dev CLI, JS SDK, CI**
- **next-themes** + custom design tokens for dark-first UI
- **GitHub Actions** for automated localization runs

---

## 📁 Project Structure

```text
app/
  layout.tsx        # Root metadata + ThemeProvider
  page.tsx          # HR + Employee panels, QA, overrides, spinner
  globals.css       # Tailwind layers + design tokens
components/
  mode-toggle.tsx   # Shadcn-style theme toggle (hidden by default)
data/
  ui.*.json         # Static UI translations (CLI managed)
  onboarding_template.*.json
lib/
  i18n.ts           # Typed loaders for JSON bundles
  lingo-client.ts   # SDK setup + runtime translation helpers
.github/workflows/
  i18n.yml          # CI job running `lingo.dev ci`
i18n.json           # Bucket + locale configuration
```

---

## 🧾 Useful Scripts

- `npm run dev` – Next.js dev server
- `npm run build` – Production build
- `npm run lint` – ESLint via `eslint-config-next`

---

## ✅ Hackathon Compliance & Notes

- All code, UI, and assets created fresh during **LingoHack25**.
- API keys are required only for translation features; none are checked into the repo.
- Want more locales? Add them to `SUPPORTED_LOCALES` + `i18n.json`, re-run the CLI, and you’re done.

---

### 💬 Questions for Judges?
Open an issue or ping me — I'd love to show how GlobalOnboard can become the multilingual onboarding cockpit for any global company.

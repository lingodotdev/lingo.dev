# PR Review Localizer

> **A developer-focused demo showing how [Lingo.dev](https://lingo.dev) enables version-controlled, automated localization for GitHub Pull Request content.**

##  What This App Demonstrates

This application proves how **Lingo.dev** solves a real developer pain point: enabling global development teams to collaborate on Pull Requests in their native languages.

When teams work across different countries and languages, English-only Pull Requests create friction for non-native speakers. This demo shows how PR descriptions and review comments can be **automatically localized** into multiple languages and kept **perfectly in sync** when the original content changes.

##  The Problem

**Real-world scenario:**

- A developer in Spain receives a PR review in English
- They struggle to understand nuanced technical feedback
- Context is lost in translation tools
- Collaboration slows down

**Without Lingo.dev:**
- Manual translation is time-consuming and error-prone
- Translations quickly become outdated when PRs are updated
- No version control for localized content
- Maintaining multiple language versions is unsustainable

##  Lingo.dev's Role

This demo showcases how **Lingo.dev** transforms the localization workflow:

###  Automated Translation Sync
- English source file (`locales/en.json`) is the single source of truth
- Lingo.dev automatically generates translations for Spanish, French, and German
- When the English content changes, **all translations update automatically**

###  Git-Based Localization Workflow
- All localized files are committed to version control
- Translation history is tracked alongside code changes
- Teams can review translation updates in Pull Requests

###  Multi-Language Collaboration
- Developers can read PR content in their preferred language
- Review comments are accessible to non-English speakers
- Global teams collaborate more effectively

###  Zero Manual Maintenance
- No manual translation work required
- No risk of outdated translations
- Scalable to any number of languages

**Without Lingo.dev, this workflow would be impossible to maintain at scale.**

##  Project Structure

```
/pr-review-localizer
 ├── README.md                  # This file
 ├── package.json               # Node.js dependencies
 ├── tsconfig.json              # TypeScript configuration
 ├── lingo.config.json          # Lingo.dev configuration
 ├── src/
 │   ├── index.ts               # Demo entry point
 │   └── pr-content.ts          # Localization logic
 └── locales/
     ├── en.json                # English (source of truth)
     ├── es.json                # Spanish (auto-generated)
     ├── fr.json                # French (auto-generated)
     └── de.json                # German (auto-generated)
```

## 🚀 How to Run

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Navigate to the project directory
cd /pr-review-localizer

# Install dependencies
npm install

# Build the TypeScript code
npm run build

# Run the demo
npm start
```

### What You'll See

The demo displays a Pull Request in **four languages** (English, Spanish, French, German):

1. **Scenario 1:** Original PR with JWT authentication
2. **Scenario 2:** Updated PR with OAuth2 support added

Notice how **all translations automatically reflect the content changes** — this is Lingo.dev in action! 

##  Lingo.dev Configuration

The `lingo.config.json` file defines the localization workflow:

```json
{
  "sourceLocale": "en",
  "targetLocales": ["es", "fr", "de"],
  "files": {
    "locales/{locale}.json": {
      "format": "json"
    }
  }
}
```

### How It Works

1. **Developer updates** `locales/en.json` with new PR content
2. **Lingo.dev detects** the change via Git workflow
3. **Translations are generated** for all target locales
4. **Localized files are updated** and committed to the repository
5. **Developers worldwide** access PR content in their language

##  Why Lingo.dev Is Critical

### Traditional Approach (Manual Translation)
❌ Developer writes PR in English  
❌ Manually copy content to translation service  
❌ Paste translations into separate files  
❌ PR gets updated → translations are now outdated  
❌ Repeat process for every change  
❌ Unsustainable for large teams  

### Lingo.dev Approach (Automated Workflow)
✅ Developer writes PR in English  
✅ Lingo.dev automatically generates translations  
✅ All translations stay in sync via Git workflow  
✅ PR updates trigger automatic translation updates  
✅ Zero manual maintenance required  
✅ Scales effortlessly to any team size  

##  Key Takeaways

- **Version-controlled localization:** All translations are tracked in Git
- **Automated sync:** Content changes propagate automatically
- **Developer-friendly:** No manual translation workflow needed
- **Production-ready:** Real localization, not mock data
- **Scalable:** Add new languages without additional overhead

##  Learn More

- [Lingo.dev Documentation](https://lingo.dev/docs)
- [Lingo.dev GitHub](https://github.com/lingo-dev)

---

**Built to demonstrate the power of automated, version-controlled localization with Lingo.dev.**

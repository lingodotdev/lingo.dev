# Auto-Localized README Translator (CLI)

### What This App Does
It is a CLI tool that automatically translates a README.md file into multiple languages using **Lingo.dev**, while preserving all **code blocks and markdown formatting.**

It will help open-source maintainers and developers make their projects accessible to a global audience without breaking technical documentation.

---
### Key Capabilities

- Translate README files into multiple languages
- Preserves fenced code blocks (```), inline code, and markdown
- Simple CLI interface for developer workflows
- Powered by the official **Lingo.dev SDK**

---
### How to Run it Locally

1. **Prerequisites**

- Node.js (v18+ recommended)
- A Lingo.dev API key

2. **Clone & Install Dependencies**
- clone the repo
- cd readme-translator-lingo
- npm install

3. **Set Environment Variable**

Create a .env file in the project root:
```
LINGODOTDEV_API_KEY=your_lingo_dev_api_key
```

4. **Build the CLI**
```
npx tsc
```

4. **Run the CLI**
```
 node dist/index.js -i <path-of-the-file/SOMEFILE.md> -l es,fr -o <output-path-for-translated-files>

 #In place of es or fr you can give any supported languages.
```

**Note** : No need to specify any file name in the output path. It will automatically be generated with exact same file name that you provide as input with translated language extension.

---
### ✨ Lingo.dev Features Highlighted
This project showcases the following **Lingo.dev features:**

🔹 **Official Lingo.dev SDK**

Uses the lingo.dev/sdk package and LingoDotDevEngine, demonstrating real-world SDK integration.

🔹 **High-Quality Localization**

Uses localizeText to produce natural, developer-friendly translations suitable for technical# Auto-Localized README Translator (CLI)

### What This App Does
It is a CLI tool automatically translates a README.md file into multiple languages using **Lingo.dev**, while preserving all **code blocks and markdown formatting.**

It will help open-source maintainers and developers make their projects accessible to a global audience without breaking technical documentation.

---
### Key Capabilities

- Translate README files into multiple languages
- Preserves fenced code blocks (```), inline code, and markdown
- Simple CLI interface for developer workflows
- Powered by the official **Lingo.dev SDK**

---
### How to Run it Locally

1. **Prerequisites**

- Node.js (v18+ recommended)
- A Lingo.dev API key

2. **Clone & Install Dependencies**
- clone the repo
- cd readme-translator-lingo
- npm install

3. **Set Environment Variable**

Create a .env file in the project root:
```
LINGODOTDEV_API_KEY=your_lingo_dev_api_key
```

4. **Build the CLI**
```
npx tsc
```

4. **Run the CLI**
```
 node dist/index.js -i <path-of-the-file/SOMEFILE.md> -l es -o <output-path-for-translated-files>
```

**Note** : No need to specify any file name in the output path. It will automatically be generated with exact same file name that you provide as input with translated language extension.

---
### ✨ Lingo.dev Features Highlighted
This project showcases the following **Lingo.dev features:**

🔹 **Official Lingo.dev SDK**

Uses the lingo.dev/sdk package and LingoDotDevEngine, demonstrating real-world SDK integration.

🔹 **High-Quality Localization**

Uses localizeText to produce natural, developer-friendly translations suitable for technical documentation.

🔹 **Developer-First Workflow**

Shows how Lingo.dev can be integrated into:

- CLI tools
- Open-source workflows
- Documentation pipelines

🔹 **Formatting-Safe Localization**

Demonstrates how Lingo.dev can be used safely with markdown by translating only human-readable text while preserving code blocks.

---

### Why This Matters

Most open-source projects are English-only, which limits adoption.
This tool demonstrates how Lingo.dev enables effortless, production-ready localization for developers with minimal setup.


### Why This Matters

Most open-source projects are English-only, which limits adoption.
This tool demonstrates how Lingo.dev enables effortless, production-ready localization for developers with minimal setup.


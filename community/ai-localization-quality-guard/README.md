AI Localization Quality Guard

This is a small community example that demonstrates how developers can add
a localization quality check layer on top of translations produced using Lingo.dev.

The goal is to detect common issues before deploying multilingual applications.

What this project does
- Compares source and translated JSON localization files
- Detects missing translations
- Detects missing placeholders like {name}
- Flags translated strings that are much longer and may break UI

Why this exists
While Lingo.dev handles translation workflows, teams often need additional
validation to ensure translations are safe to ship. This example shows how
such a quality check can be implemented.

Project structure
ai-localization-quality-guard/
- index.js
- README.md
- examples/locales/en.json
- examples/locales/de.json

Prerequisites
- Node.js 18+
- JSON-based localization files

How to run locally
Run the following command from the project folder:

node index.js examples/locales/en.json examples/locales/de.json

Strict mode (useful for CI)
This mode exits with an error if high-severity issues are found.

node index.js examples/locales/en.json examples/locales/de.json --strict

Example output
[
  {
    "key": "welcome.user",
    "severity": "HIGH",
    "issue": "Missing placeholder {name}"
  }
]

Disclaimer
This project is contributed by the community for educational purposes.
It is not part of the Lingo.dev core product.

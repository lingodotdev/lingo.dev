# 🧩 @lingo.dev/i18n-validator

**Runtime Validator for `i18n.json` using Zod with Smart Suggestions**

This package provides comprehensive runtime validation for Lingo.dev's `i18n.json` configuration files. It ensures that localization configs follow the expected structure and provides actionable suggestions for fixing common mistakes — **before they break your translations**.

---

## 🚀 Features

- ✅ **Complete Zod-based validation** for i18n.json schema v1.10
- 💡 **Smart suggestions** for missing or misconfigured fields
- 🧠 **Human-friendly CLI output** with colored messages and help text
- ⚙️ **Custom validation rules** for `[locale]` placeholders in bucket paths
- 📦 **Programmatic API** for integration into build tools and CI/CD
- 🧪 **Comprehensive test coverage** with 12+ test scenarios
- 🔧 **TypeScript support** with full type definitions

---

## 📦 Installation & Setup

### As a CLI tool (global):

```bash
npm install -g @lingo.dev/i18n-validator
lingo-validate-i18n
```

### In your project:

```bash
npm install @lingo.dev/i18n-validator
pnpm install @lingo.dev/i18n-validator
```

### Development setup:

```bash
pnpm install
pnpm --filter @lingo.dev/i18n-validator build
```

---

## 🧑💻 Usage

### CLI Usage

**Validate the default i18n.json in your current directory:**

```bash
lingo-validate-i18n
```

**Validate a specific file:**

```bash
lingo-validate-i18n ./config/i18n.json
```

**Show help:**

```bash
lingo-validate-i18n --help
```

### Programmatic API

```typescript
import { validateI18nConfig } from "@lingo.dev/i18n-validator";

const config = {
  locale: { source: "en", targets: ["es", "fr"] },
  buckets: {
    json: { include: ["locales/[locale].json"] }
  }
};

const result = validateI18nConfig(config);

if (result.ok) {
  console.log("✅ Config is valid");
  console.log(result.parsed); // Typed config object
} else {
  console.log("❌ Validation failed");
  console.log("Errors:", result.errors);
  console.log("Suggestions:", result.suggestions);
}
```

---

## 🧪 Example Outputs

### ✅ Valid configuration

```
✅ i18n.json is valid
```

### ❌ Missing required fields

```
❌ i18n.json validation failed

Errors:
• locale.source: Required

Suggestions:
• Add `locale.source`, e.g. "en" (BCP 47 language code).
```

### ❌ Missing [locale] placeholder

```
❌ i18n.json validation failed

Errors:
• Bucket "json" include pattern "locales/en.json" does not contain the [locale] placeholder — include "[locale]" if files are per-locale.

Suggestions:
• Bucket "json" include pattern "locales/en.json" does not contain the [locale] placeholder — include "[locale]" if files are per-locale.
```

### ❌ Invalid provider configuration

```
❌ i18n.json validation failed

Errors:
• provider.id: Invalid enum value. Expected 'openai' | 'anthropic' | 'google' | 'ollama' | 'openrouter' | 'mistral', received 'invalid-provider'

Suggestions:
• Use a supported provider: "openai", "anthropic", "google", "ollama", "openrouter", or "mistral".
```

---

## 🧰 File Overview

| File | Description |
|------|-------------|
| **`src/index.ts`** | Main entry point exporting all public APIs for programmatic usage. |
| **`src/cli.ts`** | CLI entry point with help text, error handling, and colored output using Chalk. |
| **`src/schema.ts`** | Complete **Zod schema** for i18n.json v1.10, following [Lingo.dev's official spec](https://lingo.dev/en/cli/fundamentals/i18n-json-config). |
| **`src/validate.ts`** | Core validation logic with custom checks for `[locale]` placeholders. Returns structured results with `ok`, `errors`, and `suggestions`. |
| **`src/suggest.ts`** | Converts technical Zod error messages into **human-friendly suggestions** for common issues. |
| **`test/validate.test.ts`** | Comprehensive test suite with 12+ scenarios covering valid configs, missing fields, invalid values, and edge cases. |
| **`package.json`** | Package configuration with proper exports, dependencies, and build scripts. |
| **`tsconfig.json`** | TypeScript config using ESM (`NodeNext`) for modern Node.js compatibility. |
| **`vitest.config.ts`** | Test configuration for Vitest with globals and Node environment. |

---

## 🧩 Supported i18n.json Schema

The validator supports the complete i18n.json schema v1.10 including:

### Core Configuration

```json
{
  "$schema": "https://lingo.dev/schema/i18n.json",
  "version": "1.10",
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"],
    "extraSource": "en-US"
  }
}
```

### Provider Configuration

```json
{
  "provider": {
    "id": "openai",
    "model": "gpt-4",
    "prompt": "Translate the following text",
    "baseUrl": "https://api.openai.com",
    "settings": {
      "temperature": 0.1
    }
  }
}
```

### Bucket Configuration

```json
{
  "buckets": {
    "json": {
      "include": [
        "locales/[locale].json",
        { "path": "data/[locale].json", "delimiter": "-" }
      ],
      "exclude": ["locales/[locale].backup.json"],
      "lockedKeys": ["api_key", "version"],
      "lockedPatterns": ["^SECRET_.*"],
      "ignoredKeys": ["debug_info"],
      "injectLocale": ["current_locale"]
    }
  }
}
```

### Additional Options

```json
{
  "formatter": "prettier"
}
```

---

## ⚙️ How It Works

1. **Schema Validation**: Uses Zod to validate the structure and types of all fields
2. **Custom Rules**: Checks for `[locale]` placeholders in include/exclude patterns
3. **Smart Suggestions**: Maps technical Zod errors to actionable advice
4. **Type Safety**: Provides full TypeScript support with inferred types
5. **CLI Integration**: Offers colored output and proper exit codes for CI/CD

---

## 🧪 Running Tests

Run all tests:

```bash
pnpm --filter @lingo.dev/i18n-validator test:run
```

Run tests in watch mode:

```bash
pnpm --filter @lingo.dev/i18n-validator test
```

Expected output:

```
✓ valid minimal config
✓ valid complete config
✓ missing locale.source
✓ missing locale.targets
✓ empty locale.targets array
✓ missing [locale] placeholder in include pattern
✓ missing [locale] placeholder in exclude pattern
✓ invalid provider id
✓ invalid formatter
✓ invalid temperature value
✓ bucket with object-style include patterns
✓ completely invalid JSON structure

Test Files  1 passed (1)
Tests  12 passed (12)
```

---

## 🔧 API Reference

### `validateI18nConfig(config: unknown): ValidationResult`

Validates an i18n configuration object.

**Parameters:**
- `config` - The configuration object to validate

**Returns:**
```typescript
type ValidationResult = {
  ok: boolean;
  errors?: string[];
  suggestions?: string[];
  parsed?: I18nConfig;
};
```

### `i18nSchema: ZodSchema`

The Zod schema used for validation. Can be used directly for custom validation logic.

### `suggestionsFromError(error: ZodError): string[]`

Converts Zod validation errors into human-friendly suggestions.

---

## 🚀 Integration Examples

### In a Build Script

```javascript
import { validateI18nConfig } from "@lingo.dev/i18n-validator";
import fs from "fs";

const config = JSON.parse(fs.readFileSync("i18n.json", "utf8"));
const result = validateI18nConfig(config);

if (!result.ok) {
  console.error("❌ Invalid i18n.json configuration");
  result.errors?.forEach(error => console.error(`  • ${error}`));
  process.exit(1);
}
```

### In a GitHub Action

```yaml
name: Validate i18n Config
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npx @lingo.dev/i18n-validator
```

### In a Pre-commit Hook

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lingo-validate-i18n"
    }
  }
}
```

---

## ❤️ Contributing

This validator improves developer experience within Lingo.dev by providing early feedback on i18n configurations. It helps catch misconfigurations before they reach production.

**Future improvements:**
- JSON Schema generation for IDE autocompletion
- Integration with popular bundlers (Webpack, Vite, etc.)
- Support for custom validation rules
- Performance optimizations for large configs

**Found an issue?** [Open an issue](https://github.com/lingodotdev/lingo.dev/issues) or submit a PR!

---

## 📄 License

MIT © Lingo.dev
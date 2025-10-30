# Lingo.dev Troubleshooting Guide

This guide helps you resolve common issues when using Lingo.dev tools.  
If you don't find your issue here, check our [Discord community](https://lingo.dev/go/discord) or [open an issue](https://github.com/lingodotdev/lingo.dev/issues).

---

## Table of Contents

- [Compiler Issues](#compiler-issues)
- [CLI Issues](#cli-issues)
- [CI/CD Issues](#cicd-issues)
- [SDK Issues](#sdk-issues)
- [General Issues](#general-issues)
- [Still Having Issues?](#still-having-issues)
- [Contributing](#contributing)

---

## Compiler Issues

### Issue: Build fails with "Cannot find module 'lingo.dev/compiler'"

**Symptoms:**
```
Error: Cannot find module 'lingo.dev/compiler'
```

**Cause:**  
The package is not installed or not properly linked.

**Solution:**
```
# Clean install
rm -rf node_modules package-lock.json
npm install

# Verify installation
npm list lingo.dev
```

**Prevention:**  
Ensure `lingo.dev` is listed in your `package.json` dependencies.

---

### Issue: Locale bundles not generating during build

**Symptoms:**
- Build completes successfully.
- No Spanish/French/other locale files appear in output.
- Only default locale works.

**Cause:**
1. Configuration not properly applied to build tool.
2. Source locale matches target locale.
3. Build cache not cleared.

**Solution:**

For **Next.js**:
```
// next.config.js
import lingoCompiler from "lingo.dev/compiler";

const nextConfig = {
  // your existing config
};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(nextConfig);
```

For **Vite**:
```
// vite.config.js
import { defineConfig } from 'vite';
import lingoCompiler from 'lingo.dev/compiler';

export default defineConfig({
  plugins: [
    lingoCompiler.vite({
      sourceLocale: "en",
      targetLocales: ["es", "fr"],
    }),
  ],
});
```

Clear build cache and rebuild:
```
# Next.js
rm -rf .next
npm run build

# Vite
rm -rf dist
npm run build
```

**Prevention:**
- Verify configuration is applied correctly.
- Ensure `targetLocales` differ from `sourceLocale`.
- Clear cache when changing configuration.

---

### Issue: TypeScript errors after adding compiler

**Symptoms:**
```
Type error: Property 'locale' does not exist on type 'IntrinsicAttributes'
```

**Cause:**  
TypeScript types not properly configured for Lingo.dev.

**Solution:**
Add this to your `tsconfig.json`:
```
{
  "compilerOptions": {
    "types": ["lingo.dev/compiler"]
  }
}
```

Restart TypeScript server:
- VS Code: `Cmd/Ctrl + Shift + P` → "TypeScript: Restart TS Server"

**Prevention:**  
Include type definitions in the initial setup.

---

### Issue: Hot reload not working with locale changes

**Symptoms:**
- Changing text in component doesn't reflect immediately.
- Requires restarting dev server.

**Cause:**  
Dev server cache not invalidating on translation changes.

**Solution:**
```
# Restart dev server
npm run dev
```

For persistent issues, clear `.next` or `dist` directory.

**Prevention:**  
Restart dev server when making significant translation changes (known limitation).

---

## CLI Issues

### Issue: "API key not found" error

**Symptoms:**
```
Error: LINGODOTDEV_API_KEY environment variable is not set
```

**Cause:**  
API key not configured in environment.

**Solution:**

Option 1: Environment variable (recommended for CI/CD)
```
export LINGODOTDEV_API_KEY="your-api-key-here"
npx lingo.dev@latest run
```

Option 2: `.env` file (recommended for local development)
```
LINGODOTDEV_API_KEY=your-api-key-here
```

Option 3: Pass directly (not recommended)
```
LINGODOTDEV_API_KEY=your-key npx lingo.dev@latest run
```

Get your API key from: https://lingo.dev/dashboard

**Prevention:**
- Add `.env` to `.gitignore`.
- Use environment variables in CI/CD.
- Never commit API keys.

---

### Issue: CLI not translating certain files

**Symptoms:**
- Some JSON files translated; others skipped.
- No error messages.

**Cause:**  
File pattern mismatch or files in ignored directories.

**Solution:**

Check your `lingo.config.json`:
```
{
  "include": ["src/**/*.json", "locales/**/*.json"],
  "exclude": ["node_modules/**", "dist/**"]
}
```

Test glob pattern:
```
npx lingo.dev@latest run --dry-run
```

**Prevention:**
- Use specific patterns.
- Test with `--dry-run`.
- Keep translation files separate.

---

### Issue: Translation cache causing outdated translations

**Symptoms:**
- Updated source text not reflected.
- Translations still show old text.

**Cause:**  
CLI caches translations to avoid reprocessing unchanged strings.

**Solution:**
```
npx lingo.dev@latest run --no-cache
```
Or manually remove cache:
```
rm -rf .lingo-cache
npx lingo.dev@latest run
```

**Prevention:**  
Use `--no-cache` when making major content updates.

---

### Issue: Permission denied when running CLI

**Symptoms:**
```
Error: EACCES: permission denied, open 'locales/es.json'
```

**Cause:**  
CLI lacks permission to write in output directory.

**Solution:**
```
ls -la locales/
chmod -R u+w locales/
```

(Or: sudo npx lingo.dev@latest run – use sudo only as a last resort.)

**Prevention:**  
Verify write permissions before running CLI.

---

## CI/CD Issues

### Issue: GitHub Actions workflow fails with authentication error

**Symptoms:**
```
Error: Authentication failed. Please check your API key.
```

**Cause:**  
API key not configured as GitHub Secret.

**Solution:**
1. In GitHub: Settings → Secrets and variables → Actions.
2. Add secret `LINGODOTDEV_API_KEY`.
3. Use it in workflow:
```
jobs:
  i18n:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: lingodotdev/lingo.dev@main
        with:
          api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

**Prevention:**  
Use Secrets, never hardcode keys.

---

### Issue: Workflow fails due to Node.js version

**Symptoms:**
```
Error: Node.js version 14.x is not supported.
```

**Cause:**  
Outdated Node.js version.

**Solution:**
```
- uses: actions/setup-node@v4
  with:
    node-version: '20'
```

**Prevention:**  
Always specify Node.js version in workflow.

---

### Issue: Workflow creates large PR with all translations

**Symptoms:**
- Each push regenerates full translations.
- PR contains massive changes.

**Cause:**  
Cache not preserved across runs.

**Solution:**
```
- name: Cache Lingo.dev translations
  uses: actions/cache@v3
  with:
    path: .lingo-cache
    key: lingo-${{ hashFiles('**/*.json') }}
```

**Prevention:**  
Enable caching in workflows.

---

## SDK Issues

### Issue: Rate limit exceeded error

**Symptoms:**
```
Error: Rate limit exceeded.
```

**Cause:**  
Too many API requests in a short time.

**Solution:**
Implement caching:
```
const cache = new Map();

async function translateWithCache(content, options) {
  const key = JSON.stringify({ content, options });
  if (cache.has(key)) return cache.get(key);
  const result = await lingoDotDev.localizeObject(content, options);
  cache.set(key, result);
  return result;
}
```

**Prevention:**  
Cache translations and batch requests.

---

### Issue: SDK returns partial translations

**Symptoms:**
- Some keys untranslated.
- No errors shown.

**Cause:**  
Timeout or invalid characters.

**Solution:**
Break large objects:
```
const entries = Object.entries(content);
for (let i = 0; i < entries.length; i += 50) {
  const chunk = Object.fromEntries(entries.slice(i, i + 50));
  await lingoDotDev.localizeObject(chunk, options);
}
```

**Prevention:**  
Limit to ≤100 keys; use retries.

---

### Issue: TypeScript types not working with SDK

**Symptoms:**
```
Property 'localizeObject' does not exist on type 'LingoDotDevEngine'
```

**Cause:**  
Types not imported.

**Solution:**
```
import { LingoDotDevEngine } from "lingo.dev/sdk";
import type { LocalizeOptions } from "lingo.dev/sdk";
```

**Prevention:**  
Enable `strict` mode in TypeScript.

---

## General Issues

### Issue: "Module not found" after installation

**Symptoms:**
```
Error: Cannot find module 'lingo.dev'
```

**Cause:**  
Package not installed or cache issue.

**Solution:**
```
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm list lingo.dev
```

**Prevention:**  
Use a consistent package manager and lock file.

---

### Issue: Incompatible Node.js version

**Symptoms:**
```
Error: The engine "node" is incompatible with this module.
```

**Cause:**  
Using Node.js below 18.x.

**Solution:**
```
nvm install 20
nvm use 20
```

**Prevention:**  
Add `.nvmrc` and specify engines in `package.json`.

---

### Issue: Configuration file not being read

**Symptoms:**
- CLI ignores `lingo.config.json`.

**Cause:**  
File misplaced or invalid JSON.

**Solution:**
```
ls -la lingo.config.json
cat lingo.config.json | jq .
```

Sample config:
```
{
  "sourceLocale": "en",
  "targetLocales": ["es", "fr"],
  "include": ["src/**/*.json"],
  "exclude": ["node_modules/**"]
}
```

**Prevention:**  
Keep file in project root and validate JSON.

---

### Issue: Translations contain HTML entities instead of special characters

**Symptoms:**
- Translated text shows `&apos;` instead of `'`
- Shows `&quot;` instead of `"`
- Shows `&#39;` instead of apostrophes

**Cause:**  
Translation API returns HTML-encoded strings.

**Solution:**
Decode HTML entities in your code:
```
function decodeHTMLEntities(text) {
  const entities = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
  };
  return text.replace(/&[a-z]+;|&#\d+;/g, match => entities[match] || match);
}
```
Or use a library:
```
npm install he
```
```
import he from 'he';
const decoded = he.decode(translatedText);
```

**Prevention:**  
Post-process all translations with HTML entity decoder.

---

## Still Having Issues?

If your issue isn't listed here:

1. Check the documentation: https://lingo.dev/
2. Search existing issues: https://github.com/lingodotdev/lingo.dev/issues
3. Join Discord community: https://lingo.dev/go/discord
4. Open a new issue: https://github.com/lingodotdev/lingo.dev/issues/new

When reporting an issue, please include:
- Operating system and version
- Node.js version (`node --version`)
- Package manager and version (`npm --version`)
- Lingo.dev package version
- Minimal reproduction code
- Error messages (full stack trace)
- Steps you've already tried

---

## Contributing

Found a solution to an issue not listed here? Please contribute!

1. Fork the repository
2. Add your solution to this file
3. Submit a pull request

Thank you for helping improve Lingo.dev!
```
# Update for new troubleshooting guide

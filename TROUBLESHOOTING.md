#  Troubleshooting Guide

This guide helps you resolve common issues when using Lingo.dev tools. If you don't find your issue here, check our [Discord community](https://lingo.dev/go/discord) or [open an issue](https://github.com/lingodotdev/lingo.dev/issues).

---

##  Table of Contents

- [Compiler Issues](#compiler-issues)
- [CLI Issues](#cli-issues)
- [CI/CD Issues](#cicd-issues)
- [SDK Issues](#sdk-issues)
- [General Issues](#general-issues)

---

##  Compiler Issues

### Issue: Build fails with "Cannot find module 'lingo.dev/compiler'"

**Symptoms:**
```
Error: Cannot find module 'lingo.dev/compiler'
```

**Cause:**
The package is not installed or not properly linked.

**Solution:**
```bash
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
- Build completes successfully
- No Spanish/French/other locale files appear in output
- Only default locale works

**Cause:**
1. Configuration not properly applied to build tool
2. Source locale matches target locale
3. Build cache not cleared

**Solution:**

For **Next.js**:
```javascript
// next.config.js
import lingoCompiler from "lingo.dev/compiler";

const nextConfig = {
  // your existing config
};

// Make sure this wraps your config
export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"], // Check these are different from sourceLocale
})(nextConfig);
```

For **Vite**:
```javascript
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

**Clear build cache and rebuild:**
```bash
# Next.js
rm -rf .next
npm run build

# Vite
rm -rf dist
npm run build
```

**Prevention:**
- Always verify configuration is applied correctly
- Check that `targetLocales` are different from `sourceLocale`
- Clear cache when changing configuration

---

### Issue: TypeScript errors after adding compiler

**Symptoms:**
```
Type error: Property 'locale' does not exist on type 'IntrinsicAttributes'
```

**Cause:**
TypeScript types not properly configured for Lingo.dev.

**Solution:**

Add to your `tsconfig.json`:
```json
{
  "compilerOptions": {
    "types": ["lingo.dev/compiler"]
  }
}
```

Restart your TypeScript server:
- VS Code: `Cmd/Ctrl + Shift + P` → "TypeScript: Restart TS Server"

**Prevention:**
Include type definitions in initial setup.

---

### Issue: Hot reload not working with locale changes

**Symptoms:**
- Change text in component
- Page doesn't update with new translations
- Need to restart dev server

**Cause:**
Dev server cache not invalidating on translation changes.

**Solution:**
```bash
# Restart dev server
# Next.js
npm run dev

# Vite  
npm run dev
```

For persistent issues, clear `.next` or `dist` folder.

**Prevention:**
This is a known limitation. Restart dev server when making significant translation changes.

---

##  CLI Issues

### Issue: "API key not found" error

**Symptoms:**
```
Error: LINGODOTDEV_API_KEY environment variable is not set
```

**Cause:**
API key not configured in environment.

**Solution:**

**Option 1: Environment variable (recommended for CI/CD)**
```bash
export LINGODOTDEV_API_KEY="your-api-key-here"
npx lingo.dev@latest run
```

**Option 2: .env file (recommended for local development)**
Create `.env` file in project root:
```
LINGODOTDEV_API_KEY=your-api-key-here
```

**Option 3: Pass directly (not recommended - exposes key in history)**
```bash
LINGODOTDEV_API_KEY=your-key npx lingo.dev@latest run
```

Get your API key from: https://lingo.dev/dashboard

**Prevention:**
- Add `.env` to `.gitignore`
- Use environment variables in CI/CD
- Never commit API keys to version control

---

### Issue: CLI not translating certain files

**Symptoms:**
- Some JSON files are translated
- Others are skipped
- No error messages

**Cause:**
File pattern doesn't match or files are in ignored directories.

**Solution:**

Check your `lingo.config.json`:
```json
{
  "include": ["src/**/*.json", "locales/**/*.json"],
  "exclude": ["node_modules/**", "dist/**"]
}
```

Common issues:
- Files in `node_modules` (always excluded)
- Files not matching glob pattern
- Files in build output directories

Test your glob pattern:
```bash
# List files that would be processed
npx lingo.dev@latest run --dry-run
```

**Prevention:**
- Use specific include patterns
- Test with `--dry-run` flag first
- Keep translation files in dedicated directories

---

### Issue: Translation cache causing outdated translations

**Symptoms:**
- Updated source text
- Translations still show old text
- Rebuilding doesn't help

**Cause:**
CLI caches translations to avoid re-translating unchanged strings.

**Solution:**
```bash
# Clear cache and re-translate
npx lingo.dev@latest run --no-cache

# Or delete cache manually
rm -rf .lingo-cache
npx lingo.dev@latest run
```

**Prevention:**
Use `--no-cache` flag when you've made significant changes to source content.

---

### Issue: Permission denied when running CLI

**Symptoms:**
```
Error: EACCES: permission denied, open 'locales/es.json'
```

**Cause:**
CLI doesn't have write permissions for output directory.

**Solution:**
```bash
# Check directory permissions
ls -la locales/

# Fix permissions
chmod -R u+w locales/

# Or run with sudo (not recommended)
sudo npx lingo.dev@latest run
```

**Prevention:**
Ensure your user has write permissions for output directories before running CLI.

---

##  CI/CD Issues

### Issue: GitHub Actions workflow fails with authentication error

**Symptoms:**
```
Error: Authentication failed. Please check your API key.
```

**Cause:**
API key not properly configured in GitHub Secrets.

**Solution:**

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `LINGODOTDEV_API_KEY`
5. Value: Your API key from https://lingo.dev/dashboard
6. Click **Add secret**

Update your workflow file:
```yaml
# .github/workflows/i18n.yml
name: Lingo.dev i18n
on: [push]
jobs:
  i18n:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: lingodotdev/lingo.dev@main
        with:
          api-key: ${{ secrets.LINGODOTDEV_API_KEY }}  # Correct reference
```

**Prevention:**
- Always use GitHub Secrets for API keys
- Never hardcode API keys in workflow files
- Test locally before pushing

---

### Issue: Workflow fails with "Node.js version not supported"

**Symptoms:**
```
Error: Node.js version 14.x is not supported. Please use 18.x or higher.
```

**Cause:**
GitHub Actions runner using outdated Node.js version.

**Solution:**

Update your workflow to specify Node.js version:
```yaml
# .github/workflows/i18n.yml
name: Lingo.dev i18n
on: [push]
jobs:
  i18n:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      # Add Node.js setup
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - uses: lingodotdev/lingo.dev@main
        with:
          api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

**Prevention:**
Always specify Node.js version in CI/CD workflows.

---

### Issue: Workflow creates massive PR with all translations

**Symptoms:**
- Every push triggers translation
- PRs have hundreds of changed files
- CI/CD costs increase

**Cause:**
Cache not being preserved between workflow runs.

**Solution:**

Add cache step to workflow:
```yaml
# .github/workflows/i18n.yml
name: Lingo.dev i18n
on: [push]
jobs:
  i18n:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      # Add cache
      - name: Cache Lingo.dev translations
        uses: actions/cache@v3
        with:
          path: .lingo-cache
          key: lingo-${{ hashFiles('**/*.json') }}
      
      - uses: lingodotdev/lingo.dev@main
        with:
          api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

**Prevention:**
Always configure caching in CI/CD pipelines.

---

##  SDK Issues

### Issue: Rate limit exceeded error

**Symptoms:**
```
Error: Rate limit exceeded. Please try again later.
```

**Cause:**
Making too many API requests in short period.

**Solution:**

Implement rate limiting and caching:
```javascript
import { LingoDotDevEngine } from "lingo.dev/sdk";

const lingoDotDev = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY,
});

// Add simple in-memory cache
const translationCache = new Map();

async function translateWithCache(content, options) {
  const cacheKey = JSON.stringify({ content, options });
  
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }
  
  const result = await lingoDotDev.localizeObject(content, options);
  translationCache.set(cacheKey, result);
  
  return result;
}

// Use cache
const translated = await translateWithCache(content, {
  sourceLocale: "en",
  targetLocale: "es",
});
```

**Prevention:**
- Cache translations on your server
- Batch requests when possible
- Use Compiler/CLI for static content

---

### Issue: SDK returns partial translations

**Symptoms:**
- Some object keys are translated
- Others remain in source language
- No error thrown

**Cause:**
1. API timeout on large objects
2. Invalid characters in certain keys
3. Rate limiting

**Solution:**

Break large objects into smaller chunks:
```javascript
import { LingoDotDevEngine } from "lingo.dev/sdk";

const lingoDotDev = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY,
});

async function translateLargeObject(content, options) {
  const entries = Object.entries(content);
  const chunkSize = 50; // Translate 50 keys at a time
  const results = {};
  
  for (let i = 0; i < entries.length; i += chunkSize) {
    const chunk = Object.fromEntries(entries.slice(i, i + chunkSize));
    const translated = await lingoDotDev.localizeObject(chunk, options);
    Object.assign(results, translated);
    
    // Add delay between chunks to avoid rate limiting
    if (i + chunkSize < entries.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}
```

**Prevention:**
- Keep objects under 100 keys
- Add error handling and retries
- Implement exponential backoff

---

### Issue: TypeScript types not working with SDK

**Symptoms:**
```
Property 'localizeObject' does not exist on type 'LingoDotDevEngine'
```

**Cause:**
TypeScript types not properly imported.

**Solution:**

Ensure proper imports:
```typescript
import { LingoDotDevEngine } from "lingo.dev/sdk";
import type { LocalizeOptions } from "lingo.dev/sdk";

const lingoDotDev = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY!,
});

const options: LocalizeOptions = {
  sourceLocale: "en",
  targetLocale: "es",
};

const translated = await lingoDotDev.localizeObject(content, options);
```

Restart TypeScript server if needed.

**Prevention:**
Use TypeScript's `strict` mode to catch type issues early.

---

##  General Issues

### Issue: "Module not found" after installation

**Symptoms:**
```
Error: Cannot find module 'lingo.dev'
```

**Cause:**
1. Package not installed
2. Node modules not linked
3. Package manager cache issue

**Solution:**

Try these steps in order:
```bash
# 1. Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# 2. If using yarn
rm -rf node_modules yarn.lock
yarn cache clean
yarn install

# 3. If using pnpm
rm -rf node_modules pnpm-lock.yaml
pnpm store prune
pnpm install

# 4. Verify installation
npm list lingo.dev
```

**Prevention:**
- Commit `package-lock.json` or `yarn.lock`
- Use consistent package manager across team
- Don't mix package managers

---

### Issue: Incompatible Node.js version

**Symptoms:**
```
Error: The engine "node" is incompatible with this module.
```

**Cause:**
Using Node.js version below minimum requirement.

**Solution:**

Check your Node.js version:
```bash
node --version
```

Lingo.dev requires Node.js 18.x or higher.

**Update Node.js:**

Using **nvm** (recommended):
```bash
# Install nvm if you haven't
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use Node.js 20
nvm install 20
nvm use 20
```

Or download from: https://nodejs.org/

**Prevention:**
- Use nvm to manage Node.js versions
- Add `.nvmrc` file to project:
  ```
  20
  ```
- Specify engine in `package.json`:
  ```json
  {
    "engines": {
      "node": ">=18.0.0"
    }
  }
  ```

---

### Issue: Configuration file not being read

**Symptoms:**
- Created `lingo.config.json`
- CLI ignores configuration
- Uses default settings

**Cause:**
1. File in wrong location
2. Invalid JSON syntax
3. Wrong file name

**Solution:**

Verify configuration file:
```bash
# File must be in project root
ls -la lingo.config.json

# Validate JSON syntax
cat lingo.config.json | jq .
# If jq is not installed: python -m json.tool lingo.config.json
```

Correct file structure:
```json
{
  "sourceLocale": "en",
  "targetLocales": ["es", "fr"],
  "include": ["src/**/*.json"],
  "exclude": ["node_modules/**"]
}
```

**Prevention:**
- Keep config in project root
- Use JSON validator in editor
- Add JSON schema for autocomplete

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
```javascript
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

// Apply to translations
const decoded = decodeHTMLEntities(translatedText);
```

Or use a library:
```bash
npm install he
```

```javascript
import he from 'he';
const decoded = he.decode(translatedText);
```

**Prevention:**
Post-process all translations with HTML entity decoder.

---

## Still Having Issues?

If your issue isn't listed here:

1. **Check the documentation**: https://lingo.dev/
2. **Search existing issues**: https://github.com/lingodotdev/lingo.dev/issues
3. **Join Discord community**: https://lingo.dev/go/discord
4. **Open a new issue**: https://github.com/lingodotdev/lingo.dev/issues/new

When reporting an issue, please include:
- Operating system and version
- Node.js version (`node --version`)
- Package manager and version (`npm --version`)
- Lingo.dev package version
- Minimal reproduction code
- Error messages (full stack trace)
- Steps you've already tried

---

##  Contributing

Found a solution to an issue not listed here? Please contribute!

1. Fork the repository
2. Add your solution to this file
3. Submit a pull request

Thank you for helping improve Lingo.dev! 🎉
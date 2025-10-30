# 🔧 Troubleshooting Guide

This guide helps you resolve common issues encountered when using Lingo.dev tools.

## Table of Contents

- [Compiler Issues](#compiler-issues)
- [CLI Issues](#cli-issues)
- [CI/CD Issues](#cicd-issues)
- [SDK Issues](#sdk-issues)
- [Integration Issues](#integration-issues)
- [General Issues](#general-issues)

---

## Compiler Issues

### Build Errors with Next.js/Vite/Webpack

**Problem**: Build fails with module resolution errors or compilation errors.

**Symptoms**:
```
Error: Cannot find module '@lingo.dev/compiler'
Module not found: Can't resolve 'lingo.config.ts'
```

**Solution**:
1. Ensure the compiler is properly installed:
   ```bash
   pnpm add -D @lingo.dev/compiler
   ```

2. Verify your `lingo.config.ts` is in the project root:
   ```typescript
   import { defineConfig } from '@lingo.dev/compiler';

   export default defineConfig({
     sourceLocale: 'en',
     targetLocales: ['es', 'fr', 'de'],
   });
   ```

3. Clear build cache and reinstall:
   ```bash
   rm -rf .next node_modules .lingo
   pnpm install
   ```

**Prevention**: Always use the latest stable version and follow the integration guide for your framework.

---

### Locale Files Not Generating

**Problem**: Translation files are not being generated during build.

**Symptoms**:
- No `.lingo` directory created
- Missing locale JSON files
- Translations not showing up in the app

**Cause**: Configuration issues or compiler plugin not registered.

**Solution**:

For **Next.js**:
```typescript
// next.config.ts
import lingo from '@lingo.dev/compiler/next';

const config = {
  // your config
};

export default lingo(config);
```

For **Vite**:
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import lingo from '@lingo.dev/compiler/vite';

export default defineConfig({
  plugins: [lingo()],
});
```

**Prevention**: Double-check that the compiler plugin is properly integrated in your build configuration.

---

### TypeScript Errors with Generated Types

**Problem**: TypeScript errors related to locale types or auto-generated declarations.

**Symptoms**:
```
Type error: Cannot find name 'i18n'
Property 'locale' does not exist on type
```

**Solution**:
1. Ensure TypeScript is configured to include generated types:
   ```json
   // tsconfig.json
   {
     "include": ["src", ".lingo/**/*"]
   }
   ```

2. Restart your TypeScript server:
   - VS Code: `Cmd/Ctrl + Shift + P` → "Restart TS Server"

3. Run the compiler once to generate types:
   ```bash
   pnpm lingo compile
   ```

**Prevention**: Include `.lingo` directory in your TypeScript configuration from the start.

---

### Hot Reload Not Working

**Problem**: Changes to source locale don't trigger recompilation during development.

**Symptoms**: 
- Need to restart dev server to see translation updates
- New strings not picked up automatically

**Solution**:
1. Enable watch mode in your config:
   ```typescript
   export default defineConfig({
     sourceLocale: 'en',
     targetLocales: ['es', 'fr'],
     watch: true, // Enable in development
   });
   ```

2. Ensure dev server is running with proper flags:
   ```bash
   pnpm dev --watch
   ```

**Prevention**: Use watch mode during development and production mode for builds.

---

## CLI Issues

### API Key Configuration Problems

**Problem**: CLI fails to authenticate with translation service.

**Symptoms**:
```
Error: Missing API key
Authentication failed
401 Unauthorized
```

**Solution**:
1. Set your API key as an environment variable:
   ```bash
   export LINGO_API_KEY="your-api-key-here"
   ```

2. Or create a `.env` file:
   ```env
   LINGO_API_KEY=your-api-key-here
   ```

3. Verify the key is loaded:
   ```bash
   echo $LINGO_API_KEY
   ```

**Prevention**: Add `.env` to `.gitignore` and document API key setup in your project README.

---

### File Pattern Matching Issues

**Problem**: CLI doesn't find files to translate or processes unwanted files.

**Symptoms**:
- "No files found" message
- Translating node_modules or dist folders

**Cause**: Incorrect glob patterns in configuration.

**Solution**:
```typescript
export default defineConfig({
  sourceLocale: 'en',
  targetLocales: ['es', 'fr'],
  include: ['src/**/*.{ts,tsx,js,jsx}'],
  exclude: ['node_modules/**', 'dist/**', '.next/**'],
});
```

**Prevention**: Test your glob patterns using tools like [glob.dev](https://glob.dev).

---

### Translation Cache Problems

**Problem**: Translations not updating despite changes to source files.

**Symptoms**:
- Old translations persist
- Changes to source strings not reflected

**Solution**:
1. Clear the translation cache:
   ```bash
   rm -rf .lingo/cache
   pnpm lingo compile --no-cache
   ```

2. Force regeneration:
   ```bash
   pnpm lingo compile --force
   ```

**Prevention**: Use `--no-cache` flag when debugging translation issues.

---

### Permission Errors

**Problem**: CLI fails with EACCES or permission denied errors.

**Symptoms**:
```
Error: EACCES: permission denied
Error: EPERM: operation not permitted
```

**Solution**:
1. Check file/directory permissions:
   ```bash
   ls -la .lingo/
   ```

2. Fix ownership if needed:
   ```bash
   sudo chown -R $USER:$USER .lingo/
   ```

3. On Windows, run terminal as Administrator if necessary.

**Prevention**: Ensure your project directory has proper permissions before running CLI commands.

---

## CI/CD Issues

### GitHub Actions Authentication

**Problem**: GitHub Actions workflow fails to authenticate with Lingo API.

**Symptoms**:
```
Error: Authentication failed in CI
Secrets not available
```

**Solution**:
1. Add API key to repository secrets:
   - Go to Settings → Secrets → Actions
   - Add `LINGO_API_KEY`

2. Use secret in workflow:
   ```yaml
   - name: Run Lingo
     env:
       LINGO_API_KEY: ${{ secrets.LINGO_API_KEY }}
     run: pnpm lingo compile
   ```

**Prevention**: Always use repository secrets for sensitive credentials.

---

### Workflow Failures

**Problem**: CI workflow fails during Lingo compilation step.

**Solution**:
1. Check Node.js version matches your local environment:
   ```yaml
   - uses: actions/setup-node@v4
     with:
       node-version: '20'
   ```

2. Ensure dependencies are installed:
   ```yaml
   - name: Install dependencies
     run: pnpm install --frozen-lockfile
   ```

3. Add caching for faster builds:
   ```yaml
   - uses: pnpm/action-setup@v2
   - uses: actions/cache@v4
     with:
       path: ~/.pnpm-store
       key: ${{ runner.os }}-pnpm-${{ hashFiles('pnpm-lock.yaml') }}
   ```

**Prevention**: Test CI configuration locally using [act](https://github.com/nektos/act).

---

### Environment Variable Setup

**Problem**: Environment variables not available during CI build.

**Solution**:
```yaml
env:
  LINGO_API_KEY: ${{ secrets.LINGO_API_KEY }}
  NODE_ENV: production
```

**Prevention**: Document all required environment variables in your CI configuration.

---

## SDK Issues

### API Rate Limiting

**Problem**: Requests fail with rate limit errors.

**Symptoms**:
```
Error: 429 Too Many Requests
Rate limit exceeded
```

**Solution**:
1. Implement exponential backoff:
   ```typescript
   import { Lingo } from '@lingo.dev/sdk';

   const lingo = new Lingo({
     apiKey: process.env.LINGO_API_KEY,
     retry: {
       maxRetries: 3,
       backoff: 'exponential',
     },
   });
   ```

2. Use batch operations when possible:
   ```typescript
   const results = await lingo.translate.batch([
     { text: 'Hello', locale: 'es' },
     { text: 'World', locale: 'fr' },
   ]);
   ```

**Prevention**: Monitor your API usage and upgrade plan if needed.

---

### Authentication Errors

**Problem**: SDK throws authentication errors.

**Symptoms**:
```
Error: Invalid API key
401 Unauthorized
```

**Solution**:
1. Verify API key is correct:
   ```typescript
   const lingo = new Lingo({
     apiKey: process.env.LINGO_API_KEY,
   });
   ```

2. Check key permissions in dashboard.

**Prevention**: Use environment variables and never commit API keys to version control.

---

### Response Format Issues

**Problem**: Unexpected response format from SDK methods.

**Solution**:
1. Check SDK version compatibility:
   ```bash
   pnpm list @lingo.dev/sdk
   ```

2. Update to latest version:
   ```bash
   pnpm add @lingo.dev/sdk@latest
   ```

3. Review API documentation for response structure.

**Prevention**: Pin SDK versions and test updates in development first.

---

## Integration Issues

### Next.js App Router Issues

**Problem**: Translations not working in Next.js App Router (app directory).

**Solution**:
```typescript
// app/[locale]/layout.tsx
import { getI18n } from '@lingo.dev/react';

export default async function Layout({
  params,
  children,
}: {
  params: { locale: string };
  children: React.ReactNode;
}) {
  const i18n = await getI18n(params.locale);
  
  return (
    <html lang={params.locale}>
      <body>{children}</body>
    </html>
  );
}
```

**Prevention**: Follow the App Router integration guide carefully.

---

### Vite Build Errors

**Problem**: Vite builds fail with Lingo compiler plugin.

**Solution**:
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import lingo from '@lingo.dev/compiler/vite';

export default defineConfig({
  plugins: [
    lingo({
      // Ensure correct ordering with other plugins
    }),
  ],
  build: {
    commonjsOptions: {
      include: [/@lingo.dev/],
    },
  },
});
```

**Prevention**: Check plugin ordering and build configuration.

---

### React Router v7 Issues

**Problem**: Locale switching not working properly in React Router.

**Solution**:
```typescript
// app/root.tsx
import { useI18n } from '@lingo.dev/react';

export default function Root() {
  const { locale, setLocale } = useI18n();
  
  return (
    <select value={locale} onChange={(e) => setLocale(e.target.value)}>
      <option value="en">English</option>
      <option value="es">Español</option>
    </select>
  );
}
```

**Prevention**: Use the provided hooks and follow React Router integration docs.

---

## General Issues

### Installation Problems

**Problem**: Package installation fails or gets stuck.

**Solution**:
1. Clear package manager cache:
   ```bash
   # npm
   npm cache clean --force
   
   # pnpm
   pnpm store prune
   
   # yarn
   yarn cache clean
   ```

2. Delete lock file and node_modules:
   ```bash
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

3. Use specific package manager version:
   ```bash
   corepack enable
   corepack prepare pnpm@latest --activate
   ```

**Prevention**: Use a consistent package manager across team and CI.

---

### Node Version Compatibility

**Problem**: Errors related to Node.js version incompatibility.

**Symptoms**:
```
Error: The engine "node" is incompatible
Unsupported Node.js version
```

**Solution**:
1. Check required Node version:
   ```bash
   cat package.json | grep "engines"
   ```

2. Install correct version:
   ```bash
   nvm install 20
   nvm use 20
   ```

3. Add `.nvmrc` file:
   ```
   20
   ```

**Prevention**: Use Node version managers (nvm, fnm, volta) and document required version.

---

### Configuration File Errors

**Problem**: Lingo config file has syntax or type errors.

**Solution**:
1. Validate your config:
   ```typescript
   // lingo.config.ts
   import { defineConfig } from '@lingo.dev/compiler';

   export default defineConfig({
     sourceLocale: 'en',
     targetLocales: ['es', 'fr', 'de'],
     // Ensure all options are valid
   });
   ```

2. Check for TypeScript errors:
   ```bash
   pnpm tsc --noEmit
   ```

**Prevention**: Use `defineConfig` helper for type safety and autocomplete.

---

### Memory Issues with Large Codebases

**Problem**: Build process runs out of memory.

**Symptoms**:
```
FATAL ERROR: Reached heap limit
JavaScript heap out of memory
```

**Solution**:
1. Increase Node.js memory limit:
   ```bash
   NODE_OPTIONS="--max-old-space-size=4096" pnpm build
   ```

2. Process files in batches:
   ```typescript
   export default defineConfig({
     sourceLocale: 'en',
     targetLocales: ['es', 'fr'],
     chunkSize: 50, // Process 50 files at a time
   });
   ```

**Prevention**: Optimize include/exclude patterns to process only necessary files.

---

## Still Having Issues?

If you're still experiencing problems after trying these solutions:

1. **Check the Docs**: Visit [lingo.dev/docs](https://lingo.dev/docs) for comprehensive guides
2. **Search Issues**: Look through [GitHub Issues](https://github.com/lingodotdev/lingo.dev/issues) for similar problems
3. **Ask the Community**: Join our [Discord](https://discord.gg/lingo) for help
4. **Report a Bug**: [Create a new issue](https://github.com/lingodotdev/lingo.dev/issues/new/choose) with detailed information

---

## Contributing

Found a solution that's not listed here? Please submit a PR to help other users! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

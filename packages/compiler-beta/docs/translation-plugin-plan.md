# Auto-Translation Plugin Implementation Plan

## Next.js 16 + Turbopack

---

## Overview

This plan outlines the implementation of an automatic translation plugin for Next.js 16 web apps using Turbopack. The plugin will:

- Automatically detect translatable text in JSX components
- Transform code at build time using Babel loader
- Manage translations via hash-based dictionary system
- Support cookie-based locale switching
- Handle on-demand translation generation in dev mode

---

## Phase 1: Core Infrastructure

### 1.1 File Structure Setup

```
project-root/
├── .lingo/
│   ├── metadata.json          # Source strings with context & hashes
│   ├── cache/
│   │   ├── en.json            # Cached translations per locale
│   │   ├── de.json
│   │   └── fr.json
│   └── config.json            # Plugin configuration
└── src/
    └── ... (user code)
```

**Tasks:**

- [ ] Create `.lingo` directory structure initialization
- [ ] Define metadata.json schema
- [ ] Define cache file schema (reuse DictionarySchema from existing code)
- [ ] Create config.json schema for plugin settings

**Metadata Schema:**

```typescript
{
  "version": "0.1",
  "entries": {
    "hash_abc123": {
      "sourceText": "Hello World",
      "context": {
        "componentName": "WelcomeMessage",
        "filePath": "src/components/Welcome.tsx"
      },
      "hash": "abc123",  // hash of sourceText + componentName + filePath
      "addedAt": "2025-01-15T10:30:00Z"
    }
  }
}
```

### 1.2 Locale Management

#### Cookie Helpers

**Tasks:**

- [ ] Create `src/lib/translation/locale-cookies.client.ts`
  - `getLocaleFromCookies()` - for client components (use `document.cookie`)
  - `setLocaleInCookies(locale: string)` - for client components
- [ ] Create `src/lib/translation/locale-cookies.server.ts`
  - `getLocaleFromCookies()` - for server components (use Next.js `cookies()`)
  - `setLocaleInCookies(locale: string)` - for server actions

**Implementation Details:**

```typescript
// Client version
export function getLocaleFromCookies(): string {
  const match = document.cookie.match(/locale=([^;]+)/);
  return match ? match[1] : "en"; // default to 'en'
}

export function setLocaleInCookies(locale: string): void {
  document.cookie = `locale=${locale}; path=/; max-age=31536000`; // 1 year
}

// Server version
import { cookies } from "next/headers";

export async function getLocaleFromCookies(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.get("locale")?.value || "en";
}

export async function setLocaleInCookies(locale: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("locale", locale, {
    path: "/",
    maxAge: 31536000, // 1 year
  });
}
```

### 1.3 Translation Context & Provider

**Tasks:**

- [ ] Create `src/lib/translation/TranslationContext.tsx`
  - Context to hold current locale and translation dictionary
  - Provider component to wrap entire app
  - Hook to subscribe to translation updates
  - Translation request batching system
  - Integration with router.refresh() for Server Components

**Context Schema:**

```typescript
type TranslationContextType = {
  locale: string;
  setLocale: (locale: string) => void;
  translations: Record<string, string>; // hash -> translated text
  requestTranslation: (
    hash: string,
    sourceText: string,
    context: TranslationContext,
  ) => void;
  isLoading: boolean;
};
```

**Implementation Details:**

```typescript
// TranslationProvider.tsx
'use client';
import { createContext, useContext, useState, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export function TranslationProvider({ children, initialLocale }) {
  const [locale, setLocaleState] = useState(initialLocale);
  const [translations, setTranslations] = useState({});
  const [pendingTranslations, setPendingTranslations] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // Debounced batch translation request (100ms)
  const requestTranslationBatch = useDebouncedCallback(async () => {
    if (pendingTranslations.size === 0) return;

    setIsLoading(true);
    const hashes = Array.from(pendingTranslations);

    // Call translation API
    const newTranslations = await fetchTranslations(hashes, locale);

    setTranslations(prev => ({ ...prev, ...newTranslations }));
    setPendingTranslations(new Set());
    setIsLoading(false);
  }, 100);

  const requestTranslation = (hash, sourceText, context) => {
    if (translations[hash]) return; // Already have it

    setPendingTranslations(prev => new Set([...prev, hash]));
    requestTranslationBatch();
  };

  const setLocale = (newLocale) => {
    setLocaleState(newLocale);
    setTranslations({}); // Clear translations, will be requested again
    // Note: router.refresh() is called by LocaleSwitcher, not here
  };

  return (
    <TranslationContext.Provider value={{
      locale,
      setLocale,
      translations,
      requestTranslation,
      isLoading
    }}>
      {children}
    </TranslationContext.Provider>
  );
}
```

**Key Points:**

- Context manages translations for **Client Components**
- `setLocale()` updates context state
- `router.refresh()` is called from LocaleSwitcher to update **Server Components**
- Both happen in sequence for seamless locale switching

### 1.4 Locale Switcher Component

**Tasks:**

- [ ] Create `src/lib/translation/LocaleSwitcher.tsx`
  - Select dropdown with router.refresh() integration
  - Uses translation context to change locale for Client Components
  - Triggers Server Component re-render via router.refresh()
  - Shows loading state during transition

**Implementation:**

```typescript
'use client';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { setLocaleInCookies } from './locale-cookies.client';

export function LocaleSwitcher() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { locale, setLocale } = useTranslation();

  const handleLocaleChange = (newLocale: string) => {
    // 1. Update cookie (for Server Components to read)
    setLocaleInCookies(newLocale);

    // 2. Update context (for Client Components to re-render)
    setLocale(newLocale);

    // 3. Refresh Server Components without losing Client Component state
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <select
      value={locale}
      onChange={(e) => handleLocaleChange(e.target.value)}
      disabled={isPending}
      className="locale-switcher"
      style={{ opacity: isPending ? 0.5 : 1 }}
    >
      <option value="en">English</option>
      <option value="de">Deutsch</option>
      <option value="fr">Français</option>
      {/* Load from config */}
    </select>
  );
}
```

**How it works:**

1. User selects new locale
2. Cookie updated (Server Components will read this)
3. Context updated (Client Components re-render with new translations)
4. `router.refresh()` triggers Server Component re-render
5. Server Components get new translations from cookie
6. Client Components keep their state (forms, modals, scroll position)
7. React reconciles both updates smoothly - no full page reload!

**Manual Setup Required:**
User needs to:

1. Wrap their app with `<TranslationProvider>`
2. Add `<LocaleSwitcher />` component where needed

---

## Phase 2: AST Transformation & Babel Loader

### 2.1 Hash Generation Utility

**Tasks:**

- [ ] Create `src/lib/translation/hash-utils.ts`
  - Generate hash from sourceText + componentName + filePath
  - Use Node.js `crypto` module (MD5 or SHA256)

**Implementation:**

```typescript
import crypto from "crypto";

export function generateTranslationHash(
  sourceText: string,
  componentName: string,
  filePath: string,
): string {
  const input = `${sourceText}::${componentName}::${filePath}`;
  return crypto.createHash("md5").update(input).digest("hex").substring(0, 12); // Use first 12 chars for brevity
}
```

### 2.2 Babel Plugin for AST Transformation

**Tasks:**

- [ ] Create `babel-plugin-auto-translate.js`
  - Detect React/JSX components
  - Find JSX text nodes (text-only children)
  - Transform text to `{t("hash_xxx")}`
  - Inject `const t = useTranslation()` hook
  - Write to metadata.json file

**Detection Rules (Phase 1 - Simple):**

```
Translate if:
✓ JSX element has only text child (no nested elements)
✓ Text is not empty or whitespace-only
✓ Not inside specific skip attributes (alt, title, etc.)

Examples:
<div>Hello World</div>           → <div>{t("hash_abc")}</div>
<p>Welcome</p>                    → <p>{t("hash_def")}</p>
<span>Click here</span>           → <span>{t("hash_ghi")}</span>

Skip:
<div>Hello <strong>World</strong></div>  → Contains nested element
<img alt="Hello" />                      → Attribute, not content
<div>  </div>                            → Whitespace only
```

**Babel Plugin Structure:**

```javascript
module.exports = function ({ types: t }) {
  let componentName = null;
  let needsTranslationHook = false;
  const metadata = loadOrCreateMetadata();

  return {
    visitor: {
      // Capture component name
      FunctionDeclaration(path) {
        if (isReactComponent(path)) {
          componentName = path.node.id.name;
        }
      },

      ArrowFunctionExpression(path) {
        if (isReactComponent(path)) {
          componentName = inferComponentName(path);
        }
      },

      // Transform JSX text nodes
      JSXText(path) {
        const text = path.node.value.trim();
        if (!text || !componentName) return;

        const filePath = this.file.opts.filename;
        const hash = generateTranslationHash(text, componentName, filePath);

        // Add to metadata
        metadata.entries[hash] = {
          sourceText: text,
          context: { componentName, filePath },
          hash,
          addedAt: new Date().toISOString(),
        };

        // Replace text with {t("hash_xxx")}
        path.replaceWith(
          t.jsxExpressionContainer(
            t.callExpression(t.identifier("t"), [t.stringLiteral(hash)]),
          ),
        );

        needsTranslationHook = true;
      },

      // Inject useTranslation hook at component start
      Program: {
        exit(path) {
          if (needsTranslationHook) {
            injectTranslationHook(path, t);
            saveMetadata(metadata);
          }
        },
      },
    },
  };
};

function injectTranslationHook(path, t) {
  // Find the component function body
  // Insert: const t = useTranslation();
  // Handle both function components and arrow functions
}
```

### 2.3 Turbopack Loader Integration

**Tasks:**

- [ ] Create `turbopack-translation-loader.js`
- [ ] Configure Next.js to use the loader
- [ ] Test with various component patterns (both Client and Server Components)

**Loader Implementation:**

```javascript
// turbopack-translation-loader.js
const babel = require("@babel/core");
const translationPlugin = require("./babel-plugin-auto-translate");

module.exports = function (source) {
  const callback = this.async();

  // Only process .tsx, .jsx files that contain React components
  if (!this.resourcePath.match(/\.(tsx|jsx)$/)) {
    return callback(null, source);
  }

  babel.transform(
    source,
    {
      filename: this.resourcePath,
      plugins: [translationPlugin],
      presets: ["@babel/preset-react", "@babel/preset-typescript"],
    },
    (err, result) => {
      if (err) return callback(err);
      callback(null, result.code);
    },
  );
};
```

**Next.js Configuration:**

```javascript
// next.config.js
module.exports = {
  turbopack: {
    // Note: Using 'turbopack' not 'experimental.turbo' in Next.js 16
    rules: {
      "*.{tsx,jsx}": {
        loaders: ["./turbopack-translation-loader.js"],
        as: "*.js",
      },
    },
  },
};
```

**Important Notes:**

- Turbopack supports webpack loaders, including babel-loader
- No need for external build processes - loader runs automatically
- Works with both Client and Server Components

### 2.4 Server Components Support

**Challenge:** Server Components can't use React hooks like `useTranslation()`.

**Solution (inspired by next-intl):**
Create separate async translation functions for Server Components, combined with `router.refresh()` for locale switching.

**Tasks:**

- [ ] Create `src/lib/translation/getServerTranslation.ts`
  - Async function that works in Server Components
  - Reads from cache directly
  - No batching needed (runs server-side)

**Implementation:**

```typescript
// src/lib/translation/getServerTranslation.ts
import { getLocaleFromCookies } from "./locale-cookies.server";
import { loadMetadata, loadCacheDictionary } from "./cache-utils";

export async function getServerTranslation(hash: string): Promise<string> {
  const locale = await getLocaleFromCookies();
  const metadata = await loadMetadata();
  const sourceLocale = "en"; // from config

  // For source locale, return original text
  if (locale === sourceLocale) {
    return metadata.entries[hash]?.sourceText || hash;
  }

  // Load cached translations
  const cache = await loadCacheDictionary(locale);

  // Return translation or fallback to source
  return cache[hash] || metadata.entries[hash]?.sourceText || hash;
}

// Alternative: namespace-based version
export async function getServerTranslations() {
  const locale = await getLocaleFromCookies();
  // ... load all translations for the locale

  // Return a function similar to client-side `t()`
  return (hash: string) => {
    // lookup translation
  };
}
```

**Babel Plugin Modification:**
The plugin needs to detect if it's transforming a Server Component and inject the appropriate function:

```javascript
// In babel plugin
function isServerComponent(path) {
  // Server Components are async functions
  return path.node.async === true;
}

// In visitor
Program: {
  exit(path) {
    if (needsTranslationHook) {
      if (isServerComponent(componentPath)) {
        // Inject: const t = await getServerTranslations();
        injectServerTranslationFunction(path, t);
      } else {
        // Inject: const t = useTranslation();
        injectClientTranslationHook(path, t);
      }
      saveMetadata(metadata);
    }
  }
}
```

**Usage Pattern:**

```tsx
// Client Component (auto-transformed)
"use client";

export function ClientWelcome() {
  // Babel injects: const t = useTranslation();
  return <h1>{t("hash_abc")}</h1>;
}

// Server Component (auto-transformed)
export async function ServerWelcome() {
  // Babel injects: const t = await getServerTranslations();
  return <h1>{t("hash_abc")}</h1>;
}
```

**Locale Switching for Server Components:**
When locale changes:

1. LocaleSwitcher updates cookie
2. LocaleSwitcher calls `router.refresh()`
3. Server Components re-render, reading new locale from cookie
4. Client Components re-render from context update
5. **Client state is preserved** (forms, modals, scroll position)

**Important Notes:**

- Server Components re-render via `router.refresh()` without full page reload
- Client Component state is preserved during refresh
- Translations must be available in cache before SSR
- `router.refresh()` is called from LocaleSwitcher component

---

## Phase 3: Translation Runtime

### 3.1 useTranslation Hook (Client Components)

**Tasks:**

- [ ] Create `src/lib/translation/useTranslation.ts`
  - Access translation context
  - Return translation function `t(hash)`
  - Handle source locale vs target locale
  - Request translations on-demand

**Implementation:**

```typescript
export function useTranslation() {
  const { locale, translations, requestTranslation } =
    useContext(TranslationContext);

  const sourceLocale = "en"; // From config
  const metadata = useMetadata(); // Load metadata.json

  const t = useCallback(
    (hash: string) => {
      // For source locale, return original text
      if (locale === sourceLocale) {
        return metadata.entries[hash]?.sourceText || hash;
      }

      // Check if translation exists
      if (translations[hash]) {
        return translations[hash];
      }

      // Request translation (will be batched)
      const entry = metadata.entries[hash];
      if (entry) {
        requestTranslation(hash, entry.sourceText, entry.context);
      }

      // Return source text as fallback while loading
      return entry?.sourceText || hash;
    },
    [locale, translations, metadata],
  );

  return t;
}
```

### 3.2 Translation API Client

**Tasks:**

- [ ] Create `src/lib/translation/api-client.ts`
  - Batch translation requests
  - Call LCPAPI.translate() or equivalent
  - Handle errors and retries
  - Write results to cache

**Implementation:**

```typescript
export async function fetchTranslations(
  hashes: string[],
  targetLocale: string,
): Promise<Record<string, string>> {
  // Load metadata to get source texts
  const metadata = loadMetadata();

  // Build dictionary for translation
  const sourceDictionary = buildDictionaryFromHashes(hashes, metadata);

  // Check cache first
  const cache = LCPCache.readLocaleDictionary(targetLocale, {
    lingoDir: ".lingo",
    sourceRoot: process.cwd(),
    sourceLocale: "en", // from config
    lcp: { files: {} }, // minimal LCP schema
  });

  // Get only uncached entries
  const uncachedDictionary = getDictionaryDiff(sourceDictionary, cache);

  if (countEntries(uncachedDictionary) === 0) {
    // Everything cached, return from cache
    return extractTranslationsFromCache(cache, hashes);
  }

  // Translate uncached entries
  const newTranslations = await LCPAPI.translate(
    "lingo.dev", // or from config
    uncachedDictionary,
    "en", // source locale
    targetLocale,
    null, // optional prompt
  );

  // Merge with cache and save
  const fullDictionary = mergeDictionaries(newTranslations, cache);
  await LCPCache.writeLocaleDictionary(fullDictionary, {
    lingoDir: ".lingo",
    sourceRoot: process.cwd(),
    sourceLocale: "en",
    lcp: { files: {} },
  });

  // Return translations for requested hashes
  return extractTranslationsFromCache(fullDictionary, hashes);
}
```

### 3.3 Metadata Loader Hook

**Tasks:**

- [ ] Create hook to load metadata.json on client
- [ ] Consider caching strategy
- [ ] Handle file watching in dev mode

**Implementation:**

```typescript
// Simple version - load once
const metadataCache = { current: null };

export function useMetadata() {
  const [metadata, setMetadata] = useState(metadataCache.current);

  useEffect(() => {
    if (!metadataCache.current) {
      fetch("/.lingo/metadata.json")
        .then((r) => r.json())
        .then((data) => {
          metadataCache.current = data;
          setMetadata(data);
        });
    }
  }, []);

  return metadata;
}
```

---

## Phase 4: Integration & Workflow

### 4.1 Development Workflow

**Developer Steps:**

1. **Initial Setup:**

   ```bash
   # Install plugin
   npm install @yourorg/next-auto-translate

   # Initialize
   npx next-auto-translate init
   ```

2. **Wrap App:**

   ```tsx
   // app/layout.tsx (Server Component)
   import { TranslationProvider } from "@/lib/translation/TranslationContext";
   import { getLocaleFromCookies } from "@/lib/translation/locale-cookies.server";

   export default async function RootLayout({ children }) {
     const locale = await getLocaleFromCookies();

     return (
       <html>
         <body>
           <TranslationProvider initialLocale={locale}>
             {children}
           </TranslationProvider>
         </body>
       </html>
     );
   }
   ```

3. **Add Locale Switcher:**

   ```tsx
   // app/components/Header.tsx (Client Component)
   "use client";
   import { LocaleSwitcher } from "@/lib/translation/LocaleSwitcher";

   export function Header() {
     return (
       <header>
         <LocaleSwitcher />
       </header>
     );
   }
   ```

4. **Write Components Normally:**

   **Client Component:**

   ```tsx
   // app/components/ClientWelcome.tsx
   "use client";

   export function ClientWelcome() {
     return (
       <div>
         <h1>Welcome to our site</h1>
         <p>This text will be auto-translated</p>
       </div>
     );
   }
   ```

   **Server Component:**

   ```tsx
   // app/components/ServerWelcome.tsx
   export async function ServerWelcome() {
     return (
       <div>
         <h1>Welcome to our site</h1>
         <p>This text will be auto-translated</p>
       </div>
     );
   }
   ```

5. **Build Time:** Babel plugin transforms to:

   **Client Component (transformed):**

   ```tsx
   "use client";

   export function ClientWelcome() {
     const t = useTranslation();
     return (
       <div>
         <h1>{t("hash_abc123")}</h1>
         <p>{t("hash_def456")}</p>
       </div>
     );
   }
   ```

   **Server Component (transformed):**

   ```tsx
   export async function ServerWelcome() {
     const t = await getServerTranslations();
     return (
       <div>
         <h1>{t("hash_abc123")}</h1>
         <p>{t("hash_def456")}</p>
       </div>
     );
   }
   ```

6. **Runtime:**

   **Client Components:**

   - User switches locale
   - Cookie updated
   - Context updated
   - Components request translations (if needed)
   - System batches requests (100ms debounce)
   - Translations fetched/cached
   - Components re-render with translations

   **Server Components:**

   - User switches locale
   - Cookie updated
   - `router.refresh()` called
   - Server Components re-render with new locale from cookie
   - Translations loaded from cache during SSR
   - **Client state preserved** (forms, scroll, modals stay open)
   - No full page reload!

   **The Magic:**
   Both Client and Server Components update seamlessly, with Client state preserved throughout!

### 4.2 File Serving

**Tasks:**

- [ ] Serve metadata.json as static file
- [ ] Configure Next.js public directory or API route

**Options:**

**Option A: Copy to public during build**

```javascript
// In build script
fs.copyFileSync(".lingo/metadata.json", "public/.lingo/metadata.json");
```

**Option B: API route**

```typescript
// app/api/metadata/route.ts
export async function GET() {
  const metadata = await fs.readFile(".lingo/metadata.json", "utf-8");
  return new Response(metadata, {
    headers: { "Content-Type": "application/json" },
  });
}
```

---

## Phase 5: Error Handling & Edge Cases

### 5.1 Error Scenarios

**Tasks:**

- [ ] Handle translation API failures

  - Show source text as fallback
  - Retry with exponential backoff
  - Log errors for debugging

- [ ] Handle missing metadata entries

  - Log warning
  - Display hash as fallback
  - Option to skip transformation for that component

- [ ] Handle locale cookie issues
  - Default to source locale
  - Validate locale values

### 5.2 Loading States

**Tasks:**

- [ ] Add loading indicator to TranslationProvider
- [ ] Optional: show skeleton/shimmer during first load
- [ ] Consider transition animations

**Implementation:**

```tsx
export function TranslationProvider({ children }) {
  const { isLoading } = useTranslation();

  return (
    <>
      {isLoading && <TranslationLoadingIndicator />}
      {children}
    </>
  );
}
```

---

## Phase 6: Testing & Validation

### 6.1 Unit Tests

**Test Coverage:**

- [ ] Hash generation consistency
- [ ] Babel plugin transformation
  - Simple text nodes
  - Nested components (should skip)
  - Empty text (should skip)
  - Whitespace-only (should skip)
- [ ] Translation context
  - Locale switching
  - Request batching
  - Cache hits/misses
- [ ] Cookie helpers (client & server)

### 6.2 Integration Tests

**Test Scenarios:**

- [ ] Full workflow: write component → transform → render → translate
- [ ] Locale switching updates UI
- [ ] Cache persistence across sessions
- [ ] Multiple components requesting same translation
- [ ] Concurrent translation requests

### 6.3 Performance Tests

**Metrics:**

- [ ] Babel transformation time impact
- [ ] Translation batch size vs latency
- [ ] Cache lookup performance
- [ ] Memory usage with large dictionaries

---

## Phase 7: Documentation

### 7.1 User Documentation

**Tasks:**

- [ ] Installation guide
- [ ] Quick start tutorial
- [ ] Configuration reference
- [ ] API documentation
- [ ] Troubleshooting guide

### 7.2 Developer Documentation

**Tasks:**

- [ ] Architecture overview
- [ ] Code structure
- [ ] Extending the plugin
- [ ] Contributing guidelines

---

## Known Limitations & Future Enhancements

### Current Limitations:

1. **Simple text only**: Only handles plain text JSX children (no nested elements)
2. **Client-side only**: Translation requests happen client-side
3. **Dev mode only**: Production builds not yet optimized
4. **Manual setup**: Users must wrap app and add components manually

### Future Enhancements:

1. **Advanced text extraction:**
   - Handle attributes (alt, title, placeholder)
   - Support nested JSX with mixed content
   - Template literals and string concatenation
2. **Server-side rendering:**
   - Pre-translate during SSR
   - Hydration strategy for translations
3. **Production optimization:**
   - Compile-time translation injection
   - Tree-shaking unused locales
   - Bundle splitting per locale
4. **Better DX:**

   - Auto-wrap app with provider
   - Auto-inject locale switcher
   - VS Code extension for translation management
   - CLI tools for translation management

5. **Smart batching:**
   - Analyze component tree to predict translations needed
   - Prefetch translations for next route
6. **Pluralization & interpolation:**
   - Handle count-based variations
   - Variable substitution in translations

---

## Open Questions & Decisions Needed

### 1. LCPAPI Integration

**Question:** Does `LCPAPI.translate()` accept the dictionary format we're building, or do we need to adapt?

**Action:** Review LCPAPI interface and adapt `buildDictionaryFromHashes()` accordingly.

---

### 2. Server vs Client Components ✅ RESOLVED

**Decision:** Use the next-intl pattern:

- **Client Components:** Use `useTranslation()` hook with React context
- **Server Components:** Use `await getServerTranslations()` async function
- **Babel Plugin:** Detect `async` function declaration to determine component type
- **Limitation:** Server Components can't reactively update - require page navigation for locale changes

**Implementation approach:**

```typescript
// Babel plugin detects:
if (componentFunction.async === true) {
  // It's a Server Component
  inject: const t = await getServerTranslations();
} else {
  // It's a Client Component
  inject: const t = useTranslation();
}
```

---

### 3. Turbopack Loader Approach ✅ RESOLVED

**Decision:** Use babel-loader with Turbopack

**Rationale:**

- Turbopack supports webpack loaders including babel-loader
- No need for external build processes or programs
- Easier to develop and maintain than Rust/WASM SWC plugins
- Works automatically with Next.js configuration

**Configuration:**

```javascript
// next.config.js
module.exports = {
  turbopack: {
    rules: {
      "*.{tsx,jsx}": {
        loaders: ["./turbopack-translation-loader.js"],
        as: "*.js",
      },
    },
  },
};
```

---

### 4. Metadata File Size

**Question:** With large apps, metadata.json could become huge. Should we:

- Split by route/page?
- Load metadata lazily?
- Only include metadata for current page?

**Recommendation:** Start simple (single file), optimize later if needed.

---

### 5. Cache Invalidation

**Question:** When does cache get invalidated?

- On source text change (hash changes, so automatic)
- On manual cache clear command
- On translation API version change

**Recommendation:** Automatic via hash changes. Add CLI command for manual clearing.

---

## Implementation Checklist

### Phase 1: Core Infrastructure

- [ ] Set up file structure (.lingo directory)
- [ ] Implement locale cookie helpers (client & server)
- [ ] Create TranslationContext and Provider
- [ ] Build LocaleSwitcher component
- [ ] Write configuration schema

### Phase 2: AST Transformation

- [ ] Implement hash generation utility
- [ ] Create Babel plugin for text detection
- [ ] Build transformation logic (detect Client vs Server Components)
- [ ] Implement Server Component detection (async function)
- [ ] Test with various component patterns (Client and Server)
- [ ] Create Turbopack loader wrapper

### Phase 3: Translation Runtime

- [ ] Implement useTranslation hook (Client Components)
- [ ] Implement getServerTranslations function (Server Components)
- [ ] Build translation API client with batching
- [ ] Integrate with LCPAPI
- [ ] Create metadata loader
- [ ] Implement cache read/write

### Phase 4: Integration

- [ ] Create API routes for translations
- [ ] Set up metadata file serving
- [ ] Test full workflow end-to-end
- [ ] Document developer setup process

### Phase 5: Polish

- [ ] Add error handling
- [ ] Implement loading states
- [ ] Add logging and debugging
- [ ] Performance optimization

### Phase 6: Testing

- [ ] Write unit tests
- [ ] Create integration tests
- [ ] Performance benchmarks

### Phase 7: Documentation

- [ ] User guide
- [ ] API reference
- [ ] Architecture docs
- [ ] Examples and tutorials

---

## Timeline Estimate (Rough)

- **Phase 1-2**: 2-3 weeks (Core infrastructure + AST)
- **Phase 3**: 1-2 weeks (Runtime translation)
- **Phase 4**: 1 week (Integration)
- **Phase 5-6**: 1-2 weeks (Polish + Testing)
- **Phase 7**: 1 week (Documentation)

**Total**: 6-9 weeks for a solid v1 implementation

---

## Next Steps

1. **Validate LCPAPI compatibility** - Ensure existing API works with our dictionary format approach
2. **Set up development environment** - Create test Next.js 16 project with Turbopack
3. **Prototype Babel plugin** - Start with simplest transformation case (Client Components first)
4. **Test Server Component detection** - Verify async function detection works reliably
5. **Implement translation batching** - Build the debounced request system

---

## Summary of Key Decisions

✅ **Subscription-based re-rendering** - Simpler and more controllable than HMR  
✅ **Babel loader with Turbopack** - No external programs, works automatically  
✅ **Separate APIs for Server/Client Components** - Following next-intl pattern  
✅ **router.refresh() for Server Components** - Re-render without full page reload, preserving client state  
✅ **Hash-based translation system** - Using sourceText + componentName + filePath  
✅ **100ms debounce batching** - Starting point, can adjust based on testing  
✅ **Use existing LCPAPI** - No separate API routes needed

---

## Remaining Questions

1. **LCPAPI dictionary format compatibility** - Need to verify and adapt if necessary
2. **Metadata file scaling** - Single file vs splitting (defer optimization)
3. **Attribute translation** - Phase 1 or Phase 2? (e.g., alt, title, placeholder)
4. **Initial target locales** - What languages to test with?
5. **Pre-translation strategy** - Should common locales be pre-generated for Server Components?

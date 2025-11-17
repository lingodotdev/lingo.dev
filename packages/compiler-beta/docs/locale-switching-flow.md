# Translation Plugin: Locale Switching Flow

This document visualizes how locale switching works with both Client and Server Components, preserving state throughout.

---

## Complete Locale Switch Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER CLICKS LOCALE SWITCHER                   │
│                    (e.g., English → German)                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   LocaleSwitcher Component                       │
│                      ('use client')                              │
└─────────────────────────────────────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                    ▼                 ▼
        ┌──────────────────┐  ┌──────────────────┐
        │  Step 1: Cookie  │  │ Step 2: Context  │
        │                  │  │                  │
        │ setLocaleInCookie│  │  setLocale('de') │
        │    ('de')        │  │                  │
        └────────┬─────────┘  └────────┬─────────┘
                 │                     │
                 │                     └────────────────┐
                 │                                      │
                 ▼                                      ▼
    ┌────────────────────────┐            ┌────────────────────────┐
    │   Server Components    │            │   Client Components    │
    │   Will read this!      │            │   Will read this!      │
    └────────────────────────┘            └────────────────────────┘
                 │                                      │
                 │                                      │
        ┌────────┴────────┐                           │
        │  Step 3:        │                           │
        │  startTransition│                           │
        │  router.refresh()│                          │
        └────────┬────────┘                           │
                 │                                     │
                 ▼                                     ▼
    ╔════════════════════════╗            ╔═══════════════════════╗
    ║  SERVER RE-EXECUTION   ║            ║  CLIENT RE-RENDER     ║
    ╚════════════════════════╝            ╚═══════════════════════╝
                 │                                     │
                 │                                     │
                 ▼                                     ▼
    ┌────────────────────────┐            ┌───────────────────────┐
    │ Server Components:     │            │ Client Components:    │
    │                        │            │                       │
    │ 1. Re-execute on       │            │ 1. Read locale from   │
    │    server              │            │    context            │
    │                        │            │                       │
    │ 2. Call                │            │ 2. Check translations │
    │    getLocaleFromCookie │            │    cache              │
    │    → Returns 'de'      │            │                       │
    │                        │            │ 3. Request missing    │
    │ 3. Call                │            │    translations       │
    │    getServerTranslation│            │    (batched, 100ms)   │
    │    for each hash       │            │                       │
    │                        │            │ 4. Fetch from API     │
    │ 4. Load from cache:    │            │    if needed          │
    │    .lingo/cache/de.json│            │                       │
    │                        │            │ 5. Update state       │
    │ 5. Return German text  │            │                       │
    │                        │            │ 6. Re-render with     │
    │ 6. Render new HTML     │            │    German text        │
    └────────────┬───────────┘            └───────────┬───────────┘
                 │                                     │
                 │                                     │
                 └─────────────┬───────────────────────┘
                               │
                               ▼
                ┌──────────────────────────┐
                │   REACT RECONCILIATION   │
                │                          │
                │ • Merge server HTML with │
                │   client components      │
                │                          │
                │ • Preserve client state: │
                │   - Form values ✅       │
                │   - Modal state ✅       │
                │   - Scroll position ✅   │
                │   - useState values ✅   │
                │                          │
                │ • No page reload! ✅     │
                └─────────────┬────────────┘
                              │
                              ▼
                ┌─────────────────────────┐
                │   USER SEES:            │
                │                         │
                │ • All text in German    │
                │ • Form still filled in  │
                │ • Modal still open      │
                │ • Same scroll position  │
                │                         │
                │ Smooth transition! 🎉   │
                └─────────────────────────┘
```

---

## Component-Level Detail

### Before Locale Change (English)

```
┌─────────────────────────────────────────────────┐
│              Root Layout (Server)                │
│                                                  │
│  <html>                                          │
│    <TranslationProvider initialLocale="en">     │
│      <Header />  ← Client Component             │
│      <Content /> ← Server Component             │
│    </TranslationProvider>                       │
│  </html>                                         │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│         Header Component (Client)                │
│                                                  │
│  'use client';                                   │
│  export function Header() {                      │
│    const t = useTranslation();                  │
│    const [isOpen, setIsOpen] = useState(false); │
│                                                  │
│    return (                                      │
│      <header>                                    │
│        <h1>{t('hash_welcome')}</h1>             │
│        // Shows: "Welcome"                       │
│        <LocaleSwitcher />                        │
│        {isOpen && <Modal />}  ← STATE!          │
│      </header>                                   │
│    );                                            │
│  }                                               │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│         Content Component (Server)               │
│                                                  │
│  export async function Content() {               │
│    const t = await getServerTranslations();     │
│                                                  │
│    return (                                      │
│      <main>                                      │
│        <p>{t('hash_intro')}</p>                 │
│        // Shows: "This is our website"          │
│      </main>                                     │
│    );                                            │
│  }                                               │
└─────────────────────────────────────────────────┘
```

### After Locale Change (German) - State Preserved!

```
┌─────────────────────────────────────────────────┐
│              Root Layout (Server)                │
│         *** NO CHANGE - DOESN'T RE-RENDER ***   │
│                                                  │
│  <html>                                          │
│    <TranslationProvider initialLocale="en">     │
│      <Header />  ← Re-renders with new context  │
│      <Content /> ← Re-executes on server        │
│    </TranslationProvider>                       │
│  </html>                                         │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│         Header Component (Client)                │
│         *** STATE PRESERVED! ***                 │
│                                                  │
│  'use client';                                   │
│  export function Header() {                      │
│    const t = useTranslation(); // Reads 'de'    │
│    const [isOpen, setIsOpen] = useState(false); │
│    // ☝️ STILL FALSE! State preserved!          │
│                                                  │
│    return (                                      │
│      <header>                                    │
│        <h1>{t('hash_welcome')}</h1>             │
│        // NOW Shows: "Willkommen"               │
│        <LocaleSwitcher />                        │
│        {isOpen && <Modal />}  ← STILL SAME!     │
│      </header>                                   │
│    );                                            │
│  }                                               │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│         Content Component (Server)               │
│         *** RE-EXECUTED WITH NEW LOCALE ***      │
│                                                  │
│  export async function Content() {               │
│    const t = await getServerTranslations();     │
│    // Reads cookie → 'de'                        │
│                                                  │
│    return (                                      │
│      <main>                                      │
│        <p>{t('hash_intro')}</p>                 │
│        // NOW Shows: "Das ist unsere Website"   │
│      </main>                                     │
│    );                                            │
│  }                                               │
└─────────────────────────────────────────────────┘
```

---

## Key Takeaways

### ✅ What Gets Preserved:

- All `useState` values
- Form input values
- Modal open/closed state
- Scroll position
- Any client-side state

### ✅ What Gets Updated:

- All translated text (both Client and Server Components)
- Cookie value
- Context value
- Server Component output

### ✅ What Doesn't Happen:

- ❌ Full page reload
- ❌ Network requests for JavaScript bundles
- ❌ Loss of client state
- ❌ Flash of unstyled content
- ❌ Scroll jump

---

## Technical Implementation

### LocaleSwitcher Component

```tsx
"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function LocaleSwitcher() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { locale, setLocale } = useTranslation();

  const handleChange = (newLocale: string) => {
    // 1. Update cookie (for Server Components)
    setLocaleInCookies(newLocale);

    // 2. Update context (for Client Components)
    setLocale(newLocale);

    // 3. Trigger Server Component re-render
    //    WITHOUT losing client state!
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <select
      value={locale}
      onChange={(e) => handleChange(e.target.value)}
      disabled={isPending}
      style={{ opacity: isPending ? 0.5 : 1 }}
    >
      <option value="en">English</option>
      <option value="de">Deutsch</option>
      <option value="fr">Français</option>
    </select>
  );
}
```

### How router.refresh() Works

From Next.js documentation:

> `router.refresh()`: Refresh the current route. Making a new request to the server,
> re-fetching data requests, and re-rendering Server Components. The client will
> merge the updated React Server Component payload **without losing unaffected
> client-side React (e.g. useState) or browser state (e.g. scroll position)**.

This is the magic that makes our translation plugin work seamlessly!

---

## Performance Characteristics

### Initial Page Load:

```
1. Server renders with initial locale
2. Client hydrates
3. Total: Normal Next.js SSR performance
```

### Locale Switch:

```
1. Cookie update: <1ms
2. Context update: <1ms
3. router.refresh() roundtrip: 50-200ms (depends on server)
4. Client translation fetch (if needed): 100-500ms
5. React reconciliation: 5-20ms

Total perceived delay: 150-700ms
With loading indicator: Feels instant!
```

### Subsequent Locale Switches (cached):

```
1. Cookie update: <1ms
2. Context update: <1ms
3. router.refresh() roundtrip: 50-200ms
4. Client reads from cache: <1ms
5. React reconciliation: 5-20ms

Total: 50-220ms (Very fast! ⚡)
```

---

## Comparison with Alternatives

### Full Page Reload (window.location.reload()):

```
❌ Time: 1000-3000ms
❌ Loses all state
❌ Re-downloads JavaScript
❌ Re-initializes everything
❌ Flash of white screen
```

### SPA Navigation (router.push with locale):

```
⚠️  Time: 200-500ms
❌ Loses page-level state
✅ Preserves some client state
⚠️  May re-fetch data unnecessarily
```

### Our Approach (router.refresh()):

```
✅ Time: 50-700ms (cached: 50-220ms)
✅ Preserves ALL client state
✅ Only re-fetches what changed
✅ Smooth transition
✅ No visual disruption
```

---

## Edge Cases & Considerations

### 1. User Has Form Half-Filled:

```
✅ Form data preserved
✅ Validation state preserved
✅ Only placeholder/labels update
✅ User can continue typing
```

### 2. User Has Modal Open:

```
✅ Modal stays open
✅ Modal content translates
✅ Modal state preserved
```

### 3. User Mid-Scroll:

```
✅ Scroll position maintained
✅ No jump to top
✅ Smooth experience
```

### 4. Multiple Locales Switching Rapidly:

```
✅ useTransition prevents race conditions
✅ Latest locale wins
✅ Batching prevents excessive requests
```

### 5. Translation Not Yet Cached:

```
⚠️  Shows source text briefly
✅ Fetches translation (batched)
✅ Updates when ready
✅ Loading indicator shows progress
```

---

## Why This Approach is Special

Most i18n solutions require either:

- Full page reload (bad UX)
- Client-only rendering (bad SEO, slow initial load)
- Complex state management (bad DX)

Our approach combines:

- ✅ Server-side rendering (great SEO)
- ✅ Preserved client state (great UX)
- ✅ Automatic code transformation (great DX)
- ✅ Unified API for both component types

This is only possible because of:

1. React Server Components architecture
2. Next.js App Router capabilities
3. `router.refresh()` implementation
4. Our dual-API approach (useTranslation + getServerTranslations)

---

## Future Optimizations

### Potential Improvements:

1. **Prefetch translations** for next locale on hover
2. **Preload common locales** during build
3. **Split metadata** by route for faster loads
4. **Service Worker caching** for instant switches
5. **Optimistic updates** while fetching

### These could reduce locale switch time to <50ms! ⚡⚡⚡

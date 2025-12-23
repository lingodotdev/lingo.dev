# Translation Architecture

## Overview

This document describes the refactored translation architecture that provides clear separation of concerns between
metadata management, translation execution, and caching.

## Architectural Principles

1. **Metadata file structure** is only known by:
   - Metadata Manager (reads/writes metadata.json)
   - Translation Service (orchestrator that coordinates everything)

2. **Translators are stateless** and work with abstract `TranslatableEntry` types
   - No knowledge of metadata file structure
   - No built-in caching
   - Easy to test in isolation

3. **Caching is handled at the service layer**
   - Translation Service owns cache strategy
   - Cache implementations can be swapped (local disk, remote, memory, etc.)

4. **Partial failures are handled gracefully**
   - Service returns both successful translations and errors
   - Can continue with cached translations if new translations fail
   - Errors include context for debugging

## Component Diagram

```
┌─────────────────────────────────────────────────┐
│ AST Transformer                                 │
│  - Extracts text from JSX                       │
│  - Knows ComponentType, context                 │
└────────────────┬────────────────────────────────┘
                 │ writes
                 ↓
┌──────────────────────────────────────────────────┐
│ MetadataManager                                  │
│  - ONLY component that reads/writes metadata.json│
│  - Provides metadata loading/saving              │
│  - Returns TranslationEntry[]                    │
└────────────────┬─────────────────────────────────┘
                 │ reads from
                 ↓
┌─────────────────────────────────────────────────┐
│ TranslationService (orchestrator)                │
│  - Coordinates translation workflow              │
│  - Handles cache strategy                        │
│  - Determines what needs translation             │
│  - Manages partial failures                      │
│  - Returns TranslationResult with errors         │
└───┬─────────────────────┬──────────────────────┘
    │                     │
    │ uses               │ uses
    ↓                     ↓
┌──────────────┐   ┌────────────────────┐
│ Cache        │   │ Translator         │
│  - get()     │   │  - translate()     │
│  - set()     │   │  - batchTranslate()│
│  - update()  │   │  - Pseudo, LCP, etc│
│  - Local/    │   │  - Stateless       │
│    Remote    │   │  - No file I/O     │
└──────────────┘   └────────────────────┘
```

## Core Components

Cache api - `compiler/src/translate/cache.ts`
Local cache implementation - `compiler/src/translate/local-cache.ts`
Orchestrator translation service - `compiler/src/translate/translation-service.ts`
Translator and dictionary api - `compiler/src/translate/api.ts`

## Future Enhancements

### Remote Cache Implementation

```typescript
class RemoteTranslationCache implements TranslationCache {
  constructor(private apiUrl: string) {}

  async get(locale: string) {
    const response = await fetch(`${this.apiUrl}/cache/${locale}`);
    return response.json();
  }

  // ... other methods
}
```

## Questions & Answers

**Q: Why not cache inside translators?**
A: Caching is an infrastructure concern, not a translation concern. Different deployments might need different cache
strategies (local dev vs production, single server vs distributed).

**Q: What if I need context in the cache?**
A: The service already has access to metadata context. If you need it in the cache, extend the cache interface to store
`TranslationEntry` instead of just strings.

**Q: How do I add a new translator?**
A: Implement the `Translator` interface, add a case to `translator-factory.ts`, and you're done. No need to worry about
caching.

**Q: What happens if translation fails?**
A: The service returns partial results with errors. The cached translations are still returned, and errors include
details for debugging.

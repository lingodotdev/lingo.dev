# PRD: Unified Provider Architecture

## Problem Statement

There is significant drift between `packages/cli` and `packages/compiler` in their LLM provider implementations:

### Current State

**packages/cli supports:**
- OpenAI, Anthropic, Google, OpenRouter, Ollama, Mistral

**packages/compiler supports:**
- Groq, Google, OpenRouter, Ollama, Mistral, Lingo.dev

**packages/spec config schema defines:**
- `["openai", "anthropic", "google", "ollama", "openrouter", "mistral"]`

### Drift Issues

1. **Incomplete provider coverage** - CLI missing Groq; Compiler missing OpenAI/Anthropic
2. **Inconsistent implementations** - Different patterns for API key resolution, error handling, client creation
3. **No shared constants** - Provider IDs, metadata, env var names duplicated
4. **Config schema mismatch** - Spec doesn't list Groq as valid provider
5. **Maintenance burden** - Bug fixes must be applied twice; new providers require dual implementation

## Goals

1. **Eliminate drift** - Make it architecturally impossible for packages to diverge
2. **Support all 7 providers** - Groq, OpenAI, Anthropic, Google, OpenRouter, Ollama, Mistral
3. **Single source of truth** - One implementation of provider logic shared by both packages
4. **Consistent UX** - Same error messages, behavior, key resolution across all tooling
5. **Future-proof** - Easy to add new providers; other packages can consume provider logic

## Architecture Decisions

### Package Structure

Create two new shared packages:

```
packages/config      → .lingodotdevrc reading (user credentials)
packages/providers   → Provider registry, API key resolution, client factories
packages/spec        → i18n.json schema (CLI-only, existing)
packages/cli         → Uses spec, config, providers
packages/compiler    → Uses config, providers (NOT spec)
```

### Dependency Graph

```
packages/config (standalone, no deps)
    ↓
packages/providers (depends on config)
    ↓
packages/cli (depends on spec, config, providers)
packages/compiler (depends on config, providers)
```

**Key principle:** Compiler never depends on CLI-specific concerns (i18n.json schema in spec)

### Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Provider consolidation** | All 7 providers in both packages | Complete feature parity |
| **Abstraction level** | Maximal - full client factories | Eliminates all duplication, enforces consistency |
| **Error handling** | Structured error classes | Maximum optionality - consumers format as needed |
| **RC file reading** | Providers owns it (Phase 1), extracted to config (Phase 2) | Self-contained initially, shared later |
| **API design** | Layered (4 layers) | Flexibility - escape hatches for custom scenarios |

## Implementation Plan

### Phase 1: Create `packages/providers` (with duplicated rc reading)

**Goal:** Establish provider package with complete functionality

**Tasks:**
1. Create package scaffold with dependencies
2. Implement 4-layer API (see API Design section)
3. Port provider logic from CLI + compiler
4. Add all 7 providers with full support
5. Write comprehensive tests
6. Document API

### Phase 2: Migrate CLI to use `packages/providers`

**Goal:** Validate provider package works in production CLI

**Tasks:**
1. Update CLI dependencies
2. Replace `cli/localizer/explicit.ts` with provider imports
3. Update `cli/utils/settings.ts` to use provider constants
4. Remove duplicated provider code
5. Ensure tests pass
6. Verify CLI functionality unchanged

### Phase 3: Migrate compiler to use `packages/providers`

**Goal:** Validate provider package works in production compiler

**Tasks:**
1. Update compiler dependencies
2. Replace `compiler/lib/lcp/api/index.ts` provider logic with imports
3. Remove `compiler/utils/llm-api-key.ts`
4. Remove `compiler/lib/lcp/api/provider-details.ts`
5. Ensure tests pass
6. Verify compiler functionality unchanged

### Phase 4: Extract rc reading to `packages/config`

**Goal:** Eliminate remaining duplication in config reading

**Tasks:**
1. Create `packages/config` package
2. Move `.lingodotdevrc` schema + reading logic from providers
3. Update providers to depend on config
4. Update CLI to use config for auth settings
5. Remove duplicated rc reading from CLI

### Phase 5: Update `packages/spec` provider enum

**Goal:** Ensure config schema matches implementation

**Tasks:**
1. Add "groq" to provider ID enum in spec
2. Update config version (1.9 → 2.0)
3. Update JSON schema generation
4. Document migration path

## API Design: `packages/providers`

### Layer 1: Constants & Metadata

```typescript
/**
 * All supported provider IDs
 */
export const SUPPORTED_PROVIDERS = [
  'groq',
  'openai',
  'anthropic',
  'google',
  'openrouter',
  'ollama',
  'mistral',
] as const;

export type ProviderId = typeof SUPPORTED_PROVIDERS[number];

/**
 * Metadata for each provider
 */
export interface ProviderMetadata {
  name: string;              // Display name (e.g., "Groq", "OpenAI")
  apiKeyEnvVar?: string;     // Environment variable name (e.g., "GROQ_API_KEY")
  apiKeyConfigKey?: string;  // RC file key path (e.g., "llm.groqApiKey")
  getKeyLink: string;        // Link to get API key
  docsLink: string;          // Link to API docs
}

export const PROVIDER_METADATA: Record<ProviderId, ProviderMetadata>;
```

### Layer 2: Utilities

```typescript
/**
 * Get API key for provider from environment or rc file
 * Returns undefined if not found
 */
export function getProviderApiKey(providerId: ProviderId): string | undefined;

/**
 * Resolve API key with custom sources
 * @throws ProviderKeyMissingError if not found and required=true
 */
export function resolveProviderApiKey(
  providerId: ProviderId,
  options?: {
    sources?: KeySources;
    required?: boolean;
  }
): string | undefined;

/**
 * Key sources for resolution
 */
export interface KeySources {
  env?: Record<string, string>;
  rc?: RcData;
}

/**
 * Structured error: API key not found
 */
export class ProviderKeyMissingError extends Error {
  constructor(
    public providerId: ProviderId,
    public envVar?: string,
    public configKey?: string
  );
}

/**
 * Structured error: Authentication failed
 */
export class ProviderAuthFailedError extends Error {
  constructor(
    public providerId: ProviderId,
    public originalError: Error
  );
}

/**
 * Structured error: Unsupported provider
 */
export class UnsupportedProviderError extends Error {
  constructor(public providerId: string);
}
```

### Layer 3: Factory

```typescript
/**
 * Create AI SDK LanguageModel client for provider
 * @throws ProviderKeyMissingError if key required but not found
 * @throws UnsupportedProviderError if provider not supported
 */
export function createProviderClient(
  providerId: ProviderId,
  modelId: string,
  options?: ClientOptions
): LanguageModel;

export interface ClientOptions {
  apiKey?: string;      // Override API key (skip resolution)
  baseUrl?: string;     // Custom base URL for provider API
  skipAuth?: boolean;   // Skip authentication check (for Ollama)
}
```

### Layer 4: High-level

```typescript
/**
 * Get provider client + metadata in one call
 * Convenience wrapper around createProviderClient + PROVIDER_METADATA
 */
export function getProvider(
  providerId: ProviderId,
  modelId: string,
  options?: ClientOptions
): {
  client: LanguageModel;
  metadata: ProviderMetadata;
};
```

## API Design: `packages/config`

```typescript
/**
 * Read and parse .lingodotdevrc file from home directory
 */
export function getRcConfig(): RcConfig;

/**
 * RC file data structure
 */
export interface RcConfig {
  auth?: {
    apiKey?: string;
    apiUrl?: string;
    webUrl?: string;
  };
  llm?: {
    groqApiKey?: string;
    openaiApiKey?: string;
    anthropicApiKey?: string;
    googleApiKey?: string;
    openrouterApiKey?: string;
    mistralApiKey?: string;
  };
}

/**
 * Zod schema for validation
 */
export const rcConfigSchema: ZodType<RcConfig>;
```

## Migration Examples

### Before (CLI)

```typescript
// packages/cli/src/cli/localizer/explicit.ts
switch (provider.id) {
  case "openai":
    return createAiSdkLocalizer({
      factory: (params) => createOpenAI(params).languageModel(provider.model),
      id: provider.id,
      prompt: provider.prompt,
      apiKeyName: "OPENAI_API_KEY",
      baseUrl: provider.baseUrl,
    });
  // ... 5 more cases
}
```

### After (CLI)

```typescript
// packages/cli/src/cli/localizer/explicit.ts
import { createProviderClient } from "@lingo.dev/providers";

const client = createProviderClient(provider.id, provider.model, {
  baseUrl: provider.baseUrl,
});
```

### Before (Compiler)

```typescript
// packages/compiler/src/lib/lcp/api/index.ts (lines 291-392)
switch (providerId) {
  case "groq": {
    if (isRunningInCIOrDocker()) {
      const groqFromEnv = getGroqKeyFromEnv();
      if (!groqFromEnv) {
        this._failMissingLLMKeyCi(providerId);
      }
    }
    const groqKey = getGroqKey();
    if (!groqKey) {
      throw new Error("⚠️  GROQ API key not found...");
    }
    return createGroq({ apiKey: groqKey })(modelId);
  }
  // ... 4 more cases
}
```

### After (Compiler)

```typescript
// packages/compiler/src/lib/lcp/api/index.ts
import { createProviderClient, ProviderKeyMissingError } from "@lingo.dev/providers";

try {
  return createProviderClient(providerId, modelId);
} catch (error) {
  if (error instanceof ProviderKeyMissingError) {
    // Custom error formatting for compiler context
    this._failMissingLLMKeyCi(error.providerId);
  }
  throw error;
}
```

## Success Criteria

### Functionality
- [ ] All 7 providers work in CLI
- [ ] All 7 providers work in compiler
- [ ] API key resolution works (env + rc file)
- [ ] Error handling preserves existing behavior
- [ ] No breaking changes for end users

### Code Quality
- [ ] Zero duplication of provider logic
- [ ] All provider constants shared
- [ ] Comprehensive test coverage (>90%)
- [ ] Full API documentation
- [ ] Type safety maintained

### Architecture
- [ ] Compiler doesn't depend on CLI concerns
- [ ] Clean dependency graph (no cycles)
- [ ] Layered API provides escape hatches
- [ ] Easy to add new providers (single location)

### Validation
- [ ] CLI tests pass
- [ ] Compiler tests pass
- [ ] Integration tests pass
- [ ] Manual smoke testing complete

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking changes in migration | High | Phased rollout, comprehensive testing, feature flags |
| API key resolution differs subtly | Medium | Unit test all edge cases, validate against existing behavior |
| Dependency conflicts with AI SDK packages | Medium | Lock versions, test compatibility |
| RC file format assumptions differ | Low | Extract and validate schema early (Phase 4) |

## Future Enhancements

Once core architecture is in place:

1. **Rate limiting** - Add rate limit handling to provider clients
2. **Retries** - Built-in retry logic with exponential backoff
3. **Observability** - Structured logging, metrics, tracing
4. **Caching** - Cache provider clients, metadata
5. **Validation** - Runtime validation of API keys, connectivity checks
6. **Provider plugins** - Allow custom provider implementations
7. **Cost tracking** - Track token usage per provider

## Timeline Estimate

- **Phase 1** (packages/providers): 2-3 days
- **Phase 2** (CLI migration): 1 day
- **Phase 3** (compiler migration): 1 day
- **Phase 4** (packages/config): 1 day
- **Phase 5** (spec update): 0.5 days
- **Testing & validation**: 1 day

**Total: ~1 week**

## Open Questions

None - all architectural decisions have been made.

Ready to begin implementation with Phase 1.

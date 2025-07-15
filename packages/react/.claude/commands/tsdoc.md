---
description: Write TSDoc comments following comprehensive project conventions
allowed-tools: [Read, Edit, MultiEdit, Grep, Glob]
---

Write comprehensive TSDoc comments for the selected code following these advanced guidelines:

## Core Philosophy

Documentation is product design. Every comment shapes the developer experience and system understanding. Write for external developers consuming your public API.

## Target Audience

External developers integrating your library into their applications. They need to understand:

- What each API does and when to use it
- How to integrate it correctly
- What can go wrong and how to handle it
- How it relates to other APIs in your library

## Information Architecture

### Standard Structure (in order)

1. **Summary**: One-line description starting with action verb
2. **Context**: Environmental constraints and requirements
3. **Details**: Expanded explanation (if needed)
4. **Contract**: @param, @returns, @throws
5. **Lifecycle**: @since, @deprecated
6. **Examples**: @example (simple → advanced)
7. **Relationships**: @see

### Progressive Disclosure Pattern

```typescript
/**
 * Loads dictionary for internationalization.
 *
 * Dynamically loads translation dictionaries with automatic fallbacks
 * and caching. Integrates with React context providers for seamless
 * component-level internationalization.
 *
 * Only works in client-side environments - will throw in SSR.
 * Requires js-cookie package to be installed.
 *
 * @param locale - Locale code (ISO 639-1 format)
 * @returns Promise resolving to dictionary object
 * @throws {LocaleNotFoundError} When locale is unsupported
 * @throws {NetworkError} When dictionary fails to load
 *
 * @example Basic usage
 * @example With error handling
 * @example Custom caching
 *
 * @see LingoProvider - Context provider for dictionaries
 * @since 2.1.0
 */
```

## Writing for Your Audience

### What External Developers Need

- **Decision-making information**: When to use this API vs alternatives
- **Integration guidance**: How it fits into their existing code
- **Error handling**: What can go wrong and how to recover
- **Performance implications**: Cost of using this API
- **Framework compatibility**: Works with Next.js, Remix, etc.

### What They Don't Need

- Internal implementation details
- Development setup instructions
- Debugging information for maintainers
- Architecture decisions or design rationale

## Context Documentation

### Environmental Constraints

Document clearly in the description:

- "Client-side only - will throw in SSR"
- "Requires Node.js 18+ and modern browsers"
- "Depends on js-cookie package"
- "Modifies document.cookie and triggers page reload"

### Performance Characteristics

Include in description when relevant:

- "O(1) lookup after initial load"
- "Caches up to 10MB of dictionaries"
- "Makes HTTP request on first call per locale"
- "Average load time: 50ms"

## Error Documentation

### Complete Error Information

```typescript
/**
 * @throws {LocaleNotFoundError} When locale is not in supported list
 * @throws {NetworkError} When dictionary server is unreachable
 * @throws {ValidationError} When dictionary format is invalid
 */
```

Always include:

- What triggers the error
- How to prevent it
- What happens on error (fallback behavior)

## Example Guidelines

### Multiple Examples with Progression

Always start simple, then show advanced usage:

````typescript
/**
 * @example Basic usage in Vite app
 * ```tsx
 * import { LingoProviderWrapper, loadDictionary } from "lingo.dev/react/client";
 *
 * export function App() {
 *   return (
 *     <LingoProviderWrapper loadDictionary={loadDictionary}>
 *       <MyComponent />
 *     </LingoProviderWrapper>
 *   );
 * }
 * ```
 *
 * @example With error handling and loading states
 * ```tsx
 * import { useState, useEffect } from "react";
 * import { loadDictionary } from "lingo.dev/react/client";
 *
 * export function CustomLoader() {
 *   const [dictionary, setDictionary] = useState(null);
 *   const [error, setError] = useState(null);
 *   const [loading, setLoading] = useState(true);
 *
 *   useEffect(() => {
 *     loadDictionary("es")
 *       .then(setDictionary)
 *       .catch(setError)
 *       .finally(() => setLoading(false));
 *   }, []);
 *
 *   if (loading) return <div>Loading translations...</div>;
 *   if (error) return <div>Failed to load: {error.message}</div>;
 *
 *   return <div>{dictionary.welcome}</div>;
 * }
 * ```
 */
````

### Example Requirements

- Show complete, runnable code
- Include necessary imports and exports
- Use realistic component/variable names
- Demonstrate actual use cases, not toy examples
- For React components, show them within exported components

## Component Documentation

### React Components

```typescript
/**
 * Context provider that makes localized content available to descendants.
 *
 * Should be placed at the top of the component tree. Designed for
 * client-side applications with pre-loaded dictionaries.
 *
 * @template D - Type of the dictionary object containing localized content
 * @throws {Error} When no dictionary is provided
 */
```

Key patterns:

- Never use @returns for React components
- Always document @template parameters
- Include @throws for error conditions
- Explain where in the component tree to place it

### Props Documentation

Document props on the type declaration:

```typescript
export type LingoProviderProps<D> = {
  /**
   * Dictionary object containing localized content.
   * Must contain at least one key-value pair.
   */
  dictionary: D;

  /**
   * Loads dictionary for the current locale.
   * Results are automatically cached by locale.
   *
   * @param locale - Locale code (ISO 639-1 format)
   */
  loadDictionary: (locale: string) => Promise<D>;

  /**
   * Child components containing localizable content.
   * Should contain components using translation hooks.
   */
  children: React.ReactNode;
};
```

For function props:

- Document the function's purpose
- Include @param tags for function parameters
- Explain caching/performance behavior
- Show expected usage patterns

## Relationship Documentation

### Linking Related APIs

```typescript
/**
 * @see LingoProviderWrapper - Wrapper with automatic dictionary loading
 * @see loadDictionary - Function for manual dictionary loading
 * @see useTranslation - Hook for accessing translations in components
 */
```

Always explain:

- How related APIs differ from this one
- When to use alternatives
- Migration paths between versions

## Language Rules

### Mandatory Patterns

- Start descriptions with action verbs (loads, sets, retrieves)
- Use present tense throughout
- End all sentences with periods
- Use "locale" not "language" for consistency
- Use "dictionary" not "translations" for data objects

### Forbidden Patterns

- Never use "A function that..." or "A component that..."
- Never document "optional" - TypeScript handles this
- Never use @returns for React components
- Never use vague terms like "handles" or "manages"
- Never document implementation details in public APIs

## Framework Integration

### Framework-Specific Information

Include in description when relevant:

- "Use in Next.js app/layout.tsx"
- "Use in Remix app/root.tsx"
- "Use in Vite src/main.tsx"
- "Compatible with React Router"
- "Works with all server-side rendering frameworks"

### TypeScript Integration

```typescript
/**
 * @template D - Dictionary type for strong typing
 */
```

Document:

- Generic type parameters with @template
- Type constraints when relevant
- How type inference works
- Requirements for strict mode

## Quality Requirements

### Every Public API Must Have

- At least one @example with complete code
- @param documentation for all parameters
- @returns documentation for all functions
- @throws documentation for all error cases
- Clear description of side effects

### Documentation Testing

- Examples must be syntactically correct
- Imports must reference real packages
- Code must be runnable as shown
- Variable names must be realistic
- Error handling must be demonstrated

## Migration Information

When deprecating, always explain:

- What to use instead
- Why the change was made
- Timeline for removal

Apply these guidelines to create documentation that serves as reference for external developers consuming your public API.

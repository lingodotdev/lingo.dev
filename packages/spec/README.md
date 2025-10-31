# Lingo.dev Spec

A utility package for Lingo.dev.

## Performance utilities

This package includes internal performance helpers used by the config system:

- ConfigCacheManager — in-memory cache for parsed configs
- LazyProviderConfigLoader — on-demand provider loading with duplicate-call protection
- OptimizedConfigParser — schema-driven parsing/validation with file and JSON input

These are integrated within `src/config.ts` for faster, cached config parsing while keeping the public API unchanged.

### Installation

```bash
npm i lingo.dev
```

### Usage

```
import {} from 'lingo.dev/spec';
```

### Documentation

[Documentation](https://lingo.dev/go/docs)

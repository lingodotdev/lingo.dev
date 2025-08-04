---
"lingo.dev": minor
---

Add support for `ignoredKeys` in TypeScript loader

The TypeScript loader now fully supports the `ignoredKeys` option, allowing you to exclude specific keys (including nested keys) from localization when using both `export default` and `export const` patterns. This works seamlessly with the `run` method and the CLI, and is compatible with flattened key structures. All related tests now pass.

---
"@lingo.dev/compiler": patch
---

Translate JSX handed to a component through an attribute, such as `actions={<span>Text</span>}` or `renderItem={() => <span>Text</span>}`.

Strings that were silently untranslated become new translation entries, so translation volume can jump on the next build. Translatable attributes inside prop JSX, such as `alt` on an `<img>`, are picked up too. A function handed to a prop is treated as the callback it is rather than as a component, so its strings are registered against the enclosing component instead of receiving a translation hook of their own.

Still not covered: JSX in a prop of an element that is itself folded into an ancestor's rich text.

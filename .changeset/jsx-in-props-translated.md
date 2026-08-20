---
"@lingo.dev/compiler": patch
---

Translate JSX handed to a component through an attribute, such as `actions={<span>Text</span>}`.

Strings that were silently untranslated become new translation entries, so translation volume can jump on the next build. Translatable attributes inside prop JSX, such as `alt` on an `<img>`, are picked up too.

Still not covered: JSX in a prop of an element that is itself folded into an ancestor's rich text, and JSX returned by an arrow render prop.

---
"@lingo.dev/compiler": patch
---

Translate JSX handed to a component through an attribute.

`processJSXElement` ends with `path.skip()`, which prunes the whole subtree including `openingElement`. Any JSX inside an attribute expression container — `<FrameHeader actions={<span>Text</span>}>Body</FrameHeader>` — was therefore never visited, so neither its text nor its translatable attributes were extracted. The skip is load-bearing (in the `mixed` branch `rewriteChildren` moves children into arrow functions inside `t()`, and re-traversing would duplicate entries), so the opening element is now traversed with the same visitors immediately before the skip.

User-visible effect: strings that were silently untranslated become new translation entries, so translation volume can jump on the next build.

Not covered, different root causes: prop JSX inside rich/mixed content, where `serializeJSXChildren` only calls `translateAttributes` on the moved element; and arrow render props (`renderCell={() => <span>Cell</span>}`), where `inferComponentName` returns `null` for an arrow whose parent is a `JSXAttribute`.

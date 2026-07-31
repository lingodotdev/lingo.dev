---
"@lingo.dev/_compiler": patch
"@lingo.dev/compiler": patch
"@lingo.dev/_react": patch
---

Bump the `next` devDependency to 16.2.11, closing four high and five medium advisories
(middleware/proxy bypass, SSRF in Server Actions and rewrites, Server Action DoS, and the
Image Optimization SVG DoS among them).

Build-time only — no runtime dependency or public API of these packages changes.

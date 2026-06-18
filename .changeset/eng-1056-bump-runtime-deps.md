---
"lingo.dev": patch
"@lingo.dev/_compiler": patch
"@lingo.dev/compiler": patch
"@lingo.dev/_react": patch
---

Bump runtime dependencies to patched versions to resolve Dependabot security alerts (ENG-1056): fast-xml-parser 5.7.0, js-cookie 3.0.8, lodash 4.17.23, minimatch 10.2.5. All bumps are patch/minor within the same major version.

js-cookie is bumped to 3.0.8 rather than 3.0.7: both fix CVE-2026-46625, but 3.0.7 inadvertently raised its Node engine requirement to >=20 and broke ES5 compatibility. 3.0.8 keeps the security fix while dropping the engine constraint, so it stays compatible with our Node >=18 support.

lodash is bumped to 4.17.23 (the latest non-deprecated release) rather than 4.18.0: the 4.18.x line is flagged as a bad release on npm and repudiated by the maintainer. 4.17.23 clears the prototype-pollution advisory patched in that version (GHSA-xxjr-mmjv-4gpg). The two remaining advisories are only "fixed" in the deprecated 4.18.0 and are dismissed with rationale, as their surface is not exercised here (no `_.template`; `_.omit`/`_.unset` are only called with controlled, literal keys).

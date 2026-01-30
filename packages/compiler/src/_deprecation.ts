const DEPRECATION_WARNING = `
⚠️  DEPRECATION WARNING: @lingo.dev/_compiler is deprecated.
   Please migrate to @lingo.dev/compiler (the new compiler).

   The new compiler offers:
   • Advanced virtual module system for better code splitting
   • Built-in development translation server
   • Pluralization detection with ICU MessageFormat support
   • Improved metadata management for better caching
   • Thread-safe concurrent build support

   Migration guide: https://lingo.dev/compiler

   This legacy compiler will be removed in a future release.
`;

let deprecationWarningShown = false;

export function showDeprecationWarning() {
  if (deprecationWarningShown) return;
  deprecationWarningShown = true;
  console.warn(DEPRECATION_WARNING);
}

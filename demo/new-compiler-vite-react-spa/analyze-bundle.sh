#!/bin/bash

# Bundle Analysis Script for Lingo.dev Compiler
# Checks for unnecessary code in production builds

set -e

echo "🔍 Analyzing production bundle..."
echo ""

BUNDLE_FILE="dist/assets/index-*.js"

# Check if build exists
if [ ! -d "dist/assets" ]; then
  echo "❌ No dist/assets found. Run 'pnpm build' first."
  exit 1
fi

echo "📦 Bundle Size:"
ls -lh dist/assets/*.js | awk '{print "  ", $5, $9}'
echo ""

echo "🧹 Checking for dev-only code..."

# List of patterns that should NOT be in production
DEV_PATTERNS=(
  "TranslationProvider__Dev"
  "usePseudotranslator"
  "startTranslationServer"
  "translation-server"
  "fetchTranslations"
  "serverUrl"
  "batchDelay"
  "pendingHashesRef"
  "registeredHashesRef"
  "allSeenHashes"
  "__LINGO_DEV"
)

FOUND_ISSUES=0

for pattern in "${DEV_PATTERNS[@]}"; do
  if grep -q "$pattern" $BUNDLE_FILE 2>/dev/null; then
    echo "  ⚠️  Found dev code: $pattern"
    FOUND_ISSUES=$((FOUND_ISSUES + 1))
  fi
done

if [ $FOUND_ISSUES -eq 0 ]; then
  echo "  ✅ No dev-only code found"
else
  echo ""
  echo "  ❌ Found $FOUND_ISSUES dev patterns in production bundle!"
fi

echo ""
echo "✨ Checking for expected production code..."

# List of patterns that SHOULD be in production
PROD_PATTERNS=(
  "TranslationProvider"
  "useTranslation"
  "setLocale"
)

FOUND_PROD=0

for pattern in "${PROD_PATTERNS[@]}"; do
  if grep -q "$pattern" $BUNDLE_FILE 2>/dev/null; then
    echo "  ✅ Found: $pattern"
    FOUND_PROD=$((FOUND_PROD + 1))
  else
    echo "  ❌ Missing: $pattern"
  fi
done

echo ""
echo "📊 Summary:"
echo "  Total bundle size: $(du -h dist/assets/index-*.js | awk '{print $1}')"
echo "  Gzipped size: $(gzip -c dist/assets/index-*.js | wc -c | awk '{print int($1/1024) "K"}')"
echo "  Dev patterns found: $FOUND_ISSUES"
echo "  Prod patterns found: $FOUND_PROD/${#PROD_PATTERNS[@]}"
echo ""

if [ $FOUND_ISSUES -eq 0 ] && [ $FOUND_PROD -eq ${#PROD_PATTERNS[@]} ]; then
  echo "✅ Bundle looks good!"
  exit 0
else
  echo "⚠️  Bundle may have issues"
  exit 1
fi
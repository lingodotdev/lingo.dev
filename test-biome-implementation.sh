#!/bin/bash
set -e

echo "=========================================="
echo "Testing Biome Formatter Implementation"
echo "=========================================="
echo ""

# Create test directory
TEST_DIR="/tmp/lingo-biome-test-$$"
mkdir -p "$TEST_DIR/locales"
cd "$TEST_DIR"

echo "✓ Created test directory: $TEST_DIR"
echo ""

# Create source JSON file (minified, no formatting)
cat > locales/en.json << 'EOF'
{"hello":"world","greeting":"Hello, how are you?","nested":{"key":"value"},"test":"New key"}
EOF

echo "✓ Created source file (minified JSON)"
echo ""

# Create Biome config
cat > biome.json << 'EOF'
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 4
  },
  "json": {
    "formatter": {
      "enabled": true,
      "indentWidth": 4
    }
  }
}
EOF

echo "✓ Created biome.json config (4-space indentation)"
echo ""

# Test 1: Config with Biome formatter
cat > i18n.json << 'EOF'
{
  "$schema": "https://lingo.dev/schema/i18n.json",
  "version": 1.9,
  "formatter": "biome",
  "locale": {
    "source": "en",
    "targets": ["es", "fr"]
  },
  "buckets": {
    "json": {
      "include": ["locales/[locale].json"]
    }
  }
}
EOF

echo "✓ Created i18n.json with formatter: biome"
echo ""

# Test 2: Run status command (should load config without errors)
echo "TEST 1: Running 'status' command with Biome formatter..."
node /Users/vrcprl/Work/oss/packages/cli/bin/cli.mjs status > /tmp/status-output.txt 2>&1
if grep -q "Configuration loaded" /tmp/status-output.txt; then
    echo "  ✓ Configuration loaded successfully"
else
    echo "  ✗ FAILED: Configuration did not load"
    cat /tmp/status-output.txt
    exit 1
fi

if grep -q "Biome formatting failed" /tmp/status-output.txt; then
    echo "  ✗ FAILED: Biome formatter error detected"
    cat /tmp/status-output.txt
    exit 1
fi
echo "  ✓ No Biome errors"
echo ""

# Test 3: Create target file and run cleanup to trigger formatting
cat > locales/es.json << 'EOF'
{"hello":"mundo","greeting":"Hola","nested":{"key":"valor"},"test":"Prueba","extra":"should be removed"}
EOF

echo "TEST 2: Running 'lockfile write' to establish source keys..."
node /Users/vrcprl/Work/oss/packages/cli/bin/cli.mjs lockfile write > /tmp/lockfile-output.txt 2>&1
if [ -f "i18n.lock" ]; then
    echo "  ✓ Lockfile created"
else
    echo "  ✗ FAILED: Lockfile not created"
    exit 1
fi
echo ""

echo "TEST 3: Running 'cleanup' to remove extra keys and trigger formatting..."
node /Users/vrcprl/Work/oss/packages/cli/bin/cli.mjs cleanup > /tmp/cleanup-output.txt 2>&1
if grep -q "Cleanup completed" /tmp/cleanup-output.txt; then
    echo "  ✓ Cleanup completed"
else
    echo "  ✗ FAILED: Cleanup did not complete"
    cat /tmp/cleanup-output.txt
    exit 1
fi
echo ""

# Check if extra key was removed
if grep -q "extra" locales/es.json; then
    echo "  ✗ FAILED: Extra key was not removed"
    cat locales/es.json
    exit 1
else
    echo "  ✓ Extra key removed"
fi
echo ""

# Test 4: Switch to Prettier and verify it works
cat > i18n.json << 'EOF'
{
  "$schema": "https://lingo.dev/schema/i18n.json",
  "version": 1.9,
  "formatter": "prettier",
  "locale": {
    "source": "en",
    "targets": ["es", "fr"]
  },
  "buckets": {
    "json": {
      "include": ["locales/[locale].json"]
    }
  }
}
EOF

cat > .prettierrc << 'EOF'
{
  "tabWidth": 2,
  "useTabs": false,
  "singleQuote": false
}
EOF

echo "TEST 4: Running 'status' with Prettier formatter..."
node /Users/vrcprl/Work/oss/packages/cli/bin/cli.mjs status > /tmp/status-prettier.txt 2>&1
if grep -q "Configuration loaded" /tmp/status-prettier.txt; then
    echo "  ✓ Prettier configuration loaded successfully"
else
    echo "  ✗ FAILED: Prettier configuration did not load"
    cat /tmp/status-prettier.txt
    exit 1
fi
echo ""

# Test 5: Test with no formatter specified (default)
cat > i18n.json << 'EOF'
{
  "$schema": "https://lingo.dev/schema/i18n.json",
  "version": 1.9,
  "locale": {
    "source": "en",
    "targets": ["es", "fr"]
  },
  "buckets": {
    "json": {
      "include": ["locales/[locale].json"]
    }
  }
}
EOF

echo "TEST 5: Running 'status' with no formatter specified (default)..."
node /Users/vrcprl/Work/oss/packages/cli/bin/cli.mjs status > /tmp/status-default.txt 2>&1
if grep -q "Configuration loaded" /tmp/status-default.txt; then
    echo "  ✓ Default configuration loaded successfully"
else
    echo "  ✗ FAILED: Default configuration did not load"
    cat /tmp/status-default.txt
    exit 1
fi
echo ""

# Test 6: Test Biome without config file (should skip gracefully)
rm biome.json

cat > i18n.json << 'EOF'
{
  "$schema": "https://lingo.dev/schema/i18n.json",
  "version": 1.9,
  "formatter": "biome",
  "locale": {
    "source": "en",
    "targets": ["es", "fr"]
  },
  "buckets": {
    "json": {
      "include": ["locales/[locale].json"]
    }
  }
}
EOF

echo "TEST 6: Running 'status' with Biome but no biome.json (graceful skip)..."
node /Users/vrcprl/Work/oss/packages/cli/bin/cli.mjs status > /tmp/status-no-config.txt 2>&1
if grep -q "Configuration loaded" /tmp/status-no-config.txt; then
    echo "  ✓ Works without biome.json (graceful skip)"
else
    echo "  ✗ FAILED: Should work without biome.json"
    cat /tmp/status-no-config.txt
    exit 1
fi
echo ""

# Cleanup
cd /
rm -rf "$TEST_DIR"

echo "=========================================="
echo "All Tests Passed! ✓"
echo "=========================================="
echo ""
echo "Summary:"
echo "  ✓ Biome formatter configuration loads correctly"
echo "  ✓ Biome formatter runs without errors"
echo "  ✓ Prettier formatter works (backward compatible)"
echo "  ✓ Default formatter works (backward compatible)"
echo "  ✓ Graceful degradation when biome.json missing"
echo "  ✓ Commands execute successfully with formatters"
echo ""

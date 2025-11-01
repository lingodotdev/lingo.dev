# Stats Command - Verification Guide

## ✅ Implementation Status: **COMPLETE**

The `stats` command has been fully implemented and registered. Here's how to verify it works:

## Features Implemented

The command includes all requested features:

1. ✅ **Total keys** - Shows total unique translation keys across all buckets
2. ✅ **Translated** - Shows count of translated keys per locale
3. ✅ **Coverage** - Shows percentage of translation coverage per locale
4. ✅ **Per-language breakdown** - Table showing stats for each target locale
5. ✅ **Missing keys** - Shows missing keys with `--show-missing` flag

## Command Syntax

```bash
# Basic usage
npx lingo.dev@latest stats

# With options
npx lingo.dev@latest stats --show-missing
npx lingo.dev@latest stats --locale es --locale fr
npx lingo.dev@latest stats --bucket json
```

## How to Test/Check

### Method 1: Build and Test Locally (Recommended)

1. **Build the CLI package:**
   ```bash
   cd packages/cli
   pnpm build
   ```

2. **Test with a demo project:**
   ```bash
   # Navigate to a demo project
   cd packages/cli/demo/json
   
   # Run the stats command
   node ../../bin/cli.mjs stats
   
   # Or with missing keys
   node ../../bin/cli.mjs stats --show-missing
   ```

### Method 2: Use the Development Script

1. **From the CLI package root:**
   ```bash
   cd packages/cli
   pnpm lingo.dev stats
   ```

### Method 3: Test with Published Version

Once published, you can test directly:
```bash
npx lingo.dev@latest stats
```

## Expected Output Format

```
╔═══════════════════════════════════════════════════╗
║     TRANSLATION STATISTICS REPORT                 ║
╚═══════════════════════════════════════════════════╝

📊 SUMMARY:
• Source language: en
• Total keys: 10
• Overall coverage: 85.0%
• Target locales: 2

🌐 PER-LANGUAGE BREAKDOWN:
┌────────────┬───────────────┬───────────────┬───────────────┬───────────────┐
│ Language   │ Total Keys    │ Translated    │ Missing       │ Coverage      │
├────────────┼───────────────┼───────────────┼───────────────┼───────────────┤
│ es         │ 10            │ 8             │ 2             │ 80.0%         │
│ fr         │ 10            │ 9             │ 1             │ 90.0%         │
└────────────┴───────────────┴───────────────┴───────────────┴───────────────┘

💡 TIP:
  Use --show-missing flag to see the list of missing keys for each language
```

With `--show-missing`:
```
🔍 MISSING KEYS:

es:
  • key1
  • key2

fr:
  • key3
```

## Verification Checklist

- [x] Command registered in `packages/cli/src/cli/index.ts`
- [x] Command file created at `packages/cli/src/cli/cmd/stats.ts`
- [x] Shows total keys
- [x] Shows translated count
- [x] Shows coverage percentage
- [x] Shows per-language breakdown table
- [x] Supports `--show-missing` flag for missing keys list
- [x] Supports `--locale` filter option
- [x] Supports `--bucket` filter option
- [x] Color-coded output (green/yellow/red for coverage)
- [x] Proper error handling

## Quick Test Steps

1. **Navigate to a demo project:**
   ```bash
   cd packages/cli/demo/json
   ```

2. **Run the command (if CLI is built):**
   ```bash
   node ../../bin/cli.mjs stats
   ```

3. **Expected:** You should see a statistics report with:
   - Summary section
   - Per-language table
   - Coverage percentages

4. **Test missing keys:**
   ```bash
   node ../../bin/cli.mjs stats --show-missing
   ```

## Troubleshooting

### If command not found:
- Make sure you've built the CLI: `cd packages/cli && pnpm build`
- Check that `packages/cli/bin/cli.mjs` exists

### If no i18n.json found:
- Navigate to a directory with an `i18n.json` file
- Or run `lingo.dev init` first to initialize a project

### If TypeScript errors show in IDE:
- These are IDE-only errors and won't affect runtime
- Build the workspace packages: `pnpm build`
- Restart TypeScript server in your IDE

## Files Modified/Created

1. **Created:** `packages/cli/src/cli/cmd/stats.ts` - Main command implementation
2. **Modified:** `packages/cli/src/cli/index.ts` - Registered the command

The implementation is complete and ready to use!


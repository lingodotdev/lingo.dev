# Watch Mode Implementation

This document describes the implementation of the watch mode feature for the Lingo.dev CLI.

## Overview

The watch mode (`--watch` flag) automatically monitors source files for changes and triggers retranslation when modifications are detected. This eliminates the need for manual retranslation after each edit and keeps target language files in sync with source file changes.

## Usage

```bash
# Start watch mode
lingo.dev run --watch

# Watch with custom debounce timing (7 seconds)
lingo.dev run --watch --debounce 7000

# Watch with faster debounce for development (2 seconds)
lingo.dev run --watch --debounce 2000

# Watch with additional filters
lingo.dev run --watch --locale es --bucket json
lingo.dev run --watch --file "src/locales/*.json" --debounce 1000
```

## Features

### 1. Automatic File Monitoring
- Watches all source locale files based on your `i18n.json` configuration
- Monitors file changes, additions, and deletions
- Uses stable file watching to avoid false triggers

### 2. Debounced Processing
- Implements configurable debounce mechanism to avoid excessive retranslations
- Default: 5 seconds, customizable with `--debounce` flag
- Groups rapid changes into single translation batches
- Prevents resource waste from frequent file saves

### 3. Intelligent Pattern Detection
- Automatically determines which files to watch based on bucket patterns
- Replaces `[locale]` placeholders with source locale
- Respects filtering options (`--bucket`, `--file`, etc.)

### 4. Real-time Feedback
- Shows which files are being watched on startup
- Displays file change notifications
- Provides translation progress updates
- Shows completion status for each batch

### 5. Graceful Error Handling
- Continues watching even if individual translations fail
- Reports errors without stopping the watch process
- Maintains watch state across translation cycles

## Implementation Details

### File Structure
- `src/cli/cmd/run/watch.ts` - Main watch implementation
- `src/cli/cmd/run/_types.ts` - Updated to include watch flag
- `src/cli/cmd/run/index.ts` - Integration with main run command

### Key Components

#### Watch State Management
```typescript
interface WatchState {
  isRunning: boolean;
  pendingChanges: Set<string>;
  debounceTimer?: NodeJS.Timeout;
}
```

#### File Pattern Resolution
The watch mode automatically determines which files to monitor by:
1. Getting buckets from `i18n.json`
2. Applying user filters (`--bucket`, `--file`)
3. Replacing `[locale]` with source locale
4. Creating file patterns for chokidar

#### Debounce Logic
- Uses configurable debounce timer (default: 5000ms)
- Resets timer on each file change
- Only triggers translation when timer expires
- Prevents overlapping translation runs
- Customizable via `--debounce <milliseconds>` flag

### Dependencies
- `chokidar` - Robust file watching library
- Existing Lingo.dev pipeline (setup, plan, execute)

## Example Workflow

1. **Start Watch Mode**
   ```bash
   lingo.dev run --watch
   ```

2. **Initial Setup**
   - Performs normal translation setup
   - Runs initial planning and execution
   - Shows summary of completed translations
   - Starts file watching

3. **File Change Detection**
   ```
   📝 File changed: locales/en.json
   ⏳ Debouncing... (5000ms)
   ```

4. **Automatic Retranslation**
   ```
   🔄 Triggering retranslation...
   Changed files: locales/en.json
   
   [Planning] Found 2 translation task(s)
   [Localization] Processing tasks...
   ✅ Retranslation completed
   👀 Continuing to watch for changes...
   ```

## Error Handling

The watch mode is designed to be resilient:

- **Translation Errors**: Reports errors but continues watching
- **File System Errors**: Logs watch errors but maintains process
- **Invalid Files**: Skips problematic files and continues
- **Interrupt Handling**: Gracefully shuts down on Ctrl+C

## Performance Considerations

- **Efficient Pattern Matching**: Only watches relevant source files
- **Debounced Processing**: Prevents excessive API calls
- **Memory Management**: Clears completed change sets
- **Process Isolation**: Each translation runs in isolated context

## Testing

Use the provided demo setup script:

```bash
./demo-watch-setup.sh
cd /tmp/lingo-watch-demo
lingo.dev run --watch
```

Then in another terminal:
```bash
# Add a new translation key
echo '{"hello": "Hello", "world": "World", "welcome": "Welcome to Lingo.dev", "goodbye": "Goodbye"}' > locales/en.json

# Watch as translations are automatically updated
```

## Integration with Existing Features

The watch mode works seamlessly with all existing run command options:

- `--locale` - Watch only affects specified locales
- `--bucket` - Watch only monitors specified bucket types
- `--file` - Watch only monitors matching file patterns
- `--key` - Post-change filtering applies to specific keys
- `--force` - Forces full retranslation on each change
- `--api-key` - Uses specified API key for all operations
- `--concurrency` - Controls translation parallelism
- `--debounce` - Configures debounce delay in milliseconds (default: 5000ms)

## Future Enhancements

Potential improvements for future versions:

1. **Watch Exclusions**: Ignore specific files or patterns
2. **Selective Translation**: Only translate changed keys
3. **Change Summaries**: Show detailed change reports
4. **Multi-project Support**: Watch multiple i18n configurations
5. **Advanced Debounce Modes**: Per-file or per-bucket debouncing

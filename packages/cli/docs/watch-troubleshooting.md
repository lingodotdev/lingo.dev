# Watch Mode Troubleshooting Guide

This guide helps you diagnose and resolve common issues with Lingo.dev watch mode.

## Common Issues and Solutions

### 1. High CPU Usage

**Symptoms:**

- System becomes slow when watch mode is running
- High CPU usage in task manager/activity monitor
- Fan noise increases significantly

**Causes:**

- Watching too many files
- Debounce delay too short
- Batch size too large for system resources

**Solutions:**

#### Reduce File Watching Scope

```bash
# Use specific include patterns instead of watching everything
lingo.dev run --watch \
  --watch-include "src/locales/**/*.json" \
  --watch-exclude "**/node_modules/**"
```

#### Increase Debounce Delay

```bash
# Increase delay to reduce processing frequency
lingo.dev run --watch --debounce 10000
```

#### Optimize Performance Settings

```bash
# Reduce batch size and increase rate limiting
lingo.dev run --watch \
  --batch-size 10 \
  --rate-limit-delay 1000
```

#### Use Configuration File

```json
{
  "patterns": {
    "include": ["src/locales/**/*.json"],
    "exclude": ["**/node_modules/**", "**/build/**"]
  },
  "debounce": {
    "delay": 10000
  },
  "performance": {
    "batchSize": 10,
    "rateLimitDelay": 1000
  }
}
```

### 2. Memory Issues

**Symptoms:**

- Out of memory errors
- System becomes unresponsive
- Watch process crashes with memory errors

**Causes:**

- Too many files being watched simultaneously
- Large batch sizes
- Memory leaks in long-running processes

**Solutions:**

#### Reduce Batch Size

```bash
lingo.dev run --watch --batch-size 5
```

#### Increase Rate Limiting

```bash
lingo.dev run --watch --rate-limit-delay 2000
```

#### Use Exclude Patterns Aggressively

```bash
lingo.dev run --watch \
  --watch-exclude "**/node_modules/**" \
  --watch-exclude "**/build/**" \
  --watch-exclude "**/dist/**" \
  --watch-exclude "**/.git/**"
```

#### Restart Watch Process Periodically

For long-running processes, consider restarting watch mode periodically to clear memory.

### 3. Files Not Being Detected

**Symptoms:**

- File changes don't trigger retranslation
- Some files are ignored unexpectedly
- Watch mode seems inactive

**Causes:**

- Files don't match include patterns
- Files are excluded by exclude patterns
- File system permissions issues
- Symbolic links not being followed

**Solutions:**

#### Check Include Patterns

```bash
# Use verbose mode to see what files are being watched
lingo.dev run --watch --verbose
```

#### Test with Broad Patterns

```bash
# Temporarily use broad patterns to test detection
lingo.dev run --watch --watch-include "**/*"
```

#### Check File Permissions

Ensure the watch process has read permissions for all target files and directories.

#### Verify Exclude Patterns

```bash
# Remove exclude patterns temporarily to test
lingo.dev run --watch --watch-include "**/*.json"
```

### 4. Too Many File Changes

**Symptoms:**

- Constant retranslation
- System overwhelmed by file change events
- Watch mode never settles

**Causes:**

- Version control operations (git pull, branch switching)
- Build processes creating/modifying files
- Editor creating temporary files
- Debounce settings too aggressive

**Solutions:**

#### Use Batch Strategy

```bash
lingo.dev run --watch \
  --debounce-strategy batch \
  --max-wait 30000 \
  --batch-size 100
```

#### Exclude Build and Temporary Files

```bash
lingo.dev run --watch \
  --watch-exclude "**/build/**" \
  --watch-exclude "**/dist/**" \
  --watch-exclude "**/*.tmp" \
  --watch-exclude "**/*.swp" \
  --watch-exclude "**/.DS_Store"
```

#### Increase Debounce Delay

```bash
lingo.dev run --watch --debounce 15000
```

### 5. Slow Retranslation Performance

**Symptoms:**

- Long delays between file change and translation completion
- Progress indicators move slowly
- System appears to hang during translation

**Causes:**

- Large number of translation tasks
- Network latency to translation API
- Insufficient system resources
- Inefficient batch processing

**Solutions:**

#### Optimize Batch Processing

```bash
lingo.dev run --watch \
  --batch-size 100 \
  --rate-limit-delay 50
```

#### Use Adaptive Strategy

```bash
lingo.dev run --watch \
  --debounce-strategy adaptive \
  --debounce 2000 \
  --max-wait 20000
```

#### Increase Concurrency

```bash
lingo.dev run --watch --concurrency 20
```

### 6. Permission Errors

**Symptoms:**

- "Permission denied" errors
- "EACCES" errors in logs
- Watch mode fails to start

**Causes:**

- Insufficient file system permissions
- Files locked by other processes
- Network drive permission issues

**Solutions:**

#### Check File Permissions

```bash
# On Unix systems, ensure read permissions
chmod -R +r /path/to/translation/files
```

#### Run with Appropriate Permissions

```bash
# On Windows, run as administrator if necessary
# On Unix, use sudo only if absolutely necessary
```

#### Exclude Problematic Directories

```bash
lingo.dev run --watch \
  --watch-exclude "**/restricted/**" \
  --watch-exclude "**/system/**"
```

### 7. Network Drive Issues

**Symptoms:**

- Intermittent file detection failures
- "Network path not found" errors
- Slow file change detection

**Causes:**

- Network latency
- Intermittent network connectivity
- Network drive mounting issues

**Solutions:**

#### Increase Debounce Delay

```bash
lingo.dev run --watch --debounce 10000
```

#### Use Local File Copies

Copy translation files to local drive for development.

#### Configure Network Timeouts

Ensure network drives have appropriate timeout settings.

### 8. Editor Integration Issues

**Symptoms:**

- Changes in specific editors not detected
- Temporary files triggering unwanted retranslation
- File locking conflicts

**Causes:**

- Editor-specific file saving behavior
- Temporary file creation patterns
- File locking mechanisms

**Solutions:**

#### Exclude Editor Temporary Files

```bash
lingo.dev run --watch \
  --watch-exclude "**/*.tmp" \
  --watch-exclude "**/*.swp" \
  --watch-exclude "**/*~" \
  --watch-exclude "**/.#*"
```

#### Configure Editor Settings

- Disable automatic backup files
- Configure atomic saves if available
- Adjust auto-save intervals

#### Use Editor-Specific Patterns

```json
{
  "patterns": {
    "exclude": ["**/*.tmp", "**/*.swp", "**/*~", "**/.#*", "**/.*#*", "**/#*#"]
  }
}
```

## Diagnostic Commands

### Check Watch Status

```bash
# Run with verbose logging to see detailed information
lingo.dev run --watch --verbose
```

### Test File Detection

```bash
# Use minimal patterns to test basic functionality
lingo.dev run --watch --watch-include "test.json" --verbose
```

### Monitor System Resources

```bash
# On Unix systems
top -p $(pgrep -f "lingo.dev")

# On Windows
tasklist /fi "imagename eq node.exe"
```

### Check File Permissions

```bash
# On Unix systems
ls -la /path/to/translation/files

# On Windows
icacls "C:\path\to\translation\files"
```

## Configuration Validation

### Validate Configuration File

```bash
# Test configuration file syntax
node -e "console.log(JSON.parse(require('fs').readFileSync('./watch-config.json', 'utf8')))"
```

### Test Glob Patterns

```bash
# Use a glob testing tool to validate patterns
npx glob "**/*.json" --ignore "**/node_modules/**"
```

## Performance Monitoring

### Monitor File Count

```bash
# Count files matching your patterns
find . -name "*.json" | wc -l
```

### Check Memory Usage

```bash
# Monitor memory usage over time
while true; do ps -o pid,vsz,rss,comm -p $(pgrep -f "lingo.dev"); sleep 5; done
```

### Profile CPU Usage

```bash
# Use system profiling tools
# macOS: Instruments
# Linux: perf, htop
# Windows: Performance Monitor
```

## Getting Help

### Enable Debug Mode

```bash
lingo.dev run --watch --debug --verbose
```

### Collect System Information

When reporting issues, include:

- Operating system and version
- Node.js version
- Lingo.dev CLI version
- Project size (number of translation files)
- Configuration file contents
- Error messages and logs

### Community Support

- GitHub Issues: Report bugs and feature requests
- Discord: Get help from the community
- Documentation: Check the latest documentation

## Best Practices for Troubleshooting

1. **Start Simple**: Begin with basic watch mode and add complexity gradually
2. **Use Verbose Logging**: Enable verbose mode to understand what's happening
3. **Test in Isolation**: Create a minimal test case to reproduce issues
4. **Monitor Resources**: Keep an eye on CPU and memory usage
5. **Document Changes**: Keep track of configuration changes that work
6. **Regular Maintenance**: Restart watch mode periodically for long-running processes

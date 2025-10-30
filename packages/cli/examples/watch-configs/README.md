# Watch Configuration Examples

This directory contains example watch configuration files for different project types and use cases. These configurations can be used as starting points for your own watch mode setup.

## Available Configurations

### Basic Configuration

- **File**: `basic-watch-config.json`
- **Use Case**: General-purpose configuration with sensible defaults
- **Features**: Standard file patterns, moderate debouncing, minimal logging

### Development Environment

- **File**: `development-watch-config.json`
- **Use Case**: Active development with fast feedback
- **Features**: Short debounce delay, notifications enabled, verbose logging

### Production/CI Environment

- **File**: `production-watch-config.json`
- **Use Case**: Automated environments and CI/CD pipelines
- **Features**: Optimized performance, minimal output, no notifications

### Large Project

- **File**: `large-project-watch-config.json`
- **Use Case**: Projects with many translation files (1000+)
- **Features**: High batch size, optimized rate limiting, performance tuning

### React Application

- **File**: `react-app-watch-config.json`
- **Use Case**: React applications with typical project structure
- **Features**: React-specific file patterns, development-friendly settings

### Next.js Application

- **File**: `nextjs-watch-config.json`
- **Use Case**: Next.js applications with internationalization
- **Features**: Next.js-specific patterns, optimized for Next.js workflow

### Mobile Application

- **File**: `mobile-app-watch-config.json`
- **Use Case**: React Native, Flutter, or native mobile apps
- **Features**: Mobile-specific file patterns, platform file support

### Team Development

- **File**: `team-watch-config.json`
- **Use Case**: Collaborative development environments
- **Features**: Balanced settings, minimal distractions, shared configuration

## How to Use

### 1. Copy and Customize

Copy the configuration file that best matches your project:

```bash
cp packages/cli/examples/watch-configs/react-app-watch-config.json ./watch-config.json
```

Edit the configuration to match your project structure:

```json
{
  "patterns": {
    "include": ["src/locales/**/*.json", "your-custom-path/**/*.json"]
  }
}
```

### 2. Use with CLI

Reference the configuration file when running watch mode:

```bash
lingo.dev run --watch --watch-config ./watch-config.json
```

### 3. Validate Configuration

Use the JSON schema to validate your configuration:

```bash
# Install a JSON schema validator
npm install -g ajv-cli

# Validate your configuration
ajv validate -s packages/cli/examples/watch-configs/watch-config-schema.json -d ./watch-config.json
```

## Configuration Options

### Patterns

Define which files to watch:

```json
{
  "patterns": {
    "include": [
      "**/*.json", // All JSON files
      "src/locales/**", // Specific directory
      "**/*.{json,yaml,yml}" // Multiple extensions
    ],
    "exclude": [
      "**/node_modules/**", // Dependencies
      "**/build/**", // Build outputs
      "**/*.tmp" // Temporary files
    ]
  }
}
```

### Debouncing

Control when retranslation occurs:

```json
{
  "debounce": {
    "delay": 5000, // Wait 5 seconds after last change
    "maxWait": 30000 // Force retranslation after 30 seconds max
  }
}
```

### Monitoring

Configure feedback and logging:

```json
{
  "monitoring": {
    "enableProgressIndicators": true, // Show progress bars
    "enableNotifications": false, // Desktop notifications
    "logLevel": "minimal" // silent, minimal, verbose
  }
}
```

### Performance

Tune performance for your system:

```json
{
  "performance": {
    "batchSize": 50, // Files per batch
    "rateLimitDelay": 100 // Delay between batches (ms)
  }
}
```

## Common Patterns

### Include Patterns

```json
{
  "patterns": {
    "include": [
      "**/*.json", // All JSON files
      "src/**/*.{json,yaml,yml}", // Source files with multiple extensions
      "locales/**", // Entire locales directory
      "i18n/**/messages.json", // Specific filename pattern
      "translations/{en,es,fr}/**" // Specific locale directories
    ]
  }
}
```

### Exclude Patterns

```json
{
  "patterns": {
    "exclude": [
      "**/node_modules/**", // Dependencies
      "**/.git/**", // Version control
      "**/build/**", // Build outputs
      "**/dist/**", // Distribution files
      "**/*.{tmp,backup,log}", // Temporary/backup files
      "**/.DS_Store", // macOS system files
      "**/Thumbs.db", // Windows system files
      "**/__tests__/**", // Test directories
      "**/*.test.*", // Test files
      "**/*.spec.*" // Spec files
    ]
  }
}
```

## Project-Specific Examples

### Monorepo Configuration

```json
{
  "patterns": {
    "include": ["packages/*/src/locales/**/*.json", "apps/*/locales/**/*.json"],
    "exclude": ["**/node_modules/**", "**/build/**", "**/dist/**"]
  }
}
```

### Multi-Platform Mobile App

```json
{
  "patterns": {
    "include": [
      "src/locales/**/*.json",
      "android/app/src/main/res/values*/*.xml",
      "ios/**/*.strings",
      "assets/i18n/**/*.json"
    ]
  }
}
```

### Documentation Site

```json
{
  "patterns": {
    "include": ["content/**/*.md", "i18n/**/*.json", "locales/**/*.yaml"],
    "exclude": ["**/node_modules/**", "**/.next/**", "**/build/**"]
  }
}
```

## Troubleshooting

### Configuration Not Working?

1. **Validate JSON syntax**: Use a JSON validator or editor with syntax checking
2. **Check file paths**: Ensure patterns match your actual file structure
3. **Test patterns**: Use glob testing tools to verify pattern matching
4. **Enable verbose logging**: Add `"logLevel": "verbose"` to see detailed information

### Performance Issues?

1. **Reduce batch size**: Lower `batchSize` value
2. **Increase rate limiting**: Higher `rateLimitDelay` value
3. **Use more specific patterns**: Avoid watching unnecessary files
4. **Exclude more directories**: Add build outputs and dependencies to exclude patterns

### Files Not Detected?

1. **Check include patterns**: Ensure your files match the include patterns
2. **Verify exclude patterns**: Make sure files aren't being excluded unintentionally
3. **Test with broad patterns**: Temporarily use `"**/*"` to test detection
4. **Check file permissions**: Ensure the watch process can read the files

## Schema Validation

All configuration files should validate against the JSON schema provided in `watch-config-schema.json`. This ensures:

- Correct property names and types
- Valid enum values for options like `logLevel`
- Appropriate ranges for numeric values
- Required properties are present

To validate your configuration:

```bash
# Using ajv-cli
ajv validate -s watch-config-schema.json -d your-config.json

# Using VS Code with JSON schema extension
# Add this to the top of your config file:
{
  "$schema": "./watch-config-schema.json",
  // ... your configuration
}
```

## Contributing

If you have a configuration that works well for a specific use case not covered here, please consider contributing it:

1. Create a new configuration file following the naming pattern
2. Add appropriate description and comments
3. Test the configuration thoroughly
4. Update this README with the new configuration
5. Submit a pull request

## Support

For help with watch configuration:

- Check the [troubleshooting guide](../docs/watch-troubleshooting.md)
- Review the [watch mode documentation](../docs/watch-mode.md)
- Ask questions in our Discord community
- Report issues on GitHub

# Watch Mode Documentation

## Overview

Watch mode enables real-time monitoring of translation source files and automatically triggers retranslation when changes are detected. This hot reload functionality provides developers with immediate feedback during the translation development process, similar to how modern development servers automatically refresh when code changes are made.

## Basic Usage

### Simple Watch Mode

Start watching for file changes with default settings:

```bash
npx lingo.dev run --watch
```

This will:

- Monitor all configured translation files
- Wait 5 seconds after changes before retranslating
- Show progress indicators
- Use simple debouncing strategy

### Watch with Custom Debounce

Adjust the delay before retranslation:

```bash
npx lingo.dev run --watch --debounce 3000
```

Useful when you want faster feedback (3 seconds instead of default 5 seconds).

## Advanced Configuration

### File Pattern Filtering

#### Include Specific Patterns

Only watch specific file patterns:

```bash
npx lingo.dev run --watch \
  --watch-include "**/*.json" \
  --watch-include "src/locales/**"
```

#### Exclude Patterns

Exclude specific files or directories:

```bash
npx lingo.dev run --watch \
  --watch-exclude "**/node_modules/**" \
  --watch-exclude "**/*.tmp" \
  --watch-exclude "**/.git/**"
```

#### Combined Include/Exclude

Use both include and exclude patterns for precise control:

```bash
npx lingo.dev run --watch \
  --watch-include "src/**/*.json" \
  --watch-exclude "src/build/**" \
  --watch-exclude "**/*.backup.json"
```

### Debouncing Strategies

#### Simple Strategy (Default)

Fixed delay after last file change:

```bash
npx lingo.dev run --watch --debounce-strategy simple --debounce 5000
```

Best for: Predictable behavior, single developer workflows

#### Adaptive Strategy

Adjusts delay based on change frequency:

```bash
npx lingo.dev run --watch \
  --debounce-strategy adaptive \
  --debounce 2000 \
  --max-wait 15000
```

Best for: Variable workflows, bulk editing sessions

#### Batch Strategy

Groups changes together efficiently:

```bash
npx lingo.dev run --watch \
  --debounce-strategy batch \
  --debounce 1000 \
  --max-wait 10000 \
  --batch-size 25
```

Best for: Large projects, version control operations

### Performance Tuning

#### For Large Projects

Optimize for projects with many files:

```bash
npx lingo.dev run --watch \
  --batch-size 100 \
  --rate-limit-delay 50 \
  --debounce-strategy batch \
  --max-wait 20000
```

#### For Resource-Constrained Systems

Reduce system load:

```bash
npx lingo.dev run --watch \
  --batch-size 10 \
  --rate-limit-delay 500 \
  --debounce 10000 \
  --quiet
```

### Feedback and Notifications

#### Minimal Output

Suppress non-essential output:

```bash
npx lingo.dev run --watch --quiet
```

#### Desktop Notifications

Enable system notifications:

```bash
npx lingo.dev run --watch --notifications
```

#### Audio Feedback

Play sounds on completion:

```bash
npx lingo.dev run --watch --sound
```

#### Disable Progress Indicators

For cleaner logs:

```bash
npx lingo.dev run --watch --no-progress
```

## Configuration File

### Basic Configuration File

Create `watch-config.json`:

```json
{
  "patterns": {
    "include": ["src/**/*.json", "locales/**/*.yaml"],
    "exclude": ["**/node_modules/**", "**/*.tmp"]
  },
  "debounce": {
    "delay": 3000,
    "maxWait": 15000
  },
  "monitoring": {
    "enableProgressIndicators": true,
    "enableNotifications": false,
    "logLevel": "minimal"
  },
  "performance": {
    "batchSize": 50,
    "rateLimitDelay": 100
  }
}
```

Use the configuration file:

```bash
npx lingo.dev run --watch --watch-config ./watch-config.json
```

### Advanced Configuration Examples

#### Development Environment

`dev-watch-config.json`:

```json
{
  "patterns": {
    "include": ["src/**/*.json"],
    "exclude": ["src/build/**", "**/node_modules/**"]
  },
  "debounce": {
    "delay": 2000,
    "maxWait": 10000
  },
  "monitoring": {
    "enableProgressIndicators": true,
    "enableNotifications": true,
    "logLevel": "verbose"
  },
  "performance": {
    "batchSize": 25,
    "rateLimitDelay": 100
  }
}
```

#### Production/CI Environment

`ci-watch-config.json`:

```json
{
  "patterns": {
    "include": ["**/*.json", "**/*.yaml"],
    "exclude": ["**/node_modules/**", "**/.git/**", "**/build/**"]
  },
  "debounce": {
    "delay": 5000,
    "maxWait": 30000
  },
  "monitoring": {
    "enableProgressIndicators": false,
    "enableNotifications": false,
    "logLevel": "minimal"
  },
  "performance": {
    "batchSize": 100,
    "rateLimitDelay": 50
  }
}
```

## Common Use Cases

### React Development

Watch React app translation files:

```bash
npx lingo.dev run --watch \
  --watch-include "src/locales/**/*.json" \
  --watch-include "public/locales/**/*.json" \
  --debounce 2000 \
  --notifications
```

### Next.js Projects

Watch Next.js internationalization files:

```bash
npx lingo.dev run --watch \
  --watch-include "locales/**/*.json" \
  --watch-include "messages/**/*.json" \
  --debounce-strategy adaptive \
  --sound
```

### Mobile App Development

Watch mobile app translation files:

```bash
npx lingo.dev run --watch \
  --watch-include "assets/i18n/**/*.json" \
  --watch-include "src/translations/**/*.json" \
  --batch-size 20 \
  --debounce 3000
```

### Multi-format Projects

Watch various file formats:

```bash
npx lingo.dev run --watch \
  --watch-include "**/*.json" \
  --watch-include "**/*.yaml" \
  --watch-include "**/*.yml" \
  --watch-exclude "**/node_modules/**" \
  --debounce-strategy batch
```

### Team Development

Configuration for team environments:

```bash
npx lingo.dev run --watch \
  --watch-config ./team-watch-config.json \
  --quiet \
  --no-progress
```

## Troubleshooting

### High CPU Usage

If watch mode uses too much CPU:

```bash
npx lingo.dev run --watch \
  --batch-size 10 \
  --rate-limit-delay 1000 \
  --debounce 10000
```

### Too Many File Changes

If you're getting overwhelmed by file changes:

```bash
npx lingo.dev run --watch \
  --debounce-strategy batch \
  --max-wait 30000 \
  --batch-size 100
```

### Missing File Changes

If some file changes aren't detected:

```bash
npx lingo.dev run --watch \
  --watch-include "**/*" \
  --debounce 1000 \
  --verbose
```

### Memory Issues

For memory-constrained environments:

```bash
npx lingo.dev run --watch \
  --batch-size 5 \
  --rate-limit-delay 2000 \
  --quiet
```

## Integration Examples

### Package.json Scripts

Add watch scripts to your `package.json`:

```json
{
  "scripts": {
    "i18n:watch": "lingo.dev run --watch",
    "i18n:watch:dev": "lingo.dev run --watch --debounce 2000 --notifications",
    "i18n:watch:quiet": "lingo.dev run --watch --quiet --no-progress"
  }
}
```

### Docker Integration

Dockerfile example:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "i18n:watch:quiet"]
```

### GitHub Actions

CI workflow example:

```yaml
name: Translation Watch
on:
  push:
    paths:
      - "src/locales/**"
      - "locales/**"

jobs:
  watch:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "18"
      - run: npm install
      - run: npx lingo.dev run --watch --watch-config ./ci-watch-config.json
        env:
          LINGODOTDEV_API_KEY: ${{ secrets.LINGODOTDEV_API_KEY }}
```

## Best Practices

### File Organization

1. **Group translation files** in dedicated directories
2. **Use consistent naming** patterns for translation files
3. **Exclude build outputs** and temporary files from watching
4. **Include only source files** that should trigger retranslation

### Performance Optimization

1. **Use specific include patterns** instead of watching everything
2. **Exclude unnecessary directories** like `node_modules`, `.git`, `build`
3. **Adjust batch size** based on your project size
4. **Use appropriate debounce strategy** for your workflow

### Development Workflow

1. **Start with simple strategy** and default settings
2. **Add notifications** for background monitoring
3. **Use quiet mode** in CI/CD environments
4. **Enable sound feedback** for long-running operations

### Team Collaboration

1. **Share watch configuration files** in version control
2. **Document team-specific settings** in project README
3. **Use consistent debounce settings** across team members
4. **Test watch mode** in different development environments

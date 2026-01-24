# man-lingo (mango/mani)

Translate man pages and command help to any language using [Lingo.dev](https://lingo.dev) AI translation.

## Features

- 🌐 Translate any man page or `--help` output to your preferred language
- ⚡ Smart caching for instant repeat lookups
- 📄 Supports both `man` pages and `--help`/`-h` flags
- 🎨 Preserves terminal formatting where possible

## Working demo
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/40d7304b-978d-4af3-b017-2d870e25cd27" />
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/d781d79e-737c-43d6-97ba-f3297daaf7a8" />



## Installation

```bash
# Clone and install dependencies
npm install


## Setup

You need a Lingo.dev API key to use this tool:

1. Sign up at [lingo.dev](https://lingo.dev)
2. Get your API key from the dashboard
3. Set the environment variable:

LINGODOTDEV_API_KEY=your_api_key_here
LINGO_TARGET_LANG=hi  # Hindi (default)

```

```
# Run locally
npm run dev  git -l es  # understand git manual in spanish

# or
npm run dev  git -l hi  # understand git manual in hindi

#or

# Build the project
npm run build

# Link globally (optional)
npm link

# Translate git man page to Hindi (default)
mani git

# Translate git commit help to Spanish
mani git commit --lang es

# Translate ls man page to French
mani ls --lang fr

# Force re-translation (bypass cache)
mani git --force

# Show translation progress
mani git --progress

# Clear all cached translations
mani --clear-cache
```

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `-l, --lang <locale>` | Target language locale | `hi` (Hindi) |
| `-f, --force` | Bypass cache and re-translate | `false` |
| `--no-cache` | Disable caching for this request | - |
| `-p, --progress` | Show translation progress | `false` |
| `--clear-cache` | Clear all cached translations | - |

## How It Works

1. **Execute**: Runs `man <command>` or `<command> --help` to get help text
2. **Cache Check**: Looks for existing translation in `~/.lingo-man/cache/`
3. **Translate**: Sends text to Lingo.dev API for AI translation
4. **Cache Save**: Stores translation for future use
5. **Display**: Shows translated output

## Supported Languages

Lingo.dev supports many languages. Use standard locale codes:

- `hi` - Hindi
- `es` - Spanish
- `fr` - French
- `de` - German
- `ja` - Japanese
- `zh` - Chinese
- `ar` - Arabic
- `pt` - Portuguese
- And many more...


## Cache Location

Translations are cached at:
```
~/.lingo-man/cache/
```

Each translation is stored as a JSON file with a hashed filename based on the command, locale, and content hash.

## License

MIT


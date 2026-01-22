# Lingo CLI - Translation Pipeline

A production-grade CLI tool for translating files using the [lingo.dev](https://lingo.dev) JavaScript SDK.

## 🚀 Features

- **Smart Path Handling**: Translate single files, directories, or use `.` for current directory
- **Format Preservation**: Maintains formatting for Markdown, JSON, and text files
- **Recursive Scanning**: Automatically finds all supported files in directories
- **Auto-detection**: Source language can be auto-detected
- **Safe Writing**: Never overwrites existing files
- **Comprehensive Reporting**: Detailed progress and error reporting
- **Clean Architecture**: Service-based design for maintainability

## ✅ Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **API Key**: A valid API key from [lingo.dev](https://lingo.dev)

## 📦 Installation

### From Source

```bash
# Clone or navigate to the project
cd LingoDev

# Install dependencies
npm install

# Build the project
npm run build

# Link globally (optional)
npm link
```

### From npm (when published)

```bash
npm install -g lingo-cli
```

## ⚙️ Configuration

There are two ways to configure your API key:

### 1. Using CLI (Recommended)

You can save your API key globally using the CLI:

```bash
translate --set-key your_api_key_here
```

To remove the saved key:

```bash
translate --reset-key
```

### 2. Using Environment Variables

Create a `.env` file in the directory where you run the command:

```env
LINGODOTDEV_API_KEY=your_api_key_here
```

Or set it in your terminal session:

```bash
export LINGODOTDEV_API_KEY=your_api_key_here
```

## 🌍 Supported Languages

To see a list of all supported languages, run:

```bash
translate --languages
# or
translate -l
```

This will display all available language codes (e.g., `en`, `hi`, `fr`, `ja`) and their full names.

## 📖 Usage

### Command Syntax

```bash
translate <path> [sourceLanguage] [targetLanguage]
```

### Arguments

| Argument         | Description                                            | Default | Required |
| ---------------- | ------------------------------------------------------ | ------- | -------- |
| `path`           | File or directory path (use `.` for current directory) | -       | ✓        |
| `sourceLanguage` | Source language code or `auto`                         | `auto`  | ✗        |
| `targetLanguage` | Target language code                                   | `en`    | ✗        |

### Flags

| Flag                | Description                          |
| ------------------- | ------------------------------------ |
| `--languages`, `-l` | Show all supported language codes    |
| `--set-key`         | Save API key to global configuration |
| `--reset-key`       | Remove saved API key                 |
| `--help`, `-h`      | Show help message                    |
| `--version`, `-v`   | Show version information             |

### Examples

```bash
# Translate all files in current directory to English (auto-detect source)
translate .

# Translate to Hindi (auto-detect source)
translate . auto hi

# Translate from Hindi to English
translate . hi en

# Translate a specific directory from French to English
translate ./docs fr en

# Translate a single file from Spanish to English
translate ./readme.md es en
```

### Supported File Types

| Extension | Description | Translation Behavior                               |
| --------- | ----------- | -------------------------------------------------- |
| `.md`     | Markdown    | Preserves formatting, code blocks remain unchanged |
| `.json`   | JSON        | Translates values only, keys remain unchanged      |
| `.txt`    | Plain text  | Translates entire content                          |

### Output Files

Translated files are saved with a language suffix:

```
file.md       → file.en.md
data.json     → data.en.json
readme.txt    → readme.hi.txt
```

## 🏗️ Architecture

The project follows a clean, service-based architecture:

```
src/
├── bin/
│   └── translate.ts          # CLI entry point
├── services/
│   ├── CLIService.ts          # Argument parsing & validation
│   ├── ConfigService.ts       # Configuration management
│   ├── FileScannerService.ts  # File system scanning
│   ├── TranslationService.ts  # Translation logic
│   └── FileWriterService.ts   # File writing
├── App.ts                     # Main orchestrator
└── index.ts                   # Package exports
```

### Service Responsibilities

#### 1️⃣ **CLIService**

- Parses command-line arguments
- Validates paths and language codes
- Resolves `.` to `process.cwd()`
- Provides usage help

#### 2️⃣ **ConfigService**

- Singleton pattern for configuration
- Reads environment variables
- Provides default settings
- Validates API configuration

#### 3️⃣ **FileScannerService**

- Recursively scans directories
- Filters by supported file types
- Returns absolute file paths

#### 4️⃣ **TranslationService**

- Wraps lingo.dev SDK
- Format-aware translation:
  - **Markdown**: Preserves code blocks and formatting
  - **JSON**: Translates values, keeps keys intact
  - **Text**: Translates entire content

#### 5️⃣ **FileWriterService**

- Generates localized filenames
- Safely writes files
- Prevents overwriting existing files

## 🎯 How It Works: `translate . hi en`

Let's trace through what happens when you run `translate . hi en`:

### 1. **CLI Parsing** (CLIService)

```typescript
// Input: ['node', 'translate.js', '.', 'hi', 'en']
{
  path: '/absolute/path/to/current/directory',  // '.' resolved to process.cwd()
  sourceLanguage: 'hi',
  targetLanguage: 'en'
}
```

### 2. **File Scanning** (FileScannerService)

```typescript
// Recursively scans directory
[
  "/absolute/path/readme.md",
  "/absolute/path/data.json",
  "/absolute/path/docs/guide.md",
];
// Only .md, .json, .txt files included
```

### 3. **Translation** (TranslationService)

For each file:

```typescript
// Read content
const content = await readFile(filePath);

// Translate based on file type
if (fileType === ".md") {
  // Preserve markdown formatting, protect code blocks
  translated = await translateMarkdown(content, "hi", "en");
} else if (fileType === ".json") {
  // Translate values only, keep keys
  translated = await translateJson(content, "hi", "en");
} else {
  // Translate entire content
  translated = await translateText(content, "hi", "en");
}
```

### 4. **File Writing** (FileWriterService)

```typescript
// Generate output filename
'readme.md' → 'readme.en.md'
'data.json' → 'data.en.json'

// Write to same directory
await writeFile(outputPath, translatedContent);
```

### 5. **Summary Report**

```
═══════════════════════════════════════════════════════════
📊 Translation Summary
═══════════════════════════════════════════════════════════
✔  8 file(s) translated
⚠  3 file(s) skipped
❌ 1 file(s) failed
═══════════════════════════════════════════════════════════
```

## 🔧 Development

### Build

```bash
npm run build
```

### Watch Mode

```bash
npm run dev
```

### Run Locally

```bash
# After building
npm run translate -- . hi en

# Or use node directly
node dist/bin/translate.js . hi en
```

## 🧪 Error Handling

The CLI handles various error scenarios:

- **Invalid paths**: Clear error message with path validation
- **Empty directories**: Warns when no supported files found
- **Unsupported file types**: Silently skips with summary
- **SDK failures**: Catches and reports translation errors
- **File conflicts**: Skips existing files to prevent overwrites
- **Missing API key**: Validates configuration before processing

## 📝 Example Output

```
🚀 Starting translation pipeline...

📁 Path: /Users/harsh/projects/docs
🌍 Translation: hi → en

🔍 Scanning for files...
✓ Found 5 file(s) to translate

📄 Processing: /Users/harsh/projects/docs/readme.md
📡 Translating: hi → en
   ✓ Saved to: /Users/harsh/projects/docs/readme.en.md

📄 Processing: /Users/harsh/projects/docs/data.json
📡 Translating: hi → en
   ✓ Saved to: /Users/harsh/projects/docs/data.en.json

═══════════════════════════════════════════════════════════
📊 Translation Summary
═══════════════════════════════════════════════════════════
✔  5 file(s) translated
⚠  0 file(s) skipped
❌ 0 file(s) failed
═══════════════════════════════════════════════════════════
```

## 🔌 Integrating lingo.dev SDK

The current implementation includes a placeholder for the lingo.dev SDK. To integrate the actual SDK:

1. Install the SDK:

```bash
npm install @lingo.dev/sdk
```

2. Update `TranslationService.ts`:

```typescript
import { LingoClient } from '@lingo.dev/sdk';

private async callLingoApi(
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<string> {
  const client = new LingoClient({
    apiKey: this.config.getApiKey()
  });

  const result = await client.translate({
    text,
    from: sourceLanguage,
    to: targetLanguage
  });

  return result.translatedText;
}
```

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using TypeScript and lingo.dev

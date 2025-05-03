# Lingo.dev PHP SDK Demo

This demo shows how to use the [Lingo.dev PHP SDK](https://packagist.org/packages/lingodotdev/sdk) for localizing content in various formats. This guide is designed to be easy to follow for non-PHP developers.

## Prerequisites

Before you begin, make sure you have:

1. **PHP installed** (version 8.1 or later)
   - For Windows: [Download from windows.php.net](https://windows.php.net/download/)
   - For macOS: `brew install php` (using Homebrew)
   - For Linux: `sudo apt install php8.1` (Ubuntu/Debian) or `sudo yum install php` (CentOS/RHEL)

2. **Composer installed** (PHP package manager)
   - Follow the [official Composer installation guide](https://getcomposer.org/download/)

3. **Lingo.dev API Key**
   - Sign up at [Lingo.dev](https://lingo.dev) to get your API key

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/lingodotdev/lingo.dev.git
   cd lingo.dev/php/demo
   ```

2. Install dependencies:
   ```bash
   composer install
   ```

## Running the Demo

You can run the demo in two ways:

### Option 1: Pass API key as command-line argument
```bash
php index.php your-api-key-here
```

### Option 2: Set environment variable

For Linux/macOS:
```bash
export LINGODOTDEV_API_KEY=your-api-key-here
php index.php
```

For Windows Command Prompt:
```cmd
set LINGODOTDEV_API_KEY=your-api-key-here
php index.php
```

For Windows PowerShell:
```powershell
$env:LINGODOTDEV_API_KEY="your-api-key-here"
php index.php
```

## What the Demo Shows

The demo demonstrates four key features of the Lingo.dev PHP SDK:

1. **Text Localization**: Translating a simple text string from English to Spanish
2. **Object Localization**: Translating an array of strings from English to French
3. **Chat Localization**: Translating a chat conversation while preserving speaker names from English to German
4. **Language Detection**: Detecting the language of a given text

## How It Works

The demo initializes the Lingo.dev SDK with your API key, then shows examples of each localization method:

```php
// Initialize the SDK
$engine = new LingoDotDevEngine([
    'apiKey' => $apiKey,
]);

// Example: Localize text
$localizedText = $engine->localizeText("Hello world", [
    'sourceLocale' => 'en',
    'targetLocale' => 'es',
]);
```

## Modifying the Demo

Feel free to modify the examples in `index.php` to test different texts, languages, or features. The main configuration options include:

- `sourceLocale`: The source language code (e.g., 'en', 'fr')
- `targetLocale`: The target language code for translation
- `fast`: Set to `true` for faster but potentially less accurate translations

## Troubleshooting

- **API Key Issues**: Make sure your API key is valid and has proper permissions
- **PHP Version**: Ensure you're using PHP 8.1 or later
- **Composer Dependencies**: If you encounter errors, try running `composer update` to update dependencies

## Additional Resources

- [Lingo.dev Documentation](https://lingo.dev/go/docs)
- [PHP SDK Source Code](https://github.com/lingodotdev/lingo.dev/tree/main/php/sdk)
- [Packagist Package](https://packagist.org/packages/lingodotdev/sdk)

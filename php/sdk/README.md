# Lingo.dev PHP SDK

Official PHP SDK for Lingo.dev.

## Installation

```bash
composer require lingodotdev/sdk
```

## Usage

```php
<?php

use Lingodotdev\Sdk\LingoDotDevEngine;

// Initialize the SDK with your API key
$engine = new LingoDotDevEngine([
    'apiKey' => 'your-api-key',
]);

// Localize a text string
$localizedText = $engine->localizeText('Hello, world!', [
    'sourceLocale' => 'en',
    'targetLocale' => 'es',
]);

// Localize an object
$localizedObject = $engine->localizeObject([
    'greeting' => 'Hello',
    'farewell' => 'Goodbye'
], [
    'sourceLocale' => 'en',
    'targetLocale' => 'fr',
]);

// Localize a chat conversation
$localizedChat = $engine->localizeChat([
    ['name' => 'Alice', 'text' => 'Hello, how are you?'],
    ['name' => 'Bob', 'text' => 'I am fine, thank you!']
], [
    'sourceLocale' => 'en',
    'targetLocale' => 'de',
]);

// Detect language
$locale = $engine->recognizeLocale('Bonjour le monde');
```

## Documentation

[Documentation](https://lingo.dev/go/docs)

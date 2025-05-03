<?php

require 'vendor/autoload.php';

use LingoDotDev\Sdk\LingoDotDevEngine;

if (!isset($_ENV['LINGO_API_KEY']) && !isset($argv[1])) {
    echo "Error: API key is required. Either set the LINGO_API_KEY environment variable or pass it as a command-line argument.\n";
    echo "Usage: php index.php <your-api-key>\n";
    exit(1);
}

$apiKey = $_ENV['LINGO_API_KEY'] ?? $argv[1];

$engine = new LingoDotDevEngine([
    'apiKey' => $apiKey,
]);

echo "Lingo.dev PHP SDK Demo\n";
echo "======================\n\n";

$exampleText = "Hello, welcome to Lingo.dev PHP SDK!";
echo "Original text: $exampleText\n";

try {
    $localizedText = $engine->localizeText($exampleText, [
        'sourceLocale' => 'en',
        'targetLocale' => 'es',
    ]);
    echo "Localized to Spanish: $localizedText\n\n";
} catch (\Exception $e) {
    echo "Error localizing text: " . $e->getMessage() . "\n\n";
}

$exampleObject = [
    'greeting' => 'Welcome to our website',
    'message' => 'Thank you for trying our SDK',
    'farewell' => 'Have a great day'
];

echo "Original object:\n";
print_r($exampleObject);

try {
    $localizedObject = $engine->localizeObject($exampleObject, [
        'sourceLocale' => 'en',
        'targetLocale' => 'fr',
    ]);
    echo "Localized object to French:\n";
    print_r($localizedObject);
    echo "\n";
} catch (\Exception $e) {
    echo "Error localizing object: " . $e->getMessage() . "\n\n";
}

$exampleChat = [
    ['name' => 'Alice', 'text' => 'Hello, how can I help you today?'],
    ['name' => 'Bob', 'text' => 'I need information about the SDK.'],
    ['name' => 'Alice', 'text' => 'Sure, what would you like to know?']
];

echo "Original chat:\n";
foreach ($exampleChat as $message) {
    echo $message['name'] . ": " . $message['text'] . "\n";
}

try {
    $localizedChat = $engine->localizeChat($exampleChat, [
        'sourceLocale' => 'en',
        'targetLocale' => 'de',
    ]);
    echo "Localized chat to German:\n";
    foreach ($localizedChat as $message) {
        echo $message['name'] . ": " . $message['text'] . "\n";
    }
    echo "\n";
} catch (\Exception $e) {
    echo "Error localizing chat: " . $e->getMessage() . "\n\n";
}

$textToDetect = "Bonjour le monde";
echo "Text for language detection: $textToDetect\n";

try {
    $detectedLocale = $engine->recognizeLocale($textToDetect);
    echo "Detected language: $detectedLocale\n";
} catch (\Exception $e) {
    echo "Error detecting language: " . $e->getMessage() . "\n";
}

<?php
/**
 * Packagist Publishing Script
 * 
 * This script handles publishing a package to Packagist using the Packagist API.
 * It requires the following environment variables:
 * - PACKAGIST_USERNAME: The Packagist username
 * - PACKAGIST_API_TOKEN: The Packagist API token
 * - PACKAGE_NAME: The name of the package to publish (e.g., vendor/package)
 * - PACKAGIST_REPO_URL: (Optional) The repository URL. Defaults to https://github.com/lingodotdev/lingo.dev
 * 
 * @php      7.4
 */

/**
 * Validate package name format (vendor/package)
 */
function validatePackageName(string $packageName): bool {
    return preg_match('/^[a-z0-9]([_.-]?[a-z0-9]+)*\/[a-z0-9]([_.-]?[a-z0-9]+)*$/i', $packageName) === 1;
}

/**
 * Validate environment variable is non-empty string
 */
function validateEnvVar(string $value, string $name): bool {
    return is_string($value) && trim($value) !== '';
}

/**
 * Make a secure cURL request with proper error handling
 */
function makeCurlRequest(string $url, array $options = []): array {
    $ch = curl_init($url);
    
    // Default secure options
    $defaultOptions = [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_HTTPHEADER => [
            'Accept: application/json'
        ]
    ];
    
    // Merge with provided options
    foreach (array_merge($defaultOptions, $options) as $key => $value) {
        curl_setopt($ch, $key, $value);
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    $errno = curl_errno($ch);
    
    curl_close($ch);
    
    if ($response === false || $errno !== 0) {
        return [
            'success' => false,
            'error' => $error ?: 'Unknown cURL error',
            'errno' => $errno,
            'httpCode' => $httpCode
        ];
    }
    
    return [
        'success' => true,
        'response' => $response,
        'httpCode' => $httpCode
    ];
}

// Get and validate environment variables
$username = getenv('PACKAGIST_USERNAME');
$apiToken = getenv('PACKAGIST_API_TOKEN');
$packageName = getenv('PACKAGE_NAME');
$repoUrl = getenv('PACKAGIST_REPO_URL') ?: 'https://github.com/lingodotdev/lingo.dev';

if (!validateEnvVar($username, 'PACKAGIST_USERNAME') || 
    !validateEnvVar($apiToken, 'PACKAGIST_API_TOKEN') || 
    !validateEnvVar($packageName, 'PACKAGE_NAME')) {
    echo "Error: Missing required environment variables.\n";
    echo "Please ensure PACKAGIST_USERNAME, PACKAGIST_API_TOKEN, and PACKAGE_NAME are set and non-empty.\n";
    exit(1);
}

// Validate package name format
if (!validatePackageName($packageName)) {
    echo "Error: Invalid package name format: $packageName\n";
    echo "Package name must be in the format 'vendor/package' (e.g., 'lingodotdev/lingo.dev')\n";
    exit(1);
}

// Validate repository URL format
if (!filter_var($repoUrl, FILTER_VALIDATE_URL)) {
    echo "Error: Invalid repository URL format: $repoUrl\n";
    exit(1);
}

echo "Starting Packagist publishing process for package: $packageName\n";

// Check if package exists
$checkUrl = "https://packagist.org/packages/" . urlencode($packageName) . ".json";
$checkResult = makeCurlRequest($checkUrl);

if (!$checkResult['success']) {
    echo "Error checking package existence: " . $checkResult['error'] . "\n";
    exit(1);
}

$packageExists = ($checkResult['httpCode'] === 200);

if ($packageExists) {
    echo "Package $packageName already exists on Packagist. Updating...\n";
    $apiUrl = "https://packagist.org/api/update-package";
} else {
    echo "Package $packageName does not exist on Packagist. Creating new package...\n";
    $apiUrl = "https://packagist.org/api/create-package";
}

$data = [
    'repository' => [
        'url' => $repoUrl
    ]
];

// Use HTTP Basic Auth with API token in headers instead of URL
$authHeader = 'Authorization: Basic ' . base64_encode($username . ':' . $apiToken);

$apiResult = makeCurlRequest($apiUrl, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($data),
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Accept: application/json',
        $authHeader
    ]
]);

if (!$apiResult['success']) {
    echo "Error: " . $apiResult['error'] . "\n";
    exit(1);
}

$responseData = json_decode($apiResult['response'], true);

echo "HTTP Response Code: " . $apiResult['httpCode'] . "\n";
echo "Response: " . print_r($responseData, true) . "\n";

if ($apiResult['httpCode'] >= 200 && $apiResult['httpCode'] < 300) {
    echo "Package $packageName successfully " . ($packageExists ? "updated" : "submitted") . " to Packagist!\n";
    exit(0);
} else {
    echo "Failed to " . ($packageExists ? "update" : "submit") . " package $packageName to Packagist.\n";
    exit(1);
}

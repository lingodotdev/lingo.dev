<?php
/**
 * Packagist Publishing Script
 * 
 * This script handles publishing a package to Packagist using the Packagist API.
 * It requires the following environment variables:
 * - PACKAGIST_USERNAME: The Packagist username
 * - PACKAGIST_API_TOKEN: The Packagist API token
 * - PACKAGE_NAME: The name of the package to publish (e.g., vendor/package)
 * 
 * @php      7.4
 */

$username = getenv('PACKAGIST_USERNAME');
$apiToken = getenv('PACKAGIST_API_TOKEN');
$packageName = getenv('PACKAGE_NAME');

if (!$username || !$apiToken || !$packageName) {
    echo "Error: Missing required environment variables.\n";
    echo "Please ensure PACKAGIST_USERNAME, PACKAGIST_API_TOKEN, and PACKAGE_NAME are set.\n";
    exit(1);
}

echo "Starting Packagist publishing process for package: $packageName\n";

$apiUrl = "https://packagist.org/api/update-package?username=$username&apiToken=$apiToken";

$data = [
    'repository' => [
        'url' => "https://github.com/lingodotdev/lingo.dev"
    ]
];

$ch = curl_init($apiUrl);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);

echo "Sending request to Packagist API...\n";
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    echo "Error: " . curl_error($ch) . "\n";
    curl_close($ch);
    exit(1);
}

curl_close($ch);

$responseData = json_decode($response, true);

echo "HTTP Response Code: $httpCode\n";
echo "Response: " . print_r($responseData, true) . "\n";

if ($httpCode >= 200 && $httpCode < 300) {
    echo "Package $packageName successfully published to Packagist!\n";
    exit(0);
} else {
    echo "Failed to publish package $packageName to Packagist.\n";
    exit(1);
}

<?php
/**
 * PHP SDK for Lingo.dev
 *
 * @category Localization
 * @package  Lingodotdev\Sdk
 * @author   Lingo.dev Team <hi@lingo.dev>
 * @license  MIT https://opensource.org/licenses/MIT
 * @link     https://lingo.dev
 */

namespace Lingodotdev\Sdk;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Respect\Validation\Validator as v;

/**
 * LingoDotDevEngine class for interacting with the LingoDotDev API
 * A powerful localization engine that supports various content types including
 * plain text, objects, and chat sequences.
 *
 * @category Localization
 * @package  Lingodotdev\Sdk
 * @author   Lingo.dev Team <hi@lingo.dev>
 * @license  MIT https://opensource.org/licenses/MIT
 * @link     https://lingo.dev
 */
class LingoDotDevEngine
{
    /**
     * Configuration options for the Engine
     *
     * @var array
     */
    protected $config;

    /**
     * HTTP client for API requests
     *
     * @var Client
     */
    private $_httpClient;

    /**
     * Create a new LingoDotDevEngine instance
     * 
     * @param array $config Configuration options for the Engine
     */
    public function __construct(array $config = [])
    {
        $this->config = array_merge(
            [
            'apiUrl' => 'https://engine.lingo.dev',
            'batchSize' => 25,
            'idealBatchItemSize' => 250
            ], $config
        );

        if (!isset($this->config['apiKey'])) {
            throw new \InvalidArgumentException('API key is required');
        }

        if (!filter_var($this->config['apiUrl'], FILTER_VALIDATE_URL)) {
            throw new \InvalidArgumentException('API URL must be a valid URL');
        }

        if (!is_int($this->config['batchSize']) || $this->config['batchSize'] <= 0 || $this->config['batchSize'] > 250) {
            throw new \InvalidArgumentException('Batch size must be an integer between 1 and 250');
        }

        if (!is_int($this->config['idealBatchItemSize']) || $this->config['idealBatchItemSize'] <= 0 || $this->config['idealBatchItemSize'] > 2500) {
            throw new \InvalidArgumentException('Ideal batch item size must be an integer between 1 and 2500');
        }

        $this->_httpClient = new Client(
            [
            'base_uri' => $this->config['apiUrl'],
            'headers' => [
                'Content-Type' => 'application/json; charset=utf-8',
                'Authorization' => 'Bearer ' . $this->config['apiKey']
            ]
            ]
        );
    }

    /**
     * Localize content using the Lingo.dev API
     * 
     * @param array         $payload          The content to be localized
     * @param array         $params           Localization parameters including source/target locales and fast mode option
     * @param callable|null $progressCallback Optional callback function to report progress (0-100)
     * 
     * @return   array Localized content
     * @internal
     */
    protected function localizeRaw(array $payload, array $params, callable $progressCallback = null): array
    {
        if (!isset($params['targetLocale'])) {
            throw new \InvalidArgumentException('Target locale is required');
        }

        $chunkedPayload = $this->_extractPayloadChunks($payload);
        $processedPayloadChunks = [];

        $workflowId = $this->_createId();

        for ($i = 0; $i < count($chunkedPayload); $i++) {
            $chunk = $chunkedPayload[$i];
            $percentageCompleted = round((($i + 1) / count($chunkedPayload)) * 100);

            $processedPayloadChunk = $this->_localizeChunk(
                $params['sourceLocale'] ?? null,
                $params['targetLocale'],
                ['data' => $chunk, 'reference' => $params['reference'] ?? null],
                $workflowId,
                $params['fast'] ?? false
            );

            if ($progressCallback) {
                $progressCallback($percentageCompleted, $chunk, $processedPayloadChunk);
            }

            $processedPayloadChunks[] = $processedPayloadChunk;
        }

        return array_merge(...$processedPayloadChunks);
    }

    /**
     * Localize a single chunk of content
     * 
     * @param string|null $sourceLocale Source locale
     * @param string      $targetLocale Target locale
     * @param array       $payload      Payload containing the chunk to be localized
     * @param string      $workflowId   Workflow ID
     * @param bool        $fast         Whether to use fast mode
     * 
     * @return array Localized chunk
     */
    private function _localizeChunk(?string $sourceLocale, string $targetLocale, array $payload, string $workflowId, bool $fast): array
    {
        try {
            $response = $this->_httpClient->post(
                '/i18n', [
                'json' => [
                    'params' => [
                        'workflowId' => $workflowId,
                        'fast' => $fast
                    ],
                    'locale' => [
                        'source' => $sourceLocale,
                        'target' => $targetLocale
                    ],
                    'data' => $payload['data'],
                    'reference' => $payload['reference']
                ]
                ]
            );

            $jsonResponse = json_decode($response->getBody()->getContents(), true);

            if (!isset($jsonResponse['data']) && isset($jsonResponse['error'])) {
                throw new \RuntimeException($jsonResponse['error']);
            }

            return $jsonResponse['data'] ?? [];
        } catch (RequestException $e) {
            if ($e->getResponse() && $e->getResponse()->getStatusCode() === 400) {
                throw new \InvalidArgumentException('Invalid request: ' . $e->getMessage());
            }
            throw new \RuntimeException($e->getMessage());
        }
    }

    /**
     * Extract payload chunks based on the ideal chunk size
     * 
     * @param array $payload The payload to be chunked
     * 
     * @return array An array of payload chunks
     */
    private function _extractPayloadChunks(array $payload): array
    {
        $result = [];
        $currentChunk = [];
        $currentChunkItemCount = 0;

        $payloadEntries = $payload;
        $keys = array_keys($payloadEntries);
        
        for ($i = 0; $i < count($keys); $i++) {
            $key = $keys[$i];
            $value = $payloadEntries[$key];
            
            $currentChunk[$key] = $value;
            $currentChunkItemCount++;

            $currentChunkSize = $this->_countWordsInRecord($currentChunk);
            
            if ($currentChunkSize > $this->config['idealBatchItemSize'] 
                || $currentChunkItemCount >= $this->config['batchSize'] 
                || $i === count($keys) - 1
            ) {
                $result[] = $currentChunk;
                $currentChunk = [];
                $currentChunkItemCount = 0;
            }
        }

        return $result;
    }

    /**
     * Count words in a record or array
     * 
     * @param mixed $payload The payload to count words in
     * 
     * @return int The total number of words
     */
    private function _countWordsInRecord($payload): int
    {
        if (is_array($payload)) {
            $count = 0;
            foreach ($payload as $item) {
                $count += $this->_countWordsInRecord($item);
            }
            return $count;
        } elseif (is_object($payload)) {
            $count = 0;
            foreach ((array)$payload as $item) {
                $count += $this->_countWordsInRecord($item);
            }
            return $count;
        } elseif (is_string($payload)) {
            return count(array_filter(explode(' ', trim($payload))));
        } else {
            return 0;
        }
    }

    /**
     * Generate a unique ID
     * 
     * @return string Unique ID
     */
    private function _createId(): string
    {
        return bin2hex(random_bytes(8));
    }

    /**
     * Localize a typical PHP array or object
     * 
     * @param array         $obj              The object to be localized (strings will be extracted and translated)
     * @param array         $params           Localization parameters:
     *                                        - sourceLocale: The source language code (e.g., 'en')
     *                                        - targetLocale: The target language code (e.g., 'es')
     *                                        - fast: Optional boolean to enable fast mode
     * @param callable|null $progressCallback Optional callback function to report progress (0-100)
     * 
     * @return array A new object with the same structure but localized string values
     */
    public function localizeObject(array $obj, array $params, callable $progressCallback = null): array
    {
        return $this->localizeRaw($obj, $params, $progressCallback);
    }

    /**
     * Localize a single text string
     * 
     * @param string        $text             The text string to be localized
     * @param array         $params           Localization parameters:
     *                                        - sourceLocale: The source language code (e.g., 'en')
     *                                        - targetLocale: The target language code (e.g., 'es')
     *                                        - fast: Optional boolean to enable fast mode
     * @param callable|null $progressCallback Optional callback function to report progress (0-100)
     * 
     * @return string The localized text string
     */
    public function localizeText(string $text, array $params, callable $progressCallback = null): string
    {
        $response = $this->localizeRaw(['text' => $text], $params, $progressCallback);
        return $response['text'] ?? '';
    }

    /**
     * Localize a text string to multiple target locales
     * 
     * @param string $text   The text string to be localized
     * @param array  $params Localization parameters:
     *                       - sourceLocale: The source language code (e.g., 'en')
     *                       - targetLocales: An array of target language codes (e.g., ['es', 'fr'])
     *                       - fast: Optional boolean to enable fast mode
     * 
     * @return array An array of localized text strings
     */
    public function batchLocalizeText(string $text, array $params): array
    {
        if (!isset($params['sourceLocale'])) {
            throw new \InvalidArgumentException('Source locale is required');
        }

        if (!isset($params['targetLocales']) || !is_array($params['targetLocales'])) {
            throw new \InvalidArgumentException('Target locales must be an array');
        }

        $responses = [];
        foreach ($params['targetLocales'] as $targetLocale) {
            $responses[] = $this->localizeText(
                $text, [
                'sourceLocale' => $params['sourceLocale'],
                'targetLocale' => $targetLocale,
                'fast' => $params['fast'] ?? false
                ]
            );
        }

        return $responses;
    }

    /**
     * Localize a chat sequence while preserving speaker names
     * 
     * @param array         $chat             Array of chat messages, each with 'name' and 'text' properties
     * @param array         $params           Localization parameters:
     *                                        - sourceLocale: The source language code (e.g., 'en')
     *                                        - targetLocale: The target language code (e.g., 'es')
     *                                        - fast: Optional boolean to enable fast mode
     * @param callable|null $progressCallback Optional callback function to report progress (0-100)
     * 
     * @return array Array of localized chat messages with preserved structure
     */
    public function localizeChat(array $chat, array $params, callable $progressCallback = null): array
    {
        $payload = [];
        foreach ($chat as $index => $message) {
            if (!isset($message['name']) || !isset($message['text'])) {
                throw new \InvalidArgumentException('Each chat message must have name and text properties');
            }
            $payload["chat_{$index}"] = $message['text'];
        }

        $localized = $this->localizeRaw($payload, $params, $progressCallback);

        $result = [];
        foreach ($localized as $key => $value) {
            $index = (int)explode('_', $key)[1];
            $result[] = [
                'name' => $chat[$index]['name'],
                'text' => $value
            ];
        }

        return $result;
    }

    /**
     * Detect the language of a given text
     * 
     * @param string $text The text to analyze
     * 
     * @return string Locale code (e.g., 'en', 'es', 'fr')
     */
    public function recognizeLocale(string $text): string
    {
        try {
            $response = $this->_httpClient->post(
                '/recognize', [
                'json' => ['text' => $text]
                ]
            );

            $jsonResponse = json_decode($response->getBody()->getContents(), true);
            return $jsonResponse['locale'];
        } catch (RequestException $e) {
            throw new \RuntimeException('Error recognizing locale: ' . $e->getMessage());
        }
    }
}

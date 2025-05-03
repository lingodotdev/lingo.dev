<?php
/**
 * Tests for the LingoDotDevEngine class
 *
 * @category Tests
 * @package  Lingodotdev\Sdk\Tests
 * @author   Lingo.dev Team <hi@lingo.dev>
 * @license  MIT https://opensource.org/licenses/MIT
 * @link     https://lingo.dev
 */

namespace LingoDotDev\Sdk\Tests;

use GuzzleHttp\Client;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Psr7\Response;
use Lingodotdev\Sdk\LingoDotDevEngine;
use PHPUnit\Framework\TestCase;
use ReflectionClass;

/**
 * Test cases for the LingoDotDevEngine class
 *
 * @category Tests
 * @package  Lingodotdev\Sdk\Tests
 * @author   Lingo.dev Team <hi@lingo.dev>
 * @license  MIT https://opensource.org/licenses/MIT
 * @link     https://lingo.dev
 */
class LingoDotDevEngineTest extends TestCase
{
    /**
     * Creates a mock engine with predefined responses
     *
     * @param array $responses Array of mock responses
     *
     * @return LingoDotDevEngine Mocked engine instance
     */
    private function _createMockEngine($responses)
    {
        $mock = new MockHandler($responses);
        $handlerStack = HandlerStack::create($mock);
        $client = new Client(['handler' => $handlerStack]);

        $engine = new LingoDotDevEngine(['apiKey' => 'test-api-key']);
        
        $reflection = new ReflectionClass($engine);
        $property = $reflection->getProperty('_httpClient');
        $property->setAccessible(true);
        $property->setValue($engine, $client);
        
        return $engine;
    }

    /**
     * Tests constructor with valid configuration
     *
     * @return void
     */
    public function testConstructorWithValidConfig()
    {
        $engine = new LingoDotDevEngine(['apiKey' => 'test-api-key']);
        $this->assertInstanceOf(LingoDotDevEngine::class, $engine);
    }

    /**
     * Tests constructor with invalid configuration
     *
     * @return void
     */
    public function testConstructorWithInvalidConfig()
    {
        $this->expectException(\InvalidArgumentException::class);
        new LingoDotDevEngine([]);
    }

    /**
     * Tests the localizeText method
     *
     * @return void
     */
    public function testLocalizeText()
    {
        $engine = $this->_createMockEngine(
            [
            new Response(
                200, [], json_encode(
                    [
                    'data' => ['text' => 'Hola, mundo!']
                    ]
                )
            )
            ]
        );

        $result = $engine->localizeText(
            'Hello, world!', [
            'sourceLocale' => 'en',
            'targetLocale' => 'es'
            ]
        );

        $this->assertEquals('Hola, mundo!', $result);
    }

    /**
     * Tests the localizeObject method
     *
     * @return void
     */
    public function testLocalizeObject()
    {
        $engine = $this->_createMockEngine(
            [
            new Response(
                200, [], json_encode(
                    [
                    'data' => [
                    'greeting' => 'Hola',
                    'farewell' => 'Adiós'
                    ]
                    ]
                )
            )
            ]
        );

        $result = $engine->localizeObject(
            [
            'greeting' => 'Hello',
            'farewell' => 'Goodbye'
            ], [
            'sourceLocale' => 'en',
            'targetLocale' => 'es'
            ]
        );

        $this->assertEquals(
            [
            'greeting' => 'Hola',
            'farewell' => 'Adiós'
            ], $result
        );
    }

    /**
     * Tests the batchLocalizeText method
     *
     * @return void
     */
    public function testBatchLocalizeText()
    {
        $engine = $this->_createMockEngine(
            [
            new Response(
                200, [], json_encode(
                    [
                    'data' => ['text' => 'Hola, mundo!']
                    ]
                )
            ),
            new Response(
                200, [], json_encode(
                    [
                    'data' => ['text' => 'Bonjour, monde!']
                    ]
                )
            )
            ]
        );

        $result = $engine->batchLocalizeText(
            'Hello, world!', [
            'sourceLocale' => 'en',
            'targetLocales' => ['es', 'fr']
            ]
        );

        $this->assertEquals(['Hola, mundo!', 'Bonjour, monde!'], $result);
    }

    /**
     * Tests the localizeChat method
     *
     * @return void
     */
    public function testLocalizeChat()
    {
        $engine = $this->_createMockEngine(
            [
            new Response(
                200, [], json_encode(
                    [
                    'data' => [
                    'chat_0' => '¡Hola, cómo estás?',
                    'chat_1' => '¡Estoy bien, gracias!'
                    ]
                    ]
                )
            )
            ]
        );

        $chat = [
            ['name' => 'Alice', 'text' => 'Hello, how are you?'],
            ['name' => 'Bob', 'text' => 'I am fine, thank you!']
        ];

        $result = $engine->localizeChat(
            $chat, [
            'sourceLocale' => 'en',
            'targetLocale' => 'es'
            ]
        );

        $expected = [
            ['name' => 'Alice', 'text' => '¡Hola, cómo estás?'],
            ['name' => 'Bob', 'text' => '¡Estoy bien, gracias!']
        ];

        $this->assertEquals($expected, $result);
    }

    /**
     * Tests the recognizeLocale method
     *
     * @return void
     */
    public function testRecognizeLocale()
    {
        $engine = $this->_createMockEngine(
            [
            new Response(
                200, [], json_encode(
                    [
                    'locale' => 'fr'
                    ]
                )
            )
            ]
        );

        $result = $engine->recognizeLocale('Bonjour le monde');
        $this->assertEquals('fr', $result);
    }

    /**
     * Tests error handling in the SDK
     *
     * @return void
     */
    public function testErrorHandling()
    {
        $engine = $this->_createMockEngine(
            [
            new Response(
                400, [], json_encode(
                    [
                    'error' => 'Invalid request'
                    ]
                )
            )
            ]
        );

        $this->expectException(\InvalidArgumentException::class);
        $engine->localizeText(
            'Hello, world!', [
            'sourceLocale' => 'en',
            'targetLocale' => 'es'
            ]
        );
    }

    /**
     * Tests the progress callback functionality
     *
     * @return void
     */
    public function testProgressCallback()
    {
        $engine = $this->_createMockEngine(
            [
            new Response(
                200, [], json_encode(
                    [
                    'data' => ['text' => 'Hola, mundo!']
                    ]
                )
            )
            ]
        );

        $progressCalled = false;
        $progressValue = 0;

        $engine->localizeText(
            'Hello, world!', [
            'sourceLocale' => 'en',
            'targetLocale' => 'es'
            ], function ($progress) use (&$progressCalled, &$progressValue) {
                $progressCalled = true;
                $progressValue = $progress;
            }
        );

        $this->assertTrue($progressCalled);
        $this->assertEquals(100, $progressValue);
    }
}

<?php

namespace Lingodotdev\Sdk\Tests;

use GuzzleHttp\Client;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Psr7\Response;
use Lingodotdev\Sdk\LingoDotDevEngine;
use PHPUnit\Framework\TestCase;
use ReflectionClass;

class LingoDotDevEngineTest extends TestCase
{
    private function createMockEngine($responses)
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

    public function testConstructorWithValidConfig()
    {
        $engine = new LingoDotDevEngine(['apiKey' => 'test-api-key']);
        $this->assertInstanceOf(LingoDotDevEngine::class, $engine);
    }

    public function testConstructorWithInvalidConfig()
    {
        $this->expectException(\InvalidArgumentException::class);
        new LingoDotDevEngine([]);
    }

    public function testLocalizeText()
    {
        $engine = $this->createMockEngine(
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

    public function testLocalizeObject()
    {
        $engine = $this->createMockEngine(
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

    public function testBatchLocalizeText()
    {
        $engine = $this->createMockEngine(
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

    public function testLocalizeChat()
    {
        $engine = $this->createMockEngine(
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

    public function testRecognizeLocale()
    {
        $engine = $this->createMockEngine(
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

    public function testErrorHandling()
    {
        $engine = $this->createMockEngine(
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

    public function testProgressCallback()
    {
        $engine = $this->createMockEngine(
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

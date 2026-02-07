import { describe, it, expect, vi, beforeEach } from "vitest";
import { createBasicTranslator } from "./basic";
import { LanguageModel, generateText } from "ai";

// Mock the ai module
vi.mock("ai", async () => {
    const actual = await vi.importActual("ai");
    return {
        ...actual,
        generateText: vi.fn(),
    };
});

describe("createBasicTranslator", () => {
    const mockModel = {} as LanguageModel;
    const mockSystemPrompt = "Translate from {source} to {target}";

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should process all keys in a single batch by default", async () => {
        const input = {
            sourceLocale: "en",
            targetLocale: "fr",
            processableData: {
                key1: "value1",
                key2: "value2",
                key3: "value3",
            },
        };

        // Mock response
        (generateText as any).mockResolvedValue({
            text: JSON.stringify({
                data: {
                    key1: "valeur1",
                    key2: "valeur2",
                    key3: "valeur3",
                },
            }),
        });

        const onProgress = vi.fn();
        const translator = createBasicTranslator(mockModel, mockSystemPrompt);

        await translator(input, onProgress);

        expect(generateText).toHaveBeenCalledTimes(1);
        expect(generateText).toHaveBeenCalledWith(
            expect.objectContaining({
                messages: expect.arrayContaining([
                    expect.objectContaining({
                        role: "user",
                        content: expect.stringContaining("key1"),
                    }),
                ]),
            })
        );
    });

    it("should process >25 keys in a single batch by default (infinite batch size)", async () => {
        const inputData: Record<string, string> = {};
        for (let i = 0; i < 30; i++) {
            inputData[`key${i}`] = `value${i}`;
        }

        const input = {
            sourceLocale: "en",
            targetLocale: "fr",
            processableData: inputData,
        };

        (generateText as any).mockResolvedValue({
            text: JSON.stringify({ data: {} }),
        });

        const onProgress = vi.fn();
        const translator = createBasicTranslator(mockModel, mockSystemPrompt);

        await translator(input, onProgress);

        // Should be 1 call, not 2 (which would happen if default was 25)
        expect(generateText).toHaveBeenCalledTimes(1);
    });

    it("should respect batchSize parameter", async () => {
        const input = {
            sourceLocale: "en",
            targetLocale: "fr",
            processableData: {
                key1: "value1",
                key2: "value2",
                key3: "value3",
            },
        };

        // Mock response
        (generateText as any).mockResolvedValue({
            text: JSON.stringify({
                data: {},
            }),
        });

        const onProgress = vi.fn();
        // Set batchSize to 1 to force individual requests
        const translator = createBasicTranslator(mockModel, mockSystemPrompt, { batchSize: 1 });

        await translator(input, onProgress);

        expect(generateText).toHaveBeenCalledTimes(3);

        // allow calls to be in any order, but each should contain exactly one key
        const calls = (generateText as any).mock.calls;
        const keysProcessed = new Set();

        calls.forEach((call: any) => {
            const messages = call[0].messages;
            const userMessage = messages[messages.length - 1];
            const content = JSON.parse(userMessage.content);
            const keys = Object.keys(content.data);
            expect(keys.length).toBe(1);
            keysProcessed.add(keys[0]);
        });

        expect(keysProcessed.has("key1")).toBe(true);
        expect(keysProcessed.has("key2")).toBe(true);
        expect(keysProcessed.has("key3")).toBe(true);
    });

    it("should chunk requests correctly with batchSize > 1", async () => {
        const input = {
            sourceLocale: "en",
            targetLocale: "fr",
            processableData: {
                key1: "value1",
                key2: "value2",
                key3: "value3",
                key4: "value4",
                key5: "value5",
            },
        };

        (generateText as any).mockResolvedValue({
            text: JSON.stringify({ data: {} }),
        });

        const onProgress = vi.fn();
        const translator = createBasicTranslator(mockModel, mockSystemPrompt, { batchSize: 2 });

        await translator(input, onProgress);

        // 5 items with batchSize 2 -> 3 chunks (2, 2, 1)
        expect(generateText).toHaveBeenCalledTimes(3);
    });
});

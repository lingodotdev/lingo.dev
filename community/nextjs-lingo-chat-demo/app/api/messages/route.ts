import { lingoDotDev } from "@/lib/lingo";
import { NextResponse } from "next/server";

// Mock database of messages
// In-memory mock database
let messages = [
    { id: "1", text: "Hola, ¿cómo estás?", language: "es", name: "Alice" },
    { id: "2", text: "Je vais bien, merci!", language: "fr", name: "Bob" }
];

/**
 * Handles posting of new messages.
 * Detects the language of the message if not explicitly provided.
 *
 * @param {Request} request - The incoming request object containing the message payload.
 * @returns {Promise<NextResponse>} The created message object.
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { text, name, language: defaultLang } = body;

        // Validation
        if (!text || typeof text !== "string" || !text.trim()) {
            return NextResponse.json({ error: "Text is required and must be a non-empty string" }, { status: 400 });
        }

        const cleanText = text.trim();
        const cleanName = (typeof name === "string" && name.trim()) ? name.trim() : "User";
        const cleanDefaultLang = (typeof defaultLang === "string" && defaultLang.trim()) ? defaultLang.trim() : "en";

        let detectedLang = cleanDefaultLang;
        try {
            const result = await lingoDotDev.recognizeLocale(cleanText);
            if (result && typeof result === "string") {
                detectedLang = result;
            }
        } catch (e) {
            console.warn("Language detection failed:", e);
        }

        const newMessage = {
            id: Date.now().toString(),
            text: cleanText,
            name: cleanName,
            language: detectedLang
        };

        messages.push(newMessage);

        return NextResponse.json(newMessage);
    } catch (error) {
        return NextResponse.json({ error: "Failed to post message" }, { status: 500 });
    }
}

/**
 * Retrieves messages, translating them to the requested language.
 *
 * @param {Request} request - The incoming request object.
 * @returns {Promise<NextResponse>} A list of messages translated to the target language.
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const targetLang = searchParams.get("lang") || "en";

    try {
        const translatedMessages = await Promise.all(
            messages.map(async (msg) => {
                if (msg.language === targetLang) {
                    return msg;
                }

                const translation = await lingoDotDev.localizeText(msg.text, {
                    sourceLocale: msg.language,
                    targetLocale: targetLang,
                });

                return {
                    ...msg,
                    text: translation,
                    originalText: msg.text
                };
            })
        );

        return NextResponse.json(translatedMessages);
    } catch (error) {
        console.error("Caught translation error (Handled):", error);

        // Explicitly return 200 to ensure frontend receives valid JSON
        return NextResponse.json(
            messages.map(msg => ({
                ...msg,
                error: "Translation failed - check API key (Fallback Mode)"
            })),
            { status: 200 }
        );
    }
}

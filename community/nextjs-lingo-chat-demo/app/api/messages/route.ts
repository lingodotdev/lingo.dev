import { lingoDotDev } from "@/lib/lingo";
import { NextResponse } from "next/server";

// Mock database of messages
// In-memory mock database
let messages = [
    { id: "1", text: "Hola, ¿cómo estás?", language: "es", name: "Alice" },
    { id: "2", text: "Je vais bien, merci!", language: "fr", name: "Bob" }
];

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { text, name, language: defaultLang } = body;

        let detectedLang = defaultLang;
        try {
            const result = await lingoDotDev.recognizeLocale(text);
            if (result) {
                detectedLang = result;
            }
        } catch (e) {
            console.warn("Language detection failed:", e);
        }

        const newMessage = {
            id: Date.now().toString(),
            text,
            name: name || "User",
            language: detectedLang || "en"
        };

        messages.push(newMessage);

        return NextResponse.json(newMessage);
    } catch (error) {
        return NextResponse.json({ error: "Failed to post message" }, { status: 500 });
    }
}

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

import { NextRequest, NextResponse } from "next/server";
import { translate, detectLanguage, moderateContent, getProviderName } from "@/lib/llm-adapter";
import { getTMTranslation, setTMTranslation, recordLatency, incrementStats } from "@/lib/upstash";
import { z } from "zod";

const TranslateRequestSchema = z.object({
    text: z.string().min(1).max(10000),
    sourceLang: z.string().default("auto"),
    targetLang: z.string().min(2).max(5),
    skipCache: z.boolean().optional().default(false),
    skipModeration: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest) {
    const startTime = Date.now();
    try {
        const body = await request.json();
        const { text, sourceLang, targetLang, skipCache, skipModeration } = TranslateRequestSchema.parse(body);

        if (!skipCache) {
            try {
                const cached = await getTMTranslation(text, targetLang);
                if (cached) {
                    return NextResponse.json({
                        success: true,
                        translation: cached.translation,
                        source: "TM",
                        provider: cached.provider,
                        sourceLanguage: sourceLang,
                        targetLanguage: targetLang,
                        cached: true,
                        latencyMs: Date.now() - startTime,
                    });
                }
            } catch (e) { }
        }

        let detectedLang = sourceLang === "auto" ? await detectLanguage(text) : sourceLang;

        if (detectedLang === targetLang) {
            return NextResponse.json({
                success: true, translation: text, source: "SAME_LANG", provider: "none",
                sourceLanguage: detectedLang, targetLanguage: targetLang, cached: false, latencyMs: Date.now() - startTime
            });
        }

        const result = await translate(text, detectedLang, targetLang);

        let moderationResult = null;
        if (!skipModeration) {
            moderationResult = await moderateContent(result.translation);
            if (moderationResult.flagged) await incrementStats("flaggedMessages");
        }

        try {
            await setTMTranslation(text, targetLang, result.translation, result.provider);
            await recordLatency(result.latencyMs);
        } catch (e) { }

        return NextResponse.json({
            success: true,
            translation: result.translation,
            source: "LIVE",
            provider: result.provider,
            sourceLanguage: result.sourceLanguage,
            targetLanguage: result.targetLanguage,
            cached: false,
            latencyMs: Date.now() - startTime,
            moderation: moderationResult,
        });
    } catch (error) {
        console.error("Translation error:", error);
        return NextResponse.json({ success: false, error: "Translation failed" }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({
        provider: getProviderName(),
        available: true,
        supportedLanguages: ["en", "es", "fr", "de", "ja", "zh", "ko", "pt", "ar", "hi", "ru", "it"],
    });
}

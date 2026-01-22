export interface TranslationResult {
    translation: string;
    sourceLanguage: string;
    targetLanguage: string;
    provider: string;
    latencyMs: number;
}

export interface ModerationResult {
    flagged: boolean;
    reason?: string;
    categories?: string[];
    confidence: number;
}

const LANG_NAMES: Record<string, string> = {
    en: 'English', es: 'Spanish', fr: 'French', de: 'German',
    ja: 'Japanese', zh: 'Chinese', ko: 'Korean', pt: 'Portuguese',
    ar: 'Arabic', hi: 'Hindi', ru: 'Russian', it: 'Italian',
};

export async function translate(
    text: string,
    sourceLang: string = 'auto',
    targetLang: string
): Promise<TranslationResult> {
    const startTime = Date.now();
    const actualSource = sourceLang === 'auto' ? detectLanguageHeuristic(text) : sourceLang;

    if (actualSource === targetLang) {
        return { translation: text, sourceLanguage: actualSource, targetLanguage: targetLang, provider: 'none', latencyMs: 0 };
    }

    // Try Lingo.dev first (Primary)
    const lingoKey = process.env.LINGO_API_KEY;
    if (lingoKey) {
        try {
            const result = await lingoTranslate(text, actualSource, targetLang, lingoKey);
            if (result) return { ...result, latencyMs: Date.now() - startTime };
        } catch (error) {
            console.error('Lingo.dev translation failed:', error);
        }
    }

    // Fallback to Gemini
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
        try {
            const result = await geminiTranslate(text, actualSource, targetLang, geminiKey);
            if (result) return { ...result, latencyMs: Date.now() - startTime };
        } catch (error) {
            console.error('Gemini translation failed:', error);
        }
    }

    // Fallback Mock
    return {
        translation: `[${LANG_NAMES[targetLang] || targetLang}] ${text}`,
        sourceLanguage: actualSource,
        targetLanguage: targetLang,
        provider: 'fallback',
        latencyMs: Date.now() - startTime
    };
}

async function lingoTranslate(
    text: string,
    sourceLang: string,
    targetLang: string,
    apiKey: string
): Promise<TranslationResult | null> {
    console.log(`[Lingo.dev] Translating to ${targetLang}...`);

    try {
        const response = await fetch('https://engine.lingo.dev/i18n', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify({
                params: {
                    workflowId: crypto.randomUUID(),
                    fast: true
                },
                locale: {
                    source: sourceLang,
                    target: targetLang,
                },
                data: {
                    text: text,
                },
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[Lingo.dev] Error ${response.status}:`, errorText.substring(0, 300));
            throw new Error(`Lingo.dev API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        const translation = data.data?.text;

        if (!translation) {
            console.error('[Lingo.dev] No translation in response:', JSON.stringify(data));
            return null;
        }

        console.log(`[Lingo.dev] Success: "${translation.substring(0, 40)}..."`);

        return {
            translation,
            sourceLanguage: sourceLang,
            targetLanguage: targetLang,
            provider: 'lingo',
            latencyMs: 0,
        };
    } catch (err) {
        console.error('[Lingo.dev] Exception:', err);
        throw err;
    }
}

async function geminiTranslate(
    text: string,
    sourceLang: string,
    targetLang: string,
    apiKey: string
): Promise<TranslationResult | null> {
    const sourceLangName = LANG_NAMES[sourceLang] || sourceLang;
    const targetLangName = LANG_NAMES[targetLang] || targetLang;

    const prompt = `Translate from ${sourceLangName} to ${targetLangName}. Only output the translation:\n\n${text}`;

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.1, maxOutputTokens: 512 },
            }),
        }
    );

    if (!response.ok) return null;

    const data = await response.json();
    let translation = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!translation) return null;

    if ((translation.startsWith('"') && translation.endsWith('"')) || (translation.startsWith("'") && translation.endsWith("'"))) {
        translation = translation.slice(1, -1);
    }

    return { translation, sourceLanguage: sourceLang, targetLanguage: targetLang, provider: 'gemini', latencyMs: 0 };
}

function detectLanguageHeuristic(text: string): string {
    if (/[\u3040-\u30ff]/.test(text)) return 'ja';
    if (/[\u4e00-\u9fff]/.test(text) && !/[\u3040-\u30ff]/.test(text)) return 'zh';
    if (/[\uac00-\ud7af]/.test(text)) return 'ko';
    if (/[\u0600-\u06ff]/.test(text)) return 'ar';
    if (/[\u0900-\u097f]/.test(text)) return 'hi';
    if (/[\u0400-\u04ff]/.test(text)) return 'ru';
    if (/[¿¡ñáéíóú]/i.test(text)) return 'es';
    if (/[àâäéèêëïîôùûüÿç]/i.test(text)) return 'fr';
    if (/[äöüß]/i.test(text)) return 'de';
    return 'en';
}

export function getProviderName(): string {
    if (process.env.LINGO_API_KEY) return 'lingo';
    if (process.env.GEMINI_API_KEY) return 'gemini';
    return 'demo';
}

export async function detectLanguage(text: string): Promise<string> {
    return detectLanguageHeuristic(text);
}

export async function moderateContent(text: string): Promise<ModerationResult> {
    const spamPatterns = /\b(spam|buy now|click here|free money|winner)\b/gi;
    const flagged = spamPatterns.test(text);
    return { flagged, reason: flagged ? 'Potential spam detected' : undefined, categories: flagged ? ['spam'] : [], confidence: flagged ? 0.7 : 1.0 };
}

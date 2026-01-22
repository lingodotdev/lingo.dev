import { NextRequest, NextResponse } from 'next/server';
import { LingoDotDevEngine } from 'lingo.dev/sdk';

/**
 * SlangShift Translation API
 * 
 * This endpoint demonstrates why lingo.dev is superior to naive translation:
 * 
 * 1. CONTEXT-AWARE: We pass cultural context to guide the AI
 * 2. TONE ADAPTATION: Different tones produce meaningfully different outputs
 * 3. LOCALIZATION ≠ TRANSLATION: We adapt idioms, not just words
 * 4. COMPARISON MODE: Side-by-side literal vs localized shows the difference
 */

// Initialize lingo.dev engine
// In production, this API key should be in environment variables
const lingoDotDev = new LingoDotDevEngine({
    apiKey: process.env.LINGODOTDEV_API_KEY || '',
});

// Tone-specific context instructions
// These guide lingo.dev's AI to produce appropriate translations
const TONE_CONTEXTS: Record<string, string> = {
    literal: '', // No context for literal translation
    casual: `[Translation Context: Casual, relaxed everyday speech. 
    Keep the tone friendly and natural. 
    Adapt slang to local equivalents when possible, but keep it simple.]`,
    genz: `[Translation Context: Gen-Z internet culture. 
    Preserve internet slang vibes and abbreviations where the target language has equivalents. 
    Keep emojis. Use local youth slang. 
    If "bro", "bestie", "slay" etc have cultural equivalents, use them.
    The translation should feel like it was written by a young person who speaks both languages natively.]`,
    formal: `[Translation Context: Formal, professional register. 
    Convert all slang to proper language. 
    Remove or adapt casual abbreviations. 
    The result should be suitable for a business email or academic paper.
    Keep the meaning but elevate the register significantly.]`,
};

// Slang dictionary for explanation generation
const SLANG_MEANINGS: Record<string, string> = {
    'fr': '"for real" - emphasizing truthfulness',
    'ngl': '"not gonna lie" - being honest',
    'slaps': 'means something is excellent/amazing',
    'hits different': 'feels uniquely good or special',
    'no cap': 'no lie, being truthful',
    'lowkey': 'somewhat, secretly, or subtly',
    'highkey': 'very much, openly',
    'fire': 'excellent, amazing, hot',
    'slay': 'to do something exceptionally well',
    'ate': 'performed excellently (as in "ate and left no crumbs")',
    'periodt': 'period, end of discussion (emphatic)',
    'sus': 'suspicious',
    'vibe': 'feeling or atmosphere',
    'bestie': 'best friend',
    'bro': 'friend, buddy (gender neutral in slang)',
    'main character energy': 'confidence as if you\'re the protagonist',
    'giving': 'reminiscent of, looks like',
    'touch grass': 'go outside, take a break from the internet',
    '💀': 'dying of laughter, "I\'m dead"',
    '🔥': 'fire, hot, amazing',
    '✨': 'emphasis, sparkle, aesthetic',
    '💅': 'confidence, unbothered attitude',
};

interface TranslationRequest {
    text: string;
    targetLanguage: string;
    tone: string;
}

interface HighlightItem {
    original: string;
    literal: string;
    localized: string;
    reason: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: TranslationRequest = await request.json();
        const { text, targetLanguage, tone } = body;

        // Validate input
        if (!text || !targetLanguage || !tone) {
            return NextResponse.json(
                { error: 'Missing required fields: text, targetLanguage, tone' },
                { status: 400 }
            );
        }

        // Check for API key
        if (!process.env.LINGODOTDEV_API_KEY) {
            // Return mock response for demo purposes
            return NextResponse.json(getMockResponse(text, targetLanguage, tone));
        }

        /**
         * LITERAL TRANSLATION
         * This is what basic translation APIs would give you.
         * No context, no cultural adaptation.
         */
        const literalTranslation = await lingoDotDev.localizeText(text, {
            sourceLocale: 'en',
            targetLocale: targetLanguage,
        });

        /**
         * LOCALIZED TRANSLATION (The lingo.dev difference!)
         * 
         * We prepend context that tells the AI about:
         * - The desired tone/register
         * - Cultural adaptation expectations
         * - How to handle slang
         * 
         * This is why lingo.dev beats naive translation:
         * It's not just translating words, it's adapting culture.
         */
        const context = TONE_CONTEXTS[tone] || '';
        const contextualText = context ? `${context}\n\n${text}` : text;

        let localizedTranslation: string;

        if (tone === 'literal') {
            // For literal tone, we don't add context
            localizedTranslation = literalTranslation;
        } else {
            localizedTranslation = await lingoDotDev.localizeText(contextualText, {
                sourceLocale: 'en',
                targetLocale: targetLanguage,
            });

            // Clean up any context leakage in response
            localizedTranslation = localizedTranslation
                .replace(/\[Translation Context:.*?\]/gs, '')
                .trim();
        }

        // Generate highlights for words that changed significantly
        const highlights = generateHighlights(text, literalTranslation, localizedTranslation, tone);

        // Generate explanation
        const explanation = generateExplanation(text, tone, targetLanguage);

        return NextResponse.json({
            literal: literalTranslation,
            localized: localizedTranslation,
            highlights,
            explanation,
        });
    } catch (error) {
        console.error('Translation error:', error);
        return NextResponse.json(
            { error: 'Translation failed. Please try again.' },
            { status: 500 }
        );
    }
}

/**
 * Generate highlights for words that were culturally adapted
 */
function generateHighlights(
    original: string,
    literal: string,
    localized: string,
    tone: string
): HighlightItem[] {
    const highlights: HighlightItem[] = [];

    // Find slang terms in the original text
    const words = original.toLowerCase().split(/\s+/);

    for (const word of words) {
        const cleanWord = word.replace(/[.,!?]/g, '');
        if (SLANG_MEANINGS[cleanWord] && tone !== 'literal') {
            highlights.push({
                original: cleanWord,
                literal: `[word-for-word]`,
                localized: `[culturally adapted]`,
                reason: SLANG_MEANINGS[cleanWord],
            });
        }
    }

    // Check for emoji meanings
    const emojis = original.match(/[\u{1F300}-\u{1F9FF}]/gu) || [];
    for (const emoji of emojis) {
        if (SLANG_MEANINGS[emoji]) {
            highlights.push({
                original: emoji,
                literal: emoji,
                localized: emoji,
                reason: SLANG_MEANINGS[emoji],
            });
        }
    }

    return highlights.slice(0, 5); // Limit to 5 highlights
}

/**
 * Generate human-readable explanation of translation decisions
 */
function generateExplanation(text: string, tone: string, targetLanguage: string): string {
    const langNames: Record<string, string> = {
        es: 'Spanish',
        fr: 'French',
        de: 'German',
        ja: 'Japanese',
        pt: 'Portuguese',
        ko: 'Korean',
        it: 'Italian',
        zh: 'Chinese',
    };

    const toneDescriptions: Record<string, string> = {
        literal: 'a word-for-word translation preserving the original structure',
        casual: 'natural everyday speech, adapting slang to local equivalents',
        genz: 'internet culture vibes, using local youth slang and preserving the energy',
        formal: 'professional register, converting all casual expressions to proper language',
    };

    const foundSlang = Object.keys(SLANG_MEANINGS).filter(term =>
        text.toLowerCase().includes(term.toLowerCase())
    );

    let explanation = `Translated to ${langNames[targetLanguage] || targetLanguage} using ${toneDescriptions[tone] || 'adaptive translation'}.`;

    if (foundSlang.length > 0 && tone !== 'literal') {
        explanation += ` Detected slang terms (${foundSlang.slice(0, 3).join(', ')}) and adapted them for cultural relevance.`;
    }

    if (tone === 'genz') {
        explanation += ' Preserved internet culture markers while finding local equivalents.';
    } else if (tone === 'formal') {
        explanation += ' Elevated the register to be suitable for professional contexts.';
    }

    return explanation;
}

/**
 * Mock response for demo when API key is not configured
 */
function getMockResponse(text: string, targetLanguage: string, tone: string) {
    const mockTranslations: Record<string, Record<string, { literal: string; localized: string }>> = {
        es: {
            default: {
                literal: 'hermano de verdad esta aplicación golpea 💀',
                localized: 'bro en serio esta app está increíble 💀',
            }
        },
        fr: {
            default: {
                literal: 'frère vraiment cette application frappe 💀',
                localized: 'mec franchement cette app déchire 💀',
            }
        },
        de: {
            default: {
                literal: 'Bruder wirklich diese App schlägt 💀',
                localized: 'Alter ehrlich diese App ist mega 💀',
            }
        },
        ja: {
            default: {
                literal: '兄弟本当にこのアプリは叩く 💀',
                localized: 'マジでこのアプリやばい 💀',
            }
        },
        pt: {
            default: {
                literal: 'mano de verdade esse app bate 💀',
                localized: 'mano sério esse app é sinistro 💀',
            }
        },
        ko: {
            default: {
                literal: '형제 진짜 이 앱이 때린다 💀',
                localized: '진짜 이 앱 대박이야 💀',
            }
        },
        it: {
            default: {
                literal: 'fratello davvero questa app colpisce 💀',
                localized: 'fra sul serio questa app spacca 💀',
            }
        },
        zh: {
            default: {
                literal: '兄弟真的这个应用程序打 💀',
                localized: '哥们这app真的绝了 💀',
            }
        },
    };

    const langData = mockTranslations[targetLanguage] || mockTranslations.es;
    const translation = langData.default;

    // Adjust based on tone
    let localizedResult = translation.localized;
    if (tone === 'literal') {
        localizedResult = translation.literal;
    } else if (tone === 'formal') {
        localizedResult = translation.literal.replace(/💀/g, '').trim() + ' [formalized]';
    }

    const highlights = generateHighlights(text, translation.literal, localizedResult, tone);
    const explanation = generateExplanation(text, tone, targetLanguage);

    return {
        literal: translation.literal,
        localized: localizedResult,
        highlights,
        explanation: explanation + ' (Demo mode - configure LINGODOTDEV_API_KEY for live translations)',
    };
}

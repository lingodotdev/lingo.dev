import { NextRequest, NextResponse } from "next/server";
import { lingoDotDev } from "@/lib/lingo-dev/client";
import { emojiToStory } from "@/lib/cloudflare-ai-client";
import { getCloudflareContext } from "@opennextjs/cloudflare";

interface TranslateRequest {
    emojis: string | string[];  // Can be "🌟🦁🏔️" or ["🌟", "🦁", "🏔️"]
    tone?: 'comedy' | 'drama' | 'epic' | 'horror' | 'romance';
    length?: 'short' | 'medium' | 'epic';
    locale: string | string[];
}

// Helper function to extract emojis from a string
function extractEmojis(text: string): string[] {
    const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;
    return text.match(emojiRegex) || [];
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log('Request body:', body);
        const { emojis: emojiInput, tone, length, locale } = body as TranslateRequest;

        // Extract emojis from string or use array directly
        const emojis = typeof emojiInput === 'string'
            ? extractEmojis(emojiInput)
            : emojiInput;

        // Validate input
        if (!emojis || !Array.isArray(emojis) || emojis.length === 0) {
            return NextResponse.json(
                { error: 'No emojis found in input' },
                { status: 400 }
            );
        }

        if (!locale) {
            return NextResponse.json(
                { error: 'Missing required field: locale' },
                { status: 400 }
            );
        }

        // Step 1: Generate English story from emojis using Cloudflare AI
        let story: string;
        try {
            console.log('Generating story from emojis using Cloudflare AI...');

            // Get Cloudflare AI binding
            const { env } = await getCloudflareContext();
            const ai = env.AI;

            story = await emojiToStory(
                ai,
                emojis,
                tone || 'comedy',
                length || 'short'
            );
            console.log('Generated story:', story);
        } catch (error) {
            console.error('Cloudflare AI story generation error:', error);
            return NextResponse.json(
                {
                    error: 'Failed to generate story from emojis',
                    details: error instanceof Error ? error.message : 'Unknown error'
                },
                { status: 500 }
            );
        }

        // Step 2: Translate story to requested languages using Lingo.dev
        if (Array.isArray(locale)) {
            try {
                const translationPromises = locale.map((loc) =>
                    lingoDotDev.localizeText(story, {
                        sourceLocale: 'en',
                        targetLocale: loc,
                    }).then(translated => ({ locale: loc, translated }))
                );

                const response = await Promise.allSettled(translationPromises);

                const translated = response
                    .filter((result): result is PromiseFulfilledResult<{ locale: string; translated: string }> => result.status === 'fulfilled')
                    .reduce((acc, result) => {
                        acc[result.value.locale] = result.value.translated;
                        return acc;
                    }, {} as Record<string, string>);

                // Check if any translations succeeded
                if (Object.keys(translated).length === 0) {
                    return NextResponse.json(
                        { error: 'All translations failed' },
                        { status: 500 }
                    );
                }

                return NextResponse.json({
                    story,  // Original English story from Cloudflare AI
                    translated  // Translations from Lingo.dev
                });
            } catch (error) {
                console.error('Batch translation error:', error);
                return NextResponse.json(
                    { error: 'Failed to translate to multiple languages', details: error instanceof Error ? error.message : 'Unknown error' },
                    { status: 500 }
                );
            }
        }

        // Single language translation
        try {
            const translated = await lingoDotDev.localizeText(story, {
                sourceLocale: 'en',
                targetLocale: locale,
            });

            return NextResponse.json({
                story,  // Original English story from Cloudflare AI
                translated  // Single translation from Lingo.dev
            });
        } catch (error) {
            console.error('Single translation error:', error);
            return NextResponse.json(
                { error: 'Translation failed', details: error instanceof Error ? error.message : 'Unknown error' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Request parsing error:', error);
        return NextResponse.json(
            { error: 'Invalid request body', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 400 }
        );
    }
}
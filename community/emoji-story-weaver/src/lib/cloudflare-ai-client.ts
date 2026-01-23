export async function emojiToStory(
    ai: Ai,
    emojis: string[],
    tone: 'comedy' | 'drama' | 'epic' | 'horror' | 'romance' = 'comedy',
    length: 'short' | 'medium' | 'epic' = 'short'
): Promise<string> {
    const lengthGuide = {
        short: 'Strictly 1 single sentence. Very concise.',
        medium: '2-3 short sentences.',
        epic: '4-5 sentences.'
    };

    const prompt = `Create a ${tone} story using these emojis: ${emojis.join(' ')}

Requirements:
- Length: ${lengthGuide[length]}
- Tone: ${tone} (but make it funny and meme-worthy)
- Include the actual emojis in the story naturally
- STYLE: Use internet slang, Gen Z humor, brainrot, and meme references where appropriate.
- Make it sound like a viral tweet or shitpost.
- Use lowercase if it fits the vibe.
- Keep the emojis in their original order when possible.

Return ONLY the story text, no explanations or additional commentary.`;

    try {
        console.log('=== Generating story with Cloudflare AI (UPDATED CODE) ===');
        console.log('Emojis:', emojis);
        console.log('Tone:', tone);
        console.log('Length:', length);

        const response = await ai.run(
            "@cf/openai/gpt-oss-120b",
            {
                role: 'user',
                input: prompt,
                temperature: 0.7,
                max_tokens: 500,
                reasoning: {
                    effort: "low",
                    summary: "auto"
                }
            }
        ) as any;

        // Debug: Log the full response structure
        console.log('Cloudflare AI Response:', JSON.stringify(response, null, 2));

        // Extract the text from the response - try multiple paths
        let story = '';

        // Try different response structures
        if (response?.output?.[1]?.content?.[0]?.text) {
            story = response.output[1].content[0].text;
        } else if (response?.output?.[0]?.content?.[0]?.text) {
            story = response.output[0].content[0].text;
        } else if (response?.text) {
            story = response.text;
        } else if (response?.response) {
            story = response.response;
        } else if (typeof response === 'string') {
            story = response;
        }

        if (!story || story.trim() === '') {
            console.error('Failed to extract story from response. Response structure:', response);
            throw new Error('No story generated from Cloudflare AI');
        }

        console.log('Successfully generated story with Cloudflare AI:', story);
        return story.trim();
    } catch (error) {
        console.error('Cloudflare AI story generation error:', error);
        throw new Error(`Failed to generate story with Cloudflare AI: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

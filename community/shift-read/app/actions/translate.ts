'use server'

import { LingoDotDevEngine } from 'lingo.dev/sdk'

export async function translateMarkdown(
  markdown: string,
  sourceLanguage: string | null,
  targetLanguage: string
): Promise<{ success: boolean; data?: string; error?: string }> {
  try {
    const apiKey = process.env.LINGODOTDEV_API_KEY
    if (!apiKey) {
      return { success: false, error: 'Lingo.dev API key is not configured' }
    }

    const lingoDotDev = new LingoDotDevEngine({ apiKey })

    const translated = await lingoDotDev.localizeText(markdown, {
      sourceLocale: sourceLanguage ?? null,
      targetLocale: targetLanguage
    })

    return {
      success: true,
      data: translated as string
    }
  } catch (error) {
    console.error('Translation error:', error)
    return {
      success: false,
      error: 'Failed to translate content'
    }
  }
}

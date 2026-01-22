import { NextRequest, NextResponse } from 'next/server';
import { LingoDotDevEngine } from '@lingo.dev/_sdk';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const sourceLocale = formData.get('sourceLocale') as string;
    const targetLocales = JSON.parse(formData.get('targetLocales') as string);

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const apiKey = process.env.LINGO_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured. Please add LINGO_API_KEY to .env.local' },
        { status: 500 }
      );
    }

    const content = await file.text();
    const sourceData = JSON.parse(content);

    // Initialize Lingo.dev Engine
    const engine = new LingoDotDevEngine({
      apiKey,
    });

    // Translate to all target locales
    const translations: Record<string, any> = {};
    
    for (const targetLocale of targetLocales) {
      try {
        const translated = await engine.localizeObject(sourceData, {
          sourceLocale,
          targetLocale,
          fast: false, // Set to true for faster translations
        });
        translations[targetLocale] = translated;
      } catch (error) {
        console.error(`Translation failed for ${targetLocale}:`, error);
        translations[targetLocale] = {
          error: `Failed to translate to ${targetLocale}`,
        };
      }
    }

    return NextResponse.json({ translations });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Translation failed' },
      { status: 500 }
    );
  }
}

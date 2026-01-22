// app/api/translate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { LingoDotDevEngine } from 'lingo.dev/sdk';

const engine = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Received body:', body);

    const { content, sourceLocale = 'en', targetLocale } = body;

    if (!content) {
      console.log('Missing content');
      return NextResponse.json({ error: 'Missing content' }, { status: 400 });
    }
    if (!targetLocale) {
      console.log('Missing targetLocale');
      return NextResponse.json({ error: 'Missing targetLocale' }, { status: 400 });
    }

    let translated;
    if (typeof content === 'string') {
      console.log('Translating text:', content);
      translated = await engine.localizeText(content, { sourceLocale, targetLocale });
    } else {
      console.log('Translating object:', content);
      translated = await engine.localizeObject(content, { sourceLocale, targetLocale });
    }

    return NextResponse.json({ translated });
  } catch (err) {
    console.error('SDK/Translation error:', err);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { LingoDotDevEngine } from '@lingo.dev/_sdk';

// Fallback dictionary for demo purposes when SDK fails
const FALLBACKS: Record<string, Record<string, string>> = {
  'en-es': {
    'Hello, I have a problem with my order.': 'Hola, tengo un problema con mi pedido.',
    'How can I help you today?': '¿Cómo puedo ayudarte hoy?',
  },
  'es-en': {
    'Hola, tengo un problema con mi pedido.': 'Hello, I have a problem with my order.',
    'Gracias por la ayuda.': 'Thanks for the help.',
    'Entendido.': 'Understood.',
    '¿Puede explicar eso de nuevo?': 'Can you explain that again?',
    'Esperaré su respuesta.': 'I will wait for your response.',
  },
  'de-en': {
    'Funktioniert dieses Produkt auf dem Mac?': 'Does this product work on Mac?',
    'Danke für die Hilfe.': 'Thanks for the help.',
    'Können Sie das wiederholen?': 'Can you repeat that?',
    'Verstanden.': 'Understood.',
    'Ich werde warten.': 'I will wait.',
  },
  'ja-en': {
    'ありがとうございます。': 'Thank you.',
    'もう一度説明していただけますか？': 'Could you explain that again?',
    '分かりました。': 'I understand.',
    'お待ちしております。': 'I will be waiting.',
  },
  'fr-en': {
    'Merci pour l\'aide.': 'Thanks for the help.',
    'Pouvez-vous répéter ?': 'Can you repeat that?',
    'Compris.': 'Understood.',
    'J\'attendrai.': 'I will wait.',
  },
};

export async function POST(request: Request) {
  const { text, sourceLocale, targetLocale } = await request.json();

  const apiKey = process.env.LINGO_API_KEY;

  // Try SDK translation first
  if (apiKey) {
    try {
      const engine = new LingoDotDevEngine({ apiKey });
      const translatedText = await engine.localizeText(text, {
        sourceLocale,
        targetLocale,
      });
      return NextResponse.json({ translatedText });
    } catch (error) {
      console.error('Lingo SDK Error:', error);
      // Fall through to fallback
    }
  }

  // Fallback Logic (used if no API key OR if SDK execution failed)
  const key = `${sourceLocale}-${targetLocale}`;
  const exactMatch = FALLBACKS[key]?.[text];
  
  if (exactMatch) {
    return NextResponse.json({ translatedText: exactMatch });
  }

  // Pseudo-translation fallback if no match
  return NextResponse.json({ 
    translatedText: `[${targetLocale.toUpperCase()}] ${text}` 
  });
}

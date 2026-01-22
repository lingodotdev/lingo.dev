import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    interface TransmitRequest {
      text: string;
      targets: string[];
    }
    const { text, targets } = (await req.json()) as TransmitRequest;

    // SIMULATION MODE: The Lingo.dev SDK is removed to ensure compatibility.
    // This is a "Mock" transmission for the demo UI.
    const mockResults: Record<string, string> = {};
    const dictionaries: Record<string, string[]> = {
         'es': ['Sistema', 'Galaxia', 'Hola', 'Orbita'],
         'fr': ['Système', 'Galaxie', 'Bonjour', 'Orbite'],
         'de': ['System', 'Galaxie', 'Hallo', 'Umlaufbahn'],
         'ja': ['システム', '銀河', 'こんにちは', '軌道'],
    };

    for (const target of targets) {
          const prefix = target === 'ja' ? '⚡ ' : target === 'de' ? '🔧 ' : '📡 ';
          // Simple mock "hashing" to fake translation
          const words = text.split(' ');
          const fakeTranslated = words.map(w => {
              if (w.length > 3 && dictionaries[target]) {
                  return dictionaries[target]?.[Math.floor(Math.random() * dictionaries[target].length)] || w;
              }
              return w;
          }).join(' ');

          mockResults[target] = `${prefix} [SIMULATION]: ${fakeTranslated}`;
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return NextResponse.json({ results: mockResults });

  } catch (error) {
    console.error("Translation API Error:", error);
    return NextResponse.json({ error: "Transmission failed" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";

/**
 * NOTE:
 * Lingo.dev primarily works via CLI / build-time tools.
 * This API route demonstrates how a translation service
 * would be abstracted in a real app.
 */

export async function POST(req: Request) {
  try {
    const { text, targetLang } = await req.json();

    // 🔥 Demo translation logic (replace with real integration)
    const mockTranslations: Record<string, Record<string, string>> = {
      hi: {
        "Welcome to Lingo.dev Starter": "Lingo.dev Starter में आपका स्वागत है",
      },
      fr: {
        "Welcome to Lingo.dev Starter":
          "Bienvenue dans le starter Lingo.dev",
      },
    };

    const translatedText =
      mockTranslations[targetLang]?.[text] || text;

    return NextResponse.json({ translatedText });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

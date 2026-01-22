import { NextRequest, NextResponse } from "next/server";
import { LingoDotDevEngine } from "lingo.dev/sdk";

// Tone-based context prefixes to guide the AI
const TONE_CONTEXTS: Record<string, string> = {
  default: "",
  formal: "Translate in a formal, professional tone suitable for business communication. ",
  casual: "Translate in a casual, friendly tone suitable for everyday conversation. ",
  technical: "Translate in a precise, technical tone suitable for documentation. Preserve technical terms. ",
  creative: "Translate in an expressive, creative tone that captures the artistic intent. ",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      apiKey, 
      text, 
      sourceLocale, 
      targetLocale, 
      action,
      context,
      hints,
      tone 
    } = body;

    if (!apiKey) {
      return NextResponse.json({ error: "API key is required" }, { status: 400 });
    }

    const engine = new LingoDotDevEngine({ apiKey });

    if (action === "detect") {
      const locale = await engine.recognizeLocale(text);
      return NextResponse.json({ locale });
    }

    if (action === "translate") {
      // Build enhanced text with context if provided
      let enhancedText = text;
      const toneContext = TONE_CONTEXTS[tone] || "";
      const userContext = context ? `Context: ${context}. ` : "";
      const hintsContext = hints && hints.length > 0 
        ? `Important: Preserve these terms as-is or translate appropriately: ${hints.join(", ")}. ` 
        : "";
      
      // If we have any context, we could use it with the hints feature
      // For now, we'll include it in a way that helps the AI
      const fullContext = toneContext + userContext + hintsContext;
      
      const result = await engine.localizeText(text, {
        sourceLocale: sourceLocale || null,
        targetLocale,
        // The SDK supports hints - we can use them if available
        ...(fullContext && {
          hints: {
            _context: [fullContext.trim()],
            ...(hints && hints.reduce((acc: Record<string, string[]>, hint: string) => {
              acc[hint] = [hint]; // Preserve these terms
              return acc;
            }, {})),
          },
        }),
      });
      
      return NextResponse.json({ text: result });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Translation failed" },
      { status: 500 }
    );
  }
}

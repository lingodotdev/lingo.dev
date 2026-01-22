/**
 * Translation API Route
 *
 * This endpoint receives English landing page content and returns
 * translations for all supported locales using Lingo.dev SDK.
 *
 * POST /api/translate
 * Body: { content: LandingPageContent }
 * Response: { translations: TranslatedContent }
 */

import { NextRequest, NextResponse } from "next/server";
import { translateAllLocales } from "@/lib/lingo";
import type { LandingPageContent, TranslationResponse } from "@/lib/types";

/**
 * Validate that the request body contains valid landing page content
 */
function validateContent(content: unknown): content is LandingPageContent {
  if (!content || typeof content !== "object") {
    return false;
  }

  const c = content as Record<string, unknown>;

  // Check required string fields
  if (
    typeof c.productName !== "string" ||
    typeof c.headline !== "string" ||
    typeof c.subheadline !== "string" ||
    typeof c.ctaText !== "string"
  ) {
    return false;
  }

  // Check features array
  if (!Array.isArray(c.features) || c.features.length !== 3) {
    return false;
  }

  // Validate each feature
  for (const feature of c.features) {
    if (
      !feature ||
      typeof feature !== "object" ||
      typeof (feature as Record<string, unknown>).title !== "string" ||
      typeof (feature as Record<string, unknown>).description !== "string"
    ) {
      return false;
    }
  }

  return true;
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<TranslationResponse>> {
  try {
    const body = await request.json();
    const { content } = body;

    // Validate request body
    if (!validateContent(content)) {
      return NextResponse.json(
        {
          translations: {} as TranslationResponse["translations"],
          error: "Invalid content format. Please provide all required fields.",
        },
        { status: 400 },
      );
    }

    // Check for empty required fields
    if (
      !content.productName.trim() ||
      !content.headline.trim() ||
      !content.ctaText.trim()
    ) {
      return NextResponse.json(
        {
          translations: {} as TranslationResponse["translations"],
          error: "Product name, headline, and CTA text are required.",
        },
        { status: 400 },
      );
    }

    // Translate content to all locales using Lingo.dev
    const translations = await translateAllLocales(content);

    return NextResponse.json({ translations });
  } catch (error) {
    console.error("Translation API error:", error);

    // Return appropriate error message
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred during translation.";

    return NextResponse.json(
      {
        translations: {} as TranslationResponse["translations"],
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}

/**
 * API Route: /api/analyze
 * Analyzes medical reports and translates them to the target language
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { analyzeMedicalReport } from "@/lib/gemini";
import { translateAnalysis } from "@/lib/lingo";
import type { AnalyzeResponse } from "@/lib/types";

// Request validation schema
const AnalyzeRequestSchema = z.object({
  reportText: z
    .string()
    .min(10, "Report text must be at least 10 characters")
    .max(50000, "Report text must be less than 50,000 characters"),
  targetLanguage: z.string().min(2).max(10).default("en"),
});

export async function POST(request: NextRequest): Promise<NextResponse<AnalyzeResponse>> {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedInput = AnalyzeRequestSchema.parse(body);

    const { reportText, targetLanguage } = validatedInput;

    // Step 1: Analyze the medical report using Gemini
    console.log("Analyzing medical report...");
    const analysis = await analyzeMedicalReport(reportText);

    // Step 2: Translate if target language is not English
    let finalAnalysis = analysis;
    if (targetLanguage !== "en") {
      console.log(`Translating to ${targetLanguage}...`);
      finalAnalysis = await translateAnalysis(analysis, targetLanguage);
    }

    // Return successful response
    return NextResponse.json({
      success: true,
      data: finalAnalysis,
      originalLanguage: "en",
      translatedLanguage: targetLanguage,
    });
  } catch (error) {
    console.error("Analysis error:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: `Validation error: ${error.issues.map((i) => i.message).join(", ")}`,
          originalLanguage: "en",
          translatedLanguage: "en",
        },
        { status: 400 }
      );
    }

    // Handle other errors
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        originalLanguage: "en",
        translatedLanguage: "en",
      },
      { status: 500 }
    );
  }
}

// Only allow POST requests
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { error: "Method not allowed. Use POST." },
    { status: 405 }
  );
}

/**
 * Google Gemini API integration for medical report analysis
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import {
  MEDICAL_ANALYSIS_SYSTEM_PROMPT,
  MEDICAL_ANALYSIS_USER_PROMPT,
} from "./prompts";
import type { MedicalReportAnalysis } from "./types";

// Zod schema for validating LLM response
const MedicalReportAnalysisSchema = z.object({
  overview: z.string(),
  key_findings: z.array(z.string()),
  what_it_means: z.array(z.string()),
  medical_terms_explained: z.record(z.string(), z.string()),
  when_to_be_careful: z.array(z.string()),
  next_steps_general: z.array(z.string()),
  disclaimer: z.string(),
});

/**
 * Analyzes a medical report using Google Gemini API
 * @param reportText - The raw text of the medical report
 * @returns Structured analysis of the medical report
 */
export async function analyzeMedicalReport(
  reportText: string
): Promise<MedicalReportAnalysis> {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GOOGLE_GEMINI_API_KEY is not set. Please add it to your .env.local file."
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.3, // Lower temperature for more consistent output
      topP: 0.8,
      maxOutputTokens: 4096,
    },
  });

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: MEDICAL_ANALYSIS_SYSTEM_PROMPT },
            { text: MEDICAL_ANALYSIS_USER_PROMPT(reportText) },
          ],
        },
      ],
    });

    const response = result.response;
    const text = response.text();

    // Clean up the response - remove markdown code blocks if present
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.slice(7);
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.slice(3);
    }
    if (cleanedText.endsWith("```")) {
      cleanedText = cleanedText.slice(0, -3);
    }
    cleanedText = cleanedText.trim();

    // Parse and validate JSON
    const parsed = JSON.parse(cleanedText);
    const validated = MedicalReportAnalysisSchema.parse(parsed);

    return validated;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.issues);
      throw new Error(
        "The AI response did not match the expected format. Please try again."
      );
    }
    if (error instanceof SyntaxError) {
      console.error("JSON parse error:", error);
      throw new Error(
        "Failed to parse AI response as JSON. Please try again."
      );
    }
    throw error;
  }
}

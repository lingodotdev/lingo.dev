import { NextRequest, NextResponse } from "next/server";
import { parseJson } from "@/app/lib/analyzer/parseJson";
import { findMissingKeys1 } from "@/app/lib/analyzer/findMissingKeys";
import { findMissingKeys2 } from "@/app/lib/analyzer/findUnusedKeys";
import { detectHardcodedStrings } from "@/app/lib/analyzer/detectHardcodedStrings";
import { buildSemanticPairs } from "@/app/lib/analyzer/semanticPairs";

import { suggestTranslation , checkSemanticConsistency } from "@/app/lib/analyzer/lingo/lingoClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, sourceJson, targetJson } = body;

    if (!code || !sourceJson || !targetJson) {
      return NextResponse.json(
        { error: "Code, source JSON, and target JSON are required." },
        { status: 400 }
      );
    }

    const parsedSource = parseJson(sourceJson);
    const parsedTarget = parseJson(targetJson);

    if (parsedSource.error) {
      return NextResponse.json(
        { error: parsedSource.error },
        { status: 400 }
      );
    }

    if (parsedTarget.error) {
      return NextResponse.json(
        { error: parsedTarget.error },
        { status: 400 }
      );
    }

    const sourceTranslations = parsedSource.data!;
    const targetTranslations = parsedTarget.data!;

    const missingKeys = findMissingKeys1(
      sourceTranslations,
      targetTranslations
    );

    const unusedKeys = findMissingKeys2(
      sourceTranslations,
      targetTranslations
    );

    const hardcodedStrings = detectHardcodedStrings(code);

    const semanticPairs = buildSemanticPairs(
      sourceTranslations,
      targetTranslations
    );

    const translationSuggestions = await Promise.all(
      missingKeys.map(async (item) => {
        const result = await suggestTranslation(
          item.sourceText,
          "en",
          "fr"
        );

        return {
          key: item.key,
          sourceText: item.sourceText,
          suggestedText: result.translatedText,
          targetLanguage: "fr",
        };
      })
    );

    const semanticIssues: Array<{
      key: string;
      sourceText: string;
      targetText: string;
      reason: string;
    }> = [];

    for (const pair of semanticPairs) {
      const result = await checkSemanticConsistency(
        pair.sourceText,
        pair.targetText,
        "en",
        "fr"
      );

      if (!result.isConsistent) {
        semanticIssues.push({
          key: pair.key,
          sourceText: pair.sourceText,
          targetText: pair.targetText,
          reason:
            result.reason ||
            "The target translation may not preserve the original meaning.",
        });
      }
    }

    return NextResponse.json({
      issues: {
        missingKeys,
        unusedKeys,
        hardcodedStrings,
        semanticIssues,
      },
      suggestions: {
        translations: translationSuggestions,
        semanticFixes: semanticIssues.map((item) => ({
          key: item.key,
          issue: item.reason,
          suggestion: "Review and adjust the translation for accuracy.",
        })),
      },
    });
  } catch (error: any) {
    console.error("Analyze API error:", error);

    return NextResponse.json(
      { error: "Internal server error during analysis." },
      { status: 500 }
    );
  }
}

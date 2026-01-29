"use server";

import { LingoDotDevEngine } from "lingo.dev/sdk";
import type { Locale } from "./i18n";

let engine: LingoDotDevEngine | null = null;

function getEngine() {
  if (engine) return engine;

  const apiKey =
    process.env.LINGO_DOT_DEV_API_KEY ?? process.env.LINGODOTDEV_API_KEY;
  if (!apiKey) {
    throw new Error("Missing Lingo.dev API key");
  }

  engine = new LingoDotDevEngine({
    apiKey,
  });

  return engine;
}

type LingoResponse =
  | string
  | {
      outputText?: string | null;
    };

export async function translateWithLingo(
  text: string,
  targetLocale: Locale,
): Promise<string> {
  if (!text.trim() || targetLocale === "en") {
    return text;
  }

  const sdk = getEngine();
  const result = (await sdk.localizeText(text, {
    sourceLocale: "en",
    targetLocale,
  })) as LingoResponse;

  if (typeof result === "string") {
    return result;
  }

  if (result && typeof result === "object" && "outputText" in result) {
    return result.outputText ?? text;
  }

  throw new Error("Unexpected response from Lingo.dev SDK");
}

"use client";

import { useLingo } from "./context";

export type LingoTextProps = {
  $fileKey: string;
  $entryKey: string;
  $variables?: Record<string, any>;
  $functions?: Record<string, Function>;
  $expressions?: any[];
};

export function LingoText(props: LingoTextProps) {
  const { $fileKey, $entryKey, $variables, $functions, $expressions } = props;
  const lingo = useLingo();

  const translation = getTranslation(
    lingo.dictionary,
    $fileKey,
    $entryKey,
    $variables,
    $functions,
    $expressions
  );

  // Return just the text, no wrapping element
  // This preserves the parent component structure for React.Children APIs
  return <>{translation}</>;
}

function getTranslation(
  dictionary: any,
  fileKey: string,
  entryKey: string,
  variables?: Record<string, any>,
  functions?: Record<string, Function>,
  expressions?: any[]
): string {
  if (!dictionary) return "";

  const entry = dictionary.data?.[fileKey]?.[entryKey];
  if (!entry) return "";

  let text = entry;

  // Replace variables
  if (variables) {
    Object.entries(variables).forEach(([key, value]) => {
      text = text.replace(new RegExp(`\\{${key}\\}`, "g"), String(value));
    });
  }

  // Handle expressions
  if (expressions) {
    expressions.forEach((expr, index) => {
      text = text.replace(`{${index}}`, String(expr));
    });
  }

  return text;
}


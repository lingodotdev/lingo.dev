"use client";

import { useLingo } from "./context";
import { getTranslation } from "../shared/translation-utils";

export type LingoTextProps = {
  $fileKey: string;
  $entryKey: string;
  $variables?: Record<string, any>;
  $functions?: Record<string, Function>;
  $expressions?: any[];
  $elements?: any[];
  children?: React.ReactNode;
};

export function LingoText(props: LingoTextProps) {
  const { $fileKey, $entryKey, $variables, $functions, $expressions, $elements, children } = props;
  const lingo = useLingo();

  const translation = getTranslation(
    lingo.dictionary,
    $fileKey,
    $entryKey,
    $variables,
    $functions,
    $expressions
  );

  // If there are nested elements, we need to preserve them in the translation
  // The translation string contains placeholders like {0}, {1}, etc.
  if ($elements && $elements.length > 0) {
    const parts = translation.split(/(\{\d+\})/g);
    return (
      <>
        {parts.map((part, index) => {
          const match = part.match(/\{(\d+)\}/);
          if (match) {
            const elementIndex = parseInt(match[1], 10);
            return $elements[elementIndex] || null;
          }
          return part;
        })}
      </>
    );
  }

  // Return just the text, no wrapping element
  // This preserves the parent component structure for React.Children APIs
  return <>{translation}</>;
}


export type LingoTextProps = {
  $fileKey: string;
  $entryKey: string;
  $loadDictionary: (locale: string) => Promise<any>;
  $variables?: Record<string, any>;
  $functions?: Record<string, Function>;
  $expressions?: any[];
};

export async function LingoText(props: LingoTextProps) {
  const { $fileKey, $entryKey, $loadDictionary, $variables, $functions, $expressions } = props;

  // Load dictionary on server
  const dictionary = await $loadDictionary("default");

  const translation = getTranslation(
    dictionary,
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


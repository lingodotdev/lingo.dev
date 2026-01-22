export async function translateText(
  text: string,
  targetLang: string
) {
  const response = await fetch("/api/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      targetLang,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Translation API error:", error);
    throw new Error(`Translation failed: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data.translatedText;
}

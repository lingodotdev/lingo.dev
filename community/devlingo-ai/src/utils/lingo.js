export async function translateText(text, targetLang) {
  const API_KEY = import.meta.env.VITE_LINGO_API_KEY;

  const res = await fetch("https://api.lingo.dev/v1/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      text: text,
      target_language: targetLang,
    }),
  });

  const data = await res.json();
  return data?.translated_text || "Oops! Translation failed...";
}

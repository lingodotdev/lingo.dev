import { LingoDotDevEngine } from "lingo.dev/sdk";

const LINGO_API_KEY = "YOUR_LINGO_API_KEY";


const lingo = new LingoDotDevEngine({
  apiKey: LINGO_API_KEY
});

const cache = new Map();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "translateBatch") {
    translateBatch(message.texts, message.sourceLocale, message.targetLocale)
      .then((translations) => sendResponse({ translations }))
      .catch((err) => sendResponse({ error: err.message }));

    return true;
  }
});

async function translateBatch(texts, sourceLocale = "en", targetLocale = "es") {
  if (!LINGO_API_KEY || LINGO_API_KEY === "YOUR_LINGO_API_KEY") {
    throw new Error("Missing Lingo.dev API key in background.js");
  }

  const result = new Array(texts.length);
  const toTranslate = [];
  const indexMap = [];

  for (let i = 0; i < texts.length; i++) {
    const key = `${texts[i]}__${sourceLocale}__${targetLocale}`;
    if (cache.has(key)) {
      result[i] = cache.get(key);
    } else {
      toTranslate.push(texts[i]);
      indexMap.push(i);
    }
  }

  if (toTranslate.length === 0) return result;

  const contentObject = {};
  toTranslate.forEach((t, i) => {
    contentObject[`t_${i}`] = t;
  });

  const translatedObject = await lingo.localizeObject(contentObject, {
    sourceLocale,
    targetLocale
  });

  toTranslate.forEach((originalText, i) => {
    const translatedText = translatedObject[`t_${i}`] || originalText;
    const originalIndex = indexMap[i];

    result[originalIndex] = translatedText;

    const key = `${originalText}__${sourceLocale}__${targetLocale}`;
    cache.set(key, translatedText);
  });

  return result;
}

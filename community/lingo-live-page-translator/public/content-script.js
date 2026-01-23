const translationMap = new Map();
let isTranslating = false;

const SKIP_TAGS = new Set([
  "SCRIPT", "STYLE", "CODE", "PRE", "NOSCRIPT",
  "TEXTAREA", "INPUT", "SVG", "CANVAS", "IFRAME"
]);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "translatePage") {
    translatePage(message.targetLocale)
      .then(() => sendResponse({ success: true }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true;
  }

  if (message.action === "restoreOriginal") {
    restoreOriginal();
    sendResponse({ success: true });
    return true;
  }
});

async function translatePage(targetLocale) {
  if (isTranslating) throw new Error("Translation already running");
  isTranslating = true;

  try {
    const nodes = extractTextNodes(document.body);

    const texts = [];
    const mapNodes = [];

    for (const node of nodes) {
      const text = node.textContent.trim();
      if (shouldTranslate(text)) {
        texts.push(text);
        mapNodes.push(node);
      }
    }

    if (texts.length === 0) throw new Error("No text found to translate");

    const batchSize = 20;
    let translatedAll = [];

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);

      const res = await chrome.runtime.sendMessage({
        action: "translateBatch",
        texts: batch,
        sourceLocale: "en",
        targetLocale
      });

      if (res.error) throw new Error(res.error);

      translatedAll.push(...res.translations);
    }

    for (let i = 0; i < mapNodes.length; i++) {
      const node = mapNodes[i];
      const original = texts[i];
      const translated = translatedAll[i];

      if (translated && translated !== original) {
        translationMap.set(node, original);
        node.textContent = translated;
      }
    }
  } finally {
    isTranslating = false;
  }
}

function extractTextNodes(root) {
  const textNodes = [];
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
        if (SKIP_TAGS.has(node.parentElement?.tagName)) return NodeFilter.FILTER_REJECT;
        if (translationMap.has(node)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  let node;
  while ((node = walker.nextNode())) textNodes.push(node);
  return textNodes;
}

function shouldTranslate(text) {
  if (!text || text.length < 2) return false;
  if (/^https?:\/\//.test(text)) return false;
  if (/^\d+$/.test(text)) return false;
  return true;
}

function restoreOriginal() {
  for (const [node, original] of translationMap.entries()) {
    if (node.parentElement) node.textContent = original;
  }
  translationMap.clear();
}

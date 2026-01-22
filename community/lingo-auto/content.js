// Content script for extracting and replacing text nodes on the page

// Prevent multiple injections
if (window.lingoTranslatorLoaded) {
  console.log('Lingo translator content script already loaded');
} else {
  window.lingoTranslatorLoaded = true;

  // Listen for translation request from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'translate') {
      translatePage(request.targetLanguage, request.apiKey, request.apiEndpoint)
        .then(() => {
          sendResponse({ success: true });
        })
        .catch((error) => {
          console.error('Translation error in content script:', error);
          sendResponse({ success: false, error: error.message });
        });
      return true; // Keep message channel open for async response
    }
    return false;
  });

  console.log('Lingo Page Translator content script loaded');
}

/**
 * Main translation function
 */
async function translatePage(targetLanguage, apiKey, apiEndpoint) {
  try {
    // Extract visible text nodes
    const textNodes = extractVisibleTextNodes();
    
    if (textNodes.length === 0) {
      console.log('No visible text nodes found');
      throw new Error('No visible text found on this page');
    }

    console.log(`Found ${textNodes.length} text nodes to translate`);

    // Chunk text nodes into segments
    const chunks = chunkTextNodes(textNodes);
    console.log(`Created ${chunks.length} chunks for translation`);

    if (chunks.length === 0) {
      throw new Error('No text chunks to translate');
    }

    // Track translation progress
    let successCount = 0;
    let failCount = 0;
    const errors = [];

    // Translate each chunk
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      try {
        console.log(`Translating chunk ${i + 1}/${chunks.length}...`);
        const translatedText = await translateText(chunk.text, targetLanguage, apiKey, apiEndpoint);
        
        // Replace text in each node of the chunk
        chunk.nodes.forEach(node => {
          if (node.nodeValue !== null) {
            node.nodeValue = translatedText;
          }
        });
        successCount++;
      } catch (error) {
        console.error(`Error translating chunk ${i + 1}:`, error);
        failCount++;
        errors.push(`Chunk ${i + 1}: ${error.message}`);
        // Continue with other chunks even if one fails
      }
    }

    console.log(`Translation complete: ${successCount} succeeded, ${failCount} failed`);

    // If all chunks failed, throw an error
    if (failCount === chunks.length) {
      throw new Error(`All translation chunks failed. First error: ${errors[0] || 'Unknown error'}`);
    }

    // If some chunks failed, log a warning but don't throw
    if (failCount > 0) {
      console.warn(`Translation partially completed: ${successCount}/${chunks.length} chunks succeeded`);
      throw new Error(`Translation partially failed: ${successCount}/${chunks.length} chunks succeeded. Errors: ${errors.slice(0, 3).join('; ')}`);
    }
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}

/**
 * Extract all visible text nodes from the page
 * Ignores scripts, styles, hidden elements, inputs, and textareas
 */
function extractVisibleTextNodes() {
  const textNodes = [];
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        // Skip if parent is script, style, or other non-text elements
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;

        const tagName = parent.tagName.toLowerCase();
        
        // Skip script, style, noscript, meta, link, etc.
        if (['script', 'style', 'noscript', 'meta', 'link', 'head'].includes(tagName)) {
          return NodeFilter.FILTER_REJECT;
        }

        // Skip input, textarea, and other form elements
        if (['input', 'textarea', 'button', 'select', 'option'].includes(tagName)) {
          return NodeFilter.FILTER_REJECT;
        }

        // Skip hidden elements
        const style = window.getComputedStyle(parent);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
          return NodeFilter.FILTER_REJECT;
        }

        // Skip empty or whitespace-only text nodes
        const text = node.textContent.trim();
        if (!text || text.length === 0) {
          return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  let node;
  while (node = walker.nextNode()) {
    textNodes.push(node);
  }

  return textNodes;
}

/**
 * Chunk text nodes into segments for translation
 * Groups nodes by sentences or paragraphs
 */
function chunkTextNodes(textNodes) {
  const chunks = [];
  const maxChunkSize = 500; // Maximum characters per chunk
  let currentChunk = { text: '', nodes: [] };

  for (const node of textNodes) {
    const text = node.textContent.trim();
    
    // If adding this node would exceed max size, start a new chunk
    if (currentChunk.text.length + text.length > maxChunkSize && currentChunk.nodes.length > 0) {
      chunks.push(currentChunk);
      currentChunk = { text: '', nodes: [] };
    }

    // Add node to current chunk
    currentChunk.text += (currentChunk.text ? ' ' : '') + text;
    currentChunk.nodes.push(node);
  }

  // Add the last chunk if it has content
  if (currentChunk.nodes.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
}

/**
 * Send translation request to background script
 */
async function translateText(text, targetLanguage, apiKey, apiEndpoint) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        action: 'translateText',
        text,
        targetLanguage,
        apiKey,
        apiEndpoint
      },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }

        if (response && response.success) {
          resolve(response.translatedText);
        } else {
          reject(new Error(response?.error || 'Translation failed'));
        }
      }
    );
  });
}

// Popup UI handler for Lingo Page Translator

document.addEventListener('DOMContentLoaded', async () => {
  const targetLanguageSelect = document.getElementById('targetLanguage');
  const apiKeyInput = document.getElementById('apiKey');
  const apiEndpointInput = document.getElementById('apiEndpoint');
  const translateBtn = document.getElementById('translateBtn');
  const statusDiv = document.getElementById('status');

  // Load saved settings
  const result = await chrome.storage.local.get(['apiKey', 'targetLanguage', 'apiEndpoint']);
  if (result.apiKey) {
    apiKeyInput.value = result.apiKey;
  }
  if (result.targetLanguage) {
    targetLanguageSelect.value = result.targetLanguage;
  }
  if (result.apiEndpoint) {
    apiEndpointInput.value = result.apiEndpoint;
  } else {
    // Set default endpoint
    apiEndpointInput.value = 'https://api.lingo.dev/v1/translate';
  }

  // Save API key when it changes
  apiKeyInput.addEventListener('blur', async () => {
    const apiKey = apiKeyInput.value.trim();
    if (apiKey) {
      await chrome.storage.local.set({ apiKey });
      showStatus('API key saved', 'success');
    }
  });

  // Save language selection when it changes
  targetLanguageSelect.addEventListener('change', async () => {
    await chrome.storage.local.set({ targetLanguage: targetLanguageSelect.value });
  });

  // Save API endpoint when it changes
  apiEndpointInput.addEventListener('blur', async () => {
    const apiEndpoint = apiEndpointInput.value.trim();
    if (apiEndpoint) {
      await chrome.storage.local.set({ apiEndpoint });
    }
  });

  // Handle translate button click
  translateBtn.addEventListener('click', async () => {
    const apiKey = apiKeyInput.value.trim();
    const targetLanguage = targetLanguageSelect.value;
    const apiEndpoint = apiEndpointInput.value.trim() || 'https://api.lingo.dev/v1/translate';

    if (!apiKey) {
      showStatus('Please enter your API key', 'error');
      return;
    }

    // Save settings
    await chrome.storage.local.set({ apiKey, targetLanguage, apiEndpoint });

    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) {
      showStatus('No active tab found', 'error');
      return;
    }

    // Check if page URL supports content scripts
    const url = tab.url || '';
    if (url.startsWith('chrome://') || url.startsWith('chrome-extension://') || 
        url.startsWith('edge://') || url.startsWith('about:') || 
        url.startsWith('moz-extension://')) {
      showStatus('Cannot translate this page type', 'error');
      return;
    }

    // Disable button and show status
    translateBtn.disabled = true;
    showStatus('Translating page...', 'info');

    try {
      // Try to send message first (content script might already be loaded)
      let response;
      try {
        response = await chrome.tabs.sendMessage(tab.id, {
          action: 'translate',
          targetLanguage,
          apiKey,
          apiEndpoint
        });
      } catch (messageError) {
        // If message fails, try to inject the content script
        if (messageError.message.includes('Could not establish connection') || 
            messageError.message.includes('Receiving end does not exist')) {
          console.log('Content script not found, injecting...');
          try {
            await chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: ['content.js']
            });
            // Wait a bit for the script to initialize
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // Try sending message again
            response = await chrome.tabs.sendMessage(tab.id, {
              action: 'translate',
              targetLanguage,
              apiKey,
              apiEndpoint
            });
          } catch (injectError) {
            throw new Error('Could not inject content script: ' + injectError.message);
          }
        } else {
          throw messageError;
        }
      }

      // Wait a moment for translation to process
      await new Promise(resolve => setTimeout(resolve, 500));

      if (response && response.success) {
        showStatus('Translation completed successfully!', 'success');
        
        // Close popup after a delay
        setTimeout(() => {
          window.close();
        }, 2000);
      } else {
        const errorMsg = response?.error || 'Translation failed';
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('Translation error:', error);
      
      // Check if it's a connection error
      if (error.message.includes('Could not establish connection') || 
          error.message.includes('Receiving end does not exist')) {
        showStatus('Error: Content script not available. Try refreshing the page.', 'error');
      } else {
        showStatus('Error: ' + error.message, 'error');
      }
      translateBtn.disabled = false;
    }
  });

  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    
    if (type === 'success' || type === 'info') {
      setTimeout(() => {
        statusDiv.textContent = '';
        statusDiv.className = 'status';
      }, 3000);
    }
  }
});
